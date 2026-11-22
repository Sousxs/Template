---
name: "speckit-handoff"
description: "GATE B — builds/updates .specify/memory/handoff.md from the template and COMPUTES the exit criteria (traceability script, checklists, gates) instead of asserting them. Spec is 'approved' only when every check passes."
argument-hint: "Optional: feature branch name (defaults to current)"
compatibility: "Requires spec-kit structure (.specify/, specs/NNN-*)"
metadata:
  author: "template"
user-invocable: true
disable-model-invocation: false
---

# /speckit-handoff — computed handoff (GATE B)

## User Input

```text
$ARGUMENTS
```

## Steps

1. Locate the feature: current branch (or `$ARGUMENTS`), `specs/NNN-*/`.
2. **Compute** the exit criteria — run, don't assert:
   - `pwsh -NoProfile -File .specify/scripts/powershell/check-traceability.ps1 -SkipCommits` → must exit 0 (branch name, AC→test-task mapping, zero `[NEEDS CLARIFICATION]`, naive secret scan). `-SkipCommits` is correct at this gate: only spec-phase commits exist and the commit↔work-ID check belongs to GATE C/CI, where implementation commits are present.
   - `checklists/`: no open items.
   - GATE A recorded as pass in the existing handoff (if none exists yet, GATE A must run first — stop and say so).
   - constitution.md ratified (version/date present).
   - plan.md references stack, architecture and `contracts/`; every endpoint cited in spec/plan has a contract file.
3. Any check fails → list the failures, fix what belongs to the spec phase (or route to clarify), re-run. Do NOT write "approved" with a red check.
4. All green → create/update `.specify/memory/handoff.md` from `.specify/templates/handoff-template.md`:
   - **Append, never overwrite**: new row in "Revision history"; existing Q-table rows and history stay intact.
   - Fill: architecture decisions, stack, contract locations, suggested execution order (with `[P]` groups), risks, out-of-scope, gate results with evidence.
5. Set **Spec status: approved — ready for implementation**. Implementation (any agent) may now start under the AGENTS.md Definition of Ready.

## Q-table lifecycle (revisions)

When an implementer files a question/gap (Qn): answer in the same row, register a history row (v+1) with the reason, apply the spec fix (spec/plan/contracts), and re-run step 2 before re-approving. Never delete rows.
