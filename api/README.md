# CostSaver India API

FastAPI backend for accounts, saved budget plans, and an administrator-only account list.

## Features

- `POST /auth/register` creates an account with a bcrypt-hashed password.
- `POST /auth/login` returns a signed access token.
- `GET /users/me` returns the signed-in user's profile.
- `POST /budgets` and `GET /budgets` save and list only the signed-in user's plans.
- `GET /admin/users` lists registered accounts for the configured administrator only.
- Interactive API documentation is available at `/docs` while the API runs.

## Run locally

1. Install Python 3.12 or later.
2. In the `api` directory, copy `.env.example` to `.env` and replace `ADMIN_EMAIL` and `JWT_SECRET`.
3. Run `pip install -r requirements.txt`.
4. Run `uvicorn app.main:app --reload`.
5. Open `http://127.0.0.1:8000/docs`.

SQLite is used locally. When ready for deployment, set `DATABASE_URL` to the PostgreSQL connection URL supplied by Supabase. Keep `.env` private and never commit it.

## Run tests

Run `pytest` from this directory. The test verifies registration, administrator access, saving a budget, and retrieving saved budgets.

## Security notes

- Passwords are never returned or stored in plain text.
- The first account whose email matches `ADMIN_EMAIL` receives the `admin` role.
- Only an authenticated user can access their own budgets.
- Only an `admin` can call `/admin/users`.
- Before public deployment, set a long random `JWT_SECRET`, configure the deployed frontend URL in `FRONTEND_ORIGIN`, and use HTTPS.

