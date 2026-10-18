from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse

class TaskCategoryResponse(BaseModel):
    id: UUID
    name: str
    color: str
    icon: Optional[str] = None
    created_at: datetime
    model_config = {"from_attributes": True}

class TaskCategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    color: Optional[str] = "#8b5cf6"
    icon: Optional[str] = None

class TaskTagResponse(BaseModel):
    id: UUID
    name: str
    color: str
    created_at: datetime
    model_config = {"from_attributes": True}

class TaskTagCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    color: Optional[str] = "#06b6d4"

class SubtaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    position: Optional[int] = 0

class SubtaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    is_completed: Optional[bool] = None
    position: Optional[int] = None

class SubtaskResponse(BaseModel):
    id: UUID
    task_id: UUID
    title: str
    is_completed: bool
    position: int
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = Field("todo", pattern="^(backlog|todo|in_progress|in_review|blocked|completed)$")
    priority: Optional[str] = Field("medium", pattern="^(low|medium|high|urgent)$")
    assignee_id: Optional[UUID] = None
    project_id: Optional[UUID] = None
    category_id: Optional[UUID] = None
    parent_task_id: Optional[UUID] = None
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    estimated_minutes: Optional[int] = Field(None, ge=0)
    position: Optional[int] = 0
    tag_ids: Optional[List[UUID]] = []
    subtasks: Optional[List[str]] = []

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(backlog|todo|in_progress|in_review|blocked|completed)$")
    priority: Optional[str] = Field(None, pattern="^(low|medium|high|urgent)$")
    assignee_id: Optional[UUID] = None
    project_id: Optional[UUID] = None
    category_id: Optional[UUID] = None
    parent_task_id: Optional[UUID] = None
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    estimated_minutes: Optional[int] = Field(None, ge=0)
    actual_minutes: Optional[int] = Field(None, ge=0)
    position: Optional[int] = None
    is_archived: Optional[bool] = None
    tag_ids: Optional[List[UUID]] = None

class TaskStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(backlog|todo|in_progress|in_review|blocked|completed)$")
    position: Optional[int] = None

class BulkTaskUpdate(BaseModel):
    task_ids: List[UUID] = Field(..., min_length=1)
    status: Optional[str] = Field(None, pattern="^(backlog|todo|in_progress|in_review|blocked|completed)$")
    priority: Optional[str] = Field(None, pattern="^(low|medium|high|urgent)$")
    assignee_id: Optional[UUID] = None
    project_id: Optional[UUID] = None

class TaskResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    status: str
    priority: str
    creator_id: UUID
    assignee_id: Optional[UUID] = None
    project_id: Optional[UUID] = None
    category_id: Optional[UUID] = None
    parent_task_id: Optional[UUID] = None
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    estimated_minutes: Optional[int] = None
    actual_minutes: Optional[int] = None
    completed_at: Optional[datetime] = None
    position: int
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    creator: Optional[UserResponse] = None
    assignee: Optional[UserResponse] = None
    category: Optional[TaskCategoryResponse] = None
    subtasks_count: Optional[int] = 0
    completed_subtasks_count: Optional[int] = 0

    model_config = {"from_attributes": True}

class TaskDetailResponse(TaskResponse):
    subtasks: List[SubtaskResponse] = []
    tags: List[TaskTagResponse] = []
    comments_count: int = 0
