# Setup

## Pré-requisitos

- **Windows 11 + PowerShell 7** (`pwsh`). Git ≥ 2.41. Node 18+. **Python 3.10+** (code-review-graph).
- `scripts/setup.ps1` instala **toda a toolchain por padrão**: `git config core.longpaths true`, repomix/ccusage (cache), OCR (open-code-review), **code-review-graph** (grafo AST + MCP + blast radius; `install` + `build`), **ponytail** (plugin de código mínimo no Claude Code) e o upgrade do Spec Kit. Flags `-SkipOCR` / `-SkipCRG` / `-SkipSpecKitUpgrade` só para ambientes restritos.

## Upgrade do Spec Kit (parte do setup padrão)

O template foi iniciado com Spec Kit 0.8.17. O setup sobe para a versão atual, que traz `/speckit-converge` (auditoria de drift que lê o código de verdade), engine de workflows com gates, extensão de bugs e correções de PowerShell/Windows (0.12.x). O script exige working tree limpo antes de atualizar, re-adiciona a extensão git se o upgrade a derrubar e instala a extensão bug.

## Segredos de CI (nomes, nunca valores)

| Onde | Nome | Uso |
|------|------|-----|
| Secret | `CLAUDE_CODE_OAUTH_TOKEN` | `claude.yml` + `spec-gate.yml` — gere com `claude setup-token` (custo fixo da assinatura Pro/Max) |
| Secret | `ANTHROPIC_API_KEY` | alternativa por token de API |
| Secret | `OCR_LLM_URL` / `OCR_LLM_AUTH_TOKEN` | `ocr-review.yml` |
| Var | `OCR_LLM_MODEL` / `OCR_LLM_USE_ANTHROPIC` | modelo do OCR (`true` p/ Anthropic) |

GitHub App do Claude: `claude /install-github-app` (precisa de admin no repo).

## Controle de custo do CI

- `spec-gate.yml`: job determinístico é grátis (candidato a required check); o job LLM é advisory, sem gatilho `synchronize`, `--max-turns 15`, allowlist de ferramentas.
- `ocr-review.yml`: `incremental: true`, `route_severity_below: medium`, **pine a action em uma tag de release** (está em `@main` com TODO).
- Medição de gasto por sessão/feature: `npx ccusage@latest`.

## MCP

`.mcp.json` traz só o repomix (sem chaves). Opcionais em `.mcp.json.example` (context7, claude-context, github, serena) — **máximo 3 ativos**: cada servidor injeta suas definições de ferramentas em toda sessão.
