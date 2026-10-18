---
type: community
members: 89
---

# API Wiring & Vercel Entrypoint

**Members:** 89 nodes

## Members
- [[AIInteraction]] - code - backend/app/models/productivity.py
- [[Add a comment to an authorized task.]] - rationale - backend/app/api/endpoints/comments.py
- [[AdminAnalyticsResponse]] - code - backend/app/schemas/analytics.py
- [[Base_1]] - code
- [[Base_2]] - code
- [[BaseModel_2]] - code
- [[Calculates organization-wide metrics across all users and tasks (Admin only).]] - rationale - backend/app/api/endpoints/analytics.py
- [[Calculates personal productivity statistics for the current user.]] - rationale - backend/app/api/endpoints/analytics.py
- [[Create in-app notification for a user.]] - rationale - backend/app/services/notification_service.py
- [[Delete a comment (author or admin only).]] - rationale - backend/app/api/endpoints/comments.py
- [[FocusSession]] - code - backend/app/models/productivity.py
- [[List comments on a task with data isolation checks.]] - rationale - backend/app/api/endpoints/comments.py
- [[List notifications for the authenticated user and return unread count.]] - rationale - backend/app/api/endpoints/notifications.py
- [[Mark a notification as read.]] - rationale - backend/app/api/endpoints/notifications.py
- [[Mark all unread notifications as read for current user.]] - rationale - backend/app/api/endpoints/notifications.py
- [[Notification]] - code - backend/app/models/productivity.py
- [[Pin the psycopg 3 driver; VercelNeon integrations hand out postgres URLs.]] - rationale - backend/app/core/database.py
- [[PriorityDistribution]] - code - backend/app/schemas/analytics.py
- [[RecurringTaskRule]] - code - backend/app/models/productivity.py
- [[Session_4]] - code
- [[Session_5]] - code
- [[Session_6]] - code
- [[Session_7]] - code
- [[StatusDistribution]] - code - backend/app/schemas/analytics.py
- [[TaskAttachment]] - code - backend/app/models/collaboration.py
- [[TaskComment_1]] - code - backend/app/models/collaboration.py
- [[TaskDependency]] - code - backend/app/models/task.py
- [[TimeEntry]] - code - backend/app/models/productivity.py
- [[UUID_3]] - code
- [[UUID_4]] - code
- [[UUID_5]] - code
- [[UserProductivityStats]] - code - backend/app/schemas/analytics.py
- [[UserWorkloadItem]] - code - backend/app/schemas/analytics.py
- [[Vercel serverless entrypoint exposes the FastAPI backend as one Python…]] - rationale - api/index.py
- [[_normalize_db_url()]] - code - backend/app/core/database.py
- [[add_comment()]] - code - backend/app/api/endpoints/comments.py
- [[admin.py]] - code - backend/app/api/endpoints/admin.py
- [[api.py]] - code - backend/app/api/api.py
- [[comments.py]] - code - backend/app/api/endpoints/comments.py
- [[common.py]] - code - backend/app/schemas/common.py
- [[config.py]] - code - backend/app/core/config.py
- [[create_notification()]] - code - backend/app/services/notification_service.py
- [[database.py]] - code - backend/app/core/database.py
- [[datetime]] - code
- [[delete_2]] - code
- [[delete_comment()]] - code - backend/app/api/endpoints/comments.py
- [[deps.py]] - code - backend/app/core/deps.py
- [[endpointsanalytics.py]] - code - backend/app/api/endpoints/analytics.py
- [[endpointsexcel.py]] - code - backend/app/api/endpoints/excel.py
- [[excel_service.py]] - code - backend/app/services/excel_service.py
- [[fastapi_1]] - concept
- [[fastapi_middleware_cors]] - concept
- [[fastapi_responses]] - concept
- [[fastapi_security]] - concept
- [[get_2]] - code
- [[get_3]] - code
- [[get_4]] - code
- [[get_admin_analytics()]] - code - backend/app/api/endpoints/analytics.py
- [[get_current_active_user()]] - code - backend/app/core/deps.py
- [[get_current_admin()]] - code - backend/app/core/deps.py
- [[get_db()]] - code - backend/app/core/database.py
- [[get_user_productivity()]] - code - backend/app/api/endpoints/analytics.py
- [[index.py]] - code - api/index.py
- [[list_notifications()]] - code - backend/app/api/endpoints/notifications.py
- [[list_task_comments()]] - code - backend/app/api/endpoints/comments.py
- [[main.py]] - code - backend/app/main.py
- [[mark_all_read()]] - code - backend/app/api/endpoints/notifications.py
- [[mark_notification_read()]] - code - backend/app/api/endpoints/notifications.py
- [[models__init__.py]] - code - backend/app/models/__init__.py
- [[modelscollaboration.py]] - code - backend/app/models/collaboration.py
- [[modelsproductivity.py]] - code - backend/app/models/productivity.py
- [[modelsproject.py]] - code - backend/app/models/project.py
- [[modelstask.py]] - code - backend/app/models/task.py
- [[modelsuser.py]] - code - backend/app/models/user.py
- [[notification_service.py]] - code - backend/app/services/notification_service.py
- [[notifications.py]] - code - backend/app/api/endpoints/notifications.py
- [[os]] - concept
- [[patch_2]] - code
- [[post_2]] - code
- [[post_3]] - code
- [[pydantic_settings]] - concept
- [[schemasanalytics.py]] - code - backend/app/schemas/analytics.py
- [[sqlalchemy]] - concept
- [[sqlalchemy_dialects_postgresql]] - concept
- [[sqlalchemy_orm]] - concept
- [[sqlalchemy_pool]] - concept
- [[subtasks.py]] - code - backend/app/api/endpoints/subtasks.py
- [[typing]] - concept
- [[uuid_9]] - concept

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/API_Wiring__Vercel_Entrypoint
SORT file.name ASC
```

## Connections to other communities
- 99 edges to [[_COMMUNITY_Task & Subtask API]]
- 58 edges to [[_COMMUNITY_Admin Governance API]]
- 44 edges to [[_COMMUNITY_AI Copilot Endpoints]]
- 19 edges to [[_COMMUNITY_Projects API]]
- 8 edges to [[_COMMUNITY_Excel Schemas]]
- 7 edges to [[_COMMUNITY_Excel Tests]]
- 5 edges to [[_COMMUNITY_Test Fixtures & Video Synth]]
- 4 edges to [[_COMMUNITY_Backend Module Graph]]
- 3 edges to [[_COMMUNITY_Excel Export]]
- 2 edges to [[_COMMUNITY_Excel Import API]]
- 2 edges to [[_COMMUNITY_Global Error Handling]]
- 2 edges to [[_COMMUNITY_Health Check]]
- 1 edge to [[_COMMUNITY_Settings & Secret Guard]]
- 1 edge to [[_COMMUNITY_Deployment Guide]]
- 1 edge to [[_COMMUNITY_User Manual]]
- 1 edge to [[_COMMUNITY_Schema Migration]]

## Top bridge nodes
- [[datetime]] - degree 25, connects to 6 communities
- [[excel_service.py]] - degree 20, connects to 6 communities
- [[uuid_9]] - degree 18, connects to 6 communities
- [[endpointsexcel.py]] - degree 25, connects to 5 communities
- [[typing]] - degree 21, connects to 5 communities