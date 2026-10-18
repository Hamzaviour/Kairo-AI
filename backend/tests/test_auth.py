def test_healthcheck(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["database"]["status"] == "connected"

def test_admin_login(client):
    res = client.post("/api/auth/login", json={
        "email": "alexander.wright@enterprise.com",
        "password": "P@ssw0rd!2026"
    })
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    assert "access_token" in body["data"]
    assert "refresh_token" in body["data"]
    assert body["data"]["user"]["role"] == "admin"
    assert body["data"]["user"]["email"] == "alexander.wright@enterprise.com"

def test_user_login(client):
    res = client.post("/api/auth/login", json={
        "email": "sarah.jenkins@enterprise.com",
        "password": "Secur3_Token#88"
    })
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    assert body["data"]["user"]["role"] == "user"
    assert body["data"]["user"]["email"] == "sarah.jenkins@enterprise.com"

def test_invalid_login(client):
    res = client.post("/api/auth/login", json={
        "email": "alexander.wright@enterprise.com",
        "password": "WrongPassword!"
    })
    assert res.status_code == 401

def test_get_me(client, admin_token, user_token):
    # Admin me
    res_admin = client.get("/api/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_admin.status_code == 200
    assert res_admin.json()["data"]["role"] == "admin"

    # User me
    res_user = client.get("/api/auth/me", headers={"Authorization": f"Bearer {user_token}"})
    assert res_user.status_code == 200
    assert res_user.json()["data"]["role"] == "user"

def test_refresh_token_rotation(client):
    # Login to get refresh token
    login_res = client.post("/api/auth/login", json={
        "email": "sarah.jenkins@enterprise.com",
        "password": "Secur3_Token#88"
    })
    rf = login_res.json()["data"]["refresh_token"]

    # Refresh token
    res = client.post("/api/auth/refresh", json={"refresh_token": rf})
    assert res.status_code == 200
    new_rf = res.json()["data"]["refresh_token"]
    assert new_rf != rf  # Token rotated

    # Attempting to reuse old refresh token must fail (401)
    res_reuse = client.post("/api/auth/refresh", json={"refresh_token": rf})
    assert res_reuse.status_code == 401
