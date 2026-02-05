#!/bin/bash
# Deploy Idea Board to Vercel
# Run this script to deploy

set -e

echo "🚀 Project Board Deployment"
echo "=========================="

# Check for Vercel token
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN not found"
  echo ""
  echo "To deploy, you need a Vercel token:"
  echo "1. Go to https://vercel.com/account/tokens"
  echo "2. Create a new token"
  echo "3. Export it: export VERCEL_TOKEN=your-token"
  echo ""
  echo "Or deploy manually:"
  echo "  cd /root/.openclaw/idea-board"
  echo "  npx vercel --prod"
  exit 1
fi

cd /root/.openclaw/idea-board

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building project..."
npm run build

echo "🚀 Deploying to Vercel..."
npx vercel --prod --token=$VERCEL_TOKEN

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add Supabase credentials in Vercel dashboard"
echo "2. Run schema.sql in Supabase SQL Editor"
echo "3. Your board will be live!"
