# Segurança

## Autenticação

Três cenários. Escolha um por projeto e registre no README.

| Cenário | Quando | O que a API faz |
|---|---|---|
| Provedor externo | O login já existe fora (provedor corporativo, AD) e o token dele serve como sessão do sistema | `AddJwtBearer` validando issuer, audience e assinatura do provedor. Sem senha, sem refresh, sem controller de OAuth |
| Emissão própria | Usuários e senhas vivem no sistema | `OAuthController` com `POST /OAuth/token` e `POST /OAuth/refresh-token`, JWT assinado com chave RSA em `OAuthConfig`, `BasicAuthenticationHandler` para integrações máquina a máquina |
| Emissão própria com credencial validada fora | A senha é validada num sistema externo (portal interno, AD), mas o sistema precisa de sessão própria: o token externo não pode ser reutilizado, ou a duração, o encerramento ou o perfil da sessão são do sistema | `OAuthController` com `POST /OAuth/token`, que repassa a credencial ao sistema externo e, se ele aceitar, emite o JWT da API com `OAuthConfig`. Sem senha nem conta local, sem refresh. Detalhes abaixo |

Em todos: `[Authorize]` em todo controller; rotas públicas listadas explicitamente com `[AllowAnonymous]`. Prefira a política padrão que exige usuário autenticado (`FallbackPolicy`), para que um controller novo já nasça protegido.

### Emissão própria com credencial validada fora

- **Cliente do sistema externo** em projeto próprio `<Empresa>.<Sistema>.Integracao<Externo>` ([01-solution.md](01-solution.md)). Devolve um resultado fechado, sem exceção para recusa: autenticado (identidade e permissões), credencial inválida, sem permissão, indisponível. Todas as chamadas do login dividem um único limite de tempo.
- **Desfecho → status** em `POST /OAuth/token`:

  | Desfecho | Status |
  |---|---|
  | Entrou | 200 |
  | Campo vazio ou fora do formato | 400 (envelope de erro, sem consultar o sistema externo) |
  | Credencial recusada pelo sistema externo | 401 com `message` genérica |
  | Autenticou, mas sem permissão para a ferramenta | 403 com `message` que diz onde pedir acesso |
  | Limite de tentativas excedido, se o sistema limita o login | 429 com `message` genérica e `Retry-After`, sem consultar o sistema externo |
  | Sistema externo indisponível, lento ou não configurado | 503 com `message` |

- **Desfechos nas camadas**: o serviço de login não sinaliza recusa por exceção nem por `IDomainValidation`. Devolve o resultado fechado e deixa pronto o evento de acesso, se o sistema registra acessos. A action usa `ExecuteWithSaveChangesAsync`, salva em qualquer desfecho, para não perder o registro da recusa, e converte o resultado no status. `IDomainValidation` fica só para o 400 de campo, que não grava nada.
- **Rotas**: `POST /OAuth/token` (anônima), `GET /OAuth/userinfo` (dados da sessão, sem consultar o sistema externo) e `POST /OAuth/logout`. Sem `refresh-token`: a sessão tem duração fixa, informada em `expires_in`; ao expirar, a pessoa entra de novo.
- **Encerrar antes do prazo** (logout, perfil alterado): o token carrega um carimbo de sessão do usuário, comparado a cada requisição com o atual. Cache do carimbo só em memória e com validade curta, declarada no README como janela de revogação.
- **Perfil**: vem das permissões que o sistema externo devolve e vira chaves pelo dicionário estático (seção "De onde vêm as chaves"). O token externo vive só dentro da requisição de login: não vai para banco, cache, sessão nem log.
- **Configuração**: endereços do sistema externo vêm de configuração. Sem eles a API sobe, registra aviso e responde 503 no login. Fora de `Development` e `Test`, endereço que não comece com `https://` conta como não configurado. Sem a chave de assinatura do JWT, a API não inicia.
- **Log**: nunca registra a senha, o token externo nem o corpo das chamadas ao sistema externo.

## Autorização por permissão

Não há roles nem policies do ASP.NET. O controle é por chave `Dominio.Acao`:

```csharp
[HttpPost]
[Permission(Permissions.Produto.Criar)]
public async Task<IActionResult> Criar(ProdutoRequest request) => ...
```

- `PermissionAttribute` é um `IAsyncAuthorizationFilter`: carrega as chaves do usuário via `IPermissionLoader` e devolve 403 se nenhuma bate.
- Chaves ficam em `Api/Common/Permissions.cs`, classes estáticas aninhadas: `Permissions.Produto.Criar = "Produto.Criar"`. Nunca string literal na action.
- A mesma lista de chaves existe no app em `PermissionEnum`. Mudou de um lado, muda do outro.
- `DISABLE_PERMISSIONS=1` desliga a checagem em ambiente local. Nunca em homolog ou produção.

## De onde vêm as chaves

`CustomPermissionLoader : IPermissionLoader` em `Api/Configuration`. Duas fontes possíveis:

| Fonte | Implementação |
|---|---|
| Perfil na claim do JWT | Dicionário estático perfil → chaves. Sem tabela. Usar quando o provedor externo define os perfis |
| Perfil e permissão no banco | Tabelas `Perfil`, `Permissao`, `PerfilPermissao`; loader consulta por `sub` com cache em memória até o `exp` do token |

## Filtros globais por perfil

Quando um perfil só pode ver parte dos dados (uma filial, uma empresa, um módulo), o corte é um query filter do EF, não um `Where` em cada consulta. Modelo: `ActivableQueryFilter`. Crie `<Criterio>QueryFilter` em `Base.Repository/Database/Entity`, aplicado a toda entidade que implementa a interface marcadora (`IHaveFilial`), lendo o perfil de `IHttpContextAccessor`.

## Regras fixas

- Segredo nunca no repositório: connection string com senha, chave privada, token de API, senha de fila.
- `Cors` vem de configuração, uma lista de origens; nunca `AllowAnyOrigin` com credenciais. Expõe `Retry-After` e `X-Request-Id` (`WithExposedHeaders`).
- Anexos e downloads passam por rota autenticada; nada de link direto para o share.
- Log nunca grava token, senha ou documento pessoal completo.
