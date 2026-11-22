# audits/ — audit loop logs

Each `/audit <focus>` keeps its coverage + findings log here. Logs are **versioned**: they survive sessions and let audits resume where they stopped (`/audit bugs continue`).

| File | Focus | Content |
|------|-------|---------|
| BUGFIX-LOG.md | `/audit bugs` | per-module coverage, bugs with severity + commit |
| DEDUP-LOG.md | `/audit dead-code` | duplication and dead code (EXTRACT/REMOVE/KEEP) |
| PERF-LOG.md | `/audit performance` | bottlenecks with baseline + measured gain |
| REFACTOR-LOG.md | `/audit refactor` | HIGH/MEDIUM/LOW improvements |
| SEC-LOG.md | `/audit security` | vulnerabilities per surface |
| TEST-LOG.md | `/audit tests` | test gaps per scenario |
| CONSISTENCY-LOG.md | `/audit consistency` | pattern deviations (S/M/L) |
| UX-LOG.md | `/audit ux` | UX friction per flow |
| DEPS-LOG.md | `/audit deps` | dependencies and configs |
| DOCS-LOG.md | `/audit docs` | stale documentation |
| AUDIT-REPORT.md | `/audit` (orchestrator) | unified triage + consolidated report |

## Rules

- Log the finding BEFORE fixing it.
- One commit per fix, with the finding ID: `fix(auth): validate expired token [BUG-007]`.
- "Log only" items (unapproved criticals, risky majors, effort L) stay in the log as pending human decisions.
- Never record secrets or real production data here.
