# Testes e capturas visuais

## Playwright com API mockada

A suíte E2E não precisa de API nem de banco. `e2e/fixtures/mock-api.ts` intercepta `**/api/**` com `page.route` e responde de um mapa `"GET /Item" → corpo`. Rota sem mock devolve 404 e aparece na tela.

```ts
test('cria item', async ({ page }) => {
    await seedSession(page, sessao);
    await mockApi(page, { ...routes, 'POST /Item': { status: 201, body: novoItem } });
    await page.goto('/item/new');
    await page.getByLabel('Nome').fill('Cadeira presidente');
    await page.getByRole('button', { name: 'Salvar' }).click();
    const body = await captureRequestBody(page, '/Item');
    expect(body).toMatchObject({ nome: 'Cadeira presidente' });
});
```

- `seedSession` grava sessão e permissões nos stores antes do primeiro script; pula o login.
- `captureRequestBody` devolve o corpo enviado: testa o contrato com a API sem a API.
- `expectNoSeriousA11y(page)` roda o axe e falha com violação `critical` ou `serious`. Uma chamada por página nova.
- Projetos: `desktop` (Chrome) e `mobile-360` (Pixel 5 em 360 px). Todo spec roda nos dois.

## O que testar

| Tipo | Obrigatório |
|---|---|
| E2E por feature | Listagem carrega com dados mockados; criar envia o corpo certo; erro 400 aparece no campo; sem permissão o botão não existe |
| Unit (Vitest) | Funções de `core/utils` e `core/query`; decorators de validação |
| Acessibilidade | `expectNoSeriousA11y` em cada página |

Sem teste de componente isolado com Testing Library, salvo componente de `shared/` com lógica própria.

## Capturas visuais

`e2e/_visual.spec.ts` tira uma captura por tela em dois viewports, com os mesmos mocks, sem asserções. Saída em `visual-shots/d-*.png` (1280×800) e `visual-shots/m-*.png` (390×800), versionada. Serve para documento de aprovação, treinamento, revisão de layout e para ver o efeito de uma mudança de tema no pull request.

```sh
pnpm exec playwright test e2e/_visual.spec.ts --project=desktop
```

Cada teste fixa o próprio viewport e roda só no projeto `desktop`, para não gravar o mesmo arquivo duas vezes. Tela nova = uma linha na lista do `describe` e, se chamar rota nova, uma entrada no mapa de mocks.
