#!/bin/bash
# 🚀 Deploy Project Board to Vercel (Automated)
# Run this script to deploy the idea-board to Vercel

set -e

echo "🚀 Project Board Deployment Script"
echo "=================================="
echo ""

# Check for Vercel token
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ VERCEL_TOKEN not found!"
    echo ""
    echo "To deploy, you need a Vercel token:"
    echo ""
    echo "1. Get your token from:"
    echo "   https://vercel.com/account/tokens"
    echo ""
    echo "2. Set it as an environment variable:"
    echo "   export VERCEL_TOKEN=your_token_here"
    echo ""
    echo "3. Or pass it directly:"
    echo "   VERCEL_TOKEN=your_token ./deploy-vercel.sh"
    echo ""
    echo "Alternatively, use GitHub import:"
    echo "   1. Go to https://vercel.com/import/git"
    echo "   2. Select pascalicchio/idea-board"
    echo "   3. Add Supabase env vars"
    echo "   4. Deploy!"
    exit 1
fi

echo "✅ Vercel token found"
echo ""

cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Build the project
echo "🔨 Building project..."
npm run build
echo ""

# Create Vercel project via API
echo "📡 Creating Vercel project..."

# Check if project exists
PROJECT_RESPONSE=$(curl -s -X GET "https://api.vercel.com/v9/projects/idea-board" \
    -H "Authorization: Bearer $VERCEL_TOKEN" 2>/dev/null || echo '{"error":"not_found"}')

if echo "$PROJECT_RESPONSE" | grep -q '"error"'; then
    # Create new project
    echo "Creating new project..."
    CREATE_RESPONSE=$(curl -s -X POST "https://api.vercel.com/v9/projects" \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "idea-board",
            "framework": "nextjs",
            "gitRepository": {
                "type": "github",
                "repo": "pascalicchio/idea-board"
            }
        }')
    
    echo "Project creation response: $CREATE_RESPONSE"
fi

# Deploy
echo ""
echo "🚀 Deploying to Vercel..."
DEPLOY_RESPONSE=$(npx vercel --token="$VERCEL_TOKEN" --yes --prod 2>&1)

echo "$DEPLOY_RESPONSE"
echo ""

# Extract deployment URL
DEPLOY_URL=$(echo "$DEPLOY_RESPONSE" | grep -o 'https://[^[:space:]]*\.vercel\.app' | head -1)

if [ -n "$DEPLOY_URL" ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Your Project Board is live at:"
    echo "   $DEPLOY_URL/board"
    echo ""
    echo "⚠️  Don't forget to add Supabase environment variables:"
    echo "   NEXT_PUBLIC_SUPABASE_URL"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
    echo "Add them at: https://vercel.com/idea-board/settings/environment-variables"
else
    echo ""
    echo "⚠️  Deployment may have issues. Check output above."
    echo "   Your code is on GitHub: https://github.com/pascalicchio/idea-board"
    echo "   You can also import manually in Vercel."
fi
