---
name: "loop-consistency"
description: "Loop 07 — Consistency and standardization: detect the dominant pattern, fix S/M deviations, consolidate into CONVENTIONS.md. Invoke only on explicit user request or via /audit-orchestrator."
argument-hint: "Optional: dimension to focus (naming, API, dates...), or 'continue'"
compatibility: "Any project. Logs in audits/"
metadata:
  author: "user-loops"
  log: "audits/CONSISTENCY-LOG.md"
user-invocable: true
disable-model-invocation: false
---

# Consistency and standardization loop

> Coverage log: `audits/CONSISTENCY-LOG.md`. Commands: `PROJECT-COMMANDS.md`.

## User Input

```text
$ARGUMENTS
```

Repeat the cycle until ONE full iteration finds no new inconsistency:

1. Pick an unchecked dimension: naming (camelCase vs snake_case, PT vs EN), folder structure, API response shape (envelope, error codes), date/timezone handling, user-facing error messages, commit style, component style.
2. Detect the dominant pattern (what most of the code already does) and list every deviation.
3. Log each deviation: expected pattern → current state → effort (S/M/L).
4. Fix S and M one at a time: adjust → run tests → verify no consumer broke (especially API contracts!) → commit `style(<module>): <description> [CONS-<ID>]`. Effort L or public-contract-breaking: log as proposal only.
5. At the end, consolidate the standards into `CONVENTIONS.md` at the repo root for future sessions and devs.
6. Stop only when: all dimensions checked, no S/M deviation pending, tests green, `CONVENTIONS.md` updated.
