# 🗂️ Project & Ideas Board

A **real-time Kanban board** for organizing ideas and tasks across all your projects with Supabase backend.

## Features

### 🎯 Kanban Board
- **4 Columns:** Ideas → To Do → In Progress → Done
- **Move cards** with → (advance) and ← (go back) buttons
- **Drag-and-drop** style workflow

### 🗂️ Project Management
- **5 Projects tracked:**
  - 📈 TrendWatcher - E-commerce intelligence SaaS
  - 🛠️ HackerStack - AI tools directory
  - 🤖 Autonomous Agent - Mr. Anderson's journey
  - 👕 Calm Under Pressure - E-commerce apparel
  - 📝 General - Miscellaneous

### ⬆️ Voting System
- Upvote the best ideas
- Sort by vote count

### 🔴 Real-Time Updates
- Supabase subscription for instant updates
- See changes from other devices in real-time

### 🎨 UI Features
- Color-coded project tags
- Priority indicators (🔴🟡🟢)
- Dark mode design
- Responsive layout

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Backend:** Supabase (PostgreSQL + Real-time)
- **Styling:** CSS Variables, Purple Gradient Theme
- **Deployment:** Vercel

## Quick Start

```bash
cd /root/.openclaw/idea-board

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open http://localhost:3000/board

## Database Setup

1. Create a project at [Supabase](https://supabase.com)
2. Go to SQL Editor and run `schema.sql`
3. Copy your project URL and anon key to `.env.local`

## Deployment to Vercel

### Option 1: Vercel CLI
```bash
cd /root/.openclaw/idea-board
vercel login
vercel deploy --prod
```

### Option 2: Git Integration
1. Push to GitHub
2. Import in Vercel dashboard
3. Add environment variables
4. Deploy

### Environment Variables in Vercel
Add these in Settings > Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cards` | Fetch all projects and cards |
| POST | `/api/cards` | Create a new card |
| PUT | `/api/cards` | Update a card |
| DELETE | `/api/cards?id=` | Delete a card |
| GET | `/api/votes?card_id=` | Get vote count |
| POST | `/api/votes` | Vote or add comment |

## Seeded Tasks

| Task | Project | Status |
|------|---------|--------|
| Add Amazon Movers API | TrendWatcher | 🔥 In Progress |
| Create 20 blog posts | HackerStack | 📋 To Do |
| Reach 1000 followers | Autonomous | 📋 To Do |
| Set up Stripe payments | TrendWatcher | 💡 Idea |
| Design product mockups | Calm | 💡 Idea |
| Fix subscription bug | TrendWatcher | ✅ Done |
| Schedule 35 posts/week | Autonomous | ✅ Done |

## Real-Time Demo

When Supabase is configured, you'll see a "🔴 Real-time connected" indicator and changes will sync instantly across all devices.

---

*Built by Mr. Anderson during the night shift* 🕶️
