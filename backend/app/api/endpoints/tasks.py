from typing import Optional, List
from uuid import UUID
from datetime import datetime
from math import ceil
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.models.task import Task, Subtask, TaskCategory, TaskTag, TaskTagAssignment
from app.schemas.task import (
    TaskCreate, TaskUpdate, TaskStatusUpdate, BulkTaskUpdate,
    TaskResponse, TaskDetailResponse, TaskCategoryResponse, TaskCategoryCreate,
    TaskTagResponse, TaskTagCreate, SubtaskResponse
)
from app.schemas.common import ResponseEnvelope, PaginatedResponse
from app.services.task_service import (
    get_scoped_tasks_query, get_task_or_404, create_task,
    update_task, update_task_status, delete_task, duplicate_task, bulk_update_tasks
)

router = APIRouter()

@router.get("", response_model=ResponseEnvelope[PaginatedResponse[TaskResponse]])
def list_tasks(
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    project_id: Optional[UUID] = Query(None, description="Filter by project"),
    category_id: Optional[UUID] = Query(None, description="Filter by category"),
    assignee_id: Optional[UUID] = Query(None, description="Filter by assignee"),
    search: Optional[str] = Query(None, description="Search keyword in title or description"),
    sort_by: Optional[str] = Query("created_at", description="Sort column (created_at, due_date, priority, position)"),
    sort_order: Optional[str] = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    List tasks accessible to the authenticated user.
    Admins see organization-wide tasks.
    Regular users see only tasks they created, are assigned to, or belong to their projects.
    """
    query = get_scoped_tasks_query(db, current_user)

    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if category_id:
        query = query.filter(Task.category_id == category_id)
    if assignee_id:
        query = query.filter(Task.assignee_id == assignee_id)
    if search:
        kw = f"%{search.strip()}%"
        query = query.filter(or_(Task.title.ilike(kw), Task.description.ilike(kw)))

    # Sorting
    sort_col = getattr(Task, sort_by, Task.created_at)
    if sort_order == "desc":
        query = query.order_by(desc(sort_col))
    else:
        query = query.order_by(asc(sort_col))

    total = query.count()
    total_pages = ceil(total / page_size) if total > 0 else 1
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()

    # Hydrate subtask counts
    task_dtos = []
    for t in items:
        dto = TaskResponse.model_validate(t)
        dto.subtasks_count = len(t.subtasks)
        dto.completed_subtasks_count = sum(1 for s in t.subtasks if s.is_completed)
        task_dtos.append(dto)

    paginated = PaginatedResponse(
        items=task_dtos,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )
    return ResponseEnvelope(data=paginated)

@router.post("", response_model=ResponseEnvelope[TaskResponse], status_code=status.HTTP_201_CREATED)
def create_new_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new task with creator derived strictly from the authenticated session."""
    task = create_task(db, task_in, current_user)
    dto = TaskResponse.model_validate(task)
    dto.subtasks_count = len(task.subtasks)
    return ResponseEnvelope(data=dto, message="Task created successfully")

@router.get("/{task_id}", response_model=ResponseEnvelope[TaskDetailResponse])
def get_task_details(
    task_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve full task details with subtasks, tags, and comments. Enforces data isolation."""
    task = get_task_or_404(db, task_id, current_user)
    
    dto = TaskDetailResponse.model_validate(task)
    dto.subtasks = [SubtaskResponse.model_validate(s) for s in task.subtasks]
    dto.tags = [TaskTagResponse.model_validate(a.tag) for a in task.tag_assignments if a.tag]
    dto.comments_count = len(task.comments)
    dto.subtasks_count = len(task.subtasks)
    dto.completed_subtasks_count = sum(1 for s in task.subtasks if s.is_completed)
    return ResponseEnvelope(data=dto)

@router.put("/{task_id}", response_model=ResponseEnvelope[TaskResponse])
def update_existing_task(
    task_id: UUID,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update task details with audit logging and permissions check."""
    task = update_task(db, task_id, task_in, current_user)
    dto = TaskResponse.model_validate(task)
    dto.subtasks_count = len(task.subtasks)
    dto.completed_subtasks_count = sum(1 for s in task.subtasks if s.is_completed)
    return ResponseEnvelope(data=dto, message="Task updated")

@router.patch("/{task_id}/status", response_model=ResponseEnvelope[TaskResponse])
def update_status(
    task_id: UUID,
    status_in: TaskStatusUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Fast status transition and position ordering for Kanban board."""
    task = update_task_status(db, task_id, status_in, current_user)
    dto = TaskResponse.model_validate(task)
    dto.subtasks_count = len(task.subtasks)
    dto.completed_subtasks_count = sum(1 for s in task.subtasks if s.is_completed)
    return ResponseEnvelope(data=dto, message="Task status updated")

@router.delete("/{task_id}", response_model=ResponseEnvelope[bool])
def delete_task_route(
    task_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Soft delete / archive a task."""
    delete_task(db, task_id, current_user)
    return ResponseEnvelope(data=True, message="Task archived successfully")

@router.post("/{task_id}/duplicate", response_model=ResponseEnvelope[TaskResponse])
def duplicate_task_route(
    task_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Clones a task and its subtasks."""
    cloned = duplicate_task(db, task_id, current_user)
    return ResponseEnvelope(data=TaskResponse.model_validate(cloned), message="Task duplicated")

@router.post("/bulk", response_model=ResponseEnvelope[int])
def bulk_update(
    bulk_in: BulkTaskUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Bulk update status, priority, or project on authorized tasks."""
    count = bulk_update_tasks(db, bulk_in, current_user)
    return ResponseEnvelope(data=count, message=f"Updated {count} task(s)")

# Categories and Tags endpoints
@router.get("/meta/categories", response_model=ResponseEnvelope[List[TaskCategoryResponse]])
def list_categories(db: Session = Depends(get_db)):
    """List all task categories."""
    cats = db.query(TaskCategory).all()
    return ResponseEnvelope(data=[TaskCategoryResponse.model_validate(c) for c in cats])

@router.post("/meta/categories", response_model=ResponseEnvelope[TaskCategoryResponse])
def create_category(cat_in: TaskCategoryCreate, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Create task category."""
    cat = TaskCategory(name=cat_in.name, color=cat_in.color or "#8b5cf6", icon=cat_in.icon)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return ResponseEnvelope(data=TaskCategoryResponse.model_validate(cat), message="Category created")

@router.get("/meta/tags", response_model=ResponseEnvelope[List[TaskTagResponse]])
def list_tags(db: Session = Depends(get_db)):
    """List all task tags."""
    tags = db.query(TaskTag).all()
    return ResponseEnvelope(data=[TaskTagResponse.model_validate(t) for t in tags])

@router.post("/meta/tags", response_model=ResponseEnvelope[TaskTagResponse])
def create_tag(tag_in: TaskTagCreate, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Create task tag."""
    tag = TaskTag(name=tag_in.name, color=tag_in.color or "#06b6d4")
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return ResponseEnvelope(data=TaskTagResponse.model_validate(tag), message="Tag created")
