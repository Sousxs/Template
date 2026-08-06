---
name: "tdd"
description: "Binding TDD protocol for implementation tasks: no production code without a failing test first; red → green → refactor; one commit per task. Applies during /speckit-implement and loop fixes."
compatibility: "Any project with a test suite (commands in PROJECT-COMMANDS.md)"
metadata:
  author: "template"
  inspired-by: "obra/superpowers test-driven-development (MIT)"
user-invocable: true
disable-model-invocation: false
---

# TDD protocol (binding during implementation)

**Iron rule: no production code without a failing test that demands it.**

Per task (Txxx):

1. **Red** — write the smallest test expressing the task's acceptance criterion (use the AC scenario from spec.md). Run it. It MUST fail — if it passes, the test is wrong or the behavior already exists; investigate before writing code.
2. **Green** — write the MINIMUM production code to pass. Resist generalizing beyond what the test demands.
3. **Refactor** — clean up with tests green. No behavior change.
4. Run the full suite (regression), not just the new test.
5. Commit: test + implementation together, `feat: T013 <description>`.

Good tests:
- Test behavior through the public interface, not implementation details (refactors shouldn't break them).
- One scenario per test; the name states the scenario ("inactive user login is rejected").
- Deterministic: no real network/clock/random without control; failures must reproduce.
- Cover the AC's error path, not just the happy path.

Forbidden:
- Writing implementation first and back-filling tests.
- Weakening/deleting a failing test to make the build pass — a failing test is information (go to `systematic-debugging`).
- Marking a task `[X]` with any test red (see `verification-before-done`).
