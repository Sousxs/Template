# DOCS-LOG — `/audit docs`

Baseline: `bb2b145` (main, clean). Build/test/lint: N/A (template repo, no application code). `check-traceability.ps1` on main without `specs/`: FAIL as designed (exit 1).

## Coverage (2026-09-25)

| Artifact | Checked how | Status |
|----------|-------------|--------|
| README.md | every referenced path exists; counts (14 skills, 2 agents, 3 workflows, handbook 01–07 / 01–09) | done |
| CLAUDE.md / AGENTS.md | referenced paths, CLI flags (`code-review-graph update --brief`, `detect-changes --brief`), agent tool lists | done |
| PROJECT-COMMANDS.md | placeholders only; no project to run against | N/A here |
| docs/setup.md | secrets names vs workflows, `--max-turns 15`, no `synchronize`, `specify` subcommands, MCP lists | done |
| docs/brownfield.md, docs/skill-catalog.md | referenced scripts/packs; install commands not executed (network/opt-in) | done (partial) |
| scripts/*.ps1 | commands they call exist | done |
| .claude/skills/*/SKILL.md, .claude/agents/*.md | referenced paths | done |
| docs/padroes/ (handbook) | index vs files, guide tables vs `/fgr-feature` claims (14 / 10 files), recommendation IDs B5/T3 | done |
| .specify/ templates, constitution, workflow.yml | referenced paths | done |

## Findings

| ID | Where | Class | Evidence | Status | Commit |
|----|-------|-------|----------|--------|--------|
| DOCS-001 | `scripts/setup.ps1:57`, `docs/setup.md` §Upgrade | OUTDATED (medium) | `specify self upgrade` → "Reserved command surface for self-upgrade; not implemented" (specify-cli 0.8.17 via uv). `specify self check` prints the real route: `uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git`. Docs/README/AGENTS promise "setup upgrades Spec Kit"; it does not. | fixed | |
| DOCS-002 | `README.md:27`, `AGENTS.md:53` | OUTDATED (low) | Both say PR template `=` `docs/padroes/checklist-pr.md`; `diff` shows the PR template adds a "Gates" section and "Notas / riscos". The handbook file itself says it is the *source* the template extends. | fixed | |
| DOCS-003 | `AGENTS.md:9` | MISSING (low) | Reading order step 1 is `.specify/memory/handoff.md`; the template ships none (created by `/speckit-handoff` at GATE B). Fresh clone: agent looks for a file that cannot exist yet. | fixed | |
| DOCS-004 | `PROJECT-COMMANDS.md` | N/A | Says `/audit docs` validates it against reality; in the template there is no `FGR.<Sistema>.*` or app to run against. Re-run this focus in each adopting project. | log-only | |

## Pending human decision

- DOCS-004: nothing to do in the template; the note is a reminder for adopting projects.
- Out of repo: `C:\Users\psouza\CLAUDE.md` (user-global) contains a one-off Figma task ("Gerenciador de Sites") that loads into every Claude Code session in every project. Move it to that Figma project's folder or delete it.

## Report

- 4 findings: 1 medium (fixed), 2 low (fixed), 1 N/A (log-only).
- Recurring pattern: docs describing tool behaviour that was never executed on a real machine (Spec Kit CLI surface). Preventive: `docs/setup.md` claims about third-party CLIs must cite the command output that proves them.
