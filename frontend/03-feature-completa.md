# Uma feature completa: `item`

Ordem de criação. Templates em [templates/](templates/).

| # | Arquivo | Template |
|---|---|---|
| 1 | `models/item/ItemRequest.ts`, `ItemResponse.ts`, `ItemFilterRequest.ts` | [ItemRequest.ts](templates/ItemRequest.ts), [ItemResponse.ts](templates/ItemResponse.ts) |
| 2 | `models/permission/PermissionEnum.ts` → chaves `Item*` | [PermissionEnum.ts](templates/PermissionEnum.ts) |
| 3 | `services/item/ItemService.ts` | [ItemService.ts](templates/ItemService.ts) |
| 4 | `i18n/pt/translation.json` → seção `item` | [translation.item.json](templates/translation.item.json) |
| 5 | `app/hooks/item/UseFilterItemQuery.ts`, `UseItemMutation.ts` | [UseFilterItemQuery.ts](templates/UseFilterItemQuery.ts), [UseItemMutation.ts](templates/UseItemMutation.ts) |
| 6 | `app/components/item/ItemFilter.tsx`, `ItemTable.tsx`, `ItemForm.tsx` | [ItemFilter.tsx](templates/ItemFilter.tsx), [ItemTable.tsx](templates/ItemTable.tsx), [ItemForm.tsx](templates/ItemForm.tsx) |
| 7 | `app/pages/item/ItemListarPage.tsx`, `ItemFormPage.tsx` | [ItemListarPage.tsx](templates/ItemListarPage.tsx), [ItemFormPage.tsx](templates/ItemFormPage.tsx) |
| 8 | `app/pages/item/config/ItemMenu.ts`, `ItemBreadcrumb.ts`, `ItemRouter.tsx` | [ItemMenu.ts](templates/ItemMenu.ts), [ItemBreadcrumb.ts](templates/ItemBreadcrumb.ts), [ItemRouter.tsx](templates/ItemRouter.tsx) |
| 9 | `app/AppRouter.tsx` → adiciona `itemRoutes`; `app/AppMenu.ts` → adiciona `ItemMenu.listar` | |
| 10 | `e2e/item.spec.ts` e uma linha em `e2e/_visual.spec.ts` | [item.spec.ts](templates/item.spec.ts) |

Só os passos 9 e 10 tocam arquivos fora da pasta da feature.

## Padrão de URL

| Rota | Página |
|---|---|
| `/item` | `ItemListarPage` |
| `/item/new` | `ItemFormPage` |
| `/item/edit/:uuid` | `ItemFormPage` |
| `/item/view/:uuid` | `ItemVisualizarPage` |

## Trio de listagem

- `ItemListarPage`: `PageCard` com título, breadcrumb e botão "Novo" sob `HasPermission`; dentro, `ItemFilter` e `ItemTable` compartilhando um contexto de lista (`ItemListContext`) ou o `FilterStore` da feature.
- `ItemFilter`: formulário de filtro com `useFilterForm`; ao aplicar, atualiza os `searchParams` de `usePagination`.
- `ItemTable`: `DataTable` do PrimeReact em modo `lazy` com `usePagination`; `useFilterItemQuery` busca; colunas de ação com `ButtonTableEditar`, `ButtonTableVisualizar`, `InputSwitch` para ativar/inativar sob `HasPermission`.

## Mestres simples

Entidades com só nome, escopo e ativo compartilham `components/mestre/` (`MestreFilter`, `MestreTable`, `MestreFormModal`) parametrizados por colunas e service. A pasta `pages/mestres/<mestre>/` continua existindo, com `config/` e uma page de dez linhas. Quando um mestre ganha regra própria, ele ganha o trio completo.

## Checklist antes do pull request

- Nenhum texto de tela fora do `translation.json`.
- Botões e colunas de ação sob `HasPermission`; rota sob `PermissionRouter`.
- Query key exportada e invalidada na mutation.
- Formulário com `ClassValidatorResolver` e `formHandleError` no `onError`.
- Loading com `TableSkeleton` ou `FormLoading`; nunca tela em branco.
- Uma linha nova em `_visual.spec.ts` e a captura versionada.
