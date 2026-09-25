# API, dados e erros

## Cliente HTTP

Uma instância axios, criada em `config/AxiosHttpClient.ts` e registrada no container tsyringe sob o token `httpClient`:

- `baseURL` vem de `Environment.appConfig.apiUrl` (`VITE_REACT_APP_API_URL`). Em desenvolvimento aponta para `/api` com proxy do Vite, o que permite mockar tudo nos testes.
- Interceptor de request: `trimStrings` no corpo de `post`, `put` e `patch`.
- Interceptor de response: normaliza todo erro em `ApiErrorResponse` (`core/query/ApiErrorHandling.ts`), inclusive quando a resposta é `Blob`. Em 401, limpa os stores e navega para `/login`; se a API emite refresh token, tenta uma vez o `POST /OAuth/refresh-token` com fila de requisições concorrentes.

## Services

Um por entidade, `@singleton()`, herdando `BaseService`:

```ts
@singleton()
export class ItemService extends BaseService {
    constructor(@inject(defaultHttpClientInjectionToken) protected http: AxiosInstance) {
        super('/Item', http);
    }
}
```

`BaseService` já dá `paginate`, `get`, `getAll`, `create`, `update`, `remove`, `export` e `alterarStatus`. O service concreto adiciona só o que a entidade tem a mais (`selectItems`, `linhaDoTempo`, `importar`). Componentes obtêm o service com `useService(ItemService)`; nunca importam a instância.

## Paginação e filtro

`usePagination<T>` guarda `first`, `rows`, `page`, `sortField`, `sortOrder` e os filtros, e expõe `searchParams` prontos para `service.paginate(page, rows, sort, filter)`. O `sort` vai como `"campo,asc"`. Filtros vazios são removidos por `cleanedParams`; arrays viram `a,b,c` (`qs` com `arrayFormat: 'comma'`). A resposta é `PaginationResponse<T>`: `content`, `totalElements`, `totalPages`, `pageIndex`, `size`.

## React Query

- `queryClient` em `config/ReactQuery.ts` com defaults: `staleTime: 0`, `retry: 0`, `refetchOnWindowFocus: false`. Nenhum hook repete esses valores.
- Um hook por consulta em `hooks/<feature>/Use<X>Query.ts`, com a query key exportada como constante e os parâmetros dentro da key.
- Um hook por escrita em `hooks/<feature>/Use<X>Mutation.ts`: chama o service, mostra toast de sucesso, invalida a query key da lista, trata erro com `formHandleError` ou `toastHandleError`.
- `fetchApi(promise, { onSuccess, onError, onFinally, preventThrow })` envolve toda chamada dentro de `queryFn` e `mutationFn`.

## Erros

`useApiError()` expõe:

| Função | Uso |
|---|---|
| `toastHandleError(error)` | Erro de consulta ou ação sem formulário |
| `toastHandleGroupedError(error)` | Vários `domainErrors` num toast só |
| `formHandleError(form, error)` | Mapeia `errors[campo]` para `form.setError`; `domainErrors` vão para toast |

Mensagens por status vêm de `shared.errors.<status>` no i18n.

## Download e exportação

`useDownload` recebe a promise de um `Blob`, lê `content-disposition` e dispara o download. `TableExport` (compound component) monta o botão com as opções XLSX, CSV e PDF sobre `service.export(tipo, filtros)`.
