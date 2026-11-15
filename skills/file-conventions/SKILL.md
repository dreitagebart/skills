---
name: file-conventions
description: dreitagebart file and folder conventions - lowercase kebab-case as in Next.js, a src structure with group folders under components, index.ts barrels with export *, and a ~ import alias for src. Use when creating, renaming, or moving files and folders, working with imports, tsconfig paths, barrel files (index.ts), CSS Modules, or types.ts, including small changes, to keep naming consistent.
---

# File and folder conventions

## Benennung

Use lowercase for all file and folder names and separate words with hyphens (kebab-case), as in Next.js: `basic-button.tsx`, `user-settings/`, `app-router.ts`.

- Do not use uppercase letters or underscores in custom names.
- Code names are unaffected: `basic-button.tsx` exports `BasicButton`.
- Exceptions are conventional filenames and framework requirements: `Containerfile`, `README.md`, `LICENSE`, `AGENTS.md`, `CLAUDE.md`, `SKILL.md`, and Next.js special files (`page.tsx`, `layout.tsx`, `route.ts`, `[id]`, `(group)`).

## Structure under `src/`

```
src/
├── app/                         # Next.js App Router
├── styles/                      # app-wide fonts, Mantine theme, and global CSS
│   ├── fonts.ts
│   ├── globals.css
│   └── theme.ts
├── components/
│   ├── buttons/                 # group (topic)
│   │   ├── basic-button.tsx
│   │   ├── basic-button.module.css
│   │   ├── types.ts             # optional, topic-specific
│   │   └── index.ts             # export * from './basic-button'
│   └── forms/
│       ├── login-form.tsx
│       └── index.ts
├── views/
│   ├── dashboard-view.tsx       # dashboard view for /app/dashboard/page.tsx
|   └── posts-view.tsx           # posts view for /app/posts/page.tsx
├── schemas/                     # Zod schemas shared by forms and tRPC
├── lib/
│   ├── trpc/
|   └── prisma.ts                # prisma client
|   └── auth.ts                  # better auth instance
|   └── auth-client.ts           # better auth client
└── env.ts
```

- Put one folder per group (topic) under `src/components/`, such as `buttons`, `forms`, or `layout`. Each group contains component files (for example `basic-button.tsx`) and an `index.ts` at the group root.
- Put app-wide font definitions, the Mantine theme, and global CSS in `src/styles/`. Keep `globals.css` there rather than in `src/app/`; import it from the root layout.
- A group may also contain files such as `*.module.css` or a topic-specific `types.ts`.
- Put page-specific main views (`<page>-view.tsx`) under `src/views/`. Each view assembles a complete route and includes components from `src/components/`.
- Keep files under `src/app/` (`page.tsx`) lean: they handle routing, params, metadata, and initial server-side data fetching, then render the appropriate view.
- If a view grows or needs subcomponents, styles (`*.module.css`), or helper files used only by that page, give it a dedicated subfolder under `src/views/<page>/`.


## Next.js `page.tsx` and `layout.tsx`

Always define pages and layouts as `async` arrow-function constants (`Page` or `Layout`) and export them at the end with `export default`.

- **`page.tsx`:** Render only its corresponding view component from `~/views/...` (optionally with fetched data or resolved route params).
- **`layout.tsx`:** Type props with `type Props` (at least `children: React.ReactNode`) and wrap `children` with the appropriate layout component.

```tsx
// src/app/dashboard/page.tsx
import { DashboardView } from '~/views/dashboard-view'

const Page = async () => {
  return <DashboardView />
}

export default Page
```

```tsx
// src/app/posts/[id]/page.tsx
import { PostDetailView } from '~/views/post-detail-view'

type Props = {
  params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
  const { id } = await params

  return <PostDetailView id={id} />
}

export default Page
```

```tsx
// src/app/layout.tsx
import type { ReactNode } from 'react'
import { AppLayout } from '~/components/layouts'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return <AppLayout>{children}</AppLayout>
}

export default Layout
```


## Barrel files (`index.ts`)

The `index.ts` in a group contains only `export *` lines, one per public file, without file extensions and sorted alphabetically:

```ts
export * from './basic-button'
export * from './icon-button'
```

- **Export only the public API.** Do not put `*.module.css`, internal helpers, or tests in `index.ts`. Export `types.ts` only when its types are part of the public API.
- **Do not create one barrel for all groups** (that is, no `src/components/index.ts` re-exporting every group). A barrel per group stays small and harmless. A large one slows dev builds and mixes client and server components.
- Import through the group: `import { BasicButton } from '~/components/buttons'`.

## Import-Alias `~`

`~` points to `src/`. Add this to every `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

- Within `src/`, use `~/...` imports. Relative imports (`./basic-button`) are allowed only between files in the same folder; never use `../..`.
- In a monorepo, `~` points to each app's or package's own `src/`.
- Set the alias with `--import-alias "~/*"` when running `create-next-app`.
