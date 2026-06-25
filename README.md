# prj-handball

Project skeleton and local development stack for the handball analytics MVP.

## Stack (A-MVP 01)

- **Backend:** FastAPI (`backend/`)
- **Frontend:** Next.js (`frontend/`)
- **Local services:** PostgreSQL + Redis via Docker Compose

## Quick start

### 1) Run everything with Docker Compose

```bash
docker compose up --build
```

This starts:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend health: http://localhost:8000/health
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### 2) Verify health from frontend

Open http://localhost:3000 and confirm the home page shows backend health status.

## Environment files

Example files are included:

- `backend/.env.example`
- `frontend/.env.example`

Copy them to `.env` if you want to customize local settings (optional for compose quick start).
