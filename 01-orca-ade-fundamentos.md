# Fundamentos del ADE Orca

Fuentes: <https://www.onorca.dev/docs> y la guía compatible con el CLI instalado,
cargada con `orca skills get orchestration`.

Orca es un IDE de escritorio para ejecutar y supervisar varios agentes de IA. Para
este proyecto, el límite de aislamiento y entrega es una **rebanada de trabajo**,
no una fase aislada.

---

## 1. Worktrees

Fuente: [/docs/model/worktrees](https://www.onorca.dev/docs/model/worktrees)

Orca es *worktree-native*: sus worktrees son worktrees reales de Git. `git status`,
`git rebase` y `git cherry-pick` siguen funcionando; Orca detecta los cambios en el
siguiente render.

Ciclo de vida de un worktree:

1. **Crear** — se crea uno por rebanada de entrega en una rama nueva y se elige su referencia de origen.
2. **Trabajar** — requerimientos, diseño, implementación, refinamiento y calidad se
   ejecutan en serie dentro de ese mismo worktree.
3. **Revisar** — se inspecciona el diff de la rebanada contra su referencia de origen.
4. **Enviar** — después de la aprobación de calidad, se crea un único commit atómico,
   se hace push y se abre o prepara el PR.
5. **Archivar o eliminar** — se libera el worker, se detiene el servidor local y se
   archiva o elimina el worktree cuando ya no tiene trabajo pendiente.

Los worktrees creados a mano con `git worktree add` quedan externos hasta revelarlos
con **hidden worktrees** → **Non-Orca worktrees** → **Show**.

**Decisión operativa:** una rebanada (por ejemplo, home o página de historia) inicia en
una rama nueva y obtiene un worktree. Sus fases no crean worktrees hijos ni hacen commits
directos a `develop`. Dos rebanadas realmente independientes
pueden tener worktrees distintos y avanzar en paralelo; sus artefactos y límites de
edición deben impedir que modifiquen los mismos archivos.

---

## 2. Agentes

Fuente: [/docs/agents/supported](https://www.onorca.dev/docs/agents/supported)

Orca lanza CLIs de agentes en terminales; el selector de agentes no cambia la
responsabilidad de coordinación. Para este proyecto, **Codex con Terra / medium** es el único
coordinador activo de cada Run. La matriz de roles vigente está en `03-flujo-de-trabajo.md`.

| Agente | Nivel de integración relevante |
| --- | --- |
| Claude Code | Profunda: uso, hot-swap y hooks |
| Codex | Profunda: uso y hot-swap |
| Cursor CLI | Soportado |
| Kiro | Auto-setup |
| Antigravity (Google) | Auto-setup, hooks y estado |

### Preferencias de lanzamiento

`--model` y `--effort` son overrides por lanzamiento, no una política universal:

- Solo se admiten para terminales **nuevas** de Claude, Codex y Cursor.
- `--model` recibe un ID opaco del proveedor. Se omite salvo que el usuario haya
  nombrado un modelo; así se conserva el default configurado del agente.
- `--effort` requiere `--model`, solo se agrega si ese modelo lo soporta y no se combina
  con `--terminal`.
- Tras el inicio, se compara `launch.requested` con `launch.effective`; lo solicitado
  no prueba que el proveedor lo haya aplicado.

Kiro no recibe `--model auto --effort low`: esos overrides no están soportados para
Kiro. Para tareas mecánicas de Git se usa su configuración predeterminada.

### Permisos

Orca puede precargar el flag de bypass de permisos de cada CLI. El interruptor global
está en **Settings → Agents → Agent Permissions**. Un worktree descartable reduce el
riesgo de colisión, pero no reemplaza la revisión de los cambios ni autoriza ignorar
una recuperación insegura.

---

## 3. Design Mode

Fuente: [/docs/browser/design-mode](https://www.onorca.dev/docs/browser/design-mode)

**Design Mode no diseña pantallas.** Es un puntero de navegador a código ya existente.

1. Activar Design Mode en la barra del navegador.
2. Hacer clic en un elemento para entregar su contexto al agente.
3. Editar en el worktree de la rebanada, verificar el hot-reload y repetir si hace falta.

Se usa durante refinamiento para espaciado, alineación, jerarquía y ritmo. Las decisiones de
pantallas las registra el coordinador activo mediante artefactos y decision gates; si una
composición está mal de raíz, se remedia desde la Task apropiada, no con parches de píxel.

---

## 4. CLI de orquestación

Fuente: guía compatible con el CLI instalado, cargada con `orca skills get orchestration`;
el comando no crea un artefacto local versionado.

La orquestación registra propiedad y ciclo de vida; no sustituye el plan de entrega.

### Modelo central

- **Run** — espacio de nombres durable y bandeja de entrada del coordinador activo; no agenda
  ni ubica workers.
- **Task** — unidad de trabajo con una especificación autocontenida, dependencias y estado.
- **Dispatch** — intento autoritativo de una Task en una terminal.
- **Delivery** — lote FIFO de mensajes que debe procesarse completo antes de su `ack`.
- **Decision gate** — pregunta del coordinador activo que bloquea una decisión pendiente.

La autoridad procede del Dispatch activo, no de un título de terminal ni de un ID copiado.

### Construir el DAG antes de despachar

Primero se crean todas las Tasks de la rebanada y sus dependencias reales; luego se
consulta la vista de tareas listas y se despachan solo esas. Un ejemplo abreviado:

```bash
orca orchestration run-create \
  --objective "Entregar la fase del CMS de noticias CANACO" --json

orca orchestration task-create \
  --task-title "Requerimientos de home" --spec "..." --json
# Guardar el taskId como <requirementsTaskId>.

orca orchestration task-create \
  --task-title "Sistema de diseño de home" --deps '["<requirementsTaskId>"]' \
  --spec "..." --json

orca orchestration task-list --ready --brief --json
orca orchestration worker-start \
  --task <readyTaskId> --worktree current --agent <agentId> --json
```

`--deps` expresa solo orden real. La cola lista es la memoria externa del coordinador activo:
no se inicia una Task por intuición ni se despacha una Task bloqueada.

`--agent <agentId>` **solo** aplica a un agente que Orca reconoce y arranca de forma fiable.
**Kiro no lo es en este entorno:** no se levanta con `--agent`, sino con su preflight de terminal
dedicado (crear la terminal, lanzar el CLI a mano con `terminal send --enter`, verificar el TUI con
un probe no-op y recién entonces reclamar la terminal con `worker-start --terminal`). Ese
procedimiento autoritativo está en `03-flujo-de-trabajo.md`.


### Traspaso del coordinador activo

Codex / Terra / medium coordina el Run y no comparte esa autoridad con otro agente.
Antes de transferirla, el saliente termina de procesar la Delivery FIFO pendiente y registra
un handoff en `docs/orchestration/<runId>-handoff.md` con: Run ID, coordinador saliente y
entrante, `run-show`, estados de `task-list --run`, Dispatches activos y estado de ciclo de
vida de `worker-list --run <runId> --include-remote`. Después deja de despachar, responder,
hacer `ack` o mutar el ciclo de vida del Run.

El entrante verifica ese registro, se vincula explícitamente y recién entonces se convierte en
el único coordinador activo:

```bash
orca orchestration run-use --id <runId> --json
```

No se realiza el traspaso ante una Delivery sin procesar, estado de worker incierto o un
Dispatch cuya autoridad no pueda verificarse. Se conserva el coordinador actual y se sigue la
guía de recuperación.

### Terminación y recepción

El worker no invoca un `worker-done` escrito a mano en esta documentación. Al terminar,
usa **exactamente** el comando de finalización inyectado en su preámbulo, con su `taskId`,
`dispatchId` y un resultado explícito (`succeeded` o `failed`). Ese preámbulo es la fuente
de autoridad para el ejecutable, handle y argumentos. Antes de iniciar un archivo nuevo,
después de una validación y otra vez inmediatamente antes de terminar, consulta su inbox con
el `check --terminal <worker_handle>` indicado por la guía; si recibe `consumer_fenced`, deja
de trabajar y no completa el Dispatch.

El coordinador activo consume la Delivery FIFO completa, procesa preguntas y escalaciones, y
para cada finalización valida que el Dispatch sea el activo y que el resultado explícito
coincida con la evidencia. Antes de hacer `ack`, **ejecuta una acción por cada Dispatch
asentado y aceptado del lote**: reutilizar su terminal para una Task inmediata, retenerla por
petición expresa del usuario o liberarla. Ningún Dispatch asentado queda sin decisión de ciclo
de vida antes del `ack`.

```bash
orca orchestration check --wait \
  --types "worker_done,escalation,question" --timeout-ms 900000 --json

# Procesar el lote completo y ejecutar una acción para CADA Dispatch asentado antes del ack.
# Reutilizar la terminal del agente: como fue creada aparte y no es el worktree del
# coordinador, se pasa el selector exacto id:<repoId>::<rutaAbsoluta> de `terminal list`,
# nunca `--worktree current` (que solo resuelve el worktree del coordinador).
orca orchestration worker-start \
  --task <nextReadyTaskId> --terminal <agentTerminalHandle> \
  --worktree "id:<repoId>::<rutaAbsoluta>" --json
# o
orca orchestration worker-retain --dispatch <dispatchId> --json
# o
orca orchestration worker-release --dispatch <dispatchId> --json

orca orchestration check --ack <deliveryId> --wait \
  --types "worker_done,escalation,question" --timeout-ms 900000 --json
```

Al cerrar el Run, se verifica que no queden terminales recuperables:

```bash
orca orchestration worker-list --run <runId> --terminal-state reclaimable \
  --include-remote --json
# Si `page.hasMore` es true, repetir con el cursor hasta que sea false:
orca orchestration worker-list --run <runId> --terminal-state reclaimable \
  --include-remote --cursor <page.nextCursor> --json
```

El resultado agregado de todas las páginas debe estar vacío. Un timeout, un panel inactivo o
una ausencia de mensajes no autoriza liberar, relanzar ni cerrar nada.

### Recuperación segura

Para `failedStage`, una Task fallida, `outcome_unknown`, una liberación incierta o
liveness `unverifiable`, se carga primero la guía de recuperación local:

```bash
orca skills get orchestration --reference references/recovery-and-cleanup.md
```

Luego se obtiene evidencia positiva con `worker-list --run <runId> --include-remote`,
`worker-show` y, cuando haga falta, `worker-read`. Solo un estado probado permite la
acción correspondiente: un intento `failed` o `stopped` puede reintentarse con
`--retry-of`; un worker aceptadamente terminado puede reutilizarse, retenerse o liberarse.
`unverifiable` y pérdida de contacto son ausencia de prueba: se inspeccionan o se espera;
nunca se liberan ni relanzan a ciegas.

### Elegir el comando correcto

| Situación | Comando |
| --- | --- |
| Enviar un prompt liviano a un agente visible | `orca terminal send` |
| Supervisar trabajo, preguntas y finalización por IDs | `orca orchestration worker-start` |
| Crear el espacio de nombres y DAG | `orca orchestration run-create` + `task-create` |

El comando `orchestration run` está retirado y no debe usarse.
