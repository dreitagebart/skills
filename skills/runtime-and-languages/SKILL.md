---
name: runtime-and-languages
description: Laufzeit- und Sprachwahl von dreitagebart - Bun statt Node.js, TypeScript statt reinem JavaScript/.mjs, kein Python, Go für kompilierte Programme. Verwenden beim Schreiben von Scripts, CLI-Tools, Automatisierung, Build- und Hilfsskripten, Einmal-Aufgaben, Paketinstallation oder bei jeder Entscheidung über Sprache und Runtime - auch bei winzigen Skripten, bei denen Python oder ein Shell-Skript naheliegt.
---

# Runtime und Sprachen

## Runtime: Bun

- Pakete werden mit `bun install` und `bun add` installiert, Skripte laufen mit `bun run`, Einmalaufrufe mit `bunx`. Die Lockdatei `bun.lock` wird committet. `package-lock.json`, `pnpm-lock.yaml` und `yarn.lock` entstehen nicht.
- Tests laufen mit `bun test` (Skill `lint-and-test`).
- In der Root-`package.json` steht `"packageManager": "bun@<Version>"` mit der installierten Version (`bun --version`).

## Sprache: TypeScript

- Skripte, Tools und Konfiguration sind TypeScript (`.ts`), nicht `.js` oder `.mjs`. Bun führt `.ts` direkt aus: `bun scripts/seed.ts`.
- Ausführbare Skripte beginnen mit `#!/usr/bin/env bun`.
- Wo ein Werkzeug eine Konfigurationsdatei in JavaScript verlangt (zum Beispiel `postcss.config.cjs`), ist das die Ausnahme. Nur dann, wenn das Tool keine TypeScript-Variante kennt.
- Für kleine Automatisierung kein Shell-Skript, wenn die Logik mehr als ein paar Zeilen braucht. TypeScript mit Bun ist die Regel (`Bun.$` für Shell-Aufrufe).

## Kein Python

Python wird nicht verwendet: kein Python-Skript, kein `pip`, keine virtuelle Umgebung. Für Skripte gilt TypeScript mit Bun, für kompilierte Programme Go. Verlangt ein Drittwerkzeug zwingend Python, wird das dem Nutzer gemeldet und nach einer Alternative gefragt, statt Python stillschweigend zu installieren.

## Kompilierte Sprache: Go

Nur wenn wirklich ein kompiliertes Programm nötig ist (statische Binary, geringer Ressourcenverbrauch, Systemnähe), wird Go genutzt. Für alles andere reicht TypeScript mit Bun. Container-Builds für Go stehen im Skill `containers`.

## Bei Unsicherheit

Ist unklar, ob etwas ein TypeScript-Skript oder ein Go-Programm werden soll, wird TypeScript gewählt und die Alternative in einem Satz erwähnt.
