---
name: database
description: Prisma ORM 7 mit PostgreSQL - prisma.config.ts, Generator prisma-client mit Pflicht-Output, Driver-Adapter PrismaPg, Client-Singleton, Migrationen mit Bun. Verwenden bei Datenbankschema, Prisma, Migrationen, Seeds, Queries, Modellen und ORM-Fragen - und immer, bevor Prisma-Code aus dem Gedächtnis geschrieben wird, weil sich Prisma 7 grundlegend von Version 6 und älter unterscheidet.
---

# Datenbank: Prisma 7 und PostgreSQL

Datenbank ist immer PostgreSQL, ORM ist Prisma ORM in Version 7. Prisma 7 hat Setup und Client gegenüber Version 6 und älter umgebaut. Code, der Prisma-6-Wissen voraussetzt, funktioniert nicht. Die vollständigen Dateien stehen in `references/prisma-setup.md`.

## Was sich in Prisma 7 geändert hat

1. **Verbindung in `prisma.config.ts`.** Die URL für die CLI steht in der Konfigurationsdatei (`datasource: { url: env('DATABASE_URL') }`), nicht mehr als `url = env(...)` im `datasource`-Block der Schema-Datei.
2. **Neuer Generator `prisma-client` mit Pflicht-Output.** `provider = "prisma-client"` und ein explizites `output`. Der Client wird aus diesem Ordner importiert, nicht aus `@prisma/client`.
3. **Driver-Adapter sind Pflicht.** Für PostgreSQL `@prisma/adapter-pg` und `pg`, der Adapter wird an `new PrismaClient({ adapter })` übergeben.
4. **`.env` wird nicht automatisch geladen.** Bun lädt `.env` selbst, wenn die CLI als `bunx --bun prisma ...` läuft. Ohne `--bun` muss `prisma.config.ts` `import 'dotenv/config'` enthalten.
5. **`migrate dev` führt `generate` nicht mehr aus.** Nach jeder Schema-Änderung `bunx --bun prisma generate` ausführen, und im Build und bei der Installation ebenfalls.

## Festlegungen für unsere Projekte

- Generator-Output: `../src/generated/prisma` (relativ zu `prisma/schema.prisma`). Dadurch funktioniert der Import `~/generated/prisma/client` mit dem Alias. Der Ordner steht in `.gitignore` und wird nie committet.
- Der Client wird einmal in `src/lib/prisma.ts` erzeugt (Singleton über `globalThis`, damit Hot Reload keine Verbindungen anhäuft) und von dort importiert.
- Die Datenbank-URL kommt über `src/env.ts` (Zod-validiert), nicht direkt aus `process.env`.
- Prisma-Code läuft nur auf dem Server. Nie in einer Client-Komponente importieren.
- In einem Monorepo liegt Prisma in einem eigenen Package (zum Beispiel `@<projekt>/db`), das Apps als Workspace-Abhängigkeit nutzen. Siehe Skill `monorepo`.
- Modelle sind englisch, im Singular und PascalCase (`Post`), Felder in camelCase.
- **Offen:** Ob Tabellen- und Spaltennamen in der Datenbank per `@@map`/`@map` auf snake_case gelegt werden, ist nicht entschieden. Beim ersten Schema nachfragen.

## Befehle & `package.json`-Skripte

Beim Einrichten eines Projekts (bzw. des `@<projekt>/db`-Packages im Monorepo) werden immer folgende `db:*`-Skripte in die `package.json` eingetragen (jeweils mit `bunx --bun`, damit `.env` ohne `dotenv` geladen wird):

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

Im Arbeitsalltag werden diese Skripte genutzt (`bun run db:generate`, `bun run db:migrate -- --name init`, `bun run db:push`, `bun run db:studio`, `bun run db:format`).

Fragt `migrate dev` nach einem Reset der Datenbank, wird abgebrochen und der Nutzer gefragt. Ein Reset löscht Daten.

## Zusammenspiel mit anderen Skills

- Auth-Tabellen (User, Session, Account) erzeugt die better-auth-CLI, siehe Skill `auth`. Das Ergebnis danach auf Prisma-7-Konformität prüfen, also Generator- und Datasource-Block.
- Zugriff aus Procedures läuft über `ctx.db` (Skill `data-fetching`).
- Im Container wird `prisma generate` in der Build-Stage ausgeführt (Skill `containers`).
