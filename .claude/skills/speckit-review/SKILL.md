---
name: "speckit-review"
description: "Review stage of the SDD pipeline. Two modes: 'adversarial' (GATE A — attack spec.md+plan.md before tasks) and default (GATE C — post-implement code review; findings become Q-IDs in handoff.md). Uses read-only reviewer subagents + OCR delegate."
argument-hint: "'adversarial' for GATE A (plan attack), empty or a branch/scope for GATE C (code review)"
compatibility: "Claude Code (subagents). Other agents: follow the same steps in a fresh context."
metadata:
  author: "template"
user-invocable: true
disable-model-invocation: false
---

# /speckit-review — GATE A (adversarial) and GATE C (code review)

## User Input

```text
$ARGUMENTS
```

---

## Mode: adversarial (GATE A — run after plan, before tasks)

Goal: kill flaws while they are cheap — before any implementation token is spent.

1. Dispatch two read-only subagents IN PARALLEL over `specs/NNN-*/spec.md` + `plan.md` (+ `contracts/`, `data-model.md`):
   - `architect-reviewer`: attack design assumptions, tradeoffs, failure modes, scalability limits, missing NFRs, contract gaps, integration risks.
   - `qa-expert`: attack testability — ACs without stable IDs, untestable/ambiguous criteria, missing error-path criteria, coverage holes.
   Instruction to both: "Try to REFUTE this plan. Every objection needs a concrete failure scenario. Map each finding to FR/US/AC IDs."
2. Triage the findings yourself (discard non-reproducible objections):
   - Real ambiguity/gap in the spec → insert `[NEEDS CLARIFICATION: ...]` at the exact spot in spec.md → resolve via `/speckit-clarify`.
   - Design risk accepted → record under "Risks / attention points" in handoff.md.
   - Contract gap → fix `contracts/` now.
3. Record the gate in handoff.md ("Gates executed" table). GATE A passes only when zero `[NEEDS CLARIFICATION]` remain.

Optional cross-model second opinion: if `openai/codex-plugin-cc` is installed, also run `/codex:adversarial-review` on plan.md (see docs/skill-catalog.md). Never enable its review-gate Stop hook.

---

## Mode: default (GATE C — run after implement, before done)

1. Determine scope: the feature branch diff (`git diff main...HEAD` or the branch given in `$ARGUMENTS`).
2. Blast-radius panel (standard toolchain — missing? run `scripts/setup.ps1`): `code-review-graph detect-changes --brief` → affected callers/dependents/tests and risk score. Use it to scope the reviewers (step 4) and to list the tests that MUST run.
3. OCR pass (standard toolchain — if `ocr` is missing: `npm install -g "@alibaba-group/open-code-review"`): `ocr delegate preview --from main --to <branch>`, then `ocr delegate rule <files>` and review per its rule checklist (deterministic file/rule selection bounds token spend).
4. Dispatch two read-only subagents IN PARALLEL over the diff (scoped by the blast-radius panel):
   - `code-reviewer`: correctness vs spec/contracts, task-ID traceability of commits, error handling, regressions in the affected callers from step 2.
   - `security-auditor`: injection, authz/IDOR, secrets in code/logs, dependency risks in the diff.
5. Over-engineering pass: `/ponytail-review` (plugin missing? `claude plugin marketplace add DietrichGebert/ponytail` + `claude plugin install ponytail@ponytail`) — flags code that fails the minimal-code ladder; unnecessary abstraction/deps are findings too.
6. Verify each finding yourself before accepting (reviewers can be wrong — demand the failure scenario). Discard false positives silently.
7. File surviving critical/high findings as Q-IDs in the handoff.md Q-table (one row each: file:line, scenario, suggested fix). Medium/low → `audits/` logs of the matching loop.
8. Fixes are applied in Implement mode (or by the implementing agent), one commit per finding, referencing the Q-ID or task ID. Re-run this gate after fixes.
9. Record the gate in handoff.md. GATE C passes when zero critical/high findings remain open.
