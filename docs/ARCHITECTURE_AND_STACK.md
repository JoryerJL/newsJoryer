# Arquitectura y stack

Contrato de implementación del CMS de noticias CANACO. Define runtime, estructura, límites de módulos, configuración y estilo de código. La fuente visual obligatoria es el [proyecto Stitch](https://stitch.withgoogle.com/projects/14921403100817785323); sus pantallas están trazadas en [ROADMAP.md](./ROADMAP.md).

## 1. Decisiones de arquitectura

| Decisión | Contrato |
|---|---|
| Estilo de aplicación | Monolito Django renderizado en servidor con Django Templates. Sin SPA, API separada ni microservicios. |
| Arquitectura | Monolito modular por funcionalidades, con separación estricta entre `services` y `selectors`. |
| Base de datos | PostgreSQL exclusivamente; SQLite no es sustituto aceptable en desarrollo. |
| Dependencias | `uv`; `pyproject.toml` declara y `uv.lock` fija las versiones reproducibles. |
| Configuración | Settings Django separados y variables de entorno con `python-decouple`; secretos fuera de Git. |
| Idioma | Código, identificadores, pruebas, comentarios, commits y esquema de BD en inglés. UI y contenido visible en español. |
| Frontend | HTML semántico, Django Templates, CSS y JavaScript progresivo mínimo. |
| Vistas HTTP | Priorizar class-based views (CBVs) cuando una vista genérica o mixin reutilizable exprese claramente el caso de uso. |
| Diseño | Stitch es la fuente de verdad visual; su HTML exportado es referencia, no código de producción. |

## 2. Stack tecnológico

| Capa | Tecnología | Versión / restricción |
|---|---|---|
| Runtime | CPython | `3.13.15` |
| Framework | Django LTS | `5.2.18` |
| Base de datos | PostgreSQL | `17.11` |
| Driver PostgreSQL | psycopg | `3.2.x`, fijado en `uv.lock` |
| Variables de entorno | python-decouple | `3.8` |
| Imágenes | Pillow | `11.x`, fijado en `uv.lock` |
| Estáticos | WhiteNoise | `6.x`, fijado en `uv.lock` |
| Gestor de Python/dependencias | uv | `>=0.12.17,<0.13` |
| Linter y formatter | Ruff | `0.14.x`, fijado en `uv.lock` |
| Pruebas | pytest + pytest-django | Versiones compatibles fijadas en `uv.lock` |

### Política de versiones

- CPython, Django y PostgreSQL son la línea base exacta; cambiarla requiere ADR.
- Las dependencias marcadas como fijadas se declaran con rango compatible y se resuelven con versión exacta y hash en el `uv.lock` de C0.
- CI y revisión ejecutan `uv sync --locked`; un cambio en `pyproject.toml` sin su `uv.lock` correspondiente se rechaza.
- Los parches de seguridad de Django/PostgreSQL son actualizaciones planificadas, nunca cambios locales improvisados. [Django](https://docs.djangoproject.com/en/5.2/releases/) · [PostgreSQL](https://www.postgresql.org/docs/release/) · [uv](https://docs.astral.sh/uv/concepts/python-versions/).

## 3. Estructura de carpetas

```text
newsjoryer/
├── manage.py
├── pyproject.toml                    # Dependencias, herramientas y versión de Python
├── uv.lock                           # Resolución reproducible, se versiona
├── .python-version                   # 3.13.15
├── .env.example                      # Nombres de variables, sin secretos
├── .gitignore
├── README.md
├── config/
│   ├── asgi.py
│   ├── wsgi.py
│   ├── urls.py                        # Ensambla rutas y handlers de error
│   └── settings/
│       ├── base.py                    # Configuración común
│       ├── development.py             # Desarrollo local
│       ├── test.py                    # Pruebas deterministas y rápidas
│       └── production.py              # Seguridad y operación productiva
├── apps/
│   ├── core/                          # Primitivas compartidas; sin dominio de negocio
│   ├── accounts/                      # Auth, perfil y autorización
│   ├── taxonomy/                      # Categorías y departamentos
│   ├── content/                       # Noticias, flujo editorial y métricas
│   ├── comments/                      # Comentarios y moderación
│   └── media/                         # Archivos, cargas y galería
│       └── <app>/
│           ├── migrations/
│           ├── templates/<app>/
│           ├── tests/
│           │   ├── factories.py
│           │   ├── test_selectors.py
│           │   ├── test_services.py
│           │   └── test_views.py
│           ├── admin.py
│           ├── apps.py
│           ├── forms.py
│           ├── models.py
│           ├── selectors.py
│           ├── services.py
│           ├── urls.py
│           └── views.py
├── templates/
│   ├── base.html                      # Layout público
│   ├── panel_base.html                # Layout administrativo
│   ├── components/                    # Componentes reutilizables
│   └── errors/                        # 403.html, 404.html y 500.html
├── static/
│   ├── css/                           # Tokens, base, componentes, público y panel
│   ├── js/                            # Mejora progresiva mínima
│   └── images/                        # Branding estático, incluido logo CANACO
├── media/                             # Archivos cargados; ignorado por Git
├── fixtures/                          # Datos estables de demostración/desarrollo
├── docs/
│   ├── adr/                           # Architecture Decision Records
│   ├── ARCHITECTURE_AND_STACK.md
│   ├── ROADMAP.md
│   └── ...
└── scripts/                           # Scripts operativos explícitos; sin lógica de negocio
```

### Reglas de propiedad

- Un modelo de dominio pertenece a una sola app. Otras apps consumen su selector o servicio público; no duplican reglas ni modelos.
- `core` no es un cajón de sastre: sólo primitives HTTP/UI y utilidades transversales.
- Se prohíben importaciones circulares entre apps. Una circular indica responsabilidad mal ubicada.
- Las templates viven en su app dueña, salvo layouts y componentes realmente compartidos.
- `.env`, `.venv/`, `media/`, estáticos recolectados y artefactos de pruebas no se versionan.

## 4. Límites del monolito modular

| App | Es dueña de | Puede depender de |
|---|---|---|
| `accounts` | Usuario Django, perfil, roles, sesión | `media` para foto de perfil |
| `taxonomy` | Categorías y departamentos | Ningún dominio |
| `media` | Metadatos de archivos, validación, almacenamiento y galería | Ningún dominio |
| `content` | Publicaciones, flujo editorial, dashboard, consultas públicas | `accounts`, `taxonomy`, `media` |
| `comments` | Comentarios y moderación | `accounts`, `content` |
| `core` | Mixins de acceso, helpers de formularios, utilidades UI | Ninguna app de dominio |

Dirección de dependencias: `taxonomy` y `media` son base; `content` los consume; `comments` depende de `content`. Las templates consumen read models, nunca contienen decisiones de dominio.

## 5. Service layer y selectors

### 5.1 Selectors: lecturas exclusivamente

```python
# apps/content/selectors.py

def get_published_post_by_slug(*, slug: str) -> Post: ...
def list_published_posts(*, category_id: int | None, page: int) -> QuerySet[Post]: ...
def list_related_posts(*, post: Post, limit: int = 4) -> QuerySet[Post]: ...
```

- Encapsulan consultas ORM: filtros, orden, anotaciones, paginación, `select_related` y `prefetch_related`.
- No mutan estado, no llaman `save()`, no reciben `request`, no renderizan ni envían mensajes.
- Vistas, servicios y pruebas usan selectors en lugar de repetir cadenas ORM complejas.
- Cada selector optimiza las relaciones que consumirá la template; las consultas N+1 son defectos.

### 5.2 Services: escrituras y transacciones de negocio

```python
# apps/content/services.py

@transaction.atomic
def publish_post(*, post: Post, actor: User) -> Post: ...
```

- Un servicio representa un caso de uso que cambia estado o coordina modelos.
- Toda operación con múltiples escrituras usa `transaction.atomic`.
- Recibe datos explícitos y validados (`actor`, entidades y primitives), nunca `HttpRequest`, `Form`, `QueryDict` o templates.
- Revalida al actor incluso si la vista ya lo validó: la vista es borde HTTP, no frontera final de seguridad.
- Devuelve entidades/resultados de dominio o eleva excepciones de dominio; nunca renderiza ni redirige.

### 5.3 Vistas, forms y templates

| Capa | Responsabilidad | No debe hacer |
|---|---|---|
| URL | Declarar y nombrar ruta | Implementar comportamiento |
| View | Auth, autorización, selector/servicio y respuesta HTTP | Reglas de negocio o consultas ORM largas |
| Form | Parsear y validar input HTTP | Persistir un caso de uso complejo |
| Template | Renderizar HTML semántico desde contexto preparado | Consultar ORM, decidir permisos o cambiar estado |
| Model | Mapeo de persistencia e invariantes locales | Orquestar flujos entre dominios o HTTP |

### 5.4 Política de class-based views

- Usar **CBVs** por defecto cuando la pantalla sea un listado, detalle, creación, edición o borrado estándar, o cuando aproveche mixins de autenticación/autorización.
- Preferir `ListView`, `DetailView`, `CreateView`, `UpdateView` y `DeleteView`; extenderlos sólo para llamar selectors y services. `form_valid()` delega al service, no contiene reglas de negocio.
- Usar function-based views únicamente si el flujo es pequeño y más expresivo como función, o si una CBV requeriría una jerarquía de mixins/overrides más compleja que una función directa.
- Elegir por claridad y reutilización, no por dogma. No se heredan múltiples clases sólo para evitar una función de pocas líneas.

## 6. Settings separados y entorno

```python
# config/settings/base.py
from decouple import config

SECRET_KEY = config("DJANGO_SECRET_KEY")
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("POSTGRES_DB"),
        "USER": config("POSTGRES_USER"),
        "PASSWORD": config("POSTGRES_PASSWORD"),
        "HOST": config("POSTGRES_HOST", default="127.0.0.1"),
        "PORT": config("POSTGRES_PORT", cast=int, default=5432),
    }
}
```

- `base.py`: apps, middleware, templates, auth, localización, BD y convenciones de static/media compartidas.
- `development.py`: entorno local y `DEBUG=True` explícito.
- `test.py`: sólo cambios necesarios para pruebas aisladas, rápidas y deterministas.
- `production.py`: `DEBUG=False`, hosts permitidos, cookies seguras, HTTPS/proxy y estrategia de archivos productiva.
- Selección explícita: local `DJANGO_SETTINGS_MODULE=config.settings.development`; producción usa `config.settings.production` fuera del código.
- No se ramifica configuración por `if DEBUG` dentro de un mismo archivo.

### Variables mínimas

```dotenv
DJANGO_SETTINGS_MODULE=config.settings.development
DJANGO_SECRET_KEY=replace-me
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
POSTGRES_DB=canaco_news
POSTGRES_USER=canaco_news
POSTGRES_PASSWORD=replace-me
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
```

`.env.example` contiene nombres y placeholders seguros; `.env` nunca se sube. Las variables de media, proxy y observabilidad se agregan a producción cuando se decida el despliegue.

## 7. Datos y convenciones de nombres

- Código, módulos, clases, funciones, variables, pruebas y comentarios: **inglés**.
- Mensajes, etiquetas, contenido y validaciones visibles: **español**.
- Tablas, columnas, índices y valores persistidos: **inglés**, igual que el código. El esquema de referencia en español se interpreta como material de dominio, no como contrato literal de nombres.
- Los nombres de Django se reflejan directamente en PostgreSQL; no se usan `db_table` ni `db_column` para traducir nombres entre capas salvo una necesidad técnica excepcional documentada.
- Los valores persistidos siguen las constantes de dominio en inglés: `draft`, `published`, `pending`, `approved`, `blocked`.
- Todo cambio de esquema usa migraciones. Editar PostgreSQL manualmente queda prohibido, salvo recuperación de emergencia documentada.
- SQL crudo sólo se permite si un selector no puede expresar la consulta, con razón documentada y prueba de integración.

## 8. Guía de estilo de código

### Python y Django

- PEP 8 mediante Ruff; longitud máxima **100** caracteres.
- Type hints de Python 3.13 en funciones públicas y retornos no obvios.
- Ruff ordena imports: biblioteca estándar, terceros, Django y módulos locales.
- Preferir guard clauses y funciones pequeñas con nombre a condicionales profundos.
- Prohibidos wildcard imports, defaults mutables, `except` desnudos, código muerto y código comentado.
- Datetimes timezone-aware únicamente: `USE_TZ = True`.
- Usar argumentos keyword-only en services/selectors cuando varios parámetros del mismo tipo puedan confundirse.
- Rutas nombradas y `{% url %}`; nunca URLs internas hardcodeadas en templates.
- Las mutaciones son POST, protegidas por CSRF y siguen Post/Redirect/Get.
- ORM parametrizado siempre; nunca interpolar input de usuario en SQL.

### Templates, CSS y JavaScript

- `{% extends %}`, includes/componentes y HTML semántico; un único `h1` por página.
- JavaScript sólo mejora una base HTML ya operable; no crea una segunda aplicación frontend.
- Variables CSS implementan los tokens aprobados por Stitch; estilos mobile-first y breakpoints de `UI_UX_SPEC.md`.
- Sin estilos inline aislados: usar clases explícitas y reutilizables.
- Mantener foco visible, contraste WCAG 2.1 AA, labels, `alt` y modales accesibles.

## 9. Pruebas y quality gates

| Nivel | Verifica |
|---|---|
| Model | Restricciones, estados y validación local |
| Selector | Resultado, filtros, orden y carga de relaciones |
| Service | Reglas de negocio, actor, transacciones y excepciones |
| View | Respuesta HTTP, acceso, errores de form, redirects y contexto |
| Integración | Publicación → portal, moderación y bloqueo de usuario |
| Visual/manual | Pantalla implementada contra su referencia Stitch y estados responsive |

Todo checkpoint del roadmap exige: pruebas del comportamiento modificado, prueba de permiso para mutaciones restringidas, verificación de migraciones si cambia la data y comparación visual con Stitch para sus pantallas asignadas.

## 10. No objetivos explícitos

No se agregan REST/GraphQL, Celery, Redis, Docker, Kubernetes, SPA, framework CSS, object storage, recuperación por email, analítica externa ni auth social antes de que un requisito de producto y una decisión de despliegue los justifiquen. Tecnología sin responsabilidad es complejidad, no arquitectura.

## 11. Decisiones obligatorias antes de producción

1. Plataforma de hosting y dominio.
2. Almacenamiento de media: disco persistente u object storage.
3. Terminación TLS y configuración de proxy confiable.
4. Política de backup, restore y retención de PostgreSQL y media.
5. Destino de logs y monitoreo de errores.

Estas decisiones no bloquean C0 local, pero sí bloquean configurar producción o desplegar.
