# AGENTS.md — Universal Agent Contract (Spec Kit pipeline)

> Read by ANY CLI agent working in this repo: Antigravity, Cursor, opencode, Claude Code and others.
> Defines the full SDD pipeline contract: spec → implement → audit. Claude Code additionally reads `CLAUDE.md` (same pipeline + Claude-specific orchestration). Keep this file lean — it loads every session.

## Reading order (before any work)

0. `PROJECT-COMMANDS.md` — canonical build/test/lint commands (never rediscover them)
1. `.specify/memory/handoff.md` — decisions, risks, open questions
2. `.specify/memory/constitution.md` — non-negotiable principles + conventions
3. `specs/NNN-feature/spec.md` → `plan.md` → `tasks.md` (+ `contracts/`, `data-model.md`)

## Pipeline (same for every agent)

```
constitution → specify → clarify* → checklist → plan → GATE A (adversarial plan review) → tasks
→ analyze* → handoff GATE B → implement → GATE C (code review) → converge/audit   (* = loop; mandatory)
```

Spec phase produces artifacts only. Implementation starts **only** when the Definition of Ready below holds — even if the same agent does both phases. One feature per cycle, branch `NNN-feature-name`.

## Definition of Ready (before implementing)

ALL must hold; otherwise STOP and log the gap in the handoff.md Q-table:

- [ ] `handoff.md` exists, current version, spec marked approved
- [ ] `constitution.md` present
- [ ] `spec.md` has zero `[NEEDS CLARIFICATION]`
- [ ] `tasks.md` has explicit dependencies and `[P]` markers
- [ ] `contracts/` complete for every endpoint referenced
- [ ] Test tasks cover all acceptance criteria (AC → T cross-ref)

## Execution rules

- Follow tasks.md order and dependencies. Parallelize only `[P]` tasks that share no files/state (isolated worktrees when available).
- `contracts/` are the source of truth for APIs. Missing/inconsistent contract → STOP and report; never improvise an API.
- spec×plan conflict → STOP and report. Ambiguity → re-read spec/plan before assuming.
- **Minimal-code ladder** (ponytail, binding) before writing any code: needs to exist? → already in codebase? → stdlib? → platform feature? → installed dep? → one-liner? → only then a minimal implementation. Reuse beats rewrite; never add a dependency a one-liner replaces.
- **TDD per task** (skill `tdd`): failing test → minimal code → green → refactor. No production code without a failing test first.
- **Impact check per task group**: `code-review-graph update --brief` — the blast-radius panel lists affected callers/dependents/tests; verify them before moving on (structural queries via the code-review-graph MCP instead of file dumps).
- **One commit per task**: `feat: T013 create obligations endpoint`. Maintenance: `fix(auth): expired token [BUG-007]`.
- tasks.md: the only allowed edit is completion status `[ ]` → `[X]`. Never edit descriptions, order, deps or scope (converge appends tasks from the spec side).
- On any failure (skill `systematic-debugging`): find root cause before fixing; no workaround patches. Stop the failing dependency line; independent `[P]` work may finish.
- Before marking `[X]` or answering a handoff question (skill `verification-before-done`): fresh evidence — run the tests/build, don't claim from memory.

## Failure / gap reporting

Report in the handoff.md Q-table ("Questions raised during implementation"): task ID + file + error summary. If the failure reveals a SPEC gap (not an implementation bug), return to spec phase — never patch spec artifacts from the implement side.

## Definition of Done

- [ ] All tasks `[X]` · tests green, including the AC-covering test tasks · build clean
- [ ] constitution respected · contracts honored exactly · commits reference task IDs
- [ ] GATE C review done (`/speckit-review`: OCR delegate pass + reviewer subagents); critical/high findings fixed or logged as Q-IDs
- [ ] No edits to `specs/` or `.specify/memory/` beyond `[X]` marks and the Q-table

Then run the drift audit: `/speckit-converge`, looping implement→converge until converged (command missing → `scripts/setup.ps1` upgrades Spec Kit).

## Maintenance loops

Audit loops live in `.claude/skills/loop-*/SKILL.md` (plain-markdown instructions any agent can follow); logs in `audits/`. Same protocol always: log the finding first → failing test → minimal fix → one commit per finding with its ID. Orchestrated parallel run: `.claude/skills/audit-orchestrator/SKILL.md` (discovery parallel, fixes serialized per module).

## Secrets — hard rule

Never hardcode credentials, tokens, keys, connection strings in code, commits, logs or examples. Use env vars / secret manager; the names come from spec/plan. This applies to every versioned artifact.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

Graph-first: for structural questions use the code-review-graph MCP BEFORE Grep/Glob/Read. Key tools: `semantic_search_nodes_tool` (find symbols) · `query_graph_tool` (callers_of/callees_of/imports_of/tests_for) · `get_impact_radius_tool` (blast radius) · `detect_changes_tool` + `get_review_context_tool` (review) · `get_architecture_overview_tool`. Graph auto-updates via hooks. Detail on demand: skills `explore-codebase`, `review-changes`, `refactor-safely`, `debug-issue`. Fall back to Grep/Glob/Read only when the graph doesn't cover it.
