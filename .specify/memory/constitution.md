# [SISTEMA] Constitution

> Pré-preenchida com o handbook FGR (`docs/padroes/`, versão em `docs/padroes/CHANGELOG.md`). Troque `[SISTEMA]`, preencha a seção "Este sistema" e ratifique com `/speckit-constitution`. O que está aqui já é regra em todo projeto FGR; a constitution só acrescenta o que é específico deste sistema.

## Core Principles

### I. Escada de código mínimo (ponytail, vinculante)
Antes de escrever qualquer código: precisa existir? já existe no repo ou em `Base.*`? stdlib faz? dependência instalada faz? cabe em uma linha? Só então a implementação mínima. A escada corre depois de entender o problema, nunca no lugar de entender. Fonte: `docs/padroes/principios.md` §1.

### II. O que nunca se simplifica
Validação na fronteira, tratamento de erro que evita perda de dado, segurança, acessibilidade básica e o que o requisito pede por escrito. Toda lógica não trivial deixa o menor teste que falhe se ela quebrar. Fonte: `principios.md` §2.

### III. Atalho deliberado fica marcado
`// ponytail: <limite>, <o que fazer quando chegar>`. O `/audit` varre esses comentários. Fonte: `principios.md` §3.

### IV. Mesma forma em todo projeto
Pastas, nomes, camadas e contratos são os de `docs/padroes/` (backend: `backend/01-solution.md` a `07-testes.md`; frontend: `frontend/01-stack.md` a `09-identidade-visual.md`; contrato API×app: `contratos/api-app.md`). Desvio exige PR no handbook primeiro, depois o código. Fonte: `principios.md` §4.

### V. Nome de negócio em português, infraestrutura em inglês
`Produto`, `ProdutoService`, `ProdutoRequest`; sufixos `Repository`, `Request`, `Response`, `Controller`, `Profile`, `Store`, `Page` em inglês. Fonte: `principios.md` §5.

### VI. Test-first e evidência (NON-NEGOTIABLE)
Skill `quality-protocols`: nenhum código de produção sem teste que falhe antes; nenhum fix sem causa raiz; nenhum `[X]` sem evidência fresca. Backend: um teste de integração por action de escrita e por regra de autorização. Frontend: um spec Playwright por tela e uma linha em `_visual.spec.ts`.

## Convenções de esteira

- Branch `NNN-nome-da-feature`. Todo commit referencia um ID: `feat: T013 ...` (pipeline), `[BUG-007]` (manutenção), `[Q3]` (finding de handoff).
- Cadeia de rastreabilidade: user story → task → test task → commit. ACs com ID estável (`AC-001`...). Verificação mecânica: `.specify/scripts/powershell/check-traceability.ps1`.
- Gates: A (revisão adversarial do plano), B (handoff computado), C (revisão de código). Definições em `AGENTS.md`.
- Segredos nunca em artefato versionado (specs, contratos, logs, workflows, código). Só nomes de variáveis de ambiente.
- Pull request segue `.github/PULL_REQUEST_TEMPLATE.md` (checklist do handbook + gates).

## Este sistema

<!-- Preencha em /speckit-constitution. Itens do docs/padroes/checklist-novo-projeto.md, seção "Antes de codar". -->

- **Nome e sigla**: `FGR.[SISTEMA]`
- **Autenticação**: [provedor externo | emissão própria] (`docs/padroes/backend/05-seguranca.md`)
- **Fonte das permissões**: [claim de perfil | tabelas]
- **Identidade visual**: acento e símbolo registrados em `frontend/09-identidade-visual.md` §3.2
- **Domínios**: [lista de pastas; cada entidade em um domínio]
- **Brownfield (se aplicável)**: módulos, integrações e padrões que NÃO podem quebrar; modelo de persistência das specs (Living Spec recomendado)

## Governance

Esta constitution prevalece sobre qualquer outra prática do repositório. Emenda exige PR com justificativa e, se mudar convenção do handbook, PR em `docs/padroes/` primeiro. Todo review (gates A e C, `/audit consistency`) verifica conformidade.

**Version**: 1.0.0 | **Ratified**: [DATA] | **Last Amended**: [DATA]
