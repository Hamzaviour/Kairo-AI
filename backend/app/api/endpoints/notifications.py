from typing import List, Dict, Any
from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.models.productivity import Notification
from app.schemas.productivity import NotificationResponse
from app.schemas.common import ResponseEnvelope

router = APIRouter()

@router.get("", response_model=ResponseEnvelope[Dict[str, Any]])
def list_notifications(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List notifications for the authenticated user and return unread count."""
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).limit(100).all()

    unread_count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()

    dtos = [NotificationResponse.model_validate(n) for n in notifications]
    return ResponseEnvelope(data={"items": dtos, "unread_count": unread_count})

@router.patch("/{notification_id}/read", response_model=ResponseEnvelope[bool])
def mark_notification_read(
    notification_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mark a notification as read."""
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    notif.is_read = True
    notif.read_at = datetime.now(timezone.utc)
    db.commit()
    return ResponseEnvelope(data=True, message="Marked as read")

@router.post("/mark-all-read", response_model=ResponseEnvelope[int])
def mark_all_read(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mark all unread notifications as read for current user."""
    updated = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True, "read_at": datetime.now(timezone.utc)})
    db.commit()
    return ResponseEnvelope(data=updated, message=f"Marked {updated} notifications as read")
