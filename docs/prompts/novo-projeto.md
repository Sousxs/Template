# Prompt: criar um projeto novo a partir do template

Pré-requisitos (uma vez): dois repositórios vazios criados a partir do template (`<sistema>-api` e `<sistema>-app`, via "Use this template" no GitHub ou clone + novo remote), `scripts/setup.ps1` rodado na máquina. Abra o Claude Code na raiz do repositório e cole o prompt abaixo preenchido.

---

```text
Este repositório nasceu do template FGR (CLAUDE.md, AGENTS.md, docs/padroes/). Vamos criar o projeto do zero seguindo o handbook. Leia antes de agir: CLAUDE.md, AGENTS.md, docs/padroes/principios.md e docs/padroes/checklist-novo-projeto.md.

## Dados do sistema

- Nome: <NOME DO SISTEMA, curto, em português>
- Sigla para namespace: FGR.<Sigla>
- Este repositório é: <api | app>
- Autenticação: <provedor externo (qual) | emissão própria>
- Fonte das permissões: <claim de perfil | tabelas>
- Identidade visual: acento <#hex> e símbolo <descrição ou arquivo> (só para o app)
- Domínios iniciais: <lista, ex.: Catalogo, Mestres, Financeiro>
- Primeira entidade: <Entidade> no domínio <Dominio>, campos: <lista campo: tipo, obrigatório?>
- Repositório par (o outro lado): <URL do <sistema>-api ou <sistema>-app>

## O que fazer, nesta ordem

1. Preencher a seção "Este sistema" de .specify/memory/constitution.md com os dados acima e ratificar com /speckit-constitution (versão 1.0.0, data de hoje).
2. Ajustar PROJECT-COMMANDS.md para os caminhos reais deste repositório.
3. Executar a seção <Backend | Frontend> de docs/padroes/checklist-novo-projeto.md: criar a estrutura conforme docs/padroes/<backend/01-solution.md | frontend/02-estrutura.md>, marcando cada item concluído. Segredos nunca no repositório: só nomes de variáveis em .env.example / appsettings sem senha.
4. Primeira feature pela esteira: scripts/new-feature.ps1 "<Entidade>: cadastro e listagem" e depois /speckit-specify → /speckit-clarify → /speckit-checklist → /speckit-plan → /speckit-review adversarial → /speckit-tasks → /speckit-analyze → /speckit-handoff. Não implemente antes da GATE B passar.
5. Na implementação (/speckit-implement), gerar a entidade/tela com /fgr-feature <Entidade> <Dominio> <backend|frontend> e seguir quality-protocols (teste que falha antes do código, um commit por task).
6. Fechar com /speckit-review (GATE C) e /speckit-converge.
7. README do repositório com: nome do sistema, versão do handbook (docs/padroes/CHANGELOG.md), como rodar, cenário de autenticação, acento.

## Regras

- Handbook manda: qualquer desvio de docs/padroes/ para no plan.md com o PR no handbook que o autoriza. Se não houver, não desvie.
- Escada de código mínimo (principios.md §1) antes de qualquer arquivo novo.
- Nomes de negócio em português, sufixos de infraestrutura em inglês.
- Pare e pergunte se faltar dado acima; não invente autenticação, permissão nem identidade visual.

Comece pelo passo 1 e me mostre a constitution preenchida antes de seguir.
```
