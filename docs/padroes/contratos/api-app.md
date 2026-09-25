# Contratos entre API e app

O que a API devolve e o app espera. Mudança aqui é mudança nos dois lados, no mesmo pull request de handbook.

## Identidade

- Todo recurso é endereçado pelo `Uuid`: `GET /Produto/{uuid}`. O `Id` numérico não sai da API.
- Respostas de escrita devolvem o recurso completo (`ProdutoResponse`), com `uuid`.

## Rotas

| Ação | Rota | Resposta |
|---|---|---|
| Listar | `GET /<Entidade>?page=0&size=25&sort=nome,asc&<filtros>` | envelope de página |
| Combo | `GET /<Entidade>/select-items` | `[{ value: uuid, label }]` |
| Obter | `GET /<Entidade>/{uuid}` | objeto |
| Criar | `POST /<Entidade>` | 201 + objeto |
| Editar | `PUT /<Entidade>/{uuid}` | 200 + objeto |
| Ativar/inativar | `PATCH /<Entidade>/change-status/{uuid}` com `{ "active": bool }` | 200 |
| Exportar | `GET /<Entidade>/export?type=xlsx|csv|pdf&<filtros>` | blob com `content-disposition` |
| Sub-recurso | `GET /<Entidade>/{uuid}/<sub>` | lista ou objeto |
| Ação | `POST /<Entidade>/<acao>` ou `POST /<Entidade>/{uuid}/<acao>` | 200 + resultado |

Sem prefixo `/api` na API. O app em desenvolvimento usa `/api` como proxy do Vite e a fixture de testes remove o prefixo.

## Envelope de página

```json
{
  "content": [ ... ],
  "size": 25,
  "pageIndex": 0,
  "totalElements": 132,
  "totalPages": 6
}
```

`page` é 0-based nos dois lados. `sort` é `"campo,asc"` ou `"campo,desc"`; campo em camelCase como no Response. Filtro por texto é `contains`; por `uuid`, `bool` e enum é igualdade; filtro vazio é ignorado.

## Erros

```json
{
  "message": "Revise os campos.",
  "errors": { "nome": ["Informe o nome."], "codigo": ["Código já cadastrado."] },
  "domainErrors": ["Produto descontinuado não aceita alteração."],
  "validation": true
}
```

| Status | Quando | O que o app faz |
|---|---|---|
| 400 | Erro de domínio ou de campo | `errors` para os campos do formulário; `domainErrors` em toast |
| 401 | Sem token ou expirado | Limpa sessão e vai para `/login` |
| 403 | Sem a permissão da action | Toast "Sem permissão"; o app não deveria ter mostrado a ação |
| 404 | Recurso não existe ou fora do escopo do usuário | Toast e volta para a lista |
| 500 | Exceção | Toast genérico; `message` sem stack em produção |

## Autenticação

- `Authorization: Bearer <token>` em toda chamada.
- Login: `POST /Auth/login` (provedor externo) ou `POST /OAuth/token` (emissão própria). Resposta: `{ access_token, refresh_token?, nome, email, permissions: string[] }`.
- `permissions` são as chaves `DOMINIO.ACAO` já expandidas; o app não decide permissão por perfil.

## Datas e números

- Datas em ISO 8601 UTC com `Z`. Data sem hora como `YYYY-MM-DD`.
- Decimais como número JSON, nunca string. Moeda em reais com duas casas.
- Enum como string com o nome do valor (`EM_HOMOLOGACAO`); o app traduz.

## Importação e upload

- Upload: `multipart/form-data`, campo `file`.
- Importação com validação prévia: `POST /<Entidade>/importar?dryRun=true` devolve `{ totalLinhas, validas, comErro, erros: [{ linha, coluna, mensagem }] }` sem gravar; sem `dryRun`, grava as válidas e devolve o mesmo formato.

## Versionamento

Sem versão na URL. Mudança incompatível de contrato cria um campo novo e mantém o antigo por um ciclo; depois remove. O app e a API sobem juntos.
