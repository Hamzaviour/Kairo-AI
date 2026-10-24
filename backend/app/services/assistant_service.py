"""
Tool-calling chat assistants backed by Groq.

Two personas share one agent loop:
- the user assistant can only reach records the signed-in user is permitted to see,
  because every tool goes through the same scoped services the REST API uses;
- the admin assistant adds user management and direct SQL over the whole database.

Destructive tools only run when the latest human message is an explicit confirmation,
so the model cannot delete anything on its own initiative.
"""
import json
import re
import time
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional
from uuid import UUID

import httpx
from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy import text, inspect as sa_inspect
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import engine
from app.models.user import User
from app.models.task import Task, Subtask
from app.models.project import Project
from app.models.productivity import AIInteraction
from app.schemas.task import TaskCreate, TaskUpdate, SubtaskCreate, SubtaskUpdate
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectMemberAdd
from app.schemas.collaboration import CommentCreate
from app.schemas.user import UserCreate, UserUpdate
from app.services import task_service
from app.api.endpoints import subtasks as subtask_routes
from app.api.endpoints import comments as comment_routes
from app.api.endpoints import projects as project_routes
from app.api.endpoints import admin as admin_routes

MAX_TOOL_ROUNDS = 8
MAX_HISTORY = 12
MAX_TOOL_RESULT_CHARS = 8000
MAX_SQL_ROWS = 100
SENSITIVE_COLUMNS = ("password_hash", "token_hash")
CONFIRM_PATTERN = re.compile(
    r"\b(yes|yep|yeah|confirm(ed)?|go ahead|do it|proceed|sure|ok(ay)?|approved?)\b", re.IGNORECASE
)
DECLINE_PATTERN = re.compile(r"\b(no|nope|don'?t|do not|cancel|stop)\b", re.IGNORECASE)


def _is_confirmation(message: str) -> bool:
    return bool(CONFIRM_PATTERN.search(message)) and not DECLINE_PATTERN.search(message)

TASK_STATUSES = ["backlog", "todo", "in_progress", "in_review", "blocked", "completed"]
TASK_PRIORITIES = ["low", "medium", "high", "urgent"]


class AssistantError(Exception):
    """Raised when the LLM provider is unreachable or misconfigured."""


# ---------------------------------------------------------------- serializers

def _iso(value: Optional[datetime]) -> Optional[str]:
    return value.isoformat() if value else None


def _task_dict(t: Task, detail: bool = False) -> Dict[str, Any]:
    data = {
        "id": str(t.id),
        "title": t.title,
        "status": t.status,
        "priority": t.priority,
        "due_date": _iso(t.due_date),
        "assignee": t.assignee.name if t.assignee else None,
        "creator": t.creator.name if t.creator else None,
        "project": t.project.name if t.project else None,
        "project_id": str(t.project_id) if t.project_id else None,
        "subtasks_done": f"{sum(1 for s in t.subtasks if s.is_completed)}/{len(t.subtasks)}",
    }
    if detail:
        data.update({
            "description": t.description,
            "estimated_minutes": t.estimated_minutes,
            "assignee_id": str(t.assignee_id) if t.assignee_id else None,
            "created_at": _iso(t.created_at),
            "completed_at": _iso(t.completed_at),
            "subtasks": [
                {"id": str(s.id), "title": s.title, "is_completed": s.is_completed} for s in t.subtasks
            ],
            "comments": [
                {"id": str(c.id), "author": c.user.name if c.user else None, "content": c.content,
                 "created_at": _iso(c.created_at)}
                for c in t.comments[-10:]
            ],
        })
    return data


def _project_dict(p: Project) -> Dict[str, Any]:
    return {
        "id": str(p.id),
        "name": p.name,
        "description": p.description,
        "owner": p.owner.name if p.owner else None,
        "tasks": len(p.tasks),
        "completed_tasks": sum(1 for t in p.tasks if t.status == "completed"),
        "members": [{"user_id": str(m.user_id), "name": m.user.name if m.user else None, "role": m.role}
                    for m in p.members],
    }


def _user_dict(u: User) -> Dict[str, Any]:
    return {
        "id": str(u.id), "name": u.name, "email": u.email, "role": u.role,
        "is_active": u.is_active, "created_at": _iso(u.created_at),
    }


def _jsonable(value: Any) -> Any:
    if isinstance(value, (datetime,)):
        return value.isoformat()
    if isinstance(value, UUID):
        return str(value)
    if isinstance(value, (dict, list, str, int, float, bool)) or value is None:
        return value
    return str(value)


