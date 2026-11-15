# AGENTS.md

This repository contains Agent Skills (`skills/<name>/SKILL.md`), not an application. These rules apply to everyone who writes or changes skills here.

## Structure

- `skills/<name>/SKILL.md` is a skill. The folder name must match `name` in the frontmatter (kebab-case).
- Supporting material lives in `references/` (read when needed) and `assets/` (output templates).
- `drafts/` contains drafts that are not installed.
- `docs/` contains documentation for people; `ROADMAP.md` lists open items.

## Skill rules

- Frontmatter contains only `name` and `description`. Keep `description` on one line and under 1024 characters.
- The `description` determines when a skill is loaded. State what the skill does and concrete triggers (keywords, tasks). Be explicit because agents are more likely to load skills too rarely than too often.
- Keep `SKILL.md` under 500 lines. Move longer details into `references/` and explain in `SKILL.md` when to read them.
- Refer to files in another skill as `<skill>/references/<file>` or `<skill>/assets/<file>`.
- Write instructions in the imperative and explain why when it is not self-evident. Pair every prohibition with an allowed alternative.
- Write prose in English. Technical terms, identifiers, code, and code comments are in English as well.
- Code in skills follows the project's conventions (kebab-case filenames, `~` alias, named exports).

## Validation

```bash
bun run validate
```

The script checks frontmatter, names, size limits, and file references. It must pass before every commit.
