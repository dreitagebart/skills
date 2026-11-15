# Recommended skills by other authors

As of November 14, 2026. These skills are not from this repository. The selection is based on installation counts and catalog descriptions, not on testing them in your projects. Installation counts are partly affected by distribution (skills bundled with other packages are counted too), so treat them as a rough signal only.

**Read the source before every installation.** Skills run with the agent's permissions. The `skills` CLI says this during installation too.

## Skills you already like

### grill-with-docs (mattpocock)

A persistent interview that examines a plan or draft point by point, sharpens terminology, and writes documentation along the way (according to its description, `CONTEXT.md` and ADRs). Useful before coding when unclear terms could lead to incorrectly built features. The catalog description says the skill internally invokes `grilling` and `domain-modeling`.

```bash
# the skill only (check dependencies below)
npx skills add mattpocock/skills --skill grill-with-docs

# or the entire repository
npx skills add mattpocock/skills
```

Use `--list` first to see the helper skill names and add them with `--skill`. Without them, this skill may work only partially.

### archify (tt-a1i)

Turns a description or code into an architecture, flow, sequence, or data-flow diagram as a standalone interactive HTML file. Refine it in conversation afterwards ("add Redis", "move auth to the left"). According to its README, it is intended for Claude Code, Codex CLI, and opencode, and is MIT-licensed.

```bash
npx skills add tt-a1i/archify -g
```

The skill includes its own renderer, which may require Node.js access according to the project README. This affects the tool, not your project code, but conflicts with the "Bun instead of Node" rule. Check during first use.

## Other popular skills

| Skill | Source | Purpose | Note |
|---|---|---|---|
| `grill-me` | mattpocock/skills | Interview before coding without documentation | Leaner version of `grill-with-docs` |
| `improve-codebase-architecture` | mattpocock/skills | Improve the architecture of an existing codebase | For established projects such as older apps |
| `tdd` | mattpocock/skills | Test-driven development | Check that examples work with `bun test` |
| `diagnosing-bugs` | mattpocock/skills | Systematic debugging | General purpose |
| `setup-matt-pocock-skills` | mattpocock/skills | Sets up Matt Pocock's skills in the project | Designed for GitHub workflows; check the tracker option for Codeberg |
| `find-skills` | vercel-labs/skills | Searches the registry during work and suggests skills | Most installed (over 4 million), but these are third-party skills; inspect before installing |
| `agent-browser` | vercel-labs | Browser automation for UI checks | Check which runtime it requires |
| `frontend-design` | anthropics | Distinctive interface design | May conflict with "Mantine, no custom style"; invoke selectively |
| `skill-creator` | anthropics | Create and test custom skills | Useful for maintaining this repository |
| `write-a-skill` | mattpocock/skills | Create new skills with a clean structure | Alternative to `skill-creator` |

## Suggested order

1. `grill-with-docs` and its helper skills, since you already like it and it supports "think first, build second".
2. `archify` for architecture diagrams.
3. Then as needed: `diagnosing-bugs` and `improve-codebase-architecture` for existing projects, `tdd` with `bun test`, and `agent-browser` for UI checks.
4. Use `frontend-design` selectively when you want a visually unconstrained page that does not need to follow Mantine closely.

## Distributing skills on Codeberg

The shorthand `owner/repo` in the `skills` CLI refers to GitHub. For skills on Codeberg, provide the full URL as with this repository:

```bash
npx skills add https://codeberg.org/dreitagebart/skills --all
```
