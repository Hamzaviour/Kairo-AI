from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.models.project import Project, ProjectMember
from app.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse, ProjectMemberAdd, ProjectMemberResponse
)
from app.schemas.common import ResponseEnvelope

router = APIRouter()

def get_project_or_404(db: Session, project_id: UUID, current_user: User) -> Project:
    project = db.query(Project).filter(Project.id == project_id, Project.is_archived == False).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if current_user.role != "admin" and project.owner_id != current_user.id:
        is_member = db.query(ProjectMember).filter(
            ProjectMember.project_id == project.id,
            ProjectMember.user_id == current_user.id
        ).first()
        if not is_member:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or access unauthorized")

    return project

@router.get("", response_model=ResponseEnvelope[List[ProjectResponse]])
def list_projects(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List projects accessible to user."""
    query = db.query(Project).filter(Project.is_archived == False)
    if current_user.role != "admin":
        member_project_ids = db.query(ProjectMember.project_id).filter(ProjectMember.user_id == current_user.id).all()
        ids = [p[0] for p in member_project_ids]
        query = query.filter(or_(Project.owner_id == current_user.id, Project.id.in_(ids)))

    projects = query.order_by(Project.created_at.desc()).all()
    dtos = []
    for p in projects:
        dto = ProjectResponse.model_validate(p)
        dto.tasks_count = len(p.tasks)
        dto.completed_tasks_count = sum(1 for t in p.tasks if t.status == "completed")
        dtos.append(dto)
    return ResponseEnvelope(data=dtos)

@router.post("", response_model=ResponseEnvelope[ProjectResponse], status_code=status.HTTP_201_CREATED)
def create_project(
    proj_in: ProjectCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new project workspace."""
    project = Project(
        name=proj_in.name,
        description=proj_in.description,
        color=proj_in.color or "#6366f1",
        icon=proj_in.icon,
        owner_id=current_user.id
    )
    db.add(project)
    db.flush()

    # Automatically add owner as project member with role 'lead'
    owner_member = ProjectMember(project_id=project.id, user_id=current_user.id, role="lead")
    db.add(owner_member)
    db.commit()
    db.refresh(project)
    return ResponseEnvelope(data=ProjectResponse.model_validate(project), message="Project created")

@router.get("/{project_id}", response_model=ResponseEnvelope[ProjectResponse])
def get_project(
    project_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get project details."""
    project = get_project_or_404(db, project_id, current_user)
    dto = ProjectResponse.model_validate(project)
    dto.tasks_count = len(project.tasks)
    dto.completed_tasks_count = sum(1 for t in project.tasks if t.status == "completed")
    return ResponseEnvelope(data=dto)

@router.put("/{project_id}", response_model=ResponseEnvelope[ProjectResponse])
def update_project(
    project_id: UUID,
    proj_in: ProjectUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update project details (owner or admin only)."""
    project = get_project_or_404(db, project_id, current_user)
    if current_user.role != "admin" and project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only project owner or admin can edit project")

    data = proj_in.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(project, k, v)
    db.commit()
    db.refresh(project)
    return ResponseEnvelope(data=ProjectResponse.model_validate(project), message="Project updated")

@router.delete("/{project_id}", response_model=ResponseEnvelope[bool])
def delete_project(
    project_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Archive a project."""
    project = get_project_or_404(db, project_id, current_user)
    if current_user.role != "admin" and project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only project owner or admin can archive project")

    project.is_archived = True
    db.commit()
    return ResponseEnvelope(data=True, message="Project archived")

@router.post("/{project_id}/members", response_model=ResponseEnvelope[ProjectMemberResponse])
def add_project_member(
    project_id: UUID,
    member_in: ProjectMemberAdd,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add member to project."""
    project = get_project_or_404(db, project_id, current_user)
    if current_user.role != "admin" and project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only project owner or admin can manage members")

    existing = db.query(ProjectMember).filter(
        ProjectMember.project_id == project.id,
        ProjectMember.user_id == member_in.user_id
    ).first()
    if existing:
        existing.role = member_in.role
        db.commit()
        db.refresh(existing)
        return ResponseEnvelope(data=ProjectMemberResponse.model_validate(existing), message="Member role updated")

    member = ProjectMember(project_id=project.id, user_id=member_in.user_id, role=member_in.role)
    db.add(member)
    db.commit()
    db.refresh(member)
    return ResponseEnvelope(data=ProjectMemberResponse.model_validate(member), message="Member added")

@router.delete("/{project_id}/members/{user_id}", response_model=ResponseEnvelope[bool])
def remove_project_member(
    project_id: UUID,
    user_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Remove member from project."""
    project = get_project_or_404(db, project_id, current_user)
    if current_user.role != "admin" and project.owner_id != current_user.id and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to remove this member")

    db.query(ProjectMember).filter(
        ProjectMember.project_id == project.id,
        ProjectMember.user_id == user_id
    ).delete()
    db.commit()
    return ResponseEnvelope(data=True, message="Member removed")
