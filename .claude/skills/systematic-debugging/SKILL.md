---
name: "systematic-debugging"
description: "Binding failure protocol: root cause before any fix; hypothesis → evidence → minimal fix; no workaround patches. Applies to any test/build/runtime failure during implementation or loops."
compatibility: "Any project"
metadata:
  author: "template"
  inspired-by: "obra/superpowers systematic-debugging (MIT)"
user-invocable: true
disable-model-invocation: false
---

# Systematic debugging (binding on any failure)

**Iron rule: no fix without a root cause. A patch that hides a symptom is rework with a delay.**

## Phases

1. **Reproduce** — get a minimal, deterministic reproduction (ideally a failing test). Can't reproduce → gather evidence (logs, inputs, env diffs) until you can. Never fix what you can't reproduce.
2. **Trace to root cause** — follow the failure UP the causal chain: where does the bad value/state originate? Read the actual code path; don't guess from the error message. Ask "why" until the answer is a decision in code, not another symptom.
3. **Pattern check** — is the same root cause present elsewhere (copy-pasted logic, sibling modules)? List all sites before fixing one.
4. **Hypothesis → evidence** — state the expected observation if the hypothesis is right; verify it (log, debugger, targeted test) BEFORE writing the fix.
5. **Minimal fix** — fix the cause at its origin, not the symptom at the surface. Add the regression test (per `tdd`). Fix sibling sites found in step 3 (same commit only if same root cause).
6. **Verify** — failing repro now passes; full suite green.

## Three-strikes rule

Three failed fix attempts on the same bug → STOP. The problem is your model of the system, not the code edit. Re-read the design (spec/plan/contracts), question the architecture assumption, or escalate in the handoff Q-table as a possible spec gap.

## Forbidden

- try/catch-and-swallow, retries, sleeps or condition tweaks to make a symptom disappear without explaining the cause.
- Fixing two unrelated bugs in one commit.
- "It works now but I don't know why" — that's not fixed; that's armed.
