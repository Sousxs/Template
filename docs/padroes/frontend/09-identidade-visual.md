# Identidade visual

Dois níveis. O **núcleo de marca** é igual em todo sistema da FGR e não se discute por projeto. O **espaço de identidade** é o que cada sistema preenche do seu jeito, dentro de regras que impedem duas coisas: um app que não parece FGR, e dois apps que parecem o mesmo.

O padrão de origem descreve as peças com classes utilitárias; aqui elas estão traduzidas para tokens CSS e para o PrimeReact. Os valores são os mesmos.

---

## 1. Núcleo de marca (fixo)

### 1.1 Cor de marca

| Token | Valor | Uso |
|---|---|---|
| `--fgr-brand` | `#901C1C` | Botão primário, aba ativa, focus, item de menu ativo, link de ação, página ativa da paginação, série principal de gráfico |
| `--fgr-brand-hover` | `#7F1D1D` | Hover do primário |
| `--fgr-brand-soft` | `rgba(144, 28, 28, 0.08)` a `0.12` | Focus ring, linha selecionada, fundo de opção escolhida |
| `--fgr-brand-deep` | `#641212` | Só em gradiente de hero ou avatar (`135deg`, `#901C1C → #641212`) |

Um vermelho só. Nunca o vermelho de kit (`#dc2626`, `red-600`), nunca azul, verde, roxo ou laranja de framework como cor de marca ou de focus.

### 1.2 Neutros

| Token | Valor | Uso |
|---|---|---|
| `--fgr-page` | gradiente `#F9FAFB → #F3F4F6` (135°) | Fundo de página operacional |
| `--fgr-surface` | `#FFFFFF` | Card, tabela, header, modal |
| `--fgr-border` | `#E5E7EB` | Card, input, tabela |
| `--fgr-border-soft` | `#F3F4F6` | Divisor interno |
| `--fgr-text` | `#1F2937` | Títulos, valores |
| `--fgr-text-2` | `#6B7280` | Subtítulo, label, hint |
| `--fgr-text-3` | `#9CA3AF` | Hint de 11 px, ícone de vazio |
| `--fgr-overlay` | `rgba(0, 0, 0, 0.5)` | Modal |

### 1.3 Semântica de status (pills)

Fundo claro e texto da mesma família; `border-radius: 999px`, `font-size: 12px`, `font-weight: 500`, `padding: 2px 10px`.

| Tom | Fundo / texto | Quando |
|---|---|---|
| Sucesso | `#DCFCE7` / `#166534` | Ativo, concluído, online |
| Atenção | `#FEF3C7` / `#92400E` | Pendente, vencendo, atrasado |
| Erro | `#FEE2E2` / `#991B1B` | Falhou, bloqueado, vencido |
| Info | `#DBEAFE` / `#1D4ED8` | Métrica neutra, em execução |
| Intermediário | `#E0F2FE` / `#0C4A6E` | Reservado, em análise |
| Tipo | `#EDE9FE` / `#4C1D95` | Tag de tipo, nunca de saúde |
| Neutro | `#F3F4F6` / `#374151` | Inativo, cancelado, desconhecido |

Toast: sucesso `#F0FDF4`/`#15803D`; erro `#FEF2F2`/`#901C1C`; atenção `#FFFBEB`/`#D97706`; info `#EFF6FF`/`#2563EB`. Canto superior direito, raio 8 px.

### 1.4 Tipografia

Roboto, fallback `sans-serif`. Título de página 30 px semibold, letra levemente condensada; subtítulo 16 px `--fgr-text-2` em uma linha; título de card 14 px semibold; label 12 px medium `--fgr-text-2`; hint 11 px `--fgr-text-3`; corpo 14 px. Números tabulares (`font-variant-numeric: tabular-nums`) em métricas, valores e IDs. Código em monoespaçada 12 px sobre `#F9FAFB`.

### 1.5 Raio e sombra

| Peça | Raio | Sombra |
|---|---|---|
| Shell de página com abas | 16 px | leve + borda |
| Card, KPI, tabela | 12 px | leve |
| Botão, input, chip | 8 px | nenhuma |
| Modal | 12 px | `0 10px 25px rgba(0,0,0,0.2)` |
| Pill | 999 px | nenhuma |

### 1.6 Logo

Um arquivo, sem redesenho, sem texto "FGR" no lugar da imagem, sem filtro de cor:

```
https://res.cloudinary.com/fgrinc/image/upload/v1741869949/assinatura/icons/fgr-gray_rvfeqp.png
```

`alt="FGR"`, `object-fit: contain`. Constante `FGR_LOGO_URL` em `config/`. Servir uma cópia local em `public/` para não depender do CDN.

