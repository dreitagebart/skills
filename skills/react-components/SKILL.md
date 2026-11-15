---
name: react-components
description: dreitagebart React component conventions with Mantine - export const arrow functions, props types (type Props, exported as <Name>Props), CSS Modules instead of Tailwind, client/server boundaries, and Mantine setup in the Next.js App Router. Use when creating or changing React or Next.js components, props types, layouts, UI code, Mantine components, or styling.
---

# React components with Mantine

## Komponentenmuster

- Always define components as `export const` arrow functions with named exports, never as `function` declarations or default exports.
- Name the local props type `Props`. If it must be exported, name it `<ComponentName>Props`.
- Type `children` as `ReactNode`, imported with `import type { ReactNode } from 'react'`.
- Put one component in each file. See `file-conventions` for file and folder placement.

Lokaler Props-Typ:

```tsx
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const Card = ({ children }: Props) => {
  return <div>{children}</div>
}
```

Exported props type (when needed by other files):

```tsx
import type { ReactNode } from 'react'
import { Button } from '@mantine/core'
import classes from './basic-button.module.css'

export type BasicButtonProps = {
  children: ReactNode
}

export const BasicButton = ({ children }: BasicButtonProps) => {
  return <Button className={classes.root}>{children}</Button>
}
```

In the group `index.ts`, add `export * from './basic-button'`. Do not export the CSS module.

## Exceptions to the default export rule

Next.js requires default exports for `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`, and configuration files. Use `export default` in those files. Keep the component as an arrow function, then export it with `export default`.

## Styling

- Prefer Mantine components and their style props (`mt`, `p`, `c`, `bg`, and so on).
- Put custom styles in a CSS Module (`basic-button.module.css`) next to the component and import them with `import classes from './basic-button.module.css'`. `postcss-preset-mantine` provides mixins such as `@mixin hover` and `light-dark()`.
- Do not use Tailwind, inline style objects as a long-term solution, or runtime CSS-in-JS. Since version 7, Mantine provides CSS-based styles that work well with the App Router.

## Client and server

- Components are Server Components by default. Put `'use client'` on the first line only in files that need hooks, event handlers, or browser APIs.
- Mantine hooks and dot-notation components (`Tabs.Panel`) need special handling in Server Components. If errors occur, read Mantine's Server Components help page (`help.mantine.dev/q/server-components`).
- Follow `data-fetching`: load data on the server where possible and pass it to Client Components with `HydrationBoundary`.

## Mantine setup in the App Router

Installation:

```bash
bun add @mantine/core @mantine/hooks
bun add -D postcss postcss-preset-mantine postcss-simple-vars
```

Place `postcss.config.ts` at the app root:

```js
export default {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
}
```

In `src/app/layout.tsx`:

```tsx
import '@mantine/core/styles.css'

import type { ReactNode } from 'react'
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  )
}

export default Layout
```

- Each additional Mantine package (`@mantine/dates`, `@mantine/notifications`) needs its own style import.
- Place tRPC and TanStack Query providers inside `MantineProvider` in the layout tree (see `data-fetching`).
- Mantine's guide recommends `experimental.optimizePackageImports: ['@mantine/core', '@mantine/hooks']` in `next.config.ts` for tree-shaking. Check whether the installed Mantine and Next.js versions already do this automatically.
