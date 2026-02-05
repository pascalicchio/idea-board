import { NextRequest, NextResponse } from 'next/server';
import { getCards, createCard, updateCard, deleteCard, getProjects } from '@/lib/db';

export async function GET() {
  try {
    const [projects, cards] = await Promise.all([
      getProjects(),
      getCards()
    ]);
    
    return NextResponse.json({ projects, cards });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, project_id, priority } = body;
    
    if (!title || !project_id) {
      return NextResponse.json(
        { error: 'Title and project_id are required' },
        { status: 400 }
      );
    }
    
    const card = await createCard({
      title,
      description,
      project_id,
      priority: priority || 'medium',
      status: 'idea'
    });
    
    if (!card) {
      return NextResponse.json(
        { error: 'Failed to create card' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ card });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }
    
    const success = await updateCard(id, updates);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update card' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }
    
    const success = await deleteCard(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete card' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}
