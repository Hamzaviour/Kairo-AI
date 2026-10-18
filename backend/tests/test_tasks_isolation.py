def test_admin_sees_all_tasks(client, admin_token):
    res = client.get("/api/tasks", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    items = res.json()["data"]["items"]
    # Admin sees all tasks across organization (at least the 3 seeded tasks)
    assert len(items) >= 3
    titles = [t["title"] for t in items]
    assert "Implement User Authentication" in titles
    assert "Design Database Schema" in titles
    assert "Setup CI/CD Pipeline" in titles

def test_regular_user_isolation(client, user_token):
    res = client.get("/api/tasks", headers={"Authorization": f"Bearer {user_token}"})
    assert res.status_code == 200
    items = res.json()["data"]["items"]
    
    # Sarah should only see tasks assigned to or created by Sarah
    # In initial seed: Sarah is only assigned "Design Database Schema"
    titles = [t["title"] for t in items]
    assert "Design Database Schema" in titles
    # Alexander's private tasks should NOT be in Sarah's list
    assert "Implement User Authentication" not in titles
    assert "Setup CI/CD Pipeline" not in titles

def test_idor_immunity_on_direct_task_id(client, admin_token, user_token):
    # Find Alexander's task ID via admin query
    res_admin = client.get("/api/tasks", headers={"Authorization": f"Bearer {admin_token}"})
    alex_task = next(t for t in res_admin.json()["data"]["items"] if t["title"] == "Implement User Authentication")
    alex_task_id = alex_task["id"]

    # Sarah attempts to query Alexander's task ID directly: MUST return 404
    res_sarah = client.get(f"/api/tasks/{alex_task_id}", headers={"Authorization": f"Bearer {user_token}"})
    assert res_sarah.status_code == 404, "Security failure: IDOR allowed unauthorized task access!"

    # Sarah attempts to update Alexander's task: MUST return 404
    res_update = client.put(
        f"/api/tasks/{alex_task_id}",
        json={"title": "Hacked Title"},
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res_update.status_code == 404, "Security failure: IDOR allowed unauthorized task modification!"

def test_task_creation_and_subtasks(client, user_token):
    # Sarah creates a personal task
    res = client.post(
        "/api/tasks",
        json={
            "title": "Sarah Personal Task",
            "description": "Research PostgreSQL indexing",
            "priority": "high",
            "subtasks": ["Read documentation", "Benchmark execution time"]
        },
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 201
    task_id = res.json()["data"]["id"]

    # Sarah fetches detail
    res_detail = client.get(f"/api/tasks/{task_id}", headers={"Authorization": f"Bearer {user_token}"})
    assert res_detail.status_code == 200
    detail = res_detail.json()["data"]
    assert detail["title"] == "Sarah Personal Task"
    assert len(detail["subtasks"]) == 2

    # Toggle subtask
    sub_id = detail["subtasks"][0]["id"]
    res_sub = client.patch(f"/api/subtasks/{sub_id}", json={"is_completed": True}, headers={"Authorization": f"Bearer {user_token}"})
    assert res_sub.status_code == 200
    assert res_sub.json()["data"]["is_completed"] is True

def test_task_activity_log_is_scoped(client, admin_token, user_token):
    # Admin creates a private task; its activity log records the creation
    res = client.post(
        "/api/tasks",
        json={"title": "Admin Activity Probe", "priority": "low"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 201
    task_id = res.json()["data"]["id"]

    res_log = client.get(f"/api/tasks/{task_id}/activity", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_log.status_code == 200
    assert res_log.json()["data"][0]["action"] == "created"

    # Sarah cannot read another user's activity log
    res_probe = client.get(f"/api/tasks/{task_id}/activity", headers={"Authorization": f"Bearer {user_token}"})
    assert res_probe.status_code == 404

def test_admin_audit_logs_and_user_denied(client, admin_token, user_token):
    res = client.get("/api/admin/audit-logs", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    assert isinstance(res.json()["data"], list) and len(res.json()["data"]) > 0

    res_user = client.get("/api/admin/audit-logs", headers={"Authorization": f"Bearer {user_token}"})
    assert res_user.status_code == 403
