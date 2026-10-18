# System Design & Architecture Document
## Project: AI-Powered Task Management & To-Do Platform
**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Chief Technology Architect  
**Date:** October 2026  

---

## 1. Architectural Philosophy & Patterns

The platform implements **Clean Layered Architecture** with distinct separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                 Presentation Layer (React SPA)              │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST
┌──────────────────────────────▼─────────────────────────────┐
│                API Routing Layer (FastAPI Routers)          │
│          - Request Validation (Pydantic v2 DTOs)            │
│          - Authentication & Authorization Dependencies      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼─────────────────────────────┐
│                     Service Layer (Business Logic)         │
│          - Scope resolution & permission enforcement       │
│          - Event logging, notifications & triggers         │
│          - AI pipeline orchestration & fallback            │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼─────────────────────────────┐
│               Data Access Layer (SQLAlchemy 2.0 ORM)        │
│          - Declarative Models, Queries & Transactions       │
│          - Database Session Lifecycle Management            │
└──────────────────────────────┬──────────────────────────────┘
                               │ Connection Pool (PgBouncer)
┌──────────────────────────────▼─────────────────────────────┐
│               Persistence Layer (Neon PostgreSQL 18)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Sequence Diagrams

### 2.1 Authentication & Token Rotation Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant API as FastAPI /api/auth
    participant Security as Security Module (PyJWT/Bcrypt)
    participant DB as Neon PostgreSQL

    User->>API: POST /login (email, password)
    API->>DB: Query User by email
    DB-->>API: User record (with password_hash)
    API->>Security: verify_password(plain, hash)
    Security-->>API: Valid (True)
    API->>Security: create_access_token(user_id, role)
    API->>Security: create_refresh_token(user_id)
    API->>DB: Store hashed refresh_token in refresh_tokens table
    API-->>User: 200 OK (access_token, refresh_token, user_profile)

    Note over User, API: Token Expiration (After 60 minutes)
    User->>API: POST /refresh (refresh_token)
    API->>DB: Verify active token hash
    DB-->>API: Token found and active
    API->>DB: UPDATE refresh_tokens SET is_revoked = TRUE
    API->>Security: Generate new token pair
    API->>DB: Store new refresh_token hash
    API-->>User: 200 OK (new access_token, new refresh_token)
```

---

### 2.2 Private Context-Aware AI Task Creation Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Authenticated User
    participant API as FastAPI /api/ai
    participant AI as AI Engine (Dual Engine)
    participant Tasks as Task Service
    participant DB as Neon PostgreSQL

    User->>API: POST /api/ai/parse-task (natural language text)
    API->>AI: parse_task_nlp(text)
    alt LLM Key Available
        AI->>AI: Query LLM API with strict JSON schema
    else Fallback Mode
        AI->>AI: Execute regex & deterministic intent analyzer
    end
    AI-->>API: ParsedTaskDTO (title, priority, due_date, subtasks)
    API-->>User: 200 OK (Propose structured task for review)

    User->>API: POST /api/tasks (Confirm creation with AI subtasks)
    API->>Tasks: create_task(data, creator=current_user)
    Tasks->>DB: INSERT INTO tasks (title, status='todo', creator_id=user.id)
    loop For each subtask
        Tasks->>DB: INSERT INTO subtasks (task_id, title)
    end
    Tasks->>DB: INSERT INTO task_activity_logs (task_id, action='created')
    DB-->>Tasks: Committed Transaction
    Tasks-->>User: 201 Created (Full Task with Subtasks)
```

---

## 3. Data Flow & Authorization Enforcement

To prevent Insecure Direct Object Reference (IDOR), the backend uses an **inviolable scope filter**:

```mermaid
flowchart TD
    Req[Incoming Client Request] --> AuthCheck{Valid JWT Access Token?}
    AuthCheck -- No --> Ret401[Return 401 Unauthorized]
    AuthCheck -- Yes --> RoleCheck{User Role?}
    
    RoleCheck -- Admin --> AdminScope[Grant Global Tenant Scope]
    RoleCheck -- Regular User --> UserScope[Inject User Constraint Filter:
    - creator_id == current_user.id OR
    - assignee_id == current_user.id OR
    - project_id IN user_project_memberships]

    AdminScope --> QueryExec[Execute Database Query]
    UserScope --> QueryExec
    QueryExec --> FoundCheck{Records Found?}
    FoundCheck -- No --> Ret404[Return 404 Not Found]
    FoundCheck -- Yes --> Ret200[Return 200 OK / Data Payload]
```

---

## 4. Error Handling Strategy & Standard API Envelope

Every API response adheres to a predictable schema:

### 4.1 Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "meta": {
    "timestamp": "2026-10-18T12:00:00Z",
    "request_id": "req_88f91a2e"
  }
}
```

### 4.2 Standard Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task does not exist or you do not have permission to access it",
    "details": []
  },
  "meta": {
    "timestamp": "2026-10-18T12:00:00Z"
  }
}
```

---

## 5. Deployment & Container Topology

```mermaid
graph LR
    subgraph Docker Network
        direction TB
        Nginx[Nginx Reverse Proxy / SSL Termination]
        FastAPI1[FastAPI App Instance 1]
        FastAPI2[FastAPI App Instance 2]
    end

    Client[Web Browser] -->|Port 443 HTTPS| Nginx
    Nginx -->|Load Balancer| FastAPI1
    Nginx -->|Load Balancer| FastAPI2
    FastAPI1 -->|SSL Pooled| Neon[(Neon PostgreSQL Cluster)]
    FastAPI2 -->|SSL Pooled| Neon
```
