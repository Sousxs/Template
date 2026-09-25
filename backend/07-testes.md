# Testes

Projeto único `FGR.<Sistema>.Test`, xUnit.

```
Test/
├── Unit/
│   ├── ServiceTests/<Dominio>/     regra de negócio com repositórios mockados (Moq, AutoFixture)
│   ├── Repositories/<Dominio>/     consultas específicas, EF InMemory
│   ├── Entities/                   comportamento de entidade quando houver
│   └── Mocks/                      builders de entidades e DataTableResponse
└── Integration/
    ├── Configuration/
    │   ├── CustomApplicationFactory.cs   WebApplicationFactory<Program>: troca o DbContext por InMemory, mocka serviços externos
    │   ├── BaseControllerTests.cs        IClassFixture da factory, helpers, paginação padrão "?page=0&size=10&sort=id,asc"
    │   └── DependencyInjectionFixture.cs ServiceProvider só com AutoMapper para testar mapeamentos
    ├── Seeds/<Dominio>Seed.cs            dados dos testes de integração
    └── Tests/<Dominio>/<Entidade>ControllerTests.cs
```

`Api` e `Service` têm `InternalsVisibleTo("FGR.<Sistema>.Test")`; `Api` expõe `public partial class Program {}`.

## O que testar

| Tipo | Obrigatório |
|---|---|
| Integration | Uma chamada por action de escrita (POST, PUT, PATCH) com o caso feliz; uma por regra de autorização (sem token 401, sem permissão 403); uma por regra de domínio que devolve 400 |
| Unit | Regra de negócio com ramificação (máquina de estados, cálculo, validação cruzada); pivot ou importação |
| Mapeamento | `AssertConfigurationIsValid` de todos os profiles, um teste |

Sem suíte por método, sem teste de getter e setter, sem mock do que não é fronteira.

## Quando o InMemory não basta

EF InMemory não executa SQL. Recursos do SQL Server não funcionam nele: `SEQUENCE`, computed column, índice filtrado, view, `RowVersion`, collation. Se a entidade depende de um deles, o teste de integração dessa entidade roda contra SQL Server em container (Testcontainers) numa segunda factory, `SqlServerApplicationFactory`. Só para esses testes; o resto continua InMemory.

## Nomes

`Criar_ComCodigoDuplicado_Retorna400`, `Listar_SemPermissao_Retorna403`. Método, cenário, resultado.
