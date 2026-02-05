import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qijbkikzcvpaqztlitbj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpamJraWt6Y3ZwYXF6dGxpdGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDY1NjUsImV4cCI6MjA4NTgyMjU2NX0.Rs9krARbvjUrh2iCl4Koh0Td03EeJLbgQQ7aGJwDXSw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testInsert() {
  console.log('🔍 Testing Supabase connection...');
  
  // Get TrendWatcher project ID
  const { data: projects } = await supabase.from('projects').select('id').eq('slug', 'trendwatcher');
  const projectId = projects[0]?.id;

  if (!projectId) {
    console.log('❌ No TrendWatcher project found!');
    console.log('Run the INSERT SQL first in Supabase SQL Editor');
    return;
  }

  console.log('✅ Found project ID:', projectId);

  // Insert a test card
  const { data: card, error } = await supabase
    .from('cards')
    .insert({
      title: 'TEST CARD - CLI Test',
      description: 'Created via command line to test Supabase connection',
      project_id: projectId,
      status: 'idea',
      priority: 'medium',
      position: 100
    })
    .select()
    .single();

  if (error) {
    console.log('❌ ERROR inserting card:', error.message);
    console.log('Full error:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ SUCCESS! Card created:');
    console.log(JSON.stringify(card, null, 2));
  }
}

testInsert();
