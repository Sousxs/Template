# Convenções

## Entidades

```csharp
[Table("Produto")]
public class Produto : DefaultEntity, IAuditable
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
- Sem `CreatedAt`/`UpdatedAt` na entidade base. Quem precisa de data de negócio declara a própria coluna (`DataLancamento`, `DataDescontinuacao`). O histórico técnico é a auditoria.

## Rotas

| Regra | Exemplo |
|---|---|
| `[Route("[controller]")]`, sem prefixo `/api`, sem versão | `GET /Produto`, `POST /Categoria` |
| Id público é o `Uuid` | `GET /Produto/{uuid}` |
| Sub-recurso com rota literal | `GET /Produto/{itemUuid:guid}/linha-do-tempo` |
| Sufixo de ação em kebab-case | `PATCH /Produto/change-status/{uuid}`, `GET /Categoria/select-items`, `POST /Produto/importar` |
| Atributos de classe | `[ApiController] [Route("[controller]")] [Produces("application/json")] [Authorize]` |
| Atributos de action | `[ProducesResponseType(200, Type = typeof(ProdutoResponse))]` e `[ProducesResponseType(400, Type = typeof(IDomainValidation))]` |

## Registro de dependências

Interface marcada, implementação descoberta por reflexão. Nunca `AddScoped` manual para service ou repositório.

```csharp
[Service]                      // scoped por padrão; [Service(LifeCycleEnum.Singleton)] se precisar
public interface IProdutoService : IBaseService<Produto> { ... }

[Repository]
public interface IProdutoRepository : IRepository<Produto> { ... }
```

Uma interface, uma implementação. Duas implementações ou nenhuma quebram o boot com `AutoRegisterServiceException`, de propósito.

## Listagem, filtro e ordenação

- Query string: `?page=0&size=25&sort=nome,asc&nome=cim&categoriaUuid=...`. `page` é 0-based na API.
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
| Entidade | `Produto`, `ProdutoVariacao` |
| Interface e classe | `IProdutoRepository` / `ProdutoRepository`, `IProdutoService` / `ProdutoService` |
| DTO | `ProdutoRequest`, `ProdutoResponse`, `ProdutoFilterRequest`, `ProdutoResumoResponse` |
| Validator | `ProdutoValidator` |
| Profile | `CatalogoProfile` (por domínio) |
| Controller | `ProdutoController` |
| Pasta | Mesmo nome de domínio em todas as camadas: `Catalogo/` |
| Permissão | `"Produto.Criar"`, constante em `Common/Permissions.cs` |
