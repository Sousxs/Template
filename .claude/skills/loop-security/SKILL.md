---
name: "loop-security"
description: "Loop 05 — Security audit: surfaces (API, auth, uploads, deps), severity with exploitation scenario, fix proven by a test. Invoke only on explicit user request or via /audit-orchestrator."
argument-hint: "Optional: surface to focus (auth, uploads...), or 'continue'"
compatibility: "Any project. Logs in audits/"
metadata:
  author: "user-loops"
  log: "audits/SEC-LOG.md"
user-invocable: true
disable-model-invocation: false
---

# Security audit loop

> Coverage log: `audits/SEC-LOG.md`. Commands: `PROJECT-COMMANDS.md`.
> Never put real secrets or production data in the versioned log — describe scenarios without exposing values (constitution secrets rule).

## User Input

```text
$ARGUMENTS
```

Repeat the cycle until ONE full iteration finds no new vulnerability:

1. Pick an unaudited surface: API routes, forms, uploads, authn/authz, queries, env vars, dependencies.
2. Check systematically: unvalidated/unsanitized input; SQL built by concatenation; endpoints missing permission checks (IDOR — does swapping the URL ID expose another user's data?); hardcoded/committed secrets; over-permissive CORS; sensitive data in logs; dependencies with known CVEs (npm audit / pip-audit); tokens without expiry; error messages leaking internals.
3. Log each finding: severity CRITICAL/HIGH/MEDIUM/LOW + one-sentence exploitation scenario.
4. CRITICAL and HIGH: fix immediately, one at a time, with a test proving the attack no longer works → commit `fix(security): <description> [SEC-<ID>]`. MEDIUM: after criticals. LOW: log only.
5. After all surfaces: run npm audit / pip-audit / security lint; treat new findings as step 3 items.
6. Stop only when: all surfaces audited, no CRITICAL/HIGH/MEDIUM pending, dependency audit clean (or exceptions justified in the log).
