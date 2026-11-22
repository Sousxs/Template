# Testes

Projeto único `<Empresa>.<Sistema>.Test`, xUnit.

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

`Api` e `Service` têm `InternalsVisibleTo("<Empresa>.<Sistema>.Test")`; `Api` expõe `public partial class Program {}`.

## O que testar

| Tipo | Obrigatório |
|---|---|
| Integration | Uma chamada por action de escrita (POST, PUT, PATCH) com o caso feliz; uma por regra de autorização (sem token 401, sem permissão 403); uma por regra de domínio que devolve 400 |
| Unit | Regra de negócio com ramificação (máquina de estados, cálculo, validação cruzada); pivot ou importação |
| Mapeamento | `AssertConfigurationIsValid` de todos os profiles, um teste |

Sem suíte por método, sem teste de getter e setter, sem mock do que não é fronteira.

## Quando o InMemory não basta

EF InMemory não executa SQL. Recursos do SQL Server não funcionam nele: `SEQUENCE`, computed column, índice filtrado, view, `RowVersion`, collation; índice único também não é imposto de forma confiável. Se a entidade depende de um deles, o teste de integração dessa entidade roda contra SQL Server numa segunda factory, `SqlServerApplicationFactory`. Só para esses testes; o resto continua InMemory.

O SQL Server desses testes vem de um de dois lugares:

- **Container (Testcontainers)**, quando há Docker na máquina de quem desenvolve e no CI.
- **Servidor de testes da empresa**, quando não há. A variável `<SISTEMA>_TEST_SQLSERVER` traz a connection string sem o banco. Cada teste cria o seu banco `<Sistema>_Test_<guid>`, aplica as migrations e apaga o banco no fim, mesmo quando falha.

Nos dois casos os testes levam `[Trait("Category", "SqlServer")]`. Sem container e sem a variável eles são pulados com o motivo explícito, nunca dados como verdes. Enquanto o CI não alcança o servidor de testes, a prova desses testes é o registro da execução local no PR.

## Nomes

`Criar_ComCodigoDuplicado_Retorna400`, `Listar_SemPermissao_Retorna403`. Método, cenário, resultado.