# ---------------------------------------------------------------- tool schemas

def _fn(name: str, description: str, properties: Dict[str, Any], required: Optional[List[str]] = None):
    return {
        "type": "function",
        "function": {
            "name": name,
            "description": description,
            "parameters": {"type": "object", "properties": properties, "required": required or []},
        },
    }


STR = {"type": "string"}
BOOL = {"type": "boolean"}
INT = {"type": "integer"}
CONFIRM = {"type": "boolean", "description": "Set true only after the user explicitly confirmed this deletion."}

TASK_FIELDS = {
    "title": STR,
    "description": STR,
    "status": {"type": "string", "enum": TASK_STATUSES},
    "priority": {"type": "string", "enum": TASK_PRIORITIES},
    "due_date": {"type": "string", "description": "ISO 8601 datetime, e.g. 2026-10-30T17:00:00Z"},
    "start_date": {"type": "string", "description": "ISO 8601 datetime"},
    "estimated_minutes": INT,
    "project_id": {"type": "string", "description": "Project UUID"},
    "assignee_id": {"type": "string", "description": "User UUID"},
}

USER_TOOLS = [
    _fn("list_tasks", "Search the tasks visible to the current user. Returns ids needed by other tools.", {
        "status": {"type": "string", "enum": TASK_STATUSES},
        "priority": {"type": "string", "enum": TASK_PRIORITIES},
        "search": {"type": "string", "description": "Case-insensitive text matched against title and description"},
        "project_id": STR,
        "overdue_only": BOOL,
        "limit": {"type": "integer", "description": "Default 25, max 100"},
    }),
    _fn("get_task", "Full detail of one task, including subtasks and recent comments.", {"task_id": STR}, ["task_id"]),
    _fn("create_task", "Create a task. Optionally seed a subtask checklist.", {
        **TASK_FIELDS,
        "subtasks": {"type": "array", "items": STR, "description": "Checklist item titles"},
    }, ["title"]),
    _fn("update_task", "Change any fields of an existing task (status, priority, due date, title, ...).",
        {"task_id": STR, **TASK_FIELDS}, ["task_id"]),
    _fn("delete_task", "Archive (delete) a task. Ask the user to confirm first.",
        {"task_id": STR, "confirmed": CONFIRM}, ["task_id", "confirmed"]),
    _fn("duplicate_task", "Copy a task together with its subtasks.", {"task_id": STR}, ["task_id"]),
    _fn("add_subtask", "Add a checklist item to a task.", {"task_id": STR, "title": STR}, ["task_id", "title"]),
    _fn("update_subtask", "Rename a checklist item or tick it complete / incomplete.",
        {"subtask_id": STR, "title": STR, "is_completed": BOOL}, ["subtask_id"]),
    _fn("delete_subtask", "Remove a checklist item. Ask the user to confirm first.",
        {"subtask_id": STR, "confirmed": CONFIRM}, ["subtask_id", "confirmed"]),
    _fn("add_comment", "Post a comment on a task.", {"task_id": STR, "content": STR}, ["task_id", "content"]),
    _fn("delete_comment", "Delete a comment. Ask the user to confirm first.",
        {"comment_id": STR, "confirmed": CONFIRM}, ["comment_id", "confirmed"]),
    _fn("list_projects", "List projects visible to the current user, with members.", {}),
    _fn("create_project", "Create a project; the current user becomes its lead.",
        {"name": STR, "description": STR, "color": {"type": "string", "description": "Hex like #6366f1"}}, ["name"]),
    _fn("update_project", "Rename or re-describe a project.",
        {"project_id": STR, "name": STR, "description": STR, "color": STR}, ["project_id"]),
    _fn("delete_project", "Archive a project. Ask the user to confirm first.",
        {"project_id": STR, "confirmed": CONFIRM}, ["project_id", "confirmed"]),
    _fn("add_project_member", "Add a user to a project (owner or admin only).", {
        "project_id": STR, "user_id": STR, "role": {"type": "string", "enum": ["lead", "member", "viewer"]},
    }, ["project_id", "user_id"]),
    _fn("remove_project_member", "Remove a user from a project. Ask the user to confirm first.",
        {"project_id": STR, "user_id": STR, "confirmed": CONFIRM}, ["project_id", "user_id", "confirmed"]),
    _fn("task_summary", "Counts of visible tasks by status and priority, plus overdue count.", {}),
]

