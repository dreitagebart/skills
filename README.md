# skills

Coding-Richtlinien von dreitagebart als Agent Skills. Ein Skill ist ein Ordner mit einer `SKILL.md`, die ein Coding-Agent bei passender Aufgabe lädt. Dieses Repo legt Stack, Dateikonventionen, Komponentenmuster, Datenzugriff, Datenbank, Auth, Container und den Projektstart fest, damit Agenten in jedem Projekt gleich arbeiten.

Status: Version 0.1.0. Offene Punkte und Prüfstand stehen in [ROADMAP.md](ROADMAP.md).

## Installation

Alles installieren, global für alle Projekte:

```bash
npx skills add https://codeberg.org/dreitagebart/skills --all -g
```

Einzelne Skills, nur im aktuellen Projekt:

```bash
npx skills add https://codeberg.org/dreitagebart/skills --skill file-conventions --skill react-components
```

Erst ansehen, was enthalten ist:

```bash
npx skills add https://codeberg.org/dreitagebart/skills --list
```

Aktualisieren mit `npx skills update`.

> `new-project` verweist auf Dateien anderer Skills dieses Repos und funktioniert nur vollständig, wenn alle Skills installiert sind. Im Zweifel `--all` verwenden.

Danach im Projekt einmal den Skill `setup-dreitagebart-skills` aufrufen. Er schreibt einen kurzen Kernregeln-Block in die `AGENTS.md`, damit die immer gültigen Regeln auch dann greifen, wenn ein Skill nicht automatisch geladen wird.

## Skills

| Skill | Inhalt |
|---|---|
| `stack` | Techstack mit Verboten und Alternativen |
| `file-conventions` | kebab-case, `src/`-Struktur, `index.ts`-Barrels, `~`-Alias |
| `react-components` | Komponentenmuster, Props-Typen, Mantine-Setup, Styling |
| `forms` | Mantine Form mit Zod, Schemas geteilt mit tRPC |
| `data-fetching` | tRPC v11, SSR-Prefetch, `HydrationBoundary` |
| `database` | Prisma 7 mit PostgreSQL |
| `auth` | better-auth mit Prisma-Adapter und Next.js |
| `runtime-and-languages` | Bun, TypeScript, kein Python, Go |
| `code-style` | Englisch im Code, Named Exports, Zod an Grenzen, Env-Validierung |
| `lint-and-test` | Biome und `bun test` |
| `error-handling` | Fehlerbehandlung und Logging |
| `containers` | `Containerfile`, `compose.yml`, Basisimages |
| `monorepo` | Turborepo, Namensschema `@<projekt>/...` |
| `new-project` | Scaffold nach den Konventionen |
| `setup-dreitagebart-skills` | Kernregeln in die `AGENTS.md` eintragen |

Empfehlungen für Skills anderer Autoren (zum Beispiel `grill-with-docs`, `archify`): [docs/recommended-skills.md](docs/recommended-skills.md).

## Aufbau

```
skills/
├── skills/<name>/SKILL.md       # ein Skill, bei Bedarf mit references/ und assets/
├── drafts/                      # Entwürfe, werden nicht installiert
├── docs/                        # Dokumentation für Menschen
├── scripts/validate-skills.ts   # Prüfskript
├── AGENTS.md                    # Regeln fürs Schreiben von Skills in diesem Repo
└── ROADMAP.md
```

Der Fließtext ist Deutsch. Fachbegriffe, Bezeichner, Code und Code-Kommentare sind Englisch.

## Entwickeln

Das Repo hat keine Abhängigkeiten. Voraussetzung ist Bun.

```bash
bun run validate
```

Das Skript prüft Frontmatter, Namen, Längenlimits und Dateiverweise. Regeln für neue Skills stehen in [AGENTS.md](AGENTS.md).

## Lizenz

MIT, siehe [LICENSE](LICENSE).
