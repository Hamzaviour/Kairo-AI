from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.models.collaboration import TaskComment
from app.schemas.collaboration import CommentCreate, CommentResponse
from app.schemas.common import ResponseEnvelope
from app.services.task_service import get_task_or_404, log_task_activity
from app.services.notification_service import create_notification

router = APIRouter()

@router.get("/tasks/{task_id}/comments", response_model=ResponseEnvelope[List[CommentResponse]])
def list_task_comments(
    task_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List comments on a task with data isolation checks."""
    task = get_task_or_404(db, task_id, current_user)
    comments = db.query(TaskComment).filter(
        TaskComment.task_id == task.id,
        TaskComment.parent_comment_id == None
    ).order_by(TaskComment.created_at.asc()).all()

    return ResponseEnvelope(data=[CommentResponse.model_validate(c) for c in comments])

@router.post("/tasks/{task_id}/comments", response_model=ResponseEnvelope[CommentResponse], status_code=status.HTTP_201_CREATED)
def add_comment(
    task_id: UUID,
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a comment to an authorized task."""
    task = get_task_or_404(db, task_id, current_user)

    comment = TaskComment(
        task_id=task.id,
        user_id=current_user.id,
        content=comment_in.content,
        parent_comment_id=comment_in.parent_comment_id
    )
    db.add(comment)
    log_task_activity(db, task.id, current_user.id, "comment_added", new_value=comment_in.content[:50])

    # Notify task assignee or creator
    target_user_id = task.assignee_id if task.assignee_id and task.assignee_id != current_user.id else task.creator_id
    if target_user_id and target_user_id != current_user.id:
        create_notification(
            db,
            user_id=target_user_id,
            notification_type="comment_added",
            title=f"New comment on '{task.title}'",
            message=f"{current_user.name} commented: '{comment_in.content[:80]}...'",
            task_id=task.id,
            actor_id=current_user.id
        )

    db.commit()
    db.refresh(comment)
    return ResponseEnvelope(data=CommentResponse.model_validate(comment), message="Comment posted")

@router.delete("/comments/{comment_id}", response_model=ResponseEnvelope[bool])
def delete_comment(
    comment_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a comment (author or admin only)."""
    comment = db.query(TaskComment).filter(TaskComment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

    if current_user.role != "admin" and comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this comment")

    task_id = comment.task_id
    db.delete(comment)
    log_task_activity(db, task_id, current_user.id, "comment_deleted")
    db.commit()
    return ResponseEnvelope(data=True, message="Comment deleted")
