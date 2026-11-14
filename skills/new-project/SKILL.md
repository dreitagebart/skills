---
name: new-project
description: Scaffold eines neuen Projekts nach dreitagebart-Konventionen - Turborepo mit Bun, Next.js, Mantine, tRPC, Prisma 7, better-auth, Biome. Verwenden, wenn ein neues Projekt, eine neue App, ein neues Repo, Boilerplate oder ein Grundgerüst angelegt werden soll, bei Wörtern wie "neues Projekt", "init", "scaffold", "starte ein Projekt" oder "lege eine App an", auch wenn der Stack nicht genannt wird.
---

# Neues Projekt anlegen

Dieser Skill legt ein Projekt so an, dass alle anderen Skills ohne Nacharbeit greifen. Er arbeitet mit Vorlagen aus `assets/`, in denen `__PROJECT__` und `__BUN_VERSION__` zu ersetzen sind. Ablauf und Reihenfolge sind fest, damit Projekte gleich aufgebaut sind.

**Voraussetzung:** Dieser Skill verweist auf Dateien anderer Skills dieses Repos (zum Beispiel `data-fetching/references/trpc-setup.md`). Sind die anderen Skills nicht installiert, fehlen diese Dateien. Dann zuerst `npx skills add https://codeberg.org/dreitagebart/skills --all` ausführen.

## 0. Klären

Eine kurze Frage genügt, falls etwas fehlt:

- **Projektname** (kebab-case, wird zum Scope `@<projekt>`).
- **Module:** Braucht das Projekt Datenbank (Prisma) und Auth (better-auth)? Ohne Angabe werden beide eingerichtet, weil sie zum Standard-Stack gehören.

Alles Weitere folgt dem Stack. Nicht nach Dingen fragen, die der Skill `stack` bereits festlegt.

## 1. Root anlegen

Aus `assets/root/` ins Projekt kopieren: `package.json`, `turbo.json`, `tsconfig.base.json`, `.gitignore`. Danach ersetzen:

- `__PROJECT__` durch den Projektnamen,
- `__BUN_VERSION__` durch die Ausgabe von `bun --version`.

Biome aus dem Skill `lint-and-test` einrichten: `bun add -D -E @biomejs/biome turbo typescript`, danach `lint-and-test/references/biome.json` als `biome.json` ins Root kopieren. Die Namensregeln für das Monorepo stehen im Skill `monorepo`.

## 2. Web-App anlegen

```bash
bunx create-next-app@latest apps/web --ts --app --src-dir --no-tailwind --import-alias "~/*" --use-bun
```

Die Flags vorher mit `bunx create-next-app@latest --help` abgleichen, sie können sich ändern. Wichtig sind: TypeScript, App Router, `src/`-Ordner, **kein Tailwind**, Import-Alias `~/*`, Bun als Paketmanager. Werden Linter-Optionen angeboten, wird keine gewählt (Biome liegt im Root).

Danach in `apps/web/`:

1. `package.json`: `name` auf `@<projekt>/web` setzen, `"private": true` sicherstellen, Skripte `typecheck` (`tsc --noEmit`) ergänzen.
2. `tsconfig.json` an `assets/web/tsconfig.json` angleichen (erbt von `../../tsconfig.base.json`, enthält den `~`-Alias). Die von `create-next-app` erzeugte Konfiguration ersetzen.
3. `src/env.ts` aus `assets/web/src/env.ts` übernehmen und auf die tatsächlich genutzten Variablen kürzen. `assets/web/.env.example` als `.env.example` kopieren.
4. Ordner nach Skill `file-conventions` anlegen (`src/components/`, `src/schemas/`, `src/lib/`).
5. Von `create-next-app` erzeugte Beispieldateien und Standard-CSS entfernen, die nicht zur Struktur passen.

## 3. Bibliotheken einrichten

In dieser Reihenfolge, jeweils nach dem genannten Skill:

1. **Mantine:** Skill `react-components`, Abschnitt "Mantine-Setup im App Router" (Pakete, `postcss.config.ts`, Root-Layout).
2. **Datenbank:** Skill `database` und `database/references/prisma-setup.md` (nur wenn Datenbank gewünscht).
3. **Auth:** Skill `auth` und `auth/references/better-auth-setup.md` (nur wenn Auth gewünscht, setzt die Datenbank voraus).
4. **tRPC:** Skill `data-fetching` und `data-fetching/references/trpc-setup.md`. Die Vorlage nutzt `ctx.db` und die Session; ohne Datenbank oder Auth die entsprechenden Zeilen entfernen.
5. **Formulare und Validierung:** Skill `forms` (Zod und Mantine Form), sobald das erste Formular entsteht.

Pakete immer mit `bun add` installieren, damit aktuelle Versionen in der `package.json` stehen (Skill `stack`).

## 4. Container (nur auf Wunsch)

Wenn das Projekt containerisiert werden soll, den Skill `containers` anwenden. Die Vorlagen dort sind ungetestet, also nach dem Kopieren bauen und anpassen.

## 5. Prüfen und abschließen

```bash
bun install
bun run lint
bun run typecheck
bun run build
```

Alle Schritte müssen grün sein. Scheitert `build` an fehlenden Umgebungsvariablen, eine `.env` aus `.env.example` anlegen. Danach `git init`, ersten Commit erstellen und den Skill `setup-dreitagebart-skills` ausführen, damit die Kernregeln in der `AGENTS.md` stehen.
