---
name: lint-and-test
description: Linting, Formatierung und Tests - immer Biome (Lint, Format, Import-Sortierung) und bun test, nie ESLint, Prettier, Jest oder Vitest. Verwenden beim Einrichten oder Ausführen von Lint und Format, bei biome.json, beim Schreiben und Ausführen von Tests (bun:test), bei CI-Prüfschritten und immer vor dem Abschluss einer Änderung, um Lint, Typecheck und Tests laufen zu lassen.
---

# Lint, Format und Tests

## Biome

Biome ersetzt ESLint und Prettier. Es lintet, formatiert und sortiert Imports.

- Die Konfiguration steht in `biome.json` im Root des Repos. Als `$schema` dient die Datei aus `node_modules`, damit sie zur installierten Version passt: `"$schema": "./node_modules/@biomejs/biome/configuration_schema.json"`.
- Installation mit exakter Version: `bun add -D -E @biomejs/biome`.
- **Die Regeln liefert der Nutzer.** Bis sie vorliegen, gilt die Basis aus `references/biome.json`. Die Basis enthält nur die empfohlenen Regeln und Stil-Einstellungen: einfache Anführungszeichen und keine Semikolons (aus den bekannten Beispielen) sowie zwei Leerzeichen Einrückung (vorläufige Annahme). Keine eigenen Regelmeinungen ergänzen, solange der Nutzer keine geliefert hat.
- Im Monorepo gibt es eine `biome.json` im Root. Packages und Apps brauchen nur dann eine eigene, wenn sie abweichen, und erben dann mit `"extends": "//"`.

Befehle (als Skripte in der `package.json`):

```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write ."
  }
}
```

Biome-Warnungen werden nicht mit `biome-ignore` weggedrückt, ohne dass der Kommentar eine Begründung nennt.

## Tests: `bun test`

- Tests laufen mit `bun test` und importieren aus `bun:test` (`import { describe, expect, it } from 'bun:test'`).
- Testdateien liegen neben dem Code und heißen `<name>.test.ts` bzw. `<name>.test.tsx`, passend zur kebab-case-Regel (`post-schema.test.ts`).
- Getestet werden zuerst Logik, Zod-Schemas, tRPC-Router (über `createCaller`) und Hilfsfunktionen.
- **Komponententests brauchen eine DOM-Umgebung** (zum Beispiel happy-dom mit Testing Library und einem Preload in `bunfig.toml`). Dieses Setup ist noch nicht festgelegt. Bis dahin keine Komponententests erfinden, sondern beim Bedarf nachfragen.

## Vor dem Abschluss

Bevor eine Änderung als fertig gilt, laufen nacheinander:

```bash
bun run lint
bun run typecheck
bun test
```

Fehlt ein Skript, wird es in der `package.json` ergänzt (`"typecheck": "tsc --noEmit"`). Schlägt ein Schritt fehl, wird die Ursache behoben und nicht das Skript angepasst, bis es durchläuft.
