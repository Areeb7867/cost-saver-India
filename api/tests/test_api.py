import os

os.environ["DATABASE_URL"] = "sqlite:///./test_costsaver.db"
os.environ["ADMIN_EMAIL"] = "admin@example.com"

from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
client = TestClient(app)


def test_registration_login_and_admin_access():
    created = client.post("/auth/register", json={"email": "admin@example.com", "password": "secure-pass-123"})
    assert created.status_code == 201
    token = client.post("/auth/login", json={"email": "admin@example.com", "password": "secure-pass-123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    assert client.get("/admin/users", headers=headers).status_code == 200
    budget = client.post("/budgets", headers=headers, json={"monthly_income": 50000, "planned_spending": 37000, "monthly_balance": 13000})
    assert budget.status_code == 201
    assert len(client.get("/budgets", headers=headers).json()) == 1

