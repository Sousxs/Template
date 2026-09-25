# Camadas e fluxo de uma requisição

```
Controller  [ApiController] [Route("[controller]")] [Authorize] [Permission("Item.Criar")]
   └─ ExecuteWithTransactionAsync(async () =>
        {
            var response = await _service.CriarAsync(request);
            return Created("Uri", response);
        })
        ├─ Service.CriarAsync
        │    ├─ GeneralUtils.TrimObjectStringProperties(request)
        │    ├─ _validator.ValidarCriar(request)      acumula em IDomainValidation
        │    ├─ _domainValidation.EnsureValid()        lança DomainValidationException
        │    ├─ monta a entidade
        │    └─ CreateAsync(entity)                    Repository<T>.InsertAsync
        ├─ UnityOfWork.SaveChangesAsync                interceptor de auditoria gera AuditEntry
        └─ CommitTransactionAsync
   erro de domínio  → 400 {message, errors, domainErrors, validation: true}
   exceção          → HandlingException → ICustomExceptionHandler → 500 com o mesmo envelope
```

## Responsabilidade de cada camada

| Camada | Faz | Não faz |
|---|---|---|
| Controller | Recebe o request, escolhe o `Execute*`, devolve o status HTTP | Regra de negócio, `SaveChanges`, acesso ao DbContext |
| Service | Regra de negócio, validação de domínio, orquestra repositórios e outros services, mapeia para Response | Transação, `SaveChanges`, HTTP |
| Repository | Consultas e comandos sobre uma entidade, projeções com `ProjectTo` | Regra de negócio, validação |
| UnityOfWork | `BeginTransaction`, `SaveChanges`, `Commit`, `Rollback`, normalização `[Uppercase]` | Qualquer regra |

## Os três `Execute*`

| Método | Quando | O que faz |
|---|---|---|
| `ExecuteAsync` | Leitura | Roda a expressão; se `IDomainValidation` tem erro, 400 |
| `ExecuteWithSaveChangesAsync` | Uma escrita simples | Roda, `SaveChangesAsync`, `onSuccess` opcional |
| `ExecuteWithTransactionAsync` | Várias escritas ou escrita mais efeito colateral | `BeginTransaction`, roda, `SaveChangesAndCommit`; rollback em erro |

O service nunca chama `SaveChanges`. Quem decide a fronteira da transação é o controller, e a fronteira é sempre uma action.

## Controllers base

- `BaseApiController<TController>`: os três `Execute*` e o tratamento de exceção. Toda action passa por um deles.
- `BaseApiStatusController<TEntity, TController>`: herda o anterior e adiciona `PATCH change-status/{uuid}` para ativar e inativar. Use em toda entidade com soft delete.

## Services base

- `IBaseService<T>`: `ExistsAsync`, `FindAsync`, `FindAsNoTrackingAsync`, `ListAsync`, `ListMapperAsync<TDto>`, `ExportAsync`, `ChangeActiveStatus`.
- `BaseServiceCrud<T>`: adiciona `CreateAsync`, `EditAsync`, `RemoveAsync`.
- Service concreto: `internal class ItemService(...) : BaseServiceCrud<Item>, IItemService`. `internal` força o consumo pela interface.

## Validator

Um `<Entidade>Validator` por entidade, ao lado do service, com `ValidarCriar(request)` e `ValidarEditar(request, uuid)`. Ele consulta repositórios quando precisa (unicidade, existência de FK) e grava em `IDomainValidation`:

- `AddFieldError("campo", "mensagem")` para erro ligado a um campo do formulário.
- `AddDomainError("mensagem")` para regra que não é de um campo.

O app mapeia `errors` para os campos e mostra `domainErrors` em toast.
