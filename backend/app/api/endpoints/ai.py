from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.schemas.ai import (
    ParseTaskRequest, ParsedTaskResponse, SubtaskBreakdownRequest,
    SubtaskBreakdownResponse, PrioritizeRequest, PrioritizeResponse,
    SmartScheduleResponse, AIChatRequest, AIChatResponse
)
from app.schemas.common import ResponseEnvelope
from app.services.ai_service import AIService
from app.services.task_service import get_task_or_404

router = APIRouter()

@router.post("/parse-task", response_model=ResponseEnvelope[ParsedTaskResponse])
def parse_task_route(
    req: ParseTaskRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Parses natural language notes into structured task parameters
    (title, priority, due date, subtasks).
    """
    parsed = AIService.parse_task_nlp(req.text, current_user, db)
    return ResponseEnvelope(data=parsed, message="Task parsed successfully")

@router.post("/breakdown", response_model=ResponseEnvelope[SubtaskBreakdownResponse])
def breakdown_task_route(
    req: SubtaskBreakdownRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Decomposes a broad task into actionable subtask checklist items."""
    breakdown = AIService.breakdown_subtasks(req.task_title, req.task_description, current_user, db)
    return ResponseEnvelope(data=breakdown, message="Subtasks generated")

@router.post("/prioritize", response_model=ResponseEnvelope[PrioritizeResponse])
def prioritize_task_route(
    req: PrioritizeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Recommends explainable priority scoring considering due date proximity,
    blockers, and subtask density.
    """
    task = get_task_or_404(db, req.task_id, current_user)
    prioritization = AIService.prioritize_task(task, current_user, db)
    return ResponseEnvelope(data=prioritization, message="Priority recommendation generated")

@router.post("/smart-schedule", response_model=ResponseEnvelope[SmartScheduleResponse])
def smart_schedule_route(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Generates an optimized daily schedule incorporating strictly the authenticated user's
    permitted active tasks.
    """
    schedule = AIService.generate_smart_schedule(current_user, db)
    return ResponseEnvelope(data=schedule, message="Daily schedule generated")

@router.post("/chat", response_model=ResponseEnvelope[AIChatResponse])
def chat_copilot_route(
    req: AIChatRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Natural-language task assistant strictly scoped to the requesting user's permitted tasks.
    Zero data leakage across users.
    """
    answer = AIService.answer_chat(req.prompt, current_user, db, req.task_id)
    return ResponseEnvelope(data=answer)
