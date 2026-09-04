# Production Deployment Guide

This project is ready to run as a Dockerized Next.js application with persistent SQLite storage.

## Important database note

The app currently uses SQLite. That is excellent for a small portfolio and a single persistent server, but it is **not appropriate for serverless platforms with ephemeral filesystems** unless you migrate the database to PostgreSQL first.

For the current codebase, the simplest production path is a Docker-capable host with a persistent volume (for example a VPS, Railway/Render-style persistent service, or your own server).

## Docker

1. Copy `.env.example` to `.env`.
2. Replace all development secrets.
3. Set your AI provider key.
4. Build and start:

```bash
docker compose up --build -d
```

The SQLite database is stored in the named `portfolio_data` volume and survives container restarts.

Health endpoint:

```text
GET /api/health
```

## Production secrets

Never commit `.env`.

Use a strong random `AUTH_SECRET`, a unique admin password, and your real AI provider key. Keep secrets in your hosting provider's secret manager where available.

## Before going public

- Change `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Generate a new `AUTH_SECRET`.
- Configure `OPENROUTER_API_KEY` or `OPENAI_API_KEY`.
- Replace project URLs only with real deployed URLs.
- Verify `/api/health` returns `ok: true`.
- Test `/admin/login`.
- Test the chatbot and project case-study routes.
- Test mobile and light/dark modes.

## If you want Vercel later

Migrate Prisma from SQLite to PostgreSQL first (Neon, Supabase, Railway, or another managed PostgreSQL provider). Then change the Prisma datasource provider and `DATABASE_URL`, create a production migration, and deploy with Prisma generation/migrations as part of the build/release process.

## AI feedback storage

The portfolio assistant now stores anonymous answer feedback in the `ChatFeedback` SQLite table. It records the visitor's rating, optional improvement reason/comment, the question, and the assistant answer. No IP address, email address, or other unnecessary visitor identity data is stored.

After updating an existing database, the application creates the feedback table automatically. For a fresh database, `npm run db:setup` creates it through Prisma.

The admin dashboard has an **AI Feedback** section protected by the existing administrator session.
