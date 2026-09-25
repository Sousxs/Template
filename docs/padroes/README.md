# Padrões de projeto FGR

Handbook de arquitetura para novas aplicações da FGR: uma API em .NET e um app em React, com as mesmas pastas, camadas, convenções e contratos em todos os projetos. Quem abre um repositório da FGR encontra sempre a mesma estrutura.

Escopo: código e organização. Infraestrutura, pipelines e hospedagem ficam fora deste repositório.

## Como usar

| Você quer | Leia |
|---|---|
| Entender as regras que valem para tudo | [principios.md](principios.md) |
| Criar um projeto do zero | [checklist-novo-projeto.md](checklist-novo-projeto.md) |
| Criar uma entidade nova na API | [backend/06-feature-completa.md](backend/06-feature-completa.md) e [backend/templates/](backend/templates/) |
| Criar uma tela nova no app | [frontend/03-feature-completa.md](frontend/03-feature-completa.md) e [frontend/templates/](frontend/templates/) |
| Saber o que a API devolve e o app espera | [contratos/api-app.md](contratos/api-app.md) |
| Revisar um pull request | [checklist-pr.md](checklist-pr.md) |
| Saber o que melhorar no padrão e quando | [recomendacoes.md](recomendacoes.md) |
| Aplicar a marca e dar cara própria a um sistema | [frontend/09-identidade-visual.md](frontend/09-identidade-visual.md) |

## Índice

### Backend (.NET 8)

1. [Solution e projetos](backend/01-solution.md)
2. [Camadas e fluxo de uma requisição](backend/02-camadas-e-fluxo.md)
3. [Convenções](backend/03-convencoes.md)
4. [Persistência](backend/04-persistencia.md)
5. [Segurança: autenticação e permissões](backend/05-seguranca.md)
6. [Uma feature completa](backend/06-feature-completa.md)
7. [Testes](backend/07-testes.md)
8. [Templates](backend/templates/)

### Frontend (React 18)

1. [Stack](frontend/01-stack.md)
2. [Estrutura de pastas](frontend/02-estrutura.md)
3. [Uma feature completa](frontend/03-feature-completa.md)
4. [API, dados e erros](frontend/04-api-e-dados.md)
5. [Autenticação e permissões](frontend/05-auth-e-permissoes.md)
6. [Formulários](frontend/06-formularios.md)
7. [Layout, tema e i18n](frontend/07-layout-e-tema.md)
8. [Testes e capturas visuais](frontend/08-testes-e-capturas.md)
9. [Identidade visual: cores, logo e espaço de cada sistema](frontend/09-identidade-visual.md)
10. [Templates](frontend/templates/)

### Transversal

- [Contratos entre API e app](contratos/api-app.md)
- [Recomendações](recomendacoes.md)
- [Checklist de novo projeto](checklist-novo-projeto.md)
- [Checklist de pull request](checklist-pr.md)
- [Glossário](glossario.md)

## Versão

1.0, 2026-09-24. Mudanças em [CHANGELOG.md](CHANGELOG.md).
