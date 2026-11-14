---
name: file-conventions
description: Datei- und Ordnerkonventionen von dreitagebart - alles klein mit Bindestrich (kebab-case wie bei Next.js), src-Struktur mit Gruppenordnern unter components, index.ts-Barrels mit export *, Import-Alias ~ auf src. Verwenden beim Anlegen, Umbenennen oder Verschieben von Dateien und Ordnern, bei Imports, tsconfig-Paths, Barrel-Dateien (index.ts), CSS-Modules und types.ts - auch bei kleinen Änderungen, weil Benennung überall konsistent sein muss.
---

# Datei- und Ordnerkonventionen

## Benennung

Alle Datei- und Ordnernamen sind klein geschrieben, Wörter werden mit Bindestrich getrennt (kebab-case), wie bei Next.js: `basic-button.tsx`, `user-settings/`, `app-router.ts`.

- Keine Großbuchstaben und keine Unterstriche in selbst vergebenen Namen.
- Die Namen im Code bleiben davon unberührt: Die Datei `basic-button.tsx` exportiert `BasicButton`.
- Ausnahmen sind herkömmliche Dateinamen und Frameworkvorgaben: `Containerfile`, `README.md`, `LICENSE`, `AGENTS.md`, `CLAUDE.md`, `SKILL.md` sowie Next.js-Spezialdateien (`page.tsx`, `layout.tsx`, `route.ts`, `[id]`, `(gruppe)`).

## Struktur unter `src/`

```
src/
├── app/                         # Next.js App Router
├── components/
│   ├── buttons/                 # Gruppe (Thema)
│   │   ├── basic-button.tsx
│   │   ├── basic-button.module.css
│   │   ├── types.ts             # optional, themenbezogen
│   │   └── index.ts             # export * from './basic-button'
│   └── forms/
│       ├── login-form.tsx
│       └── index.ts
├── views/
│   ├── dashboard-view.tsx       # dashboard view for /app/dashboard/page.tsx
|   └── posts-view.tsx           # posts view for /app/posts/page.tsx
├── schemas/                     # Zod-Schemas, von Formularen und tRPC geteilt
├── lib/
│   ├── trpc/
|   └── prisma.ts                # prisma client
└── env.ts
```

- Unter `src/components/` liegt ein Ordner pro Gruppe, also pro Thema wie `buttons`, `forms` oder `layout`. In jeder Gruppe liegen die Komponenten als Dateien (`basic-button.tsx`), dazu eine `index.ts` im Root des Gruppenordners.
- Eine Gruppe darf weitere Dateien enthalten, zum Beispiel `*.module.css` oder eine `types.ts` für das Thema.
- Unter `src/views/` liegen die seitenbezogenen Hauptansichten (`<seite>-view.tsx`), die eine komplette Route zusammensetzen und Komponenten aus `src/components/` einbinden.
- Die Dateien unter `src/app/` (`page.tsx`) bleiben dadurch schlank: Sie kümmern sich nur um Routing, Params, Metadata sowie initiales Server-Data-Fetching und rendern die passende View.
- Wenn eine View größer wird oder eigene Unterkomponenten, Styles (`*.module.css`) oder Hilfsdateien braucht, die nur für diese eine Seite gedacht sind, bekommt sie unter `src/views/<seite>/` einen eigenen Unterordner.


## Next.js `page.tsx` und `layout.tsx`

Seiten und Layouts werden immer als `async` Arrow-Function-Konstante (`Page` bzw. `Layout`) definiert und am Ende per `export default` exportiert.

- **`page.tsx`:** Rendert ausschließlich die zugehörige View-Komponente aus `~/views/...` (ggf. mit geladenen Daten oder aufgelösten Route-Params).
- **`layout.tsx`:** Typisiert die Props über `type Props` (mindestens `children: React.ReactNode`) und umschließt `children` mit der entsprechenden Layout-Komponente.

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


## Barrel-Dateien (`index.ts`)

Die `index.ts` einer Gruppe enthält nur `export *`-Zeilen, eine pro öffentliche Datei, ohne Dateiendung und alphabetisch sortiert:

```ts
export * from './basic-button'
export * from './icon-button'
```

- **Nur das öffentliche API wird exportiert.** `*.module.css`, interne Hilfsdateien und Tests stehen nicht in der `index.ts`. `types.ts` wird nur exportiert, wenn die Typen nach außen gehören.
- **Kein Sammel-Barrel über alle Gruppen** (also keine `src/components/index.ts`, die jede Gruppe re-exportiert). Ein Barrel pro Gruppe ist klein und unkritisch. Ein großes bremst Dev-Builds und vermischt Client- und Server-Komponenten.
- Importiert wird über die Gruppe: `import { BasicButton } from '~/components/buttons'`.

## Import-Alias `~`

`~` zeigt auf `src/`. Das gehört in jede `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

- Innerhalb von `src/` wird mit `~/...` importiert. Relative Imports (`./basic-button`) sind nur für Dateien im selben Ordner erlaubt, nie `../..`.
- Im Monorepo gilt `~` pro App und pro Package für dessen eigenes `src/`.
- Bei `create-next-app` den Alias mit `--import-alias "~/*"` setzen.
