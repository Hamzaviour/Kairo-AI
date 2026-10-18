from fastapi import APIRouter
from app.api.endpoints import (
    auth, tasks, subtasks, projects, comments,
    notifications, ai, analytics, admin, excel
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Profiles"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Task Orchestration"])
api_router.include_router(subtasks.router, tags=["Subtask Checklists"])
api_router.include_router(projects.router, prefix="/projects", tags=["Project Workspaces"])
api_router.include_router(comments.router, tags=["Task Discussions & Comments"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["In-App Notifications"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Copilot & Automation"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Productivity Analytics"])
api_router.include_router(admin.router, prefix="/admin", tags=["Administrative Governance"])
api_router.include_router(excel.router, prefix="/excel", tags=["Excel Data Pipeline"])
