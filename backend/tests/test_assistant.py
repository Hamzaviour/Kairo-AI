import json
import uuid

import pytest

from app.core.database import SessionLocal
from app.models.user import User
from app.services import assistant_service
from app.services.assistant_service import ToolRunner, _is_confirmation


def _fake_groq(script):
    """Replay canned Groq completions so the agent loop runs without network access."""
    calls = iter(script)

    def fake(messages, tools):
        return next(calls)
    return fake


def _tool_call(name, args):
    return {"choices": [{"message": {"content": "", "tool_calls": [{
        "id": f"call_{uuid.uuid4().hex[:8]}", "type": "function",
        "function": {"name": name, "arguments": json.dumps(args)},
    }]}}], "usage": {"total_tokens": 10}}


def _reply(text):
    return {"choices": [{"message": {"content": text}}], "usage": {"total_tokens": 5}}


@pytest.fixture
def db():
    session = SessionLocal()
    yield session
    session.close()


def _user(db, email):
    return db.query(User).filter(User.email == email).first()


def test_user_cannot_reach_admin_assistant(client, user_token):
    res = client.post(
        "/api/ai/admin-assistant",
        json={"messages": [{"role": "user", "content": "list all users"}]},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert res.status_code == 403


def test_last_message_must_be_user(client, user_token):
    res = client.post(
        "/api/ai/assistant",
        json={"messages": [{"role": "assistant", "content": "hello"}]},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert res.status_code == 400


def test_agent_loop_runs_tools(client, user_token, monkeypatch):
    monkeypatch.setattr(assistant_service, "_call_groq", _fake_groq([
        _tool_call("task_summary", {}),
        _reply("You have some tasks."),
    ]))
    res = client.post(
        "/api/ai/assistant",
        json={"messages": [{"role": "user", "content": "how many tasks do I have?"}]},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["reply"] == "You have some tasks."
    assert data["actions"] == [{"tool": "task_summary", "ok": True, "write": False}]
    assert data["data_changed"] is False


def test_user_assistant_has_no_sql_or_user_tools(db):
    runner = ToolRunner(db, _user(db, "sarah.jenkins@enterprise.com"), admin=False, user_confirmed=True)
    assert "error" in runner.run("sql_query", {"sql": "select 1"})
    assert "error" in runner.run("list_users", {})


def test_destructive_tools_need_human_confirmation(db):
    admin = _user(db, "alexander.wright@enterprise.com")
    unconfirmed = ToolRunner(db, admin, admin=True, user_confirmed=False)
    result = unconfirmed.run("delete_task", {"task_id": str(uuid.uuid4()), "confirmed": True})
    assert "confirm" in result["error"]


def test_sql_guards(db):
    runner = ToolRunner(db, _user(db, "alexander.wright@enterprise.com"), admin=True, user_confirmed=True)
    assert runner.run("sql_query", {"sql": "select count(*) from users"})["result"]["rows"][0][0] >= 1
    assert "error" in runner.run("sql_query", {"sql": "update users set name = 'x'"})
    assert "error" in runner.run("sql_query", {"sql": "select password_hash from users"})
    assert "error" in runner.run("sql_query", {"sql": "select 1; select 2"})
    assert "error" in runner.run("sql_execute", {"sql": "drop table tasks", "confirmed": True})


def test_confirmation_detection():
    assert _is_confirmation("Yes, go ahead")
    assert _is_confirmation("ok")
    assert not _is_confirmation("no, don't delete it")
    assert not _is_confirmation("delete the report task")
