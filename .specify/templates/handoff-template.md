# Handoff — <feature name>

**Branch:** NNN-feature-name
**Spec status:** draft / approved — ready for implementation

## Revision history
| Version | Date       | Reason                          |
|---------|------------|---------------------------------|
| v1      | YYYY-MM-DD | Initial handoff                 |
| v2      | YYYY-MM-DD | Fix for gap reported in Q1      |

## Gates executed
| Gate | Date | Result | Evidence |
|------|------|--------|----------|
| A — adversarial plan review | | pass/fail | findings filed as [NEEDS CLARIFICATION]/risks |
| B — exit criteria + check-traceability.ps1 | | pass/fail | script output |
| C — post-implement review | | pass/fail | Q-IDs filed |

## Architecture decisions
- ...

## Stack
- Language / framework / db / key libs and versions

## API contracts
- Endpoints and contract locations (`contracts/...`)

## Suggested execution order
- Task groups and what can run in parallel [P]

## Risks / attention points
- Trade-offs, sensitive decisions, areas to handle carefully

## Out of scope (do NOT implement)
- ...

## Design DNA (optional)
- `specs/NNN-name/design.md` (e.g. hallmark study output) — objective design contract for UI work

## Questions raised during implementation
> Filled by the implementer when blocked; answered by the spec side on revision. Single findings channel — review, converge, CI results all land here.

| ID | Raised by | Question / gap                     | Answer / fix                        |
|----|-----------|------------------------------------|-------------------------------------|
| Q1 | <agent>   | Contract for endpoint X incomplete | Added field Y in contracts/...      |

## References
- spec.md, plan.md, tasks.md, contracts/
