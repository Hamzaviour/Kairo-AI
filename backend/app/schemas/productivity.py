from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse

class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    type: str
    title: str
    message: Optional[str] = None
    task_id: Optional[UUID] = None
    actor_id: Optional[UUID] = None
    is_read: bool
    read_at: Optional[datetime] = None
    created_at: datetime
    actor: Optional[UserResponse] = None

    model_config = {"from_attributes": True}

class TimeEntryCreate(BaseModel):
    description: Optional[str] = None
    started_at: datetime
    ended_at: Optional[datetime] = None
    duration_minutes: Optional[int] = Field(None, ge=1)

class TimeEntryResponse(BaseModel):
    id: UUID
    task_id: UUID
    user_id: UUID
    description: Optional[str] = None
    started_at: datetime
    ended_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    created_at: datetime
    user: Optional[UserResponse] = None

    model_config = {"from_attributes": True}

class FocusSessionCreate(BaseModel):
    task_id: Optional[UUID] = None
    duration_minutes: Optional[int] = Field(25, ge=5, le=120)
    break_minutes: Optional[int] = Field(5, ge=1, le=60)

class FocusSessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    task_id: Optional[UUID] = None
    duration_minutes: int
    break_minutes: int
    started_at: datetime
    ended_at: Optional[datetime] = None
    is_completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}
