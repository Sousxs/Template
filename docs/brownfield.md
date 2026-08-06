# Brownfield — adoção em projeto existente

Objetivo: construir **verdade factual** antes de escrever qualquer spec, e manter código ↔ artefatos convergidos depois.

## Roteiro

1. **Setup**: `scripts/setup.ps1` (longpaths, Node/Python, OCR, code-review-graph, ponytail, upgrade do Spec Kit — toolchain completa por padrão).
2. **Snapshot**: `scripts/onboard-brownfield.ps1` — gera `.specify/memory/codebase-snapshot.xml` (repomix comprimido ~70%, Secretlint ativo, arquivos "quentes" primeiro). As fases de spec/plan **leem o snapshot** (grep/MCP), nunca varrem `src/`.
3. **Varredura**: `ocr scan --path src/` — auditoria de arquivo inteiro, sem precisar de histórico git (o `onboard-brownfield.ps1` instala o OCR se faltar). Complemento: `/audit-orchestrator full` — os logs de `audits/` viram evidência.
4. **Constitution**: `/speckit-constitution` documenta as restrições REAIS — módulos, integrações e padrões que **não podem quebrar** — e registra o modelo de persistência (recomendado p/ brownfield: **Living Spec** — spec.md autoritativo, plan/tasks regenerados; greenfield: Flow-Forward).
5. **Por feature**: pipeline normal. O `plan.md` captura o "estado atual do sistema" a partir do snapshot. Regenerar o snapshot por branch (`scripts/new-feature.ps1` já faz).
6. **Convergência**: após implementar, `/speckit-converge` compara código real × artefatos e adiciona tasks de convergência rastreáveis. Loop implement→converge até convergir (o `setup.ps1` já garante a versão do Spec Kit com converge).
7. **Manutenção contínua**: bugs pontuais via extensão de bug do Spec Kit (`/speckit-bug-assess|fix|test`) ou loops (`/loop-bugs` etc.) — nunca fix improvisado fora de log.

## Repos grandes demais para snapshot

Escalada documentada em `.mcp.json.example`:
- **claude-context** (busca semântica; Zilliz Cloud + chave de embedding; ~40% de redução em retrieval)
- **serena** (operações por símbolo via LSP; Python + uv)

## UI existente

Se a feature toca UI: pack **hallmark** em modo `study` extrai o DNA de design do site atual para `specs/NNN-nome/design.md` — contrato objetivo de design referenciado no plan (ver `docs/skill-catalog.md`).
