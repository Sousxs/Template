# Template — Esteira SDD Multi-Agente

Template para projetos novos e em andamento com **Spec-Driven Development** (GitHub Spec Kit) operado por agentes de código (Claude Code, Antigravity, Cursor, opencode), com foco em: estrutura de código, **economia de tokens**, eliminação de retrabalho, assertividade e CI/CD.

## Como funciona (1 parágrafo)

Toda feature passa pela esteira: `constitution → specify → clarify → checklist → plan → GATE A → tasks → analyze → handoff (GATE B) → implement → GATE C → converge`. Os **gates** são o antídoto do retrabalho: A ataca o plano antes de gastar tokens de implementação, B só aprova o handoff quando o script de rastreabilidade passa, C revisa o código antes do "pronto". Qualquer agente implementa sob o mesmo contrato (`AGENTS.md`); o Claude Code também roda a esteira inteira sozinho (`CLAUDE.md`).

## 3 comandos

```powershell
scripts/setup.ps1                       # 1x por máquina/repo — instala TODA a toolchain (repomix, OCR, Spec Kit atual)
scripts/new-feature.ps1 "descrição"     # inicia feature: branch NNN-nome + specs/ + snapshot
scripts/onboard-brownfield.ps1          # projeto existente: snapshot + varredura OCR antes da constitution
```

## Mapa do repositório

| Caminho | O quê |
|---------|-------|
| `CLAUDE.md` / `AGENTS.md` | contratos dos agentes (esteira completa / contrato universal) |
| `PROJECT-COMMANDS.md` | build/teste/lint canônicos — **preencha primeiro** |
| `specs/NNN-nome/` | spec, plan, tasks, contracts, checklists por feature |
| `.specify/` | templates, scripts (inclui `check-traceability.ps1`), memória (constitution, handoff) |
| `.claude/skills/` | pipeline speckit-*, gates (`speckit-review`, `speckit-handoff`), qualidade (`tdd`, `systematic-debugging`, `verification-before-done`), loops de auditoria (`loop-*`, `audit-orchestrator`) |
| `.claude/agents/` | subagentes revisores read-only (architect, qa, code, security) |
| `audits/` | logs versionados dos loops de auditoria |
| `.github/workflows/` | CI: `@claude` interativo, gate de rastreabilidade, review OCR |
| `.mcp.json` | MCPs padrão: repomix + code-review-graph (sem chaves); opcionais em `.mcp.json.example` |
| `docs/` | setup, brownfield, catálogo de packs opcionais |

## Loops de auditoria (manutenção contínua)

`/loop-bugs`, `/loop-dead-code`, `/loop-performance`, `/loop-refactor`, `/loop-security`, `/loop-tests`, `/loop-consistency`, `/loop-ux`, `/loop-deps`, `/loop-docs` — cada um com log de cobertura em `audits/`, correção com teste e commit atômico. `/audit-orchestrator` roda vários em paralelo (descoberta paralela, correção serializada por módulo).

## Economia de tokens (as regras que pagam o template)

1. Contexto do código: perguntas estruturais ("quem chama isso?") vão pro **code-review-graph** (grafo AST via MCP, ~65x menos tokens por consulta); contexto amplo/brownfield vem do **snapshot repomix comprimido** (~70% menor) — nunca despejar diretórios.
2. `CLAUDE.md`/`AGENTS.md` enxutos; procedimento vive em skills carregadas **sob demanda**.
3. Validação **determinística antes de LLM**: `check-traceability.ps1`, hooks e CI fazem de graça o que revisor gastaria tokens conferindo.
4. Revisores rodam em **subagentes isolados** (corpo do prompt não polui a sessão principal) e são read-only.
5. CI com teto: sem re-run por push (`synchronize`), `--max-turns 15`, severidade mínima no OCR, auth por assinatura (OAuth token).
6. Código mínimo por padrão (**ponytail**, vinculante): antes de escrever qualquer código — precisa existir? já existe no repo? stdlib? plataforma? dependência instalada? one-liner? Só então implementação mínima.
7. Medição: `npx ccusage@latest` — estabeleça baseline por feature.

## Docs

- `docs/setup.md` — pré-requisitos, segredos de CI (nomes), upgrade do Spec Kit
- `docs/brownfield.md` — roteiro completo para projeto existente
- `docs/skill-catalog.md` — packs opcionais (UI/design, diagramas, review cross-model, MCPs) — **nunca pré-instalados**
