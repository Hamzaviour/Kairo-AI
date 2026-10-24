from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_active_user, get_current_admin
from app.models.user import User
from app.schemas.ai import (
    ParseTaskRequest, ParsedTaskResponse, SubtaskBreakdownRequest,
    SubtaskBreakdownResponse, PrioritizeRequest, PrioritizeResponse,
    SmartScheduleResponse, AIChatRequest, AIChatResponse,
    AssistantChatRequest, AssistantChatResponse
)
from app.schemas.common import ResponseEnvelope
from app.services.ai_service import AIService
from app.services.task_service import get_task_or_404
from app.services.assistant_service import run_assistant, AssistantError

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

def _assistant_turn(req: AssistantChatRequest, user: User, db: Session, admin: bool) -> AssistantChatResponse:
    if req.messages[-1].role != "user":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The last message must come from the user")
    try:
        result = run_assistant(db, user, [m.model_dump() for m in req.messages], admin=admin)
    except AssistantError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))
    return AssistantChatResponse(**result)

@router.post("/assistant", response_model=ResponseEnvelope[AssistantChatResponse])
def user_assistant_route(
    req: AssistantChatRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Groq-powered assistant that performs CRUD on the caller's own tasks, subtasks,
    comments and projects. Every tool runs through the scoped task services.
    """
    return ResponseEnvelope(data=_assistant_turn(req, current_user, db, admin=False))

@router.post("/admin-assistant", response_model=ResponseEnvelope[AssistantChatResponse])
def admin_assistant_route(
    req: AssistantChatRequest,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Admin-only assistant with organization-wide CRUD, user management and
    direct SQL access to the database (read-only queries plus confirmed writes).
    """
    return ResponseEnvelope(data=_assistant_turn(req, admin_user, db, admin=True))
