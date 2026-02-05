#!/bin/bash
# Deploy Idea Board to Vercel

set -e

echo "🚀 Deploying Project Board to Vercel..."
cd /root/.openclaw/idea-board

# Install if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the project
echo "Building project..."
npm run build

# Deploy to Vercel
if command -v vercel &> /dev/null; then
  echo "Deploying with Vercel CLI..."
  vercel --prod --token=$VERCEL_TOKEN
else
  echo "Vercel CLI not found. Deploy options:"
  echo "1. Run: npm i -g vercel && vercel login"
  echo "2. Or push to GitHub and import in Vercel dashboard"
fi

echo "✅ Deployment complete!"
