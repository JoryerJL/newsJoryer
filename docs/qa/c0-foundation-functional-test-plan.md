# Plan QA funcional — C0 · Fundación técnica

Este plan verifica el producto integrado del checkpoint C0 con Playwright y Chromium. Cubre el
cascarón público y del panel, P-08, los estáticos compilados y los contratos operativos que deben
estar satisfechos antes de aprobar C0; no evalúa fidelidad visual subjetiva ni funcionalidades de
fases posteriores.

## Alcance y referencias

- Spec aceptado: [`docs/specs/c0-foundation.md`](../specs/c0-foundation.md).
- Pantalla Stitch funcional de C0: P-08 — errores 403, 404 y 500.
- Cascarones transversales: `templates/base.html` y `templates/panel_base.html`.
- Rutas implementadas: `/` (`home`) y `/panel/` (`panel`); no se validan autenticación, noticias,
  taxonomías ni persistencia de dominio porque son fuera de alcance de C0.

## Entorno

| Elemento | Valor / condición |
|---|---|
| Worktree | Rama `feat/c0-foundation`, con backend y frontend ya integrados. Registrar SHA y `git diff --check` en el reporte. |
| URL local | `http://127.0.0.1:8000` (o el puerto efectivo, registrado en el reporte). |
| Settings de recorrido normal | `config.settings.development`, con `DJANGO_DEBUG=True`. |
| Settings de errores 500 | Ejecución aislada con `DJANGO_DEBUG=False`; conservar los demás valores de desarrollo y no versionar el cambio temporal. |
| Navegador | Chromium provisto por Playwright, viewport desktop `1440×900` y mobile `390×844`. |
| Herramienta | Playwright; capturar consola, fallos de request y screenshots de cada caso. |
| Base de datos | PostgreSQL 17.11 accesible con los valores de `.env`; SQLite no es válida. |
| Datos / usuarios | No se requieren datos de dominio ni cuenta para QA-C0-01, 02, 05, 06, 07 u 08. QA-C0-03 autenticado requiere una cuenta de prueba creada sólo si se usa el botón condicional “Ir a mi panel”. |

### Preparación reproducible

```bash
uv sync --locked
npm ci
npm run build:css
uv run python manage.py check
uv run python manage.py migrate
uv run python manage.py collectstatic --noinput
uv run python manage.py runserver 127.0.0.1:8000
```

Antes de abrir Chromium, confirmar que `static/css/tailwind.css` existe, no está vacío y que el
servidor responde en `/`. Para los casos de 403/500, iniciar una instancia aislada con
`DJANGO_DEBUG=False` y un mecanismo de disparo temporal de QA que no se comitea ni queda expuesto
al terminar (ver **Precondición de disparo de errores**).

### Precondición de disparo de errores

La aplicación integrada registra `handler403` y `handler500`, pero C0 no expone una ruta pública
que los active. Antes de ejecutar QA-C0-03 o QA-C0-04, el responsable de QA debe recibir del dueño
backend una de estas evidencias reproducibles, limitada al entorno QA: una URLConf temporal que
provoque `PermissionDenied` y una excepción no controlada, o rutas temporales equivalentes retiradas
antes del cierre. Deben devolver exactamente 403 y 500 a través de los handlers configurados, no
renderizar las plantillas directamente.

Si esa evidencia o mecanismo no existe, marcar **BLOCKED** ambos casos y rechazar el checkpoint:
no se puede afirmar que un handler real funciona desde una llamada directa de Python ni sustituirlo
por una inspección de plantilla. Registrar los paths temporales utilizados (sin secretos) y cerrar el
servidor de QA al finalizar.

## Instrumentación Playwright

En cada caso, registrar en el resultado de Playwright:

- `page.on("console")` y fallar ante errores de nivel `error` no justificados.
- `page.on("requestfailed")` y fallar ante cualquier request fallido no justificado.
- URLs, status HTTP de la navegación principal y de `tailwind.css`.
- Screenshot final con nombre `<QA-ID>-<viewport>.png`; adjuntar trace/video sólo ante fallo.

