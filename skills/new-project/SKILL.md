---
name: new-project
description: Scaffold a new project following dreitagebart conventions - Turborepo with Bun, Next.js, Mantine, tRPC, Prisma 7, better-auth, and Biome. Use when creating a new project, app, repository, boilerplate, or starter, triggered by phrases like "new project", "init", "scaffold", "start a project", or "create an app", even when the stack is not specified.
---

# Create a new project

This skill creates a project so the other skills apply without extra setup. It uses templates from `assets/`, replacing `__PROJECT__` and `__BUN_VERSION__`. Follow the fixed sequence so projects have a consistent structure.

**Prerequisite:** This skill references files from other skills in this repository (for example `data-fetching/references/trpc-setup.md`). If the other skills are not installed, those files will be missing. First run `npx skills add https://codeberg.org/dreitagebart/skills --all`.

## 0. Clarify

A brief question is enough if any of these are unknown:

- **Project name** (kebab-case; becomes the `@<project>` scope).
- **Modules:** Does the project need a database (Prisma) and auth (better-auth)? If unspecified, set up both because they are part of the standard stack.

Follow the stack for everything else. Do not ask about decisions already defined by `stack`.

## 1. Create the root

Copy `package.json`, `turbo.json`, `tsconfig.base.json`, and `.gitignore` from `assets/root/` into the project. Then replace:

- `__PROJECT__` with the project name,
- `__BUN_VERSION__` with the output of `bun --version`.

Set up Biome using `lint-and-test`: run `bun add -D -E @biomejs/biome turbo typescript`, then copy `lint-and-test/references/biome.json` to the root as `biome.json`. See `monorepo` for package naming rules.

## 2. Create the web app

```bash
bunx create-next-app@latest apps/web --ts --app --src-dir --no-tailwind --import-alias "~/*" --use-bun
```

Check the flags with `bunx create-next-app@latest --help` first; they may change. Required options are TypeScript, App Router, `src/` folder, **no Tailwind**, `~/*` import alias, and Bun as package manager. If offered linter options, choose none (Biome is at the root).

Then, in `apps/web/`:

1. In `package.json`, set `name` to `@<project>/web`, ensure `"private": true`, and add a `typecheck` script (`tsc --noEmit`).
2. Match `tsconfig.json` to `assets/web/tsconfig.json` (it extends `../../tsconfig.base.json` and contains the `~` alias). Replace the configuration created by `create-next-app`.
3. Copy `assets/web/src/env.ts` to `src/env.ts` and remove unused variables. Copy `assets/web/.env.example` as `.env.example`.
4. Create folders following `file-conventions` (`src/components/`, `src/schemas/`, `src/lib/`).
5. Remove generated example files and default CSS from `create-next-app` that do not fit the structure.

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

```bash
bun install
bun run lint
bun run typecheck
bun run build
```

All steps must pass. If `build` fails because environment variables are missing, create `.env` from `.env.example`. Then run `git init`, create the first commit, and apply `setup-dreitagebart-skills` so the core rules are recorded in `AGENTS.md`.
