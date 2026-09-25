---
name: "audit"
description: "Maintenance audit loops in one skill: bugs, dead-code, performance, refactor, security, tests, consistency, ux, deps, docs. One focus at a time, or none = orchestrated full run (parallel discovery, serialized fixes). Invoke only on explicit user request."
argument-hint: "<focus> [dir|continue]  ·  list 'bugs,security'  ·  empty/'full' = orchestrator"
compatibility: "Any project with build/test/lint in PROJECT-COMMANDS.md. Logs in audits/"
metadata:
  author: "template"
  report: "audits/AUDIT-REPORT.md"
user-invocable: true
disable-model-invocation: true
---

# Audit loops

Scope: maintenance, never feature work. A finding that reveals a SPEC gap also goes to the handoff.md Q-table. Loops never redesign architecture.

## User Input

```text
$ARGUMENTS
```

- `<focus>` (one of the table below) runs that loop. Optional second arg: a dir to restrict coverage, or `continue` to resume from the log.
- comma list (`bugs,security`), empty or `full` = **Orchestrator mode** (bottom of this file).

| Focus | Log | ID prefix | Commit type |
|-------|-----|-----------|-------------|
| bugs | BUGFIX-LOG.md | BUG | `fix(<module>)` |
| dead-code | DEDUP-LOG.md | DEDUP | `refactor(<module>)` |
| performance | PERF-LOG.md | PERF | `perf(<module>)` |
| refactor | REFACTOR-LOG.md | REF | `refactor(<module>)` |
| security | SEC-LOG.md | SEC | `fix(security)` |
| tests | TEST-LOG.md | TEST | `test(<module>)` |
| consistency | CONSISTENCY-LOG.md | CONS | `style(<module>)` |
| ux | UX-LOG.md | UX | `fix(ux)` |
| deps | DEPS-LOG.md | DEPS | `chore(deps)` |
| docs | DOCS-LOG.md | DOCS | `docs` |

## Common protocol (every focus)

1. **Setup**: read `PROJECT-COMMANDS.md`. Create/update `audits/<LOG>` with sections Coverage (generated NOW from the real project structure, not memory), Findings (ID / where / severity or class / status / commit), Pending human decision. Run build + tests + lint; record the baseline. Pre-existing failures are `bugs` findings.
2. **Sweep**: pick the next uncovered unit (module, surface, flow or dimension, per focus). Log every finding BEFORE touching code: evidence (`file:line` + scenario) and severity/class.
3. **Fix, one finding per commit**: failing/reproducing test first, minimal change (`quality-protocols`), full suite, commit `<type>: <description> [<PREFIX>-<ID>]`. Never batch. Desirable refactors found while fixing a bug go to REFACTOR-LOG as "evolution".
4. **Log-only** (no code change without human approval): critical/high `bugs`; major `deps`; effort-L or contract-breaking `consistency`; LOW `refactor` and `security`.
5. **Closing**: at 100% coverage run build + suite + lint and review `git diff <baseline>..HEAD` for side effects. Failures are new findings (back to 3). **Max 3 closing iterations**, then STOP and report.
6. **Report** in the log: totals per severity, worst units, recurring patterns, preventive recommendations (feed into constitution.md).

Never put real secrets or production data in a versioned log.

## Focus checklists

**bugs**: unit = module, prioritized by bug history, data/money/auth, low coverage. Trace input, validation, persistence, response. Look for empty/null, inactive or soft-deleted records, concurrency, timezone/encoding, pagination boundary, swallowed exceptions, generic catch, transaction without rollback, unclosed resources, frontend/backend contract mismatch, unsanitized input, missing authorization.

**dead-code**: unit = dir. Duplicate or near-identical functions, repeated magic constants, never-called code, unused imports, orphan routes, obsolete flags, validation re-implemented divergently across layers, utils reinventing what the project or `Base.*` already has. Classify EXTRACT / REMOVE / KEEP-JUSTIFIED (document why). Record lines removed at the end.

**performance**: unit = critical flow (hottest endpoints, heaviest queries, most-used screens). MEASURE BEFORE OPTIMIZING: nothing enters the log without a number. Suspects: N+1, unindexed or `SELECT *`, I/O in loops, sequential calls that could be parallel, no cache for stable data, unpaginated payloads, needless re-renders. Re-measure after each fix; gain under 10% with added complexity = revert, mark NOT-WORTH-IT. Before/after table at the end.

