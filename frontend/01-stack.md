# Stack

| Papel | Biblioteca | Observação |
|---|---|---|
| Base | React 18, TypeScript 5, Vite 5, pnpm | `"type": "module"`; `experimentalDecorators` e `emitDecoratorMetadata` ligados no `tsconfig` |
| UI | PrimeReact 10, primeicons, primeflex | Componentes prontos com tema da FGR; primeflex para grid e espaçamento |
| Ícones | primeicons; @phosphor-icons/react quando o PrimeIcons não tem | Um estilo por sistema, não os dois misturados na mesma tela |
| Injeção de dependência | tsyringe + reflect-metadata | Services são `@singleton()`; `useService(Classe)` resolve |
| Dados | @tanstack/react-query 5 + axios | Uma instância axios registrada no container sob o token `httpClient` |
| Estado global | zustand com `persist` | Sessão, permissões, layout, loader. Nada de negócio em store global |
| Formulários | react-hook-form + class-validator + class-transformer | Resolver próprio em `core/forms/ClassValidatorResolver.ts` |
| i18n | i18next + react-i18next | Só `pt`; todo texto de tela vem do JSON |
| Utilitários | date-fns, lodash, qs, classnames, uuid | |
| Qualidade | ESLint, Prettier, Husky + lint-staged | `no-console: error`; Prettier com 4 espaços, aspas simples, largura 120 |
| Testes | Playwright + @axe-core/playwright; Vitest para `core/` | Ver [08-testes-e-capturas.md](08-testes-e-capturas.md) |

## O que não entra sem requisito

Editor de texto rico, editor de código, diagramas, Storybook, biblioteca de gráficos, segunda biblioteca de validação (yup, zod), segunda biblioteca de formulário (unform). Cada uma dessas entrou em algum projeto por um requisito específico; em projeto novo, só com o requisito na spec.

## Scripts

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "build:homolog": "tsc && vite build --mode homolog",
  "build:production": "tsc && vite build --mode production",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
  "test": "vitest run",
  "e2e": "playwright test",
  "prepare": "husky"
}
```
