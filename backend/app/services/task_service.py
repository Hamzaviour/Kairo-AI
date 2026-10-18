from typing import List, Optional, Tuple
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, desc, asc
from fastapi import HTTPException, status

from app.models.task import Task, Subtask, TaskTag, TaskTagAssignment
from app.models.project import ProjectMember
from app.models.user import User
from app.models.collaboration import TaskActivityLog
from app.schemas.task import TaskCreate, TaskUpdate, TaskStatusUpdate, BulkTaskUpdate
from app.services.notification_service import create_notification

def get_user_project_ids(db: Session, user_id: UUID) -> List[UUID]:
    """Retrieve all project IDs where user is an active member or owner."""
    memberships = db.query(ProjectMember.project_id).filter(ProjectMember.user_id == user_id).all()
    return [m[0] for m in memberships]

def get_scoped_tasks_query(db: Session, current_user: User):
    """
    Returns a query restricted to tasks the user is permitted to view.
    Admins see all non-archived tasks across the organization.
    Regular users see only tasks they created, are assigned to, or are in projects they belong to.
    """
    query = db.query(Task).filter(Task.is_archived == False)
    
    if current_user.role == "admin":
        return query
    
    user_project_ids = get_user_project_ids(db, current_user.id)
    
    conditions = [
        Task.creator_id == current_user.id,
        Task.assignee_id == current_user.id
    ]
    if user_project_ids:
        conditions.append(Task.project_id.in_(user_project_ids))
        
    return query.filter(or_(*conditions))

def get_task_or_404(db: Session, task_id: UUID, current_user: User) -> Task:
    """
    Fetch a task ensuring the user has permission.
    Raises 404 (not 403) to prevent IDOR enumeration of private task UUIDs.
    """
    task = get_scoped_tasks_query(db, current_user).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or access unauthorized"
        )
    return task

def log_task_activity(
    db: Session,
    task_id: UUID,
    user_id: Optional[UUID],
    action: str,
    field_name: Optional[str] = None,
    old_value: Optional[str] = None,
    new_value: Optional[str] = None,
    metadata: Optional[dict] = None
):
    """Log an event into the immutable task activity log."""
    log = TaskActivityLog(
        task_id=task_id,
        user_id=user_id,
        action=action,
        field_name=field_name,
        old_value=old_value,
        new_value=new_value,
        metadata_=metadata or {}
    )
    db.add(log)

def create_task(db: Session, task_in: TaskCreate, current_user: User) -> Task:
    """Create a task with permission checks and activity logging."""
    assignee_id = task_in.assignee_id
    
    # Regular users cannot assign tasks to arbitrary third parties unless admin
    if current_user.role != "admin":
        if assignee_id and assignee_id != current_user.id:
            # Check if project member
            if task_in.project_id:
                allowed = db.query(ProjectMember).filter(
                    ProjectMember.project_id == task_in.project_id,
                    ProjectMember.user_id == assignee_id
                ).first()
                if not allowed:
                    assignee_id = current_user.id
            else:
                assignee_id = current_user.id
        elif not assignee_id:
            assignee_id = current_user.id

    task = Task(
        title=task_in.title,
        description=task_in.description,
        url=task_in.url,
        image_url=task_in.image_url,
        status=task_in.status or "todo",
        priority=task_in.priority or "medium",
        creator_id=current_user.id,
        assignee_id=assignee_id,
        project_id=task_in.project_id,
        category_id=task_in.category_id,
        parent_task_id=task_in.parent_task_id,
        start_date=task_in.start_date,
        due_date=task_in.due_date,
        estimated_minutes=task_in.estimated_minutes,
        position=task_in.position or 0
    )
    db.add(task)
    db.flush()

    # Add initial subtasks if supplied
    if task_in.subtasks:
        for idx, sub_title in enumerate(task_in.subtasks):
            sub = Subtask(task_id=task.id, title=sub_title, position=idx)
            db.add(sub)

    # Attach tags if supplied
    if task_in.tag_ids:
        for tag_id in task_in.tag_ids:
            assignment = TaskTagAssignment(task_id=task.id, tag_id=tag_id)
            db.add(assignment)

    # Log creation
    log_task_activity(db, task.id, current_user.id, "created", new_value=task.title)

    # Send notification if assigned to another user
    if assignee_id and assignee_id != current_user.id:
        create_notification(
            db,
            user_id=assignee_id,
            notification_type="task_assigned",
            title="New task assigned to you",
            message=f"{current_user.name} assigned you: '{task.title}'",
            task_id=task.id,
            actor_id=current_user.id
        )

    db.commit()
    db.refresh(task)
    return task

