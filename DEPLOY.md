# 🚀 Project Board - Deployment Ready!

The Project Board is fully built and ready to deploy. Here's what you need to do:

## 1. Deploy to Vercel (Quick)

### Option A: Vercel CLI (if you have token)
```bash
export VERCEL_TOKEN=your-token-here
cd /root/.openclaw/idea-board
npx vercel --prod
```

### Option B: GitHub Import (Recommended)
1. Push to GitHub:
   ```bash
   cd /root/.openclaw/idea-board
   git remote add origin https://github.com/pascalicchio/idea-board.git
   git push -u origin main
   ```

2. Import in Vercel:
   - Go to https://vercel.com/import
   - Select "Import Git Repository"
   - Choose "pascalicchio/idea-board"
   - Add environment variables (see below)
   - Deploy!

## 2. Set Up Supabase Database

1. Create a project at https://supabase.com
2. Go to SQL Editor
3. Run the contents of `schema.sql`
4. Copy your credentials

## 3. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

## 4. Access Your Board

After deployment, your board will be at:
- **Production:** https://idea-board.vercel.app/board
- **Development:** http://localhost:3000/board

## Project Structure

```
/root/.openclaw/idea-board/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── board/page.tsx        # Kanban board (main)
│   │   ├── api/
│   │   │   ├── cards/route.ts    # CRUD for cards
│   │   │   └── votes/route.ts    # Voting & comments
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── lib/
│       └── db.ts                 # Supabase client
├── schema.sql                    # Database schema
├── package.json
├── README.md
└── deploy-complete.sh            # Deployment script
```

## Features Included

✅ Real-time updates via Supabase
✅ 5 project categories with color coding
✅ Voting system
✅ Card creation with project/priority
✅ Move cards between columns
✅ Delete cards
✅ Dark mode UI
✅ Responsive design

## Supabase Schema

The database includes:
- **projects** - Project categories
- **cards** - All task cards
- **votes** - Vote tracking
- **comments** - Card comments
- **RLS policies** - Secure access

---

**Built by Mr. Anderson** 🕶️
