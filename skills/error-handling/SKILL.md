---
name: error-handling
description: Fehlerbehandlung und Logging - Fehler an Systemgrenzen behandeln, TRPCError mit passenden Codes, Error Boundaries und error.tsx im Client, sichtbares Mutation-Feedback, strukturierter Logger statt console.log, keine Secrets in Logs. Verwenden bei try/catch, Fehlermeldungen, tRPC-Fehlern, Error Boundaries, Logging, Debug-Ausgaben und immer dann, wenn Code Fehler werfen, fangen oder anzeigen soll.
---

# Fehlerbehandlung und Logging

## Grundsatz

Fehler werden dort behandelt, wo jemand etwas damit anfangen kann: an Systemgrenzen wie tRPC-Procedures, Route-Handlern, Jobs und UI-Rändern. Innerhalb dieser Grenzen werfen Funktionen Fehler weiter, statt sie überall zu fangen. Ein gefangener Fehler, der weder behandelt noch weitergegeben wird, ist ein Fehler.

## Fehler im Code

- `catch (error: unknown)`: Fehler sind `unknown` und werden vor der Nutzung geprüft (`error instanceof Error`).
- Wird ein Fehler umverpackt, bleibt die Ursache erhalten: `throw new Error('Could not load post', { cause: error })`.
- Kein leerer `catch`-Block. Wenn ein Fehler bewusst ignoriert wird, steht ein Kommentar mit dem Grund dabei.
- Erwartete Fehlerfälle (Eintrag nicht gefunden, fehlende Berechtigung) sind keine Ausnahmen im Sinne von Abstürzen, sondern werden als passender Fehlercode an den Aufrufer gegeben.

## tRPC

Procedures werfen `TRPCError` mit dem passenden Code:

| Situation | Code |
|---|---|
| Eintrag existiert nicht | `NOT_FOUND` |
| Nicht eingeloggt | `UNAUTHORIZED` |
| Eingeloggt, aber nicht berechtigt | `FORBIDDEN` |
| Eingabe fachlich ungültig | `BAD_REQUEST` (Zod-Fehler erzeugt tRPC selbst) |
| Unerwarteter Fehler | `INTERNAL_SERVER_ERROR` |

Die `message` ist für Nutzer lesbar und enthält keine internen Details (keine SQL-Fehler, keine Pfade). Details gehören ins Log.

## Client

- Suspense-Queries werden von einer Error Boundary umschlossen (`react-error-boundary` oder `error.tsx` der Route), siehe Skill `data-fetching`.
- Fehler einer Mutation werden dem Nutzer angezeigt, zum Beispiel über `@mantine/notifications`. Sie werden nie still verschluckt.
- Formularfehler gehören an das jeweilige Feld (Skill `forms`).

## Logging

- Kein `console.log` im committeten Code. Es gibt ein Modul `src/lib/logger.ts` mit den Stufen `debug`, `info`, `warn`, `error`. Kontext kommt als Objekt mit, nicht in den Text geklebt.
- In Produktion wird JSON pro Zeile geschrieben, in der Entwicklung lesbarer Text. Die Stufe steuert `LOG_LEVEL` aus `src/env.ts`.
- Passwörter, Tokens, Session-IDs, Secrets und personenbezogene Daten stehen nie im Log.

```ts
import { env } from '~/env'

type Level = 'debug' | 'info' | 'warn' | 'error'

const order: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 }

const write = (level: Level, message: string, context: Record<string, unknown> = {}) => {
  if (order[level] < order[env.LOG_LEVEL]) return

  const isProduction = env.NODE_ENV === 'production'
  const entry = { level, message, time: new Date().toISOString(), ...context }
  const args = isProduction ? [JSON.stringify(entry)] : [`[${level}] ${message}`, context]
  const log = level === 'error' ? console.error : console.log

  log(...args)
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => write('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => write('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => write('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => write('error', message, context),
}
```

`LOG_LEVEL` wird in `src/env.ts` als `z.enum(['debug', 'info', 'warn', 'error']).default('info')` geführt. Die Datei ist die einzige Stelle, an der `console` direkt vorkommen darf; Biome bekommt dafür bei Bedarf eine Ausnahme per `biome-ignore`.
