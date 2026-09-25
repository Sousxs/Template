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
├── FGR.<Sistema>.Api/                composição, controllers, autenticação, middleware, appsettings
├── FGR.<Sistema>.Entities/           entidades EF, uma pasta por domínio, subpasta Enum
├── FGR.<Sistema>.Repository.Interface/
├── FGR.<Sistema>.Repository/
├── FGR.<Sistema>.Service.Interface/
├── FGR.<Sistema>.Service/
├── FGR.<Sistema>.Service.Models/     Request, Response, Mappers (AutoMapper), Attribute
├── FGR.<Sistema>.Database/           AppDbContext, Migrations, Seeds, RegisterServices
├── FGR.<Sistema>.Shared.Audit/       interceptor de auditoria e persistência
└── FGR.<Sistema>.Test/               Unit e Integration
```

Quinze projetos é o ponto de partida. Projetos extras entram só com requisito: `Jobs` (agendamento), `BackgroundServices` (fila de e-mail), `Reports` (documentos PDF ricos), `Integracao<Sistema>` (um por sistema externo).

## Solution folders

`01 - Itens de Solução`, `02 - Application` (Api), `03 - Services` (Service, Service.Interface, Service.Models), `04 - Infrastructure` (Entities, Repository, Repository.Interface, Database, Shared.Audit), `05 - Testes`, `06 - Bases`.

## `Base.*`

- Não conhecem o domínio. Se uma classe cita uma entidade do sistema, ela não pertence a `Base.*`.
- Têm `GeneratePackageOnBuild=true`. Enquanto a FGR não tiver feed NuGet interno, entram como pastas da solution; depois viram `PackageReference`.
- Mudança em `Base.*` é mudança neste handbook primeiro.

## Referências entre projetos

```
Api → Service, Service.Models, Database, Base.*
Service → Service.Interface, Service.Models, Repository.Interface, Entities, Base.Shared
Repository → Repository.Interface, Database, Entities, Base.Repository
Database → Entities, Shared.Audit, Base.Repository
Test → Api (InternalsVisibleTo em Api e Service)
```

`Repository` nunca referencia `Service`. `Entities` não referencia nada da aplicação.

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
global using FGR.<Sistema>.Api.Common;
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
    .RegisterDataDictionary("FGR - <Sistema>")
    .ConfigureAuthentication(configuration);
```
