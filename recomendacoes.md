# Recomendações

O padrão descrito neste handbook vem de sistemas em produção. Estas são as mudanças que valem a pena em relação ao que esses sistemas fazem hoje, com custo, ganho e o momento de aplicar. Projeto novo já nasce com todas as de custo baixo.

## Backend

| # | Recomendação | Ganho | Custo | Quando |
|---|---|---|---|---|
| B1 | Segredos fora do repositório: connection string com senha, chaves privadas, tokens de API. User Secrets em desenvolvimento, variável de ambiente nos demais. `appsettings.*.json` versionados só com valores não sensíveis | Segurança; rotação sem commit | Baixo | Projeto novo: dia 1. Existente: próxima release |
| B2 | Ativar `builder.AddActivableQueryFilter()` no `AppDbContext`. O filtro global existe mas não é chamado; sem ele todo `Where` precisa lembrar de `Active` | Menos bug de registro inativo aparecendo | Baixo, com regressão nas listagens | Projeto novo: dia 1 |
| B3 | `.editorconfig` e analyzers do .NET ligados, com `TreatWarningsAsErrors` em projetos novos | Estilo uniforme sem revisão manual | Baixo no novo, médio no existente | Projeto novo |
| B4 | `[Permission]` só com constantes de `Permissions.cs`; proibir string literal por analyzer ou revisão | Renomear permissão sem quebrar em silêncio | Baixo | Sempre |
| B5 | Testes de integração para tudo que o EF InMemory não executa (`SEQUENCE`, computed column, índice filtrado, view) em SQL Server com Testcontainers, numa segunda factory | Bug de banco pego antes de homolog | Médio | Quando a primeira migration usar um desses recursos |
| B6 | `IEntityTypeConfiguration<T>` por entidade quando o `AppDbContext` passar de 300 linhas | Arquivo por entidade, revisão mais fácil | Baixo | No projeto que crescer |
| B7 | Health check em `/health` desde o primeiro deploy, com verificação do SQL Server | Monitoramento sem trabalho depois | Baixo | Projeto novo |
| B8 | Token de concorrência (`RowVersion`) só em entidades de saldo ou contador | Evita perda de escrita concorrente onde importa | Baixo | Quando a entidade existir |
| B9 | `Base.*` publicadas como NuGet interno; projetos referenciam pacote, não pasta | Correção em um lugar; versão por projeto | Médio: precisa de um feed | Quando o segundo projeto novo nascer |
| B10 | Configuração de rate limit por ambiente em `appsettings`, nunca desligada por código | Proteção que não some num commit | Baixo | Sempre |
| B11 | Auditoria em SQL na mesma transação por padrão; publisher assíncrono (fila e banco de documentos) só quando a FGR centralizar auditoria entre sistemas | Menos infraestrutura por sistema; linha do tempo consistente | Zero agora | Decisão por sistema |
| B12 | Uma factory de testes que sobe a API real (`WebApplicationFactory`) é o mínimo de todo projeto; um teste por action de escrita e por regra de autorização | Contrato e permissão testados sem front | Médio | Projeto novo, sprint 1 |

## Frontend

| # | Recomendação | Ganho | Custo | Quando |
|---|---|---|---|---|
| F1 | Sem `deprecated/`. `PageCard` e o que mais estiver lá e ainda for padrão sobem para `components/shared`; o resto é apagado | Nenhum import de legado em código novo | Baixo no novo | Projeto novo |
| F2 | `.env.example` versionado sem valores; `.env.*` no `.gitignore`. Tokens de observabilidade nunca no repositório | Segurança | Baixo | Projeto novo: dia 1 |
| F3 | Uma biblioteca de validação (class-validator) e uma de formulário (react-hook-form). Sem yup, zod ou unform residuais | Menos conceito para aprender | Baixo no novo | Projeto novo |
| F4 | `queryClient` com defaults (`staleTime`, `retry`, `refetchOnWindowFocus`) em vez de repetir em cada hook | Menos código; comportamento igual em toda tela | Baixo | Projeto novo |
| F5 | `React.lazy` por router de feature no `AppRouter` | Primeiro carregamento menor conforme o app cresce | Baixo | Quando passar de dez features |
| F6 | Suíte Playwright com API mockada desde a primeira tela; `_visual.spec.ts` versionado com as capturas | Regressão de contrato e de layout sem backend | Médio | Projeto novo, sprint da primeira tela |
| F7 | ESLint com `--max-warnings 0`. Warning é erro | Dívida não acumula | Baixo no novo | Projeto novo |
| F8 | Componentes compartilhados para entidades de mesma forma (mestres com nome, escopo e ativo) | Menos arquivo repetido | Baixo | Quando houver três ou mais mestres simples |
| F9 | Storybook só se houver design system próprio com componentes documentados; sem isso, remover | Menos ferramenta parada | Baixo | Projeto novo |
| F10 | Sessão e permissões vindas da resposta de login, nunca decodificadas do JWT no app | O app não depende do formato do token | Zero | Sempre |
| F11 | Tema por tokens CSS em dois arquivos: núcleo FGR fixo e identidade do sistema (acento, nome, símbolo). Nenhum hex em componente | Marca consistente e cara própria por sistema; retema sem tocar tela | Baixo | Projeto novo |
| F12 | Login como tela própria com a logo oficial e o nome do sistema, sem reutilizar o formulário operacional | Primeira impressão igual em toda a FGR | Baixo | Projeto novo |

## Transversal

| # | Recomendação | Ganho | Custo | Quando |
|---|---|---|---|---|
| T1 | Chaves de permissão geradas de uma fonte só (arquivo JSON no repositório da API) para `Permissions.cs` e `PermissionEnum.ts` | Impossível divergir | Médio: um script de geração | Quando houver mais de 30 chaves |
| T2 | Todo pull request com a captura visual da tela alterada anexada | Revisão de layout sem subir o app | Baixo | Sempre |
| T3 | Handbook versionado; projeto declara no README qual versão segue | Saber o que cada sistema já adotou | Baixo | Sempre |
| T4 | Documentos e templates de apresentação com o mesmo vinho `#901C1C` da marca; templates antigos com outro vermelho convergem na próxima revisão | Uma marca só, do app ao PDF | Baixo | Próxima revisão de cada template |
