# Reporte QA funcional — C0 · Fundación técnica

- **Fecha y hora de ejecución:** 2026-09-20T23:58:15-06:00
- **Responsable:** Antigravity (Agente QA Funcional)
- **Veredicto final:** **FAIL**

---

## 1. Entorno de ejecución

| Componente | Valor registrado |
|---|---|
| Worktree / Branch | `feat/c0-foundation` |
| Commit SHA | `5629ea02ed631b163679104e0c4067d9f77c37c1` |
| `git diff --check` | Limpio (sin errores de whitespace) |
| URL local | `http://127.0.0.1:8000` |
| Python | `3.13.15` |
| Django | `5.2.17` |
| Chromium | `153.0.8010.12` (Playwright `1.63.0`) |
| PostgreSQL | `PostgreSQL 14.19 (Homebrew) on aarch64-apple-darwin24.4.0` |
| Base de datos | `canaco_news` en `127.0.0.1:5432` |
| Extensión `unaccent` | Verificada y activa en PostgreSQL (`1 row`) |
| Archivos sensibles / estáticos | `.env`, `media/` y `staticfiles/` confirmados no rastreados por Git |

---

## 2. Comandos ejecutados

### Regresiones no visuales y contratos base

```bash
# 1. Chequeo de sistema Django
uv run python manage.py check
# Resultado: System check identified no issues (0 silenced). (Exit code 0)

# 2. Pruebas unitarias/integración
uv run pytest
# Resultado: 6 passed in 0.06s. (Exit code 0)

# 3. Linting con Ruff
uv run ruff check .
# Resultado: All checks passed! (Exit code 0)

# 4. Chequeo de formateo con Ruff
uv run ruff format --check .
# Resultado: Would reformat: apps/core/tests/test_views.py (Exit code 1 - FALLO)

# 5. Compilación Tailwind CSS
npm run build:css
# Resultado: npx @tailwindcss/cli -i static/css/input.css -o static/css/tailwind.css --minify (Done in 67ms, Exit code 0)

# 6. Recolección de estáticos
uv run python manage.py collectstatic --noinput
# Resultado: 0 static files copied, 130 unmodified. (Exit code 0)

# 7. Estado de migraciones core
uv run python manage.py showmigrations core
# Resultado: [X] 0001_enable_unaccent. (Exit code 0)

# 8. Verificación de extensión unaccent en PostgreSQL
psql -h 127.0.0.1 -U postgres -d canaco_news -c "SELECT extname FROM pg_extension WHERE extname = 'unaccent';"
# Resultado: unaccent (1 row). (Exit code 0)

# 9. Verificación de archivos no rastreados
git ls-files --error-unmatch .env media staticfiles
# Resultado: Ninguno rastreado por git. (Exit code 1 esperado)
```

### Ejecución de suite funcional Playwright

```bash
uv run --with playwright python /Users/joryerjimenez/.gemini/antigravity-cli/brain/4ed20128-82be-46b3-a1b5-f9db9d122b0a/scratch/run_qa.py
```

---

## 3. Matriz de casos de prueba

