---
name: "loop-dead-code"
description: "Loop 02 — Redundancy and dead-code elimination: per-module sweep, classify EXTRACT/REMOVE/KEEP-JUSTIFIED, isolated commits. Invoke only on explicit user request or via /audit-orchestrator."
argument-hint: "Optional: dir/module to focus, or 'continue'"
compatibility: "Any project with tests. Logs in audits/"
metadata:
  author: "user-loops"
  log: "audits/DEDUP-LOG.md"
user-invocable: true
disable-model-invocation: false
---

# Redundancy and dead-code elimination loop

> Coverage log: `audits/DEDUP-LOG.md`. Commands: `PROJECT-COMMANDS.md`.

## User Input

```text
$ARGUMENTS
```

Repeat the cycle until ONE full iteration finds no new redundancy:

1. Pick a dir/module not yet swept this session (track coverage in the log).
2. Look for: duplicate or near-identical functions; repeated magic constants/strings; dead code (never-called functions, unused imports, orphan routes, obsolete feature flags); logic copied across layers (frontend re-implementing backend validation divergently); components/utils reinventing something the project already has.
3. Classify each finding in the log: EXTRACT (unify into shared util/component), REMOVE (proven dead), or KEEP-JUSTIFIED (intentional duplication — document why).
4. Apply EXTRACT and REMOVE one at a time: refactor → run tests → verify all usage sites → isolated commit `refactor(<module>): <description> [DEDUP-<ID>]`. Never batch removals into one commit.
5. When everything is covered: build + tests + bundle/size analysis (if applicable); log the reduction (lines removed, duplications eliminated).
6. Stop only when: all modules swept, no EXTRACT/REMOVE pending, tests green.
