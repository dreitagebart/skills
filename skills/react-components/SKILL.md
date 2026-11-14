---
name: react-components
description: React-Komponentenkonventionen von dreitagebart mit Mantine - export const mit Pfeilfunktion, Props-Typen (type Props, exportiert als <Name>Props), CSS Modules statt Tailwind, Client/Server-Grenzen, Mantine-Setup im Next.js App Router. Verwenden beim Anlegen oder Ändern von React- und Next.js-Komponenten, Props-Typen, Layouts, UI-Code, Mantine-Komponenten und Styling.
---

# React-Komponenten mit Mantine

## Komponentenmuster

- Komponenten sind immer `export const` mit Pfeilfunktion und benanntem Export, nie `function`-Deklarationen und nie Default-Export.
- Der Props-Typ heißt lokal `Props`. Muss er exportiert werden, heißt er `<Komponentenname>Props`.
- `children` wird mit `ReactNode` typisiert, importiert als `import type { ReactNode } from 'react'`.
- Eine Komponente pro Datei. Datei- und Ordnerlage steht im Skill `file-conventions`.

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

Exportierter Props-Typ (wenn andere Dateien ihn brauchen):

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

Dazu in der Gruppen-`index.ts`: `export * from './basic-button'`. Das CSS-Modul wird nicht exportiert.

## Ausnahmen vom Default-Export-Verbot

Next.js verlangt Default-Exports für `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx` sowie für Konfigurationsdateien. Dort ist `export default` richtig. Die Komponente bleibt eine Pfeilfunktion und wird danach mit `export default` exportiert.

## Styling

- Mantine-Komponenten und ihre Style-Props (`mt`, `p`, `c`, `bg` und so weiter) sind die erste Wahl.
- Eigene Styles kommen in CSS Modules (`basic-button.module.css`) neben die Komponente und werden mit `import classes from './basic-button.module.css'` genutzt. `postcss-preset-mantine` stellt Mixins wie `@mixin hover` und `light-dark()` bereit.
- Kein Tailwind, keine Inline-Style-Objekte als Dauerlösung, kein CSS-in-JS zur Laufzeit. Mantine liefert seit Version 7 CSS-basierte Styles, die mit dem App Router gut funktionieren.

## Client und Server

- Komponenten sind standardmäßig Server-Komponenten. `'use client'` steht nur in Dateien, die Hooks, Event-Handler oder Browser-APIs brauchen, und zwar in der ersten Zeile der Datei.
- Mantine-Hooks und Komponenten mit Dot-Notation (`Tabs.Panel`) brauchen in Server-Komponenten Sonderbehandlung. Bei Fehlern das Mantine Help Center zu Server Components lesen (`help.mantine.dev/q/server-components`).
- Datenzugriff folgt dem Skill `data-fetching`: möglichst auf dem Server laden und per `HydrationBoundary` an Client-Komponenten übergeben.

## Mantine-Setup im App Router

Installation:

```bash
bun add @mantine/core @mantine/hooks
bun add -D postcss postcss-preset-mantine postcss-simple-vars
```

`postcss.config.ts` im Root der App:

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

`src/app/layout.tsx`:

```tsx
import '@mantine/core/styles.css'

import type { ReactNode } from 'react'
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <html lang="de" {...mantineHtmlProps}>
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

- Jedes weitere Mantine-Paket (`@mantine/dates`, `@mantine/notifications`) braucht zusätzlich seinen eigenen Style-Import.
- Provider von tRPC und TanStack Query kommen innerhalb des `MantineProvider` in den Layout-Baum (siehe Skill `data-fetching`).
- Laut Mantine-Guide hilft `experimental.optimizePackageImports: ['@mantine/core', '@mantine/hooks']` in `next.config.ts` beim Tree-Shaking. Prüfen, ob die verwendete Mantine- und Next.js-Version das schon von selbst erledigt.
