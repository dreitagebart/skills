---
name: code-style
description: Allgemeine Code-Regeln von dreitagebart - alle Bezeichner und Kommentare zwingend auf Englisch, Named Exports statt Default-Exports, TypeScript strict, Validierung mit Zod an Systemgrenzen, zentrale Env-Validierung in src/env.ts. Verwenden beim Schreiben, Reviewen und Refactoren von jedem Code, beim Benennen von Variablen, Funktionen, Typen und Modellen, beim Kommentieren und beim Zugriff auf Umgebungsvariablen.
---

# Code-Regeln

## Sprache im Code: Englisch, zwingend

- **Alle Bezeichner sind englisch:** Variablen, Funktionen, Typen, Klassen, Dateien, Ordner, Datenbankmodelle, Felder, tRPC-Procedures, Branch-Namen.
- **Alle Code-Kommentare sind englisch.**
- Das gilt auch dann, wenn der Nutzer auf Deutsch schreibt oder ein Fachbegriff deutsch ist. Für fachliche Begriffe ohne gute englische Entsprechung (zum Beispiel ein Begriff aus einer Domäne) einen englischen Begriff wählen und bei Bedarf einmal mit dem deutschen Begriff kommentieren.
- Nicht betroffen: UI-Texte und Fehlermeldungen für Nutzer (Sprache des Produkts) sowie Dokumentation. Für die Sprache von Projekt-Dokumentation an vorhandener Doku orientieren oder nachfragen.

Kommentare erklären das Warum, nicht das Was. Ein Kommentar, der den Code nur wiederholt, wird weggelassen.

## Exporte

- Named Exports sind der Standard (`export const BasicButton = ...`).
- `export default` nur dort, wo das Framework es verlangt: Next.js-Spezialdateien wie `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx` und `not-found.tsx` sowie Konfigurationsdateien. `route.ts` nutzt benannte Exports (`GET`, `POST`).

## TypeScript

- `strict: true` in jeder `tsconfig.json`.
- `any` wird vermieden. Unbekannte Daten sind `unknown` und werden mit Zod geparst. Muss ein `any` bleiben (zum Beispiel wegen einer Bibliothekstyp-Grenze), steht ein `biome-ignore` mit Begründung davor.
- Typen aus Zod-Schemas ableiten (`z.infer`), nicht doppelt von Hand schreiben.

## Validierung an Systemgrenzen

Alles, was von außen kommt, wird mit Zod geprüft, bevor der Code damit arbeitet: tRPC-Inputs, Formulare, Webhooks, externe APIs, Umgebungsvariablen. Innerhalb des Systems vertrauen sich Funktionen über Typen und prüfen nicht doppelt.

## Umgebungsvariablen

- Zugriff nur über `src/env.ts`, das alle Variablen mit Zod validiert und als `env` exportiert (Vorlage im Skill `new-project`: `new-project/assets/web/src/env.ts`). Kein verstreutes `process.env.X` im Code.
- Die Datei schlägt beim Start fehl, wenn eine Variable fehlt oder falsch aussieht. Das ist gewollt: Ein Fehler beim Start ist besser als ein Fehler zur Laufzeit.
- Variablen für den Browser tragen den Präfix `NEXT_PUBLIC_` und werden getrennt von den Server-Variablen geführt.
- `.env` wird nie committet. Eine `.env.example` mit allen Namen und Dummywerte oder ohne Werte wird committet.
