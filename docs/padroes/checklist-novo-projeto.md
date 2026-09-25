# Checklist de novo projeto

## Passo 0: o template

- [ ] Cada repositório (`<sistema>-api`, `<sistema>-app`) nasce como cópia deste template ("Use this template" no GitHub ou clone + novo remote).
- [ ] `scripts/setup.ps1` rodado uma vez por máquina.
- [ ] `PROJECT-COMMANDS.md` com os caminhos reais; `.specify/memory/constitution.md` com a seção "Este sistema" preenchida (`/speckit-constitution`).
- [ ] Primeira feature pela esteira (`scripts/new-feature.ps1`); entidade e tela geradas com `/fgr-feature`.

## Antes de codar

- [ ] Nome do sistema (curto, substantivo, em português) e sigla para namespaces: `FGR.<Sistema>`.
- [ ] Cenário de autenticação escolhido: provedor externo ou emissão própria ([backend/05-seguranca.md](backend/05-seguranca.md)).
- [ ] Fonte das permissões: claim de perfil ou tabelas.
- [ ] Acento e símbolo do produto registrados em [frontend/09-identidade-visual.md](frontend/09-identidade-visual.md), seção 3.2.
- [ ] Domínios (pastas) listados; cada entidade em um domínio.

## Backend

- [ ] Solution com os 15 projetos de [backend/01-solution.md](backend/01-solution.md); `Base.*` na versão atual.
- [ ] `Directory.Build.props`, `Usings.cs` por projeto, `Configure.cs` encadeando os módulos.
- [ ] `AppDbContext` com `AddActivableQueryFilter()` e um `Configurar<Dominio>` por domínio.
- [ ] `Permissions.cs` com as chaves iniciais; `CustomPermissionLoader` implementado.
- [ ] Segredos fora do repositório; `appsettings.json` sem senha.
- [ ] `/health` respondendo.
- [ ] `Test` com `CustomApplicationFactory` e um teste de integração passando.
- [ ] Primeira entidade criada pelo passo a passo de [backend/06-feature-completa.md](backend/06-feature-completa.md).

## Frontend

- [ ] Projeto Vite com a árvore de [frontend/02-estrutura.md](frontend/02-estrutura.md) e os aliases nos dois configs.
- [ ] `config/`, `core/`, `layouts/`, `components/shared/`, `stores/`, `i18n/` na versão atual do padrão.
- [ ] `fgr-theme.css` e `<sistema>-identity.css` importados em `main.tsx`; logo oficial em `public/`.
- [ ] Login com o card padrão e o nome do sistema.
- [ ] `PermissionEnum` espelhando `Permissions.cs`.
- [ ] `.env.example` sem valores; `.env.*` ignorados.
- [ ] ESLint com zero warnings, Prettier, Husky.
- [ ] `e2e/fixtures/mock-api.ts`, `_visual.spec.ts` e um spec da primeira tela passando.
- [ ] Primeira feature criada pelo passo a passo de [frontend/03-feature-completa.md](frontend/03-feature-completa.md).

## Repositórios

- [ ] Dois repositórios: `<sistema>-api` e `<sistema>-app`.
- [ ] README de cada um com: nome do sistema, versão do handbook, como rodar, cenário de autenticação, acento.
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` (já vem do template; é o [checklist-pr.md](checklist-pr.md) mais os gates da esteira).
