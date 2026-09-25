---
name: "quality-protocols"
description: "Binding implementation discipline in one place: TDD (no production code without a failing test), systematic debugging (root cause before any fix) and verification before done (fresh evidence before any [X] or 'done'). Applies during /speckit-implement and every /audit fix."
compatibility: "Any project with a test suite (commands in PROJECT-COMMANDS.md)"
metadata:
  author: "template"
  inspired-by: "obra/superpowers (MIT): test-driven-development, systematic-debugging, verification-before-completion"
user-invocable: true
disable-model-invocation: false
---

# Quality protocols (binding)

Three iron rules. Each exists because breaking it is the most common source of rework.

## 1. TDD: no production code without a failing test that demands it

Per task (Txxx):

1. **Red**: smallest test expressing the task's acceptance criterion (use the AC scenario from spec.md). Run it. It MUST fail; if it passes, the test is wrong or the behavior exists. Investigate before writing code.
2. **Green**: the MINIMUM code to pass (minimal-code ladder, `docs/padroes/principios.md`). Don't generalize beyond the test.
3. **Refactor**: with tests green, zero behavior change.
4. Full suite (regression), not just the new test.
5. Commit test + implementation together: `feat: T013 <description>`.

Good tests: behavior through the public interface; one scenario per test with the scenario in the name ("inactive user login is rejected"); deterministic (no uncontrolled network, clock or random); cover the AC's error path. In FGR projects: one integration test per write action and per authorization rule (`docs/padroes/backend/07-testes.md`); one Playwright spec per screen plus a line in `_visual.spec.ts` (`docs/padroes/frontend/08-testes-e-capturas.md`).

Forbidden: implementation first with back-filled tests; weakening or deleting a failing test to make the build pass; marking `[X]` with any test red.

## 2. Systematic debugging: no fix without a root cause

On any test, build or runtime failure:

1. **Reproduce**: minimal and deterministic, ideally a failing test. Can't reproduce? Gather evidence until you can. Never fix what you can't reproduce.
2. **Trace to root cause**: follow the failure UP the causal chain to where the bad value or state originates. Read the actual code path; don't guess from the message. Ask "why" until the answer is a decision in code, not another symptom.
3. **Pattern check**: same root cause elsewhere (copy-pasted logic, sibling modules, other callers)? List all sites before fixing one.
4. **Hypothesis, then evidence**: state what you expect to observe if the hypothesis holds; verify it BEFORE writing the fix.
5. **Minimal fix at the origin**, plus the regression test (rule 1). Sibling sites in the same commit only if same root cause.
6. **Verify**: repro passes, full suite green.

Three failed attempts on the same bug = STOP. The problem is your model of the system: re-read spec, plan and contracts, question the architecture assumption, or raise a possible spec gap in the handoff Q-table.

Forbidden: catch-and-swallow, retries, sleeps or condition tweaks that hide a symptom; two unrelated bugs in one commit; "works now, don't know why".

## 3. Verification before done: no claim without fresh evidence

Before marking `[X]`, declaring a gate passed, answering a handoff question, or saying something works:

1. **Run it now**: tests, build, the actual command or endpoint. Output from before your last edit is stale.
2. **Read the output**: "tests passed" means you saw N passed, 0 failed, and N is the number you expect. A filtered run of 3 proves nothing about the suite.
3. **Verify the claim, not the neighborhood**: "returns 404 for missing ID" is proven by calling it with a missing ID.
4. **Record one line of evidence**: command + result (task note, handoff answer or audit log).

Failure at any step = NOT done. Go to rule 2 and report the actual state with the failure output instead of softening the claim ("mostly working", "should work now").
