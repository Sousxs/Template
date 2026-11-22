# Checklist de pull request

Fonte do `.github/PULL_REQUEST_TEMPLATE.md` do template (que soma os gates da esteira). Mudou aqui, mude lá.

## O que muda

- Resumo em duas frases: o que e por quê.
- Issue ou task relacionada.

## Backend

- [ ] Toda action passa por `ExecuteAsync`, `ExecuteWithSaveChangesAsync` ou `ExecuteWithTransactionAsync`.
- [ ] `[Permission]` com constante de `Permissions.cs`; chave nova também em `PermissionEnum` do app.
- [ ] Regras no `Validator`; `Request` sem DataAnnotations.
- [ ] Entidade nova herda `DefaultEntity`, implementa `IAuditable`, navegações com `[AuditIgnore]`.
- [ ] Migration com nome descritivo e `Down` funcional.
- [ ] Um teste de integração por action de escrita e por regra de autorização nova.
- [ ] Nenhum segredo, nenhum `Console.WriteLine`, nenhum `SaveChanges` fora do `UnityOfWork`.

## Frontend

- [ ] Textos no `translation.json`; nenhum literal em componente.
- [ ] Botão e coluna de ação sob `HasPermission`; rota sob `PermissionRouter`.
- [ ] Formulário com `ClassValidatorResolver` e `formHandleError`.
- [ ] Query key exportada e invalidada na mutation.
- [ ] Cores por token; nenhum hex em `.tsx`.
- [ ] Spec Playwright da tela; linha em `_visual.spec.ts` e captura anexada ao PR.
- [ ] ESLint sem warnings.

## Dívida

- [ ] Atalhos deliberados marcados com `// ponytail: <limite>, <caminho>`.
- [ ] Nada em `deprecated/`.
