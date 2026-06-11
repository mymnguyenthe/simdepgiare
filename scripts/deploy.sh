#!/bin/bash
# One-Click Deploy Script
# Deploys to Vercel and sets up Supabase

set -e

echo "🚀 One-Click Deploy Script"
echo "=========================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found!"
  echo "Please create it with your Supabase credentials:"
  echo ""
  echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
  echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
  echo ""
  exit 1
fi

echo "✅ Found .env.local"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Build project
echo "🔨 Building project..."
npm run build
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "⚠️  Vercel CLI not found. Installing..."
  npm i -g vercel
  echo ""
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Add environment variables in Vercel dashboard:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "2. Visit your deployed site!"
