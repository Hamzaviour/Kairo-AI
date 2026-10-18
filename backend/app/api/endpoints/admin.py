from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.core.security import hash_password
from app.models.user import User, UserPreferences
from app.models.collaboration import TaskActivityLog
from app.schemas.user import UserCreate, UserUpdate, UserDetailResponse, UserResponse
from app.schemas.collaboration import ActivityLogResponse
from app.schemas.common import ResponseEnvelope

router = APIRouter()

@router.get("/users", response_model=ResponseEnvelope[List[UserDetailResponse]])
def list_all_users(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """List all user accounts in the system with task counts (Admin only)."""
    users = db.query(User).order_by(User.created_at.desc()).all()
    dtos = []
    for u in users:
        dto = UserDetailResponse.model_validate(u)
        dto.assigned_tasks_count = len(u.assigned_tasks)
        dto.created_tasks_count = len(u.created_tasks)
        dtos.append(dto)
    return ResponseEnvelope(data=dtos)

@router.post("/users", response_model=ResponseEnvelope[UserResponse], status_code=status.HTTP_201_CREATED)
def admin_create_user(
    user_in: UserCreate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin provisions a new user account with specified role."""
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already registered")

    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        role=user_in.role or "user",
        profile_pic=user_in.profile_pic,
        timezone=user_in.timezone or "UTC"
    )
    db.add(user)
    db.flush()

    prefs = UserPreferences(user_id=user.id)
    db.add(prefs)
    db.commit()
    db.refresh(user)
    return ResponseEnvelope(data=UserResponse.model_validate(user), message="User created successfully")

@router.put("/users/{user_id}", response_model=ResponseEnvelope[UserResponse])
def admin_update_user(
    user_id: UUID,
    user_in: UserUpdate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin updates user profile, changes role, or activates/deactivates account."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Prevent deactivating self
    if user_id == admin_user.id and user_in.is_active is False:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot deactivate your own administrator account")

    if user_in.name is not None:
        user.name = user_in.name
    if user_in.email is not None:
        user.email = user_in.email
    if user_in.role is not None:
        user.role = user_in.role
    if user_in.is_active is not None:
        user.is_active = user_in.is_active
    if user_in.timezone is not None:
        user.timezone = user_in.timezone
    if user_in.profile_pic is not None:
        user.profile_pic = user_in.profile_pic

    db.commit()
    db.refresh(user)
    return ResponseEnvelope(data=UserResponse.model_validate(user), message="User updated successfully")

@router.get("/audit-logs", response_model=ResponseEnvelope[List[ActivityLogResponse]])
def get_system_audit_logs(
    limit: int = 100,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Global organization-wide activity logs (Admin only)."""
    logs = db.query(TaskActivityLog).order_by(TaskActivityLog.created_at.desc()).limit(limit).all()
    dtos = [ActivityLogResponse.from_log(l) for l in logs]
    return ResponseEnvelope(data=dtos)
