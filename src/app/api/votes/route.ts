import { NextRequest, NextResponse } from 'next/server';
import { voteCard, getVoteCount, getComments, addComment } from '@/lib/db';

// GET - Get vote count
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('card_id');
    const action = searchParams.get('action');
    
    if (action === 'comments' && cardId) {
      const comments = await getComments(cardId);
      return NextResponse.json({ comments });
    }
    
    if (cardId) {
      const count = await getVoteCount(cardId);
      return NextResponse.json({ count });
    }
    
    return NextResponse.json({ error: 'card_id required' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

// POST - Vote or add comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { card_id, action, author, content } = body;
    
    if (!card_id) {
      return NextResponse.json({ error: 'card_id required' }, { status: 400 });
    }
    
    // Get client IP for vote deduplication
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'anonymous';
    
    if (action === 'vote') {
      const success = await voteCard(card_id, ip);
      return NextResponse.json({ success });
    }
    
    if (action === 'comment' && author && content) {
      const comment = await addComment(card_id, author, content);
      return NextResponse.json({ comment });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
