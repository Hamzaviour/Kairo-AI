# API Reference
## Project: HCCDI TaskPilot
**Document Version:** 1.0.0  
**Status:** Generated from the FastAPI OpenAPI schema  
**Date:** October 2026  

---

All endpoints live under `/api` and return the envelope `{ success, data, message, error, meta }`. Authenticated calls send `Authorization: Bearer <access_token>` from `POST /api/auth/login`. Interactive docs with request/response schemas: **`/docs`** (Swagger) and **`/redoc`** on any running instance; raw schema at `/api/openapi.json`.

**Access column:** *Public* — no token; *Bearer* — any signed-in user, results limited to the caller's scope (other users' task IDs return `404`); *Admin* — admin role required (`403` otherwise).

## Health & System

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Verify backend and live database connectivity. |

## Authentication & Profiles

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate user with email and password, returning access and refresh tokens. |
| `POST` | `/api/auth/register` | Public | Register a new user account. |
| `POST` | `/api/auth/refresh` | Public | Rotates refresh token and returns new access & refresh token pair. |
| `POST` | `/api/auth/logout` | Bearer | Revokes the current refresh token. |
| `GET` | `/api/auth/me` | Bearer | Get authenticated user profile, preferences, and task statistics. |
| `PUT` | `/api/auth/me` | Bearer | Update profile details of the current user. |
| `PUT` | `/api/auth/preferences` | Bearer | Update user UI/UX and notification preferences. |
| `POST` | `/api/auth/change-password` | Bearer | Change current user password. |

## Task Orchestration

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | Bearer | List tasks accessible to the authenticated user. |
| `POST` | `/api/tasks` | Bearer | Create a new task with creator derived strictly from the authenticated session. |
| `GET` | `/api/tasks/{task_id}` | Bearer | Retrieve full task details with subtasks, tags, and comments. Enforces data isolation. |
| `PUT` | `/api/tasks/{task_id}` | Bearer | Update task details with audit logging and permissions check. |
| `DELETE` | `/api/tasks/{task_id}` | Bearer | Soft delete / archive a task. |
| `GET` | `/api/tasks/{task_id}/activity` | Bearer | List the immutable activity log of a task, newest first. Enforces data isolation. |
| `PATCH` | `/api/tasks/{task_id}/status` | Bearer | Fast status transition and position ordering for Kanban board. |
| `POST` | `/api/tasks/{task_id}/duplicate` | Bearer | Clones a task and its subtasks. |
| `POST` | `/api/tasks/bulk` | Bearer | Bulk update status, priority, or project on authorized tasks. |
| `GET` | `/api/tasks/meta/categories` | Bearer | List all task categories. |
| `POST` | `/api/tasks/meta/categories` | Bearer | Create task category. |
| `GET` | `/api/tasks/meta/tags` | Bearer | List all task tags. |
| `POST` | `/api/tasks/meta/tags` | Bearer | Create task tag. |

## Subtask Checklists

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/api/tasks/{task_id}/subtasks` | Bearer | Add a checklist subtask to an authorized task. |
| `PATCH` | `/api/subtasks/{subtask_id}` | Bearer | Toggle subtask completion or update its title. |
| `DELETE` | `/api/subtasks/{subtask_id}` | Bearer | Delete a subtask. |

## Task Discussions & Comments

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/tasks/{task_id}/comments` | Bearer | List comments on a task with data isolation checks. |
| `POST` | `/api/tasks/{task_id}/comments` | Bearer | Add a comment to an authorized task. |
| `DELETE` | `/api/comments/{comment_id}` | Bearer | Delete a comment (author or admin only). |

## Project Workspaces

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Bearer | List projects accessible to user. |
| `POST` | `/api/projects` | Bearer | Create a new project workspace. |
| `GET` | `/api/projects/{project_id}` | Bearer | Get project details. |
| `PUT` | `/api/projects/{project_id}` | Bearer | Update project details (owner or admin only). |
| `DELETE` | `/api/projects/{project_id}` | Bearer | Archive a project. |
| `POST` | `/api/projects/{project_id}/members` | Bearer | Add member to project. |
| `DELETE` | `/api/projects/{project_id}/members/{user_id}` | Bearer | Remove member from project. |

## In-App Notifications

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | Bearer | List notifications for the authenticated user and return unread count. |
| `PATCH` | `/api/notifications/{notification_id}/read` | Bearer | Mark a notification as read. |
| `POST` | `/api/notifications/mark-all-read` | Bearer | Mark all unread notifications as read for current user. |

## AI Copilot & Automation

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/api/ai/parse-task` | Bearer | Parses natural language notes into structured task parameters |
| `POST` | `/api/ai/breakdown` | Bearer | Decomposes a broad task into actionable subtask checklist items. |
| `POST` | `/api/ai/prioritize` | Bearer | Recommends explainable priority scoring considering due date proximity, |
| `POST` | `/api/ai/smart-schedule` | Bearer | Generates an optimized daily schedule incorporating strictly the authenticated user's |
| `POST` | `/api/ai/chat` | Bearer | Natural-language task assistant strictly scoped to the requesting user's permitted tasks. |

## Productivity Analytics

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/analytics/user` | Bearer | Calculates personal productivity statistics for the current user. |
| `GET` | `/api/analytics/admin` | Admin | Calculates organization-wide metrics across all users and tasks (Admin only). |

## Excel Data Pipeline

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/excel/export` | Bearer | Exports all permitted tasks for the authenticated user as a styled Excel workbook. |
| `POST` | `/api/excel/preview-import` | Bearer | Upload an Excel (.xlsx) file to validate schema headers and data rows. |
| `POST` | `/api/excel/commit-import` | Bearer | Imports validated rows from the preview into the live database. |

## Administrative Governance

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/users` | Admin | List all user accounts in the system with task counts (Admin only). |
| `POST` | `/api/admin/users` | Admin | Admin provisions a new user account with specified role. |
| `PUT` | `/api/admin/users/{user_id}` | Admin | Admin updates user profile, changes role, or activates/deactivates account. |
| `GET` | `/api/admin/audit-logs` | Admin | Global organization-wide activity logs (Admin only). |

## Example: parse a sentence into a task

```bash
TOKEN=$(curl -s -X POST $BASE/api/auth/login -H 'content-type: application/json' \
  -d '{"email":"sarah.jenkins@enterprise.com","password":"Secur3_Token#88"}' | jq -r .data.access_token)

curl -s -X POST $BASE/api/ai/parse-task -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"text":"Submit Q4 budget report to Alex by next Thursday with urgent priority"}' | jq .data
```

Returns `title: "Submit Q4 budget report to Alex"`, `priority: "urgent"`, a `due_date` on the coming Thursday at 17:00 UTC and five suggested subtasks.
