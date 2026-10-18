# Software Requirements Specification (SRS)
## Project: AI-Powered Task Management & To-Do Platform
**Standard:** IEEE Std 830-1998 Compliant  
**Document Version:** 1.0.0  
**Status:** Approved  
**Date:** October 2026  

---

## 1. Introduction

### 1.1 Purpose
This document provides a formal and complete specification of the functional, performance, security, and interface requirements for the **AI-Powered Task Management & To-Do Platform**. It serves as the baseline contract between stakeholders, systems architects, software engineers, and QA personnel.

### 1.2 Scope
The software system encompasses:
- A cloud-native FastAPI backend delivering RESTful JSON endpoints.
- A single-page client interface built with React 18, TypeScript, and Tailwind CSS.
- An enterprise PostgreSQL 18 relational database hosted on Neon.
- An integrated AI Task Assistant and bidirectional Microsoft Excel data engine.

### 1.3 Definitions, Acronyms, and Abbreviations
- **RBAC**: Role-Based Access Control.
- **JWT**: JSON Web Token.
- **IDOR**: Insecure Direct Object Reference.
- **ORM**: Object-Relational Mapping (SQLAlchemy).
- **DTO**: Data Transfer Object (Pydantic model).
- **CRUD**: Create, Read, Update, Delete.
- **p95**: 95th Percentile Latency.

---

## 2. Overall Description

### 2.1 Product Perspective
The system replaces legacy, fragmented spreadsheet workbooks with an enterprise web application. It acts as a centralized operational hub providing real-time task coordination, automated reminders, and AI-assisted workflow optimization.

### 2.2 User Classes and Characteristics
1. **System Administrator (`admin`)**:
   - Technical proficiency: Moderate to High.
   - Responsibilities: User provisioning, role assignment, project hierarchy setup, cross-team workload balance, audit log oversight, system configuration.
2. **Regular User (`user`)**:
   - Technical proficiency: General computer literacy.
   - Responsibilities: Task execution, status transitions, checklist completion, time tracking, AI interaction for personal task planning.

### 2.3 Operating Environment
- **Server**: Containerized Python 3.14 / Uvicorn ASGI server running on Linux / Windows.
- **Database**: PostgreSQL 18 with `uuid-ossp` and `pgcrypto` extensions.
- **Client**: Modern web browsers (Google Chrome 110+, Mozilla Firefox 110+, Apple Safari 16+, Microsoft Edge 110+).

---

## 3. Specific Functional Requirements

### 3.1 Module: Authentication & Session Management (AUTH)

#### SRS-AUTH-001: User Login
- **Inputs**: `email` (valid RFC 5322 string), `password` (string).
- **Processing**:
  1. Retrieve user record by email. If not found or `is_active == false`, return HTTP 401.
  2. Verify password with `bcrypt.checkpw(password, user.password_hash)`. If mismatch, return HTTP 401.
  3. Generate JWT access token with 60-minute expiry.
  4. Generate cryptographic refresh token, store SHA-256 hash in `refresh_tokens` table.
- **Outputs**: HTTP 200 with JSON payload `{ access_token, refresh_token, token_type: "bearer", user: UserProfile }`.
- **Acceptance Criteria**: Passwords must never be logged or returned in plain text. Failed login attempts return generic *"Invalid email or password"* message.

#### SRS-AUTH-002: Token Refresh & Rotation
- **Inputs**: `refresh_token` (string in body).
- **Processing**: Verify token validity and expiration. Check database for active token hash. Mark current token as revoked (`is_revoked = TRUE`). Issue new access token and new refresh token.
- **Outputs**: HTTP 200 with new token pair.
- **Acceptance Criteria**: Replaying an expired or already revoked refresh token results in HTTP 401.

---

### 3.2 Module: Task Management & Workflow (TASK)

#### SRS-TASK-001: Task Creation
- **Inputs**: `title` (1–500 chars), `description` (optional text), `url` (optional URI), `image_url` (optional URI), `priority` (`low`|`medium`|`high`|`urgent`), `due_date` (optional ISO 8601 UTC), `project_id` (optional UUID), `category_id` (optional UUID), `assignee_id` (optional UUID).
- **Processing**:
  1. Derive `creator_id` from authenticated session.
  2. If user is regular `user`, restrict `assignee_id` to self unless task belongs to a project where user has contributor privileges.
  3. Insert into `tasks` table with default status `todo`.
  4. Write entry into `task_activity_logs` recording action `created`.
  5. If `assignee_id != creator_id`, trigger `task_assigned` notification.
- **Outputs**: HTTP 201 with created Task object.
- **Acceptance Criteria**: Empty or whitespace-only titles return HTTP 422. Non-existent foreign keys return HTTP 400.

#### SRS-TASK-002: Task Data Isolation & Retrieval
- **Inputs**: Query parameters: `status`, `priority`, `project_id`, `search` (text), `skip` (int), `limit` (int).
- **Processing**:
  1. If `current_user.role == 'admin'`, query spans all non-archived tasks.
  2. If `current_user.role == 'user'`, query is strictly filtered by:
     $$\text{Task.creator\_id} == \text{current\_user.id} \lor \text{Task.assignee\_id} == \text{current\_user.id} \lor \text{Task.project\_id} \in \text{user\_projects}$$
