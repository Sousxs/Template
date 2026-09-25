# Segurança

## Autenticação

Dois cenários. Escolha um por projeto e registre no README.

| Cenário | Quando | O que a API faz |
|---|---|---|
| Provedor externo | O login já existe fora (Painel de Ferramentas, AD) | `AddJwtBearer` validando issuer, audience e assinatura do provedor. Sem senha, sem refresh, sem controller de OAuth |
| Emissão própria | Usuários e senhas vivem no sistema | `OAuthController` com `POST /OAuth/token` e `POST /OAuth/refresh-token`, JWT assinado com chave RSA em `OAuthConfig`, `BasicAuthenticationHandler` para integrações máquina a máquina |

Em ambos: `[Authorize]` em todo controller; rotas públicas listadas explicitamente com `[AllowAnonymous]`.

## Autorização por permissão

Não há roles nem policies do ASP.NET. O controle é por chave `Dominio.Acao`:

```csharp
[HttpPost]
[Permission(Permissions.Item.Criar)]
public async Task<IActionResult> Criar(ItemRequest request) => ...
```

- `PermissionAttribute` é um `IAsyncAuthorizationFilter`: carrega as chaves do usuário via `IPermissionLoader` e devolve 403 se nenhuma bate.
- Chaves ficam em `Api/Common/Permissions.cs`, classes estáticas aninhadas: `Permissions.Item.Criar = "Item.Criar"`. Nunca string literal na action.
- A mesma lista de chaves existe no app em `PermissionEnum`. Mudou de um lado, muda do outro.
- `DISABLE_PERMISSIONS=1` desliga a checagem em ambiente local. Nunca em homolog ou produção.

## De onde vêm as chaves

`CustomPermissionLoader : IPermissionLoader` em `Api/Configuration`. Duas fontes possíveis:

| Fonte | Implementação |
|---|---|
| Perfil na claim do JWT | Dicionário estático perfil → chaves. Sem tabela. Usar quando o provedor externo define os perfis |
| Perfil e permissão no banco | Tabelas `Perfil`, `Permissao`, `PerfilPermissao`; loader consulta por `sub` com cache em memória até o `exp` do token |

## Filtros globais por perfil

Quando um perfil só pode ver parte dos dados (uma área, uma unidade, um módulo), o corte é um query filter do EF, não um `Where` em cada consulta. Modelo: `ActivableQueryFilter`. Crie `<Criterio>QueryFilter` em `Base.Repository/Database/Entity`, aplicado a toda entidade que implementa a interface marcadora (`IHaveAreaResponsavel`), lendo o perfil de `IHttpContextAccessor`.

## Regras fixas

- Segredo nunca no repositório: connection string com senha, chave privada, token de API, senha de fila.
- `Cors` vem de configuração, uma lista de origens; nunca `AllowAnyOrigin` com credenciais.
- Anexos e downloads passam por rota autenticada; nada de link direto para o share.
- Log nunca grava token, senha ou documento pessoal completo.
