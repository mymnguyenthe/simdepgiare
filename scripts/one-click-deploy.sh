#!/bin/bash
# One-Click Deploy Script for SimDepGiaRe
# Sets up Supabase and deploys to Vercel in one command

set -e

echo "🚀 SimDepGiaRe - One-Click Deploy"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo -e "${RED}❌ .env.local not found!${NC}"
  echo ""
  echo "Please create .env.local with your Supabase credentials:"
  echo ""
  echo "  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
  echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
  echo "  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
  echo ""
  echo "Get these from: https://supabase.com/dashboard/project/_/settings/api"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅${NC} Found .env.local"
echo ""

# Install dependencies
echo -e "${BLUE}📦${NC} Installing dependencies..."
npm install --silent
echo -e "${GREEN}✅${NC} Dependencies installed"
echo ""

# Build project
echo -e "${BLUE}🔨${NC} Building project..."
npm run build
echo -e "${GREEN}✅${NC} Build successful"
echo ""

# Setup Supabase
echo -e "${BLUE}🗄️${NC} Setting up Supabase database..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo -e "${YELLOW}⚠️${NC} Supabase CLI not found. Installing..."
  npm install -g supabase
fi

# Run migrations
npx supabase db push
echo -e "${GREEN}✅${NC} Database schema created"
echo ""

# Seed database (optional)
read -p "Do you want to insert sample data? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${BLUE}🌱${NC} Seeding database..."
  node scripts/seed-database.js
  echo -e "${GREEN}✅${NC} Sample data inserted"
else
  echo -e "${YELLOW}⏭️${NC} Skipped database seeding"
fi
echo ""

# Deploy to Vercel
echo -e "${BLUE}${NC} Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}⚠️${NC} Vercel CLI not found. Installing..."
  npm install -g vercel
fi

# Deploy
vercel --prod --yes

echo ""
echo -e "${GREEN}✅${NC} Deployment complete!"
echo ""
echo -e "${BLUE}${NC} Next steps:"
echo ""
echo "1. Add environment variables in Vercel dashboard:"
echo "   https://vercel.com/dashboard"
echo ""
echo "   Required variables:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "2. Visit your deployed site!"
echo ""
echo -e "${GREEN}🎉${NC} Done! Your site is now live."
