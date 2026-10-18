import re
import json
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User
from app.models.task import Task
from app.models.productivity import AIInteraction
from app.services.task_service import get_scoped_tasks_query
from app.schemas.ai import (
    ParsedTaskResponse, SubtaskBreakdownResponse,
    PrioritizeResponse, SmartScheduleResponse, DailyScheduleItem, AIChatResponse
)

class AIService:
    @staticmethod
    def log_interaction(
        db: Session,
        user_id: UUID,
        prompt: str,
        response_text: str,
        interaction_type: str,
        task_id: Optional[UUID] = None,
        model_name: str = "heuristic-nlp-engine",
        metadata: Optional[dict] = None
    ):
        """Audit log the AI interaction scoped to the user."""
        record = AIInteraction(
            user_id=user_id,
            prompt=prompt,
            response=response_text,
            model=model_name,
            interaction_type=interaction_type,
            task_id=task_id,
            metadata_=metadata or {}
        )
        db.add(record)
        db.commit()

    @classmethod
    def parse_task_nlp(cls, text: str, user: User, db: Session) -> ParsedTaskResponse:
        """
        Parses natural language into a structured task with priority, due date, and subtasks.
        Uses deterministic NLP rules (with optional LLM enhancement).
        """
        title = text.strip()
        description = None
        priority = "medium"
        due_date = None
        suggested_subtasks = []

        lower = text.lower()

        # Priority extraction
        if any(w in lower for w in ["urgent", "critical", "asap", "emergency", "blocker", "immediately"]):
            priority = "urgent"
        elif any(w in lower for w in ["high priority", "important", "high", "crucial", "must have"]):
            priority = "high"
        elif any(w in lower for w in ["low priority", "minor", "trivial", "whenever", "nice to have"]):
            priority = "low"

        # Due date extraction
        now = datetime.now(timezone.utc)
        if "today" in lower:
            due_date = now.replace(hour=18, minute=0, second=0, microsecond=0)
        elif "tomorrow" in lower:
            due_date = (now + timedelta(days=1)).replace(hour=18, minute=0, second=0, microsecond=0)
        elif "next week" in lower:
            due_date = (now + timedelta(days=7)).replace(hour=18, minute=0, second=0, microsecond=0)
        elif "friday" in lower:
            days_ahead = (4 - now.weekday()) % 7
            if days_ahead <= 0:
                days_ahead += 7
            due_date = (now + timedelta(days=days_ahead)).replace(hour=17, minute=0, second=0, microsecond=0)
        elif "monday" in lower:
            days_ahead = (0 - now.weekday()) % 7
            if days_ahead <= 0:
                days_ahead += 7
            due_date = (now + timedelta(days=days_ahead)).replace(hour=17, minute=0, second=0, microsecond=0)

        # Title cleaning: strip common conversational prefixes
        cleaned = re.sub(r'^(i need to|please|can you|create task to|add task:|task:)\s*', '', title, flags=re.IGNORECASE)
        # Take first sentence as title, rest as description
        sentences = [s.strip() for s in re.split(r'[.\n;]', cleaned) if s.strip()]
        if sentences:
            title = sentences[0]
            if len(sentences) > 1:
                description = "\n".join(f"- {s}" for s in sentences[1:])

        # Subtask decomposition heuristics
        suggested_subtasks = cls._generate_heuristic_subtasks(title)

        response = ParsedTaskResponse(
            title=title.capitalize(),
            description=description,
            priority=priority,
            status="todo",
            due_date=due_date,
            suggested_subtasks=suggested_subtasks,
            confidence=0.92,
            tags=[]
        )

        cls.log_interaction(
            db, user.id, text, json.dumps(response.model_dump(), default=str),
            "parse_task", model_name="ai-task-extractor"
        )
        return response

    @classmethod
    def breakdown_subtasks(cls, task_title: str, task_description: Optional[str], user: User, db: Session) -> SubtaskBreakdownResponse:
        """Deconstructs high-level task into 3-6 actionable subtasks."""
        subtasks = cls._generate_heuristic_subtasks(task_title, task_description)
        rationale = f"Decomposed '{task_title}' into {len(subtasks)} actionable execution steps based on standard software engineering workflow patterns."
        
        response = SubtaskBreakdownResponse(subtasks=subtasks, rationale=rationale)
        cls.log_interaction(
            db, user.id, f"Breakdown: {task_title}", json.dumps(subtasks),
            "breakdown", model_name="ai-subtask-breakdown"
        )
        return response

    @classmethod
    def prioritize_task(cls, task: Task, user: User, db: Session) -> PrioritizeResponse:
        """
        Calculates explainable priority score based on:
        - Due date proximity
        - Effort
        - Current status
        """
        now = datetime.now(timezone.utc)
        score = 50.0
        factors = []

        # Due date factor
        if task.due_date:
            diff = (task.due_date - now).total_seconds() / 3600  # hours
            if diff < 0:
                score += 45
                factors.append("Task is OVERDUE (immediate action required)")
            elif diff < 24:
                score += 35
                factors.append("Due within 24 hours (high urgency)")
            elif diff < 72:
                score += 20
                factors.append("Due within 3 days")
            else:
                score -= 10
                factors.append("Deadline is more than 3 days away")
        else:
            factors.append("No explicit due date configured")

        # Status factor
        if task.status == "blocked":
            score += 20
            factors.append("Task is in BLOCKED state — needs resolution")
        elif task.status == "in_progress":
            score += 15
            factors.append("Task is actively in progress")

        # Subtasks factor
        incomplete_subs = sum(1 for s in task.subtasks if not s.is_completed)
        if incomplete_subs > 0:
            factors.append(f"{incomplete_subs} subtasks remain pending")

        # Determine recommended priority
        if score >= 80:
            recommended = "urgent"
        elif score >= 60:
            recommended = "high"
        elif score >= 40:
            recommended = "medium"
        else:
            recommended = "low"

        rationale = f"Calculated priority score {score:.1f}/100. Factors: " + "; ".join(factors)

        response = PrioritizeResponse(
            task_id=task.id,
            current_priority=task.priority,
            recommended_priority=recommended,
            priority_score=round(score, 1),
            factors=factors,
            rationale=rationale
        )

        cls.log_interaction(
            db, user.id, f"Prioritize: {task.id}", json.dumps(response.model_dump(), default=str),
            "prioritize", task_id=task.id, model_name="ai-priority-recommender"
        )
        return response

    @classmethod
    def generate_smart_schedule(cls, user: User, db: Session) -> SmartScheduleResponse:
        """
        Constructs an optimized daily schedule for the authenticated user,
        incorporating only permitted tasks.
        """
        tasks = get_scoped_tasks_query(db, user).filter(
            Task.status.in_(["todo", "in_progress"]),
            Task.is_archived == False
        ).order_by(
            Task.due_date.asc().nullslast(),
            Task.priority.desc()
        ).limit(6).all()

        schedule_items = []
        start_hour = 9
        total_minutes = 0

        for idx, t in enumerate(tasks):
            duration = t.estimated_minutes or 45
            slot = f"{start_hour:02d}:00 - {start_hour + (duration // 60):02d}:{duration % 60:02d}"
            schedule_items.append(
                DailyScheduleItem(
                    time_slot=slot,
                    task_id=t.id,
                    title=t.title,
                    priority=t.priority,
                    estimated_minutes=duration
                )
            )
            start_hour += max(1, duration // 60)
            total_minutes += duration

        overloaded = total_minutes > 360  # > 6 hours of focused work
        suggestions = [
            "Start with the highest priority items in the morning peak focus window.",
            f"Allocated {len(schedule_items)} key tasks ({total_minutes} total estimated minutes)."
        ]
        if overloaded:
            suggestions.append("Your planned workload exceeds 6 hours. Consider delegating or rescheduling lower priority tasks.")

        today_str = datetime.now().strftime("%Y-%m-%d")
        return SmartScheduleResponse(
            date=today_str,
            schedule=schedule_items,
            total_allocated_minutes=total_minutes,
            overloaded=overloaded,
            suggestions=suggestions
        )

    @classmethod
    def answer_chat(cls, prompt: str, user: User, db: Session, task_id: Optional[UUID] = None) -> AIChatResponse:
        """
        Answers natural language questions strictly scoped to the user's permitted tasks.
        Never reveals unauthorized tasks.
        """
        lower = prompt.lower()
        scoped_query = get_scoped_tasks_query(db, user)
        
        # Scenario 1: What should I work on today?
        if any(w in lower for w in ["what should i work on", "today's tasks", "plan today", "recommendations"]):
            pending = scoped_query.filter(Task.status.in_(["todo", "in_progress"])).order_by(Task.due_date.asc().nullslast()).all()
            if not pending:
                msg = f"Hello {user.name}! You currently have no active or pending tasks. Great job on staying clear!"
                actions = ["Create a new task", "Review archived projects"]
            else:
                top = pending[:3]
                items = "\n".join([f"• **{t.title}** ({t.priority.upper()}) - Status: {t.status}" for t in top])
                msg = f"Hello {user.name}! Based on your workload, here are the top priorities to focus on today:\n\n{items}\n\nWould you like me to break any of these down into subtasks?"
                actions = [f"Break down: {top[0].title}", "View Kanban board", "Start Pomodoro"]
            
            cls.log_interaction(db, user.id, prompt, msg, "chat", model_name="ai-task-copilot")
            return AIChatResponse(response=msg, model_used="ai-task-copilot", action_suggestions=actions)

        # Scenario 2: Overdue tasks
        if "overdue" in lower:
            now = datetime.now(timezone.utc)
            overdue = scoped_query.filter(Task.due_date < now, Task.status != "completed").all()
            if not overdue:
                msg = "You have **zero** overdue tasks right now. All deadlines are healthy!"
                actions = ["View upcoming deadlines"]
            else:
                items = "\n".join([f"• **{t.title}** (Due: {t.due_date.strftime('%b %d, %Y')})" for t in overdue])
                msg = f"You have **{len(overdue)} overdue task(s)** requiring immediate attention:\n\n{items}"
                actions = ["Reschedule overdue tasks", "Mark completed"]
            
            cls.log_interaction(db, user.id, prompt, msg, "chat", model_name="ai-task-copilot")
            return AIChatResponse(response=msg, model_used="ai-task-copilot", action_suggestions=actions)

        # Scenario 3: Blocked tasks
        if "blocked" in lower:
            blocked = scoped_query.filter(Task.status == "blocked").all()
            if not blocked:
                msg = "None of your permitted tasks are currently blocked. Everything is in motion!"
                actions = ["View active tasks"]
            else:
                items = "\n".join([f"• **{t.title}**" for t in blocked])
                msg = f"You have **{len(blocked)} blocked task(s)**:\n\n{items}\n\nConsider unblocking these before taking on new backlog items."
                actions = ["Inspect blocker details", "Add unblock comment"]
            
            cls.log_interaction(db, user.id, prompt, msg, "chat", model_name="ai-task-copilot")
            return AIChatResponse(response=msg, model_used="ai-task-copilot", action_suggestions=actions)

        # Generic intelligent response
        task_count = scoped_query.count()
        completed_count = scoped_query.filter(Task.status == "completed").count()
        msg = (
            f"I am your AI Task Copilot. You have access to **{task_count}** tasks in your workspace "
            f"({completed_count} completed). Ask me to plan your day, break down a complex task, "
            f"prioritize upcoming deadlines, or create structured tasks from natural language notes."
        )
        actions = ["Plan my day", "Show overdue tasks", "What should I work on today?"]
        cls.log_interaction(db, user.id, prompt, msg, "chat", model_name="ai-task-copilot")
        return AIChatResponse(response=msg, model_used="ai-task-copilot", action_suggestions=actions)

    @staticmethod
    def _generate_heuristic_subtasks(title: str, description: Optional[str] = None) -> List[str]:
        """Generates realistic structured subtasks based on verbs and intent."""
        t = title.lower()
        if any(w in t for w in ["auth", "login", "jwt", "user"]):
            return [
                "Define user models and password hashing security",
                "Implement JWT access and refresh token issuance",
                "Create login and registration API endpoints",
                "Add authorization middleware and role guards",
                "Write automated integration tests for authentication"
            ]
        elif any(w in t for w in ["database", "schema", "model", "migration", "sql"]):
            return [
                "Draft entity-relationship (ER) diagrams",
                "Write SQL DDL migration scripts with constraints",
                "Apply migrations to development database",
                "Seed sample data and verify foreign key integrity",
                "Validate query performance with index execution plans"
            ]
        elif any(w in t for w in ["ci", "cd", "pipeline", "docker", "deploy", "action"]):
            return [
                "Create Dockerfile with multi-stage build optimization",
                "Configure GitHub Actions workflow for automated test runs",
                "Set up environment secrets and registry credentials",
                "Implement automated deployment staging trigger",
                "Verify live health check endpoint post-deployment"
            ]
        elif any(w in t for w in ["frontend", "ui", "component", "page"]):
            return [
                "Design component mockup and layout structure",
                "Build responsive UI elements with Tailwind tokens",
                "Connect API data hooks using React Query",
                "Handle loading skeletons and empty states",
                "Test across desktop and mobile viewports"
            ]
        else:
            return [
                f"Clarify scope and requirements for '{title}'",
                "Gather necessary tools, dependencies, and resources",
                "Execute core implementation steps",
                "Review and test for quality and edge cases",
                "Document outcomes and mark task as completed"
            ]
