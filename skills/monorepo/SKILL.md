---
name: monorepo
description: Turborepo monorepos with Bun workspaces and a fixed naming scheme -
  root is @<project>/root, apps and packages are @<project>/<folder-name> (for
  example @opencore/web, @opencore/auth). Use when creating or extending a
  monorepo, adding apps or packages, editing turbo.json or workspaces, sharing
  code, managing internal dependencies, or deciding where code belongs.
---
# Monorepos with Turborepo

Use this skill when the user chooses a Turborepo monorepo or when extending a project that already uses one. Do not turn a standalone app into a monorepo without asking. The `new-project` skill asks the user which structure to create.

## Structure and naming

```
<project>/
├── package.json         # name: "@<project>/root"
├── turbo.json
├── biome.json
├── tsconfig.base.json
├── apps/
│   └── web/             # name: "@<project>/web"
└── packages/
    └── auth/            # name: "@<project>/auth"
```

- `<project>` is the project name in lowercase kebab-case. Ask for it if it is unknown.
- **Root:** `@<project>/root`, with `"private": true`.
- **Apps and packages:** `@<project>/<folder-name>`. The `apps/web` folder is `@<project>/web`; `packages/auth` is `@<project>/auth`. The folder name and package-name suffix always match.
- The scope is an internal namespace only. Nothing is published, so keep `"private": true` everywhere.

## Workspaces and internal dependencies

- Declare `"workspaces": ["apps/*", "packages/*"]` at the root.
- Add internal dependencies to the consumer's `package.json`, for example `"@<project>/auth": "workspace:*"`.
- Internal packages export their TypeScript source directly (`"exports": { ".": "./src/index.ts" }`), without a separate build step. Add them to `transpilePackages` in each consuming Next.js app's `next.config.ts`.
- The `~` alias is scoped to each app or package's own `src/` (see `file-conventions`). Never import from another package with `~`; use the package name.

## What belongs in a package

Create a package when code is needed by multiple apps or is clearly separable. Common examples: `@<project>/db` (Prisma, see `database`), `@<project>/auth` (better-auth, see `auth`), `@<project>/schemas` (shared Zod schemas), and `@<project>/ui` (shared Mantine components). Apps contain only code specific to that app.

## `turbo.json`

Turborepo 2 uses `tasks`. See the template in the `new-project` skill: `new-project/assets/root/turbo.json`.

- `build` depends on `^build` and declares its outputs (`.next/**` excluding `.next/cache/**`).
- `dev` is `persistent` and is not cached.
- **Declare environment variables.** In strict mode, Turborepo passes only variables listed under `env` or `globalEnv` in `turbo.json` to tasks. If `DATABASE_URL` is missing there, the build reports it as missing even when it is set.

## Commands

```bash
bun install
bun run dev                              # all apps
bunx turbo run build --filter=@<project>/web
bun add <package> --cwd apps/web        # dependency for an app
```

To add an app or package, create its folder under `apps/` or `packages/`, add a `package.json` using the naming scheme, then run `bun install` from the root.
