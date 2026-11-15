# Roadmap and Status

## Open: items for you to provide

| Topic | Where it belongs |
|---|---|
| Biome rules | Replace `skills/lint-and-test/references/biome.json` (currently only a baseline) |
| Compose templates | `skills/containers/assets/` (currently a placeholder `compose.yml`) |
| Git workflow | Fill in `drafts/git-workflow/SKILL.md`, then move it to `skills/` |
| Table rendering | Decide in `skills/stack/SKILL.md`: Mantine `Table` or `mantine-react-table` |
| Database naming scheme | Decide in `skills/database/SKILL.md`: map to snake_case with `@@map`/`@map` or not |
| Component tests | Choose a DOM environment (for example happy-dom) in `skills/lint-and-test/SKILL.md` |

## To review: suggestions from Claude, not from you

These items are in the skills but did not come from your instructions. Review and remove or confirm them.

- The entire `error-handling` skill: the principle "handle at boundaries", TRPCError codes, and a logger module with levels and JSON in production.
- Test files live next to the code and use the name `<name>.test.ts(x)`.
- `src/schemas/` for Zod schemas shared by forms and tRPC.
- Prisma output under `src/generated/prisma` (import `~/generated/prisma/client`) so the `~` alias works.
- Monorepo: Prisma in its own package `@<project>/db`, more package examples (`auth`, `schemas`, `ui`), internal packages export TypeScript sources and are listed in `transpilePackages`.
- `container_name` follows the pattern `<project>-<service>`.
- `runtime-and-languages`: avoid shell scripts with more than a few lines of logic; use TypeScript with `Bun.$` instead.
- Biome baseline: two-space indentation.
- `tsconfig.base.json` with `noUncheckedIndexedAccess: true` (stricter than `strict`).
- Root layout template with `lang="en"`, tRPC template with `react-error-boundary` as a dependency.
- Skill names without a prefix. Consider a prefix (`dtb-`) for a public release to avoid collisions with skills in other repositories.

## Verification status (November 14, 2026)

**Run and passed:**
- `bun run validate` checks all 15 skills (frontmatter, names, sizes, file references). A negative test with deliberately inserted errors was detected.
- The real `skills` CLI discovers all 15 skills and excludes the draft in `drafts/`. A test installation of individual skills copies `references/` and `assets/` as well.
- The logger example (development, production, levels), and the `env.ts` and Zod schema templates from the `forms` skill run under Bun with Zod 4.

**Compared with current documentation, but not executed:**
- Prisma 7 (config, generator, driver adapter), tRPC v11 with App Router, better-auth with Prisma adapter, Mantine with Next.js, `mantine-form-zod-resolver` for Zod 4, Biome 2.

**Untested:**
- `Containerfile.bun-next` and `compose.yml`.
- The `new-project` workflow (flags for `create-next-app`, Turborepo configuration) in a real project.
- All Next.js code examples in the skills: no Next.js project was built.

Record deviations during the first real use and update the affected skill immediately.

## Next steps

1. Create and push the repository on Codeberg (see README).
2. Walk through `new-project` in a fresh test project and incorporate deviations into the skills.
3. Provide Biome rules, Compose templates, and the Git workflow.
4. Decide whether a GitHub mirror or npm package would also be useful.
