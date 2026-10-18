# Deployment Guide (Vercel + Neon)
## Project: HCCDI TaskPilot
**Document Version:** 1.0.0  
**Status:** Current  
**Date:** October 2026  

TaskPilot deploys to **Vercel** as one project:

| Piece | How it runs on Vercel | Source |
|---|---|---|
| Landing page + app (React/Vite) | Static files on Vercel's CDN | `frontend/` → `frontend/dist` |
| REST API (FastAPI) | One Python serverless function | `api/index.py` → `backend/app` |
| Database | Managed PostgreSQL (Neon) | `backend/migrations/001_initial_schema.sql` |

Routing lives in `vercel.json`: `/api/*`, `/docs` and `/redoc` go to the function; every other path falls back to `index.html` so `/`, `/login` and `/app` work as client routes.

---

## 1. Prerequisites

- A GitHub account with this repository (or your fork).
- A Vercel account (Hobby is fine for a pilot).
- Locally: Python 3.10+ and Node 18+ for seeding and checks.

## 2. Create the database

**Option A — from Vercel (simplest).** In your Vercel project: **Storage → Create Database → Neon (Postgres)** → connect it to the project for *Production* and *Preview*. Vercel adds `DATABASE_URL` / `POSTGRES_URL` environment variables automatically; the app accepts either.

**Option B — directly on neon.tech.** Create a project, copy the **pooled** connection string (host contains `-pooler`) and add it in Vercel as `DATABASE_URL`.

Then create the schema and demo data **once**, from your machine:

```bash
pip install -r backend/requirements.txt
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require" python scripts/seed_demo.py
```

The script applies `001_initial_schema.sql` if the tables don't exist, then seeds the two demo accounts, their tasks, a demo project and audit entries. It is idempotent — run it again any time to restore missing demo rows.

> To start with an empty production database instead, apply only the schema: `psql "$DATABASE_URL" -f backend/migrations/001_initial_schema.sql`, then create your first admin with `POST /api/auth/register` and promote it in SQL (`UPDATE users SET role='admin' WHERE email='you@company.com';`).

## 3. Import the project into Vercel

1. **vercel.com → Add New… → Project → Import** this GitHub repository.
2. **Root Directory:** leave as the repository root (`./`). Vercel reads `vercel.json`, which already sets:
   - Install: `npm ci --prefix frontend`
   - Build: `npm run build --prefix frontend`
   - Output: `frontend/dist`
   - Function: `api/index.py` (Python, deps from root `requirements.txt` → `backend/requirements.txt`)
3. **Environment Variables** (Settings → Environment Variables, for Production *and* Preview):

| Variable | Required | Value |
|---|---|---|
| `DATABASE_URL` | yes (unless the Neon integration set `POSTGRES_URL`) | pooled Postgres URL, `?sslmode=require` |
| `JWT_SECRET_KEY` | **yes** | a long random string, e.g. output of `openssl rand -hex 32` |
| `ENVIRONMENT` | no | defaults to `production` on Vercel (hides internal error details) |
| `AI_API_KEY`, `AI_PROVIDER`, `AI_MODEL`, `AI_BASE_URL` | no | only if you connect an LLM; the Copilot works without them |
| `CORS_ORIGINS` | no | not needed — the SPA and API share one origin |

> **The function refuses to start on Vercel while `JWT_SECRET_KEY` is the development default** committed in this public repo. That is deliberate: with the default, anyone could forge an admin token.

4. Click **Deploy**.

## 4. Verify the deployment

```bash
curl https://<your-app>.vercel.app/api/health
# {"status":"healthy", ... "database":{"status":"connected", ...}}
```

Then in a browser:
1. `/` — landing page loads; the tour video plays.
2. `/login?demo=admin` → **Sign In** → you land on `/app` with 9 tasks.
3. Sign out, `/login?demo=user` → Sarah sees 4 tasks; Alexander's are absent.
4. `/docs` — interactive API documentation.

If `/api/health` returns 500 or the function log shows `JWT_SECRET_KEY is not set`, add the variable and **Redeploy**. If it reports `"degraded"`, check `DATABASE_URL` and that the seed/migration ran.

## 5. Day-two operations

| Task | How |
|---|---|
| Ship a change | Push to `main` → production deploy. Pull requests get Preview URLs automatically |
| Roll back | Vercel → Deployments → pick a previous build → **Promote to Production** (database is not rolled back) |
| Schema change | Add `backend/migrations/00N_*.sql`, apply it to Neon with `psql` **before** merging the code that needs it |
| Reset demo data | `DATABASE_URL=… python scripts/seed_demo.py` (adds back anything missing) |
| Rotate the JWT secret | Change `JWT_SECRET_KEY`, redeploy; everyone signs in again |
| Logs | Vercel → Project → Logs (filter by `/api`) |

## 6. Optional: deploy from the CLI

```bash
npm i -g vercel
vercel login
vercel link                       # pick or create the project
vercel env add JWT_SECRET_KEY     # repeat for DATABASE_URL
vercel --prod
```

## 7. Running locally (reference)

```bash
# Database (any Postgres 14+)
createdb taskpilot
export DATABASE_URL=postgresql://localhost:5432/taskpilot
python scripts/seed_demo.py

# API on :8000
cd backend && pip install -r requirements.txt && python run.py

# Frontend on :5173 (proxies /api to :8000)
cd frontend && npm install && npm run dev
```

Tests (use a separate database so the demo data stays clean):

```bash
createdb taskpilot_test
DATABASE_URL=postgresql://localhost:5432/taskpilot_test python scripts/seed_demo.py
cd backend && DATABASE_URL=postgresql://localhost:5432/taskpilot_test python -m pytest tests -q
```

## 8. Limits to know

- The Python function has a 30 s `maxDuration`; Excel files are processed in memory, so keep imports to typical tracker sizes (thousands of rows, not millions).
- Vercel functions are stateless: nothing is written to local disk; uploads are parsed in memory and stored in Postgres.
- The demo credentials are public. For a real team, provision real accounts and remove or change the demo users.
