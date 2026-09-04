# My Portfolio

A full-stack portfolio application built with Next.js, React, TypeScript, Tailwind CSS, Prisma, SQLite, Auth.js/NextAuth credentials authentication, and an AI portfolio assistant.

## Included

- Responsive, data-driven portfolio landing page
- Premium Hero section with AI-first positioning and direct chatbot CTA
- Product-style project showcase with browser previews and truthful deployment states
- Dynamic project case-study pages at `/projects/[slug]`
- AI assistant showcase section integrated with the portfolio chatbot
- Light/dark theme toggle
- Profile, projects, skills, and experience data loaded from Prisma
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

2. Create `.env` from `.env.example`. Never commit `.env`.

3. Set at least:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-long-random-secret"
ADMIN_EMAIL="admin@portfolio.dev"
ADMIN_PASSWORD="change-this-password"
OPENROUTER_API_KEY="your-openrouter-key"
OPENROUTER_MODEL="openrouter/free"
ADMIN_EMAIL="admin@portfolio.dev"
ADMIN_PASSWORD="change-this-password"
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

For production, use a managed database rather than the checked-in development SQLite file. Keep `AUTH_SECRET`, admin credentials, and AI provider keys in your host's secret manager. Run migrations during deployment and never ship a real `.env` file.

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

## Production Docker

The repository includes `Dockerfile`, `docker-compose.yml`, and `DEPLOYMENT.md` for a persistent SQLite deployment. The container stores the production database under `/app/data` and exposes `/api/health` for health checks.

Because SQLite requires persistent storage, do not deploy this version to a serverless filesystem without first migrating Prisma to PostgreSQL.
