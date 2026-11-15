---
name: auth
description: Authentication with better-auth - Prisma adapter for PostgreSQL, Next.js route handlers, nextCookies, sessions in Server Components and tRPC context, protected routes and procedures. Use for login, registration, sessions, roles, OAuth, password resets, protected pages or procedures, and auth tables, including requests for "just a login" or "only signed-in users".
---

# Authentication with better-auth

Use better-auth with the Prisma adapter on PostgreSQL. Do not use NextAuth/Auth.js or Clerk unless the user asks for them. Code files are in `references/better-auth-setup.md`.

## Components

| File | Purpose |
|---|---|
| `src/lib/auth.ts` | Server instance `betterAuth({...})` with Prisma adapter |
| `src/lib/auth-client.ts` | Client instance `createAuthClient()` from `better-auth/react` |
| `src/app/api/auth/[...all]/route.ts` | Route handler using `toNextJsHandler(auth)` |
| `src/proxy.ts` | Optional quick check for a session cookie on protected paths |

## Rules

- **`nextCookies()` must be the last plugin** in the `plugins` array. It allows server calls through `auth.api` to set cookies.
- **Read the session on the server** with `auth.api.getSession({ headers: await headers() })`. Read it once in the tRPC context and expose it as `ctx.session` (see `data-fetching`). Protected procedures use `protectedProcedure`.
- **The check in `proxy.ts` is only a convenience gate.** It checks whether a session cookie exists, without accessing the database. Check actual authorization in procedures and Server Components because a cookie alone proves nothing.
- **Environment variables** `BETTER_AUTH_SECRET` (at least 32 characters) and `BETTER_AUTH_URL` belong in `src/env.ts` and must be validated with Zod. A mismatched `BETTER_AUTH_URL` between environments is a common source of errors.
- **Never put passwords, tokens, or secrets in logs or code.**
- Login and registration forms use `@mantine/form` with Zod (see `forms`) and call `authClient.signIn.email` or `authClient.signUp.email`.

## Schema and migration

Generate auth tables with the better-auth CLI; do not write them by hand:

```bash
bunx @better-auth/cli@latest generate --output prisma/schema.prisma
bunx --bun prisma migrate dev --name add-auth
```

After `generate`, inspect the schema file. Keep the `generator` block as `prisma-client` with `output`, and do not add a `url` to the `datasource` block (Prisma 7; see `database`). After adding a better-auth plugin, run `generate` and the migration again.

## Next.js version note

In Next.js 16, the file is named `proxy.ts` and the function `proxy`. In Next.js 15 and earlier, they are `middleware.ts` and `middleware`. Check the installed version.
