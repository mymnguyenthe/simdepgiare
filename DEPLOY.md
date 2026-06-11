# Deploy Guide - One-Click Setup

## Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account

## Quick Start

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd simdepgiare
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase Database

#### Option A: Using Setup Script (Recommended)
```bash
./scripts/setup-supabase.sh
```

#### Option B: Manual Setup
1. Create new project at https://supabase.com
2. Copy project URL and keys to `.env.local`
3. Run migrations:
```bash
npx supabase db push
```

### 4. Seed Database (Optional)
```bash
node scripts/seed-database.js
```

### 5. Deploy to Vercel

#### Option A: Vercel CLI
```bash
npm i -g vercel
vercel
```

#### Option B: GitHub Integration
1. Push code to GitHub
2. Import project at https://vercel.com/new
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

### 6. Environment Variables

Create `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema

### Tables
- `categories` - Sim categories (Tứ Quý, Ngũ Quý, etc.)
- `sims` - Sim inventory with pricing

### Migrations
Located in `supabase/migrations/`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `./scripts/setup-supabase.sh` | Setup Supabase database |
| `node scripts/seed-database.js` | Insert sample data |
| `node scripts/import-sims.js` | Import sims from file |
| `node scripts/classify-sims.js` | Auto-classify sims |

## Troubleshooting

### Build Errors
```bash
npm run build
```

### Database Connection
Check `.env.local` values match Supabase project settings.

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill
```

## Support
- Documentation: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
