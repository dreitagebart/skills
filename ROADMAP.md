# Roadmap und Stand

## Offen: von dir zu liefern

| Thema | Wo es hinkommt |
|---|---|
| Biome-Regeln | `skills/lint-and-test/references/biome.json` ersetzen (aktuell nur Basis) |
| Compose-Templates | `skills/containers/assets/` (aktuell ein Platzhalter `compose.yml`) |
| Git-Workflow | `drafts/git-workflow/SKILL.md` füllen, dann nach `skills/` verschieben |
| Tabellen-Darstellung | Entscheidung in `skills/stack/SKILL.md`: eigene Mantine-`Table` oder `mantine-react-table` |
| Datenbank-Namensschema | Entscheidung in `skills/database/SKILL.md`: `@@map`/`@map` auf snake_case oder nicht |
| Komponententests | DOM-Umgebung (zum Beispiel happy-dom) in `skills/lint-and-test/SKILL.md` festlegen |

## Zu prüfen: Vorschläge von Claude, nicht von dir

Diese Punkte stehen in den Skills, stammen aber nicht aus deinen Vorgaben. Bitte durchsehen und streichen oder bestätigen.

- **Skill `error-handling`** komplett: Grundsatz "an Grenzen behandeln", TRPCError-Codes, Logger-Modul mit Stufen und JSON in Produktion.
- Testdateien liegen neben dem Code und heißen `<name>.test.ts(x)`.
- Ordner `src/schemas/` für Zod-Schemas, die Formulare und tRPC teilen.
- Prisma-Output unter `src/generated/prisma` (Import `~/generated/prisma/client`), damit der `~`-Alias greift.
- Monorepo: Prisma in eigenem Package `@<projekt>/db`, weitere Package-Beispiele (`auth`, `schemas`, `ui`), interne Packages exportieren TypeScript-Quellen und stehen in `transpilePackages`.
- `container_name` nach dem Muster `<projekt>-<dienst>`.
- `runtime-and-languages`: kein Shell-Skript bei mehr als ein paar Zeilen Logik, stattdessen TypeScript mit `Bun.$`.
- Biome-Basis: zwei Leerzeichen Einrückung.
- `tsconfig.base.json` mit `noUncheckedIndexedAccess: true` (strenger als `strict`).
- Root-Layout-Vorlage mit `lang="de"`, tRPC-Vorlage mit `react-error-boundary` als Abhängigkeit.
- Skill-Namen ohne Präfix. Bei einer öffentlichen Veröffentlichung ein Präfix (`dtb-`) erwägen, um Kollisionen mit Skills anderer Repos zu vermeiden.

## Verifikationsstand (14. November 2026)

**Ausgeführt und bestanden:**
- `bun run validate` prüft alle 15 Skills (Frontmatter, Namen, Größen, Dateiverweise). Ein Negativtest mit absichtlich eingebauten Fehlern wurde erkannt.
- Die echte `skills`-CLI entdeckt alle 15 Skills und nicht den Entwurf in `drafts/`. Eine Test-Installation einzelner Skills kopiert `references/` und `assets/` mit.
- Das Logger-Beispiel (Entwicklung, Produktion, Stufen) und die Vorlagen `env.ts` und das Zod-Schema aus dem Skill `forms` laufen unter Bun mit Zod 4.

**Gegen aktuelle Dokumentation abgeglichen, aber nicht ausgeführt:**
- Prisma 7 (Config, Generator, Driver-Adapter), tRPC v11 mit App Router, better-auth mit Prisma-Adapter, Mantine mit Next.js, `mantine-form-zod-resolver` für Zod 4, Biome 2.

**Ungetestet:**
- `Containerfile.bun-next` und `compose.yml`.
- Der Ablauf von `new-project` (Flags von `create-next-app`, Turborepo-Konfiguration) an einem echten Projekt.
- Alle Next.js-Codebeispiele in den Skills: Es wurde kein Next.js-Projekt gebaut.

Beim ersten echten Einsatz Abweichungen notieren und den betroffenen Skill sofort korrigieren.

## Nächste Schritte

1. Repo auf Codeberg anlegen und pushen (siehe README).
2. In einem frischen Testprojekt `new-project` durchspielen und die Abweichungen in die Skills einarbeiten.
3. Biome-Regeln, Compose-Templates und Git-Workflow nachliefern.
4. Entscheiden, ob zusätzlich ein GitHub-Mirror oder ein npm-Paket sinnvoll ist.
