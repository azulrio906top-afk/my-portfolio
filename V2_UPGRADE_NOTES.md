# Frunco Portfolio v2

## Included
- Project case-study fields: category, challenge, solution, architecture, role, impact.
- Existing admin Project editor extended with those fields.
- Existing project case-study route now renders the new fields when present.
- Homepage receives the expanded project data.
- Homepage CMS model and `/admin/content` editor/API are included.
- `.env` removed and `.env.example` sanitized.

## Database
After installing dependencies, apply the schema to your Neon database with:

```bash
npx prisma db push --schema prisma/schema.prisma
npx prisma generate --schema prisma/schema.prisma
```

Do not paste real environment secrets into source control.