def update_task(db: Session, task_id: UUID, task_in: TaskUpdate, current_user: User) -> Task:
    """Update task fields with audit logging."""
    task = get_task_or_404(db, task_id, current_user)
    
    update_data = task_in.model_dump(exclude_unset=True)
    
    # Handle status transition completion timestamp
    if "status" in update_data and update_data["status"] != task.status:
        old_status = task.status
        new_status = update_data["status"]
        task.status = new_status
        if new_status == "completed":
            task.completed_at = datetime.now(timezone.utc)
        elif old_status == "completed":
            task.completed_at = None
        log_task_activity(db, task.id, current_user.id, "status_changed", "status", old_status, new_status)
        del update_data["status"]

    # Handle assignee reassignment
    if "assignee_id" in update_data and update_data["assignee_id"] != task.assignee_id:
        new_assignee_id = update_data["assignee_id"]
        # Only admin or creator or current assignee can reassign
        if current_user.role != "admin" and task.creator_id != current_user.id and task.assignee_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to reassign this task")
        
        old_assignee_str = str(task.assignee_id) if task.assignee_id else "Unassigned"
        new_assignee_str = str(new_assignee_id) if new_assignee_id else "Unassigned"
        task.assignee_id = new_assignee_id
        log_task_activity(db, task.id, current_user.id, "reassigned", "assignee_id", old_assignee_str, new_assignee_str)
        
        if new_assignee_id and new_assignee_id != current_user.id:
            create_notification(
                db,
                user_id=new_assignee_id,
                notification_type="task_assigned",
                title="Task reassigned to you",
                message=f"You were assigned to: '{task.title}'",
                task_id=task.id,
                actor_id=current_user.id
            )
        del update_data["assignee_id"]

    # Handle tag assignments
    if "tag_ids" in update_data:
        tag_ids = update_data.pop("tag_ids")
        if tag_ids is not None:
            db.query(TaskTagAssignment).filter(TaskTagAssignment.task_id == task.id).delete()
            for tid in tag_ids:
                db.add(TaskTagAssignment(task_id=task.id, tag_id=tid))

    # Apply remaining scalar fields
    for field, value in update_data.items():
        if hasattr(task, field):
            old_val = str(getattr(task, field, ''))
            setattr(task, field, value)
            if old_val != str(value):
                log_task_activity(db, task.id, current_user.id, "edited", field, old_val, str(value))

    db.commit()
    db.refresh(task)
    return task

def update_task_status(db: Session, task_id: UUID, status_in: TaskStatusUpdate, current_user: User) -> Task:
    """Fast status and position update for Kanban drag-and-drop."""
    task = get_task_or_404(db, task_id, current_user)
    old_status = task.status
    task.status = status_in.status
    if status_in.position is not None:
        task.position = status_in.position
    
    if status_in.status == "completed":
        task.completed_at = datetime.now(timezone.utc)
    elif old_status == "completed":
        task.completed_at = None

    log_task_activity(db, task.id, current_user.id, "status_changed", "status", old_status, status_in.status)
    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task_id: UUID, current_user: User) -> bool:
    """Soft delete or archive a task."""
    task = get_task_or_404(db, task_id, current_user)
    
    # Only creator, assignee, or admin can delete
    if current_user.role != "admin" and task.creator_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only task creator or administrator can delete this task")
    
    task.is_archived = True
    log_task_activity(db, task.id, current_user.id, "archived")
    db.commit()
    return True

def duplicate_task(db: Session, task_id: UUID, current_user: User) -> Task:
    """Duplicate an existing task with subtasks."""
    original = get_task_or_404(db, task_id, current_user)
    
    clone = Task(
        title=f"{original.title} (Copy)",
        description=original.description,
        url=original.url,
        image_url=original.image_url,
        status="todo",
        priority=original.priority,
        creator_id=current_user.id,
        assignee_id=current_user.id,
        project_id=original.project_id,
        category_id=original.category_id,
        estimated_minutes=original.estimated_minutes,
        position=original.position + 1
    )
    db.add(clone)
    db.flush()

    for sub in original.subtasks:
        db.add(Subtask(task_id=clone.id, title=sub.title, position=sub.position, is_completed=False))

    log_task_activity(db, clone.id, current_user.id, "duplicated", None, None, f"Cloned from {original.id}")
    db.commit()
    db.refresh(clone)
    return clone

def bulk_update_tasks(db: Session, bulk_in: BulkTaskUpdate, current_user: User) -> int:
    """Bulk update multiple tasks belonging to authorized user."""
    scoped_query = get_scoped_tasks_query(db, current_user).filter(Task.id.in_(bulk_in.task_ids))
    tasks = scoped_query.all()
    count = 0
    
    for task in tasks:
        if bulk_in.status:
            task.status = bulk_in.status
            if bulk_in.status == "completed":
                task.completed_at = datetime.now(timezone.utc)
        if bulk_in.priority:
            task.priority = bulk_in.priority
        if bulk_in.assignee_id and current_user.role == "admin":
            task.assignee_id = bulk_in.assignee_id
        if bulk_in.project_id:
            task.project_id = bulk_in.project_id
        count += 1
        log_task_activity(db, task.id, current_user.id, "bulk_updated")

    db.commit()
    return count