ADMIN_TOOLS = USER_TOOLS + [
    _fn("list_users", "List every user account.", {"search": {"type": "string", "description": "Match name or email"}}),
    _fn("create_user", "Provision a new user account.", {
        "name": STR, "email": STR, "password": {"type": "string", "description": "Min 6 chars"},
        "role": {"type": "string", "enum": ["admin", "user"]},
    }, ["name", "email", "password"]),
    _fn("update_user", "Change a user's name, email, role, or activate / deactivate the account.", {
        "user_id": STR, "name": STR, "email": STR, "role": {"type": "string", "enum": ["admin", "user"]},
        "is_active": BOOL,
    }, ["user_id"]),
    _fn("delete_user", "Permanently delete a user account and everything it owns. Ask the user to confirm first.",
        {"user_id": STR, "confirmed": CONFIRM}, ["user_id", "confirmed"]),
    _fn("list_tables", "List every database table with its columns and types.", {}),
    _fn("sql_query", "Run one read-only SELECT (or WITH ... SELECT) against PostgreSQL. Max 100 rows returned.",
        {"sql": STR}, ["sql"]),
    _fn("sql_execute",
        "Run one INSERT, UPDATE or DELETE statement against PostgreSQL. Schema changes are not allowed. "
        "Describe the exact statement and ask the user to confirm before calling with confirmed=true.",
        {"sql": STR, "confirmed": CONFIRM}, ["sql", "confirmed"]),
]

WRITE_TOOLS = {
    "create_task", "update_task", "delete_task", "duplicate_task", "add_subtask", "update_subtask",
    "delete_subtask", "add_comment", "delete_comment", "create_project", "update_project", "delete_project",
    "add_project_member", "remove_project_member", "create_user", "update_user", "delete_user", "sql_execute",
}
CONFIRM_TOOLS = {name for name in WRITE_TOOLS if name.startswith(("delete_", "remove_"))} | {"sql_execute"}


# ---------------------------------------------------------------- tool runner

