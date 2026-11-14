---
name: stack
description: Verbindlicher Techstack von dreitagebart - Bun, TypeScript, Next.js, Mantine, tRPC, TanStack Query/Table, Prisma 7, PostgreSQL, better-auth, Zod, Biome, Turborepo - samt Verboten (Tailwind, Python, MySQL/SQLite, Node.js/npm). Immer verwenden, wenn ein Projekt, Feature oder Package angelegt, eine Bibliothek gewählt oder ersetzt, eine Abhängigkeit installiert oder gefragt wird, womit etwas gebaut werden soll - auch wenn der Stack nicht ausdrücklich erwähnt wird.
---

# Techstack

Dieser Stack ist die Voreinstellung für alle Projekte. Er sorgt dafür, dass Code über Projekte hinweg gleich aussieht und sich gleich verhält. Verlangt der Nutzer ausdrücklich etwas anderes, folgt der Agent dem Nutzer und weist in einem Satz auf die Abweichung hin. Fehlt eine Entscheidung für einen Bereich, wird nachgefragt statt geraten.

## Vorgaben

| Bereich | Standard | Nicht verwenden |
|---|---|---|
| Runtime, Paketmanager | Bun (`bun install`, `bun run`, `bunx`) | Node.js-Scripts, npm, pnpm, yarn |
| Sprache | TypeScript (strict) | reines JavaScript / `.mjs`, Python |
| Framework | Next.js (App Router) | Pages Router (außer Altprojekt) |
| UI-Bibliothek | Mantine (`@mantine/*`) | Tailwind, andere UI-Kits |
| Styling | Mantine-Style-Props und CSS Modules (`*.module.css`) mit `postcss-preset-mantine` | Tailwind, CSS-in-JS zur Laufzeit |
| API | tRPC v11 mit `@trpc/tanstack-react-query` | eigene REST-Routen für Datenzugriff |
| Server State | TanStack Query (react-query) | SWR, Redux für Server-Daten |
| Tabellen | TanStack Table (react-table), headless | andere Tabellen-Libraries ohne Rückfrage |
| Formulare | `@mantine/form` mit Zod | react-hook-form, Formik |
| Validierung | Zod (auch für Env-Variablen) | Yup, Joi |
| Datenbank | PostgreSQL | MySQL, SQLite |
| ORM | Prisma ORM 7 | Drizzle, TypeORM (ohne Rückfrage) |
| Auth | better-auth | NextAuth/Auth.js, Clerk (ohne Rückfrage) |
| Lint und Format | Biome | ESLint, Prettier |
| Tests | `bun test` | Jest, Vitest (ohne Rückfrage) |
| Monorepo | Turborepo mit Bun-Workspaces | Nx, Lerna |
| Container | `Containerfile`, `compose.yml` | `Dockerfile`, `docker-compose.yml` |
| Kompilierte Sprache | Go (nur wenn wirklich kompiliert werden muss) | Rust, C++, Java ohne Rückfrage |

## Regeln für den Umgang mit dem Stack

- **Verbote kommen mit Alternative.** Wer "kein Tailwind" liest, nutzt Mantine-Props und CSS Modules, statt zu raten. Die Alternative steht in der Spalte "Standard".
- **Offene Entscheidung Tabellen:** Wie TanStack Table dargestellt wird (eigene Mantine-`Table` oder `mantine-react-table`), ist noch nicht festgelegt. Beim ersten Tabellen-Feature nachfragen.
- **Prisma 7:** Vorerst bleibt die Major-Version 7 gesetzt. Prisma 7 unterscheidet sich stark von Version 6 und früher, deshalb vor jedem Prisma-Code den Skill `database` lesen.
- **Fehlende Bibliothek:** Erst prüfen, ob das Mantine-Ökosystem (`@mantine/dates`, `@mantine/notifications`, `@mantine/charts` und so weiter) oder der bestehende Stack das Problem löst. Wenn nicht, dem Nutzer eine Bibliothek vorschlagen, statt sie still zu installieren.
- **Paketversionen:** Nicht aus dem Gedächtnis pinnen. Mit `bun add` installieren, damit die aktuelle Version in die `package.json` kommt.

## Wo die Details stehen

- Dateien, Ordner, Imports: Skill `file-conventions`
- React-Komponenten, Mantine: Skill `react-components`, `forms`
- Daten laden, tRPC, SSR: Skill `data-fetching`
- Datenbank: Skill `database`; Authentifizierung: Skill `auth`
- Runtime, Sprachen: Skill `runtime-and-languages`
- Code-Regeln, Fehler, Tests: Skills `code-style`, `error-handling`, `lint-and-test`
- Container, Monorepo, neues Projekt: Skills `containers`, `monorepo`, `new-project`
