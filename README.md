# 🗂️ Project & Ideas Board + Mission Control

Two powerful tools for organizing and executing:

## 🗮️ Part 1: Project & Ideas Board

A **real-time Kanban board** for organizing ideas and tasks across all your projects.

### Features
- **4 Columns:** Ideas → To Do → In Progress → Done
- **5 Projects:** TrendWatcher, HackerStack, Autonomous Agent, Calm Under Pressure, General
- **Real-time Updates** via Supabase
- **Voting System** for prioritization
- **Auto-Process** (⚡ button) for task execution

---

## 🎯 Part 2: Mission Control

**Mr. Anderson's Private AI Agent Dashboard** - A direct line to autonomous execution!

### Features
- 🔐 **Password Protected** - Only you can access
- 🤖 **Mr. Anderson Avatar** with real-time status:
  - 💤 **Idle** (purple gradient, floating animation)
  - ⚡ **Executing** (blue→green gradient, pulsing)
  - 🔴 **Down** (red gradient, static)
- ⚡ **Instant Execution** - Tasks run when submitted
- 📊 **Task History** - Results and timestamps
- 🎯 **Smart Keywords:**
  - `research X` → Research analysis
  - `post to X` → Draft social post
  - `blog X` → Write content
  - `build X` → Generate code
  - `fix X` → Debug issues
  - `deploy X` → Deploy to production
  - `schedule X` → Create cron job
  - `integrate X` → Connect APIs
  - `analyze X` → Run analysis
- ❤️️ **Heartbeat Endpoint** (`/api/heartbeat`) - Check if Mr. Anderson is online

### Access
```
https://your-domain/mission-control/dashboard
```

### Setup
```bash
cd mission-control
npm install
cp .env.example .env.local
# Set MISSION_PASSWORD in .env.local
npm run dev
```

---

## Quick Start

### Project Board
```bash
cd idea-board
npm install
cp .env.example .env.local  # Add Supabase credentials
npm run dev
# Open http://localhost:3000/board
```

### Mission Control
```bash
cd mission-control
npm install
cp .env.example .env.local
# Set MISSION_PASSWORD
npm run dev
# Open http://localhost:3000/mission-control/dashboard
```

---

## Deployment

Both apps are in the same repository:

| App | URL | Setup |
|-----|-----|-------|
| Project Board | `/board` | Supabase required |
| Mission Control | `/mission-control/dashboard` | Password only |

### Vercel Deployment
1. Push to GitHub
2. Import in Vercel
3. For Project Board: Add Supabase env vars
4. For Mission Control: Add `MISSION_PASSWORD` env var

---

*Built by Mr. Anderson during the night shift* 🕶️
