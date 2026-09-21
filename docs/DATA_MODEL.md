# DATA_MODEL

**Proyecto:** Sistema de Noticias (CMS) — CANACO SERVYTUR Villahermosa  
**Versión:** 2.0  
**Motor:** PostgreSQL `17.11` · **Encoding:** `UTF8`  
**ORM:** Django (`managed = True`)  
**Documentos relacionados:** [ARCHITECTURE_AND_STACK.md](./ARCHITECTURE_AND_STACK.md) · [PRODUCT_OVERVIEW.md](./PRODUCT_OVERVIEW.md) · [MODULES_SPEC.md](./MODULES_SPEC.md)

---

## 1. Convenciones del esquema

La base de datos usa **inglés de extremo a extremo**. El PDF de referencia con nombres en español describe el dominio original, pero no define los nombres físicos de este producto.

| Elemento | Convención | Ejemplo |
|---|---|---|
| Tablas propias | `<app>_<model>` en `snake_case` | `content_post`, `taxonomy_category` |
| Columnas | Inglés en `snake_case` | `published_at`, `cover_image_id` |
| Relaciones | Nombre del modelo + `_id` | `author_id`, `category_id` |
| Fechas | Sufijo `_at`, timezone-aware | `created_at`, `updated_at` |
| Estados persistidos | Inglés, minúsculas | `draft`, `published`, `pending` |
| Índices y constraints | Prefijo por tipo y tabla | `idx_post_public`, `uq_category_name` |

Django genera los nombres de tabla y columna normalmente. No se utiliza `db_table` ni `db_column` para traducir al español. Una excepción técnica requiere ADR, migración y prueba.

### 1.1 Búsqueda textual en PostgreSQL

PostgreSQL hace búsqueda sin distinguir mayúsculas mediante `ILIKE`. Para cumplir la búsqueda sin distinguir acentos, C0 habilita la extensión `unaccent` y los selectors normalizan ambos lados de la comparación. No se transfiere al código la antigua collation de MySQL.

```sql
CREATE EXTENSION IF NOT EXISTS unaccent;
```

El MVP comienza con búsqueda indexable por título/resumen/contenido; si el volumen lo requiere, se incorpora `SearchVector` de PostgreSQL mediante una migración y un selector, no desde una template.

---

## 2. Diagrama entidad-relación

```text
                              auth_user
                                  │
           ┌──────────────────────┼────────────────────────┐
           │ 1:1                  │ 1:N                    │ 1:N
           ▼                      ▼                        ▼
    accounts_profile          media_file              content_post
           │                      │                   ┌─────┼──────────┐
           │ profile_image         │                   │     │          │
           └──────────────────────┘                   │     │          │
                                                       │     │          │
                    taxonomy_category ────────────────┤     │          │
                    taxonomy_department ──────────────┘     │          │
                                                             │          │
                                      content_post_gallery ──┘          │
                                                 │                       │
                                                 └──────── media_file    │
                                                                         │
                                           comments_comment ◄───────────┘
```

### Cardinalidades

| Relación | Cardinalidad |
|---|---|
| `auth_user` → `accounts_profile` | 1:1 |
| `auth_user` → `content_post`, `comments_comment`, `media_file` | 1:N |
| `taxonomy_category` → `content_post` | 1:N |
| `taxonomy_department` → `content_post` | 1:N |
| `media_file` → `content_post` como portada o foto de perfil | 1:N |
| `content_post` ↔ `media_file` | N:M a través de `content_post_gallery` |
| `content_post` → `comments_comment` | 1:N |

---

## 3. Especificación de tablas

### 3.1 `content_post`

Entidad central y ciclo editorial de una noticia.

| Columna | Tipo PostgreSQL | Nulo | Default | Descripción |
|---|---|:---:|---|---|
| `id` | `bigint` PK identity | No | — | Identificador |
| `title` | `varchar(180)` | No | — | Título |
| `summary` | `text` | No | — | Resumen para tarjetas/listados |
| `content` | `text` | No | — | Cuerpo HTML controlado por editor |
| `status` | `varchar(20)` | No | `draft` | `draft` o `published` |
| `views` | `integer` | No | `0` | Cargas del detalle público |
| `created_at` | `timestamptz` | No | ahora | Creación |
| `updated_at` | `timestamptz` | No | ahora | Última modificación |
| `published_at` | `timestamptz` | Sí | `NULL` | Primera publicación |
| `author_id` | `integer` FK | Sí | `NULL` | → `auth_user.id`, `SET NULL` |
| `category_id` | `bigint` FK | Sí | `NULL` | → `taxonomy_category.id`, `SET NULL` |
| `department_id` | `bigint` FK | Sí | `NULL` | → `taxonomy_department.id`, `SET NULL` |
| `cover_image_id` | `bigint` FK | Sí | `NULL` | → `media_file.id`, `SET NULL` |

**Índices y restricciones**

```sql
CREATE INDEX idx_post_public ON content_post (status, published_at DESC);
CREATE INDEX idx_post_category ON content_post (category_id);
CREATE INDEX idx_post_department ON content_post (department_id);
CREATE INDEX idx_post_author ON content_post (author_id);
```

