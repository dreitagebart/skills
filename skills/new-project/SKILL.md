---
name: new-project
description: Scaffold a new project following dreitagebart conventions -
  Next.js, Mantine, tRPC, Prisma 7, better-auth, and Biome, as either a
  standalone app or a Turborepo monorepo. Use when creating a new project, app,
  repository, boilerplate, or starter, triggered by phrases like "new project",
  "init", "scaffold", "start a project", or "create an app", even when the stack
  is not specified.
---
# Create a new project

This skill creates a project so the other skills apply without extra setup. It uses templates from `assets/`, replacing `__PROJECT__` and `__BUN_VERSION__`. Follow the fixed sequence so projects have a consistent structure.

**Prerequisite:** This skill references files from other skills in this repository (for example `data-fetching/references/trpc-setup.md`). If the other skills are not installed, those files will be missing. First run `npx skills add https://codeberg.org/dreitagebart/skills --all`.

## 0. Clarify

A brief question is enough if any of these are unknown:

- **Project name** (kebab-case; becomes the `@<project>` scope).
- **Project structure:** Ask whether to create a standalone Next.js app or a Turborepo monorepo. Never assume monorepo by default.
- **Modules:** Does the project need a database (Prisma) and auth (better-auth)? If unspecified, set up both because they are part of the standard stack.

Follow the stack for everything else. Do not ask about decisions already defined by `stack`.

## 1. Create the project structure

### Standalone Next.js app

Create the Next.js app directly in the project directory, not in an `apps/web/` subdirectory. Keep its generated `package.json`, `tsconfig.json`, and `.gitignore`; do not add Turborepo or workspace configuration. Set the package name to the project name.

If the target directory already contains files and `create-next-app` refuses to scaffold there, scaffold into a temporary directory and copy the generated app files into the target. Preserve existing project files and remove only generated example files that do not fit the app.

### Turborepo monorepo

Copy `package.json`, `turbo.json`, `tsconfig.base.json`, and `.gitignore` from `assets/root/` into the project. Replace `__PROJECT__` with the project name and `__BUN_VERSION__` with the output of `bun --version`. Name the root package `@<project>/root`.

Follow `monorepo` for workspace package naming only when the monorepo option was chosen.

## 2. Create the Next.js app

Use `.` as the destination for a standalone app and `apps/web` for a monorepo:

```bash
bunx create-next-app@latest <destination> --ts --app --src-dir --no-tailwind --import-alias "~/*" --use-bun
```

Check the flags with `bunx create-next-app@latest --help` first; they may change. Required options are TypeScript, App Router, `src/` folder, **no Tailwind**, `~/*` import alias, and Bun as package manager. If offered linter options, choose none (Biome is at the root).

After creating the app, set up Biome using `lint-and-test`: install `@biomejs/biome` and `typescript` as exact dev dependencies; add `turbo` only for a monorepo. Copy `lint-and-test/references/biome.json` to the project root as `biome.json`.

Then, in the app directory (`.` for standalone or `apps/web/` for monorepo):

1. Ensure `"private": true` and add a `typecheck` script (`tsc --noEmit`). For a monorepo, set `name` to `@<project>/web`.
2. In a monorepo, match `tsconfig.json` to `assets/web/tsconfig.json` (it extends `../../tsconfig.base.json` and contains the `~` alias). For a standalone app, keep the generated configuration and ensure it contains the `~` alias.
3. Copy `assets/web/src/env.ts` to `src/env.ts` and remove unused variables. Copy `assets/web/.env.example` as `.env.example`.
4. Create folders following `file-conventions` (`src/components/`, `src/schemas/`, `src/lib/`).
5. Remove generated example files and default CSS from `create-next-app` that do not fit the structure.
6. Inspect `next.config.ts` and package dependencies together. Keep `reactCompiler` enabled only when `babel-plugin-react-compiler` is installed; otherwise remove the option.

## 3. Set up libraries

Follow this order and the corresponding skill for each step:

1. **Mantine:** Use `react-components`, section "Mantine setup in the App Router" (packages, `postcss.config.ts`, root layout).
2. **Database:** Use `database` and `database/references/prisma-setup.md` (only if a database is needed).
3. **Auth:** Use `auth` and `auth/references/better-auth-setup.md` (only if auth is needed; it requires the database).
4. **tRPC:** Use `data-fetching` and `data-fetching/references/trpc-setup.md`. The template uses `ctx.db` and the session; remove the relevant lines if database or auth is not used.
5. **Forms and validation:** Use `forms` (Zod and Mantine Form) when creating the first form.

Always install packages with `bun add` so `package.json` records current versions (see `stack`).

## 4. Containers (only if requested)

If the project should use containers, apply `containers`. Its templates are untested, so build and adjust them after copying.

## 5. Verify and finish

From the project root, run `bun install`, `bun run lint`, `bun run typecheck`, and `bun run build` for either structure. For a monorepo, root scripts should delegate app tasks through Turborepo; standalone scripts run directly in the Next.js app.

All steps must pass. Keep Prisma client generation working before `.env` exists by following the optional `DATABASE_URL` pattern in the database skill. If `build` needs runtime environment variables, create `.env` from `.env.example`. Then run `git init`, create the first commit, and apply `setup-dreitagebart-skills` so the core rules are recorded in `AGENTS.md`.
