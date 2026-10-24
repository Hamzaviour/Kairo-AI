# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Enterprise teams moving off shared Excel task trackers. **Admins** (team leads, ops managers) run the organisation: they see every task, manage users and roles, and read the audit trail. **Users** (individual contributors) see and work only their own tasks. Both arrive with existing spreadsheets and a daily need to know what to work on next.

## Product Purpose
Kairo turns error-prone spreadsheets into a secure, AI-assisted task workspace. Success means a team can import its existing tracker, plan and run work in the browser without ever leaking one person's tasks to another, and export back to Excel whenever a stakeholder still wants a sheet.

## Positioning
Spreadsheet → AI workspace. The Excel round-trip (validated import with dry-run preview, styled export with native dropdown validation) is the on-ramp; the dual-engine AI Copilot (LLM when a key is configured, deterministic heuristics when not) is the payoff; strict per-user scope filtering is what makes it safe for an enterprise to adopt.

## Operating Context
- Starts from `Tasks_and_Users.xlsx`-style workbooks (Task + Users sheets).
- Daily work happens in List, Kanban and Calendar views, the task drawer (subtasks, comments, activity log) and the ⌘K command palette.
- Admins also use Team & Roles, Audit Trail and organisation analytics.

## Capabilities and Constraints
- Stack: React 18 + Vite + TypeScript + Tailwind (frontend), FastAPI + SQLAlchemy 2 (backend), PostgreSQL (Neon) — Postgres-only types (ENUM, JSONB, ARRAY).
- Roles: `admin`, `user`. Regular users get 404 (not 403) on other users' task IDs.
- AI features: natural-language task parsing, subtask breakdown, explainable prioritisation, smart schedule, privacy-scoped chat. Works offline via heuristic fallback.
- Deployment target: Vercel (static frontend + Python serverless API) with a hosted Postgres.

## Brand Commitments
- Name: **Kairo** (from *kairos*, the opportune moment); tagline "Do the right work at the right moment". Renamed from the original working name on 2026-10-24; that name must not appear anywhere in the product.
- Direction pinned by the owner: **calm premium** (Linear / Things register): deep ink, generous space, one bright accent.
- Identity: open-ring mark with a saffron dot in its gap, monoline `kairo` wordmark whose i-dot is saffron. Ink neutrals, saffron `#ffb224` accent, Funnel Display + Geist + Geist Mono. See DESIGN.md and `/brand`.
- Voice: calm, direct and specific; concrete nouns from the product (tasks, scopes, sheets), no hype.
- Chat assistants: users and admins each get their own Groq-powered assistant in the bottom-right corner.

## Evidence on Hand
- Demo accounts and seed data from `data/Tasks_and_Users_Updated.xlsx` (2 users, 3 tasks) plus seeded demo tasks in `scripts/seed_demo.py`.
- 21 passing backend tests (auth, IDOR isolation, AI, Excel).
- No customers, testimonials, pricing or usage metrics exist — never fabricate them.

## Product Principles
1. Isolation is non-negotiable: every surface shows only what the viewer's scope permits.
2. Meet teams where they are: Excel in, Excel out, no data loss.
3. AI explains itself: suggestions show their reasoning and never block manual work.
4. Dense but calm: operators scan dozens of tasks; clarity beats decoration.

## Accessibility & Inclusion
Target WCAG 2.1 AA: keyboard reachable controls, visible focus, sufficient contrast, reduced-motion respected.
