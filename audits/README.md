# audits/ — audit loop logs

Each `/loop-*` skill keeps its coverage + findings log here. Logs are **versioned**: they survive sessions and let audits resume where they stopped (`/loop-bugs continue`).

| File | Loop | Content |
|------|------|---------|
| BUGFIX-LOG.md | /loop-bugs | per-module coverage, bugs with severity + commit |
| DEDUP-LOG.md | /loop-dead-code | duplication and dead code (EXTRACT/REMOVE/KEEP) |
| PERF-LOG.md | /loop-performance | bottlenecks with baseline + measured gain |
| REFACTOR-LOG.md | /loop-refactor | HIGH/MEDIUM/LOW improvements |
| SEC-LOG.md | /loop-security | vulnerabilities per surface |
| TEST-LOG.md | /loop-tests | test gaps per scenario |
| CONSISTENCY-LOG.md | /loop-consistency | pattern deviations (S/M/L) |
| UX-LOG.md | /loop-ux | UX friction per flow |
| DEPS-LOG.md | /loop-deps | dependencies and configs |
| DOCS-LOG.md | /loop-docs | stale documentation |
| AUDIT-REPORT.md | /audit-orchestrator | unified triage + consolidated report |

## Rules

- Log the finding BEFORE fixing it.
- One commit per fix, with the finding ID: `fix(auth): validate expired token [BUG-007]`.
- "Log only" items (unapproved criticals, risky majors, effort L) stay in the log as pending human decisions.
- Never record secrets or real production data here.