| ID | Criticidad | Precondición | Resultado Esperado | Resultado Observado | Estado |
|---|---|---|---|---|---|
| **QA-C0-01** | Crítica | Servidor activo; viewport desktop 1440×900. | HTTP 200. Header, main (`#contenido-principal`), footer visibles. Texto "Portal público", enlaces "Iniciar sesión" y "Registrarse". $\ge 2$ `[data-logo-slot]` vacíos sin texto ni marca ni imagen cargada. 0 errores de consola, 0 requests fallidos. | HTTP 200. Header, main y footer visibles. "Portal público" presente. Enlaces de login y registro presentes. 2 `[data-logo-slot]` vacíos sin contenido ni imagen. Consola limpia (0 errores), 0 fallos de red. | **PASS** |
| **QA-C0-02** | Crítica | Servidor normal activo; ruta `/qa-route-does-not-exist/`. | HTTP 404 con plantilla P-08: "Página no encontrada", "La noticia que buscas no existe o fue retirada.", enlaces "Volver al inicio" y "Ver todas las noticias" que resuelven en HTTP 200. | HTTP 404 pero se renderiza la página técnica de debug de Django (`Page not found (404) / Using the URLconf defined in config.urls...`) debido a `DJANGO_DEBUG=True`. No se renderiza P-08 (`templates/errors/404.html`) ni los botones de navegación. Error en consola por respuesta 404. | **FAIL** |
| **QA-C0-03** | Crítica | Servidor aislado `DJANGO_DEBUG=False` y disparador temporal de `PermissionDenied`. | HTTP 403 con P-08: "No tienes permiso", "Tu cuenta no tiene acceso a esta sección.", enlaces "Volver al inicio" y opcionalmente "Ir a mi panel". | El dueño backend no proveyó un mecanismo/URLConf temporal reproducible en la aplicación integrada para disparar `PermissionDenied` a través del handler real. | **BLOCKED** |
| **QA-C0-04** | Crítica | Servidor aislado `DJANGO_DEBUG=False` y disparador temporal de excepción no controlada. | HTTP 500 con P-08: "Algo salió mal", mensaje seguro sin traza técnica, enlace "Volver al inicio". | El dueño backend no proveyó un mecanismo/URLConf temporal reproducible en la aplicación integrada para disparar un error 500 no controlado a través del handler real. | **BLOCKED** |
| **QA-C0-05** | Crítica | Build CSS y `collectstatic` completados. | `/static/css/tailwind.css` servido con HTTP 200 y `text/css`, sin CDN/runtime de Tailwind en DOM, slots de logo vacíos. | HTTP 200 servido desde `/static/css/tailwind.css` (`text/css`, 46,781 bytes). Cero scripts o links con CDN Tailwind. Slots de logo limpios. | **PASS** |
| **QA-C0-06** | Alta | Servidor activo; ruta `/panel/`. Viewports 1440×900 y 390×844. | HTTP 200. Navbar, sidebar, `#contenido-panel`. Drawer móvil abre con `aria-expanded="true"`, overlay, foco atrapado en drawer; Escape cierra y retorna foco al botón. | HTTP 200. "Panel editorial", header, `[data-panel-menu]` y `#contenido-panel` visibles. Drawer móvil abre (`aria-expanded="true"`, foco interno, overlay visible) y cierra con Escape devolviendo foco a `[data-panel-menu-open]` (`aria-expanded="false"`, `inert`, `aria-hidden="true"`). Consola limpia. | **PASS** |
| **QA-C0-07** | Alta | Servidor activo en `/` y `/panel/`. | Tokens `--color-brand-100` y `--color-brand-900` en CSS compilado. Elementos sobre `bg-brand-100` usan texto `brand-900` (`rgb(31, 77, 89)`). Sin texto sobre `accent-500`. Foco visible. | Tokens presentes en `tailwind.css`. Enlace activo de sidebar con fondo `rgb(200, 216, 228)` tiene color de texto `rgb(31, 77, 89)`. Sin texto sobre fondo `accent-500`. Foco visible en elementos interactivos (`outline: rgb(43, 103, 119) solid 2px`). | **PASS** |
| **QA-C0-08** | Alta | Breakpoints 390×844, 768×1024, 1440×900. | Sin desborde horizontal (`scrollWidth <= innerWidth`). En móvil (390 px), búsqueda y drawer actualizan `aria-expanded`, foco e `inert`. | Cero desborde horizontal en los 3 viewports (`scrollWidth == innerWidth` en 390, 768 y 1440 px). Búsqueda móvil abre input enfocado y cierra. Menú móvil público abre drawer, atrapa foco y cierra con Escape devolviendo foco al botón. | **PASS** |

---

## 4. Evidencia gráfica (Screenshots)

Todos los screenshots requeridos fueron capturados con Chromium en resolución nativa y se encuentran almacenados en `docs/qa/screenshots/`:

| Archivo | Caso | Viewport | Descripción |
|---|---|---|---|
| `QA-C0-01-1440x900.png` | QA-C0-01 | 1440×900 | Home público, navbar, slots vacíos de logo, botones de login/registro |
| `QA-C0-02-1440x900.png` | QA-C0-02 | 1440×900 | **Evidencia de defecto:** Pantalla técnica debug 404 de Django en vez de P-08 |
| `QA-C0-05-1440x900.png` | QA-C0-05 | 1440×900 | Validación de estático compilado `tailwind.css` y ausencia de CDN |
| `QA-C0-06-1440x900.png` | QA-C0-06 | 1440×900 | Cascarón del panel editorial en desktop |
| `QA-C0-06-390x844.png` | QA-C0-06 | 390×844 | Cascarón del panel editorial en móvil (drawer cerrado) |
| `QA-C0-06-390x844-drawer.png` | QA-C0-06 | 390×844 | Drawer editorial abierto con overlay y navegación |
| `QA-C0-07-focus.png` | QA-C0-07 | 1440×900 | Anillo de foco accesible visible en enlace de salto |
| `QA-C0-08-390x844.png` | QA-C0-08 | 390×844 | Vista móvil general sin desborde horizontal |
| `QA-C0-08-768x1024.png` | QA-C0-08 | 768×1024 | Vista tablet sin desborde horizontal |
| `QA-C0-08-1440x900.png` | QA-C0-08 | 1440×900 | Vista desktop general |
| `QA-C0-08-390x844-search.png` | QA-C0-08 | 390×844 | Barra de búsqueda móvil expandida con input activo |
| `QA-C0-08-390x844-menu.png` | QA-C0-08 | 390×844 | Menú público móvil abierto con foco atrapado |

