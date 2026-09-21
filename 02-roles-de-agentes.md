# Roles de agentes — CMS CANACO

El detalle operativo vive en [03-flujo-de-trabajo.md](./03-flujo-de-trabajo.md). Esta matriz es la fuente rápida de propiedad: cada fase tiene un único dueño y un artefacto verificable.

| Fase | Dueño | Artefacto | Gate de salida |
|---|---|---|---|
| Orquestación | Codex / Terra / medium | Run, DAG, handoff y decisiones | Tasks creadas y dependencias correctas |
| Spec SDD | Kiro | `docs/specs/<phase>.md` | Sin preguntas bloqueantes |
| Backend | Codex / Terra / medium | Diff Django + pruebas | Contrato backend y pruebas aprobadas |
| Frontend | Cursor | Templates/CSS/JS integrados | Flujos implementados contra Stitch |
| Plan QA funcional | Codex / Terra / medium | `docs/qa/<phase>-functional-test-plan.md` | Casos ejecutables del producto integrado y criterios de bloqueo |
| QA funcional | Antigravity | Reporte Playwright/Chromium | `PASS` con evidencia funcional |
| Gate de checkpoint | Codex | Decisión fundada | Evidencia completa y alcance aceptado |
| Cierre | Devin | Changelog, reporte, roadmap, commit y PR | PR `feat/<phase>` → `develop` |

## Límites innegociables

- Antigravity no hace QA visual; prueba comportamiento funcional contra un plan explícito.
- El plan QA se crea después de integrar backend y frontend; cubre el producto implementado y se entrega a Antigravity en cada fase.
- Kiro sólo especifica; Codex backend sólo implementa backend; Cursor sólo implementa frontend.
- Devin sólo entra tras un gate aprobado para documentar, commitear y abrir/preparar el PR.
- Cada fase nace desde `develop`; nadie commitea directamente en `main` o `develop`.
- Un fallo QA vuelve al dueño del defecto y requiere re-ejecución del QA antes del gate.
