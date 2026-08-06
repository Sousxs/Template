---
name: "loop-refactor"
description: "Loop 04 — Code quality (continuous refactor): objective criteria, HIGH/MEDIUM/LOW priority, test before refactoring, zero behavior change. Invoke only on explicit user request or via /audit-orchestrator."
argument-hint: "Optional: module to focus, or 'continue'"
compatibility: "Any project with tests. Logs in audits/"
metadata:
  author: "user-loops"
  log: "audits/REFACTOR-LOG.md"
user-invocable: true
disable-model-invocation: false
---

# Code quality loop (continuous refactor)

> Coverage log: `audits/REFACTOR-LOG.md`. Commands: `PROJECT-COMMANDS.md`.

## User Input

```text
$ARGUMENTS
```

Repeat the cycle until ONE full iteration finds no new HIGH or MEDIUM item:

1. Pick a module not yet reviewed this session (coverage in the log).
2. Evaluate against objective criteria: functions > ~40 lines or > 3 nesting levels; vague names (data, temp, handle, aux); mixed responsibilities (validate + save + notify in one function); coupling to another module's implementation details; missing typing where the project uses typing; comments that lie about the code.
3. Log each finding with priority: HIGH (hurts maintenance today), MEDIUM (will hurt soon), LOW (cosmetic).
4. Refactor HIGH and MEDIUM one at a time: refactor without behavior change → run tests → if the spot lacks test coverage, write the test BEFORE refactoring → isolated commit `refactor(<module>): <reason> [REF-<ID>]`.
5. LOW: log only; never refactor in this session.
6. Stop only when: all modules reviewed, no HIGH/MEDIUM pending, tests green, zero behavior change (validated by the full suite).
