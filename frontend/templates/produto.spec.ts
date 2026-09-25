import { test, expect, mockApi, seedSession, captureRequestBody, expectNoSeriousA11y, pagina } from './fixtures/mock-api';

const sessao = { access_token: 'e2e', nome: 'Ana Souza', email: 'ana.souza@fgr.com.br', permissions: ['PRODUTO.LISTAR', 'PRODUTO.CRIAR', 'PRODUTO.EDITAR'] };
const produtos = [{ uuid: 'i-1', codigo: 'SKU-000001', nome: 'Cimento CP-II 50 kg', categoriaNome: 'Cimento', status: 'EM_HOMOLOGACAO', active: true }];
const routes = {
    'GET /Produto': { body: pagina(produtos) },
    'GET /Categoria/select-items': { body: [{ value: 'c-1', label: 'Cimento' }] },
    'POST /Produto': { status: 201, body: produtos[0] }
};

test('lista produtos', async ({ page }) => {
    await seedSession(page, sessao);
    await mockApi(page, routes);
    await page.goto('/produto');
    await expect(page.getByText('SKU-000001')).toBeVisible();
    await expectNoSeriousA11y(page);
});

test('cria produto e envia o corpo esperado', async ({ page }) => {
    await seedSession(page, sessao);
    await mockApi(page, routes);
    await page.goto('/produto/new');
    await page.getByLabel('Nome').fill('Tijolo cerâmico 9 furos');
    await page.getByLabel('Categoria').click();
    await page.getByText('Cimento').click();
    const [body] = await Promise.all([captureRequestBody(page, '/Produto'), page.getByRole('button', { name: 'Salvar' }).click()]);
    expect(body).toMatchObject({ nome: 'Tijolo cerâmico 9 furos', categoriaUuid: 'c-1' });
});

test('sem permissão o botão Novo não existe', async ({ page }) => {
    await seedSession(page, { ...sessao, permissions: ['PRODUTO.LISTAR'] });
    await mockApi(page, routes);
    await page.goto('/produto');
    await expect(page.getByRole('button', { name: 'Novo' })).toHaveCount(0);
});
