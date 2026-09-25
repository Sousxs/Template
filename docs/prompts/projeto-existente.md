# Prompt: aplicar o template em um projeto existente (brownfield)

Pré-requisitos (uma vez): copiar para a raiz do projeto os arquivos do template que ele não tem (`CLAUDE.md`, `AGENTS.md`, `PROJECT-COMMANDS.md`, `.claude/`, `.specify/`, `.mcp.json`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/workflows/`, `docs/`, `scripts/`, `audits/`, `repomix.config.json`), sem sobrescrever README, `.gitignore` nem código. Rodar `scripts/setup.ps1`. Commitar essa cópia como `chore: adota template FGR <versão>`. Abra o Claude Code na raiz e cole o prompt abaixo preenchido.

---

```text
Este é um projeto existente que acabou de receber o template FGR (CLAUDE.md, AGENTS.md, docs/padroes/). O objetivo é adotar a esteira e medir a distância até o handbook SEM quebrar o que funciona. Leia antes de agir: CLAUDE.md, AGENTS.md, docs/brownfield.md e docs/padroes/principios.md.

## Dados do projeto

- Nome do sistema: <NOME> (namespace atual: <FGR.X ou outro>)
- Este repositório é: <api | app | monorepo com ambos>
- Stack real hoje: <.NET versão / React versão / outras libs relevantes>
- Em produção: <sim | não>. Módulos e integrações que NÃO podem quebrar: <lista>
- Autenticação atual: <descrição>. Permissões: <claim | tabelas | nenhuma>
- Suíte de testes: <existe? cobre o quê?>
- Comandos de build/teste/lint que funcionam hoje: <lista ou "descubra">

## O que fazer, nesta ordem

1. PROJECT-COMMANDS.md com os comandos reais; rode cada um e registre o resultado (baseline). Falha pré-existente é finding, não bloqueio.
2. scripts/onboard-brownfield.ps1 para gerar o snapshot. Daqui em diante leia o snapshot e o code-review-graph, não varra src/.
3. /audit full em modo descoberta (só logs, nenhuma mudança de código). Em seguida /audit consistency com foco em docs/padroes/: liste cada desvio do handbook (pastas, camadas, nomes, contratos, tema, testes) com esforço S/M/L e consolide em CONVENTIONS.md. Cruze com docs/padroes/recomendacoes.md e marque quais itens "Existente" se aplicam.
4. /speckit-constitution: preencher "Este sistema" com os dados acima e, obrigatoriamente, a lista de módulos/integrações que não podem quebrar e o modelo de persistência das specs (Living Spec). Ratificar.
5. Me apresente um plano de convergência ao handbook em ondas: onda 1 = itens de custo baixo e risco zero (segredos fora do repo, .env.example, ESLint max-warnings 0, health check, `AddActivableQueryFilter`, tokens de cor); onda 2 = esforço M; onda 3 = mudanças estruturais (só com feature que as justifique). Cada onda vira uma feature pela esteira (scripts/new-feature.ps1 + spec/plan/tasks), nunca refactor solto.
6. Só depois da minha aprovação do plano: implementar a onda 1 via /speckit-implement com quality-protocols (teste antes, um commit por task), GATE C com /speckit-review e /speckit-converge ao final.
7. Novas entidades e telas a partir de agora nascem com /fgr-feature; código legado só é migrado quando uma feature o toca.

## Regras

- Nada de refactor fora de log: todo ajuste sai de um finding em audits/ ou de uma task em specs/.
- Zero mudança de comportamento nas ondas 1 e 2; suíte verde antes e depois de cada commit.
- Sem `deprecated/` novo; o que já existe entra no log de dead-code.
- Segredos encontrados no repositório: finding CRITICAL em SEC-LOG, remova do código, nunca copie o valor para o log.
- Pare e pergunte se um item do handbook conflitar com algo em produção.

Comece pelo passo 1 e me mostre o baseline antes de seguir.
```
