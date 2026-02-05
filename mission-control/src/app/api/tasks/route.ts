import { NextRequest, NextResponse } from 'next/server';

// In-memory task storage (use Supabase in production)
const tasks: any[] = [];

export async function GET() {
  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();
    
    if (!title) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 });
    }

    const task = {
      id: Date.now().toString(),
      title,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    tasks.unshift(task);

    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  } else {
    tasks.length = 0; // Clear all
  }

  return NextResponse.json({ success: true });
}
