# Spec SDD — C0 · Fundación técnica

**Checkpoint:** C0 · Fundación (fase F0 del roadmap)
**Slug de fase:** `c0-foundation`
**Autor del spec:** Kiro (rol Especificación)
**Documentos fuente:** [ROADMAP.md](../ROADMAP.md) · [ARCHITECTURE_AND_STACK.md](../ARCHITECTURE_AND_STACK.md) · [DATA_MODEL.md](../DATA_MODEL.md) · [UI_UX_SPEC.md](../UI_UX_SPEC.md) · [03-flujo-de-trabajo.md](../../03-flujo-de-trabajo.md)
**Fuente visual obligatoria:** [Proyecto Stitch `14921403100817785323`](https://stitch.withgoogle.com/projects/14921403100817785323)

---

## 1. Objetivo y resultado observable

Dejar un proyecto Django ejecutable, seguro y consistente que sirva de cimiento para todas las fases siguientes, sin adelantar dominio de negocio.

Resultado observable al cerrar C0:

- El proyecto Django levanta desde cero contra PostgreSQL con instrucciones reproducibles.
- La configuración está separada por ambiente (`base`, `development`, `test`, `production`) y los secretos viven fuera de Git.
- Los layouts público y de panel existen como cascarón reutilizable con los tokens visuales aprobados.
- Los handlers de error 403, 404 y 500 responden con las plantillas diseñadas (P-08).
- La base de pruebas corre en verde y el linter/formatter pasa.
- No hay migraciones de dominio: sólo las nativas de Django y la habilitación de la extensión `unaccent`.

C0 **no** entrega ninguna pantalla funcional de producto salvo P-08; habilita el cascarón compartido para las 18 restantes.

---

## 2. Alcance y no alcance

### 2.1 Alcance (dentro de C0)

1. Scaffold del proyecto Django `5.2.17` sobre Python `3.13.15`, gestionado con `uv`.
2. Estructura de carpetas exacta según `ARCHITECTURE_AND_STACK.md` §3.
3. Baseline de dependencias declarado en `pyproject.toml` y fijado en `uv.lock`.
4. Settings divididos: `config/settings/{base,development,test,production}.py` con `python-decouple`.
5. Conexión a PostgreSQL `17.11` local con driver `psycopg` 3.
6. Apps de dominio creadas vacías y registradas: `core`, `accounts`, `taxonomy`, `content`, `comments`, `media`.
7. Layout público (`base.html`), layout de panel (`panel_base.html`), componentes base y tokens CSS.
8. Plantillas de error `403.html`, `404.html`, `500.html` conectadas a los handlers reales de Django.
9. Configuración de estáticos (WhiteNoise) y de `MEDIA_ROOT`/`MEDIA_URL` para desarrollo.
10. Habilitación de la extensión PostgreSQL `unaccent` vía migración versionada.
11. Baseline de pruebas con `pytest` + `pytest-django` y una prueba de humo por área crítica.
12. `.env.example`, `.gitignore`, `.python-version` y `README.md` con instrucciones de arranque.
13. Configuración de zona horaria/localización: `USE_TZ = True`, idioma y `TIME_ZONE` del proyecto.

### 2.2 No alcance (fuera de C0)

- Modelos de dominio (`Post`, `Category`, `Department`, `File`, `Profile`, `Comment`) y sus migraciones → F1/C1.
- Autenticación, registro, login, roles y permisos → F2/C2.
- Cualquier pantalla pública o de panel con datos reales (P-01…P-07, A-00…A-10) → fases posteriores.
- Servicio de subida/validación de archivos → F1.
- Datos semilla de dominio (categorías, departamentos, publicaciones). En C0 sólo se prepara la mecánica de fixtures; el contenido de dominio llega en F1.
- Configuración productiva real (hosting, TLS, object storage, backups) → decisiones de despliegue documentadas en `ARCHITECTURE_AND_STACK.md` §11.
- REST/GraphQL, Celery, Redis, Docker, SPA, recuperación por email (no objetivos §10). Nota: Tailwind CSS queda aprobado por decisión de usuario (ver §Decisiones de requisitos), por lo que ya no forma parte de los no objetivos.

---

## 3. Dependencias y contratos de entrada/salida

### 3.1 Entradas

- Repositorio con documentación y export de Stitch; **sin código Django** (estado actual declarado en AGENTS.md).
- Contrato de stack y arquitectura ya aprobado.
- Decisiones pendientes de F0 del roadmap: motor/versión de BD (resuelto: PostgreSQL `17.11`), estrategia de archivos en desarrollo (resuelto abajo como asunción), destino de despliegue (fuera de C0).

### 3.2 Salidas (contrato para C1)

- Proyecto ejecutable con `config.settings.development`.
- Apps de dominio registradas y listas para recibir modelos.
- Convención de nombres persistidos en inglés confirmada en settings y en la migración de `unaccent`.
- Base de pruebas y linter operativos como quality gate reutilizable.

C1 (Datos) no puede comenzar hasta que este contrato esté aceptado con evidencia reproducible.

---

## 4. Requisitos funcionales y reglas

Los requisitos se numeran `RF-C0-xx`. "Verificable" indica que el criterio de aceptación §10 lo cubre.

| ID | Requisito | Regla / detalle |
|---|---|---|
| RF-C0-01 | El proyecto se instala con `uv sync --locked` | Falla si `pyproject.toml` cambió sin regenerar `uv.lock`. |
| RF-C0-02 | `python manage.py check` no reporta errores | Con `DJANGO_SETTINGS_MODULE=config.settings.development`. |
| RF-C0-03 | El servidor de desarrollo levanta | `runserver` responde `200` en `/` (placeholder o home-cascarón) sin trazas de error. |
| RF-C0-04 | Conexión real a PostgreSQL | `migrate` corre contra PostgreSQL `17.11`; SQLite queda prohibido incluso en desarrollo. |
| RF-C0-05 | Settings separados y selección explícita | `base`/`development`/`test`/`production`; sin ramificar por `if DEBUG` dentro de un mismo archivo. |
| RF-C0-06 | Secretos fuera de Git | `SECRET_KEY`, credenciales de BD y hosts vienen de variables de entorno vía `python-decouple`. `.env` ignorado; `.env.example` versionado sin secretos. |
| RF-C0-07 | Apps de dominio registradas | `core`, `accounts`, `taxonomy`, `content`, `comments`, `media` en `INSTALLED_APPS` con `AppConfig` y `default_auto_field = BigAutoField`. |
| RF-C0-08 | Layout público operativo | `templates/base.html` con navbar, área de contenido y footer según UI_UX_SPEC §3.1, en estado no autenticado. |
| RF-C0-09 | Layout de panel operativo | `templates/panel_base.html` con navbar + sidebar + área de contenido según UI_UX_SPEC §3.2, como cascarón. |
| RF-C0-10 | Handler 404 | Devuelve `templates/errors/404.html` con estado y contenido de P-08 (404). |
| RF-C0-11 | Handler 403 | Devuelve `templates/errors/403.html` con contenido de P-08 (403). |
| RF-C0-12 | Handler 500 | Devuelve `templates/errors/500.html` con contenido de P-08 (500), sin exponer traza en `DEBUG=False`. |
| RF-C0-13 | Tokens visuales | Tailwind CSS `4.3` compilado cuyo `@theme` CSS-first mapea los tokens de UI_UX_SPEC §1 (color, tipografía, espaciado, radios, sombras, breakpoints). |
| RF-C0-14 | Estáticos servidos | WhiteNoise configurado; `collectstatic` corre sin error; layouts reservan espacio vacío de logo (`data-logo-slot`) sin asset ni wordmark inventado; el CSS compilado de Tailwind se sirve como estático. |
| RF-C0-15 | Media en desarrollo | `MEDIA_ROOT`/`MEDIA_URL` definidos; `media/` ignorado por Git. |
| RF-C0-16 | Extensión `unaccent` | Migración versionada crea `CREATE EXTENSION IF NOT EXISTS unaccent;`. |
| RF-C0-17 | Zona horaria y localización | `USE_TZ = True`; `LANGUAGE_CODE` y `TIME_ZONE` definidos para México. |
| RF-C0-18 | Base de pruebas | `pytest` con `config.settings.test` corre en verde; incluye pruebas de humo (§9). |
| RF-C0-19 | Linter/formatter | `ruff check` y `ruff format --check` pasan con longitud máxima 100. |
| RF-C0-20 | Documentación de arranque | `README.md` documenta requisitos, variables, creación de BD, migraciones, build de Tailwind y arranque reproducibles. |
| RF-C0-21 | Build de Tailwind reproducible | `@tailwindcss/cli` genera el CSS de producción desde `static/css/input.css`, sin CDN ni `tailwind.config.js`; el comando de build está documentado y es ejecutable. |
| RF-C0-22 | Validación de dependencia/build de Tailwind | Tailwind CSS `4.3` y `@tailwindcss/cli` están declarados y fijados; el build produce el artefacto esperado y falla de forma detectable si `input.css` o sus tokens `@theme` están rotos. |

### 4.1 Reglas de negocio y arquitectura aplicables en C0

- **RN-C0-A** Código, identificadores, esquema, comentarios y commits en inglés; UI y mensajes en español.
- **RN-C0-B** No se usan `db_table`/`db_column` para traducir nombres entre capas.
- **RN-C0-C** Las plantillas no consultan ORM ni deciden permisos; los handlers de error se mantienen sin lógica de dominio.
- **RN-C0-D** `core` sólo contiene primitivas HTTP/UI y utilidades transversales; no dominio.
- **RN-C0-E** Prohibidas importaciones circulares entre apps.
- **RN-C0-F** JavaScript sólo como mejora progresiva; el CSS de producción se genera con Tailwind CSS compilado (no CDN), mobile-first, mapeando los tokens de `UI_UX_SPEC.md` §1.
- **RN-C0-G** Datetimes timezone-aware exclusivamente.
- **RN-C0-H** `uv` inicializa el proyecto e instala dependencias; los artefactos que tengan generador se crean con el CLI correspondiente (`uv init`, `uv add`, `django-admin startproject`, `manage.py startapp`, npm/CLI), no manualmente. La configuración requerida sin generador se mantiene explícita y manual.

---

## 5. Scaffold Django/uv exacto

Secuencia de referencia (identificadores en inglés; comandos que el rol Backend ejecutará, no Kiro). Los archivos y directorios generables deben salir de estos comandos; los ajustes de configuración posteriores se realizan manualmente y de forma explícita:

```bash
# 1. Fijar versión de Python del proyecto
echo "3.13.15" > .python-version

# 2. Inicializar proyecto gestionado por uv (crea pyproject.toml y .venv)
uv init --python 3.13.15 --name newsjoryer

# 3. Declarar dependencias base (resueltas y fijadas en uv.lock)
uv add "django==5.2.17" "psycopg[binary]~=3.2" "python-decouple==3.8" \
       "pillow~=11.0" "whitenoise~=6.0"

# 4. Dependencias de desarrollo/pruebas y calidad
uv add --dev "pytest" "pytest-django" "ruff~=0.14.0"

# 5. Crear el proyecto Django con layout config/ + apps/
uv run django-admin startproject config .
mkdir -p apps
uv run python manage.py startapp core apps/core
uv run python manage.py startapp accounts apps/accounts
uv run python manage.py startapp taxonomy apps/taxonomy
uv run python manage.py startapp content apps/content
uv run python manage.py startapp comments apps/comments
uv run python manage.py startapp media apps/media
```

> Nota de implementación: al crear apps dentro de `apps/`, cada `AppConfig.name` debe ser
> `apps.<app>` y su `label` el nombre corto (`core`, `accounts`, …). El paquete `apps/`
> lleva `__init__.py`. `manage.py` y `config/` viven en la raíz `newsjoryer/`.

> Sobre `psycopg`: se usa `psycopg[binary]` para desarrollo local reproducible. Si el
> despliegue productivo exige el paquete compilado (`psycopg[c]`), se decide en la fase de
> producción; no bloquea C0.

---

## 6. Baseline de dependencias

Versiones conforme a `ARCHITECTURE_AND_STACK.md` §2. Declaración con rango compatible en
`pyproject.toml`; resolución exacta con hash en `uv.lock`.

| Paquete | Restricción declarada | Rol |
|---|---|---|
| `python` | `3.13.15` (`.python-version`) | Runtime |
| `django` | `==5.2.17` | Framework (línea base exacta, cambia sólo por ADR) |
| `psycopg` | `~=3.2` (`3.2.x`) | Driver PostgreSQL |
| `python-decouple` | `==3.8` | Variables de entorno |
| `pillow` | `~=11.0` (`11.x`) | Imágenes (preparado para F1) |
| `whitenoise` | `~=6.0` (`6.x`) | Estáticos |
| `pytest` + `pytest-django` | compatibles, fijadas en lock | Pruebas |
| `ruff` | `~=0.14.0` (`0.14.x`) | Linter y formatter |
| `uv` | `>=0.12.17,<0.13` (entorno) | Gestor de Python/dependencias |

Regla de CI/revisión: `uv sync --locked`; un `pyproject.toml` sin su `uv.lock` correspondiente se rechaza.

---

## 7. Settings separados y variables de entorno

### 7.1 Módulos de settings

```text
config/settings/
├── base.py         # apps, middleware, templates, auth, i18n/l10n, BD, static/media, DRF-free
├── development.py   # DEBUG=True explícito, hosts locales, WhiteNoise en modo dev
├── test.py          # aislado, rápido y determinista; password hasher rápido; sin WhiteNoise manifest
└── production.py    # DEBUG=False, ALLOWED_HOSTS, cookies seguras, HTTPS/proxy, estáticos productivos
```

- `base.py` define `INSTALLED_APPS` (apps de dominio + `django.contrib.*` necesarias + WhiteNoise), `MIDDLEWARE` (incluye `WhiteNoiseMiddleware`), `TEMPLATES` (con `DIRS = [BASE_DIR / "templates"]`), `AUTH_PASSWORD_VALIDATORS`, `DATABASES` desde `decouple`, `STATIC_*`, `MEDIA_*`, `USE_TZ = True`, `LANGUAGE_CODE`, `TIME_ZONE`, `DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"`.
- `development.py`: `DEBUG = config("DJANGO_DEBUG", cast=bool, default=True)`, `ALLOWED_HOSTS = ["localhost", "127.0.0.1"]`.
- `test.py`: base de datos de prueba PostgreSQL, hasher MD5 para velocidad, `DEBUG = False`, almacenamiento de estáticos no-manifest.
- `production.py`: `DEBUG = False`, `ALLOWED_HOSTS` desde entorno, `SECURE_*`/`SESSION_COOKIE_SECURE`/`CSRF_COOKIE_SECURE`, `SECURE_PROXY_SSL_HEADER`, almacenamiento comprimido de WhiteNoise. No configura hosting concreto (fuera de C0).
- Selección explícita por `DJANGO_SETTINGS_MODULE`; nada de `if DEBUG` ramificando un solo archivo.

### 7.2 Variables mínimas (`.env.example`)

```dotenv
DJANGO_SETTINGS_MODULE=config.settings.development
DJANGO_SECRET_KEY=replace-me
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
POSTGRES_DB=canaco_news
POSTGRES_USER=canaco_news
POSTGRES_PASSWORD=replace-me
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
```

`.env` nunca se versiona. Variables de media productiva, proxy y observabilidad se agregan al decidir despliegue.

---

## 7bis. Tailwind CSS `4.3`

Tailwind CSS `4.3` es la base de estilos aprobada. El CSS se compila durante el build, nunca mediante CDN ni runtime en el navegador. Node sólo se usa para instalar y compilar; no es un proceso de larga duración requerido en EC2.

### 7bis.1 Toolchain y dependencia

- Se usa el CLI oficial `@tailwindcss/cli` con Tailwind CSS `4.3`, ambos declarados y fijados en `package.json` y el lockfile Node elegido.
- No se enlaza un script u hoja CDN de Tailwind en `base.html`, `panel_base.html` ni `errors/*`; las plantillas cargan únicamente `static/css/tailwind.css`.
- El CSS fuente adopta el enfoque CSS-first de Tailwind v4: `@import "tailwindcss";` y tokens en `@theme` dentro de `static/css/input.css`.
- No se crea `tailwind.config.js`. Sólo una necesidad explícita y excepcional de compatibilidad podría justificarlo; C0 no tiene ninguna.
- Tailwind detecta las clases de las plantillas desde las fuentes del proyecto. Si se excluye una ruta deliberadamente, se declara con `@source` en `input.css`, no con configuración JavaScript.
- El artefacto compilado se sirve por Django staticfiles y WhiteNoise, y debe existir antes de `collectstatic`.

### 7bis.2 Archivos y ubicación

```text
newsjoryer/
├── package.json              # tailwindcss 4.3, @tailwindcss/cli y scripts de build
├── <lockfile Node>           # versiones resueltas para un build reproducible
├── static/
│   └── css/
│       ├── input.css         # @import "tailwindcss"; tokens @theme
│       └── tailwind.css      # artefacto compilado servido por WhiteNoise
```

`input.css` es la fuente y `tailwind.css` es la salida. El artefacto se genera en build y debe estar disponible antes de ejecutar `collectstatic`; no se entrega desde un CDN.

### 7bis.3 Tokens CSS-first

Los valores aprobados en `UI_UX_SPEC.md` §1 se definen directamente en `@theme`:

```css
/* static/css/input.css */
@import "tailwindcss";

@theme {
  --color-brand-50: #eef4f8;
  --color-brand-100: #c8d8e4;
  --color-brand-500: #4a8496;
  --color-brand-700: #2b6777;
  --color-brand-900: #1f4d59;
  --color-accent-100: #e7f4f0;
  --color-accent-500: #52ab98;
  --color-accent-700: #3a7d6f;
  --font-display: "Source Serif 4", Georgia, serif;
  --font-body: Inter, system-ui, -apple-system, sans-serif;
  /* Espaciado, radios, sombras, breakpoints y tipografía de UI_UX_SPEC §1. */
}
```

Los pares de contraste aprobados de `UI_UX_SPEC.md` §1.2 se respetan al aplicar utilidades: texto sobre `brand-100` usa `brand-900`; `accent-500` no lleva texto encima (usar `accent-700`). QA-C0-07 verifica estos pares.

### 7bis.4 Build y validación

```bash
# Instalar la toolchain fijada por el lockfile Node
npm ci

# Compilar el CSS de producción
npx @tailwindcss/cli -i static/css/input.css -o static/css/tailwind.css --minify
```

- El comando queda documentado en `README.md` (RF-C0-20) y como script del manifiesto Node (RF-C0-21).
- RF-C0-22 valida que Tailwind CSS `4.3` y `@tailwindcss/cli` estén fijados, que el build produzca `tailwind.css` no vacío y que falle de forma detectable si `input.css` o `@theme` están rotos.
- El gate ejecuta el build y confirma que `collectstatic` recoge `tailwind.css`. La producción EC2 ejecuta Django/WhiteNoise sobre ese artefacto; Node no queda ejecutándose.

---

## 8. PostgreSQL local, estructura de carpetas y migraciones

### 8.1 Preparación de PostgreSQL local (referencia reproducible)

```bash
# Crear rol y base de datos (ajustar credenciales al .env local)
createuser canaco_news --pwprompt
createdb canaco_news --owner=canaco_news --encoding=UTF8

# La extensión unaccent se instala vía migración Django, no manualmente.
```

- Motor: PostgreSQL `17.11`, encoding `UTF8`.
- `ENGINE = "django.db.backends.postgresql"`.
- La creación manual de esquema queda prohibida salvo recuperación documentada; todo cambio pasa por migración.

### 8.2 Estructura de carpetas objetivo (contrato §3 de arquitectura)

```text
newsjoryer/
├── manage.py
├── pyproject.toml
├── uv.lock
├── .python-version                 # 3.13.15
├── .env.example
├── .gitignore
├── README.md
├── config/
│   ├── asgi.py
│   ├── wsgi.py
│   ├── urls.py                      # rutas raíz + handlers de error
│   └── settings/{base,development,test,production}.py
├── apps/
│   ├── core/                        # primitivas HTTP/UI; sin dominio
│   ├── accounts/
│   ├── taxonomy/
│   ├── content/
│   ├── comments/
│   └── media/
│       └── <app>/{migrations,templates/<app>,tests,admin.py,apps.py,
│                   forms.py,models.py,selectors.py,services.py,urls.py,views.py}
├── templates/
│   ├── base.html                    # layout público
│   ├── panel_base.html              # layout de panel
│   ├── components/                  # componentes reutilizables
│   └── errors/{403.html,404.html,500.html}
├── static/
│   ├── css/                         # input.css con @theme y tailwind.css compilado
│   ├── js/                          # mejora progresiva mínima
│   └── images/                      # espacio reservado; sin asset de logo en C0
├── media/                           # cargas; ignorado por Git
├── fixtures/                        # datos estables (mecánica en C0; dominio en F1)
├── docs/
└── scripts/
```

En C0, las apps de dominio pueden tener `models.py`, `selectors.py`, `services.py`, `forms.py`, `urls.py` y `views.py` vacíos o con placeholders sin lógica; existen para fijar el contrato de estructura. El archivo scaffold (`selectors.py`, `services.py`) puede crearse ahora o al iniciar la app en su fase; C0 exige al menos que las apps estén registradas y sean importables sin ciclos.

### 8.3 Baseline de migraciones

- C0 corre `migrate` con las migraciones nativas de Django (`auth`, `contenttypes`, `sessions`, `admin`).
- Se agrega **una** migración propia mínima para habilitar `unaccent`. Ubicación sugerida: app `core` (primitiva transversal de BD, sin modelo de dominio).

```python
# apps/core/migrations/0001_enable_unaccent.py
from django.contrib.postgres.operations import UnaccentExtension
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = []
    operations = [UnaccentExtension()]
```

> Requiere `django.contrib.postgres` disponible (incluido en Django) y permisos de
> superusuario o `CREATE EXTENSION` en la base local. Si el rol no puede crear extensiones,
> se documenta el `CREATE EXTENSION` previo por un superusuario y la migración queda
> idempotente con `IF NOT EXISTS`.

- **No** se crean migraciones de dominio en C0.
- Prueba de migración: `migrate` en base limpia debe dejar `unaccent` instalada (verificable con `SELECT extname FROM pg_extension`).

---

## 9. Pantallas, rutas y estados

### 9.1 Pantalla Stitch de C0

| Ref. | Pantalla | ID de pantalla Stitch | Export local |
|---|---|---|---|
| P-08 | Pantallas de Error (404, 403, 500) | `969bbbda0f1541618ca8c1c32547b22b` | `stitch-export/screens/03-P-08-Pantallas-de-Error-404-403-500.html` |
| UI/UX | Especificación base de tokens y layouts | `11162008934687650888` | `stitch-export/screens/01-UI-UX-SPEC-md.md` |
| Asset | Logo CANACO SERVYTUR Villahermosa (referencia Stitch; no se publica en `static/` en C0) | `b6530a120a494304b3209259e1e42396` | `stitch-export/screens/11-Logo-CANACO-SERVYTUR-Villahermosa.svg` |

Los layouts `base.html` y `panel_base.html` son cascarón transversal (UI_UX_SPEC §3.1 y §3.2); no corresponden a una pantalla Stitch única, pero deben respetar navbar, sidebar, footer y tokens definidos. En C0 el branding de logo se limita a contenedores vacíos `data-logo-slot` (sin asset ni wordmark inventado).

### 9.2 Contenido de P-08 (UI_UX_SPEC §5.8)

| Código | Título | Mensaje | Acciones |
|---|---|---|---|
| 404 | "Página no encontrada" | "La noticia que buscas no existe o fue retirada." | "Volver al inicio" (primario) · "Ver todas las noticias" (secundario) |
| 403 | "No tienes permiso" | "Tu cuenta no tiene acceso a esta sección." | "Volver al inicio" (primario) · "Ir a mi panel" (secundario, si autenticado) |
| 500 | "Algo salió mal" | "Ocurrió un error inesperado. Intenta de nuevo en unos minutos." | "Volver al inicio" (primario) |

Detalle visual: contenedor centrado 520 px, fondo `surface-alt`, código en `display` `brand-100` como marca de agua detrás del icono. En C0, "Ver todas las noticias" e "Ir a mi panel" pueden apuntar a rutas placeholder o al home hasta que existan sus destinos; el criterio es que el enlace resuelva sin romper.

### 9.3 Handlers de error (config/urls.py)

```python
# config/urls.py
handler403 = "apps.core.views.error_403"
handler404 = "apps.core.views.error_404"
handler500 = "apps.core.views.error_500"
```

- Las vistas de error viven en `apps/core/views.py` (primitiva transversal), renderizan las plantillas de `templates/errors/` y devuelven el código HTTP correcto.
- `handler500` no recibe contexto de request enriquecido ni expone traza con `DEBUG=False`.
- Para verificar 403/404/500 en desarrollo con `DEBUG=True`, se documenta el uso de `DEBUG=False` temporal o vistas de prueba internas retiradas antes del cierre.

### 9.4 Estados cubiertos en C0

| Estado | Comportamiento esperado |
|---|---|
| Normal | `/` responde `200`; layouts renderizan; estáticos cargan. |
| Ruta inexistente | `404.html` con código 404. |
| Acceso prohibido | `403.html` con código 403 (mecánica de handler; la autorización real llega en F2). |
| Error de servidor | `500.html` con código 500, sin traza en `DEBUG=False`. |
| Sin sesión | Navbar público muestra "Iniciar sesión" y "Registrarse" (cascarón; enlaces pueden ser placeholder). |

---

## 10. Criterios de aceptación verificables

| ID | Criterio | Cómo se verifica |
|---|---|---|
| CA-01 | Instalación reproducible | `uv sync --locked` termina sin error en entorno limpio. |
| CA-02 | Configuración válida | `uv run python manage.py check` sin errores con settings de desarrollo. |
| CA-03 | Migraciones aplican | `uv run python manage.py migrate` corre en base PostgreSQL limpia sin error. |
| CA-04 | Extensión `unaccent` | `SELECT extname FROM pg_extension WHERE extname='unaccent';` devuelve una fila tras migrar. |
| CA-05 | Servidor levanta | `runserver` responde `200` en `/` sin trazas de error en consola. |
| CA-06 | 404 diseñado | Petición a ruta inexistente devuelve código 404 y el contenido P-08 (404). |
| CA-07 | 403 diseñado | El handler 403 devuelve código 403 y el contenido P-08 (403). |
| CA-08 | 500 diseñado | El handler 500 devuelve código 500 con la plantilla P-08 (500) y sin traza en `DEBUG=False`. |
| CA-09 | Layout público | `base.html` renderiza navbar, contenido y footer con tokens correctos. |
| CA-10 | Layout de panel | `panel_base.html` renderiza navbar + sidebar + contenido como cascarón. |
| CA-11 | Estáticos | `collectstatic` corre sin error; layouts usan solo contenedores vacíos `data-logo-slot` (sin asset ni wordmark de logo). |
| CA-11b | Tailwind compilado | Tailwind CSS `4.3` con `@tailwindcss/cli` produce `static/css/tailwind.css` no vacío; ninguna plantilla enlaza CDN ni runtime de Tailwind; `collectstatic` recoge el artefacto y las clases mapean los tokens `@theme` de UI_UX_SPEC §1. |
| CA-12 | Secretos fuera de Git | No hay secretos ni `.env` versionados; `.env.example` presente sin valores reales. |
| CA-13 | Pruebas verdes | `uv run pytest` con `config.settings.test` pasa, incluyendo pruebas de humo. |
| CA-14 | Calidad de código | `uv run ruff check` y `uv run ruff format --check` pasan (máx. 100 columnas). |
| CA-15 | Apps registradas | Las seis apps de dominio aparecen en `INSTALLED_APPS` y son importables sin ciclos. |
| CA-16 | Documentación | `README.md` permite a un tercero levantar el proyecto siguiendo sólo sus pasos. |

---

## 11. Pruebas base y casos que deben entrar al plan QA

### 11.1 Pruebas automatizadas base (backend, dueño Codex)

| Nivel | Prueba de humo |
|---|---|
| Configuración | `manage.py check` sin issues en `development` y `test`. |
| BD/migración | `migrate` limpio y presencia de `unaccent` (`test_unaccent_extension_enabled`). |
| Vistas de error | `error_404`/`error_403`/`error_500` devuelven el status y usan la plantilla correcta. |
| Templates | `base.html` y `panel_base.html` renderizan sin excepción con contexto mínimo. |
| Estáticos | Resolución de `static()` para la hoja de tokens compilada; sin requerir asset de logo. |

### 11.2 Casos base para el plan QA funcional (dueño Orquestador, validación post-integración)

Tras integrar backend y frontend, estos casos alimentan
`docs/qa/c0-foundation-functional-test-plan.md` (Playwright/Chromium):

1. **QA-C0-01 — Home cascarón:** cargar `/` → `200`, navbar público visible (Iniciar sesión / Registrarse), footer presente, sin errores de consola ni requests fallidos.
2. **QA-C0-02 — 404:** visitar una ruta inexistente → página P-08 (404) con título "Página no encontrada" y acciones esperadas.
3. **QA-C0-03 — 403:** disparar el handler 403 → página P-08 (403) con "No tienes permiso".
4. **QA-C0-04 — 500:** disparar el handler 500 con `DEBUG=False` → página P-08 (500) sin traza técnica visible.
5. **QA-C0-05 — Estáticos:** verificar que `static/css/tailwind.css` carga (status `200`), que los layouts muestran solo espacios vacíos de logo (`data-logo-slot`) sin asset ni wordmark inventado, que ninguna plantilla enlaza CDN o runtime de Tailwind y que el artefacto proviene del build de Tailwind CSS `4.3` con `@tailwindcss/cli`.
6. **QA-C0-06 — Layout de panel (cascarón):** renderizar `panel_base.html` en una ruta placeholder → sidebar + navbar visibles con tokens correctos.
7. **QA-C0-07 — Tokens/contraste:** confirmar en las pantallas cascarón que los colores de texto sobre superficies cumplen los pares aprobados (p. ej. texto sobre `brand-100` usa `brand-900`).
8. **QA-C0-08 — Responsive base:** navbar y layout responden en breakpoints `base`, `md`, `lg` sin desbordes.

Regla de bloqueo: ningún caso crítico (QA-C0-01…QA-C0-05) puede fallar; sin errores de consola ni requests fallidos no justificados.

---

## 12. Riesgos

| ID | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R-08 | Uso accidental del CDN de Tailwind en lugar del artefacto compilado | Medio (build no reproducible, purge ausente, peso excesivo) | Prohibido el CDN en plantillas; sólo se sirve el CSS compilado; QA-C0-05 y CA-11b lo verifican. |
| R-09 | Toolchain Node de Tailwind sin fijar rompe reproducibilidad | Medio | Fijar Tailwind CSS `4.3` y `@tailwindcss/cli` en lockfile; `npm ci` y el build en el gate. Node sólo participa en build. |
| R-02 | Permisos para `CREATE EXTENSION unaccent` en PostgreSQL local | Medio (migración falla) | Documentar creación previa por superusuario; migración idempotente `IF NOT EXISTS`. |
| R-03 | Apps dentro de `apps/` con `AppConfig.name` mal configurado | Medio (import errors) | Fijar `name = "apps.<app>"` y `label` corto; prueba de arranque en CI. |
| R-04 | Verificar 403/404/500 con `DEBUG=True` no muestra plantillas propias | Bajo | Documentar verificación con `DEBUG=False` o vistas de prueba retiradas antes del cierre. |
| R-05 | Deriva de versiones sin regenerar `uv.lock` | Medio | `uv sync --locked` en gate; PR sin lock correspondiente se rechaza. |
| R-06 | `psycopg[binary]` vs compilado en producción | Bajo (sólo afecta despliegue) | Decidir en fase de producción; no bloquea C0. |
| R-07 | Zona horaria/localización incorrecta afecta fechas futuras (F1+) | Bajo | Fijar `TIME_ZONE` de México y `USE_TZ = True` desde C0. |

---

## Decisiones de requisitos

1. **Base de estilos:** por decisión explícita del usuario, se adopta Tailwind CSS `4.3` compilado en build con `@tailwindcss/cli`, nunca vía CDN. Los tokens se definen CSS-first con `@theme` en `static/css/input.css`; no se usa `tailwind.config.js` en C0. El build produce `static/css/tailwind.css`, servido por Django staticfiles y WhiteNoise. Node se limita a instalación y build, no a un proceso de producción en EC2.
2. **Alcance de C0:** C0 entrega cascarón + configuración + P-08; no incluye modelos, autenticación ni pantallas de dominio. Los archivos `selectors.py`/`services.py` de las apps pueden quedar vacíos hasta su fase.
3. **`unaccent`:** se habilita en C0 mediante una migración propia mínima en la app `core`, sin introducir modelos de dominio.
4. **Almacenamiento de archivos en desarrollo:** disco local vía `MEDIA_ROOT` (`media/`, ignorado por Git). El object storage productivo queda fuera de C0 (decisión de despliegue).
5. **Driver PostgreSQL:** `psycopg[binary]~=3.2` para desarrollo reproducible; la variante compilada se evaluará al configurar producción.
6. **Localización:** `USE_TZ = True`, `LANGUAGE_CODE = "es-mx"` y `TIME_ZONE = "America/Mexico_City"` como asunción alineada al contexto CANACO Villahermosa; ajustable sin bloquear si el orquestador indica otra zona.
7. **Datos semilla:** en C0 sólo se prepara la carpeta `fixtures/` y la mecánica; los datos de dominio (roles, admin inicial, categorías) se cargan en F1 según el roadmap.

## Preguntas abiertas

Ninguna.
