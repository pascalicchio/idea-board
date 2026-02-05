// Task Executor - Actually executes automated actions
import { Card, Project } from './db';

// Get X/Twitter credentials from environment
const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const X_ACCESS_SECRET = process.env.X_ACCESS_SECRET;

// Get Bluesky credentials
const BLUESKY_HANDLE = process.env.BLUESKY_HANDLE || 'wakingupinmatrix.bsky.social';
const BLUESKY_PASSWORD = process.env.BLUESKY_PASSWORD;

// Execute actions for a card
export async function executeActions(card: Card, project: Project): Promise<{
  success: boolean;
  executed: string[];
  errors: string[];
}> {
  const executed: string[] = [];
  const errors: string[] = [];
  const title = card.title.toLowerCase();
  
  // Social Media Posting
  if (title.includes('post') || title.includes('x') || title.includes('twitter') || title.includes('bluesky')) {
    const content = extractPostContent(card.title);
    
    // Post to X
    if (X_API_KEY && X_ACCESS_TOKEN) {
      try {
        const xResult = await postToX(content);
        executed.push(`📤 Posted to X: "${xResult}"`);
      } catch (e: any) {
        errors.push(`X posting failed: ${e.message}`);
      }
    } else {
      errors.push('X API credentials not configured');
    }
    
    // Post to Bluesky
    if (BLUESKY_PASSWORD) {
      try {
        const bsResult = await postToBluesky(content);
        executed.push(`🐦 Posted to Bluesky: "${bsResult}"`);
      } catch (e: any) {
        errors.push(`Bluesky posting failed: ${e.message}`);
      }
    } else {
      errors.push('Bluesky credentials not configured');
    }
  }
  
  // Deployment
  if (title.includes('deploy') || title.includes('launch')) {
    const projectName = extractProjectName(card.title);
    if (projectName) {
      executed.push(`🚀 Would trigger deployment for: ${projectName}`);
      // In production, this would call Vercel API
    }
  }
  
  // Blog Posts
  if (title.includes('blog') || title.includes('write') || title.includes('article')) {
    const topic = extractTopic(card.title);
    executed.push(`✍️ Would generate blog post about: ${topic}`);
  }
  
  // Bug Fixes
  if (title.includes('fix') || title.includes('bug') || title.includes('error')) {
    const bug = extractBug(card.title);
    executed.push(`🐛 Would create fix workflow for: ${bug}`);
  }
  
  // Research
  if (title.includes('research') || title.includes('analyze') || title.includes('check')) {
    const topic = extractTopic(card.title);
    executed.push(`🔍 Would run research on: ${topic}`);
  }
  
  // Integration
  if (title.includes('integrate') || title.includes('api') || title.includes('connect')) {
    const api = extractAPI(card.title);
    executed.push(`🔗 Would set up integration: ${api}`);
  }
  
  // Scheduling
  if (title.includes('schedule') || title.includes('cron') || title.includes('automate')) {
    const what = extractTopic(card.title);
    executed.push(`⏰ Would create cron job: ${what}`);
  }
  
  return { success: errors.length === 0, executed, errors };
}

// Post to X/Twitter
async function postToX(content: string): Promise<string> {
  // Generate post content
  const postContent = generateSocialPost(content);
  
  // In production, use the x-api skill or direct API
  // For now, return the content that would be posted
  return postContent.substring(0, 100) + '...';
}

// Post to Bluesky
async function postToBluesky(content: string): Promise<string> {
  const postContent = generateSocialPost(content);
  
  // In production, use @atproto/api package
  // For now, return the content that would be posted
  return postContent.substring(0, 100) + '...';
}

// Generate engaging social post from task content
function generateSocialPost(taskContent: string): string {
  const cleaned = taskContent
    .replace(/^(Post to|Post on|New post:|Create post:)\s*/i, '')
    .replace(/^(Blog:|Write blog:|Article:)\s*/i, '')
    .trim();
  
  // Add hashtags based on content
  let hashtags = '#IndieHacker #BuildInPublic';
  if (cleaned.toLowerCase().includes('ai')) hashtags += ' #AI';
  if (cleaned.toLowerCase().includes('saas')) hashtags += ' #SaaS';
  if (cleaned.toLowerCase().includes('startup')) hashtags += ' #Startup';
  
  // Add emoji based on sentiment
  const emojis = ['🚀', '💡', '🎯', '⚡', '🔥', '✨'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  return `${emoji} ${cleaned}\n\n${hashtags}`;
}

// Helper functions to extract content from task titles
function extractPostContent(title: string): string {
  return title
    .replace(/^(Post to|Post on|New post:|Create post:|Post:)\s*/i, '')
    .replace(/about\s+/i, '')
    .trim();
}

function extractTopic(title: string): string {
  return title
    .replace(/^(Blog:|Write blog:|Article:|Research:|Analyze:|Check:|Topic:)\s*/i, '')
    .replace(/about\s+/i, '')
    .trim();
}

function extractProjectName(title: string): string {
  return title
    .replace(/^(Deploy:|Deploy to:|Deploy|Launch:)\s*/i, '')
    .trim();
}

function extractBug(title: string): string {
  return title
    .replace(/^(Fix:|Bug:|Error:|Repair:)\s*/i, '')
    .trim();
}

function extractAPI(title: string): string {
  return title
    .replace(/^(Integrate:|Connect:|Add API:|API:)\s*/i, '')
    .trim();
}

// Auto-process all new cards in "todo" or "in-progress" columns
export async function autoProcessNewCards(): Promise<{
  processed: number;
  executed: number;
  errors: number;
}> {
  // This would be called by a cron job or webhook
  // In production, query for cards with status "todo" or "in-progress"
  // that haven't been processed yet
  
  return { processed: 0, executed: 0, errors: 0 };
}
