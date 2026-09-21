# Flujo de trabajo orquestado — CMS CANACO

Este documento gobierna cada fase del roadmap. El producto se implementa como **checkpoints**: no se inicia una fase nueva hasta que la fase actual tenga evidencia funcional, correcciones aplicadas y gate aprobado.

**Documentos fuente:**
- [docs/ROADMAP.md](docs/ROADMAP.md) — fases, dependencias y pantallas Stitch.
- [docs/ARCHITECTURE_AND_STACK.md](docs/ARCHITECTURE_AND_STACK.md) — stack y arquitectura.
- [docs/DATA_MODEL.md](docs/DATA_MODEL.md) — persistencia en inglés.
- [Proyecto Stitch](https://stitch.withgoogle.com/projects/14921403100817785323) — fuente UI/UX.

## 1. Roles fijos

| Rol | Agente | Responsabilidad | No hace |
|---|---|---|---|
| Orquestador | **Codex / Terra / medium** | Crea Run/DAG, gates, handoffs, prompts, revisión de evidencia y decisiones de continuidad. | Implementar backend/frontend ni hacer commits/PRs de fase. |
| Especificación | **Kiro** | Produce el spec SDD detallado de cada fase a partir del roadmap y resuelve preguntas de requisitos. | Implementar, probar, commitear o abrir PR. |
| Backend | **Codex / Terra / medium** | Implementa Django, PostgreSQL, services, selectors, CBVs, migraciones y pruebas backend. | UI de producción, commits o PRs. |
| Frontend | **Cursor** | Implementa templates Django, CSS, JavaScript progresivo y fidelidad a Stitch. | Cambiar contratos backend, commits o PRs. |
| QA funcional | **Antigravity (`agy`)** | Ejecuta el plan de pruebas con Playwright y Chromium; reporta evidencia funcional. | QA visual subjetivo, implementar, commitear o aprobar sin evidencia. |
| Cierre | **Devin** | Actualiza changelog, reporte final, roadmap; crea commit y redacta/abre PR. | Implementar producto, modificar spec o aprobar un gate fallido. |

> **Antigravity hace QA funcional únicamente.** El cumplimiento de Stitch forma parte de la implementación de Cursor; este flujo no crea una tarea separada de QA visual.

## 2. Git y worktrees

```text
main
└── develop
    └── feat/<phase-slug>
```

1. Inicializar el repositorio con `main` como rama de integración estable.
2. Crear `develop` desde `main`; es la rama de integración de fases.
3. Cada fase nace de `develop` en una rama con convención `feat/<phase-slug>`.
4. Cada fase usa un worktree propio; todas sus Tasks trabajan sobre ese mismo worktree.
5. Nadie hace commit directo en `main` o `develop`.
6. Devin crea el único commit de cierre de fase y abre/redacta un PR **de `feat/<phase-slug>` hacia `develop`**.
7. Tras integrar una fase, la siguiente rama vuelve a nacer del `develop` actualizado.

Los commits usan Conventional Commits y no incluyen atribución de IA ni trailers `Co-Authored-By`.

## 3. DAG obligatorio de una fase

```text
roadmap checkpoint
      ↓
[1] Kiro: spec SDD detallado
      ↓
[2] Codex: plan QA funcional para Antigravity
      ↓
[3] Codex: backend + pruebas backend
      ↓
[4] Cursor: frontend integrado con backend
      ↓
[5] Antigravity: QA funcional Playwright/Chromium
      ↓
  ¿QA aprobó?
   ├─ no → [6] corrección por dueño → volver a [5]
   └─ sí → [7] Codex: gate de checkpoint
                         ↓
             [8] Devin: cierre, commit y PR a develop
```

El orquestador crea **todas** las Tasks y dependencias antes del primer Dispatch. Sólo inicia una Task que el DAG marque como lista. Una fase rechazada no abre una nueva fase: genera correcciones acotadas y repite su QA funcional.

## 4. Artefactos obligatorios por fase

Para el slug `<phase-slug>` se versionan estos artefactos:

```text
docs/
├── specs/<phase-slug>.md
├── qa/<phase-slug>-functional-test-plan.md
├── qa/<phase-slug>-functional-report.md
├── reports/<phase-slug>-phase-report.md
└── orchestration/<phase-slug>-handoff.md
```

| Artefacto | Dueño | Contenido mínimo |
|---|---|---|
| Spec SDD | Kiro | Objetivo, alcance, no alcance, requisitos, reglas, datos, rutas, pantallas Stitch, criterios de aceptación, riesgos y preguntas abiertas. |
| Plan QA funcional | Orquestador | Casos Playwright/Chromium, precondiciones, datos, pasos, expected result, evidencia requerida y criterio de bloqueo. |
| Reporte QA | Antigravity | Entorno, comandos, casos ejecutados, resultados, evidencia, defectos reproducibles y veredicto PASS/FAIL. |
| Reporte final | Devin | Resumen, archivos, migraciones, pruebas, QA, desvíos, riesgos y enlaces a commit/PR. |
| Changelog | Devin | Entrada de fase aceptada; no se actualiza si el gate falla. |
| Roadmap | Devin | Checkpoint/fase marcado sólo con gate aprobado; correcciones pendientes se registran explícitamente. |

## 5. Fase 1 — Spec SDD con Kiro

Kiro convierte el checkpoint general del roadmap en `docs/specs/<phase-slug>.md`. No escribe código.

El spec debe incluir:

1. Objetivo y resultado observable de la fase.
2. Alcance y no alcance.
3. Dependencias y contratos de entrada/salida.
4. Requisitos funcionales numerados y reglas de negocio.
5. Modelos, migraciones, permisos, rutas y servicios/selectors afectados.
6. Pantallas Stitch exactas: referencia, ID y export local tomado de `docs/ROADMAP.md`.
7. Estados normales, vacíos, error y autorización.
8. Criterios de aceptación verificables.
9. Casos que luego deben entrar al plan QA.
10. `## Decisiones de requisitos` y `## Preguntas abiertas`.

Kiro pregunta al usuario sólo por decisiones bloqueantes. La Task no termina hasta que `## Preguntas abiertas` diga `Ninguna.` o el orquestador haya registrado un gate explícito para resolverla.

## 6. Fase 2 — Plan QA funcional antes de implementar

El orquestador deriva `docs/qa/<phase-slug>-functional-test-plan.md` desde el spec **antes** de iniciar backend. Esto evita que QA tenga que adivinar qué probar.

Plantilla obligatoria:

```markdown
# Plan QA funcional — <phase>

## Entorno
- URL local:
- Settings:
- Navegador: Chromium
- Herramienta: Playwright
- Datos/usuarios de prueba:

## Casos
| ID | Precondición | Pasos | Resultado esperado | Evidencia |
|---|---|---|---|---|
| QA-01 | ... | ... | ... | screenshot + resultado Playwright |

## Reglas de bloqueo
- Ningún caso crítico puede fallar.
- Rutas protegidas deben devolver el resultado autorizado/403 esperado.
- Mutaciones deben persistir y mostrar el resultado correcto.
- No debe haber errores de consola ni requests fallidos no justificados.
```

El plan cubre como mínimo: ruta feliz, validación, permisos, estados vacío/error relevantes, persistencia y regresiones de las rutas alteradas. **No incluye evaluación visual subjetiva.**

## 7. Fase 3 — Backend con Codex / Terra / medium

Codex implementa sólo el alcance backend aprobado en el spec:

- Django, PostgreSQL, modelos/migraciones en inglés.
- Services para escrituras, selectors para lecturas y CBVs cuando un genérico Django sea claro.
- Forms, permisos, rutas y pruebas unitarias/integración del comportamiento backend.
- Sin commits, PRs ni cambios arbitrarios de UI.

Entrega: diff, pruebas ejecutadas, migraciones, decisiones técnicas y rutas/listado de archivos modificados. El orquestador revisa que el contrato permita iniciar frontend.

## 8. Fase 4 — Frontend con Cursor

Cursor implementa las templates Django, CSS y JavaScript progresivo del spec. Usa Stitch como fuente visual, los exports locales y los contratos backend ya entregados.

- Respeta el diseño de las pantallas asignadas y sus estados funcionales.
- No modifica modelos, services, selectors, permisos, migraciones ni contratos backend sin un gate del orquestador.
- Ejecuta las verificaciones locales aplicables y entrega el diff sin commit/PR.

## 9. Fase 5 — QA funcional con Antigravity

Antigravity consume **obligatoriamente** el plan QA creado en la fase 2, levanta el entorno definido y ejecuta los casos con Playwright en Chromium.

El reporte `docs/qa/<phase-slug>-functional-report.md` debe incluir:

- SHA/diff y URL bajo prueba.
- Comandos exactos ejecutados.
- Matriz de todos los IDs QA con PASS/FAIL/BLOCKED.
- Screenshots y trazas Playwright de fallos; consola y requests relevantes.
- Pasos reproducibles, resultado actual, resultado esperado y severidad de cada defecto.
- Veredicto final inequívoco: `PASS` o `FAIL`.

`FAIL` bloquea el gate. El orquestador asigna cada defecto al dueño correcto (Codex o Cursor), registra la corrección y ordena una nueva ejecución completa o focalizada del plan. Antigravity no declara PASS sin ejecutar la evidencia definida.

## 10. Fase 6 — Gate de checkpoint

Codex revisa: spec aceptado, plan QA existente, pruebas backend, reporte QA `PASS`, artefactos actualizados y alcance limitado a la fase. Sólo entonces aprueba el checkpoint y habilita a Devin.

Si no hay evidencia suficiente, el gate se rechaza y la fase vuelve al responsable correspondiente. Un gate no se resuelve con una afirmación del agente: exige rutas, comandos y resultados verificables.

## 11. Fase 7 — Cierre con Devin

Devin sólo recibe una fase cuyo gate esté aprobado. Debe:

1. Actualizar `CHANGELOG.md` con el cambio aceptado.
2. Crear `docs/reports/<phase-slug>-phase-report.md`.
3. Actualizar el checkpoint real en `docs/ROADMAP.md`.
4. Verificar el diff final y el estado de Git.
5. Crear un único Conventional Commit de trabajo coherente.
6. Hacer push de `feat/<phase-slug>` y preparar/abrir el PR base `develop`.

El PR contiene: objetivo, requisitos/spec vinculados, pantallas Stitch, cambios, migraciones, plan y reporte QA, pruebas backend, riesgos y checklist de revisión. No se crea PR ni changelog de entrega si el gate no fue aprobado.

## 12. Preflight de terminales Orca

Antes de cualquier Task real, el orquestador crea una terminal descartable y verifica el agente con un probe no-op visible. `input_accepted` no prueba que el agente esté ejecutándose.

| Agente | Launcher | Probe esperado |
|---|---|---|
| Kiro | `kiro-cli chat --v3 --trust-all-tools --agent newsjoryer` | `KIRO_PROBE_OK` |
| Cursor | `cursor-agent --force` | `CURSOR_PROBE_OK` |
| Antigravity | `agy --dangerously-skip-permissions` | `AGY_PROBE_OK` |
| Devin | `devin --permission-mode dangerous` | `DEVIN_PROBE_OK` |

Procedimiento mínimo:

```bash
# Crear la terminal, lanzar el CLI y esperar el TUI.
orca terminal send --terminal <handle> --text "<launcher>" --enter --json
orca terminal wait --terminal <handle> --for tui-idle --timeout-ms 120000 --json
orca terminal read --terminal <handle> --screen --json

# La respuesta visible es la única prueba positiva de arranque.
orca terminal send --terminal <handle> --text "Responde exactamente <PROBE_OK> y no hagas cambios." --enter --json
orca terminal read --terminal <handle> --screen --json
```

Sólo después de ver el token esperado se reclama la terminal para una Task con `worker-start --terminal`. Si un launcher, permiso o probe falla, se detiene el Dispatch de producto, se registra el fallo y se sigue el procedimiento de recuperación de Orca; nunca se reintenta a ciegas.

## 13. Recuperación y cierre del Run

- Cada worker consulta su inbox Orca antes de comenzar un archivo, tras pruebas y antes de finalizar; ante `consumer_fenced`, deja de trabajar.
- El orquestador procesa el FIFO de Deliveries, valida evidencia y libera/reutiliza cada worker antes de hacer `ack`.
- Ante `failedStage`, `outcome_unknown` o liveness no verificable, se carga la referencia Orca `recovery-and-cleanup.md` antes de relanzar o liberar.
- Al cerrar el Run, `worker-list --terminal-state reclaimable --include-remote` debe quedar vacío en todas sus páginas.

## 14. Checklist de inicio de fase

- [ ] `develop` actualizado y rama `feat/<phase-slug>` creada desde él.
- [ ] Worktree exclusivo de la fase.
- [ ] Run, Tasks, dependencias y gate creados.
- [ ] Spec Kiro aprobado y sin preguntas bloqueantes.
- [ ] Plan QA funcional creado antes de backend.
- [ ] Referencias Stitch de la fase incluidas en el spec.
- [ ] Preflight del agente que se va a despachar verificado con probe visible.

## 15. Checklist de cierre de fase

- [ ] Backend y frontend entregaron sus cambios y pruebas.
- [ ] Antigravity ejecutó el plan QA funcional con Chromium/Playwright y reportó `PASS`.
- [ ] Codex aprobó el gate con evidencia.
- [ ] Devin actualizó changelog, reporte final y roadmap.
- [ ] Commit Conventional Commit único, sin atribución AI.
- [ ] PR de `feat/<phase-slug>` hacia `develop` preparado o abierto.
