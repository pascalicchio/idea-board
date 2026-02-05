import { NextResponse } from 'next/server';

// Health check endpoint for Mission Control
export async function GET() {
  const status = {
    online: true,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    agent: 'Mr. Anderson',
    status: 'idle',
    uptime: process.uptime(),
  };
  return NextResponse.json(status);
}
