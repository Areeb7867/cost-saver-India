import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    database_url = os.getenv("DATABASE_URL", "sqlite:///./costsaver.db")
    jwt_secret = os.getenv("JWT_SECRET", "local-development-only-change-me")
    admin_email = os.getenv("ADMIN_EMAIL", "").strip().lower()
    frontend_origins = [
        origin.strip()
        for origin in (
            os.getenv("FRONTEND_ORIGINS")
            or os.getenv("FRONTEND_ORIGIN")
            or "http://localhost:3000,http://127.0.0.1:5500,https://areeb7867.github.io"
        ).split(",")
        if origin.strip()
    ]
    jwt_algorithm = "HS256"
    access_token_minutes = 60 * 24


settings = Settings()
