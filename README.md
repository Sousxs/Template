# Template FGR — Esteira SDD + Padrões de projeto

Um repositório só para começar (ou adotar) qualquer projeto da FGR:

- **Esteira**: Spec-Driven Development (GitHub Spec Kit) operado por agentes de código, com gates que matam retrabalho antes de gastar token de implementação.
- **Padrão**: handbook de arquitetura em `docs/padroes/` (API .NET 8 em N camadas com `Base.*` + app React 18 com PrimeReact). Mesmas pastas, camadas, convenções e contratos em todos os projetos; templates de código prontos para copiar.

## Como funciona (1 parágrafo)

Toda feature passa pela esteira: `constitution → specify → clarify → checklist → plan → GATE A → tasks → analyze → handoff (GATE B) → implement → GATE C → converge`. A gate A ataca o plano antes de implementar, a B só aprova o handoff quando o script de rastreabilidade passa, a C revisa o código (correção + segurança + checklist do handbook) antes do "pronto". Na implementação, `/fgr-feature` gera entidade e tela a partir dos templates do handbook. Qualquer agente implementa sob o mesmo contrato (`AGENTS.md`); o Claude Code roda a esteira inteira (`CLAUDE.md`).

## Começando

```powershell
scripts/setup.ps1                       # 1x por máquina/repo: repomix, code-review-graph, ponytail, Spec Kit atual
scripts/new-feature.ps1 "descrição"     # inicia feature: branch NNN-nome + specs/ + snapshot
scripts/onboard-brownfield.ps1          # projeto existente: snapshot antes da constitution
```

| Você quer | Vá para |
|---|---|
| Criar um projeto do zero | `docs/padroes/checklist-novo-projeto.md` |
| Entender as 5 regras de código | `docs/padroes/principios.md` |
| Criar uma entidade na API | `/fgr-feature <Entidade> <Dominio> backend` ou `docs/padroes/backend/06-feature-completa.md` |
| Criar uma tela no app | `/fgr-feature <Entidade> <Dominio> frontend` ou `docs/padroes/frontend/03-feature-completa.md` |
| Saber o que a API devolve e o app espera | `docs/padroes/contratos/api-app.md` |
| Revisar um pull request | `.github/PULL_REQUEST_TEMPLATE.md` (checklist de `docs/padroes/checklist-pr.md` + gates da esteira) |
| Adotar em projeto existente | `docs/brownfield.md` |
| Manutenção (bugs, dívida, segurança...) | `/audit <foco>` ou `/audit` (orquestrado) |

## Mapa do repositório

| Caminho | O quê |
|---------|-------|
| `CLAUDE.md` / `AGENTS.md` | contratos dos agentes (esteira completa / contrato universal) |
| `PROJECT-COMMANDS.md` | build/teste/lint canônicos, pré-preenchidos com a stack FGR; ajuste os caminhos |
| `docs/padroes/` | handbook: `principios`, `backend/` (01–07 + `templates/`), `frontend/` (01–09 + `templates/`), `contratos/`, checklists, `recomendacoes`, `glossario` |
| `specs/NNN-nome/` | spec, plan, tasks, contracts, checklists por feature |
| `.specify/` | templates, scripts (inclui `check-traceability.ps1`), memória (`constitution.md` pré-preenchida com o handbook, handoff) |
| `.claude/skills/` | 14 skills: pipeline `speckit-*` (11) · `audit` (10 focos de manutenção) · `quality-protocols` (TDD, causa raiz, evidência) · `fgr-feature` (scaffold do handbook) |
| `.claude/agents/` | 2 revisores read-only: `plan-reviewer` (GATE A) · `code-reviewer` (GATE C, código + segurança) |
| `audits/` | logs versionados do `/audit` |
| `.github/workflows/` | CI: `@claude` interativo, gate de rastreabilidade, painel de risco (code-review-graph) |
| `.mcp.json` | MCPs padrão: repomix + code-review-graph (sem chaves); opcionais em `.mcp.json.example` |
| `docs/` | setup, brownfield, catálogo de packs opcionais |

## Economia de tokens (as regras que pagam o template)

1. Contexto do código: perguntas estruturais ("quem chama isso?") vão pro **code-review-graph** (grafo AST via MCP); contexto amplo/brownfield vem do **snapshot repomix comprimido**. Nunca despejar diretórios.
2. `CLAUDE.md`/`AGENTS.md` enxutos; procedimento vive em skills carregadas **sob demanda**. Só o Claude Code tem skills; os demais agentes leem `AGENTS.md`.
3. Validação **determinística antes de LLM**: `check-traceability.ps1`, hooks e CI fazem de graça o que revisor gastaria tokens conferindo.
4. Revisores rodam em **subagentes isolados** e são read-only.
5. CI com teto: sem re-run por push (`synchronize`), `--max-turns 15`, auth por assinatura (OAuth token).
6. Código mínimo por padrão (**ponytail**, vinculante): `docs/padroes/principios.md` §1.
7. Medição: `npx ccusage@latest`; estabeleça baseline por feature.

## Versão do padrão

Handbook 1.0 (2026-09-24); mudanças em `docs/padroes/CHANGELOG.md`. Cada projeto declara no README qual versão segue (recomendação T3). Mudança no padrão é PR aqui primeiro, depois no código dos projetos (princípio 4).

## Docs

- `docs/setup.md` — pré-requisitos, segredos de CI (nomes), upgrade do Spec Kit
- `docs/brownfield.md` — roteiro completo para projeto existente
- `docs/skill-catalog.md` — packs opcionais (UI/design, diagramas, review cross-model, MCPs), **nunca pré-instalados**
