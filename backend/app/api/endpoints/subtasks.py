from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.models.task import Task, Subtask
from app.schemas.task import SubtaskCreate, SubtaskUpdate, SubtaskResponse
from app.schemas.common import ResponseEnvelope
from app.services.task_service import get_task_or_404, log_task_activity

router = APIRouter()

@router.post("/tasks/{task_id}/subtasks", response_model=ResponseEnvelope[SubtaskResponse], status_code=status.HTTP_201_CREATED)
def add_subtask(
    task_id: UUID,
    sub_in: SubtaskCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a checklist subtask to an authorized task."""
    task = get_task_or_404(db, task_id, current_user)
    
    subtask = Subtask(
        task_id=task.id,
        title=sub_in.title,
        position=sub_in.position or len(task.subtasks)
    )
    db.add(subtask)
    log_task_activity(db, task.id, current_user.id, "subtask_added", new_value=sub_in.title)
    db.commit()
    db.refresh(subtask)
    return ResponseEnvelope(data=SubtaskResponse.model_validate(subtask), message="Subtask added")

@router.patch("/subtasks/{subtask_id}", response_model=ResponseEnvelope[SubtaskResponse])
def update_subtask(
    subtask_id: UUID,
    sub_in: SubtaskUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Toggle subtask completion or update its title."""
    subtask = db.query(Subtask).filter(Subtask.id == subtask_id).first()
    if not subtask:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subtask not found")

    # Verify task ownership / permission
    task = get_task_or_404(db, subtask.task_id, current_user)

    if sub_in.title is not None:
        subtask.title = sub_in.title
    if sub_in.is_completed is not None:
        subtask.is_completed = sub_in.is_completed
        subtask.completed_at = datetime.now(timezone.utc) if sub_in.is_completed else None
        action = "subtask_completed" if sub_in.is_completed else "subtask_uncompleted"
        log_task_activity(db, task.id, current_user.id, action, new_value=subtask.title)
    if sub_in.position is not None:
        subtask.position = sub_in.position

    db.commit()
    db.refresh(subtask)
    return ResponseEnvelope(data=SubtaskResponse.model_validate(subtask), message="Subtask updated")

@router.delete("/subtasks/{subtask_id}", response_model=ResponseEnvelope[bool])
def delete_subtask(
    subtask_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a subtask."""
    subtask = db.query(Subtask).filter(Subtask.id == subtask_id).first()
    if not subtask:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subtask not found")

    task = get_task_or_404(db, subtask.task_id, current_user)
    db.delete(subtask)
    log_task_activity(db, task.id, current_user.id, "subtask_deleted", old_value=subtask.title)
    db.commit()
    return ResponseEnvelope(data=True, message="Subtask deleted")
