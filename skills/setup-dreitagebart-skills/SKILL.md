---
name: setup-dreitagebart-skills
description: Einmalige Einrichtung pro Projekt - schreibt einen kompakten Kernregeln-Block der dreitagebart-Konventionen in die AGENTS.md (oder CLAUDE.md) des Projekts, damit die immer gültigen Regeln auch ohne Skill-Auslösung greifen. Nur verwenden, wenn der Nutzer setup-dreitagebart-skills aufruft oder darum bittet, die dreitagebart-Konventionen im Projekt zu verankern, einzurichten oder zu aktualisieren.
---

# dreitagebart-Konventionen im Projekt verankern

Skills werden nur geladen, wenn ihre Beschreibung zur Aufgabe passt. Regeln, die bei jeder Aufgabe gelten sollen (Dateinamen, Sprache, Runtime), stehen deshalb zusätzlich als kurzer Block in der `AGENTS.md` des Projekts. Der Block verweist für Details auf die Skills.

## Ablauf

1. **Zieldatei bestimmen.**
   - Existiert nur `CLAUDE.md`, wird dort eingetragen.
   - Existiert `AGENTS.md`, wird dort eingetragen. Gibt es zusätzlich eine `CLAUDE.md`, steht dort `@AGENTS.md` als Import, falls das noch nicht der Fall ist.
   - Existiert keine von beiden, wird `AGENTS.md` angelegt.
2. **Vorhandenen Block suchen.** Beginnt in der Zieldatei bereits ein Abschnitt `## dreitagebart-Konventionen`, wird er an Ort und Stelle ersetzt, nicht dupliziert. Sonst wird der Block am Ende angefügt. Anderen Inhalt der Datei nicht verändern.
3. **Block schreiben** (unten).
4. **Installierte Skills prüfen.** Fehlen die Skills im Projekt oder global, den Installationsbefehl nennen:
   `npx skills add https://codeberg.org/dreitagebart/skills --all`
5. Dem Nutzer in zwei Sätzen sagen, welche Datei geändert wurde.

## Der Block

```markdown
## dreitagebart-Konventionen

Details stehen in den Skills `stack`, `file-conventions`, `react-components`, `data-fetching`, `database`, `auth`, `code-style`.

- Runtime und Paketmanager: Bun. Kein Node.js, npm, pnpm oder yarn. Kein Python. Skripte sind TypeScript, kompilierte Programme Go.
- Stack: Next.js (App Router), Mantine (kein Tailwind), tRPC, TanStack Query, Prisma 7, PostgreSQL, better-auth, Zod, Biome, `bun test`, Turborepo.
- Dateien und Ordner: klein mit Bindestrich (kebab-case). Import-Alias `~` zeigt auf `src/`.
- Komponenten: `export const Name = ({ children }: Props) => ...`, Props-Typ `type Props`, exportiert als `NameProps`. Pro Gruppenordner unter `src/components/` eine `index.ts` mit `export *`.
- Daten: möglichst auf dem Server laden (Prefetch) und mit `HydrationBoundary` übergeben.
- Alle Bezeichner und Code-Kommentare sind englisch.
- Vor Abschluss einer Änderung: `bun run lint`, `bun run typecheck`, `bun test`.
```

## Pflege

Der Block ist eine Zusammenfassung. Ändert sich eine Konvention in den Skills, wird dieser Skill erneut ausgeführt, damit Block und Skills übereinstimmen.
