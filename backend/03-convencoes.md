# Convenções

## Entidades

```csharp
[Table("Item")]
public class Item : DefaultEntity, IAuditable
{
    [Required, StringLength(200), Column("Nome")]
    public string Nome { get; set; } = string.Empty;

    [Required, Column("CategoriaId")]
    public long CategoriaId { get; set; }

    [ForeignKey(nameof(CategoriaId)), AuditIgnore]
    public Categoria Categoria { get; set; } = null!;
}
```

- Herda `DefaultEntity`: `Id long`, `Uuid Guid` (gerado no construtor), `Active bool` (true por padrão).
- Implementa `IAuditable` para entrar na auditoria.
- Tabela e colunas em PascalCase, declaradas por atributo. Sem snake_case.
- Navegações levam `[AuditIgnore]`; coleções que importam para a auditoria levam `[AuditRelations(entityProperties: nameof(Filha.Id))]`.
- Strings que devem ser guardadas em maiúsculas (placa, código) levam `[Uppercase]`; o `UnityOfWork` normaliza antes de salvar.
- Enums ficam em `Entities/<Dominio>/Enum/` e são gravados como string.
- Sem `CreatedAt`/`UpdatedAt` na entidade base. Quem precisa de data de negócio declara a própria coluna (`DataAquisicao`, `DataBaixa`). O histórico técnico é a auditoria.

## Rotas

| Regra | Exemplo |
|---|---|
| `[Route("[controller]")]`, sem prefixo `/api`, sem versão | `GET /Item`, `POST /Unidade` |
| Id público é o `Uuid` | `GET /Item/{uuid}` |
| Sub-recurso com rota literal | `GET /Item/{itemUuid:guid}/linha-do-tempo` |
| Sufixo de ação em kebab-case | `PATCH /Item/change-status/{uuid}`, `GET /Unidade/select-items`, `POST /Item/importar` |
| Atributos de classe | `[ApiController] [Route("[controller]")] [Produces("application/json")] [Authorize]` |
| Atributos de action | `[ProducesResponseType(200, Type = typeof(ItemResponse))]` e `[ProducesResponseType(400, Type = typeof(IDomainValidation))]` |

## Registro de dependências

Interface marcada, implementação descoberta por reflexão. Nunca `AddScoped` manual para service ou repositório.

```csharp
[Service]                      // scoped por padrão; [Service(LifeCycleEnum.Singleton)] se precisar
public interface IItemService : IBaseService<Item> { ... }

[Repository]
public interface IItemRepository : IRepository<Item> { ... }
```

Uma interface, uma implementação. Duas implementações ou nenhuma quebram o boot com `AutoRegisterServiceException`, de propósito.

## Listagem, filtro e ordenação

- Query string: `?page=0&size=25&sort=nome,asc&nome=cad&unidadeUuid=...`. `page` é 0-based na API.
- `DataTableModelBinder` transforma em `DataTableRequest<TFiltro>`; qualquer parâmetro que não seja `page`, `size` ou `sort` vira um filtro `{Name, Value}`.
- `Repository.ListAsync` traduz com Dynamic LINQ: `Guid` igualdade, `bool` igualdade (`false` inclui `null`), `string` contains, demais igualdade.
- Propriedades filtráveis do DTO de filtro levam `[Searcheable]`; serve para o Swagger documentar.
- Resposta: `response.ToActionResult()` devolve `{content, size, pageIndex, totalElements, totalPages}`.
- Listas para combos: `GET /<Entidade>/select-items` devolve `[{value: uuid, label}]`.

## Validação

`IDomainValidation` é scoped por requisição. Sem FluentValidation, sem DataAnnotations em Request. DataAnnotations ficam só nas entidades, para o EF.

## Mapeamento

AutoMapper, um `<Dominio>Profile` em `Service.Models/Mappers`. Consultas de listagem usam `ProjectTo<TDto>` para não materializar a entidade.

## Erros

- 400: `{message, errors: {campo: [msg]}, domainErrors: [msg], validation: true}`.
- 500: mesmo envelope com `validation: false`, `exception` e `stacktrace` só fora de produção.
- Sem middleware global de exceção: `BaseApiController.HandlingException` resolve `ICustomExceptionHandler`, registrado em `RegisterSharedModule<T>`.
- `ApiException` para erros de configuração no boot.

## Logs

`Base.Logger` expõe `ILogger<T>` próprio (alias `BLL.ILogger<T>`), implementado sobre Serilog. Controllers e services injetam esse, não o da Microsoft. `SerilogEnricherMiddleware` adiciona usuário e trace a todo log da requisição.

## Configuração

- `appsettings.json` com valores de desenvolvimento sem segredo; `appsettings.<Ambiente>.json` por ambiente.
- Segredos (connection string com senha, chaves, tokens) nunca no repositório: variável de ambiente ou User Secrets em desenvolvimento.
- Seções padrão: `ConnectionStrings:Default`, `Cors`, `FrontUrl`, `UseSwagger`, `Serilog`, `Export`, `AuditConfiguration`, `OAuthConfig` ou `JwtBearer`.

## Nomes

| Coisa | Padrão |
|---|---|
| Entidade | `Item`, `ItemVeiculo` |
| Interface e classe | `IItemRepository` / `ItemRepository`, `IItemService` / `ItemService` |
| DTO | `ItemRequest`, `ItemResponse`, `ItemFilterRequest`, `ItemLinhaDoTempoResponse` |
| Validator | `ItemValidator` |
| Profile | `InventarioProfile` (por domínio) |
| Controller | `ItemController` |
| Pasta | Mesmo nome de domínio em todas as camadas: `Inventario/` |
| Permissão | `"Item.Criar"`, constante em `Common/Permissions.cs` |
