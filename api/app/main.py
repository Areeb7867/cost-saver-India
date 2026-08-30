from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, engine, get_db
from .models import Budget, User
from .schemas import BudgetCreate, BudgetResponse, LoginRequest, RegisterRequest, TokenResponse, UserResponse
from .security import create_access_token, get_current_user, hash_password, require_admin, verify_password

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CostSaver India API", version="0.1.0", description="Secure APIs for saved CostSaver plans.")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account already exists for this email")
    role = "admin" if settings.admin_email and email == settings.admin_email else "user"
    user = User(email=email, full_name=payload.full_name, password_hash=hash_password(payload.password), role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=TokenResponse)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    return TokenResponse(access_token=create_access_token(user))


@app.get("/users/me", response_model=UserResponse)
def read_current_user(user: User = Depends(get_current_user)):
    return user


@app.post("/budgets", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def save_budget(payload: BudgetCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    budget = Budget(user_id=user.id, **payload.model_dump())
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


@app.get("/budgets", response_model=list[BudgetResponse])
def list_saved_budgets(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list(db.scalars(select(Budget).where(Budget.user_id == user.id).order_by(Budget.created_at.desc())))


@app.get("/admin/users", response_model=list[UserResponse])
def list_registered_users(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return list(db.scalars(select(User).order_by(User.created_at.desc()).limit(100)))

