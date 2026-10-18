from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.productivity import Notification

def create_notification(
    db: Session,
    user_id: UUID,
    notification_type: str,
    title: str,
    message: Optional[str] = None,
    task_id: Optional[UUID] = None,
    actor_id: Optional[UUID] = None
) -> Notification:
    """Create in-app notification for a user."""
    # Don't notify the actor of their own actions
    if actor_id and user_id == actor_id:
        return None
    
    notification = Notification(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        task_id=task_id,
        actor_id=actor_id
    )
    db.add(notification)
    return notification