**refactor**: unit = module. Functions over ~40 lines or 3 nesting levels; vague names (data, temp, handle, aux); mixed responsibilities; coupling to another module's internals; missing typing where the project types; comments that lie. HIGH/MEDIUM fixed with zero behavior change (test first if the spot is uncovered); LOW log only.

**security**: unit = surface (routes, forms, uploads, authn/authz, queries, env, deps). Unvalidated input, concatenated SQL, missing permission checks / IDOR, committed secrets, permissive CORS, sensitive data in logs, CVEs (`npm audit`, `dotnet list package --vulnerable`), tokens without expiry, errors leaking internals. Finding = severity + one-sentence exploitation scenario. CRITICAL/HIGH fixed immediately with a test proving the attack dies.

**tests**: unit = critical module with worst coverage. If `specs/` exists, every AC without a test is an automatic gap. Test what matters (business rules, calculations, transformations, error handling, permissions), not blind %. Order: happy path, error cases, edge cases, concurrency. A test that exposes a real bug is logged under `bugs` and fixed by that protocol. Record before/after coverage of critical modules.

**consistency**: unit = dimension (naming pt/en, folder structure, response envelope and error codes, dates/timezones, user-facing messages, commit style, component style). Detect the dominant pattern, list deviations with effort S/M/L. Fix S/M; L or public-contract-breaking = proposal only. Consolidate into `CONVENTIONS.md` at repo root. In FGR projects the dominant pattern is `docs/padroes/`; deviations from it are always findings.

**ux**: unit = screen/flow. Walk it: slow network (loading?), server error (useful message?), invalid form (error on the field?), empty list (empty state?), destructive action (confirm?), silent success (feedback?), double submit (duplicate?). Fix HIGH/MEDIUM with an automated test when possible. Duplicated feedback components become a `dead-code` item.

**deps**: unit = category (prod deps, dev deps, build configs, env vars, CI, runtime versions). Majors behind, unused packages, undeclared packages, unlocked versions, stale `.env.example`, duplicated configs, broken scripts. UPDATE-SAFE / REMOVE / FIX-CONFIG applied; UPDATE-RISKY log only with changelog link + migration plan. Done = build reproducible from a clean clone.

**docs**: unit = artifact (README, setup, API docs, comments on complex code, CLAUDE.md/AGENTS.md, PROJECT-COMMANDS.md, diagrams). Confront with reality: run the documented command, call the endpoint. OUTDATED (fix) / MISSING (write) / EXCESSIVE (remove). Validate in practice before each commit.

## Orchestrator mode (empty, `full`, or a list)

Golden rule: **discovery is parallel, fixing is serialized per module.** Requires a clean working tree; note the baseline SHA in `audits/AUDIT-REPORT.md`. Skip loops that don't apply (ux without UI, tests without suite) and say so.

1. **Discovery (parallel, read-only)**: one subagent per focus, given this file restricted to steps 1 and 2 of the common protocol plus its focus checklist. Each writes ONLY its own log and returns a structured summary (counts per severity/class + top 3).
2. **Triage (you)**: unified queue in `AUDIT-REPORT.md`. Priority: SEC critical/high, BUG critical/high, BUG medium/low, TEST critical gaps, DEDUP, REF high/medium, CONS S/M, PERF, UX high/medium, DEPS safe, DOCS. Same spot flagged twice = one item under the higher-priority focus, referencing both IDs. Log-only items go to "Pending human decision".
3. **Fix**: group by module; never two items of the same module in parallel. Disjoint modules may run in parallel subagents ONLY with one worktree each; otherwise sequential. Each fix follows step 3 of the common protocol. New findings mid-fix are logged, not fixed out of queue.
4. **Closing**: step 5 of the common protocol, ideally with an independent adversarial subagent ("prove this diff broke something"). Final report: baseline vs final, fixed per focus/severity with commits, pending decisions, recurring patterns.

Brownfield: run `full` before the first `/speckit-constitution`; the logs feed the constitution's real constraints.
