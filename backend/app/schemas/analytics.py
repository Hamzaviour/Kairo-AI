from typing import Dict, List, Optional
from uuid import UUID
from pydantic import BaseModel

class StatusDistribution(BaseModel):
    status: str
    count: int

class PriorityDistribution(BaseModel):
    priority: str
    count: int

class UserWorkloadItem(BaseModel):
    user_id: UUID
    name: str
    email: str
    avatar: Optional[str] = None
    role: str
    assigned_tasks_count: int
    completed_tasks_count: int
    overdue_tasks_count: int
    workload_percentage: float

class UserProductivityStats(BaseModel):
    tasks_due_today: int
    tasks_overdue: int
    tasks_in_progress: int
    tasks_completed_today: int
    tasks_completed_this_week: int
    total_active_tasks: int
    completion_rate_percentage: float
    streak_days: int
    total_focus_minutes_today: int
    status_distribution: List[StatusDistribution]
    priority_distribution: List[PriorityDistribution]
    recent_completion_trend: List[Dict[str, int]]

class AdminAnalyticsResponse(BaseModel):
    total_users: int
    active_users: int
    total_tasks: int
    completed_tasks: int
    overdue_tasks: int
    overall_completion_rate: float
    status_distribution: List[StatusDistribution]
    priority_distribution: List[PriorityDistribution]
    user_workloads: List[UserWorkloadItem]
    tasks_created_last_7_days: int
    tasks_completed_last_7_days: int
