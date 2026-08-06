---
name: "loop-performance"
description: "Loop 03 — Performance optimization: measure before optimizing, one bottleneck at a time, gain recorded in %, revert what doesn't pay off. Invoke only on explicit user request or via /audit-orchestrator."
argument-hint: "Optional: flow/endpoint to focus, or 'continue'"
compatibility: "Any project with tests. Logs in audits/"
metadata:
  author: "user-loops"
  log: "audits/PERF-LOG.md"
user-invocable: true
disable-model-invocation: false
---

# Performance optimization loop

> Coverage log: `audits/PERF-LOG.md`. Commands: `PROJECT-COMMANDS.md`.

## User Input

```text
$ARGUMENTS
```

Repeat the cycle until ONE full iteration finds no new actionable bottleneck:

1. Pick a critical flow not yet measured this session. Prioritize: most-called endpoints, heaviest queries, most-used screens.
2. MEASURE BEFORE OPTIMIZING: baseline (response time, query count, payload, re-renders, memory). Nothing enters the log without a number.
3. Hunt the classic suspects: N+1 queries; unindexed SELECTs or needless `SELECT *`; I/O inside loops; sequential calls that could be parallel (Promise.all); missing cache for stable data; unpaginated payloads; needless re-renders; repeated serialization.
4. Log each bottleneck: baseline → hypothesis → proposed fix → risk. Optimize one at a time: apply → re-measure → record gain (%) → regression tests → commit `perf(<module>): <description> [PERF-<ID>]`. Gain < 10% with added complexity → revert and mark NOT-WORTH-IT.
5. After covering all critical flows: final measurement battery vs initial baselines.
6. Stop only when: all critical flows measured, no actionable bottleneck pending, tests green, before/after table complete in the log.
