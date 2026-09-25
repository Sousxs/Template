# Estrutura de pastas

```
<sistema>-app/
├── .env.example                    todas as variáveis, sem valor
├── index.html
├── package.json, pnpm-lock.yaml
├── tsconfig.json, vite.config.ts   aliases iguais nos dois
├── playwright.config.ts
├── e2e/                            specs Playwright e fixtures/mock-api.ts
├── visual-shots/                   capturas geradas; versionadas
├── public/
└── src/
    ├── main.tsx                    reflect-metadata, configureDependencyInjection(), createRoot
    ├── app/
    │   ├── App.tsx                 pilha de providers
    │   ├── AppRouter.tsx           createBrowserRouter; agrega os routers de feature
    │   ├── AppMenu.ts              árvore do menu a partir dos <Feature>Menu.ts
    │   ├── components/
    │   │   ├── auth/               AuthenticatedRouter, RedirectAuthenticatedRouter, PermissionRouter, HasPermission
    │   │   ├── shared/             button, dialog, form, input, table, file, export, page-card, loader, panel
    │   │   └── <feature>/          componentes da feature: Filter, Table, Form, dialogs
    │   ├── hooks/
    │   │   ├── UseService.ts, UsePagination.ts, UseApiFetch.ts, UseToastRef.ts,
    │   │   │   UseInternationalization.ts, UseDownload.ts, UseFilterForm.ts
    │   │   └── <feature>/          Use<X>Query.ts, Use<X>Mutation.ts
    │   ├── layouts/                AppLayout, AppLayoutMain, Header, AppMenu, AppSubmenu, UserMenu
    │   ├── pages/
    │   │   ├── login/, home/, erros/
    │   │   └── <feature>/
    │   │       ├── config/         <X>Router.tsx, <X>Menu.ts, <X>Breadcrumb.ts
    │   │       ├── <X>ListarPage.tsx
    │   │       ├── <X>FormPage.tsx
    │   │       └── <X>VisualizarPage.tsx
    │   ├── providers/              AppLayoutProvider (ref do Toast)
    │   ├── stores/                 AppUserStore, AppLayoutStore, AppLoaderStore, FilterStore
    │   ├── context/                contextos de tela (lista + modal)
    │   └── error/                  ErrorBoundary
    ├── core/                       sem regra de negócio
    │   ├── services/BaseService.ts
    │   ├── hooks/UseApiError.ts
    │   ├── query/ApiErrorHandling.ts
    │   ├── forms/ClassValidatorResolver.ts
    │   ├── decorator/              IsCpf, IsCNPJ, IsTelefone, Validator18n, ...
    │   ├── models/                 PaginationResponse, FilterParamType, ApiErrorResponse, exporter/
    │   └── utils/                  Date, Format, Object, Table, File, Export
    ├── services/<feature>/         <X>Service.ts, @singleton extends BaseService
    ├── models/<feature>/           <X>.ts, <X>Request.ts, <X>Response.ts, <X>FilterRequest.ts
    ├── models/permission/          PermissionEnum.ts
    ├── models/menu/                AppMenuItem.ts
    ├── validation/<feature>/       validadores class-validator que dependem de mais de um campo
    ├── config/                     AxiosHttpClient.ts, DependencyInjection.ts, ReactQuery.ts
    ├── env/Environment.ts
    ├── i18n/                       i18n.ts, pt/translation.json, pt/primereact.json, pt/class_validator.json
    └── assets/                     theme/, sass/, fonts/, img/
```

Sem pasta `deprecated/`. Código que saiu de uso é apagado no mesmo pull request que o substitui.

## Aliases

Iguais em `tsconfig.json` (`paths`) e `vite.config.ts` (`resolve.alias`):

`@/` → `src/`, `@core/`, `@services/`, `@models/`, `@i18n/`, `@app/`, `@layouts/` → `src/app/layouts`, `@hooks/` → `src/app/hooks`, `@components/` → `src/app/components`, `@stores/`, `@pages/`, `@providers/`.

Import relativo só dentro da mesma pasta.

## Nomes

| Coisa | Padrão |
|---|---|
| Arquivo de componente, página, hook | PascalCase: `ProdutoTable.tsx`, `ProdutoListarPage.tsx`, `UseFilterProdutoQuery.ts` |
| Export de hook | camelCase: `useFilterProdutoQuery` |
| Service, model, store | `ProdutoService.ts`, `ProdutoRequest.ts`, `AppUserStore.ts` |
| Pasta de feature | kebab-case em português: `produto`, `local-estoque`, `pre-cadastro` |
| Query key | constante exportada ao lado do hook: `export const filterProdutoQueryKey = 'filterProdutoQueryKey'` |
| Chave de i18n | `<feature>.labels.<campo>`, `<feature>.titles.<tela>`, `shared.actions.<botao>` |