class ToolRunner:
    def __init__(self, db: Session, user: User, admin: bool, user_confirmed: bool):
        self.db = db
        self.user = user
        self.admin = admin
        self.user_confirmed = user_confirmed

    def run(self, name: str, args: Dict[str, Any]) -> Dict[str, Any]:
        allowed = {t["function"]["name"] for t in (ADMIN_TOOLS if self.admin else USER_TOOLS)}
        if name not in allowed:
            return {"error": f"Tool '{name}' is not available to you."}
        if name in CONFIRM_TOOLS and not (args.get("confirmed") and self.user_confirmed):
            return {"error": "Not executed: ask the user to explicitly confirm this action, then retry with confirmed=true."}
        handler: Callable[..., Any] = getattr(self, f"t_{name}")
        try:
            return {"result": handler(**{k: v for k, v in args.items() if k != "confirmed"})}
        except HTTPException as exc:
            self.db.rollback()
            return {"error": exc.detail}
        except ValidationError as exc:
            self.db.rollback()
            return {"error": "Invalid arguments: " + "; ".join(e["msg"] for e in exc.errors())}
        except (ValueError, TypeError) as exc:
            self.db.rollback()
            return {"error": str(exc)}
        except Exception as exc:  # surface DB errors to the model instead of failing the chat
            self.db.rollback()
            return {"error": f"{type(exc).__name__}: {str(exc).splitlines()[0][:300]}"}

    # -- tasks
    def t_list_tasks(self, status=None, priority=None, search=None, project_id=None, overdue_only=False, limit=25):
        q = task_service.get_scoped_tasks_query(self.db, self.user)
        if status:
            q = q.filter(Task.status == status)
        if priority:
            q = q.filter(Task.priority == priority)
        if project_id:
            q = q.filter(Task.project_id == UUID(project_id))
        if search:
            like = f"%{search}%"
            q = q.filter(Task.title.ilike(like) | Task.description.ilike(like))
        if overdue_only:
            q = q.filter(Task.due_date < datetime.now(timezone.utc), Task.status != "completed")
        total = q.count()
        rows = q.order_by(Task.due_date.asc().nullslast(), Task.created_at.desc()).limit(min(int(limit or 25), 100)).all()
        return {"total_matching": total, "tasks": [_task_dict(t) for t in rows]}

    def t_get_task(self, task_id):
        return _task_dict(task_service.get_task_or_404(self.db, UUID(task_id), self.user), detail=True)

    def t_create_task(self, **fields):
        task = task_service.create_task(self.db, TaskCreate(**fields), self.user)
        return _task_dict(task, detail=True)

    def t_update_task(self, task_id, **fields):
        task = task_service.update_task(self.db, UUID(task_id), TaskUpdate(**fields), self.user)
        return _task_dict(task, detail=True)

    def t_delete_task(self, task_id):
        task_service.delete_task(self.db, UUID(task_id), self.user)
        return "Task archived."

    def t_duplicate_task(self, task_id):
        return _task_dict(task_service.duplicate_task(self.db, UUID(task_id), self.user))

    # -- subtasks & comments
    def t_add_subtask(self, task_id, title):
        res = subtask_routes.add_subtask(UUID(task_id), SubtaskCreate(title=title), current_user=self.user, db=self.db)
        return res.data.model_dump(mode="json")

    def t_update_subtask(self, subtask_id, **fields):
        res = subtask_routes.update_subtask(UUID(subtask_id), SubtaskUpdate(**fields), current_user=self.user, db=self.db)
        return res.data.model_dump(mode="json")

    def t_delete_subtask(self, subtask_id):
        subtask_routes.delete_subtask(UUID(subtask_id), current_user=self.user, db=self.db)
        return "Subtask deleted."

    def t_add_comment(self, task_id, content):
        res = comment_routes.add_comment(UUID(task_id), CommentCreate(content=content), current_user=self.user, db=self.db)
        return {"id": str(res.data.id), "content": res.data.content}

    def t_delete_comment(self, comment_id):
        comment_routes.delete_comment(UUID(comment_id), current_user=self.user, db=self.db)
        return "Comment deleted."

    # -- projects
    def _visible_projects(self):
        res = project_routes.list_projects(current_user=self.user, db=self.db)
        ids = [p.id for p in res.data]
        return self.db.query(Project).filter(Project.id.in_(ids)).all() if ids else []

    def t_list_projects(self):
        return [_project_dict(p) for p in self._visible_projects()]

    def t_create_project(self, **fields):
        res = project_routes.create_project(ProjectCreate(**fields), current_user=self.user, db=self.db)
        return {"id": str(res.data.id), "name": res.data.name}

    def t_update_project(self, project_id, **fields):
        res = project_routes.update_project(UUID(project_id), ProjectUpdate(**fields), current_user=self.user, db=self.db)
        return {"id": str(res.data.id), "name": res.data.name, "description": res.data.description}

    def t_delete_project(self, project_id):
        project_routes.delete_project(UUID(project_id), current_user=self.user, db=self.db)
        return "Project archived."

    def t_add_project_member(self, project_id, user_id, role="member"):
        project_routes.add_project_member(
            UUID(project_id), ProjectMemberAdd(user_id=UUID(user_id), role=role), current_user=self.user, db=self.db
        )
        return "Member added."

    def t_remove_project_member(self, project_id, user_id):
        project_routes.remove_project_member(UUID(project_id), UUID(user_id), current_user=self.user, db=self.db)
        return "Member removed."

    def t_task_summary(self):
        tasks = task_service.get_scoped_tasks_query(self.db, self.user).all()
        now = datetime.now(timezone.utc)
        by_status = {s: 0 for s in TASK_STATUSES}
        by_priority = {p: 0 for p in TASK_PRIORITIES}
        for t in tasks:
            by_status[t.status] = by_status.get(t.status, 0) + 1
            by_priority[t.priority] = by_priority.get(t.priority, 0) + 1
        overdue = sum(1 for t in tasks if t.due_date and t.due_date < now and t.status != "completed")
        return {"total": len(tasks), "by_status": by_status, "by_priority": by_priority, "overdue": overdue}

    # -- admin: users
    def t_list_users(self, search=None):
        q = self.db.query(User)
        if search:
            like = f"%{search}%"
            q = q.filter(User.name.ilike(like) | User.email.ilike(like))
        return [_user_dict(u) for u in q.order_by(User.name).all()]

    def t_create_user(self, **fields):
        res = admin_routes.admin_create_user(UserCreate(**fields), admin_user=self.user, db=self.db)
        return res.data.model_dump(mode="json")

    def t_update_user(self, user_id, **fields):
        res = admin_routes.admin_update_user(UUID(user_id), UserUpdate(**fields), admin_user=self.user, db=self.db)
        return res.data.model_dump(mode="json")

    def t_delete_user(self, user_id):
        uid = UUID(user_id)
        if uid == self.user.id:
            raise ValueError("You cannot delete your own administrator account.")
        target = self.db.query(User).filter(User.id == uid).first()
        if not target:
            raise ValueError("User not found.")
        name = target.name
        self.db.delete(target)
        self.db.commit()
        return f"User '{name}' deleted."

    # -- admin: raw database
    def t_list_tables(self):
        insp = sa_inspect(engine)
        return {
            table: [f"{c['name']} {c['type']}" for c in insp.get_columns(table)]
            for table in sorted(insp.get_table_names())
        }

    @staticmethod
    def _single_statement(sql: str) -> str:
        sql = sql.strip().rstrip(";").strip()
        if not sql:
            raise ValueError("Empty SQL statement.")
        if ";" in sql:
            raise ValueError("Only one SQL statement per call is allowed.")
        lowered = sql.lower()
        if any(col in lowered for col in SENSITIVE_COLUMNS):
            raise ValueError("Password and token hashes are never exposed or edited through the assistant.")
        return sql

    def t_sql_query(self, sql):
        sql = self._single_statement(sql)
        if not re.match(r"^(select|with|explain)\b", sql, re.IGNORECASE):
            raise ValueError("sql_query only accepts SELECT / WITH / EXPLAIN. Use sql_execute for writes.")
        with engine.connect() as conn:
            trans = conn.begin()
            try:
                conn.execute(text("SET TRANSACTION READ ONLY"))
                result = conn.execute(text(sql))
                columns = list(result.keys())
                rows = result.fetchmany(MAX_SQL_ROWS + 1)
            finally:
                trans.rollback()
        truncated = len(rows) > MAX_SQL_ROWS
        return {
            "columns": columns,
            "rows": [[_jsonable(v) for v in r] for r in rows[:MAX_SQL_ROWS]],
            "truncated": truncated,
        }

    def t_sql_execute(self, sql):
        sql = self._single_statement(sql)
        if not re.match(r"^(insert|update|delete)\b", sql, re.IGNORECASE):
            raise ValueError("sql_execute only accepts INSERT, UPDATE or DELETE.")
        if re.search(r"\b(drop|truncate|alter|create|grant|revoke)\b", sql, re.IGNORECASE):
            raise ValueError("Schema-changing keywords are not allowed.")
        with engine.begin() as conn:
            result = conn.execute(text(sql))
            return {"rows_affected": result.rowcount}


