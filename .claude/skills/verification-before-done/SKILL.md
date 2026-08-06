---
name: "verification-before-done"
description: "Binding evidence gate: no task marked [X], no 'done' claim, no handoff answer without fresh verification evidence from actually running the thing. Applies before completing any task, gate or report."
compatibility: "Any project"
metadata:
  author: "template"
  inspired-by: "obra/superpowers verification-before-completion (MIT)"
user-invocable: true
disable-model-invocation: false
---

# Verification before done (binding)

**Iron rule: a completion claim without fresh evidence is a guess. Evidence expires the moment you edit anything.**

Before marking a task `[X]`, declaring a gate passed, answering a handoff question, or telling the user something works:

1. **Run it now** — the relevant tests, the build, the actual command/endpoint. Output from before your last edit is stale; re-run.
2. **Look at the output** — read the actual result, not the exit feeling. "Tests passed" means you saw N passed, 0 failed, and N is the number you expect (a filtered run of 3 tests proves nothing about the suite).
3. **Verify the claim, not the neighborhood** — if the task says "endpoint returns 404 for missing ID", call it with a missing ID; a green unrelated suite doesn't prove it.
4. **Record the evidence** — one line is enough: command + result summary (in the task note, handoff answer, or loop log).

Failure at any step → the task is NOT done. Go to `systematic-debugging`, don't soften the claim ("mostly working", "should work now") — report the actual state with the failure output.

Anti-patterns (all forbidden): claiming from memory of an earlier run · assuming a small edit "couldn't have broken anything" · skipping the full suite because the local test passed · marking `[X]` with the intention to verify later.
