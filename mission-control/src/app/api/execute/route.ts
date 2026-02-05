import { NextRequest, NextResponse } from 'next/server';

// Task execution engine
// Detects keywords and simulates execution

const KEYWORD_HANDLERS: Record<string, (task: string) => Promise<string>> = {
  // Research tasks
  research: async (task) => {
    const topic = task.replace(/^(research|analyze|check|look up|find)\s+/i, '');
    return `🔍 Research complete on "${topic}":\n\nFound 5 relevant sources. Key insights synthesized and ready for review.`;
  },
  
  // Post to social media
  post: async (task) => {
    const content = task.replace(/^(post|post to|tweet|share)\s+(?:on\s+)?(?:x|twitter|bluesky)?\s*/i, '');
    return `🐦 Posted to social media:\n\n"${content}"\n\n#IndieHacker #BuildInPublic`;
  },
  
  // Blog/content
  blog: async (task) => {
    const topic = task.replace(/^(write|create|blog|article)\s+(?:post\s+)?(?:about\s+)?/i, '');
    return `✍️ Blog post drafted: "${topic}"\n\nSEO-optimized, 800 words, includesCTA. Ready for review.`;
  },
  
  // Code/build
  build: async (task) => {
    const what = task.replace(/^(build|create|make|coding)\s+/i, '');
    return `💻 Built "${what}":\n\nCode generated, tested, and deployed. Check repository for details.`;
  },
  
  // Fix/debug
  fix: async (task) => {
    const bug = task.replace(/^(fix|debug|repair|solve)\s+/i, '');
    return `🐛 Fixed "${bug}":\n\nRoot cause identified, patch applied, tests passing.`;
  },
  
  // Deploy
  deploy: async (task) => {
    const what = task.replace(/^(deploy|launch|release)\s+/i, '');
    return `🚀 Deployed "${what}":\n\nLive at production URL. Monitor active.`;
  },
  
  // Schedule
  schedule: async (task) => {
    const what = task.replace(/^(schedule|set up|cron|automate)\s+/i, '');
    return `⏰ Scheduled: "${what}"\n\nCron job created. Will execute at specified intervals.`;
  },
  
  // Integrate
  integrate: async (task) => {
    const api = task.replace(/^(integrate|connect|add api)\s+/i, '');
    return `🔗 Integration complete: "${api}"\n\nAPI connected, authentication configured, endpoints tested.`;
  },
  
  // Analyze
  analyze: async (task) => {
    const what = task.replace(/^(analyze|analysis)\s+/i, '');
    return `📊 Analysis complete: "${what}"\n\nKey metrics identified, trends mapped, recommendations provided.`;
  },
  
  // General task
  default: async (task) => {
    return `✅ Task completed: "${task}"\n\nExecuted successfully. Results available for review.`;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { task, taskId } = await request.json();

    if (!task) {
      return NextResponse.json({ error: 'Task required' }, { status: 400 });
    }

    console.log(`[Mission Control] Executing task: ${task}`);

    // Detect keyword and route to handler
    const taskLower = task.toLowerCase();
    let handler = KEYWORD_HANDLERS.default;
    let matched = false;

    for (const [keyword, handlerFn] of Object.entries(KEYWORD_HANDLERS)) {
      if (taskLower.includes(keyword) && keyword !== 'default') {
        handler = handlerFn;
        matched = true;
        break;
      }
    }

    // Simulate execution (in production, this would be real work)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = await handler(task);

    console.log(`[Mission Control] Task complete: ${taskId}`);

    return NextResponse.json({
      success: true,
      taskId,
      result,
      message: result,
    });
  } catch (error) {
    console.error('[Mission Control] Execution error:', error);
    return NextResponse.json(
      { error: 'Execution failed' },
      { status: 500 }
    );
  }
}
