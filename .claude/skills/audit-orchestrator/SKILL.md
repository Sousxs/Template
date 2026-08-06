---
name: "audit-orchestrator"
description: "Orchestrates the 10 audit loops (bugs, dead-code, performance, refactor, security, tests, consistency, ux, deps, docs) in multi-agent mode: parallel discovery, unified triage, per-module serialized fixes, consolidated report."
argument-hint: "Optional: loop list (e.g. 'bugs,security,tests'), a scope dir, or 'full'"
compatibility: "Claude Code with subagents/Workflow. Other agents: run the loops sequentially."
metadata:
  author: "template"
  report: "audits/AUDIT-REPORT.md"
user-invocable: true
disable-model-invocation: true
---

# Multi-agent audit orchestrator

Runs the audit loops in parallel with zero write conflicts. Golden rule: **discovery is parallel, fixing is serialized per module**.

## User Input

```text
$ARGUMENTS
```

- No args or `full`: run every applicable loop (skip loop-ux without a UI, loop-tests without a suite, etc. — detect and report skips).
- List (`bugs,security,tests`): run only those. A directory: restrict all loops' coverage to it.

## Prerequisites

1. Read `PROJECT-COMMANDS.md`. Missing? Discover the commands now, create the file, proceed.
2. Run build + tests + lint; record the baseline in `audits/AUDIT-REPORT.md`. Pre-existing failures are loop-bugs findings, not blockers.
3. Clean working tree (commit or stash first). Note the baseline SHA.

## Phase 1 — Discovery (PARALLEL, read-only)

Launch one subagent per loop (Workflow or Agent tool; parallel, never sequential). Each subagent:

- Receives its `.claude/skills/loop-*/SKILL.md` content as instructions, restricted to the DISCOVERY part: sweep, classify, record findings in its own `audits/*-LOG.md`.
- Is FORBIDDEN from changing code in this phase — writes only to its own log file (never another loop's log; this guarantees conflict-free parallelism).
- Returns a structured summary: findings count per severity/class + top 3 most severe.

| Loop | Log | Focus |
|------|-----|-------|
| loop-bugs | BUGFIX-LOG.md | bugs per module |
| loop-dead-code | DEDUP-LOG.md | duplication, dead code |
| loop-performance | PERF-LOG.md | measured bottlenecks |
| loop-refactor | REFACTOR-LOG.md | code quality |
| loop-security | SEC-LOG.md | vulnerabilities |
| loop-tests | TEST-LOG.md | test gaps |
| loop-consistency | CONSISTENCY-LOG.md | pattern deviations |
| loop-ux | UX-LOG.md | UX friction |
| loop-deps | DEPS-LOG.md | deps/config |
| loop-docs | DOCS-LOG.md | stale docs |

## Phase 2 — Triage (you, the orchestrator)

1. Read all updated logs; build the unified fix queue in `audits/AUDIT-REPORT.md`.
2. Priority across loops: SEC critical/high → BUG critical/high → BUG medium/low → TEST (critical gaps) → DEDUP → REFACTOR high/medium → CONS S/M → PERF → UX high/medium → DEPS safe → DOCS.
3. Cross-dedup: the same spot flagged by two loops = ONE queue item, resolved under the higher-priority loop's protocol, referencing both IDs.
4. Items the loops mark "log only" (unapproved criticals, risky majors, effort L, refactor LOW) stay OUT of the queue → "Pending human decision" section of the report.

## Phase 3 — Fix (serialized per module, parallel across modules)

- Group the queue by module/dir. Two items of the same module never run in parallel.
- Disjoint modules may be fixed in parallel by subagents ONLY with worktree isolation (one worktree per subagent, merge at the end). No worktrees → fix sequentially in queue order.
- Each fix follows its origin loop's protocol (reproducing test → minimal change → suite → atomic commit with the ID).
- A subagent discovering a NEW finding mid-fix: log it in the right loop's log, do NOT fix out of queue — it enters the next triage round.

## Phase 4 — Closing

1. Build + full suite + lint.
2. Review the accumulated diff (`git diff <baseline>..HEAD`) — ideally an independent adversarial subagent ("prove this diff broke something").
3. Failures → back to Phase 2. **Max 3 closing iterations**, then STOP and report what remains.
4. Final report in `audits/AUDIT-REPORT.md`: baseline vs final state; fixed per loop/severity with commit list; pending human decisions; recurring patterns + preventive recommendations (feed them into constitution.md).

## Spec-kit pipeline links

- Findings that reveal SPEC gaps also enter the handoff.md Q-table.
- Full audit complements the drift audit (`/speckit-converge` or analyze): converge/analyze validate artifacts↔code, loops validate code quality itself.
- Brownfield: run `full` before the first `/speckit-constitution` — logs feed the constitution's real-world constraints.