Los requests deliberados a una ruta inexistente de QA-C0-02 son el único 404 justificado. No se
aceptan fallos de `tailwind.css`, `site.js`, media o recursos de terceros inexistentes.

## Casos

| ID | Criticidad | Precondición | Pasos Playwright / Chromium | Resultado esperado | Evidencia requerida |
|---|---|---|---|---|---|
| QA-C0-01 | Crítica | Servidor normal activo; sin sesión. | Abrir `/`; esperar `networkidle`; leer status; verificar `header`, `main#contenido-principal`, `footer`, texto “Portal público”, enlaces “Iniciar sesión” y “Registrarse”, y al menos dos `[data-logo-slot]`. | HTTP 200. Navbar público, contenido y footer son visibles; sólo hay slots de logo vacíos, no palabra/marca inventada ni recurso de logo cargado. Sin consola `error` ni request fallido. | Resultado Playwright, screenshot desktop y registro de consola/red. |
| QA-C0-02 | Crítica | Servidor normal activo. | Navegar a `/qa-route-does-not-exist/`; verificar status, `h1`, texto descriptivo y los enlaces “Volver al inicio” y “Ver todas las noticias”; seguir ambos enlaces. | HTTP 404 con P-08: “Página no encontrada” y “La noticia que buscas no existe o fue retirada.” Cada acción resuelve en HTTP 200 sin excepción. | Resultado Playwright, screenshot P-08 404, status y navegación de enlaces. |
| QA-C0-03 | Crítica | Servidor aislado con `DJANGO_DEBUG=False` y disparador temporal aprobado de `PermissionDenied`. | Abrir la URL temporal de 403; verificar status 403, `h1`, mensaje y “Volver al inicio”; con usuario de prueba autenticado, repetir y verificar también “Ir a mi panel”, siguiendo el enlace. | El handler real produce HTTP 403 con “No tienes permiso” y “Tu cuenta no tiene acceso a esta sección.” La acción pública y, cuando aplica, la de panel resuelven sin error. No hay traza técnica. | URL/mecanismo temporal, resultado Playwright, screenshots anónimo y autenticado si aplica, consola/red. |
| QA-C0-04 | Crítica | Servidor aislado con `DJANGO_DEBUG=False` y disparador temporal aprobado de excepción no controlada. | Abrir la URL temporal de 500; verificar status 500, `h1`, mensaje, acción “Volver al inicio”; buscar en body términos de traza (`Traceback`, rutas del worktree, `Exception`, `DEBUG`) y seguir el enlace. | El handler real produce HTTP 500 con “Algo salió mal” y mensaje seguro. La respuesta no expone traza, path local, configuración ni detalle de excepción; volver al inicio da HTTP 200. | URL/mecanismo temporal, resultado Playwright, screenshot P-08 500, búsqueda negativa de traza y consola/red. |
| QA-C0-05 | Crítica | Build CSS y `collectstatic` completados antes del servidor. | Desde `/`, localizar `link[rel="stylesheet"]`; solicitar su `href`; verificar HTTP 200, `content-type` CSS y body no vacío. Revisar DOM por `script`/`link` que contenga `cdn.tailwindcss.com` o CDN Tailwind y comprobar que no hay runtime Tailwind. | Se sirve `/static/css/tailwind.css`; ninguna plantilla cargada usa CDN/runtime Tailwind. Los slots `[data-logo-slot]` no cargan imagen ni contienen un wordmark inventado. | URL y status del CSS, tamaño/hash opcional, lista de scripts/links, screenshot de home. |
| QA-C0-06 | Alta | Servidor normal activo. | Abrir `/panel/`; verificar HTTP 200, texto “Panel editorial”, `header`, `[data-panel-menu]`, navegación lateral y el área `#contenido-panel`; en 390 px abrir el botón `[data-panel-menu-open]`, verificar `aria-expanded="true"`, drawer visible, overlay, foco dentro; cerrar con Escape. | El cascarón de panel tiene navbar, sidebar y contenido. El drawer móvil abre/cierra, devuelve el foco al botón y no deja el panel inaccesible. Sin consola/error de red. | Resultado Playwright, screenshots desktop/mobile, assertions de foco y ARIA, consola/red. |
| QA-C0-07 | Alta | Servidor normal activo. | En `/` y `/panel/`, obtener estilos computados de un texto sobre fondo `brand-100` y de controles de navegación; verificar que texto sobre `brand-100` usa `brand-900` (`rgb(31, 77, 89)`) y que `tailwind.css` contiene los tokens `--color-brand-100` y `--color-brand-900`. | Se aplican los tokens compilados y el par de contraste aprobado. No se coloca texto sobre `accent-500`; los estados interactivos mantienen foco visible. | Valores CSS computados, extracto/resultado de evaluación Playwright y screenshot con foco visible. |
| QA-C0-08 | Alta | Servidor normal activo. | Ejecutar QA-C0-01 en 390×844, 768×1024 y 1440×900; medir `document.documentElement.scrollWidth <= window.innerWidth`; en mobile abrir/cerrar búsqueda (`[data-search-open]`) y menú público (`[data-public-menu-open]`), incluida tecla Escape. | No hay desborde horizontal. Navbar, contenido y footer siguen operables en los tres breakpoints; búsqueda y drawer móvil actualizan `aria-expanded`, foco e `inert` correctamente. | Tres screenshots, métricas de viewport/scrollWidth, assertions ARIA/foco y consola/red. |

