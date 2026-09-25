# Uma feature completa: `produto`

Ordem de criação. Templates em [templates/](templates/).

| # | Arquivo | Template |
|---|---|---|
| 1 | `models/produto/ProdutoRequest.ts`, `ProdutoResponse.ts`, `ProdutoFilterRequest.ts` | [ProdutoRequest.ts](templates/ProdutoRequest.ts), [ProdutoResponse.ts](templates/ProdutoResponse.ts) |
| 2 | `models/permission/PermissionEnum.ts` → chaves `Produto*` | [PermissionEnum.ts](templates/PermissionEnum.ts) |
| 3 | `services/produto/ProdutoService.ts` | [ProdutoService.ts](templates/ProdutoService.ts) |
| 4 | `i18n/pt/translation.json` → seção `produto` | [translation.produto.json](templates/translation.produto.json) |
| 5 | `app/hooks/produto/UseFilterProdutoQuery.ts`, `UseProdutoMutation.ts` | [UseFilterProdutoQuery.ts](templates/UseFilterProdutoQuery.ts), [UseProdutoMutation.ts](templates/UseProdutoMutation.ts) |
| 6 | `app/components/produto/ProdutoFilter.tsx`, `ProdutoTable.tsx`, `ProdutoForm.tsx` | [ProdutoFilter.tsx](templates/ProdutoFilter.tsx), [ProdutoTable.tsx](templates/ProdutoTable.tsx), [ProdutoForm.tsx](templates/ProdutoForm.tsx) |
| 7 | `app/pages/produto/ProdutoListarPage.tsx`, `ProdutoFormPage.tsx` | [ProdutoListarPage.tsx](templates/ProdutoListarPage.tsx), [ProdutoFormPage.tsx](templates/ProdutoFormPage.tsx) |
| 8 | `app/pages/produto/config/ProdutoMenu.ts`, `ProdutoBreadcrumb.ts`, `ProdutoRouter.tsx` | [ProdutoMenu.ts](templates/ProdutoMenu.ts), [ProdutoBreadcrumb.ts](templates/ProdutoBreadcrumb.ts), [ProdutoRouter.tsx](templates/ProdutoRouter.tsx) |
| 9 | `app/AppRouter.tsx` → adiciona `itemRoutes`; `app/AppMenu.ts` → adiciona `ProdutoMenu.listar` | |
| 10 | `e2e/produto.spec.ts` e uma linha em `e2e/_visual.spec.ts` | [produto.spec.ts](templates/produto.spec.ts) |

Só os passos 9 e 10 tocam arquivos fora da pasta da feature.

## Padrão de URL

| Rota | Página |
|---|---|
| `/produto` | `ProdutoListarPage` |
| `/produto/new` | `ProdutoFormPage` |
| `/produto/edit/:uuid` | `ProdutoFormPage` |
| `/produto/view/:uuid` | `ProdutoVisualizarPage` |

## Trio de listagem

- `ProdutoListarPage`: `PageCard` com título, breadcrumb e botão "Novo" sob `HasPermission`; dentro, `ProdutoFilter` e `ProdutoTable` compartilhando um contexto de lista (`ProdutoListContext`) ou o `FilterStore` da feature.
- `ProdutoFilter`: formulário de filtro com `useFilterForm`; ao aplicar, atualiza os `searchParams` de `usePagination`.
- `ProdutoTable`: `DataTable` do PrimeReact em modo `lazy` com `usePagination`; `useFilterProdutoQuery` busca; colunas de ação com `ButtonTableEditar`, `ButtonTableVisualizar`, `InputSwitch` para ativar/inativar sob `HasPermission`.

## Mestres simples

Entidades com só nome, escopo e ativo compartilham `components/mestre/` (`MestreFilter`, `MestreTable`, `MestreFormModal`) parametrizados por colunas e service. A pasta `pages/mestres/<mestre>/` continua existindo, com `config/` e uma page de dez linhas. Quando um mestre ganha regra própria, ele ganha o trio completo.

## Checklist antes do pull request

- Nenhum texto de tela fora do `translation.json`.
- Botões e colunas de ação sob `HasPermission`; rota sob `PermissionRouter`.
- Query key exportada e invalidada na mutation.
- Formulário com `ClassValidatorResolver` e `formHandleError` no `onError`.
- Loading com `TableSkeleton` ou `FormLoading`; nunca tela em branco.
- Uma linha nova em `_visual.spec.ts` e a captura versionada.
