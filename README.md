# skills

dreitagebart coding guidelines as Agent Skills. A skill is a folder containing a `SKILL.md` that a coding agent loads for relevant tasks. This repository defines the stack, file conventions, component patterns, data access, database, auth, containers, and project setup so agents work consistently across projects.

Status: version 1.0.0. Open items and verification status are in [ROADMAP.md](ROADMAP.md).

## Installation

Installing all skills is recommended because some skills depend on reference files from other skills. This ensures those references are available whenever a skill is used.

To install the skills run:

```bash
npx skills add dreitagebart/skills
```

To install only selected skills make sure to include any skills they reference:

```bash
npx skills add dreitagebart/skills --skill file-conventions --skill react-components
```

Preview the available skills:

```bash
npx skills add dreitagebart/skills --list
```

Update with `npx skills update`.

> `new-project` references files from other skills in this repository and only works fully when all skills are installed. Use `--all` if in doubt.

Then invoke the `setup-dreitagebart-skills` skill once in the project. It adds a short core-rules block to `AGENTS.md` so the always-applicable rules remain available even when a skill is not loaded automatically.

## Using the skills in a project

### Add conventions to an existing project

Run the install command from the project root. Install all skills for the full set of conventions:

```bash
npx skills add dreitagebart/skills
```

Or install only the skills that match the project:

```bash
npx skills add dreitagebart/skills --skill stack --skill file-conventions --skill react-components
```

Then ask your coding agent to apply `setup-dreitagebart-skills` once. Ask it to inspect the existing code against the installed skills and prepare a prioritized migration plan before changing files. Work through the plan in small steps, reviewing each area as it is updated.

### Start a new Next.js project

Run this from the new project directory to install all skills, including the related files used by `new-project`:

```bash
npx skills add dreitagebart/skills
```

Ask your coding agent to follow `new-project`, and provide a project name plus whether the project needs a database and authentication. For example:

> Create a new Next.js project following the `new-project` skill. Use the name `my-project`. Include a database and authentication.

The `new-project` workflow also applies `setup-dreitagebart-skills` when it finishes scaffolding.

### Update installed skills

Run the update command from the project root for project-installed skills:

```bash
npx skills update -p
```

For skills installed globally, use:

```bash
npx skills update -g
```

To check for available updates without installing them, run `npx skills check` in the project. See the [`skills` CLI documentation](https://github.com/vercel-labs/skills/blob/main/docs/commands.md#skills-update) for other update options.

## Skills

| Skill | Contents |
|---|---|
| `stack` | Tech stack, prohibitions, and alternatives |
| `file-conventions` | kebab-case, `src/` structure, `index.ts` barrels, `~` alias |
| `react-components` | Component patterns, props types, Mantine setup, styling |
| `forms` | Mantine Form with Zod, schemas shared with tRPC |
| `data-fetching` | tRPC v11, SSR prefetch, `HydrationBoundary` |
| `database` | Prisma 7 with PostgreSQL |
| `auth` | better-auth with Prisma adapter and Next.js |
| `runtime-and-languages` | Bun, TypeScript, no Python, Go |
| `code-style` | English in code, named exports, Zod at boundaries, env validation |
| `lint-and-test` | Biome and `bun test` |
| `error-handling` | Error handling and logging |
| `containers` | `Containerfile`, `compose.yml`, base images |
| `monorepo` | Turborepo, naming scheme `@<project>/...` |
| `new-project` | Scaffold following the conventions |
| `setup-dreitagebart-skills` | Add core rules to `AGENTS.md` |

Recommendations for skills by other authors (for example `grill-with-docs`, `archify`): [docs/recommended-skills.md](docs/recommended-skills.md).

## Structure

```
skills/
├── skills/<name>/SKILL.md       # a skill, with optional references/ and assets/
├── drafts/                      # drafts, not installed
├── docs/                        # documentation for people
├── scripts/validate-skills.ts   # validation script
├── AGENTS.md                    # rules for writing skills in this repository
└── ROADMAP.md
```

Prose is in English. Technical terms, identifiers, code, and code comments are also in English.

## Development

This repository has no dependencies. Bun is required.

```bash
bun run validate
```

The script checks frontmatter, names, length limits, and file references. See [AGENTS.md](AGENTS.md) for rules on adding skills.

## License

MIT - see [LICENSE](LICENSE).
