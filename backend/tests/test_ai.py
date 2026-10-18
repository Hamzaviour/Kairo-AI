def test_ai_parse_task(client, user_token):
    res = client.post(
        "/api/ai/parse-task",
        json={"text": "Urgent: Complete security vulnerability patch and deploy to production by tomorrow"},
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200
    data = res.json()["data"]
    assert "security vulnerability patch" in data["title"].lower()
    assert data["priority"] == "urgent"
    assert data["due_date"] is not None
    assert len(data["suggested_subtasks"]) >= 3

def test_ai_subtask_breakdown(client, user_token):
    res = client.post(
        "/api/ai/breakdown",
        json={"task_title": "Implement User Authentication JWT API"},
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200
    subtasks = res.json()["data"]["subtasks"]
    assert len(subtasks) >= 3
    assert any("jwt" in s.lower() or "auth" in s.lower() or "password" in s.lower() for s in subtasks)

def test_ai_prioritize_task(client, user_token):
    # Get Sarah's task
    tasks_res = client.get("/api/tasks", headers={"Authorization": f"Bearer {user_token}"})
    task_id = tasks_res.json()["data"]["items"][0]["id"]

    res = client.post(
        "/api/ai/prioritize",
        json={"task_id": task_id},
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200
    prio_data = res.json()["data"]
    assert "priority_score" in prio_data
    assert "rationale" in prio_data
    assert len(prio_data["factors"]) > 0

def test_ai_smart_schedule(client, user_token):
    res = client.post("/api/ai/smart-schedule", headers={"Authorization": f"Bearer {user_token}"})
    assert res.status_code == 200
    sched = res.json()["data"]
    assert "schedule" in sched
    assert "total_allocated_minutes" in sched
    assert len(sched["suggestions"]) > 0

def test_ai_chat_privacy_scoping(client, user_token):
    res = client.post(
        "/api/ai/chat",
        json={"prompt": "What should I work on today?"},
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200
    answer = res.json()["data"]
    assert "response" in answer
    # Sarah should NEVER see Alexander's private tasks mentioned in AI chat!
    assert "Implement User Authentication" not in answer["response"]