| Onde | Como | Nunca |
|---|---|---|
| Login | PNG com `max-width: 150px`, centralizado; abaixo, **uma** linha com o nome do sistema (14 px, medium, `--fgr-text-2`) | Título "FGR", H1 do app, "Login via..." |
| Header | PNG com `height: 28px`; divisor 1 px `--fgr-border`; nome do sistema 16 px medium `#4B5563` | Trocar a imagem por texto vinho |
| Splash de boot | PNG a 120 px com pulso suave e spinner com topo `#901C1C` | Spinner sozinho |
| Menu lateral | Quadrado 44 px, raio 16 px, gradiente `#901C1C → #641212`, letras "FGR" e o nome do produto em texto | O PNG grande no menu |
| Corpo, card, modal, botão | Sem logo | Marca repetida |

### 1.7 Login

Tela própria, não reutiliza os componentes de formulário operacional. Fundo `#F3F4F6 → #E5E7EB`, um card centralizado de 400 px, fundo branco a 90%, raio 12 px, borda `#E0E0E0`, sombra `0 10px 25px rgba(0,0,0,0.1)`, `padding: 30px`. Dentro, na ordem: logo, nome do sistema, Usuário, Senha, botão **Login**. Inputs com fundo `#F8F8F8`, borda 2 px transparente, foco borda `#901C1C` com brilho `rgba(144,28,28,0.3)`. Sem label, sem asterisco, placeholder `Usuário` e `Senha`. Botão sempre vinho; desabilitado só durante `Entrando...`. Sistemas com login por provedor externo mantêm o mesmo card e trocam os campos pelo botão do provedor.

### 1.8 Interação

- Focus visível sempre em vermelho de marca.
- Botão primário: um por barra. Secundário com borda `#D1D5DB`. Ação de linha em vinho, destrutiva em `#DC2626` só no ícone de lixeira.
- Confirmação destrutiva em modal, confirmar em `#901C1C`; nunca `window.confirm`.
- Vazio com ícone em círculo cinza, título do vazio e uma linha dizendo o que fazer.
- Datas em `pt-BR` a partir de UTC; vazio é `—`.

---

## 2. Tradução para o PrimeReact

Arquivo de entrada `src/assets/theme/fgr-theme.css`, importado em `main.tsx` depois do tema base do PrimeReact. Ele define os tokens acima e sobrescreve as variáveis do tema:

```css
:root {
    --fgr-brand: #901c1c;
    --fgr-brand-hover: #7f1d1d;
    --fgr-brand-soft: rgba(144, 28, 28, 0.1);
    --fgr-brand-deep: #641212;
    --fgr-surface: #ffffff;
    --fgr-border: #e5e7eb;
    --fgr-border-soft: #f3f4f6;
    --fgr-text: #1f2937;
    --fgr-text-2: #6b7280;
    --fgr-text-3: #9ca3af;

    /* PrimeReact */
    --primary-color: var(--fgr-brand);
    --primary-color-text: #ffffff;
    --highlight-bg: var(--fgr-brand-soft);
    --highlight-text-color: var(--fgr-brand);
    --focus-ring: 0 0 0 2px var(--fgr-brand-soft);
    --surface-ground: #f3f4f6;
    --surface-card: var(--fgr-surface);
    --surface-border: var(--fgr-border);
    --text-color: var(--fgr-text);
    --text-color-secondary: var(--fgr-text-2);
    --font-family: 'Roboto', sans-serif;
    --border-radius: 8px;
}
```

Depois dele, `src/assets/theme/<sistema>-identity.css` com o que é do sistema (seção 3). Componentes usam só variáveis; nenhum hex em `.tsx`.

Ícones: primeicons é o conjunto base do PrimeReact; onde faltar, `@phosphor-icons/react` ou `lucide-react`, um só deles por sistema. Nunca emoji como ícone.

---

## 3. Espaço de identidade (varia por sistema)

O que a marca fixa acima cobre é o esqueleto: cor primária, neutros, tipografia, logo, login, feedback. Todo o resto é do sistema, e cada sistema deve decidir de propósito, não herdar por inércia.

### 3.1 O que cada sistema define

