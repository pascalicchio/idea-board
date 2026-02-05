import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { executeActions } from '@/lib/task-executor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { card_id, action } = body;
    
    if (action === 'process' && card_id) {
      if (!supabase) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
      }
      
      // Get the card with project info
      const { data: card, error: cardError } = await supabase
        .from('cards')
        .select(`*, project:projects(*)`)
        .eq('id', card_id)
        .single();
      
      if (cardError || !card) {
        return NextResponse.json({ error: 'Card not found' }, { status: 404 });
      }
      
      // Execute the actions!
      const { success, executed, errors } = await executeActions(card, card.project);
      
      // Update card status to "in-progress" if it was "idea"
      if (card.status === 'idea') {
        await supabase
          .from('cards')
          .update({ status: 'in-progress' })
          .eq('id', card_id);
      }
      
      // Generate response message
      let message = '';
      if (executed.length > 0) {
        message = `✅ Successfully executed ${executed.length} action(s):\n\n${executed.join('\n')}`;
      } else {
        message = '📝 Task noted. No automatic actions available for this type.';
      }
      
      if (errors.length > 0) {
        message += `\n\n⚠️ Warnings:\n${errors.join('\n')}`;
      }
      
      return NextResponse.json({ 
        success,
        card,
        executed,
        errors,
        message,
        tip: 'Tip: Add keywords like "post", "deploy", "blog", "fix", "research" to trigger automatic actions!'
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Process error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