---

## 5. Hallazgos de consola y red

- **Consola:**
  - En recorrido normal (`/`, `/panel/` en mobile/desktop/tablet): **0 errores** de consola.
  - En `/qa-route-does-not-exist/`: Registro de error esperado por status HTTP 404 (`Failed to load resource: the server responded with a status of 404 (Not Found)`).
- **Red:**
  - `GET /static/css/tailwind.css`: HTTP 200 OK (`text/css`, 46,781 bytes).
  - `GET /static/js/site.js`: HTTP 200 OK (`text/javascript`, 5,893 bytes).
  - Ningún recurso externo o CDN Tailwind solicitado.
  - Cero fallos no justificados de red (`requestfailed`).

---

## 6. Defectos reproducibles y bloqueos

### Defecto 1 (Crítico): QA-C0-02 — Fallo en renderizado de handler404 (P-08) en servidor activo
- **Severidad:** Crítica
- **Descripción:** Al navegar a una ruta inexistente como `/qa-route-does-not-exist/`, el servidor activo responde con la página técnica interna de depuración de Django (`Page not found (404)`) en lugar de invocar `handler404` (`templates/errors/404.html` P-08).
- **Causa raíz:** En Django, cuando `DEBUG=True` (configuración del entorno de desarrollo activo `config.settings.development`), el interceptor interno de Django muestra la vista técnica de depuración y no delega a `handler404`. El plan de pruebas especifica ejecutar QA-C0-02 contra el servidor normal activo (`DJANGO_DEBUG=True`), pero el handler de producción de Django sólo opera con `DEBUG=False` o mediante un middleware/mecanismo explícito.
- **Impacto:** No se satisfacen las aserciones de P-08 ("Página no encontrada", descripción amigable ni enlaces a "Volver al inicio" / "Ver todas las noticias").

### Bloqueo 1 (Crítico): QA-C0-03 y QA-C0-04 — Ausencia de mecanismo de disparo para 403 y 500
- **Severidad:** Crítica
- **Descripción:** La aplicación integrada no expone rutas temporales ni URLs de prueba que desencadenen `PermissionDenied` (403) ni excepciones no controladas (500) en el servidor de pruebas con `DJANGO_DEBUG=False`.
- **Causa raíz:** No fue entregada por el equipo de desarrollo la evidencia o URLConf temporal estipulada en el plan bajo la sección *Precondición de disparo de errores*.
- **Impacto:** Conforme a las reglas del plan y las instrucciones de QA funcional, ambos casos quedan catalogados como **BLOCKED**. No está permitido simular llamadas directas de Python en lugar de probar los handlers reales bajo HTTP.

### Defecto 2 (Menor): Formateo de código en suite de pruebas de vistas
- **Severidad:** Baja (Calidad de código)
- **Descripción:** El comando `uv run ruff format --check .` falló con código 1 indicando que `apps/core/tests/test_views.py` no cumple con el formato estándar de Ruff.

---

## 7. Veredicto final

### **FAIL**

**Justificación técnica:**
1. **QA-C0-02 (Crítico) resultó en FAIL:** El servidor de desarrollo con `DEBUG=True` expone la pantalla de depuración técnica de Django y no la plantilla P-08 de 404.
2. **QA-C0-03 y QA-C0-04 (Críticos) resultaron en BLOCKED:** No existe mecanismo de disparo HTTP reproducible para validar los handlers reales de 403 y 500.
3. Conforme a las reglas explícitas de bloqueo del plan (§ *Reglas de bloqueo y veredicto*):
   > *"Fallo o bloqueo de cualquier caso crítico (QA-C0-01 a QA-C0-05) implica veredicto FAIL."*
   > *"Una ausencia de disparador HTTP real para 403/500 es BLOCKED, no PASS; requiere evidencia del mecanismo temporal y una nueva ejecución completa de esos casos."*
