# Glossário

| Termo | Significado |
|---|---|
| `Base.*` | Bibliotecas de infraestrutura compartilhadas, sem regra de negócio: `Base.Shared`, `Base.Repository`, `Base.Logger`, `Base.OAuth.Common`, `Base.Export`, `Base.DataDictionary` |
| `DefaultEntity` | Classe base de toda entidade: `Id long`, `Uuid Guid`, `Active bool` |
| `Uuid` | Identificador público, usado em rotas e respostas. `Id` numérico nunca sai da API |
| `Active` | Flag de soft delete. `false` = inativo, filtrado por padrão em toda consulta |
| `IDomainValidation` | Acumulador de erros de negócio por requisição; `EnsureValid()` lança |
| `UnityOfWork` | Transação e `SaveChanges` centralizados; chamado pelo controller base, nunca pelo service |
| `DataTableRequest` | Parâmetros de listagem: `page`, `size`, `sort` e filtros livres |
| Envelope de página | `{content, size, pageIndex, totalElements, totalPages}` |
| `[Permission]` | Atributo de autorização por chave `Dominio.Acao` |
| `IPermissionLoader` | Quem responde quais chaves o usuário logado tem |
| `AuditEntry` | Registro de auditoria gerado pelo interceptor do EF a cada `SaveChanges` |
| `BaseService` (app) | Classe base dos services do app: `paginate`, `get`, `create`, `update`, `remove`, `export`, `alterarStatus` |
| `useService` | Hook que resolve um service do container tsyringe |
| Trio de listagem | `<X>ListarPage`, `<X>Filter`, `<X>Table` |
| `config/` de feature | `<X>Router.tsx`, `<X>Menu.ts`, `<X>Breadcrumb.ts` |
| `PageCard` | Casca padrão de página: título, breadcrumb, conteúdo lateral do título, aviso de alterações não salvas |
| visual-shots | Capturas de tela geradas por spec do Playwright com API mockada |
