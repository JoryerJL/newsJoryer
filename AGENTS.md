# AGENTS.md — CMS de Noticias CANACO

## Contexto del producto

CMS institucional para CANACO SERVYTUR Villahermosa. La meta es permitir publicación editorial controlada, portal público de noticias, comentarios moderados y administración de usuarios.

Antes de modificar código o documentación de producto, leer en este orden:

1. `docs/ROADMAP.md` — checkpoint, fase y pantallas Stitch involucradas.
2. `docs/ARCHITECTURE_AND_STACK.md` — stack, estructura y reglas de arquitectura.
3. `docs/DATA_MODEL.md` — modelos, PostgreSQL y nombres persistidos.
4. `docs/MODULES_SPEC.md` y `docs/PRODUCT_OVERVIEW.md` — reglas de negocio y alcance.
5. `03-flujo-de-trabajo.md` — roles, gates y artefactos de cada fase.

## Fuente visual

- Stitch es la fuente de verdad UI/UX: <https://stitch.withgoogle.com/projects/14921403100817785323>.
- La trazabilidad de las 19 pantallas está en `docs/ROADMAP.md`.
- Los exports locales están en `stitch-export/screens/` y sirven como referencia visual, no como código de producción.

## Stack y arquitectura obligatorios

- Python `3.13.15`, Django `5.2.18`, PostgreSQL `17.11`, `uv` y `python-decouple`.
- Monolito modular Django, renderizado en servidor con Django Templates.
- Separar lecturas en `selectors.py` y cambios de estado/casos de uso en `services.py`.
- Preferir CBVs (`ListView`, `DetailView`, `CreateView`, `UpdateView`, `DeleteView`) cuando sean claras; FBVs sólo si son más simples y expresivas.
- No crear SPA, API separada, microservicios, Celery, Redis, Docker, framework CSS ni nuevas dependencias sin decisión explícita.
- Settings separados: `base`, `development`, `test` y `production`.

## Convenciones no negociables

- Código, nombres de módulos, modelos, columnas, tablas, índices, estados persistidos, comentarios y commits: **inglés**.
- UI y mensajes para usuarios: **español**.
- Tablas PostgreSQL y columnas siguen los nombres Django en inglés; no usar `db_table` o `db_column` para traducciones.
- Estados: `draft`, `published`, `pending`, `approved`, `blocked`.
- PEP 8, Ruff, máximo 100 caracteres, type hints en funciones públicas.
- Las templates no consultan ORM ni contienen lógica de negocio o permisos.
- Mutaciones mediante POST + CSRF + Post/Redirect/Get.
- No introducir consultas N+1; los selectors deben usar `select_related`/`prefetch_related` cuando corresponda.

## Flujo por checkpoint

Cada fase sigue el DAG documentado en `03-flujo-de-trabajo.md`:

1. Kiro produce `docs/specs/<phase>.md`.
2. Codex crea `docs/qa/<phase>-functional-test-plan.md` antes de implementar.
3. Codex/Terra implementa backend y pruebas.
4. Cursor implementa frontend con las referencias Stitch asignadas.
5. Antigravity ejecuta QA funcional con Playwright/Chromium y genera su reporte.
6. Codex aprueba o rechaza el gate con evidencia.
7. Devin actualiza changelog, reporte final y roadmap; crea commit y PR.

Antigravity ejecuta QA **funcional** únicamente; no existe una fase independiente de QA visual.

## Git

```text
main
└── develop
    └── feat/<phase-slug>
```

- Toda fase nace de `develop` y usa un worktree propio.
- Nunca commitear directamente en `main` o `develop`.
- Los PRs van de `feat/<phase-slug>` a `develop`.
- Usar Conventional Commits. Nunca agregar `Co-Authored-By` ni atribución de IA.
- Mantener pruebas y documentación con el comportamiento que verifican.

## Validación obligatoria

- No avanzar de checkpoint con QA `FAIL` o sin evidencia reproducible.
- El plan QA debe existir antes de iniciar backend y cubrir éxito, validación, permisos, persistencia, errores/estados relevantes y regresiones.
- Todo cambio de esquema incluye migración y prueba de migración.
- Antes de lanzar un agente en Orca, seguir el preflight de terminal/probe de `03-flujo-de-trabajo.md`.

## Estado actual

El repositorio inicia con documentación, material de referencia y export del proyecto Stitch. No existe código Django todavía. El primer trabajo de producto corresponde al checkpoint C0 del roadmap.
