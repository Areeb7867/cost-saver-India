import os


class Settings:
    database_url = os.getenv("DATABASE_URL", "sqlite:///./costsaver.db")
    jwt_secret = os.getenv("JWT_SECRET", "local-development-only-change-me")
    admin_email = os.getenv("ADMIN_EMAIL", "").strip().lower()
    frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    jwt_algorithm = "HS256"
    access_token_minutes = 60 * 24


settings = Settings()

