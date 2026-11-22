# Solution e projetos

## Árvore

```
<Sistema>.Api.sln
├── Directory.Build.props             VersionPrefix, Company, Authors
├── Base.Shared/                      controllers base, DefaultEntity, DomainValidation, DataTables, DI por atributo, cache, criptografia
├── Base.Repository/                  ApplicationDbContext (convenções globais), Repository<T>, UnityOfWork, query filters
├── Base.Logger/                      ILogger próprio sobre Serilog
├── Base.OAuth.Common/                [Permission], IPermissionLoader, constantes de claims
├── Base.Export/                      exportação XLSX (ClosedXML), CSV (CsvHelper), PDF (QuestPDF) por [ShowInReport]
├── Base.DataDictionary/              dicionário de dados em PDF gerado do DbContext
├── <Empresa>.<Sistema>.Api/                composição, controllers, autenticação, middleware, appsettings
├── <Empresa>.<Sistema>.Entities/           entidades EF, uma pasta por domínio, subpasta Enum
├── <Empresa>.<Sistema>.Repository.Interface/
├── <Empresa>.<Sistema>.Repository/
├── <Empresa>.<Sistema>.Service.Interface/
├── <Empresa>.<Sistema>.Service/
├── <Empresa>.<Sistema>.Service.Models/     Request, Response, Mappers (AutoMapper), Attribute
├── <Empresa>.<Sistema>.Database/           AppDbContext, Migrations, Seeds, RegisterServices
├── <Empresa>.<Sistema>.Shared.Audit/       interceptor de auditoria e persistência
└── <Empresa>.<Sistema>.Test/               Unit e Integration
```

Dezesseis projetos (seis `Base.*` e dez do sistema) são o ponto de partida. Projetos extras entram só com requisito: `Jobs` (agendamento), `BackgroundServices` (fila de e-mail), `Reports` (documentos PDF ricos), `Integracao<Fonte>` (um por sistema externo). `Jobs` e `Integracao<Fonte>` têm forma definida mais abaixo.

## Solution folders

`01 - Itens de Solução`, `02 - Application` (Api), `03 - Services` (Service, Service.Interface, Service.Models), `04 - Infrastructure` (Entities, Repository, Repository.Interface, Database, Shared.Audit), `05 - Testes`, `06 - Bases`.

## `Base.*`

- Não conhecem o domínio. Se uma classe cita uma entidade do sistema, ela não pertence a `Base.*`.
- Têm `GeneratePackageOnBuild=true`. Enquanto a empresa não tiver feed NuGet interno, entram como pastas da solution; depois viram `PackageReference`.
- Mudança em `Base.*` é mudança neste handbook primeiro.

## Referências entre projetos

```
Api → Service, Service.Models, Database, Base.*
Service → Service.Interface, Service.Models, Repository.Interface, Entities, Base.Shared
Repository → Repository.Interface, Database, Entities, Base.Repository
Database → Entities, Shared.Audit, Base.Repository
Test → Api (InternalsVisibleTo em Api e Service)
```

Quando o requisito pede, entram também:

```
Repository.Interface → Entities, Base.Shared
Service.Models → Entities
Service.Interface → Service.Models, Entities     quando a interface devolve DTO ou a exceção carrega um enum do domínio
Jobs → Service.Interface, Service.Models, Entities, Base.Shared
Integracao<Fonte> → Service.Interface, Service.Models, Base.Shared
Api → Jobs, Integracao<Fonte>
```

`Repository` nunca referencia `Service`. `Entities` não referencia nada da aplicação. `Jobs` e `Integracao<Fonte>` não referenciam `Repository` nem `Database`: falam com o domínio pelas interfaces de `Service.Interface`.

## Jobs

Agendamento sem pacote novo: um `BackgroundService` com `PeriodicTimer` em `<Empresa>.<Sistema>.Jobs`, registrado com `AddHostedService` em `Api/Configure.cs`.

