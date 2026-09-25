# Princípios

Cinco regras valem para qualquer decisão de código nos projetos da FGR.

## 1. Antes de escrever, suba a escada

Pare no primeiro degrau que resolve:

1. Isso precisa existir? Necessidade especulativa não entra.
2. Já existe neste repositório ou nas bibliotecas `Base.*`? Reutilize.
3. A biblioteca padrão do .NET ou do navegador faz? Use.
4. Uma dependência já instalada faz? Use. Nova dependência só quando poucas linhas não resolvem.
5. Cabe em uma linha? Uma linha.
6. Só então: o mínimo que funciona.

A escada corre depois de entender o problema, nunca no lugar de entender. Leia o fluxo inteiro que a mudança toca antes de escolher o degrau.

## 2. O que nunca se simplifica

Validação na fronteira (request da API, upload, importação), tratamento de erro que evita perda de dado, segurança, acessibilidade básica e o que o requisito pede por escrito. Código sem verificação está inacabado: toda lógica não trivial deixa um teste, o menor que falhe se a lógica quebrar.

## 3. Um atalho deliberado fica marcado

Quando uma simplificação tem limite conhecido, o código recebe um comentário no formato:

```
// ponytail: <limite>, <o que fazer quando chegar>
```

Exemplo: `// ponytail: lock global no estoque, trocar por lock por produto se passar de 50 movimentações/min`. O comando de auditoria de dívidas varre esses comentários e lista todos.

## 4. Mesma forma em todo projeto

Pastas, nomes, camadas e contratos são os deste handbook. Um projeto que precisa de algo diferente muda o handbook primeiro, por pull request, e depois o código.

## 5. Nome de negócio em português, nome de infraestrutura em inglês

`Produto`, `Categoria`, `CodigoBarras`, `ProdutoService`, `ProdutoRequest`. Sufixos e tipos de infraestrutura ficam em inglês: `Repository`, `Request`, `Response`, `Controller`, `Profile`, `Store`, `Page`.
