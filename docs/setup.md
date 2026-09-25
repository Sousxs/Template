# Setup

## Pré-requisitos

- **Windows 11 + PowerShell 7** (`pwsh`). Git ≥ 2.41. Node 18+. **Python 3.10+** (code-review-graph). Para os projetos: .NET 8 SDK e pnpm (`docs/padroes/`).
- `scripts/setup.ps1` instala **toda a toolchain por padrão**: `git config core.longpaths true`, repomix/ccusage (cache), **code-review-graph** (grafo AST + MCP + blast radius; `install` + `build`), **ponytail** (plugin de código mínimo no Claude Code) e o upgrade do Spec Kit. Flags `-SkipCRG` / `-SkipSpecKitUpgrade` só para ambientes restritos.

## Upgrade do Spec Kit (parte do setup padrão)

O setup sobe o Spec Kit para a versão atual (traz `/speckit-converge` e engine de workflows com gates). Exige working tree limpo. As extensões `git` e `bug` **não** são instaladas: `scripts/new-feature.ps1` cobre a primeira e `/audit bugs` a segunda. Se o upgrade recriar `.claude/skills/speckit-taskstoissues/`, apague.

## Agentes além do Claude Code

Só o Claude Code tem skills, agents e hooks (`.claude/`). Cursor, opencode, Gemini CLI, Antigravity e Copilot leem `AGENTS.md` nativamente e seguem o mesmo contrato. Se um desses precisar de skills próprias, gere a partir de `.claude/skills/` (`specify integration add <agente>`), nunca versione cópia à mão.

## Segredos de CI (nomes, nunca valores)

| Onde | Nome | Uso |
|------|------|-----|
| Secret | `CLAUDE_CODE_OAUTH_TOKEN` | `claude.yml` + `spec-gate.yml` — gere com `claude setup-token` (custo fixo da assinatura Pro/Max) |
| Secret | `ANTHROPIC_API_KEY` | alternativa por token de API |

`crg-review.yml` usa o `GITHUB_TOKEN` embutido. GitHub App do Claude: `claude /install-github-app` (precisa de admin no repo).

## Controle de custo do CI

- `spec-gate.yml`: job determinístico é grátis (candidato a required check); o job LLM é advisory, sem gatilho `synchronize`, `--max-turns 15`, allowlist de ferramentas.
- Medição de gasto por sessão/feature: `npx ccusage@latest`.

## MCP

`.mcp.json` traz repomix e code-review-graph (sem chaves). Opcionais em `.mcp.json.example` (context7, claude-context, github, serena) — **máximo 3 ativos**: cada servidor injeta suas definições de ferramentas em toda sessão.