| Peça | Livre para o sistema | Regra que segura a coerência |
|---|---|---|
| **Acento** | Uma cor de acento própria, escolhida da paleta da seção 3.2 | Nunca em botão primário, focus, aba ativa, menu ativo, paginação. Vive em ícones de KPI, faixas de dashboard, gráficos secundários, cabeçalho de seção, marcador da categoria principal. Cobre no máximo um quinto do que tem cor na tela |
| **Símbolo do produto** | Um ícone que representa o sistema, ao lado do nome no header e no menu | Da mesma família de ícones do sistema; tamanho 20 px no header, 24 px no menu; sem criar logotipo novo |
| **Nome do sistema** | Nome curto em português, substantivo | Aparece sempre depois da logo FGR; nunca no lugar dela |
| **Home** | Dashboard de KPIs, catálogo de cards, lista direta ou hero com busca | Hero com gradiente vinho só em home de catálogo, nunca em tela operacional |
| **Família de KPI** | Cards brancos com ícone 44 px no acento, ou faixas tintadas com valor grande | Uma família por faixa de KPIs; não misturar |
| **Navegação** | Menu lateral fixo, menu lateral em gaveta, ou só header com abas | Sistemas com até quatro áreas cabem em header com abas; acima disso, menu lateral |
| **Densidade** | Tabelas compactas ou confortáveis, cards grandes ou pequenos | A mesma densidade em todo o sistema |
| **Ilustração de vazio** | Ícone da família do sistema, no acento, ou um pictograma próprio em cinza | Mesmo estilo em todos os vazios do sistema |
| **Tom das mensagens** | Direto ("Produto cadastrado") ou acolhedor ("Pronto, o produto já está no catálogo") | Um tom, o sistema inteiro |
| **Fundo de página** | O gradiente cinza padrão ou branco liso | Nunca fundo escuro nas telas logadas |
| **Header** | Linha fina de acento sob o header, ou nenhuma | 2 px no máximo |

### 3.2 Paleta de acentos

Cada sistema escolhe **um** acento. Dois sistemas não repetem acento. A paleta foi montada para conviver com o vinho sem competir com ele.

| Acento | Valor | Suave | Reservado para |
|---|---|---|---|
| Petróleo | `#0F766E` | `#CCFBF1` | livre |
| Ardósia | `#334155` | `#E2E8F0` | livre |
| Oliva | `#4D7C0F` | `#ECFCCB` | livre |
| Âmbar queimado | `#B45309` | `#FEF3C7` | livre |
| Índigo | `#3730A3` | `#E0E7FF` | livre |
| Cobre | `#9A3412` | `#FFEDD5` | livre |

Quem escolher registra aqui, no pull request. O acento entra em `<sistema>-identity.css`:

```css
:root {
    --sys-name: 'Nome do sistema';
    --sys-accent: #0f766e;
    --sys-accent-soft: #ccfbf1;
    --sys-accent-text: #134e4a;
}
```

### 3.3 Dois sistemas hipotéticos, mesmo núcleo

**Um catálogo de materiais.** Acento petróleo; ícone de caixa ao lado do nome no header e no menu. Home é dashboard: quatro KPIs em cards brancos com ícone 44 px em petróleo suave; abaixo, tabela de produtos esgotados e gráfico de produtos por categoria em petróleo. Menu lateral fixo em desktop, gaveta em mobile, com as seções Catálogo, Cadastros e Administração. Tabelas confortáveis; a coluna de status usa as pills da seção 1.3; a categoria aparece como chip cinza com o ícone da categoria. Vazio: caixa em petróleo, "Nenhum produto nesta categoria", "Cadastre o primeiro ou importe a planilha". Tom direto: "Produto cadastrado", "Preço atualizado", "Planilha importada: 141 produtos, 7 linhas com erro".

**Uma agenda de vistorias.** Acento ardósia; ícone de calendário. Home é a agenda da semana, sem KPIs. Header com abas (Agenda, Vistorias, Configurações), sem menu lateral. Tabelas compactas, porque a tela é de operação rápida. Vazio: calendário em ardósia, "Semana livre", "Agende a primeira vistoria". Tom acolhedor: "Pronto, a vistoria está agendada", "Tudo em dia por aqui".

Os dois são FGR na primeira olhada e diferentes na segunda: mesma logo, mesmo vinho nos botões, mesmos neutros, mesmas pills; acento, símbolo, home, navegação, densidade e tom próprios.

### 3.4 O que não pode virar identidade

- Mudar o vermelho, o cinza, a fonte ou a logo.
- Segundo vermelho ou segundo acento.
- Tema escuro em tela logada.
- Logo do produto desenhada; o produto é nome, ícone e acento.
- Copiar a home de outro sistema da FGR sem motivo próprio.

---

## 4. Documentos e apresentações

Documentos gerados pelos sistemas (PDF, XLSX, e-mail) e material de apresentação usam a mesma logo e o mesmo vinho `#901C1C` em barras e destaques. Templates antigos que usam outro vermelho convergem para este valor na próxima revisão.
