---
name: database
description: Prisma ORM 7 with PostgreSQL - prisma.config.ts, prisma-client
  generator with required output, PrismaPg driver adapter, client singleton, and
  migrations with Bun. Use for database schemas, Prisma, migrations, seeds,
  queries, models, and ORM questions; always read before writing Prisma code
  from memory because Prisma 7 differs fundamentally from version 6 and earlier.
---
# Database: Prisma 7 and PostgreSQL

Always use PostgreSQL as the database and Prisma ORM version 7 as the ORM. Prisma 7 changed setup and the client compared with version 6 and earlier. Code based on Prisma 6 knowledge will not work. See the complete files in `references/prisma-setup.md`.

## Changes in Prisma 7

1. **Connection in `prisma.config.ts`.** The CLI URL belongs in the config, no longer in the schema's `datasource` block. Read it as `process.env.DATABASE_URL ?? ''` so `prisma generate` and dependency installation work before `.env` exists; database commands still require a valid URL.
2. **New `prisma-client` generator with required output.** Set `provider = "prisma-client"` and an explicit `output`. Import the client from that folder, not from `@prisma/client`.
3. **Driver adapters are required.** For PostgreSQL, install `@prisma/adapter-pg` and `pg`, then pass the adapter to `new PrismaClient({ adapter })`.
4. **`.env` is not loaded automatically.** Bun loads `.env` when the CLI runs as `bunx --bun prisma ...`. Without `--bun`, `prisma.config.ts` must include `import 'dotenv/config'`.
5. **`migrate dev` no longer runs `generate`.** After every schema change, run `bunx --bun prisma generate`; also run it during builds and installation.

## Project conventions

- Generator output: `../src/generated/prisma` (relative to `prisma/schema.prisma`). This makes `~/generated/prisma/client` work with the alias. Add the folder to `.gitignore`; never commit it.
- Create the client once in `src/lib/prisma.ts` (a singleton using `globalThis` prevents hot reload from accumulating connections) and import it from there.
- Read the database URL through `src/env.ts` (validated with Zod), never directly from `process.env`.
- Prisma code runs only on the server. Never import it into a client component.
- In a monorepo, put Prisma in its own package (for example `@<project>/db`) and use it from apps as a workspace dependency. See `monorepo`.
- Model names are English, singular, and PascalCase (`Post`); fields use camelCase.
- **Open decision:** It has not been decided whether database table and column names should map to snake_case with `@@map`/`@map`. Ask when creating the first schema.

## Commands and `package.json` scripts

When setting up a project (or the `@<project>/db` package in a monorepo), always add these `db:*` scripts to `package.json`. Use `bunx --bun` so `.env` loads without `dotenv`:

```json
{
  "scripts": {
    "db:generate": "bunx --bun prisma generate",
    "db:migrate": "bunx --bun prisma migrate dev",
    "db:deploy": "bunx --bun prisma migrate deploy",
    "db:push": "bunx --bun prisma db push",
    "db:studio": "bunx --bun prisma studio",
    "db:format": "bunx --bun prisma format"
  }
}
```

Use these scripts in daily work (`bun run db:generate`, `bun run db:migrate -- --name init`, `bun run db:push`, `bun run db:studio`, `bun run db:format`).

If `migrate dev` asks to reset the database, cancel and ask the user. A reset deletes data.

## Working with other skills

- The better-auth CLI creates auth tables (User, Session, Account); see `auth`. Then check the result for Prisma 7 compatibility, including generator and datasource blocks.
- Access Prisma from procedures through `ctx.db` (see `data-fetching`).
- Run `prisma generate` in the container build stage (see `containers`).
