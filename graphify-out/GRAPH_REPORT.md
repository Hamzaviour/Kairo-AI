# Graph Report - AI-Based-To-Do-App  (2026-10-18)

## Corpus Check
- 109 files · ~61,482 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .example 1, .css 1)

## Summary
- 894 nodes · 2387 edges · 41 communities (33 shown, 8 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 371 edges (avg confidence: 0.93)
- Token cost: 315,581 input · 0 output

## Community Hubs (Navigation)
- React App, Routing & Views
- Task & Subtask API
- API Wiring & Vercel Entrypoint
- Admin Governance API
- Landing Page & Design System
- AI Copilot Endpoints
- Frontend Dependencies
- Projects API
- Test Fixtures & Video Synth
- Technical Requirements (TRD)
- Database Schema Dictionary
- TypeScript Config
- Product Requirements (PRD)
- Backend Module Graph
- Excel Tests
- Excel Onboarding Workflow
- User Manual
- Excel Export
- UI/UX Design Spec
- Product Capabilities
- Vercel Config
- Auth Requirements (SRS)
- API Reference & AI Specs
- Proposal: Scope & Risks
- RBAC & Implementation Plan
- Proposal: Architecture & Cost
- Excel Schemas
- Backend Dependencies
- Schema Migration
- Excel Legacy Migration
- Deployment Guide
- Excel Import API
- Settings & Secret Guard
- Global Error Handling
- Health Check
- Priority Scoring

## God Nodes (most connected - your core abstractions)
1. `User` - 87 edges
2. `ResponseEnvelope` - 63 edges
3. `get_task_or_404()` - 26 edges
4. `Task` - 25 edges
5. `AIService` - 25 edges
6. `Backend Database Schema & Data Dictionary` - 25 edges
7. `UserResponse` - 24 edges
8. `react` - 23 edges
9. `log_task_activity()` - 22 edges
10. `get_scoped_tasks_query()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Task Orchestration Endpoints (/api/tasks/*)` --references--> `get_task_or_404()`  [INFERRED]
  docs/14_API_REFERENCE.md → backend/app/services/task_service.py
- `Audit Trail (latest 100 events)` --references--> `log_task_activity()`  [INFERRED]
  docs/12_USER_MANUAL.md → backend/app/services/task_service.py
- `AI Copilot Endpoints (/api/ai/*)` --references--> `AIService`  [INFERRED]
  docs/14_API_REFERENCE.md → backend/app/services/ai_service.py
- `Excel Status/Priority Mapping Rules` --references--> `ExcelService`  [INFERRED]
  docs/11_WORKFLOWS.md → backend/app/services/excel_service.py
- `task_activity_logs (Immutable Activity Log)` --references--> `log_task_activity()`  [EXTRACTED]
  docs/11_WORKFLOWS.md → backend/app/services/task_service.py

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Task Isolation Enforcement** — docs_10_product_proposal_isolated_workspaces, docs_11_workflows_isolation_check, docs_11_workflows_scoped_endpoint_convention, backend_app_services_task_service_get_scoped_tasks_query, backend_app_services_task_service_get_task_or_404 [EXTRACTED 1.00]
- **Vercel + Neon deployment stack** — docs_13_deployment_guide_vercel_deployment, docs_13_deployment_guide_vercel_json_routing, docs_13_deployment_guide_environment_variables, docs_13_deployment_guide_jwt_secret_startup_guard, readme_neon_postgresql [EXTRACTED 1.00]
- **Dual-Engine AI Pipeline** — docs_02_trd_dual_engine_pattern, docs_02_trd_deterministic_fallback_engine, docs_02_trd_privacy_context_sanitizer, docs_03_srs_srs_ai_001, docs_03_srs_srs_ai_002, docs_03_srs_srs_ai_003, backend_app_services_ai_service, docs_09_backend_schema_spec_table_ai_interactions [INFERRED 0.85]
- **Excel Legacy Migration Flow** — graphify_out_converted_tasks_and_users_3be845f5, scripts_migrate_excel, graphify_out_converted_tasks_and_users_updated_1499d685, docs_08_project_tracking_traceability_verify_migration_py, docs_09_backend_schema_spec_seed_data, docs_06_implementation_plan_phase_1_db_migration [INFERRED 0.85]
- **Excel Migration Loop** — docs_10_product_proposal_excel_round_trip, docs_11_workflows_excel_onboarding_flow, docs_11_workflows_status_mapping_rules, docs_10_product_proposal_shared_excel_workbook_problem [INFERRED 0.85]
- **IDOR Isolation Enforcement Chain** — docs_02_trd_apply_task_scope, docs_04_system_design_architecture_inviolable_scope_filter_flow, docs_03_srs_srs_task_002, backend_app_services_task_service, backend_tests_test_tasks_isolation, docs_09_backend_schema_spec_third_normal_form [INFERRED 0.85]
- **404 isolation proof across product, design and launch surfaces** — readme_idor_immunity_scope_filtering, design_viewer_switch, _impeccable_surfaces_frontend_src_pages_landingpage_tsx_thesis_one_database_two_scopes, brag_output_brag_plan_claim_other_tasks_404 [INFERRED 0.85]

## Communities (41 total, 8 thin omitted)

### Community 0 - "React App, Routing & Views"
Cohesion: 0.05
Nodes (81): App(), FullScreenLoader(), LoginRoute(), WorkspaceRoute(), AdminUserManagement(), ACTION_LABELS, AuditTrailView(), describe() (+73 more)

### Community 1 - "Task & Subtask API"
Cohesion: 0.07
Nodes (48): add_subtask(), delete_subtask(), update_subtask(), bulk_update(), create_category(), create_new_task(), create_tag(), delete_task_route() (+40 more)

### Community 2 - "API Wiring & Vercel Entrypoint"
Cohesion: 0.07
Nodes (26): get_admin_analytics(), get_user_productivity(), add_comment(), delete_comment(), list_task_comments(), list_notifications(), mark_all_read(), mark_notification_read() (+18 more)

### Community 3 - "Admin Governance API"
Cohesion: 0.05
Nodes (40): admin_create_user(), admin_update_user(), get_system_audit_logs(), list_all_users(), change_password(), get_current_user_profile(), login(), logout() (+32 more)

### Community 4 - "Landing Page & Design System"
Cohesion: 0.06
Nodes (47): Landing Page Surface Brief, Landing Story: spreadsheet mess -> isolation -> video -> live demo, Own-World Direction (slate-900 ground, indigo accent), Thesis: One database, two scopes, /brag Launch Video Plan, Claim: other users' tasks return 404, not just hidden, Original Synthesized Soundtrack (112 BPM), 20-second Storyboard (5 scenes: hook, reveal, copilot, scopes, outro) (+39 more)

### Community 5 - "AI Copilot Endpoints"
Cohesion: 0.12
Nodes (17): breakdown_task_route(), chat_copilot_route(), parse_task_route(), prioritize_task_route(), smart_schedule_route(), User, AIChatRequest, AIChatResponse (+9 more)

### Community 6 - "Frontend Dependencies"
Cohesion: 0.05
Nodes (40): dependencies, axios, canvas-confetti, clsx, date-fns, lucide-react, react, react-dom (+32 more)

### Community 7 - "Projects API"
Cohesion: 0.17
Nodes (15): add_project_member(), create_project(), delete_project(), get_project(), get_project_or_404(), list_projects(), remove_project_member(), update_project() (+7 more)

### Community 8 - "Test Fixtures & Video Synth"
Cohesion: 0.16
Nodes (14): admin_token(), client(), user_token(), blip(), env(), hat(), hz(), kick() (+6 more)

### Community 9 - "Technical Requirements (TRD)"
Cohesion: 0.12
Nodes (19): Technical Requirements Document (TRD), Live API Route Registry, apply_task_scope() Authorization Filter, Axios Bearer Interceptor with 401 Auto-Refresh, Privacy Context Sanitizer, Pydantic v2 DTOs, TanStack Query v5 Server Cache, Technology Stack Specification (+11 more)

### Community 10 - "Database Schema Dictionary"
Cohesion: 0.25
Nodes (19): TaskDetailDrawer (Slide-over), Backend Database Schema & Data Dictionary, Performance Indexing Matrix (20 indexes), Table: ai_interactions, Table: focus_sessions, Table: project_members, Table: projects, Table: recurring_task_rules (+11 more)

### Community 11 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 12 - "Product Requirements (PRD)"
Cohesion: 0.14
Nodes (15): Product Requirements Document (PRD), Real-Time Activity & Audit Logs, Inter-Task Dependencies (blocks / blocked_by / relates_to), NFR-2 Performance (p95 < 150ms), NFR-1 Security & Data Isolation, Notification Center, Omnichannel Task Views (List, Kanban, Calendar, Timeline), Integrated Focus & Pomodoro Timer (+7 more)

### Community 13 - "Backend Module Graph"
Cohesion: 0.16
Nodes (4): Demo Accounts (Alexander Wright admin, Sarah Jenkins user), ensure_schema(), load_excel(), seed()

### Community 14 - "Excel Tests"
Cohesion: 0.25
Nodes (4): test_excel_export(), test_excel_import_preview(), test_excel_import_preview_maps_legacy_statuses_and_flags_empty_titles(), create_excel()

### Community 15 - "Excel Onboarding Workflow"
Cohesion: 0.21
Nodes (13): Legacy Spreadsheet Problem, Excel Hub (export / import with preview), Access Levels (Public / Bearer / Admin), PRODUCT.md (Product Context), Positioning: Spreadsheet -> AI Workspace, Principle: Meet teams where they are (Excel in, Excel out), Principle: Isolation is non-negotiable, User Role (+5 more)

### Community 16 - "User Manual"
Cohesion: 0.22
Nodes (13): User Manual, Audit Trail (latest 100 events), Productivity Analytics, Team & Roles (Provision User), Troubleshooting Guide, Admin Role, README, Global Command Palette (Cmd/Ctrl+K) (+5 more)

### Community 17 - "Excel Export"
Cohesion: 0.20
Nodes (4): export_tasks(), ExcelService, Excel Onboarding Flow (preview-import / commit-import / export), Excel Data Pipeline Endpoints (/api/excel/*)

### Community 18 - "UI/UX Design Spec"
Cohesion: 0.18
Nodes (11): Excel Two-Way Synchronization with Import Preview, UI/UX Design Specification, Application Layout (Sidebar/Topbar/Drawer), Excel Data Center UI (ExcelImportModal / ExportButton), Priority Tokens, Semantic Status Tokens, WCAG 2.1 AA Accessibility, PostgreSQL Native Enums (user_role, task_status, task_priority, ...) (+3 more)

### Community 19 - "Product Capabilities"
Cohesion: 0.17
Nodes (12): Ctrl/Cmd K Command Palette, Four Ways to Work (List, Kanban, Calendar, Drawer), Governance (Provisioning, Audit Trail, Analytics), Administration Workflow, Daily Work Flow (Individual Contributor), Engineering Workflow (Branch, PR, Vercel Deploy), Knowledge Graph Refresh (graphify update), task_activity_logs (Immutable Activity Log) (+4 more)

### Community 20 - "Vercel Config"
Cohesion: 0.18
Nodes (10): includeFiles, maxDuration, buildCommand, functions, api/index.py, headers, installCommand, outputDirectory (+2 more)

### Community 21 - "Auth Requirements (SRS)"
Cohesion: 0.24
Nodes (10): Token Lifecycle (login / refresh / logout), Software Requirements Specification (SRS), IEEE Std 830-1998, SRS-AI-001 Natural Language Task Extraction, SRS-AUTH-001 User Login, SRS-AUTH-002 Token Refresh & Rotation, SRS-EXC-002 Filtered Excel Export, SRS-TASK-003 Kanban Status Drag-and-Drop (+2 more)

### Community 22 - "API Reference & AI Specs"
Cohesion: 0.20
Nodes (10): SRS-AI-002 Subtask Checklist Decomposition, AICopilotDrawer, API Reference, Administrative Governance Endpoints (/api/admin/*), AI Copilot Endpoints (/api/ai/*), Response Envelope {success,data,message,error,meta}, Task Orchestration Endpoints (/api/tasks/*), Deterministic Heuristic Fallback Engine (+2 more)

### Community 23 - "Proposal: Scope & Risks"
Cohesion: 0.22
Nodes (7): HCCDI TaskPilot, TaskPilot Tour Video, Out of Scope (Notifications, SSO, Mobile, Multi-tenancy), Product Proposal (TaskPilot), Roles: Admin and User (RBAC), Rollout Plan (Deploy, Pilot, Review, Expand), Success Measures

### Community 24 - "RBAC & Implementation Plan"
Cohesion: 0.33
Nodes (8): OWASP Top 10 Threat Model, Implementation Plan & WBS, app.core.deps (Auth & RBAC DI), app.core.security, Phase 1: Database Schema & Excel Migration, Phase 2: FastAPI Backend Engine, Phase 3: React Frontend, Work Breakdown Structure (3 phases)

### Community 25 - "Proposal: Architecture & Cost"
Cohesion: 0.28
Nodes (9): AI Task Copilot, TaskPilot Architecture (React SPA + FastAPI + PostgreSQL), Cost Model (Vercel + Neon free tiers), Neon PostgreSQL, Vercel Hosting, ai_interactions Log, AI Copilot Parse-Task Flow, Deterministic Heuristic Engine (+1 more)

### Community 26 - "Excel Schemas"
Cohesion: 0.39
Nodes (4): ExcelImportCommitRequest, ExcelImportPreviewResponse, ExcelImportResultResponse, ExcelTaskPreviewRow

### Community 27 - "Backend Dependencies"
Cohesion: 0.25
Nodes (8): Backend Python Requirements, bcrypt, FastAPI, openpyxl, psycopg 3, Pydantic v2, SQLAlchemy 2, Salted Bcrypt Password Hashing (cost 12)

### Community 28 - "Schema Migration"
Cohesion: 0.25
Nodes (8): 19 Tables / 6 Enums / 20 Indexes / 7 Triggers, Deployment Topology (Nginx + FastAPI instances), 001_initial_schema.sql, Neon Project orange-snow-72696664 (HCCDI Task Manager), Requirements Traceability Matrix (REQ-01..12), verify_migration.py, Neon Serverless PostgreSQL, System Architecture (React SPA -> FastAPI -> SQLAlchemy -> Neon)

### Community 29 - "Excel Legacy Migration"
Cohesion: 0.39
Nodes (8): SRS-EXC-001 Validated Excel Import, Initial Seed Data (2 users, 3 tasks), Tasks_and_Users.xlsx (Legacy Workbook), Legacy Task Sheet, Legacy Users Sheet, Tasks_and_Users_Updated.xlsx (Normalized Workbook), Normalized Task Sheet (with ID, User ID), Normalized Users Sheet (with ID, Role, Task IDs)

### Community 30 - "Deployment Guide"
Cohesion: 0.29
Nodes (8): Deployment Guide (Vercel + Neon), Day-Two Operations (rollback, schema change, secret rotation), Environment Variables (DATABASE_URL, JWT_SECRET_KEY, AI_*), Function Limits (30s maxDuration, in-memory Excel), 001_initial_schema.sql Migration, Vercel Deployment (static CDN + Python function), vercel.json Routing (/api, /docs -> function; SPA fallback), Root Requirements (Vercel function)

### Community 32 - "Settings & Secret Guard"
Cohesion: 0.29
Nodes (5): Settings, PyJWT, JWT Secret Startup Guard, Authentication & Profiles Endpoints (/api/auth/*), Stateless JWT with Refresh Token Rotation

### Community 38 - "Priority Scoring"
Cohesion: 0.50
Nodes (3): SRS-AI-003 Explainable Priority Recommendation, Principle: AI explains itself, Explainable Prioritization

## Knowledge Gaps
- **54 isolated node(s):** `clsx`, `@types/canvas-confetti`, `@types/node`, `@types/react`, `@types/react-dom` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 280 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `LandingPage()` connect `Landing Page & Design System` to `React App, Routing & Views`?**
  _High betweenness centrality (0.285) - this node is a cross-community bridge._
- **Are the 64 inferred relationships involving `User` (e.g. with `admin_create_user()` and `admin_update_user()`) actually correct?**
  _`User` has 64 INFERRED edges - model-reasoned connections that need verification._
- **What connects `clsx`, `@types/canvas-confetti`, `@types/node` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React App, Routing & Views` be split into smaller, more focused modules?**
  _Cohesion score 0.05471226021684737 - nodes in this community are weakly interconnected._
- **Why does `seed()` connect `Backend Module Graph` to `Task & Subtask API`, `Admin Governance API`, `AI Copilot Endpoints`, `Projects API`, `Excel Onboarding Workflow`, `User Manual`, `Deployment Guide`?**
  _High betweenness centrality (0.251) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `ResponseEnvelope` (e.g. with `admin_create_user()` and `admin_update_user()`) actually correct?**
  _`ResponseEnvelope` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Should `Task & Subtask API` be split into smaller, more focused modules?**
  _Cohesion score 0.06539753639417693 - nodes in this community are weakly interconnected._