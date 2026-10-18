# HCCDI TaskPilot — AI-Powered Task Management & To-Do Platform

[![Python](https://img.shields.io/badge/Python-3.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18%20(Neon)-336791.svg)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, full-stack, AI-powered work orchestration and task management platform that transforms unstructured, error-prone spreadsheets into a secure, collaborative, multi-tenant productivity suite.

---

## 🌟 Key Highlights & Architectural Pillars

### 1. 🛡️ High-Assurance Security & IDOR Immunity
- **Inviolable Scope Filtering**: Mathematical protection against Insecure Direct Object Reference (IDOR). Regular users receive strict `404 Not Found` when probing unauthorized task UUIDs.
- **Stateless JWT with Token Rotation**: Short-lived 60-minute access tokens coupled with revocable, cryptographically hashed 7-day refresh tokens.
- **Salted Bcrypt Password Hashing**: Passwords stored using Blowfish salted hashing with cost factor 12.

### 2. 🤖 Dual-Engine AI Task Copilot
- **Natural Language Parsing**: Converts raw phrases (*"Submit Q4 budget report to Alex by next Thursday with urgent priority"*) into structured task entities.
- **Automated Subtask Decomposition**: Deconstructs high-level objectives into 3–7 actionable checklist items.
- **Explainable Prioritization**: Evaluates due date proximity, blocker weights, and capacity to deliver transparent prioritization scores with human-readable rationale.
- **Privacy-Scoped Context**: AI queries query strictly against the authenticated user's permitted tasks, eliminating data leakage across tenants.
- **Deterministic Heuristic Fallback**: 100% operational in air-gapped or offline environments without external API keys.

### 3. 📊 Omnichannel Task Orchestration
- **Dense Sortable List View**: Tabular layout with inline status selectors, bulk multi-selection, and fast filtering.
- **Interactive Kanban Board**: 6-column HTML5 drag-and-drop board with confetti celebration upon task completion.
- **Monthly Calendar**: Visual deadline tracking with clickable day event chips.
- **Slide-Over Task Drawer**: Subtasks checklist with live progress bar, threaded comments, and immutable audit logs.
- **Global Command Palette (`⌘K` / `Ctrl+K`)**: Instant task search and shortcut triggers.

### 4. 📑 Bidirectional Microsoft Excel Data Center
- **Dynamic Streaming Export**: Generates `.xlsx` spreadsheets complete with styled headers and native dropdown data validation.
- **Import Validation Preview**: Dry-run verification before committing imported spreadsheets to PostgreSQL.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[React 18 + Vite + TypeScript SPA] -->|HTTPS REST / JSON| Gateway[FastAPI ASGI Gateway]
    
    subgraph Backend Engine
        Gateway --> AuthMiddleware[JWT Auth & RBAC Guard]
        AuthMiddleware --> Router[Modular API Routers]
        Router --> Service[Service Layer: Tasks, AI, Excel]
        Service --> AIService[Dual-Engine AI Copilot]
        Service --> ExcelEngine[OpenPyXL Data Pipeline]
        Service --> ORM[SQLAlchemy 2.0 ORM]
    end

    subgraph Serverless Database
        ORM --> Pooler[Neon PgBouncer Connection Pooler]
        Pooler --> NeonDB[(Neon Serverless PostgreSQL 18)]
    end
```

---

## 📂 Project Structure

```text
task-management-platform/
├── backend/
│   ├── app/
│   │   ├── api/          # REST route endpoints (Auth, Tasks, AI, Admin, Excel)
│   │   ├── core/         # Config, database connection pooling, security, deps
│   │   ├── models/       # Declarative SQLAlchemy 2.0 models (19 tables)
│   │   ├── schemas/      # Pydantic v2 validation DTOs and envelopes
│   │   └── services/     # Task isolation, AI engine, OpenPyXL pipeline
│   ├── migrations/       # SQL DDL schemas and triggers
│   ├── tests/            # Automated pytest suite (Auth, IDOR, AI, Excel)
│   └── run.py            # Uvicorn entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Layout, Tasks (List, Kanban, Calendar), AI, Excel
│   │   ├── context/      # Authentication & session provider
│   │   ├── services/     # Axios client with 401 refresh token interceptor
│   │   ├── pages/        # Login page with demo switcher & Dashboard
│   │   └── types/        # TypeScript interfaces matching backend DTOs
│   ├── package.json
│   └── vite.config.ts
│
└── docs/                 # Pre-documentation engineering suite
    ├── 01_PRD.md
    ├── 02_TRD.md
    ├── 03_SRS.md
    ├── 04_SYSTEM_DESIGN_ARCHITECTURE.md
    ├── 05_UI_UX_DESIGN_SPEC.md
    ├── 06_IMPLEMENTATION_PLAN.md
    ├── 07_SDLC_METHODOLOGY.md
    ├── 08_PROJECT_TRACKING_TRACEABILITY.md
    └── 09_BACKEND_SCHEMA_SPEC.md
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Python 3.10+** (Python 3.14 supported)
- **Node.js 18+** & **npm**
- **Git**

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt  # or install fastapi uvicorn sqlalchemy pydantic openpyxl pyjwt bcrypt
python run.py
```
Backend API will be live at `http://127.0.0.1:8000`.  
Interactive OpenAPI Swagger documentation: `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Client SPA will be live at `http://localhost:5173`.

### 3. Running Automated Tests
```bash
cd backend
python -m pytest tests/ -v
```
*(All 17 integration and IDOR security tests pass at 100%).*

---

## 🔑 Demo Credentials (Migrated from Excel)

| Account | Email | Password | Role / Scope |
|---|---|---|---|
| **Alexander Wright** | `alexander.wright@enterprise.com` | `P@ssw0rd!2026` | `admin` (System & Org-wide Scope) |
| **Sarah Jenkins** | `sarah.jenkins@enterprise.com` | `Secur3_Token#88` | `user` (Strictly Isolated Scope) |

---

## 📚 Engineering Documentation Suite

Detailed engineering documents are available in [`docs/`](./docs/):
- **[01_PRD.md](./docs/01_PRD.md)**: Product Requirements Document.
- **[02_TRD.md](./docs/02_TRD.md)**: Technical Requirements Document & API Route Registry.
- **[03_SRS.md](./docs/03_SRS.md)**: IEEE Std 830-1998 Software Requirements Specification.
- **[04_SYSTEM_DESIGN_ARCHITECTURE.md](./docs/04_SYSTEM_DESIGN_ARCHITECTURE.md)**: Architecture, Sequences, & IDOR filters.
- **[05_UI_UX_DESIGN_SPEC.md](./docs/05_UI_UX_DESIGN_SPEC.md)**: Linear/Notion design system tokens & component hierarchy.
- **[06_IMPLEMENTATION_PLAN.md](./docs/06_IMPLEMENTATION_PLAN.md)**: Work Breakdown Structure (WBS).
- **[07_SDLC_METHODOLOGY.md](./docs/07_SDLC_METHODOLOGY.md)**: Agile delivery & quality gates.
- **[08_PROJECT_TRACKING_TRACEABILITY.md](./docs/08_PROJECT_TRACKING_TRACEABILITY.md)**: Requirements Traceability Matrix (RTM).
- **[09_BACKEND_SCHEMA_SPEC.md](./docs/09_BACKEND_SCHEMA_SPEC.md)**: Comprehensive 19-table database dictionary.

---

## 👤 Author & Contributor

**Hamza** ([@Hamzaviour](https://github.com/Hamzaviour))  
Email: [hamzavelous@gmail.com](mailto:hamzavelous@gmail.com)  
Project Repository: [AI-Based-To-Do-App](https://github.com/Hamzaviour/AI-Based-To-Do-App)
