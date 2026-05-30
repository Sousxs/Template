# AGENTS.md — Esteira de Implementação (Spec Kit)

> Lido pelo Antigravity (e por outros agentes compatíveis com `AGENTS.md`) no início da sessão.
> Define o papel do Antigravity dentro da esteira de Spec-Driven Development.
> A **especificação** é responsabilidade do Claude Code (ver `CLAUDE.md`).

---

## Papel e escopo

Você (Antigravity) é responsável **exclusivamente pela implementação**.

**Não faça:**
- Modificar arquivos em `specs/` ou `.specify/memory/` — *exceto* marcar conclusão de tarefas em `tasks.md` (ver regra) e preencher a tabela "Questões levantadas na implementação" do `handoff.md`
- Tomar decisões de arquitetura — siga o `plan.md`
- Adicionar, remover, reordenar ou reescrever tarefas no `tasks.md`
- Mudar a stack ou os contratos de API definidos no `plan.md`

**Faça:**
- Implementar exatamente o que está especificado
- Seguir os princípios não-negociáveis da `constitution.md`
- Marcar tarefas como concluídas conforme avança

---

## Definition of Ready (antes de começar)

Não inicie a implementação sem **todos** os itens abaixo. Se **qualquer** um falhar, **não comece**: registre o que falta na seção "Questões levantadas na implementação" do `handoff.md` e devolva para o Claude Code.

- [ ] `.specify/memory/handoff.md` existe e está na versão mais recente
- [ ] `.specify/memory/constitution.md` presente
- [ ] `spec.md` sem marcadores `[NEEDS CLARIFICATION]`
- [ ] `tasks.md` tem dependências explícitas e marcações `[P]`
- [ ] `contracts/` preenchido para todos os endpoints citados
- [ ] Existem tasks de teste cobrindo os critérios de aceitação

---

## Pré-requisitos (ordem de leitura)

1. `.specify/memory/handoff.md` — decisões, riscos e questões em aberto
2. `.specify/memory/constitution.md` — princípios não-negociáveis (inclui convenções de branch/commit e segredos)
3. `specs/NNN-feature/spec.md` — o que e porquê
4. `specs/NNN-feature/plan.md` — arquitetura, stack, contratos
5. `specs/NNN-feature/tasks.md` — ordem, dependências e `[P]`

> Só comece depois de entender os **contratos de API** (`contracts/`) e o **modelo de dados** (`data-model.md`).

---

## Execução

```bash
/speckit.implement   # executa as tarefas de tasks.md na ordem correta
```

- Siga a ordem e as **dependências** declaradas em `tasks.md`.
- Execute em paralelo apenas tarefas marcadas com `[P]` que **não** compartilham arquivos ou estado.
- Os contratos em `contracts/` são a **fonte da verdade** para as APIs.
- **Commits seguem a convenção da constitution:** `feat: T013 cria endpoint de obrigações`, `fix: T021 corrige cálculo de prazo`. Um commit aponta para a task que cumpre.

---

## Regras

- **Ambiguidade:** consulte `spec.md` e `plan.md` antes de assumir qualquer coisa.
- **Conflito entre `spec.md` e `plan.md`:** **pare e reporte.** Não decida sozinho.
- **Contrato faltando ou inconsistente:** **pare e reporte** — não improvise a API.
- **`tasks.md`:** a única alteração permitida é o status de conclusão (`[ ]` -> `[X]`), que faz parte natural do `/speckit.implement`. Nunca edite descrição, ordem, dependências ou escopo.
- **Fora de escopo:** o que estiver marcado como "não implementar" no handoff/spec fica de fora.

---

## Segurança — gestão de segredos

Regra dura:
- **Nunca** faça hardcode de segredos no código: credenciais, App IDs/Secrets, Tenant IDs, thumbprints, connection strings, tokens, chaves de API.
- Use **variável de ambiente** ou **secret manager**; leia os nomes/origens definidos na spec/plan.
- Nada de credencial em commit, log, exemplo ou comentário.

---

## Política de falha

Quando uma task quebra (teste, build ou execução):

1. **Pare imediatamente** naquela linha de dependência. Não avance para tarefas que dependem da que falhou.
2. Tarefas `[P]` independentes que já estavam em curso podem concluir; nada novo que dependa da falha deve iniciar.
3. **Reporte** na seção "Questões levantadas na implementação" do `handoff.md`: **task ID + arquivo + erro** (mensagem/stacktrace resumido).
4. Não tente "consertar a spec" nem improvisar arquitetura para contornar — isso é volta para o Claude Code.

---

## Critérios de conclusão (Definition of Done)

- [ ] Todas as tarefas de `tasks.md` marcadas como concluídas (`[X]`)
- [ ] **Testes passando** — incluindo as tasks de teste que cobrem os critérios de aceitação do `spec.md`
- [ ] Build sem erros
- [ ] Implementação em conformidade com a `constitution.md`
- [ ] Contratos de API respeitados (sem desvio do que está em `contracts/`)
- [ ] Commits seguindo a convenção `tipo: Txxx descrição`
- [ ] Nenhuma alteração em `specs/` ou `.specify/memory/` além dos `[X]` em `tasks.md` e da tabela de questões no handoff

---

## Quando parar e reportar

Pare a implementação e devolva para revisão se:
- `spec.md` e `plan.md` se contradisserem
- Uma tarefa exigir decisão de arquitetura não coberta pelo `plan.md`
- Um teste revelar um **gap real na especificação** (não apenas um bug de implementação)
- Um contrato de API estiver incompleto para implementar a tarefa

> Ao reportar, preencha a tabela "Questões levantadas na implementação" do `handoff.md` com o arquivo/seção em conflito e o que falta. O Claude Code corrige a spec, registra no histórico de revisões, responde a questão e devolve um handoff novo — fechando o ciclo entre os dois agentes.

---

## Ao concluir
Depois de bater o Definition of Done, sinalize para a **auditoria de drift pós-implementação**: o Claude Code roda `/speckit.analyze` de novo para confirmar que o código entregue não divergiu da spec/plan (ver `CLAUDE.md`). Você não modifica specs — apenas avisa que a implementação fechou.