**Reglas de `published_at`**

- El service `publish_post` sella la fecha sólo al pasar por primera vez de `draft` a `published`.
- `unpublish_post` no borra `published_at`; conserva la fecha histórica original.
- Un post `published` requiere título, resumen, contenido, categoría y departamento.
- El portal ordena por `published_at DESC` y nunca lista `draft`.

### 3.2 `taxonomy_category`

| Columna | Tipo PostgreSQL | Nulo | Default | Descripción |
|---|---|:---:|---|---|
| `id` | `bigint` PK identity | No | — | Identificador |
| `name` | `varchar(60)` | No | — | Nombre único |
| `created_at` | `timestamptz` | No | ahora | Creación |
| `updated_at` | `timestamptz` | No | ahora | Última modificación |
| `created_by_id` | `integer` FK | Sí | `NULL` | → `auth_user.id`, `SET NULL` |

```sql
CREATE UNIQUE INDEX uq_category_name ON taxonomy_category (name);
```

### 3.3 `taxonomy_department`

Área institucional que origina una publicación. Tiene la misma estructura que categoría.

| Columna | Tipo PostgreSQL | Nulo | Default | Descripción |
|---|---|:---:|---|---|
| `id` | `bigint` PK identity | No | — | Identificador |
| `name` | `varchar(60)` | No | — | Nombre único |
| `created_at` | `timestamptz` | No | ahora | Creación |
| `updated_at` | `timestamptz` | No | ahora | Última modificación |
| `created_by_id` | `integer` FK | Sí | `NULL` | → `auth_user.id`, `SET NULL` |

```sql
CREATE UNIQUE INDEX uq_department_name ON taxonomy_department (name);
```

### 3.4 `media_file`

Repositorio único para portadas, galería y fotografías de perfil.

| Columna | Tipo PostgreSQL | Nulo | Default | Descripción |
|---|---|:---:|---|---|
| `id` | `bigint` PK identity | No | — | Identificador |
| `original_name` | `varchar(255)` | No | — | Nombre suministrado por usuario |
| `stored_name` | `varchar(255)` | No | — | Nombre único en storage |
| `path` | `varchar(500)` | No | — | Ruta relativa de almacenamiento |
| `content_type` | `varchar(100)` | No | — | MIME validado |
| `size` | `integer` | No | `0` | Bytes |
| `uploaded_at` | `timestamptz` | No | ahora | Momento de carga |
| `uploaded_by_id` | `integer` FK | Sí | `NULL` | → `auth_user.id`, `SET NULL` |

Sólo se aceptan JPEG, PNG y WebP de hasta 5 MB. Los archivos no se eliminan desde el MVP; se evita romper portadas, perfiles o galerías compartidas.

### 3.5 `content_post_gallery`

Relación N:M ordenable entre publicaciones y archivos.

| Columna | Tipo PostgreSQL | Nulo | Default | Descripción |
|---|---|:---:|---|---|
| `id` | `bigint` PK identity | No | — | Identificador |
| `post_id` | `bigint` FK | No | — | → `content_post.id`, `CASCADE` |
| `file_id` | `bigint` FK | No | — | → `media_file.id`, `CASCADE` |
| `position` | `smallint` | No | `0` | Orden visual de la galería |
| `created_at` | `timestamptz` | No | ahora | Alta en galería |

```sql
CREATE UNIQUE INDEX uq_post_gallery_file ON content_post_gallery (post_id, file_id);
CREATE UNIQUE INDEX uq_post_gallery_position ON content_post_gallery (post_id, position);
```

### 3.6 `comments_comment`

| Columna | Tipo PostgreSQL | Nulo | Default | Descripción |
|---|---|:---:|---|---|
| `id` | `bigint` PK identity | No | — | Identificador |
| `content` | `text` | No | — | Texto del comentario |
| `status` | `varchar(20)` | No | `pending` | `pending`, `approved`, `blocked` |
| `created_at` | `timestamptz` | No | ahora | Creación |
| `updated_at` | `timestamptz` | No | ahora | Última modificación |
| `post_id` | `bigint` FK | No | — | → `content_post.id`, `CASCADE` |
| `user_id` | `integer` FK | No | — | → `auth_user.id`, `CASCADE` |

```sql
CREATE INDEX idx_comment_public ON comments_comment (post_id, status);
```

Los usuarios se bloquean lógicamente, no se eliminan: borrar usuarios destruiría comentarios por el `CASCADE`.

### 3.7 `accounts_profile`

Extensión 1:1 del usuario Django.

| Columna | Tipo PostgreSQL | Nulo | Default | Descripción |
|---|---|:---:|---|---|
| `id` | `bigint` PK identity | No | — | Identificador |
| `user_id` | `integer` FK UNIQUE | No | — | → `auth_user.id`, `CASCADE` |
| `last_name_paternal` | `varchar(80)` | Sí | `NULL` | Apellido paterno |
| `last_name_maternal` | `varchar(80)` | Sí | `NULL` | Apellido materno |
| `profile_image_id` | `bigint` FK | Sí | `NULL` | → `media_file.id`, `SET NULL` |

