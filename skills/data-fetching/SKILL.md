---
name: data-fetching
description: Datenzugriff mit tRPC v11, TanStack Query, SSR-Prefetch und HydrationBoundary im Next.js App Router. Verwenden beim Laden von Daten, bei API-Endpunkten, tRPC-Routern und Procedures, Server-Komponenten mit Daten, Query- und Mutation-Hooks, Caching, Hydration, Suspense und Ladezuständen - auch wenn nur "eine Liste anzeigen" oder "Daten holen" verlangt wird.
---

# Datenzugriff mit tRPC, SSR und Hydration

Daten werden nach Möglichkeit auf dem Server geladen. Die Server-Komponente startet den Query (Prefetch), `HydrationBoundary` übergibt den Cache an den Browser, und die Client-Komponente liest ihn mit dem Query-Hook. So erscheint die Seite mit Daten, ohne dass der Browser erst einen Request auslösen muss.

Die vollständigen Setup-Dateien stehen in `references/trpc-setup.md`. Dort lesen, wenn tRPC in einem Projekt eingerichtet wird oder Dateien unter `src/trpc/` fehlen oder abweichen.

## Muster pro Seite

```tsx
// src/app/posts/page.tsx (Server-Komponente)
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { HydrateClient, prefetch, trpc } from '~/lib/trpc/server'
import { PostList } from '~/components/posts'

const Page = () => {
  prefetch(trpc.post.list.queryOptions())

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Fehler beim Laden</div>}>
        <Suspense fallback={<div>Lädt ...</div>}>
          <PostList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}

export default Page
```

```tsx
// src/views/posts-view.tsx (Client-Komponente)
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useTRPC } from '~/lib/trpc/client'

export const PostList = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.post.list.queryOptions())

  return <ul>{data.map((post) => <li key={post.id}>{post.title}</li>)}</ul>
}
```

## Regeln

1. **`prefetch` ohne `await` plus `useSuspenseQuery`** ist der Standard. Der Server streamt das Ergebnis nach, sobald es da ist. Wer stattdessen `useQuery` nutzt, muss auf dem Server `await getQueryClient().prefetchQuery(...)` ausführen, sonst droht ein Hydration-Mismatch.
2. **Gleicher Input auf Server und Client.** Der Input gehört zum Query-Key. Wer beim Prefetch einen anderen Input nutzt als der Hook, bekommt Cache-Misses und einen zweiten Request.
3. **`prefetch` steht vor `HydrateClient`.** `HydrateClient` serialisiert den Cache beim Rendern. Eine verschachtelte Server-Komponente, die selbst prefetcht, braucht ihr eigenes `HydrateClient`.
4. **Ein `QueryClient` pro Request** auf dem Server (`getQueryClient` mit React `cache`), nie ein globaler.
5. **`caller` nur, wenn die Daten ausschließlich auf dem Server gebraucht werden.** Ergebnisse von `caller` landen nicht im Query-Cache und erreichen keine Client-Komponente. Für beides `queryClient.fetchQuery` verwenden.
6. **`~/lib/trpc/server` nie in Client-Komponenten importieren.** Die Datei trägt `import 'server-only'`, ein Fehlimport scheitert beim Build, genau so soll es sein.
7. Der Route-Handler exportiert `GET` und `POST`, sonst antworten Queries mit 405.

## Router und Procedures

- Router liegen in `src/lib/trpc/routers/<thema>.ts` und werden in `src/lib/trpc/routers/app-router.ts` zusammengeführt.
- Eingaben werden mit Zod aus `~/schemas/` validiert (`.input(createPostSchema)`), damit Formulare dasselbe Schema nutzen (Skill `forms`).
- Geschützte Procedures nutzen `protectedProcedure` (Session aus better-auth, Skill `auth`).
- Fehler werden als `TRPCError` mit passendem Code geworfen (Skill `error-handling`).
- Prisma-Zugriffe laufen über `ctx.db`, nicht über direkte Imports in Procedures.

## Abgleich mit der Doku

Die Dateien in `references/trpc-setup.md` entsprechen der tRPC-Dokumentation für den Next.js App Router (Stand November 2026). Weicht die installierte tRPC-Version ab, gilt die aktuelle Doku unter `trpc.io/docs/client/nextjs/app-router-setup`, und der Nutzer wird auf die Abweichung hingewiesen.
