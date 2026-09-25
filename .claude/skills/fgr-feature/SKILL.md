---
name: "fgr-feature"
description: "Scaffold a complete FGR feature (backend .NET entity and/or frontend React screen) from the handbook templates in docs/padroes/, in the documented creation order. Use inside /speckit-implement when a task creates a new entity or screen, or standalone."
argument-hint: "<Entidade> [Dominio] [backend|frontend|both]  e.g. 'Produto Catalogo both'"
compatibility: "FGR projects following docs/padroes/ (backend: FGR.<Sistema>.* solution; frontend: Vite + PrimeReact tree)"
metadata:
  author: "template"
  handbook: "docs/padroes/"
user-invocable: true
disable-model-invocation: false
---

# /fgr-feature: scaffold from the handbook

The handbook is the source of truth. This skill only applies it; when the code you would write disagrees with `docs/padroes/`, the handbook wins (principle 4: change the handbook first, by PR, then the code).

## User Input

```text
$ARGUMENTS
```

Parse: `<Entidade>` (PascalCase, Portuguese business name, e.g. `Produto`), `[Dominio]` (default: same as the entity), `[side]` (default `both`). Missing entity: ask.

## Before writing anything

1. Read `docs/padroes/principios.md` (5 principles, minimal-code ladder) and the feature guide for each side you will scaffold:
   - backend: `docs/padroes/backend/06-feature-completa.md` (14 files, ordered) and `docs/padroes/backend/templates/`
   - frontend: `docs/padroes/frontend/03-feature-completa.md` (10 files, ordered) and `docs/padroes/frontend/templates/`
2. Locate the real project roots: the `FGR.<Sistema>.*` projects (grep `*.sln`) and the app `src/` tree (`docs/padroes/frontend/02-estrutura.md`). Read the system name and namespace from an existing file, never assume `FGR.Sistema`.
3. Read `PROJECT-COMMANDS.md` for build/test/lint commands.
4. If a `specs/NNN-*/` feature is active, read its `spec.md`, `data-model.md` and `contracts/`: field names, types, validations and permissions come from there. Without a spec, take fields from the user and keep the template's example fields only when the user confirms them.
5. Check what already exists: an entity, service or page with the same name is a STOP (report, never overwrite). A "mestre simples" (only name, scope, active) uses the shared `components/mestre/` trio instead of a full frontend feature (`03-feature-completa.md`, "Mestres simples").

## Scaffold (in the guide's order, one file at a time)

For each row of the guide's table: copy the template, replace `Produto`/`produto`/`Catalogo` by the real names, replace the example fields by the real ones, delete what the entity doesn't need. Keep the template's structure, attributes, base classes and naming (`Request`, `Response`, `Repository`, `Service`, `Controller`, `Profile`, `Page`, `Store`: infra suffixes in English, business names in Portuguese).

Backend checkpoints:
- `Permissions.cs` gains the entity's constants; the same keys go to `PermissionEnum.ts` on the frontend (contract `docs/padroes/contratos/api-app.md`).
- Migration named `Cria<Entidade>` with a working `Down`.
- Every action passes through an `Execute*` helper and carries `[Permission]` with a constant.
- `ControllerTests.cs`: one integration test per write action and per authorization rule.

Frontend checkpoints:
- Texts only in `i18n/pt/translation.json`; no literal in components; no hex color in `.tsx`.
- Routes under `PermissionRouter`; buttons and action columns under `HasPermission`.
- Query key exported and invalidated in the mutation.
- Only steps 9 and 10 of the guide touch files outside the feature folder (`AppRouter.tsx`, `AppMenu.ts`, `e2e/`).

## After scaffolding

1. Build, lint (`--max-warnings 0`) and run the tests from `PROJECT-COMMANDS.md`. Red is not done (`quality-protocols`).
2. Print the guide's "Checklist antes do pull request" with each item marked done or pending.
3. Inside `/speckit-implement`: commit as `feat: T0xx scaffold <Entidade>`. Standalone: one commit `feat(<dominio>): scaffold <Entidade>`.

Never: register services manually (`[Repository]`/`[Service]` attributes on the interfaces do it); add DataAnnotations to a `Request` (rules live in the `Validator`); call `SaveChanges` outside the `UnityOfWork`; create anything under `deprecated/`.