- **Outputs**: HTTP 200 with `{ total: int, items: List[Task], page: int, pages: int }`.
- **Acceptance Criteria**: Direct URL navigation to `/tasks/{uuid}` belonging to another user must return HTTP 404 (preventing UUID enumeration).

#### SRS-TASK-003: Kanban Status Drag-and-Drop
- **Inputs**: `task_id` (UUID), `new_status` (enum), `new_position` (integer).
- **Processing**: Verify user edit permission. Update `status` and `position`. If transitioned to `completed`, automatically populate `completed_at = NOW()`. Log status change in audit log.
- **Outputs**: HTTP 200 with updated task.

---

### 3.3 Module: AI Assistant & Automation (AI)

#### SRS-AI-001: Natural Language Task Extraction
- **Inputs**: `text` (raw natural language string, 5–2000 chars).
- **Processing**: Parse intent, task title, action items, target deadline, priority keywords, and tags. Format into structured DTO.
- **Outputs**: HTTP 200 with parsed fields: `{ title, description, priority, due_date, suggested_subtasks }`.
- **Acceptance Criteria**: Recognizes relative dates (*"tomorrow at 5pm"*, *"next Monday"*) and urgency markers (*"urgent"*, *"critical"*, *"asap"*).

#### SRS-AI-002: Automated Subtask Checklist Decomposition
- **Inputs**: `task_title`, `task_description`.
- **Processing**: Deconstruct broad objective into 3 to 7 sequential, actionable checklist items.
- **Outputs**: HTTP 200 with `{ subtasks: List[str] }`.
- **Acceptance Criteria**: Works reliably using both cloud LLM API and built-in deterministic heuristic fallback.

#### SRS-AI-003: Explainable Priority Recommendation
- **Inputs**: `task_id` (UUID).
- **Processing**: Calculate priority score based on:
  $$\text{Score} = w_1 \cdot \text{ProximityToDue} + w_2 \cdot \text{BlockerWeight} + w_3 \cdot \text{EffortRatio}$$
- **Outputs**: HTTP 200 with `{ recommended_priority, confidence, rationale: str }`.

---

### 3.4 Module: Excel Import & Export (EXCEL)

#### SRS-EXC-001: Validated Excel Import
- **Inputs**: Multipart upload of `.xlsx` or `.csv` file.
- **Processing**:
  1. Inspect sheet names: locate `Task` / `Tasks` and `Users`.
  2. Parse columns with fuzzy header matching (e.g., *"Task Heading"*, *"Title"*, *"Name"*).
  3. Validate foreign key references (`User ID` -> `Users.id`).
  4. Detect duplicate records or missing mandatory values.
  5. Return validation dry-run report without committing to database.
- **Outputs**: HTTP 200 with `{ valid_records: int, errors: List[str], preview: List[dict] }`.

#### SRS-EXC-002: Filtered Excel Export
- **Inputs**: Export filters: `status`, `project_id`, `date_range`.
- **Processing**: Fetch permitted tasks. Generate dynamic `.xlsx` with styling, headers, and data validation dropdowns using OpenPyXL.
- **Outputs**: Binary stream with `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

---

## 4. Non-Functional System Attributes

### 4.1 Security Requirements
- **SEC-1**: Cross-Origin Resource Sharing (CORS) restricted to verified client URLs.
- **SEC-2**: Request rate limiting: 100 requests/min per IP on standard routes; 10 requests/min on authentication routes.
- **SEC-3**: All input fields validated against XSS and injection via Pydantic regex patterns and HTML escaping.

### 4.2 Performance Requirements
- **PERF-1**: Authentication token verification must complete in under 5ms.
- **PERF-2**: Task list queries with up to 100 items returned within 80ms.
- **PERF-3**: Excel generation of 1,000 tasks completed in under 1.5 seconds.

### 4.3 Reliability & Availability
- **REL-1**: Automatic database connection recovery upon network blips via SQLAlchemy `pool_pre_ping`.
- **REL-2**: Graceful degradation: If external AI API fails or is rate-limited, system automatically executes the heuristic fallback engine with zero downtime.

---

## 5. Requirements Traceability Matrix

| Requirement ID | Module | Priority | Verification Method |
|---|---|---|---|
| SRS-AUTH-001 | Authentication | High | Unit & Integration Test |
| SRS-AUTH-002 | Token Refresh | High | Integration Test |
| SRS-TASK-001 | Task Creation | High | Automated API Test |
| SRS-TASK-002 | Data Isolation | Critical | Security IDOR Test Suite |
| SRS-TASK-003 | Kanban Transitions | High | E2E Browser & API Test |
| SRS-AI-001 | NL Task Parse | Medium | Unit & Contract Test |
| SRS-AI-002 | Subtask Breakdown | Medium | Unit Test |
| SRS-AI-003 | Prioritization | Medium | Algorithmic Benchmark |
| SRS-EXC-001 | Excel Import | High | Integration Test with Sample Files |
| SRS-EXC-002 | Excel Export | High | Binary Inspection Test |