# ---------------------------------------------------------------- agent loop

def _system_prompt(user: User, admin: bool) -> str:
    now = datetime.now(timezone.utc).strftime("%A %Y-%m-%d %H:%M UTC")
    common = (
        f"Current time: {now}. You are talking to {user.name} ({user.email}), timezone {user.timezone or 'UTC'}.\n"
        "You act on the live database through tools. Rules:\n"
        "- Never invent ids. Look records up with a list/search tool first, then act on the returned id.\n"
        "- When the user names a task or project loosely, search for it; if several match, ask which one.\n"
        "- Convert relative dates (\"next Friday 5pm\") to ISO 8601 in the user's timezone.\n"
        "- For any delete/remove/sql_execute: first state exactly what will be removed or changed and ask "
        "\"Shall I proceed?\". Only call the tool with confirmed=true after the user replies yes in a new message.\n"
        "- After a write, confirm briefly what changed. If a tool returns an error, explain it plainly.\n"
        "- Answer concisely with Markdown: short bullet lists, **bold** names. Do not show raw UUIDs unless asked.\n"
    )
    if admin:
        return (
            "You are the TaskPilot Admin Assistant for the HCCDI task-management platform. The user is an "
            "administrator with full access: every user's tasks, projects, comments, user accounts, and the raw "
            "PostgreSQL database (use list_tables to learn the schema, sql_query to read, sql_execute to write). "
            "Prefer the typed tools for tasks, projects and users because they keep the audit trail; use SQL for "
            "reporting, cross-table questions, and tables without a typed tool.\n" + common
        )
    return (
        "You are the TaskPilot Assistant for the HCCDI task-management platform. You help this user create, "
        "read, update and delete their own tasks, subtasks, comments and projects. You can only see records "
        "this user is permitted to access; never claim to see other people's private data.\n" + common
    )


