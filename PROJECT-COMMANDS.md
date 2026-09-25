# PROJECT-COMMANDS.md — canonical project commands

> Pre-filled with the FGR stack (`docs/padroes/`: .NET 8 API + Vite/React app). Adjust paths to this repo once and every agent and every `/audit` loop reads from here instead of rediscovering commands. `/audit docs` validates this file against reality.

| Area | Build | Test | Test + coverage | Lint | Dev/Run |
|------|-------|------|-----------------|------|---------|
| Backend (`<sistema>-api`) | `dotnet build` | `dotnet test` | `dotnet test --collect:"XPlat Code Coverage"` | `dotnet format --verify-no-changes` | `dotnet run --project FGR.<Sistema>.Api` |
| Frontend (`<sistema>-app`) | `pnpm build` | `pnpm test` (Vitest, `core/`) · `pnpm e2e` (Playwright) | `pnpm test -- --coverage` | `pnpm lint` (`--max-warnings 0`) | `pnpm dev` |

## Other commands

| What | Command |
|------|---------|
| New migration | `dotnet ef migrations add <Nome> -p FGR.<Sistema>.Database -s FGR.<Sistema>.Api` |
| Apply migrations | `dotnet ef database update -p FGR.<Sistema>.Database -s FGR.<Sistema>.Api` |
| Vulnerable packages | `dotnet list package --vulnerable` · `pnpm audit` |
| Visual captures (update) | `pnpm e2e -- --update-snapshots _visual.spec.ts` |
| Health check | `GET /health` |

## Notes

- Team OS: Windows (PowerShell). If a command differs on Linux/CI, record both forms.
- Backend integration tests use `CustomApplicationFactory` (in-memory); tests needing SQL Server features note the prerequisite on the row (`docs/padroes/recomendacoes.md` B5).
- Frontend e2e runs against `e2e/fixtures/mock-api.ts`; no backend required.
- Never put secrets here: env var names only (`${ConnectionStrings__Default}`, `${VITE_API_URL}`).
