# 🗂️ Project & Ideas Board + Mission Control

Two powerful tools for organizing and executing:

## 🗮️ Part 1: Project & Ideas Board (`/board`)

A **real-time Kanban board** for organizing ideas and tasks across all your projects.

### Features
- **4 Columns:** Ideas → To Do → In Progress → Done
- **5 Projects:** TrendWatcher, HackerStack, Autonomous Agent, Calm Under Pressure, General
- **Real-time Updates** via Supabase
- **Voting System** for prioritization
- **Auto-Process** (⚡ button) for task execution

---

## 🎯 Part 2: Mission Control (`/mission-control/dashboard`)

**Mr. Anderson's Private AI Agent Dashboard** - A direct line to autonomous execution!

### Features
- 🔐 **Password Protected** - Only Fillipe can access
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
- ❤️️ **Heartbeat Endpoint** (`/mission-control/api/heartbeat`) - Check if Mr. Anderson is online

### Access URL
```
https://idea-board-beige.vercel.app/mission-control/dashboard
```

### Password
```
nb3.u3_!CnN6RLy6UpW
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
cd idea-board
npm install
npm run dev
# Open http://localhost:3000/mission-control/dashboard
# Password: nb3.u3_!CnN6RLy6UpW
```

---

## Deployment

Both apps deploy together automatically from GitHub:

| App | Route | Required Env Vars |
|-----|-------|------------------|
| Project Board | `/board` | Supabase URL + Key |
| Mission Control | `/mission-control/dashboard` | `MISSION_PASSWORD` |

### Vercel Environment Variables
Add in Vercel Settings > Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `MISSION_PASSWORD` - Access password for Mission Control

---

*Built by Mr. Anderson during the night shift* 🕶️
