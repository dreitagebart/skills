# Prisma 7 setup with PostgreSQL and Bun

Sources: Prisma documentation "Quickstart PostgreSQL" and "Upgrade to v7" (as of November 2026). Compare with the current documentation before use if the installed version differs.

## Contents

1. Installation
2. `prisma/schema.prisma`
3. `prisma.config.ts`
4. `src/lib/prisma.ts`
5. Scripts in `package.json`
6. `.gitignore` and Biome
7. Seed

## 1. Installation

```bash
bun add @prisma/client@7 @prisma/adapter-pg pg dotenv
bun add -D prisma@prev
bunx --bun prisma init --datasource-provider postgresql --output ../src/generated/prisma
```

`prisma init` creates `prisma/schema.prisma`, `prisma.config.ts`, and an `.env` file. Then adjust the files to match the templates below.

## 2. `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Do not put a `url` in the `datasource` block. The connection comes from `prisma.config.ts`.

## 3. `prisma.config.ts`

```ts
import { defineConfig, env } from 'prisma/config'

// Bun loads .env when the CLI runs as `bunx --bun prisma ...`.
// Without --bun, add `import 'dotenv/config'` at the top of this file.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'bun prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

## 4. `src/lib/prisma.ts`

```ts
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '~/generated/prisma/client'
import { env } from '~/env'

const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

// Reuse one client across hot reloads in development.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Do not add `import 'server-only'` to this file, so seed and other Bun scripts can use it too. Enforce the server boundary in `~/lib/trpc/server` and the procedures.

## 5. Skripte in `package.json`

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "db:generate": "bunx --bun prisma generate",
    "db:migrate": "bunx --bun prisma migrate dev",
    "db:deploy": "bunx --bun prisma migrate deploy",
    "db:push": "bunx --bun prisma db push",
    "db:studio": "bunx --bun prisma studio",
    "db:format": "bunx --bun prisma format"
  }
}
```

Bun runs `postinstall` in the project itself. If installing without `prisma` in `devDependencies` (a production install), move this step to the build.

## 6. `.gitignore` and Biome

```
# .gitignore
/src/generated
```

The generated folder is listed in `.gitignore` and is therefore also skipped by Biome when `vcs.useIgnoreFile` is enabled (see `lint-and-test`).

## 7. Seed

```ts
// prisma/seed.ts
import { prisma } from '~/lib/prisma'

await prisma.post.create({
  data: { title: 'Hello', content: 'First post' },
})

await prisma.$disconnect()
```

Run with `bunx --bun prisma db seed`. The `~` alias must be configured in `tsconfig.json` so Bun can resolve the import.