- Roda uma vez logo depois da partida e depois a cada intervalo. O intervalo vem da configuração (`<Dominio>:Intervalo`, `hh:mm:ss`).
- Cada ciclo abre o seu escopo de injeção por `IUnityOfWorkScopeFactory`. O job é o limite da transação; o `Service` continua sem chamar `SaveChanges`.
- Exceção nunca sai do `ExecuteAsync`: no .NET 8 ela para o host e derruba a API. O ciclo captura, registra a falha em outro escopo, depois do rollback, e o ciclo seguinte roda normalmente.
- O job é sempre registrado. Se executa ou não, decide na execução, lendo a configuração já completa: em `Test` e com `<Dominio>:Habilitada` falso ele existe e não faz nada.
- Configuração inválida desliga só o job. A API sobe, a falha fica gravada com a categoria `ConfiguracaoInvalida` e o log lista os nomes das chaves que faltam, nunca valores.
- Log só com contagens e categoria de erro, sem texto de exceção.
- O relógio vem de `TimeProvider`, para o teste controlar o tempo.
- Vale para uma instância da API. Com mais de uma, trava distribuída (`sp_getapplock`) ou job externo; enquanto for instância única, o atalho fica marcado no código.

Hangfire, Quartz ou outro agendador só entram com requisito que o `PeriodicTimer` não atende (fila persistente, reexecução, painel), e por PR neste handbook.

## Integração com sistema externo

Um projeto `<Empresa>.<Sistema>.Integracao<Fonte>` por sistema externo. O domínio enxerga a fonte por uma interface em `Service.Interface`, uma por fonte (`I<Fonte><Dado>Source`), com duas implementações no projeto de integração:

- **Simulada:** dados fictícios e determinísticos, com identificadores que não colidem com os reais e sem nada que lembre pessoa. É a padrão em `Development` e `Test` e é recusada em `Production`.
- **Real:** fala com a fonte. Credencial só por variável de ambiente (`<SISTEMA>_<FONTE>_*`). Fonte só de leitura recebe consulta parametrizada, só com as colunas configuradas, e tabela e colunas validadas como identificador antes de entrar no SQL.

Regras:

- A implementação é escolhida por configuração (`<Fonte>:Fonte` = `Simulada` ou `Real`), lida na execução.
- Falha da fonte vira uma exceção que carrega só a categoria: `FalhaDeConexao`, `FalhaDeAutenticacao`, `TempoEsgotado`, `DadosInvalidos`, `ConfiguracaoInvalida` ou `Desconhecida`. Mensagem, log e banco não levam endereço, usuário, segredo nem texto do driver.
- A conexão real fica atrás de uma fábrica (`I<Fonte>ConexaoFactory`), para o leitor ser testado sem a fonte.
- Texto livre da fonte não é guardado. Nome de tabela, de coluna e valor que muda por ambiente ficam em configuração.
- Formato de dado da fonte (data, código, valores de status) é conferido com uma leitura real antes de virar regra. Formato suposto só aparece como defeito na primeira leitura em produção.
- O teste da implementação real leva `[Trait("Category", "<Fonte>Real")]`: roda quando as variáveis existem e, sem elas, é pulado com o motivo explícito, também no CI.

## Usings globais

Cada projeto tem um `Usings.cs` com `global using` dos namespaces que todo arquivo usa. Na `Api`:

```csharp
global using AutoMapper;
global using Base.Logger.Log;
global using Base.Shared.Controllers;
global using Base.Shared.Data;
global using Base.Shared.DomainValidation;
global using Base.Shared.Extension;
global using Microsoft.AspNetCore.Mvc;
global using <Empresa>.<Sistema>.Api.Common;
global using BLL = Base.Logger.Log;
```

## Composição

`Api/Configure.cs` é o único ponto de registro. Cada projeto expõe um `Register<Modulo>Module(this IServiceCollection)` e o `Configure` encadeia todos:

```csharp
services
    .AddEntityFrameworkSqlServer()
    .RegisterSharedModule<CustomExceptionHandler>(log)
    .RegisterRepositoryModule(log)
    .RegisterDatabaseModule(log)
    .RegisterRepositories(log)
    .RegisterServiceModule(configuration, log)
    .AddModelsAutoMapper(typeof(Configure), log)
    .UseBaseOauthCommon<CustomPermissionLoader>(string.Empty)
    .RegisterExportModule(log, configuration)
    .RegisterDataDictionary("<Empresa> - <Sistema>")
    .ConfigureAuthentication(configuration);
```
