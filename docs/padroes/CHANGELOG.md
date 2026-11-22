# Changelog

## 1.3 — 2026-11-22

- Handbook sem nome de empresa: namespaces `<Empresa>.<Sistema>.*`, skill de scaffold renomeada para `/handbook-feature`, tema renomeado para `brand-theme.css` com tokens `--brand-*` (cor primária em `--brand-primary`), URL da logo vira placeholder.

## 1.2 — 2026-11-18

- `backend/01-solution.md`: forma dos `Jobs` (`BackgroundService` com `PeriodicTimer`, intervalo em configuração, escopo por ciclo, exceção que nunca derruba a API, configuração inválida desliga só o job) e das integrações com sistema externo (uma interface por fonte, implementação simulada e real escolhidas por configuração, erro só por categoria, teste `Category=<Fonte>Real`). Referências entre projetos que entram com `Jobs` e `Integracao<Fonte>`. O projeto de integração passa a se chamar `Integracao<Fonte>` no texto, para não confundir com o `<Sistema>` do próprio sistema.
- `backend/07-testes.md` e `recomendacoes.md` (B5): os testes que precisam de SQL Server de verdade podem usar o servidor de testes da empresa, com banco descartável por teste, quando não há Docker; índice único entra na lista do que o InMemory não garante.

## 1.1 — 2026-11-14

- `backend/05-seguranca.md`: terceiro cenário de autenticação, emissão própria com credencial validada fora (desfechos e status do login, rotas `userinfo` e `logout`, encerramento antes do prazo, configuração e log). `FallbackPolicy` recomendada nos três cenários.
- `contratos/api-app.md` e `frontend/04-api-e-dados.md`: `503` no login; `401` e `403` na rota de login mostram a `message` na tela; `expires_in` e `perfil` na resposta do login; `GET /OAuth/userinfo` e `POST /OAuth/logout`; `429` com `Retry-After` no login quando a API limita tentativas; CORS expõe `Retry-After` e `X-Request-Id`.
- `backend/01-solution.md` e `checklist-novo-projeto.md`: a árvore tem 16 projetos, não 15.
- Constitution e prompt de projeto novo listam o terceiro cenário.

## 1.0 — 2026-09-24

Primeira versão: backend .NET 8 em N camadas com `Base.*`, frontend React 18 com PrimeReact e tsyringe, contratos, templates, checklists e recomendações.
