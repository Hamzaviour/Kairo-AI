from typing import Optional
from uuid import UUID
from datetime import datetime, time
from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field("user", pattern="^(admin|user)$")
    profile_pic: Optional[str] = None
    timezone: Optional[str] = "UTC"

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    email: Optional[EmailStr] = None
    profile_pic: Optional[str] = None
    timezone: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[str] = Field(None, pattern="^(admin|user)$")

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

class UserPreferencesUpdate(BaseModel):
    theme: Optional[str] = Field(None, pattern="^(light|dark|system)$")
    notifications_enabled: Optional[bool] = None
    email_notifications: Optional[bool] = None
    daily_summary: Optional[bool] = None
    weekly_summary: Optional[bool] = None
    default_task_view: Optional[str] = Field(None, pattern="^(list|kanban|calendar|timeline)$")
    pomodoro_duration: Optional[int] = Field(None, ge=5, le=120)
    break_duration: Optional[int] = Field(None, ge=1, le=60)
    working_hours_start: Optional[time] = None
    working_hours_end: Optional[time] = None

class UserPreferencesResponse(BaseModel):
    id: UUID
    user_id: UUID
    theme: str
    notifications_enabled: bool
    email_notifications: bool
    daily_summary: bool
    weekly_summary: bool
    default_task_view: str
    pomodoro_duration: int
    break_duration: int
    working_hours_start: Optional[time]
    working_hours_end: Optional[time]

    model_config = {"from_attributes": True}

class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    role: str
    profile_pic: Optional[str] = None
    is_active: bool
    timezone: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class UserDetailResponse(UserResponse):
    preferences: Optional[UserPreferencesResponse] = None
    assigned_tasks_count: Optional[int] = 0
    created_tasks_count: Optional[int] = 0
