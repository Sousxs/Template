import { test, expect, mockApi, seedSession, captureRequestBody, expectNoSeriousA11y, pagina } from './fixtures/mock-api';

const sessao = { access_token: 'e2e', nome: 'Pedro Rocha', email: 'pedro@fgr.com.br', permissions: ['ITEM.LISTAR', 'ITEM.CRIAR', 'ITEM.EDITAR'] };
const itens = [{ uuid: 'i-1', codigoPatrimonio: 'PAT-000001', nome: 'Cadeira presidente', categoriaNome: 'Cadeira', status: 'EM_USO', active: true }];
const routes = {
    'GET /Item': { body: pagina(itens) },
    'GET /Categoria/select-items': { body: [{ value: 'c-1', label: 'Cadeira' }] },
    'POST /Item': { status: 201, body: itens[0] }
};

test('lista bens', async ({ page }) => {
    await seedSession(page, sessao);
    await mockApi(page, routes);
    await page.goto('/item');
    await expect(page.getByText('PAT-000001')).toBeVisible();
    await expectNoSeriousA11y(page);
});

test('cria bem e envia o corpo esperado', async ({ page }) => {
    await seedSession(page, sessao);
    await mockApi(page, routes);
    await page.goto('/item/new');
    await page.getByLabel('Nome').fill('Mesa de reunião');
    await page.getByLabel('Categoria').click();
    await page.getByText('Cadeira').click();
    const [body] = await Promise.all([captureRequestBody(page, '/Item'), page.getByRole('button', { name: 'Salvar' }).click()]);
    expect(body).toMatchObject({ nome: 'Mesa de reunião', categoriaUuid: 'c-1' });
});

test('sem permissão o botão Novo não existe', async ({ page }) => {
    await seedSession(page, { ...sessao, permissions: ['ITEM.LISTAR'] });
    await mockApi(page, routes);
    await page.goto('/item');
    await expect(page.getByRole('button', { name: 'Novo' })).toHaveCount(0);
});
