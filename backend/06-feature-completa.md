# Uma feature completa: entidade `Item` no domínio `Inventario`

Ordem de criação. Cada passo tem um template em [templates/](templates/).

| # | Arquivo | Template |
|---|---|---|
| 1 | `Entities/Inventario/Item.cs` | [Entity.cs](templates/Entity.cs) |
| 2 | `Entities/Inventario/Enum/StatusItem.cs` | enum simples |
| 3 | `Database/AppDbContext.cs` → `ConfigurarInventario(builder)` | [DbContextConfigurar.cs](templates/DbContextConfigurar.cs) |
| 4 | Migration: `dotnet ef migrations add CriaItem -p Database -s Api` | |
| 5 | `Repository.Interface/Inventario/IItemRepository.cs` | [IRepository.cs](templates/IRepository.cs) |
| 6 | `Repository/Inventario/ItemRepository.cs` | [Repository.cs](templates/Repository.cs) |
| 7 | `Service.Models/Inventario/ItemRequest.cs`, `ItemResponse.cs`, `ItemFilterRequest.cs` | [Request.cs](templates/Request.cs), [Response.cs](templates/Response.cs), [FilterRequest.cs](templates/FilterRequest.cs) |
| 8 | `Service.Models/Mappers/InventarioProfile.cs` | [Profile.cs](templates/Profile.cs) |
| 9 | `Service.Interface/Inventario/IItemService.cs` | [IService.cs](templates/IService.cs) |
| 10 | `Service/Inventario/ItemValidator.cs` | [Validator.cs](templates/Validator.cs) |
| 11 | `Service/Inventario/ItemService.cs` | [Service.cs](templates/Service.cs) |
| 12 | `Api/Common/Permissions.cs` → `Permissions.Item` | [Permissions.cs](templates/Permissions.cs) |
| 13 | `Api/Controllers/Inventario/ItemController.cs` | [Controller.cs](templates/Controller.cs) |
| 14 | `Test/Integration/Tests/Inventario/ItemControllerTests.cs` | [ControllerTests.cs](templates/ControllerTests.cs) |

Nada de registro manual: `[Repository]` e `[Service]` nas interfaces bastam.

## Checklist antes do pull request

- Entidade herda `DefaultEntity` e implementa `IAuditable`; navegações com `[AuditIgnore]`.
- Controller herda `BaseApiStatusController` se a entidade tem soft delete.
- Toda action passa por um `Execute*` e tem `[Permission]` com constante.
- Request sem DataAnnotations; regras no Validator.
- Listagem devolve `ToActionResult()`; combos têm `select-items`.
- Profile mapeia `Item → ItemResponse` e `ItemRequest → Item` (só campos simples).
- Um teste de integração por action de escrita e um por regra de autorização.
- Migration com nome descritivo e `Down` funcional.
