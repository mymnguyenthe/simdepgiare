#!/bin/bash
# Setup Supabase - One-click database setup
# Usage: ./scripts/setup-supabase.sh

set -e

echo "🚀 Setting up Supabase database..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found. Please create it with:"
  echo "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
  echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
  echo "   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
  exit 1
fi

# Load environment variables
source .env.local

echo "✅ Environment loaded"

# Run migrations
echo "📦 Running database migrations..."
npx supabase db push

echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: node scripts/seed-database.js (to insert sample data)"
echo "2. Run: npm run dev (to start development server)"
