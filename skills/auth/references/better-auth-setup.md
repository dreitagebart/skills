# better-auth setup with Next.js, Prisma, and PostgreSQL

Sources: better-auth documentation and current Next.js guides (as of November 2026). Compare with the current documentation before use, especially for plugins and CLI options.

## Contents

1. Installation
2. `src/lib/auth.ts`
3. `src/lib/auth-client.ts`
4. Route handler
5. Session in Server Components
6. `src/proxy.ts`
7. Client login calls

## 1. Installation

```bash
bun add better-auth
```

Run the auth CLI without installing it using `bunx @better-auth/cli@latest ...`.

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

The secret and URL come from `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`. better-auth reads both from the environment, but validate them in `src/env.ts` as well.

## 3. `src/lib/auth-client.ts`

```ts
import { createAuthClient } from 'better-auth/react'

export const { useSession, signIn, updateUser } = createAuthClient()
```

If the client and server use the same domain, `baseURL` is not needed. For separate domains, set `createAuthClient({ baseURL: ... })`.

## 4. `src/app/api/auth/[...all]/route.ts`

```ts
import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '~/lib/auth'

export const { GET, POST } = toNextJsHandler(auth)
```

## 5. Session in Server Components

```tsx
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '~/lib/auth'

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return redirect('/login')
  }

  return <div>Hello {session.user.name}</div>
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

Do not access the database here: this file runs for every matching request, including prefetches. Check authorization in procedures and Server Components.

Depending on the Next.js 16 version, the file may require a named or default export. Check the Next.js documentation.

## 7. Client login calls

```ts
import { signIn, signUp, signOut } from '~/lib/auth-client'

await signIn.email({ email, password })
await signUp.email({ email, password, name })
await signOut()
```

`useSession()` provides the session as a hook in Client Components.
