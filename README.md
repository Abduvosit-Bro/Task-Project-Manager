# Student Project / Schedule / Task Manager

Bilingual (Japanese/Uzbek) student project/task/calendar app with offline translation fallback, in-app notifications, and a clean React UI.

## Stack
- Django 5 + DRF + PostgreSQL
- JWT auth (simplejwt)
- Celery + Redis (notifications)
- drf-spectacular (OpenAPI)
- React + Vite + TypeScript + Tailwind + FullCalendar

## Quick Start

### 1) Infrastructure
```bash
docker compose up -d
```

### 2) Backend
```bash
cd backend
cp .env.example .env
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

### 3) Celery (worker + beat)
```bash
cd backend
.\.venv\Scripts\activate
celery -A config.celery worker -l info
celery -A config.celery beat -l info
```

#### Windows note
On Windows, run the worker in solo mode to avoid `WinError 5` issues:
```powershell
celery -A config.celery worker -l info -P solo -c 1
```

### 4) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open:
- API docs: `http://localhost:8000/api/docs/`
- UI: `http://localhost:5173`

## New Endpoints
- `GET /api/auth/timezones` -> list of IANA timezones
- `GET /api/notifications/{id}` -> notification details with related entity snapshot

## Regression Notes
- "New Project" modal now displays API validation errors and refreshes the project list on success.

## Demo Account
- Email: `demo@example.com`
- Password: `password123`

## Tests
```bash
cd backend
pytest
```

## Notes
- Offline translation is deterministic: `[UZ]` or `[JA]` prefixes.
- If `OPENAI_API_KEY` is set, the translation provider will attempt OpenAI first and fallback to local.
- Default timezone: `Asia/Tashkent`.
