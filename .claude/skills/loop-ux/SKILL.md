---
name: "loop-ux"
description: "Loop 08 — UX and user-facing error handling: walk flows simulating real scenarios (errors, loading, empty states, double-click), standardize feedback components. Invoke only on explicit user request or via /audit-orchestrator."
argument-hint: "Optional: screen/flow to focus, or 'continue'"
compatibility: "Projects with a user interface. Logs in audits/"
metadata:
  author: "user-loops"
  log: "audits/UX-LOG.md"
user-invocable: true
disable-model-invocation: false
---

# UX and user-facing error handling loop

> Coverage log: `audits/UX-LOG.md`. Commands: `PROJECT-COMMANDS.md`.

## User Input

```text
$ARGUMENTS
```

Repeat the cycle until ONE full iteration finds no new friction point:

1. Pick a screen/user flow not yet walked this session.
2. Walk it simulating real scenarios: slow network (loading states?); server error (useful message or "Error 500"?); invalid form data (does the error point at the field?); empty list (empty state or blank screen?); destructive action (confirmation?); silent success (does the user know it worked?); double-click on submit (duplicate record?).
3. Log each friction: scenario → current behavior → expected behavior → priority.
4. Fix HIGH and MEDIUM one at a time: implement → test the scenario manually and with an automated test when possible → commit `fix(ux): <description> [UX-<ID>]`.
5. Standardize feedback components (toast, loading, empty state, confirm dialog) in one place — duplication found here becomes a `/loop-dead-code` item.
6. Stop only when: all flows walked, no HIGH/MEDIUM friction pending, tests green.
