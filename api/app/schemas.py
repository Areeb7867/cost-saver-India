from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=120)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}


class BudgetCreate(BaseModel):
    name: str = Field(default="Monthly plan", max_length=120)
    monthly_income: float = Field(ge=0)
    planned_spending: float = Field(ge=0)
    monthly_balance: float
    notes: str | None = Field(default=None, max_length=1000)


class BudgetResponse(BudgetCreate):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

