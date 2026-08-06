---
name: "loop-deps"
description: "Loop 09 — Dependency and configuration health: safe updates applied, majors get a migration plan, reproducible build from scratch. Invoke only on explicit user request or via /audit-orchestrator."
argument-hint: "Optional: category to focus (prod, dev, env, CI...), or 'continue'"
compatibility: "Any project. Logs in audits/"
metadata:
  author: "user-loops"
  log: "audits/DEPS-LOG.md"
user-invocable: true
disable-model-invocation: false
---

# Dependency and configuration health loop

> Coverage log: `audits/DEPS-LOG.md`. Commands: `PROJECT-COMMANDS.md`.

## User Input

```text
$ARGUMENTS
```

Repeat the cycle until ONE full iteration finds no new issue:

1. Pick an unchecked category: prod dependencies, dev dependencies, build configs, env vars, Dockerfiles/CI, runtime versions.
2. Check: outdated deps (major behind?); installed-but-unused packages; used-but-undeclared packages; unlocked versions; `.env.example` stale vs the real `.env`; configs duplicated across environments; broken/obsolete package.json scripts.
3. Classify each item: UPDATE-SAFE (patch/minor), UPDATE-RISKY (major — list breaking changes), REMOVE, or FIX-CONFIG.
4. Apply UPDATE-SAFE, REMOVE and FIX-CONFIG one at a time: apply → full build + tests → commit `chore(deps): <description> [DEPS-<ID>]`. UPDATE-RISKY: log only, with changelog link + migration plan.
5. Stop only when: all categories checked, no safe item pending, build reproducible from scratch (clean clone → install → build → tests green).
