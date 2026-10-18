from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    color: Optional[str] = Field("#6366f1", pattern="^#[0-9a-fA-F]{6}$")
    icon: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern="^#[0-9a-fA-F]{6}$")
    icon: Optional[str] = None
    is_archived: Optional[bool] = None

class ProjectMemberAdd(BaseModel):
    user_id: UUID
    role: str = Field("member", pattern="^(lead|member|viewer)$")

class ProjectMemberResponse(BaseModel):
    id: UUID
    project_id: UUID
    user_id: UUID
    role: str
    joined_at: datetime
    user: Optional[UserResponse] = None

    model_config = {"from_attributes": True}

class ProjectResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    color: str
    icon: Optional[str] = None
    owner_id: UUID
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    owner: Optional[UserResponse] = None
    members: Optional[List[ProjectMemberResponse]] = []
    tasks_count: Optional[int] = 0
    completed_tasks_count: Optional[int] = 0

    model_config = {"from_attributes": True}
