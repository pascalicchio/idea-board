// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper types
export interface Project {
  id: string;
  slug: string;
  name: string;
  color: string;
  icon: string;
}

export interface Card {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  project?: Project;
  status: 'idea' | 'todo' | 'in-progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  position: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  votes: number;
}

export interface Vote {
  id: string;
  card_id: string;
  voter_ip: string;
  created_at: string;
}

export interface Comment {
  id: string;
  card_id: string;
  author: string;
  content: string;
  created_at: string;
}

// Fetch all projects
export async function getProjects(): Promise<Project[]> {
  if (!supabase) return getMockProjects();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('Error fetching projects:', error);
    return getMockProjects();
  }
  
  return data || [];
}

// Fetch all cards
export async function getCards(): Promise<Card[]> {
  if (!supabase) return getMockCards();
  
  const { data, error } = await supabase
    .from('cards')
    .select(`
      *,
      project:projects(*)
    `)
    .order('position');
  
  if (error) {
    console.error('Error fetching cards:', error);
    return getMockCards();
  }
  
  return data || [];
}

// Create a new card
export async function createCard(card: {
  title: string;
  description?: string;
  project_id: string;
  priority?: string;
  status?: string;
}): Promise<Card | null> {
  if (!supabase) {
    const mockCard = {
      id: Date.now().toString(),
      ...card,
      status: card.status || 'idea',
      priority: card.priority || 'medium',
      position: Math.random() * 100,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      votes: 0
    };
    return mockCard as Card;
  }
  
  const { data, error } = await supabase
    .from('cards')
    .insert(card)
    .select(`*, project:projects(*)`)
    .single();
  
  if (error) {
    console.error('Error creating card:', error);
    return null;
  }
  
  return data;
}

// Update card status/position
export async function updateCard(id: string, updates: Partial<Card>): Promise<boolean> {
  if (!supabase) return true;
  
  const { error } = await supabase
    .from('cards')
    .update(updates)
    .eq('id', id);
  
  return !error;
}

// Delete a card
export async function deleteCard(id: string): Promise<boolean> {
  if (!supabase) return true;
  
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id);
  
  return !error;
}

// Vote on a card
export async function voteCard(cardId: string, voterIp: string): Promise<boolean> {
  if (!supabase) return true;
  
  const { error } = await supabase
    .from('votes')
    .insert({ card_id: cardId, voter_ip: voterIp });
  
  // If already voted, ignore
  if (error?.message?.includes('duplicate key')) return true;
  if (error) {
    console.error('Error voting:', error);
    return false;
  }
  
  return true;
}

// Get vote count for a card
export async function getVoteCount(cardId: string): Promise<number> {
  if (!supabase) return 0;
  
  const { count, error } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('card_id', cardId);
  
  return count || 0;
}

// Subscribe to real-time updates
export function subscribeToCards(callback: (payload: any) => void) {
  if (!supabase) return { unsubscribe: () => {} };
  
  return supabase
    .channel('cards-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'cards' },
      callback
    )
    .subscribe();
}

// Get comments for a card
export async function getComments(cardId: string): Promise<Comment[]> {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at');
  
  if (error) return [];
  return data || [];
}

// Add a comment
export async function addComment(cardId: string, author: string, content: string): Promise<Comment | null> {
  if (!supabase) {
    return {
      id: Date.now().toString(),
      card_id: cardId,
      author,
      content,
      created_at: new Date().toISOString()
    };
  }
  
  const { data, error } = await supabase
    .from('comments')
    .insert({ card_id: cardId, author, content })
    .select()
    .single();
  
  return error ? null : data;
}

// Mock data for development
function getMockProjects(): Project[] {
  return [
    { id: '1', slug: 'trendwatcher', name: 'TrendWatcher', color: '#8B5CF6', icon: '📈' },
    { id: '2', slug: 'hackerstack', name: 'HackerStack', color: '#00C9FF', icon: '🛠️' },
    { id: '3', slug: 'autonomous', name: 'Autonomous Agent', color: '#EC4899', icon: '🤖' },
    { id: '4', slug: 'calm', name: 'Calm Under Pressure', color: '#22C55E', icon: '👕' },
    { id: '5', slug: 'general', name: 'General', color: '#71717A', icon: '📝' }
  ];
}

function getMockCards(): Card[] {
  const projects = getMockProjects();
  return [
    {
      id: '1',
      title: 'Add Amazon Movers API',
      description: 'Integrate real Amazon product data',
      project_id: projects[0].id,
      project: projects[0],
      status: 'in-progress',
      priority: 'high',
      position: 0,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      votes: 5
    },
    {
      id: '2',
      title: 'Create 20 blog posts for HackerStack',
      description: 'Content calendar for SEO',
      project_id: projects[1].id,
      project: projects[1],
      status: 'todo',
      priority: 'medium',
      position: 1,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      votes: 3
    },
    {
      id: '3',
      title: 'Reach 1000 Bluesky followers',
      description: 'Growth milestone for autonomous agent',
      project_id: projects[2].id,
      project: projects[2],
      status: 'todo',
      priority: 'high',
      position: 2,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      votes: 8
    },
    {
      id: '4',
      title: 'Set up Stripe payments',
      description: 'Enable paid subscriptions',
      project_id: projects[0].id,
      project: projects[0],
      status: 'idea',
      priority: 'high',
      position: 3,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      votes: 4
    },
    {
      id: '5',
      title: 'Design product mockups',
      description: 'T-shirt designs for Calm Under Pressure',
      project_id: projects[3].id,
      project: projects[3],
      status: 'idea',
      priority: 'medium',
      position: 4,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      votes: 2
    },
    {
      id: '6',
      title: 'Fix subscription display bug',
      description: 'Frontend caching issue in dashboard',
      project_id: projects[0].id,
      project: projects[0],
      status: 'done',
      priority: 'high',
      position: 5,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      votes: 6
    },
    {
      id: '7',
      title: 'Schedule 35 posts/week',
      description: 'Social media automation crontab',
      project_id: projects[2].id,
      project: projects[2],
      status: 'done',
      priority: 'high',
      position: 6,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      votes: 7
    }
  ];
}
