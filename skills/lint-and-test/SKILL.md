---
name: lint-and-test
description: Linting, formatting, and tests - always use Biome (lint, format, import sorting) and bun test; never ESLint, Prettier, Jest, or Vitest. Use when setting up or running lint or formatting, editing biome.json, writing or running bun:test tests, configuring CI checks, and before finishing a change to run lint, typecheck, and tests.
---

# Lint, format, and tests

## Biome

Biome replaces ESLint and Prettier. It lints, formats, and sorts imports.

- Keep `biome.json` at the repository root. Use the schema file from `node_modules` so it matches the installed version: `"$schema": "./node_modules/@biomejs/biome/configuration_schema.json"`.
- Install an exact version with `bun add -D -E @biomejs/biome`.
- **The user supplies the rules.** Until they do, use the baseline from `references/biome.json`. It contains only recommended rules and style settings: single quotes and no semicolons (based on the existing examples), plus two-space indentation (a provisional assumption). Do not add your own rule preferences unless the user provides them.
- In a monorepo, keep `biome.json` at the root. Apps and packages need their own only when they differ; in that case, inherit with `"extends": "//"`.

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write ."
  }
}
```

Do not suppress Biome warnings with `biome-ignore` unless the comment explains why.

## Tests: `bun test`

- Run tests with `bun test` and import from `bun:test` (`import { describe, expect, it } from 'bun:test'`).
- Keep test files next to the code and name them `<name>.test.ts` or `<name>.test.tsx`, following kebab-case (for example, `post-schema.test.ts`).
- Test logic, Zod schemas, tRPC routers (through `createCaller`), and helper functions first.
- **Component tests need a DOM environment** (for example, happy-dom with Testing Library and a preload in `bunfig.toml`). This setup is undecided. Do not invent component tests until it is selected; ask when needed.

## Before finishing

Run these commands in order before considering a change complete:

```bash
bun run lint
bun run typecheck
bun test
```

If a script is missing, add it to `package.json` (`"typecheck": "tsc --noEmit"`). If a step fails, fix the cause instead of changing the script to make it pass.
