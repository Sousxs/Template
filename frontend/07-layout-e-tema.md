# Layout, tema e i18n

## Shell

- `AppLayout`: Toast global, `AutoLoader`, `Outlet`. Envolve tudo, público e privado.
- `AppLayoutMain`: `Header`, menu lateral, `.layout-content > Outlet`, máscara para o menu em mobile. Só rotas autenticadas.
- `AppLayoutStore`: `layoutMode`, `staticMenuInactive`, `overlayMenuActive`, `mobileMenuActive`.
- Breakpoint de mobile: 1024 px. Abaixo, menu vira overlay.

## Menu e breadcrumb

Cada feature declara seus itens em `pages/<feature>/config/<X>Menu.ts` como `AppMenuItem` (`label`, `icon`, `to`, `permissions`, `items`). `app/AppMenu.ts` monta a árvore com grupos (`Cadastros`, `Operação`, `Administração`). O mesmo `AppMenuItem` vira breadcrumb em `<X>Breadcrumb.ts`. Um item de menu, uma fonte.

## Página

`PageCard` é a casca de toda página: `title`, `breadcrumbs`, `titleSideContent` (botões), `children`. Fica em `components/shared/page-card/`.

## Tema

Tokens em CSS custom properties, um arquivo de entrada importado em `main.tsx` (`assets/theme/<sistema>-theme.css`), que importa variáveis, tema base, overrides do PrimeReact e responsivo. Componentes usam `var(--nome)`; nenhum hex em componente. Detalhe das cores e do espaço para identidade própria em [09-identidade-visual.md](09-identidade-visual.md).

## i18n

- `i18n/pt/translation.json` organizado por feature e por tipo: `item.titles.list`, `item.labels.nome`, `item.messages.saved`, `shared.actions.save`, `shared.errors.404`.
- `useInternationalization('item')` devolve `tTitle`, `tLabel`, `tMessage`, `tAction`, `tValidation`, `tEnum`, `tCustomPath`.
- `pt/primereact.json` traduz o PrimeReact; `pt/class_validator.json` as mensagens de validação.
- Enum da API tem texto em `item.enums.status.EM_USO`.

## Responsivo

Grid do primeflex (`col-12 md:col-6 lg:col-3`). Tabelas em mobile: colunas secundárias escondidas com `className="hidden md:table-cell"`; ações em menu de três pontos. Formulário em mobile: uma coluna.
