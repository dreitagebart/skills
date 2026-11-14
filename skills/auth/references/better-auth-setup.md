# better-auth Setup mit Next.js, Prisma und PostgreSQL

Quellen: better-auth-Dokumentation und aktuelle Next.js-Anleitungen (Stand November 2026). Vor dem Einsatz mit der aktuellen Doku abgleichen, besonders bei Plugins und CLI-Optionen.

## Inhalt

1. Installation
2. `src/lib/auth.ts`
3. `src/lib/auth-client.ts`
4. Route-Handler
5. Session in Server-Komponenten
6. `src/proxy.ts`
7. Login-Aufrufe im Client

## 1. Installation

```bash
bun add better-auth
```

Die Auth-CLI wird ohne Installation per `bunx @better-auth/cli@latest ...` aufgerufen.

## 2. `src/lib/auth.ts`

```ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { prisma } from '~/lib/prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  plugins: [
    // Must stay the last plugin.
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
```

Secret und URL kommen aus `BETTER_AUTH_SECRET` und `BETTER_AUTH_URL`. better-auth liest beide aus der Umgebung, sie werden trotzdem in `src/env.ts` validiert.

## 3. `src/lib/auth-client.ts`

```ts
import { createAuthClient } from 'better-auth/react'

export const { useSession, signIn, updateUser } = createAuthClient()
```

Laufen Client und Server unter derselben Domain, ist keine `baseURL` nötig. Für getrennte Domains `createAuthClient({ baseURL: ... })` setzen.

## 4. `src/app/api/auth/[...all]/route.ts`

```ts
import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '~/lib/auth'

export const { GET, POST } = toNextJsHandler(auth)
```

## 5. Session in Server-Komponenten

```tsx
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '~/lib/auth'

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return redirect('/login')
  }

  return <div>Hallo {session.user.name}</div>
}

export default Page
```

## 6. `src/proxy.ts`

```ts
import { type NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

// Next.js 16: proxy.ts / proxy(). Next.js 15 and older: middleware.ts / middleware().
export const proxy = (request: NextRequest) => {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

Hier keine Datenbankzugriffe: Die Datei läuft bei jedem passenden Request, auch bei Prefetches. Berechtigungen werden in Procedures und Server-Komponenten geprüft.

Bei Next.js 16 verlangt die Datei möglicherweise einen benannten oder Default-Export je nach Version. Das gegen die Next.js-Doku prüfen.

## 7. Login-Aufrufe im Client

```ts
import { signIn, signUp, signOut } from '~/lib/auth-client'

await signIn.email({ email, password })
await signUp.email({ email, password, name })
await signOut()
```

`useSession()` liefert die Session als Hook in Client-Komponenten.
