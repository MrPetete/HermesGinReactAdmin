# 🪭 Ruyi · AI-Driven Admin System

> 如意 — "good fortune, everything as you wish."
> A modern, AI-driven management system with a **separated frontend (React) and backend (Gin)**.

The backend is built with **Go + Gin + GORM**, featuring JWT auth, RBAC, and an
**AI feature layer** (chat assistant, smart search, document Q&A, data insights).
The AI layer is provider-abstracted: it runs out-of-the-box with a built-in **mock**
provider (no API key needed) and switches to any **OpenAI-compatible** endpoint via
two environment variables — no code changes.

The frontend is **React 18 + TypeScript + Vite + Ant Design ProComponents**.

---

## Features

- 🔐 **JWT auth** + RBAC (admin / manager / viewer) with route + API-level guards
- 🤖 **AI Chat** assistant embedded in the admin UI
- 🔎 **Smart Search** — relevance-ranked retrieval over your documents, synthesized by AI
- 📄 **Document Q&A** — ask questions about any knowledge-base document
- 📊 **AI Insights** — the dashboard asks the AI to summarize system state
- 🗂 **User & Document management** with full CRUD
- 🐳 Docker / docker-compose for one-command deploy

## Architecture

```
ai-admin/
├── backend/       # Gin API (Go)
│   ├── config/        # YAML + env config loader
│   ├── model/         # User (bcrypt, RBAC) + Document
│   ├── internal/
│   │   ├── database/  # GORM, pure-Go sqlite (glebarez) / postgres, seed
│   │   ├── middleware/ # JWT + RequireRole
│   │   ├── ai/        # provider abstraction: mock + openai-compatible
│   │   ├── controller/ # auth, users, documents, dashboard, ai
│   │   ├── response/  # JSON helpers
│   │   └── router/    # all routes + CORS
│   ├── main.go
│   └── config.yaml
└── frontend/      # React SPA (Vite + TS + Ant Design) — 如意 Chinese-style Tech Blue
    └── src/
        ├── theme/        # tokens.ts (single source of truth) + theme.ts (AntD) + global.css (aurora/glass/motion)
        ├── components/   # reusable kit: ui/ (GlassCard, StatTile, SectionTitle, FadeUp), charts/ (TrendBars), common/ (AuroraBackground, PageContainer)
        ├── layouts/      # AdminShell (fixed 56px top bar + 220px sidebar + scrollable 100vh main)
        ├── pages/        # feature modules: Dashboard/ Users/ Documents/ AiChat/ SmartSearch/ Settings/ (each index.tsx + mock)
        ├── hooks/        # useMock (single data seam — swap for real API later)
        ├── mock/         # per-feature fixtures (dashboard/users/documents/ai)
        └── router.tsx    # central route table
```
See `frontend/CLONE_AND_CUSTOMIZE.md` for how to copy this into a new branded admin.

## Quick start (local dev)

### Backend (runs under WSL on Windows; native on Linux/Mac)

> On this Windows sandbox, OS-native `.exe` execution is blocked, so the server is
> cross-compiled for Linux and run inside **WSL**. The SQLite DB lives on **D:**.

```bash
# 1. build the Linux binary (CGO off — pure-Go sqlite, no gcc)
cd backend
export CGO_ENABLED=0
GOOS=linux GOARCH=amd64 go build -o bin/server-linux .

# 2. run inside WSL (DB on D: via the /mnt/d mount)
wsl -d Ubuntu -e bash -c "cd /mnt/d/ai-admin/backend && \
  DB_DSN=/mnt/d/ai-admin/backend/data/app.db ./bin/server-linux"
```

Backend listens on `http://localhost:8080`. Default admin: **admin / admin123**.

> On a normal Linux/Mac host just run `./server` (or `go run .`) directly — no WSL needed.

### Frontend

```bash
cd frontend
npm install
npm run dev          # Vite dev server on :3000, proxies /api -> :8080
npm test             # Vitest + RTL: 8 tests (api shape + login auth flow), no network
npm run build        # tsc -b && vite build -> dist/
```

Open http://localhost:3000 and sign in.

> **Windows + WSL note:** the Go binary runs inside WSL2, whose network is isolated from
> Windows. Point the Vite proxy at the WSL IP (`VITE_API_HOST=<wsl-ip>` in `frontend/vite.config.ts`),
> or just run both natively on the same host. Frontend logic is covered by `npm test`
> (mocked axios), so the UI contract is verified without needing the live backend.

## Enabling a real AI model

Set environment variables (12-factor; override `config.yaml`):

```bash
AI_PROVIDER=openai
AI_BASE_URL=https://api.openai.com/v1   # or any OpenAI-compatible endpoint
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

The API contract is identical to the mock provider — **no code changes required**.

## Docker

```bash
docker compose up --build
# web  -> http://localhost:3000
# api  -> http://localhost:8080
```

## API reference (selected)

| Method | Path | Auth | Note |
|--------|------|------|------|
| POST | `/api/auth/login` | — | returns JWT |
| GET | `/api/auth/me` | ✅ | current user |
| GET | `/api/dashboard/overview` | ✅ | counts + recent docs |
| GET | `/api/dashboard/insights` | ✅ | AI insight (mock/real) |
| GET/POST/PUT/DELETE | `/api/documents` | ✅ (manager+ for writes) | document CRUD |
| GET/POST/PUT/DELETE | `/api/users` | ✅ admin | user CRUD |
| POST | `/api/ai/chat` | ✅ | chat assistant |
| GET | `/api/ai/search?q=` | ✅ | smart search |
| POST | `/api/ai/documents/:id/ask` | ✅ | document Q&A |

## Notes on this environment

- `C:` is nearly full (~240 MB free), so **all project files live on `D:`**
  (`D:\ai-admin`) and the SQLite DB is at `D:\ai-admin\server\data\app.db`.
- Windows here blocks running user-compiled `.exe`, so the backend runs as a
  Linux binary inside WSL. On a standard machine, the Windows binary works directly.
