# Brownfield — adoção em projeto existente

Objetivo: construir **verdade factual** antes de escrever qualquer spec, medir a distância até o handbook (`docs/padroes/`) e manter código ↔ artefatos convergidos depois.

## Roteiro

1. **Setup**: `scripts/setup.ps1` (longpaths, Node/Python, code-review-graph, ponytail, upgrade do Spec Kit).
2. **Snapshot**: `scripts/onboard-brownfield.ps1` — gera `.specify/memory/codebase-snapshot.xml` (repomix comprimido ~70%, Secretlint ativo, arquivos "quentes" primeiro). As fases de spec/plan **leem o snapshot** (grep/MCP), nunca varrem `src/`.
3. **Auditoria**: `/audit full` (descoberta paralela, só logs) — os logs de `audits/` viram evidência. `/audit consistency` em particular mede o desvio em relação ao handbook e consolida em `CONVENTIONS.md`; as recomendações de `docs/padroes/recomendacoes.md` marcadas "Existente" entram como itens de log.
4. **Constitution**: `/speckit-constitution` preenche "Este sistema" e documenta as restrições REAIS — módulos, integrações e padrões que **não podem quebrar** — e registra o modelo de persistência (recomendado p/ brownfield: **Living Spec** — spec.md autoritativo, plan/tasks regenerados; greenfield: Flow-Forward).
5. **Por feature**: pipeline normal. O `plan.md` captura o "estado atual do sistema" a partir do snapshot e registra a conformidade com o handbook. Regenerar o snapshot por branch (`scripts/new-feature.ps1` já faz).
6. **Convergência**: após implementar, `/speckit-converge` compara código real × artefatos e adiciona tasks de convergência rastreáveis. Loop implement→converge até convergir.
7. **Manutenção contínua**: `/audit bugs` (e os demais focos) — nunca fix improvisado fora de log.

## Repos grandes demais para snapshot

Escalada documentada em `.mcp.json.example`:
- **claude-context** (busca semântica; Zilliz Cloud + chave de embedding; ~40% de redução em retrieval)
- **serena** (operações por símbolo via LSP; Python + uv)

## UI existente

Se a feature toca UI: pack **hallmark** em modo `study` extrai o DNA de design do site atual para `specs/NNN-nome/design.md` — contrato objetivo de design referenciado no plan (ver `docs/skill-catalog.md`). A identidade visual alvo continua sendo `docs/padroes/frontend/09-identidade-visual.md`.
