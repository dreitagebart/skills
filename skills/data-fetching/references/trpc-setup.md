# tRPC-Setup für Next.js App Router

Quelle: tRPC-Dokumentation "Set up with Next.js App Router" (Stand November 2026), angepasst an die Konventionen: `~`-Alias, kebab-case-Dateinamen, Prisma-Client und better-auth-Session im Kontext. Vor dem Einsatz mit der aktuellen Doku abgleichen.

## Inhalt

1. Installation
2. Dateistruktur
3. `trpc/init.ts`
4. `trpc/routers/app-router.ts`
5. Route-Handler
6. `trpc/query-client.ts`
7. `trpc/client.tsx`
8. `trpc/server.tsx`
9. Provider einhängen
10. Optional: superjson

## 1. Installation

```bash
bun add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod client-only server-only react-error-boundary
```

`react-error-boundary` wird für das Suspense-Muster aus dem Skill gebraucht.

## 2. Dateistruktur

```
src/
├── app/
│   └── api/trpc/[trpc]/route.ts
├── schemas                          # Zod-Schema
└── lib/
    └── trpc/
        ├── init.ts                  # Kontext, Basis-Procedures
        ├── query-client.ts          # QueryClient-Factory
        ├── client.tsx               # Provider und useTRPC für Client-Komponenten
        ├── server.tsx               # prefetch, HydrateClient, caller für Server-Komponenten
        └── routers/
            ├── app-router.ts
            └── post.ts
```

## 3. `src/lib/trpc/init.ts`

```ts
import { initTRPC, TRPCError } from '@trpc/server'
import { auth } from '~/lib/auth'
import { prisma } from '~/lib/prisma'

// Accepts headers so it works in the RSC caller and in the route handler.
// Without better-auth: drop the session lookup and return `{ db: prisma }` only.
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({ headers: opts.headers })
  return { db: prisma, session }
}

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
  // transformer: superjson, // see section 10
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure

export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({ ctx: { ...ctx, session: ctx.session } })
})
```

## 4. `src/lib/trpc/routers/app-router.ts`

```ts
import { createPostSchema } from '~/schemas/post'
import { baseProcedure, createTRPCRouter, protectedProcedure } from '~/lib/trpc/init'

export const appRouter = createTRPCRouter({
  post: createTRPCRouter({
    list: baseProcedure.query(({ ctx }) => ctx.db.post.findMany({ orderBy: { createdAt: 'desc' } })),
    create: protectedProcedure
      .input(createPostSchema)
      .mutation(({ ctx, input }) => ctx.db.post.create({ data: input })),
  }),
})

export type AppRouter = typeof appRouter
```

Wächst ein Thema, wandert es in eine eigene Datei `routers/post.ts` und wird im `app-router.ts` eingehängt.

## 5. `src/app/api/trpc/[trpc]/route.ts`

```ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createTRPCContext } from '~/lib/trpc/init'
import { appRouter } from '~/lib/trpc/routers/app-router'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
  })

export { handler as GET, handler as POST }
```

## 6. `src/lib/trpc/query-client.ts`

```ts
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

export const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR a staleTime above 0 avoids an immediate refetch on the client.
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // Include pending queries so a server component can start the prefetch
        // and a client component further down consumes the promise.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        // Next.js detects dynamic rendering via the error digest, so errors must not be redacted here.
        shouldRedactErrors: () => false,
      },
    },
  })
}
```

## 7. `src/lib/trpc/client.tsx`

```tsx
'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import { makeQueryClient } from './query-client'
import type { AppRouter } from './routers/app-router'

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

let browserQueryClient: QueryClient | undefined

const getQueryClient = () => {
  // Server: always a fresh client. Browser: one client, reused if React suspends during the first render.
  if (typeof window === 'undefined') {
    return makeQueryClient()
  }

  browserQueryClient ??= makeQueryClient()

  return browserQueryClient
}

const getUrl = () => {
  const base = typeof window !== 'undefined' ? '' : (process.env.APP_URL ?? 'http://localhost:3000')

  return `${base}/api/trpc`
}

type Props = {
  children: ReactNode
}

export const TRPCReactProvider = ({ children }: Props) => {
  // Do not use useState for the QueryClient when no Suspense boundary sits below it.
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // transformer: superjson, // see section 10
          url: getUrl(),
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
```

`APP_URL` ersetzt `VERCEL_URL` aus der Doku, weil das Deployment selbst gehostet wird. Die Variable muss in `src/env.ts` stehen, falls sie benutzt wird.

## 8. `src/lib/trpc/server.tsx`

```tsx
import 'server-only'

import type { ReactNode } from 'react'
import { cache } from 'react'
import { headers } from 'next/headers'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { TRPCQueryOptions } from '@trpc/tanstack-react-query'
import { createTRPCContext } from './init'
import { makeQueryClient } from './query-client'
import { appRouter } from './routers/app-router'

// One query client per request.
export const getQueryClient = cache(makeQueryClient)

const createContext = async () => createTRPCContext({ headers: await headers() })

export const trpc = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
})

type HydrateClientProps = {
  children: ReactNode
}

export const HydrateClient = ({ children }: HydrateClientProps) => {
  const queryClient = getQueryClient()
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
}

export const prefetch = <T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) => {
  const queryClient = getQueryClient()
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any)
  } else {
    void queryClient.prefetchQuery(queryOptions)
  }
}

// Only for data needed on the server alone. Results are not stored in the query cache.
export const caller = appRouter.createCaller(createContext)
```

Die `any`-Typen stammen aus der tRPC-Doku, weil `TRPCQueryOptions` generisch über alle Procedures arbeitet. Falls die Biome-Regel `noExplicitAny` greift, die Stelle mit einem `biome-ignore`-Kommentar und kurzer Begründung markieren.

## 9. Provider einhängen

In `src/app/layout.tsx` (siehe Skill `react-components`) den `TRPCReactProvider` innerhalb des `MantineProvider` setzen:

```tsx
<MantineProvider>
  <TRPCReactProvider>{children}</TRPCReactProvider>
</MantineProvider>
```

## 10. Optional: superjson

Nötig, wenn Procedures `Date`, `Map`, `Set` oder `BigInt` übertragen. Dann `bun add superjson` und an drei Stellen aktivieren: `transformer: superjson` in `initTRPC...create`, `transformer: superjson` im `httpBatchLink`, sowie `serializeData: superjson.serialize` (dehydrate) und `deserializeData: superjson.deserialize` (hydrate) in `query-client.ts`.