### 3.8 Tablas nativas de Django

| Tabla | Uso |
|---|---|
| `auth_user` | Identidad, credenciales e `is_active` |
| `auth_group` | Roles: Reader, Contributor, Editor, Administrator |
| `auth_permission` | Permisos granulares |
| `auth_user_groups` | Asignación de un rol |
| `django_session` | Sesiones |
| `django_migrations` | Historial de migraciones |
| `django_admin_log` | Bitácora administrativa nativa |

---

## 4. Roles y permisos

Los grupos técnicos van en inglés: `Reader`, `Contributor`, `Editor`, `Administrator`. La UI los presenta en español: Lector, Colaborador, Editor y Administrador.

| Grupo | `is_staff` | Capacidades |
|---|:---:|---|
| `Reader` | No | Crear comentarios |
| `Contributor` | Sí | Crear y modificar sólo borradores propios |
| `Editor` | Sí | Gestionar publicaciones, categorías y departamentos; publicar |
| `Administrator` | Sí | Todo lo anterior, moderar comentarios y administrar usuarios |

Un usuario pertenece a exactamente un grupo. La restricción de autoría de Contributor se valida en `services` y en la CBV, porque los permisos de Django no son por fila.

---

## 5. Máquinas de estado

### Publicación

```text
[create] → draft ── publish ──► published
             ▲                   │
             └── unpublish ──────┘
```

| Transición | Service responsable | Efecto |
|---|---|---|
| Crear → `draft` | `create_post` | Crea borrador |
| `draft` → `published` | `publish_post` | Sella `published_at` si es la primera vez |
| `published` → `draft` | `unpublish_post` | Conserva fecha y visitas |

### Comentario

```text
[create] → pending ── approve ──► approved
               └── block ───────► blocked
approved ───────── block ───────► blocked
```

Todos pueden eliminarse físicamente por un administrador; bloquear conserva el registro.

```python
POST_STATUS_DRAFT = "draft"
POST_STATUS_PUBLISHED = "published"
COMMENT_STATUS_PENDING = "pending"
COMMENT_STATUS_APPROVED = "approved"
COMMENT_STATUS_BLOCKED = "blocked"
```

Los labels de `choices` se muestran en español, por ejemplo `(POST_STATUS_DRAFT, "Borrador")`.

---

## 6. Modelos Django de referencia

```python
class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Borrador"
        PUBLISHED = "published", "Publicado"

    title = models.CharField(max_length=180)
    summary = models.TextField()
    content = models.TextField()
    status = models.CharField(max_length=20, choices=Status, default=Status.DRAFT)
    views = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)
    department = models.ForeignKey(Department, null=True, blank=True, on_delete=models.SET_NULL)
    author = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    cover_image = models.ForeignKey(File, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-published_at"]
        indexes = [models.Index(fields=["status", "-published_at"], name="idx_post_public")]
        permissions = [("publish_post", "Can publish and unpublish posts")]
```

La transición de estado no vive en el modelo: se implementa en `apps/content/services.py` con transacción y validación de actor, tal como establece la arquitectura.

---

## 7. Reglas de integridad

| ID | Regla | Capa responsable |
|---|---|---|
| RI-01 | Un post publicado tiene título, resumen, contenido, categoría y departamento | Form + `publish_post` |
| RI-02 | Un post publicado tiene `published_at` | `publish_post` |
| RI-03 | No se elimina categoría/departamento con posts asociados | `delete_category` / `delete_department` |
| RI-04 | Los usuarios se desactivan, no se eliminan | `block_user` |
| RI-05 | Debe existir un Administrator activo | Services de usuarios |
| RI-06 | Un usuario tiene un único grupo | Service de asignación de rol |
| RI-07 | Contributor sólo modifica borradores propios | CBV + service |
| RI-08 | Sólo se suben JPEG, PNG y WebP hasta 5 MB | Service de archivos |

---

## 8. Delta respecto al material de referencia

| Cambio | Decisión |
|---|---|
| MySQL → PostgreSQL | Contrato de arquitectura aprobado. |
| Tablas, columnas, constraints y estados en español → inglés | Convención técnica única aprobada. |
| `department` | Entidad necesaria para diferenciar procedencia institucional y categoría. |
| `published_at` | Mantiene la primera fecha pública y ordena el portal. |
| `content_post_gallery.position` | Permite que la galería respete un orden editorial explícito. |
| `unaccent` | Permite búsqueda sin distinguir acentos en PostgreSQL. |

## 9. Fuentes

- [ARCHITECTURE_AND_STACK.md](./ARCHITECTURE_AND_STACK.md) — stack, arquitectura y convenciones.
- [PRODUCT_OVERVIEW.md](./PRODUCT_OVERVIEW.md) — alcance, roles y reglas del producto.
- [MODULES_SPEC.md](./MODULES_SPEC.md) — casos de uso y reglas de negocio.
- `4.- Estructura de la base de datos.pdf` — referencia de dominio original.
