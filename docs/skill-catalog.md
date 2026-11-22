# Catálogo de packs opcionais

> Nada daqui vem pré-instalado: cada skill instalada adiciona uma linha de descrição em **toda** sessão (custo de contexto permanente). Instale por projeto, só o que a feature pede, e remova o que não usar.

## Frontend / Design

| Pack | Instalar | Quando usar |
|------|----------|-------------|
| **hallmark** (Nutlope) | `npx skills add nutlope/hallmark` (+ `.cursor/rules/hallmark.mdc` p/ Cursor) | Landing/marketing HTML+CSS; modo `study` gera `design.md` (DNA de design) p/ brownfield UI; modo `audit` pontua UI existente |
| **emilkowalski/skills** | `npx skills@latest add emilkowalski/skills` → **apague o que não usar**; mantenha `pick-ui-library` (evita componente reinventado) e, se app com muita animação, `animate` + `review-animations` | Apps com frontend rico |
| **anthropics/skills** | `/plugin marketplace add anthropics/skills` → instale só `webapp-testing` | Testes de browser (Playwright) em web apps |

## Diagramas / Documentação

| Pack | Instalar | Quando usar |
|------|----------|-------------|
| **archify** | `npx -y skills add tt-a1i/archify -g` | Mapa de arquitetura interativo a partir do código (nós com evidência git); saída em `specs/NNN-nome/diagrams/`; delta Before/After casa com a auditoria de drift |

## Review cross-model (segunda opinião de outro fornecedor)

| Pack | Instalar | Quando usar |
|------|----------|-------------|
| **codex-plugin-cc** (OpenAI) | `/plugin marketplace add openai/codex-plugin-cc` → `/plugin install codex@openai-codex` → `/codex:setup` | `/codex:adversarial-review` no plan.md antes do handoff (GATE A com modelo de outra família). Requer conta ChatGPT. **NUNCA habilite `--enable-review-gate`** — loop de review documentado como dreno de tokens |

## Subagentes extras (VoltAgent/awesome-claude-code-subagents)

Catálogo MIT com 150+ subagentes. Se vendorizar mais algum em `.claude/agents/`: apague a seção "Communication Protocol"/context-manager (30–40% de tokens mortos), deixe revisores read-only e ancore no spec-kit. Úteis: `debugger`, `legacy-modernizer` (brownfield), `deployment-engineer` (CI).

## Power BI / Fabric

`claude plugin marketplace add data-goblin/power-bi-agentic-development` → instale os plugins necessários. **Nunca copie arquivos** (GPL-3.0 + cláusula de não-cópia); instalação via marketplace apenas.

## Medição

`npx ccusage@latest` — análise de gasto de tokens por sessão a partir dos logs locais. Estabeleça baseline antes/depois de mudanças no template.