def _call_groq(messages: List[Dict[str, Any]], tools: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not settings.GROQ_API_KEY:
        raise AssistantError("GROQ_API_KEY is not configured on the server.")
    # Attempt plan: primary model; on a rate limit switch to the fallback model, then wait out the limit once.
    # Groq also rejects the occasional malformed tool call with `tool_use_failed`; a resample usually fixes it.
    models = [settings.GROQ_MODEL, settings.GROQ_FALLBACK_MODEL or settings.GROQ_MODEL, settings.GROQ_MODEL]
    model_idx = 0
    resp = None
    for _ in range(4):
        model = models[model_idx]
        payload = {
            "model": model,
            "messages": messages,
            "tools": tools,
            "tool_choice": "auto",
            "temperature": 0.2,
            "max_tokens": 2048,
        }
        if model.startswith("openai/gpt-oss"):
            payload["reasoning_effort"] = "low"
        try:
            resp = httpx.post(
                f"{settings.GROQ_BASE_URL}/chat/completions",
                json=payload,
                headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                timeout=60,
            )
        except httpx.HTTPError as exc:
            raise AssistantError(f"Could not reach Groq: {exc}") from exc
        if resp.status_code == 400 and "tool_use_failed" in resp.text:
            continue
        if resp.status_code == 429 and model_idx < len(models) - 1:
            model_idx += 1
            if model_idx == len(models) - 1:
                time.sleep(min(float(resp.headers.get("retry-after", 5) or 5), 15))
            continue
        break
    if resp.status_code == 429:
        raise AssistantError("The AI service is busy (Groq rate limit). Please try again in a few seconds.")
    if resp.status_code != 200:
        try:
            detail = resp.json().get("error", {}).get("message", resp.text)
        except ValueError:
            detail = resp.text
        raise AssistantError(f"Groq error {resp.status_code}: {detail[:300]}")
    return resp.json()


def run_assistant(db: Session, user: User, history: List[Dict[str, str]], admin: bool) -> Dict[str, Any]:
    """Run one assistant turn. `history` is the visible conversation, newest message last."""
    tools = ADMIN_TOOLS if admin else USER_TOOLS
    last_user = next((m["content"] for m in reversed(history) if m["role"] == "user"), "")
    runner = ToolRunner(db, user, admin, user_confirmed=_is_confirmation(last_user))

    messages: List[Dict[str, Any]] = [{"role": "system", "content": _system_prompt(user, admin)}]
    # Recent turns only: keeps each request inside Groq's per-minute token budget
    messages += [{"role": m["role"], "content": m["content"]} for m in history[-MAX_HISTORY:]]

    actions: List[Dict[str, Any]] = []
    tokens = 0
    reply = ""
    for _ in range(MAX_TOOL_ROUNDS):
        try:
            completion = _call_groq(messages, tools)
        except AssistantError as exc:
            if not actions:
                raise
            # Tools already ran (possibly writes), so report what happened instead of failing the whole turn
            done = ", ".join(a["tool"] for a in actions if a["ok"]) or "nothing"
            reply = f"I ran these steps: {done}, but couldn't finish my reply: {exc}"
            break
        tokens += completion.get("usage", {}).get("total_tokens", 0)
        msg = completion["choices"][0]["message"]
        calls = msg.get("tool_calls") or []
        if not calls:
            reply = msg.get("content") or ""
            break
        messages.append({"role": "assistant", "content": msg.get("content") or "", "tool_calls": calls})
        for call in calls:
            name = call["function"]["name"]
            try:
                args = json.loads(call["function"].get("arguments") or "{}") or {}
            except json.JSONDecodeError:
                args = {}
            outcome = runner.run(name, args)
            actions.append({"tool": name, "ok": "error" not in outcome, "write": name in WRITE_TOOLS})
            messages.append({
                "role": "tool",
                "tool_call_id": call["id"],
                "content": json.dumps(outcome, default=str)[:MAX_TOOL_RESULT_CHARS],
            })
    else:
        reply = "I ran out of steps for this request. Try breaking it into smaller asks."

    db.add(AIInteraction(
        user_id=user.id,
        prompt=last_user[:4000],
        response=reply[:8000],
        model=settings.GROQ_MODEL,
        tokens_used=tokens or None,
        interaction_type="admin_assistant" if admin else "assistant",
        metadata_={"actions": actions},
    ))
    db.commit()

    return {
        "reply": reply,
        "actions": actions,
        "data_changed": any(a["write"] and a["ok"] for a in actions),
        "model": settings.GROQ_MODEL,
    }
