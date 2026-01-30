# Specification Summary

## Purpose
A bilingual (Japanese/Uzbek) student project, schedule, and task manager with calendar views, tags, reminders, and collaboration.

## Key Features
- JWT auth with profile and language/timezone preferences.
- Multi-project support with members and role-based access.
- Tasks with priorities, status, due dates, tags, and filters.
- Calendar events plus unified calendar feed (tasks + events).
- In-app notifications for due tasks and upcoming events.
- UI i18n (ja/uz) with bilingual content fields.
- Offline translation fallback with optional OpenAI provider.

## Non-Functional
- Django 5 + DRF + PostgreSQL.
- Celery + Redis background scheduling.
- React + Vite + TypeScript + Tailwind + FullCalendar.
- Docker Compose for local infra.
