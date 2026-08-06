# CLAUDE.md — Full SDD Pipeline (Spec Kit)

> Auto-loaded every session; every line costs context. Operational detail lives in skills (`.claude/skills/`), templates (`.specify/templates/`) and `docs/` — loaded on demand.
> `AGENTS.md` is the universal implementation contract (you, Antigravity, Cursor, opencode all follow it).

## Modes — pick BEFORE acting

1. **Spec** (default for new features): produce constitution/spec/plan/tasks/handoff. One feature per cycle, branch `NNN-name`. No implementation code in this phase — the handoff gate kills rework even when you implement next.
2. **Implement** — only after GATE B passes (Definition of Ready in `AGENTS.md`). Run `/speckit-implement` under the `AGENTS.md` contract: TDD per task, one commit per task (`feat: T013 ...`). **Minimal-code ladder (ponytail, binding) before writing any code:** needs to exist? → already in codebase? → stdlib? → platform feature? → installed dep? → one-liner? → only then a minimal implementation. Parallelize `[P]` groups via subagents in isolated worktrees; dependent groups run sequentially.
3. **Maintenance** — only via explicit `/loop-*` or `/audit-orchestrator`. Protocol: log finding in `audits/` first → failing test → minimal change → commit with ID (`fix(auth): expired token [BUG-007]`). Loops never redesign architecture.

Ambiguous request? New capability → Spec mode. Bug/debt in existing code → offer the right loop. Unsure → ask.

## Pipeline

```
constitution → specify → clarify* → checklist → plan → GATE A → tasks → analyze*
→ handoff GATE B → implement → GATE C → converge/audit        (* = loop until clean; mandatory)
```

- **GATE A** — adversarial plan review: `/speckit-review adversarial`. Subagents `architect-reviewer` + `qa-expert` attack assumptions, tradeoffs, gaps. Findings → `[NEEDS CLARIFICATION]` or handoff risks. Cheapest place to kill rework.
- **GATE B** — computed handoff: `/speckit-handoff` validates exit criteria mechanically (runs `check-traceability.ps1`) before marking the spec approved.
- **GATE C** — post-implement review: `/speckit-review`. Blast-radius panel (`code-review-graph detect-changes --brief`) + OCR delegate pass + subagents `code-reviewer` + `security-auditor` + `/ponytail-review` (over-engineering). Critical/high findings become Q-IDs in handoff before any "done".
- **Drift audit**: `/speckit-converge` — reads real code, appends convergence tasks to tasks.md; loop implement→converge until converged. Command missing → run `scripts/setup.ps1` once (Spec Kit upgrade); only then, as contingency, `analyze` + `/audit-orchestrator`.
- **Brownfield**: run `scripts/onboard-brownfield.ps1` before the first constitution. Runbook: `docs/brownfield.md`.

## Multi-agent rules

- Research/discovery (clarify, research.md, code sweeps): parallel subagents; each returns a structured summary, never file dumps.
- Implementation: `[P]` groups in parallel via worktrees; audit fixes serialized per module (`/audit-orchestrator`).
- Reviewers in `.claude/agents/` are read-only (Read/Grep/Glob; `code-reviewer` also gets Bash for read-only git/test commands) — a reviewer never edits code; findings map to FR/US/T/AC IDs.
- Golden rule: two agents never write the same file in the same phase.

## Token economy

- Canonical commands: `PROJECT-COMMANDS.md` — never rediscover build/test/lint; record new findings there.
- Code context: structural questions ("what calls this / what breaks if I change it") go to the **code-review-graph MCP** (impact radius, review context — graph queries instead of file reads). Whole-repo/brownfield context: grep the repomix snapshot (`.specify/memory/codebase-snapshot.xml`; regenerate via `new-codebase-snapshot.ps1`). Never dump directories; Grep/Glob before Read; read slices.
- Don't re-derive: `specs/`, `audits/`, `.specify/memory/` are source of truth.
- Subagents return conclusions, not transcripts. Measure spend per feature: `npx ccusage@latest`.

## Conventions (pin in constitution.md)

- Branch `NNN-feature-name`. Every commit references a work ID: `feat: T013 ...` (pipeline), `[BUG-007]` (maintenance) or `[Q3]` (handoff-finding fix).
- Traceability chain: user story → task → test task → commit. Acceptance criteria carry stable IDs (`AC-001`…). Mechanical check: `.specify/scripts/powershell/check-traceability.ps1`.
- Every AC gets ≥ 1 test task in tasks.md (AC → T cross-ref).

## Secrets — hard rule

Never put credentials, tokens, keys, connection strings or sensitive IDs in ANY versioned artifact (specs, contracts, logs, workflows, code). Reference env vars (`${AZURE_CLIENT_SECRET}`) or a secret manager — name/origin only, never values.

## GATE B exit criteria

constitution ratified (version/date) · spec covers all stories/ACs, zero `[NEEDS CLARIFICATION]` · every AC has a test task · checklists clear · plan has stack/architecture/contracts (+ research, data-model) · tasks.md has explicit deps + `[P]` · analyze clean of criticals · GATE A done · `check-traceability.ps1` green · handoff.md updated.

**Blockers:** missing/incomplete contract for a cited endpoint · task without a requirement · spec×plan conflict · requirement without AC · AC without test task. **Non-blockers:** naming, formatting, style.

## Artifact map

```
CLAUDE.md / AGENTS.md      # this contract / universal implementation contract
PROJECT-COMMANDS.md        # canonical build/test/lint · CONVENTIONS.md (from /loop-consistency)
.specify/memory/           # constitution.md · handoff.md · codebase-snapshot.xml (generated, gitignored)
specs/NNN-name/            # spec | plan | research | data-model | contracts/ | checklists/ | tasks
audits/                    # loop logs (audits/README.md)
.claude/agents|skills/     # read-only reviewers · speckit-* · loop-* · tdd/systematic-debugging/verification
docs/                      # setup · brownfield · skill-catalog (pt-BR, human-facing, never auto-loaded)
scripts/                   # setup.ps1 · new-feature.ps1 · onboard-brownfield.ps1
```

## Handoff

Template: `.specify/templates/handoff-template.md`. Versioned, never overwritten: each correction = a history row + an answer in the Q-table. The Q-table is the single findings channel (review, converge, CI, other implementers).

## General

- First version of any artifact is a draft — iterate before closing.
- Quality skills `tdd`, `systematic-debugging`, `verification-before-done` are binding during implementation (see `AGENTS.md`).
- Optional packs (UI, diagrams, cross-model review): `docs/skill-catalog.md` — never preinstalled.

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

Graph-first: for structural questions use the code-review-graph MCP BEFORE Grep/Glob/Read. Key tools: `semantic_search_nodes_tool` (find symbols) · `query_graph_tool` (callers_of/callees_of/imports_of/tests_for) · `get_impact_radius_tool` (blast radius) · `detect_changes_tool` + `get_review_context_tool` (review) · `get_architecture_overview_tool`. Graph auto-updates via hooks. Detail on demand: skills `explore-codebase`, `review-changes`, `refactor-safely`, `debug-issue`. Fall back to Grep/Glob/Read only when the graph doesn't cover it.
