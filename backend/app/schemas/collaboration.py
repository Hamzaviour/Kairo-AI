from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse

class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1)
    parent_comment_id: Optional[UUID] = None

class CommentResponse(BaseModel):
    id: UUID
    task_id: UUID
    user_id: UUID
    content: str
    parent_comment_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    user: Optional[UserResponse] = None
    replies: Optional[List["CommentResponse"]] = []

    model_config = {"from_attributes": True}

class AttachmentResponse(BaseModel):
    id: UUID
    task_id: UUID
    user_id: UUID
    filename: str
    file_url: str
    file_size_bytes: Optional[int] = None
    mime_type: Optional[str] = None
    created_at: datetime
    user: Optional[UserResponse] = None

    model_config = {"from_attributes": True}

class ActivityLogResponse(BaseModel):
    id: UUID
    task_id: UUID
    user_id: Optional[UUID] = None
    action: str
    field_name: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    metadata: Optional[dict] = Field(default_factory=dict)
    created_at: datetime
    user: Optional[UserResponse] = None

    model_config = {"from_attributes": True}

    @classmethod
    def from_log(cls, log: Any) -> "ActivityLogResponse":
        # The ORM column is `metadata_`; plain model_validate would read Base.metadata instead
        return cls(
            id=log.id, task_id=log.task_id, user_id=log.user_id, action=log.action,
            field_name=log.field_name, old_value=log.old_value, new_value=log.new_value,
            metadata=log.metadata_ or {}, created_at=log.created_at,
            user=UserResponse.model_validate(log.user) if log.user else None,
        )
