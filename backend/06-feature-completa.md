# Uma feature completa: entidade `Produto` no domínio `Catalogo`

Ordem de criação. Cada passo tem um template em [templates/](templates/).

| # | Arquivo | Template |
|---|---|---|
| 1 | `Entities/Catalogo/Produto.cs` | [Entity.cs](templates/Entity.cs) |
| 2 | `Entities/Catalogo/Enum/StatusProduto.cs` | enum simples |
| 3 | `Database/AppDbContext.cs` → `ConfigurarCatalogo(builder)` | [DbContextConfigurar.cs](templates/DbContextConfigurar.cs) |
| 4 | Migration: `dotnet ef migrations add CriaProduto -p Database -s Api` | |
| 5 | `Repository.Interface/Catalogo/IProdutoRepository.cs` | [IRepository.cs](templates/IRepository.cs) |
| 6 | `Repository/Catalogo/ProdutoRepository.cs` | [Repository.cs](templates/Repository.cs) |
| 7 | `Service.Models/Catalogo/ProdutoRequest.cs`, `ProdutoResponse.cs`, `ProdutoFilterRequest.cs` | [Request.cs](templates/Request.cs), [Response.cs](templates/Response.cs), [FilterRequest.cs](templates/FilterRequest.cs) |
| 8 | `Service.Models/Mappers/CatalogoProfile.cs` | [Profile.cs](templates/Profile.cs) |
| 9 | `Service.Interface/Catalogo/IProdutoService.cs` | [IService.cs](templates/IService.cs) |
| 10 | `Service/Catalogo/ProdutoValidator.cs` | [Validator.cs](templates/Validator.cs) |
| 11 | `Service/Catalogo/ProdutoService.cs` | [Service.cs](templates/Service.cs) |
| 12 | `Api/Common/Permissions.cs` → `Permissions.Produto` | [Permissions.cs](templates/Permissions.cs) |
| 13 | `Api/Controllers/Catalogo/ProdutoController.cs` | [Controller.cs](templates/Controller.cs) |
| 14 | `Test/Integration/Tests/Catalogo/ProdutoControllerTests.cs` | [ControllerTests.cs](templates/ControllerTests.cs) |

Nada de registro manual: `[Repository]` e `[Service]` nas interfaces bastam.

## Checklist antes do pull request

- Entidade herda `DefaultEntity` e implementa `IAuditable`; navegações com `[AuditIgnore]`.
- Controller herda `BaseApiStatusController` se a entidade tem soft delete.
- Toda action passa por um `Execute*` e tem `[Permission]` com constante.
- Request sem DataAnnotations; regras no Validator.
- Listagem devolve `ToActionResult()`; combos têm `select-items`.
- Profile mapeia `Produto → ProdutoResponse` e `ProdutoRequest → Produto` (só campos simples).
- Um teste de integração por action de escrita e um por regra de autorização.
- Migration com nome descritivo e `Down` funcional.
