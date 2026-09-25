# Backend

API em .NET 8, ASP.NET Core, EF Core sobre SQL Server, em N camadas: Controller → Service → Repository → DbContext. Sem MediatR, sem CQRS, sem agregados. Seis bibliotecas `Base.*` carregam a infraestrutura; os projetos da aplicação carregam o domínio.

| Documento | Conteúdo |
|---|---|
| [01-solution.md](01-solution.md) | Projetos, solution folders, `Directory.Build.props`, o que vai em cada `Base.*` |
| [02-camadas-e-fluxo.md](02-camadas-e-fluxo.md) | O caminho de uma requisição e os três `Execute*` do controller base |
| [03-convencoes.md](03-convencoes.md) | Entidades, rotas, DI por atributo, listagem, validação, mapeamento, erros, logs |
| [04-persistencia.md](04-persistencia.md) | DbContext, convenções globais, migrations, seeds, soft delete, auditoria |
| [05-seguranca.md](05-seguranca.md) | JWT, `[Permission]`, `IPermissionLoader`, filtros globais por perfil |
| [06-feature-completa.md](06-feature-completa.md) | Passo a passo de uma entidade nova, arquivo por arquivo |
| [07-testes.md](07-testes.md) | Unit, integration, factory, o que testar |
| [templates/](templates/) | Arquivos-modelo para copiar |