## Regresiones y contratos no visuales

Ejecutar y registrar antes del veredicto funcional:

```bash
uv run python manage.py check
uv run pytest
uv run ruff check .
uv run ruff format --check .
npm run build:css
uv run python manage.py collectstatic --noinput
uv run python manage.py showmigrations core
psql "$DATABASE_URL" -c "SELECT extname FROM pg_extension WHERE extname = 'unaccent';"
```

Si el entorno no define `DATABASE_URL`, usar `psql` con los valores `POSTGRES_*` de `.env`. La
consulta debe devolver una fila `unaccent`; documentar la versión PostgreSQL observada. Verificar
además que `manage.py migrate` se ejecutó contra PostgreSQL y que no hay archivos `.env`, `media/`
o `staticfiles/` rastreados por Git. Estos controles no sustituyen los recorridos de Chromium.

## Reglas de bloqueo y veredicto

- Fallo o bloqueo de cualquier caso crítico (QA-C0-01 a QA-C0-05) implica veredicto **FAIL**.
- Fallo de QA-C0-06 a QA-C0-08 también bloquea C0 hasta corregir navegación responsive, accesibilidad
  base o tokens del cascarón.
- Bloquean el checkpoint: PostgreSQL inaccesible o diferente de PostgreSQL, migración/`unaccent`
  fallida, build/`collectstatic` fallido, CSS estático con status distinto de 200, CDN/runtime
  Tailwind, logo/wordmark inventado, traza expuesta en 500, consola con error o request fallido no
  justificado.
- Una ausencia de disparador HTTP real para 403/500 es **BLOCKED**, no PASS; requiere evidencia del
  mecanismo temporal y una nueva ejecución completa de esos casos.
- Tras cualquier corrección que afecte rutas, handlers, templates, JavaScript o estáticos, repetir
  los casos afectados y QA-C0-01, QA-C0-05 y QA-C0-08 como regresión mínima.

## Entregable de Antigravity

El reporte `docs/qa/c0-foundation-functional-report.md` debe indicar SHA/diff, entorno y versión de
Chromium/PostgreSQL, comandos exactos, matriz PASS/FAIL/BLOCKED para todos los IDs, evidencia
adjunta, defectos reproducibles y un veredicto único. Un resultado sin status HTTP, consola/red y
screenshots requeridos no es evidencia suficiente para aprobar el gate.
