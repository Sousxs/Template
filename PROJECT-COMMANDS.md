# PROJECT-COMMANDS.md — canonical project commands

> Fill once; every agent (Claude Code, Antigravity, Cursor, opencode) and every audit loop reads from here instead of burning turns rediscovering commands. `/loop-docs` validates this file against reality.

| Area | Build | Test | Test + coverage | Lint | Dev/Run |
|------|-------|------|-----------------|------|---------|
| Backend | `<command>` | `<command>` | `<command>` | `<command>` | `<command>` |
| Frontend | `<command>` | `<command>` | `<command>` | `<command>` | `<command>` |

## Notes

- Team OS: Windows (PowerShell). If a command differs on Linux/CI, record both forms.
- Commands needing local services (db, docker): note the prerequisite on the row.
- Never put secrets here — env var names only (e.g. `${DATABASE_URL}`).
