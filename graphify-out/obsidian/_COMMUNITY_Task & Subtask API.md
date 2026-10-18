---
type: community
members: 95
---

# Task & Subtask API

**Members:** 95 nodes

## Members
- [[Add a checklist subtask to an authorized task.]] - rationale - backend/app/api/endpoints/subtasks.py
- [[Base]] - code
- [[BaseModel]] - code
- [[BaseModel_1]] - code
- [[Bulk update multiple tasks belonging to authorized user.]] - rationale - backend/app/services/task_service.py
- [[Bulk update status, priority, or project on authorized tasks.]] - rationale - backend/app/api/endpoints/tasks.py
- [[BulkTaskUpdate]] - code - backend/app/schemas/task.py
- [[Clones a task and its subtasks.]] - rationale - backend/app/api/endpoints/tasks.py
- [[Convention Task Endpoints Use Scope Filter + 404 Test]] - rationale - docs/11_WORKFLOWS.md
- [[Create a new task with creator derived strictly from the authenticated session.]] - rationale - backend/app/api/endpoints/tasks.py
- [[Create a task with permission checks and activity logging.]] - rationale - backend/app/services/task_service.py
- [[Create task category.]] - rationale - backend/app/api/endpoints/tasks.py
- [[Duplicate an existing task with subtasks.]] - rationale - backend/app/services/task_service.py
- [[Fast status and position update for Kanban drag-and-drop.]] - rationale - backend/app/services/task_service.py
- [[Fast status transition and position ordering for Kanban board.]] - rationale - backend/app/api/endpoints/tasks.py
- [[Fetch a task ensuring the user has permission. Raises 404 (not 403) to prevent…]] - rationale - backend/app/services/task_service.py
- [[Isolated Workspaces (Scope Filter)]] - rationale - docs/10_PRODUCT_PROPOSAL.md
- [[List all task categories.]] - rationale - backend/app/api/endpoints/tasks.py
- [[List tasks accessible to the authenticated user. Admins see organization-wide…]] - rationale - backend/app/api/endpoints/tasks.py
- [[List the immutable activity log of a task, newest first. Enforces data…]] - rationale - backend/app/api/endpoints/tasks.py
- [[Log an event into the immutable task activity log.]] - rationale - backend/app/services/task_service.py
- [[PaginatedResponse]] - code - backend/app/schemas/common.py
- [[Per-Request Isolation Check]] - concept - docs/11_WORKFLOWS.md
- [[ResponseEnvelope]] - code - backend/app/schemas/common.py
- [[Retrieve all project IDs where user is an active member or owner.]] - rationale - backend/app/services/task_service.py
- [[Retrieve full task details with subtasks, tags, and comments. Enforces data…]] - rationale - backend/app/api/endpoints/tasks.py
- [[Returns a query restricted to tasks the user is permitted to view. Admins see…]] - rationale - backend/app/services/task_service.py
- [[Session]] - code
- [[Session_1]] - code
- [[Session_2]] - code
- [[Soft delete  archive a task.]] - rationale - backend/app/api/endpoints/tasks.py
- [[Soft delete or archive a task.]] - rationale - backend/app/services/task_service.py
- [[Subtask_1]] - code - backend/app/models/task.py
- [[SubtaskCreate]] - code - backend/app/schemas/task.py
- [[SubtaskResponse]] - code - backend/app/schemas/task.py
- [[SubtaskUpdate]] - code - backend/app/schemas/task.py
- [[Task_1]] - code - backend/app/models/task.py
- [[TaskActivityLog_1]] - code - backend/app/models/collaboration.py
- [[TaskCategory]] - code - backend/app/models/task.py
- [[TaskCategoryCreate]] - code - backend/app/schemas/task.py
- [[TaskCategoryResponse]] - code - backend/app/schemas/task.py
- [[TaskCreate]] - code - backend/app/schemas/task.py
- [[TaskDetailResponse]] - code - backend/app/schemas/task.py
- [[TaskResponse]] - code - backend/app/schemas/task.py
- [[TaskStatusUpdate]] - code - backend/app/schemas/task.py
- [[TaskTag_1]] - code - backend/app/models/task.py
- [[TaskTagAssignment]] - code - backend/app/models/task.py
- [[TaskTagCreate]] - code - backend/app/schemas/task.py
- [[TaskTagResponse]] - code - backend/app/schemas/task.py
- [[TaskUpdate]] - code - backend/app/schemas/task.py
- [[Toggle subtask completion or update its title.]] - rationale - backend/app/api/endpoints/subtasks.py
- [[UUID]] - code
- [[UUID_1]] - code
- [[UUID_2]] - code
- [[Update task details with audit logging and permissions check.]] - rationale - backend/app/api/endpoints/tasks.py
- [[Update task fields with audit logging.]] - rationale - backend/app/services/task_service.py
- [[add_subtask()]] - code - backend/app/api/endpoints/subtasks.py
- [[bulk_update()]] - code - backend/app/api/endpoints/tasks.py
- [[bulk_update_tasks()]] - code - backend/app/services/task_service.py
- [[create_category()]] - code - backend/app/api/endpoints/tasks.py
- [[create_new_task()]] - code - backend/app/api/endpoints/tasks.py
- [[create_tag()]] - code - backend/app/api/endpoints/tasks.py
- [[create_task()]] - code - backend/app/services/task_service.py
- [[delete]] - code
- [[delete_1]] - code
- [[delete_subtask()]] - code - backend/app/api/endpoints/subtasks.py
- [[delete_task()]] - code - backend/app/services/task_service.py
- [[delete_task_route()]] - code - backend/app/api/endpoints/tasks.py
- [[duplicate_task()]] - code - backend/app/services/task_service.py
- [[duplicate_task_route()]] - code - backend/app/api/endpoints/tasks.py
- [[get]] - code
- [[get_scoped_tasks_query()]] - code - backend/app/services/task_service.py
- [[get_task_activity()]] - code - backend/app/api/endpoints/tasks.py
- [[get_task_details()]] - code - backend/app/api/endpoints/tasks.py
- [[get_task_or_404()]] - code - backend/app/services/task_service.py
- [[get_user_project_ids()]] - code - backend/app/services/task_service.py
- [[list_categories()]] - code - backend/app/api/endpoints/tasks.py
- [[list_tags()]] - code - backend/app/api/endpoints/tasks.py
- [[list_tasks()]] - code - backend/app/api/endpoints/tasks.py
- [[log_task_activity()]] - code - backend/app/services/task_service.py
- [[math]] - concept
- [[patch]] - code
- [[patch_1]] - code
- [[post]] - code
- [[post_1]] - code
- [[put]] - code
- [[schemas__init__.py]] - code - backend/app/schemas/__init__.py
- [[schemastask.py]] - code - backend/app/schemas/task.py
- [[task_service.py]] - code - backend/app/services/task_service.py
- [[tasks.py]] - code - backend/app/api/endpoints/tasks.py
- [[update_existing_task()]] - code - backend/app/api/endpoints/tasks.py
- [[update_status()]] - code - backend/app/api/endpoints/tasks.py
- [[update_subtask()]] - code - backend/app/api/endpoints/subtasks.py
- [[update_task()]] - code - backend/app/services/task_service.py
- [[update_task_status()]] - code - backend/app/services/task_service.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Task__Subtask_API
SORT file.name ASC
```

## Connections to other communities
- 99 edges to [[_COMMUNITY_API Wiring & Vercel Entrypoint]]
- 51 edges to [[_COMMUNITY_AI Copilot Endpoints]]
- 44 edges to [[_COMMUNITY_Admin Governance API]]
- 17 edges to [[_COMMUNITY_Projects API]]
- 5 edges to [[_COMMUNITY_Excel Schemas]]
- 4 edges to [[_COMMUNITY_Excel Import API]]
- 3 edges to [[_COMMUNITY_Backend Module Graph]]
- 3 edges to [[_COMMUNITY_Product Capabilities]]
- 3 edges to [[_COMMUNITY_Proposal Scope & Risks]]
- 2 edges to [[_COMMUNITY_Excel Export]]
- 1 edge to [[_COMMUNITY_API Reference & AI Specs]]
- 1 edge to [[_COMMUNITY_User Manual]]
- 1 edge to [[_COMMUNITY_Schema Migration]]
- 1 edge to [[_COMMUNITY_Technical Requirements (TRD)]]
- 1 edge to [[_COMMUNITY_Proposal Architecture & Cost]]

## Top bridge nodes
- [[schemas__init__.py]] - degree 67, connects to 5 communities
- [[ResponseEnvelope]] - degree 63, connects to 5 communities
- [[task_service.py]] - degree 44, connects to 5 communities
- [[Task_1]] - degree 25, connects to 5 communities
- [[log_task_activity()]] - degree 22, connects to 4 communities