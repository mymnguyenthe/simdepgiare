#  Deploy Guide - One-Click Setup

## Overview

This guide helps you deploy SimDepGiaRe to **Vercel** with **Supabase** backend in minutes.

## 🎯 Quick Deploy (Recommended)

### One-Command Deploy

```bash
./scripts/one-click-deploy.sh
```

This script will:
- ✅ Install dependencies
- ✅ Build the project
- ✅ Setup Supabase database schema
- ✅ Optionally seed sample data
- ✅ Deploy to Vercel

### Manual Step-by-Step

#### 1. Prerequisites

```bash
# Install Node.js 18+ (if not installed)
# https://nodejs.org/

# Install Vercel CLI
npm i -g vercel

# Install Supabase CLI (optional, for local development)
npm i -g supabase
```

#### 2. Clone & Install

```bash
git clone <your-repo-url>
cd simdepgiare
npm install
```

#### 3. Setup Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Get credentials from:**
1. Go to https://supabase.com
2. Create new project (or select existing)
3. Go to Settings → API
4. Copy URL and keys

#### 4. Setup Database

```bash
# Option A: Using setup script
./scripts/setup-supabase.sh

# Option B: Manual
npx supabase db push
node scripts/seed-database.js  # Optional: insert sample data
```

#### 5. Deploy to Vercel

```bash
# Option A: Using deploy script
./scripts/deploy.sh

# Option B: Manual Vercel CLI
vercel --prod

# Option C: GitHub Integration
# 1. Push code to GitHub
# 2. Import at https://vercel.com/new
# 3. Add environment variables
# 4. Deploy
```

## 📋 Environment Variables

### Required

| Variable | Description | Where to get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (secret) | Supabase Dashboard → Settings → API |

### Optional

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | Vercel Analytics ID |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |

## 🗄️ Database Setup

### Tables Created

- `categories` - Sim categories
- `sims` - Sim inventory
- `orders` - Customer orders
- `users` - User accounts

### Migrations

Located in `supabase/migrations/`:
- `001_initial_schema.sql` - Base schema
- `002_create_simdepgiare_tables.sql` - Extended schema

### Seed Data

```bash
node scripts/seed-database.js
```

Inserts sample sims and categories for testing.

##  Scripts Reference

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `./scripts/one-click-deploy.sh` | Complete one-click deployment |
| `./scripts/setup-supabase.sh` | Setup Supabase database only |
| `./scripts/deploy.sh` | Deploy to Vercel only |
| `node scripts/seed-database.js` | Insert sample data |
| `node scripts/import-sims.js` | Import sims from CSV file |
| `node scripts/classify-sims.js` | Auto-classify sims by pattern |

##  Vercel Configuration

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "regions": ["hnd1"]
}
```

### Environment Variables in Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`

##  Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Database Connection Error

1. Check `.env.local` values
2. Verify Supabase project is active
3. Check RLS policies in Supabase Dashboard

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
```

### Supabase CLI Not Found

```bash
npm install -g supabase
```

### Vercel CLI Not Found

```bash
npm install -g vercel
```

## 📊 Post-Deploy Checklist

- [ ] Environment variables added in Vercel
- [ ] Database migrations run
- [ ] Sample data seeded (optional)
- [ ] Test site functionality
- [ ] Setup custom domain (optional)
- [ ] Enable Vercel Analytics (optional)

## 🔒 Security Notes

- Never commit `.env.local` to git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Use environment variables for all secrets
- Enable Row Level Security (RLS) in Supabase

## 📞 Support

- Documentation: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Issues: https://github.com/your-repo/issues

## 🎉 Success!

Your SimDepGiaRe site is now live with:
- ✅ Beautiful gold neon UI
- ✅ Real-time inventory management
- ✅ Admin dashboard
- ✅ SEO optimized
- ✅ Fast performance

**Next steps:**
1. Add your own sim inventory
2. Customize branding
3. Setup payment gateway (optional)
4. Configure email notifications
