---
name: "loop-tests"
description: "Loop 06 — Test coverage: business rules over blind %, one scenario at a time, discovered bugs go through the loop-bugs protocol. Invoke only on explicit user request or via /audit-orchestrator."
argument-hint: "Optional: module to focus, or 'continue'"
compatibility: "Project with a test suite and coverage reporting. Logs in audits/"
metadata:
  author: "user-loops"
  log: "audits/TEST-LOG.md"
user-invocable: true
disable-model-invocation: false
---

# Test coverage loop

> Coverage log: `audits/TEST-LOG.md`. Commands: `PROJECT-COMMANDS.md`.
> Spec-kit link: if `specs/` exists, the current feature's acceptance criteria are the first source of scenarios — any AC without a test is an automatic gap.

## User Input

```text
$ARGUMENTS
```

Repeat the cycle until ONE full iteration finds no uncovered critical flow:

1. Run the suite with coverage; pick the critical module with the worst coverage not yet handled this session.
2. Identify what MATTERS to test (don't chase blind %): business rules, calculations, data transformations, error handling, permissions. Skip getters/setters and trivial code.
3. Log each gap as a one-sentence scenario ("installment due on a holiday", "inactive user attempts login").
4. Write tests one scenario at a time: write → run → if the test exposes a real bug, log it in `audits/BUGFIX-LOG.md` and fix via the `/loop-bugs` protocol → commit `test(<module>): <scenario> [TEST-<ID>]`.
5. Priority order: critical-flow happy path → error cases → edge cases → concurrency.
6. Stop only when: all critical modules handled, no open business-rule gap, full suite green, before/after coverage of critical modules recorded in the log.
