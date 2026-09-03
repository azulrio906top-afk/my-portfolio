# My Portfolio

A full-stack portfolio application built with Next.js, React, TypeScript, Tailwind CSS, Prisma, SQLite, Auth.js/NextAuth credentials authentication, and an AI portfolio assistant.

## Included

- Responsive portfolio landing page
- Light/dark theme toggle
- Projects and skills loaded from Prisma
- Project search/display in the admin area
- Admin authentication
- Skills CRUD
- Projects CRUD
- Profile management
- Experience management
- AI portfolio chatbot
- SQLite + Prisma schema and seed data
- REST-style API route for chat
- Docker-ready project structure

## Requirements

- Node.js 20+
- npm 10+

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`.

3. Set at least:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-long-random-secret"
ADMIN_EMAIL="admin@portfolio.dev"
ADMIN_PASSWORD="change-this-password"
OPENROUTER_API_KEY="your-openrouter-key"
OPENROUTER_MODEL="openrouter/free"
```

The existing project also accepts `OPENAI_API_KEY` as a fallback for the AI key.

4. Create the database and generate the Prisma client:

```bash
npm run db:generate
npm run db:push
```

5. Seed the portfolio:

```bash
npm run db:seed
```

Or use the combined command:

```bash
npm run db:setup
```

6. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Admin

Open `/admin/login`.

The credentials come from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.

## Production

Never commit `.env` or API keys. Configure secrets through your hosting provider. Before deployment, replace the development admin password and `AUTH_SECRET`.

For a hosted production database, update the Prisma datasource and deployment configuration appropriately.

## Useful commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:generate
npm run db:push
npm run db:seed
npm run db:setup
npm run db:studio
```
