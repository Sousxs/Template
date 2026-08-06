---
name: "loop-bugs"
description: "Loop 01 — Continuous bug discovery: module-by-module audit with coverage log, fix with a reproducing test, atomic commits. Invoke only on explicit user request or via /audit-orchestrator."
argument-hint: "Optional: module/dir to focus, or 'continue' to resume coverage"
compatibility: "Any project with build/test/lint configured. Logs in audits/"
metadata:
  author: "user-loops"
  log: "audits/BUGFIX-LOG.md"
user-invocable: true
disable-model-invocation: false
---

# Continuous bug discovery loop

> Coverage log: `audits/BUGFIX-LOG.md` (create `audits/` if missing). Commands: `PROJECT-COMMANDS.md`.
> Scope: maintenance/audit — not feature work. A bug that reveals a SPEC gap also goes into the handoff.md Q-table.

## User Input

```text
$ARGUMENTS
```

If a module/dir was given, start coverage there. If "continue", resume from the last unaudited module in the log.

## Setup (once)

1. Create/update `audits/BUGFIX-LOG.md` with three sections:
   - **Coverage**: all modules/flows, generated NOW from project structure analysis — not from memory.
   - **Bugs**: table — ID, module, severity, status, commit.
   - **High-risk pending items**.
2. Run build + tests + lint NOW; record the baseline. Pre-existing failures are bugs #1..N.

## Audit cycle (repeat per module)

3. Pick the next unaudited module, prioritizing: (a) bug history; (b) touches data/money/auth; (c) lowest test coverage.
4. Audit end to end:
   - Trace the data path (input → validation → persistence → response).
   - Edge cases: empty list, null/undefined, inactive/soft-deleted records, concurrency, timezone/encoding, pagination at the boundary.
   - Error handling: swallowed exceptions, generic catch, transactions without rollback, unclosed resources.
   - Contracts: frontend/backend mismatches (types, field names, status codes, enums).
   - Basic security: unsanitized input, predictable IDs, endpoints missing authorization.
5. Log every bug BEFORE fixing: severity (critical/high/medium/low) + evidence (file:line + reproducing scenario).

## Fix protocol (per bug)

6. Mandatory flow: diagnose → write a test that reproduces the bug and FAILS → minimal fix (no refactoring beyond necessity; desirable refactors go to `audits/REFACTOR-LOG.md` as "evolution") → test passes → full suite (regression) → atomic commit `fix(<module>): <description> [BUG-<ID>]`.
7. Critical/high severity: log with full diagnosis + fix proposal only — do NOT change code without approval.
8. A fix revealing another bug: log the new one, finish the current one first. Never two bugs in one commit.

## Convergence and stop

9. When all modules are audited, run the closing iteration: build + full suite + lint + review of the accumulated diff (`git diff <baseline>..HEAD`) for side effects.
10. Anything failing in step 9 is a new bug (back to step 5); repeat the closing afterwards.
11. **Safety limit: max 3 closing iterations.** Still failing after the 3rd → STOP and report what remains.
12. Exit criteria (all required): 100% modules audited with date · build/tests/lint green · zero open low/medium bugs · high-risk items documented with diagnosis + proposal.
13. Final report in the log: totals per severity, worst modules, recurring patterns (e.g. "5 null-check bugs in the service layer"), preventive recommendations.
