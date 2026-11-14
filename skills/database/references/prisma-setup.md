# Prisma 7 Setup mit PostgreSQL und Bun

Quellen: Prisma-Dokumentation "Quickstart PostgreSQL" und "Upgrade to v7" (Stand November 2026). Vor dem Einsatz mit der aktuellen Doku abgleichen, falls die installierte Version abweicht.

## Inhalt

1. Installation
2. `prisma/schema.prisma`
3. `prisma.config.ts`
4. `src/lib/prisma.ts`
5. Skripte in `package.json`
6. `.gitignore` und Biome
7. Seed

## 1. Installation

```bash
bun add @prisma/client@7 @prisma/adapter-pg pg dotenv
bun add -D prisma@prev
bunx --bun prisma init --datasource-provider postgresql --output ../src/generated/prisma
```

`prisma init` legt `prisma/schema.prisma`, `prisma.config.ts` und eine `.env` an. Danach die Dateien an die folgenden Vorlagen angleichen.

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

Im `datasource`-Block steht keine `url`. Die Verbindung kommt aus `prisma.config.ts`.

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

Kein `import 'server-only'` in dieser Datei, damit auch Seed- und andere Bun-Skripte sie nutzen können. Die Server-Grenze sichern `~/lib/trpc/server` und die Procedures.

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

Bun führt `postinstall` im eigenen Projekt aus. Läuft die Installation ohne `prisma` in `devDependencies` (Produktions-Install), den Schritt in den Build verlegen.

## 6. `.gitignore` und Biome

```
# .gitignore
/src/generated
```

Der generierte Ordner liegt in `.gitignore` und wird dadurch auch von Biome übersprungen, sofern `vcs.useIgnoreFile` aktiv ist (siehe Skill `lint-and-test`).

## 7. Seed

```ts
// prisma/seed.ts
import { prisma } from '~/lib/prisma'

await prisma.post.create({
  data: { title: 'Hello', content: 'First post' },
})

await prisma.$disconnect()
```

Aufruf über `bunx --bun prisma db seed`. Der `~`-Alias muss in der `tsconfig.json` stehen, damit Bun den Import auflöst.
