import sys
import os
import pytest

# Clean sys.path
sys.path = [p for p in sys.path if not p.endswith('_editable_impl_knowly_backend.pth') and 'knowly' not in p.lower()]
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="session")
def admin_token(client):
    res = client.post("/api/auth/login", json={
        "email": "alexander.wright@enterprise.com",
        "password": "P@ssw0rd!2026"
    })
    assert res.status_code == 200, f"Admin login failed: {res.text}"
    return res.json()["data"]["access_token"]

@pytest.fixture(scope="session")
def user_token(client):
    res = client.post("/api/auth/login", json={
        "email": "sarah.jenkins@enterprise.com",
        "password": "Secur3_Token#88"
    })
    assert res.status_code == 200, f"User login failed: {res.text}"
    return res.json()["data"]["access_token"]
