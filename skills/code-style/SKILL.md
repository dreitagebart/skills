---
name: code-style
description: dreitagebart general coding rules - all identifiers and comments must be in English, named exports instead of default exports, strict TypeScript, Zod validation at system boundaries, and centralized environment validation in src/env.ts. Use when writing, reviewing, or refactoring code; naming variables, functions, types, or models; writing comments; or accessing environment variables.
---

# Code style

## Language in code: English, required

- **All identifiers are English:** variables, functions, types, classes, files, folders, database models, fields, tRPC procedures, and branch names.
- **All code comments are English.**
- This applies even when the user writes in another language or a domain term is not English. Choose an English term for concepts without a good English equivalent and, if useful, explain it once with the original term in a comment.
- This does not apply to UI text and user-facing error messages (use the product's language) or documentation. Follow the language of existing project documentation or ask.

Comments explain why, not what. Omit comments that merely repeat the code.

## Exports

- Named exports are the default (`export const BasicButton = ...`).
- Use `export default` only where the framework requires it: Next.js special files such as `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, and `not-found.tsx`, as well as configuration files. `route.ts` uses named exports (`GET`, `POST`).

## TypeScript

- Set `strict: true` in every `tsconfig.json`.
- Avoid `any`. Treat unknown data as `unknown` and parse it with Zod. If `any` must remain (for example, at a library type boundary), put a `biome-ignore` with a reason immediately above it.
- Derive types from Zod schemas (`z.infer`); do not duplicate them by hand.

## Validation at system boundaries

Validate everything from outside with Zod before using it: tRPC inputs, forms, webhooks, external APIs, and environment variables. Inside the system, functions trust types and do not validate the same data again.

## Environment variables

- Access variables only through `src/env.ts`, which validates all of them with Zod and exports `env` (template in the `new-project` skill: `new-project/assets/web/src/env.ts`). Do not scatter `process.env.X` throughout the code.
- Fail at startup if a variable is missing or malformed. This is intentional: a startup failure is better than a runtime failure.
- Prefix browser variables with `NEXT_PUBLIC_` and keep them separate from server variables.
- Never commit `.env`. Commit `.env.example` with all variable names and dummy or empty values.
