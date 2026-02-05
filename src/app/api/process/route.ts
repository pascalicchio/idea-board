import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { processNewCard } from '@/lib/task-processor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { card_id, action } = body;
    
    if (action === 'process' && card_id) {
      // Get the card with project info
      const { data: cards, error: cardError } = await supabase
        .from('cards')
        .select(`*, project:projects(*)`)
        .eq('id', card_id)
        .single();
      
      if (cardError || !cards) {
        return NextResponse.json({ error: 'Card not found' }, { status: 404 });
      }
      
      // Process the card
      const { actions } = await processNewCard(cards, cards.project);
      
      // Update card status to "in-progress"
      await supabase
        .from('cards')
        .update({ status: 'in-progress' })
        .eq('id', card_id);
      
      return NextResponse.json({ 
        success: true, 
        card: cards,
        actions,
        message: `Found ${actions.length} automated actions for this task`
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Process error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
