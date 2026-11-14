---
name: auth
description: Authentifizierung mit better-auth - Prisma-Adapter für PostgreSQL, Next.js-Route-Handler, nextCookies, Session in Server-Komponenten und im tRPC-Kontext, geschützte Routen und Procedures. Verwenden bei Login, Registrierung, Sessions, Rollen, OAuth, Passwort-Reset, geschützten Seiten oder Procedures und Auth-Tabellen - auch wenn nur "ein Login" oder "nur für eingeloggte Nutzer" verlangt wird.
---

# Authentifizierung mit better-auth

Auth läuft über better-auth mit dem Prisma-Adapter auf PostgreSQL. Kein NextAuth/Auth.js, kein Clerk, solange der Nutzer nichts anderes verlangt. Die Dateien mit Code stehen in `references/better-auth-setup.md`.

## Bausteine

| Datei | Zweck |
|---|---|
| `src/lib/auth.ts` | Server-Instanz `betterAuth({...})` mit Prisma-Adapter |
| `src/lib/auth-client.ts` | Client-Instanz `createAuthClient()` aus `better-auth/react` |
| `src/app/api/auth/[...all]/route.ts` | Route-Handler über `toNextJsHandler(auth)` |
| `src/proxy.ts` | optionale Schnellprüfung des Session-Cookies für geschützte Pfade |

## Regeln

- **`nextCookies()` ist das letzte Plugin** im `plugins`-Array. Es erlaubt Server-Aufrufen über `auth.api`, Cookies zu setzen.
- **Session auf dem Server** über `auth.api.getSession({ headers: await headers() })`. Im tRPC-Kontext wird sie einmal gelesen und als `ctx.session` bereitgestellt (Skill `data-fetching`). Geschützte Procedures nutzen `protectedProcedure`.
- **Die Prüfung in `proxy.ts` ist nur eine Komfortschranke.** Dort wird nur geprüft, ob ein Session-Cookie existiert, ohne Datenbankzugriff. Die eigentliche Berechtigung wird in Procedures und Server-Komponenten geprüft, weil ein Cookie allein nichts beweist.
- **Umgebungsvariablen** `BETTER_AUTH_SECRET` (mindestens 32 Zeichen) und `BETTER_AUTH_URL` stehen in `src/env.ts` und werden mit Zod validiert. Eine falsche `BETTER_AUTH_URL` zwischen Umgebungen ist eine häufige Fehlerquelle.
- **Passwörter, Tokens und Secrets** erscheinen nie in Logs oder im Code.
- Formulare für Login und Registrierung nutzen `@mantine/form` mit Zod (Skill `forms`) und rufen `authClient.signIn.email` bzw. `authClient.signUp.email` auf.

## Schema und Migration

Die Auth-Tabellen kommen aus der better-auth-CLI und werden nicht von Hand geschrieben:

```bash
bunx @better-auth/cli@latest generate --output prisma/schema.prisma
bunx --bun prisma migrate dev --name add-auth
```

Nach `generate` die Schema-Datei prüfen. Der `generator`-Block muss `prisma-client` mit `output` bleiben, und im `datasource`-Block darf keine `url` stehen (Prisma 7, Skill `database`). Nach jedem neuen better-auth-Plugin `generate` und die Migration erneut ausführen.

## Hinweis zu Next.js-Versionen

In Next.js 16 heißt die Datei `proxy.ts` und die Funktion `proxy`. In Next.js 15 und älter heißt sie `middleware.ts` und `middleware`. Die installierte Version prüfen.
