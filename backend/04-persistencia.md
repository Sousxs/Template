# Persistência

## DbContext

`AppDbContext : ApplicationDbContext` (de `Base.Repository`). A classe base aplica no `OnModelCreating`, para todo o modelo:

- collation `Latin1_General_CI_AI`;
- strings como `varchar` (não unicode);
- índice único automático em toda propriedade `Uuid`;
- `DeleteBehavior.NoAction` em toda FK (sem cascade físico).

O `AppDbContext` chama, na ordem, um método por domínio:

```csharp
protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);
    builder.AddActivableQueryFilter();      // soft delete: obrigatório
    ConfigurarMestres(builder);
    ConfigurarInventario(builder);
    ConfigurarPessoas(builder);
    builder.SeedCategorias();
    builder.SeedDominioValor();
}
```

Com mais de vinte entidades, quebre em `IEntityTypeConfiguration<T>` por entidade em `Database/Configurations/<Dominio>/` e chame `builder.ApplyConfigurationsFromAssembly(...)`. Abaixo disso, os métodos por domínio bastam.

## Soft delete

`Active` é a flag. `builder.AddActivableQueryFilter()` aplica `Active == true` a toda entidade `IAmActivable`. Sem essa chamada o filtro não existe e todo `Where` precisa lembrar de `Active`; por isso ela é obrigatória.

- Inativar: `PATCH /<Entidade>/change-status/{uuid}` com `{ "active": false }`.
- Consultar inativos: filtro `active=false` na listagem; `Repository.IgnoreQueryFiltersIfNeeded` desliga o filtro global só nessa consulta.
- Não há `DELETE` físico em entidades de negócio. Tabelas de ligação (N:N) podem ser removidas fisicamente.

## Migrations

- Geradas pelo EF em `Database/Migrations`, assembly `FGR.<Sistema>.Database`.
- Nome descreve a mudança: `AdicionaVidaUtilEmItem`, não `Update3`.
- Aplicadas no boot por `RunMigrations()` em todo ambiente, exceto `Test`.
- Nunca editar uma migration já aplicada em homolog; criar outra.
- Objetos que o EF não modela (SEQUENCE, view, computed column, índice filtrado) entram por `migrationBuilder.Sql(...)` na migration, com o `Down` correspondente.

## Seeds

Métodos de extensão em `Database/Seeds/<Dominio>Seed.cs`, chamados no `OnModelCreating` com `HasData`. Só dados de referência (categorias, listas de valores, perfis). Dados de exemplo ficam nos testes.

## Repositório

`Repository<T>` cobre `ExistsAsync`, `FindAsync` com includes, `ListAsync` paginado, `ListMapperAsync<TDto>`, `InsertAsync`, `UpdateAsync`, `RemoveAsync`. O repositório concreto adiciona só consultas específicas:

```csharp
internal class ItemRepository(AppDbContext db, ILogger<IRepository<Item>> log, IDomainValidation val, IMapper mapper)
    : Repository<Item>(db, log, mapper, val), IItemRepository
{
    public Task<bool> ExistsCodigoAsync(string codigo, Guid? exceto = null) =>
        GetQuery().AsNoTracking()
            .Where(i => i.CodigoPatrimonio == codigo && (exceto == null || i.Uuid != exceto))
            .AnyAsync();
}
```

Leitura sem alteração: `AsNoTracking()`. Projeção para DTO: `ProjectTo<TDto>(_mapper.ConfigurationProvider)`.

## Auditoria

`Shared.Audit` registra um `AuditingSaveChangesInterceptor` no DbContext quando `AuditConfiguration:Enabled = true`. A cada `SaveChanges` ele gera um `AuditEntry` por entidade `IAuditable` alterada:

| Campo | Conteúdo |
|---|---|
| `EntityType`, `EntityId`, `EntityName` | Tipo, id e nome legível |
| `OperationType` | `Created`, `Updated`, `Deleted` |
| `OldValues`, `NewValues`, `ChangedColumns` | Diferença campo a campo |
| `UserId`, `UserName` | Das claims da requisição |
| `Timestamp`, `TransactionId` | UTC e id da transação |

A persistência é uma implementação de `IAuditPersistenceService`. O padrão é `SqlAuditPersistenceService`, que grava a tabela `AuditLog` pelo próprio DbContext, na mesma transação. Um publisher assíncrono (fila de mensagens e banco de documentos) é a alternativa quando a auditoria for centralizada entre sistemas ou o volume pesar; a troca é essa classe.

Regras:
- Motivo de uma mudança (status, transferência, baixa) é propriedade da entidade, então aparece em `NewValues` sem coluna extra.
- Mudança em entidade filha (1:1) é auditada sob o `Id` do pai quando a filha tem `[AuditRelations]` na navegação do pai.
- `AuditLog` é append-only. Ninguém edita ou apaga.

## Concorrência

Sem token de concorrência por padrão. Entidades editadas por vários usuários ao mesmo tempo (estoque, saldo, contador) ganham `[Timestamp] byte[] RowVersion` e o service trata `DbUpdateConcurrencyException` como erro de domínio.

## Criptografia de coluna

`[Encrypted]` em propriedade `string` aplica `EncryptionConverter` com a chave em `Encryption:Key`. Para dado pessoal sensível (documento, conta bancária), não para tudo.
