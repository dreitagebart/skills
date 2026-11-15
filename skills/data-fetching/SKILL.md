---
name: data-fetching
description: Data fetching with tRPC v11, TanStack Query, SSR prefetch, and HydrationBoundary in the Next.js App Router. Use when loading data, creating API endpoints, tRPC routers or procedures, building data-driven Server Components, using query or mutation hooks, or handling caching, hydration, Suspense, and loading states, including requests to "show a list" or "fetch data".
---

# Data fetching with tRPC, SSR, and hydration

Load data on the server where possible. The Server Component starts the query (prefetch), `HydrationBoundary` passes the cache to the browser, and the Client Component reads it with a query hook. The page can then render with data without waiting for the browser to make a request.

The complete setup files are in `references/trpc-setup.md`. Read them when setting up tRPC or when files under `src/trpc/` are missing or differ.

## Page pattern

```tsx
// src/app/posts/page.tsx (Server Component)
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { HydrateClient, prefetch, trpc } from '~/lib/trpc/server'
import { PostList } from '~/components/posts'

const Page = () => {
  prefetch(trpc.post.list.queryOptions())

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Error loading posts</div>}>
        <Suspense fallback={<div>Loading ...</div>}>
          <PostList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}

export default Page
```

```tsx
// src/views/posts-view.tsx (Client Component)
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useTRPC } from '~/lib/trpc/client'

export const PostList = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.post.list.queryOptions())

  return <ul>{data.map((post) => <li key={post.id}>{post.title}</li>)}</ul>
}
```

## Rules

1. **Use `prefetch` without `await` with `useSuspenseQuery` by default.** The server streams the result when it is ready. If using `useQuery` instead, run `await getQueryClient().prefetchQuery(...)` on the server to avoid a hydration mismatch.
2. **Use the same input on server and client.** The input is part of the query key. A different prefetch input and hook input causes a cache miss and a second request.
3. **Call `prefetch` before `HydrateClient`.** `HydrateClient` serializes the cache during rendering. A nested Server Component that prefetches needs its own `HydrateClient`.
4. **Use one `QueryClient` per server request** (`getQueryClient` with React `cache`), never a global instance.
5. **Use `caller` only for data needed exclusively on the server.** Its results are not stored in the query cache and cannot reach Client Components. Use `queryClient.fetchQuery` when both server and client need the data.
6. **Never import `~/lib/trpc/server` into Client Components.** It includes `import 'server-only'`; an accidental import should fail during build.
7. The route handler must export `GET` and `POST`; otherwise queries receive a 405 response.

## Routers and procedures

- Put routers in `src/lib/trpc/routers/<topic>.ts` and combine them in `src/lib/trpc/routers/app-router.ts`.
- Validate inputs with Zod schemas from `~/schemas/` (`.input(createPostSchema)`) so forms can share the schema (see `forms`).
- Use `protectedProcedure` for protected procedures (session from better-auth; see `auth`).
- Throw `TRPCError` with an appropriate code (see `error-handling`).
- Access Prisma through `ctx.db`, not direct imports in procedures.

## Documentation check

The files in `references/trpc-setup.md` match the tRPC documentation for the Next.js App Router (as of November 2026). If the installed tRPC version differs, follow the current documentation at `trpc.io/docs/client/nextjs/app-router-setup` and tell the user about the deviation.
