# Autenticação e permissões

## Sessão

`services/auth/LoginService.ts` faz o login e devolve `UserSession`: `access_token`, dados do usuário, `permissions: string[]` e, quando a API emite, `refresh_token`. Nada é decodificado do JWT no app além da expiração do refresh.

Dois stores Zustand com `persist` em `app/stores/AppUserStore.ts`:

| Store | Chave no localStorage | Conteúdo |
|---|---|---|
| `appUserSessionStore` | `VITE_REACT_APP_USER_KEY` | `UserSession` |
| `appPermissionsStore` | `VITE_REACT_APP_USER_PERMISSIONS_KEY` | `string[]` |

A chave inclui o ambiente (`__fgr_<sistema>_homolog`) para não misturar sessões no mesmo navegador.

## Três níveis de bloqueio

| Nível | Componente | Efeito |
|---|---|---|
| Menu | `layouts/AppMenu.tsx` filtra `AppMenuItem.permissions` | Produto some do menu |
| Rota | `PermissionRouter permissions={[...]}` no `<X>Router.tsx` | Redireciona para `/erros/permissao` |
| Elemento | `HasPermission hasAny / hasAll` | Botão, coluna ou seção não renderiza |

`AuthenticatedRouter` envolve todas as rotas privadas: sem sessão, vai para `/login`. `RedirectAuthenticatedRouter` faz o inverso na tela de login.

## `PermissionEnum`

Uma entrada por chave da API, com o mesmo valor:

```ts
export enum PermissionEnum {
    ProdutoListar = 'PRODUTO.LISTAR',
    ProdutoCriar = 'PRODUTO.CRIAR',
    ProdutoEditar = 'PRODUTO.EDITAR',
    ProdutoAtivarInativar = 'PRODUTO.ATIVARINATIVAR',
    ProdutoExportar = 'PRODUTO.EXPORTAR'
}
```

A comparação é sem diferenciar maiúsculas (`CheckPermissionService`). Lista de permissões vazia num item de menu ou rota significa liberado.

## Regras

- O app nunca decide permissão por tipo de usuário; decide por chave. Tipo de usuário serve só para texto e atalhos.
- Nenhuma chave de permissão escrita como string solta em componente. Sempre `PermissionEnum`.
- Logout limpa os dois stores e o cache do React Query.
