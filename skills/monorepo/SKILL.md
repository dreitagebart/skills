---
name: monorepo
description: Turborepo-Monorepos mit Bun-Workspaces und festem Namensschema - Root heißt @<projekt>/root, Apps und Packages heißen @<projekt>/<ordnername> (zum Beispiel @opencore/web, @opencore/auth). Verwenden beim Anlegen oder Erweitern eines Monorepos, bei neuen Apps oder Packages, turbo.json, Workspaces, geteiltem Code, internen Abhängigkeiten und der Frage, wohin Code gehört.
---

# Monorepo mit Turborepo

Jedes Projekt, das aus mehr als einer App oder einem geteilten Package besteht, ist ein Turborepo mit Bun-Workspaces. Auch ein einzelnes Web-Projekt startet als Monorepo (`apps/web`), damit später Packages dazukommen können, ohne umzubauen.

## Struktur und Namensschema

```
<projekt>/
├── package.json         # name: "@<projekt>/root"
├── turbo.json
├── biome.json
├── tsconfig.base.json
├── apps/
│   └── web/             # name: "@<projekt>/web"
└── packages/
    └── auth/            # name: "@<projekt>/auth"
```

- `<projekt>` ist der Projektname in kebab-case und Kleinbuchstaben. Ist er unbekannt, wird er erfragt.
- **Root:** `@<projekt>/root`, mit `"private": true`.
- **Apps und Packages:** `@<projekt>/<ordnername>`. Der Ordner `apps/web` heißt `@<projekt>/web`, der Ordner `packages/auth` heißt `@<projekt>/auth`. Ordnername und Paketname-Suffix sind immer identisch.
- Der Scope ist nur ein interner Namensraum. Nichts wird veröffentlicht, deshalb bleibt überall `"private": true`.

## Workspaces und interne Abhängigkeiten

- Das Root deklariert `"workspaces": ["apps/*", "packages/*"]`.
- Interne Abhängigkeiten stehen als `"@<projekt>/auth": "workspace:*"` in der `package.json` des Verbrauchers.
- Interne Packages exportieren ihren TypeScript-Quellcode direkt (`"exports": { ".": "./src/index.ts" }`), ohne eigenen Build-Schritt. Next.js-Apps nehmen sie dafür in `transpilePackages` in `next.config.ts` auf.
- Der Alias `~` gilt pro App und pro Package für das eigene `src/` (Skill `file-conventions`). Ein Package importiert nie per `~` aus einem anderen Package, sondern über den Paketnamen.

## Was gehört in ein Package

Ein Package entsteht, wenn Code von mehr als einer App gebraucht wird oder klar abgrenzbar ist. Typische Fälle: `@<projekt>/db` (Prisma, Skill `database`), `@<projekt>/auth` (better-auth, Skill `auth`), `@<projekt>/schemas` (geteilte Zod-Schemas), `@<projekt>/ui` (geteilte Mantine-Komponenten). Apps enthalten nur das, was zu genau dieser App gehört.

## `turbo.json`

Turborepo 2 nutzt `tasks`. Vorlage im Skill `new-project`: `new-project/assets/root/turbo.json`.

- `build` hängt von `^build` ab und nennt die Ausgaben (`.next/**` ohne `.next/cache/**`).
- `dev` ist `persistent` und nicht gecacht.
- **Umgebungsvariablen müssen deklariert werden.** Turborepo reicht im Strict-Modus nur Variablen an Tasks durch, die in `turbo.json` unter `env` oder `globalEnv` stehen. Fehlt `DATABASE_URL` dort, schlägt der Build mit einer scheinbar fehlenden Variable fehl, obwohl sie gesetzt ist.

## Befehle

```bash
bun install
bun run dev                              # alle Apps
bunx turbo run build --filter=@<projekt>/web
bun add <paket> --cwd apps/web           # Abhängigkeit für eine App
```

Neue App oder neues Package: Ordner unter `apps/` bzw. `packages/` anlegen, `package.json` mit dem Namensschema schreiben, `bun install` im Root ausführen.
