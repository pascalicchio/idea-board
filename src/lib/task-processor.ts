// Task Processor - Automatically handles new tasks based on keywords
import { Card, Project } from './db';

// Keyword handlers map patterns to actions
const HANDLERS: Record<string, (card: Card, project: Project) => Promise<string>> = {
  // Social Media
  'post': async (card) => {
    const content = card.title.replace(/^(Post to|Post on|New post:|Create post:)\s*/i, '');
    // Would trigger social media posting
    return `📤 Would post to X/Bluesky: "${content}"`;
  },
  
  // Deployment
  'deploy': async (card) => {
    const project = card.title.replace(/^(Deploy:|Deploy to:|Deploy)\s*/i, '');
    // Would trigger Vercel deployment
    return `🚀 Would deploy: ${project}`;
  },
  
  // Blog Posts
  'blog': async (card) => {
    const topic = card.title.replace(/^(Blog:|Write blog:|Create blog post:|New blog:)\s*/i, '');
    // Would generate blog post
    return `✍️ Would write blog post about: ${topic}`;
  },
  
  // Analysis
  'analyze': async (card) => {
    const target = card.title.replace(/^(Analyze:|Analysis:|Run analysis:|Check)\s*/i, '');
    // Would run analysis
    return `📊 Would analyze: ${target}`;
  },
  
  // Create content
  'create': async (card) => {
    const what = card.title.replace(/^(Create:|Make|New:)\s*/i, '');
    return `🎨 Would create: ${what}`;
  },
  
  // Fix bugs
  'fix': async (card) => {
    const bug = card.title.replace(/^(Fix:|Bug:|Repair:|Solve)\s*/i, '');
    return `🐛 Would fix: ${bug}`;
  },
  
  // Research
  'research': async (card) => {
    const topic = card.title.replace(/^(Research:|Look up:|Find info:|Search)\s*/i, '');
    return `🔍 Would research: ${topic}`;
  },
  
  // Schedule
  'schedule': async (card) => {
    const what = card.title.replace(/^(Schedule:|Set up cron:|Create cron:)\s*/i, '');
    return `⏰ Would schedule: ${what}`;
  },
  
  // API Integration
  'integrate': async (card) => {
    const api = card.title.replace(/^(Integrate:|Add API:|Connect:)\s*/i, '');
    return `🔗 Would integrate: ${api}`;
  }
};

// Process a new card - returns what actions would be taken
export async function processNewCard(card: Card, project: Project): Promise<{
  actions: string[];
  shouldAutoProcess: boolean;
}> {
  const title = card.title.toLowerCase();
  const actions: string[] = [];
  
  // Check for keywords
  for (const [keyword, handler] of Object.entries(HANDLERS)) {
    if (title.includes(keyword)) {
      const result = await handler(card, project);
      actions.push(result);
    }
  }
  
  // Default action if no keywords matched
  if (actions.length === 0) {
    actions.push(`📝 New task noted: "${card.title}"`);
    actions.push(`📁 Filed under: ${project.name}`);
  }
  
  // Auto-process if in specific columns
  const shouldAutoProcess = ['todo', 'in-progress'].includes(card.status);
  
  return { actions, shouldAutoProcess };
}

// Run automation check - called when new cards are detected
export async function runAutomation(card: Card, project: Project): Promise<string[]> {
  const { actions } = await processNewCard(card, project);
  return actions;
}

// Parse task title for structured data
export function parseTaskTitle(title: string): {
  action: string;
  target: string;
  context: string;
} {
  const patterns = [
    /^(\w+)\s+(?:to|for|on|in)\s+(.+)/,  // "Post to X"
    /^(\w+):\s*(.+)/,                     // "Post: X"
    /^(?:Create|New|Make)\s+(.+)/,        // "Create X"
    /^(?:Fix|Solve|Repair)\s+(.+)/        // "Fix X"
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return {
        action: match[1],
        target: match[2],
        context: 'general'
      };
    }
  }
  
  return {
    action: 'task',
    target: title,
    context: 'general'
  };
}

// Suggest next actions based on task type
export function suggestNextActions(card: Card): string[] {
  const title = card.title.toLowerCase();
  const suggestions: string[] = [];
  
  if (title.includes('post') || title.includes('social')) {
    suggestions.push('Draft content');
    suggestions.push('Schedule posting time');
    suggestions.push('Create engagement hooks');
  }
  
  if (title.includes('deploy') || title.includes('launch')) {
    suggestions.push('Run build');
    suggestions.push('Test in staging');
    suggestions.push('Monitor deployment');
  }
  
  if (title.includes('blog') || title.includes('content')) {
    suggestions.push('Outline structure');
    suggestions.push('Add SEO keywords');
    suggestions.push('Create featured image');
  }
  
  if (title.includes('fix') || title.includes('bug') || title.includes('error')) {
    suggestions.push('Reproduce issue');
    suggestions.push('Identify root cause');
    suggestions.push('Write test');
    suggestions.push('Deploy fix');
  }
  
  if (title.includes('api') || title.includes('integrate')) {
    suggestions.push('Review documentation');
    suggestions.push('Set up credentials');
    suggestions.push('Write integration tests');
  }
  
  return suggestions.length > 0 ? suggestions : ['Start working on task'];
}
