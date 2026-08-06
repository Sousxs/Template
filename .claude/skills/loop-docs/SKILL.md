---
name: "loop-docs"
description: "Loop 10 — Living documentation: confront docs with real code (does setup run? do endpoints exist?), fix OUTDATED, remove EXCESSIVE. Invoke only on explicit user request or via /audit-orchestrator."
argument-hint: "Optional: artifact to focus (README, API, CLAUDE.md...), or 'continue'"
compatibility: "Any project. Logs in audits/"
metadata:
  author: "user-loops"
  log: "audits/DOCS-LOG.md"
user-invocable: true
disable-model-invocation: false
---

# Living documentation loop

> Coverage log: `audits/DOCS-LOG.md`. Commands: `PROJECT-COMMANDS.md`.

## User Input

```text
$ARGUMENTS
```

Repeat the cycle until ONE full iteration finds no new staleness:

1. Pick an unchecked documentation artifact: README, setup instructions, API/Swagger docs, comments on complex code, CLAUDE.md/AGENTS.md, diagrams.
2. Confront docs with real code: does the README setup work on a clean clone? Do documented endpoints exist and return what they claim? Do the examples run? Does CLAUDE.md reflect the current architecture?
3. Classify each gap: OUTDATED (fix), MISSING (important flow with no doc), or EXCESSIVE (doc nobody needs that will rot — remove).
4. Fix one at a time, always validating in practice (run the documented command, call the endpoint) before committing `docs: <description> [DOCS-<ID>]`.
5. Stop only when: all artifacts checked, setup validated from scratch, no critical OUTDATED/MISSING pending.
