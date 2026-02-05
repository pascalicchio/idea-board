import { NextResponse } from 'next/server';

// Health check endpoint for Mission Control
// Used to determine if Mr. Anderson is online

export async function GET() {
  const status = {
    online: true,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    agent: 'Mr. Anderson',
    status: 'idle', // 'idle' | 'executing' | 'down'
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };

  return NextResponse.json(status);
}
