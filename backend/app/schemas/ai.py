from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field

class ParseTaskRequest(BaseModel):
    text: str = Field(..., min_length=3, max_length=2000)

class ParsedTaskResponse(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    status: str = "todo"
    due_date: Optional[datetime] = None
    suggested_subtasks: List[str] = []
    confidence: float = 0.95
    tags: List[str] = []

class SubtaskBreakdownRequest(BaseModel):
    task_title: str = Field(..., min_length=2)
    task_description: Optional[str] = None

class SubtaskBreakdownResponse(BaseModel):
    subtasks: List[str]
    rationale: str

class PrioritizeRequest(BaseModel):
    task_id: UUID

class PrioritizeResponse(BaseModel):
    task_id: UUID
    current_priority: str
    recommended_priority: str
    priority_score: float
    factors: List[str]
    rationale: str

class DailyScheduleItem(BaseModel):
    time_slot: str
    task_id: UUID
    title: str
    priority: str
    estimated_minutes: int

class SmartScheduleResponse(BaseModel):
    date: str
    schedule: List[DailyScheduleItem]
    total_allocated_minutes: int
    overloaded: bool
    suggestions: List[str]

class AIChatRequest(BaseModel):
    prompt: str = Field(..., min_length=2, max_length=2000)
    task_id: Optional[UUID] = None

class AIChatResponse(BaseModel):
    response: str
    model_used: str
    action_suggestions: List[str] = []
