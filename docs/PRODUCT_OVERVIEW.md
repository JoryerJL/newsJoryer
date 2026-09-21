# PRODUCT_OVERVIEW

**Proyecto:** Sistema de Noticias (CMS) — CANACO SERVYTUR Villahermosa
**Tipo:** Entregable académico — Desarrollo Web Moderno con el Framework Django
**Versión del documento:** 1.0
**Estado:** Borrador para revisión

---

## 1. Contexto

La Cámara Nacional de Comercio, Servicios y Turismo (CANACO SERVYTUR) de Villahermosa
necesita publicar y difundir noticias sobre los eventos realizados y próximos a realizar
por la institución, así como comunicados dirigidos a su comunidad empresarial afiliada.

El sitio web anterior resolvía la difusión de forma estática: las noticias se incrustaban
manualmente en el HTML, sin panel de administración, sin control editorial y sin ninguna
vía de participación para el lector.

---

## 2. Problema

El problema se descompone en cinco frentes:

| # | Problema | Consecuencia |
|---|----------|--------------|
| P1 | La publicación de noticias depende de edición manual del sitio | Solo alguien con acceso técnico puede publicar; el área de comunicación no es autónoma |
| P2 | No existe separación entre borrador y contenido publicado | No hay revisión previa; lo que se escribe se expone de inmediato |
| P3 | No hay identidad de usuarios ni participación | La comunidad afiliada lee, pero no puede responder ni interactuar |
| P4 | No hay control editorial sobre la participación | Abrir comentarios sin moderación expone a la institución a contenido inapropiado |
| P5 | No hay visibilidad del alcance del contenido | La institución no sabe qué noticias interesan a sus afiliados |

---

## 3. Solución

Un CMS de noticias propio, construido sobre Django, que traslada el control editorial
del desarrollador al área de comunicación de CANACO.

La solución se apoya en cuatro capacidades:

1. **Gestión de contenido autónoma** — Panel administrativo con CRUD completo de
   publicaciones, categorías y usuarios, operable sin conocimiento técnico.
2. **Flujo editorial con estados** — Toda publicación vive en `borrador` o `publicado`.
   El contenido solo llega al público cuando alguien con permiso lo decide.
3. **Participación moderada** — Los lectores registrados comentan, pero cada comentario
   nace en estado `pendiente` y requiere aprobación explícita antes de ser visible.
4. **Medición de alcance** — Contador de visitas por publicación, visible tanto para el
   lector como para el panel editorial.

### Propuesta de valor

| Para | El valor es |
|------|-------------|
| Área de comunicación de CANACO | Publicar sin depender de un desarrollador |
| Dirección de CANACO | Control editorial sobre lo que se publica y sobre lo que los lectores escriben |
| Comunidad afiliada | Canal oficial de información con voz propia |
| Proyecto académico | Implementación completa del ciclo Django: auth, ORM, permisos, archivos, CRUD |

---

## 4. Usuarios y roles

El sistema define **cuatro roles**, implementados sobre `auth_group` de Django.

### 4.1 Visitante (no autenticado)

No es un rol del sistema; es el estado por defecto de cualquier persona que llega al sitio.

- Leer noticias publicadas
- Navegar por categorías
- Buscar noticias
- Registrar una cuenta

### 4.2 Lector (usuario registrado)

- Todo lo del Visitante
- Iniciar y cerrar sesión
- Crear comentarios en las noticias (quedan en estado `pendiente`)
- Ver y editar su perfil personal (foto, nombres, apellidos)
- Modificar su propia contraseña

### 4.3 Colaborador

- Todo lo del Lector
- Crear y actualizar publicaciones propias en estado `borrador`
- **No** puede publicar: su contenido requiere que un Editor o Administrador lo publique

### 4.4 Editor / Operador

- Todo lo del Colaborador
- Crear, actualizar y eliminar publicaciones
- Publicar noticias (transición `borrador` → `publicado`)
- Gestionar categorías

### 4.5 Administrador

- Todo lo del Editor
- Aprobar, bloquear y eliminar comentarios
- Administrar usuarios: CRUD, asignación de rol, bloquear y desbloquear
- Acceso total al panel administrativo

### 4.6 Matriz de permisos

| Capacidad | Visitante | Lector | Colaborador | Editor | Admin |
|-----------|:---------:|:------:|:-----------:|:------:|:-----:|
| Leer noticias publicadas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Buscar noticias | ✅ | ✅ | ✅ | ✅ | ✅ |
| Registrarse | ✅ | — | — | — | — |
| Iniciar / cerrar sesión | — | ✅ | ✅ | ✅ | ✅ |
| Comentar | — | ✅ | ✅ | ✅ | ✅ |
| Ver / editar perfil propio | — | ✅ | ✅ | ✅ | ✅ |
| Cambiar contraseña propia | — | ✅ | ✅ | ✅ | ✅ |
| Crear / editar borradores propios | — | — | ✅ | ✅ | ✅ |
| Publicar noticias | — | — | — | ✅ | ✅ |
| Eliminar noticias | — | — | — | ✅ | ✅ |
| Gestionar categorías | — | — | — | ✅ | ✅ |
| Aprobar / bloquear comentarios | — | — | — | — | ✅ |
| Administrar usuarios | — | — | — | — | ✅ |
| Bloquear / desbloquear usuarios | — | — | — | — | ✅ |

---

## 5. Entidades del dominio

| Entidad | Rol en el dominio |
|---------|-------------------|
| `auth_user` | Identidad y credenciales (nativo de Django) |
| `core_perfil` | Extensión 1:1 del usuario: apellidos y foto de perfil |
| `publicacion` | La noticia: título, resumen, contenido, estado, visitas, autor, categoría, portada |
| `categoria` | Clasificación temática de las publicaciones |
| `departamento` | Área de CANACO que origina la noticia *(entidad nueva — ver §8)* |
| `archivo` | Archivo subido: nombre, ruta, tipo, tamaño. Sirve a portadas, galería y fotos de perfil |
| `galeria_publicacion` | Relación N:M entre publicación y archivos de su galería |
| `comentario` | Participación del lector, con estado `pendiente` / `aprobado` / `bloqueado` |

### Máquinas de estado

**Publicación:** `borrador` → `publicado`
**Comentario:** `pendiente` → `aprobado` | `bloqueado`

---

## 6. Alcance del MVP

### 6.1 Pantallas públicas

| Pantalla | Contenido |
|----------|-----------|
| Home | Slider automatizado, al menos cuatro noticias recientes, botón "ver todas", contador de visitas acumuladas (suma de todas las publicaciones) |
| Listado de noticias | Todas las publicaciones en estado `publicado` |
| Noticias por categoría | Filtrado por categoría |
| Detalle de noticia | Portada, título, fecha, categoría, departamento, autor, contenido, galería, visitas, comentarios aprobados, sidebar de noticias relacionadas |
| Búsqueda | Resultados por término sobre título y contenido |
| Iniciar sesión | Usuario/email + contraseña |
| Registro | Usuario, correo, contraseña, confirmación |

Cada tarjeta de noticia muestra: imagen de portada, título, fecha, departamento, autor,
resumen y enlace al detalle.

### 6.2 Panel administrativo

| Sección | Capacidad |
|---------|-----------|
| Mi perfil | Ver y editar datos personales y foto |
| Noticias | Listado con título, autor, fechas, visitas y estado; crear, ver, editar, eliminar |
| Crear/editar publicación | Título, resumen, categoría, departamento, estado, portada, galería, contenido con editor enriquecido |
| Comentarios | Listado con autor, email, fecha, contenido y estado; aprobar, bloquear, eliminar |
| Categorías | Alta y baja |
| Usuarios | Listado con nombre, email, rol y fecha de registro; CRUD, bloquear, desbloquear |
| Cambiar contraseña | Contraseña actual, nueva, confirmación |

### 6.3 Incluido explícitamente

- Buscador de noticias
- Sidebar de noticias relacionadas o recientes en el detalle
- Bloqueo y desbloqueo de usuarios
- Contador de visitas por publicación

---

## 7. Fuera de alcance (esta fase)

Lo siguiente **no** se implementa en el MVP. Queda documentado para evitar que se filtre
por la puerta de atrás durante la implementación.

### Contenido y editorial
- Versionado o historial de cambios de publicaciones
- Programación de publicación diferida (publicar en una fecha futura)
- Etiquetas libres (tags) además de categorías
- Contenido multilenguaje
- Flujo de aprobación con múltiples niveles de revisión

### Participación
- Respuestas anidadas a comentarios
- Reacciones, likes o votos
- Moderación automática o filtros de contenido
- Notificación al usuario cuando su comentario es aprobado o bloqueado

### Cuentas
- Recuperación de contraseña por correo electrónico
- Verificación de correo al registrarse
- Inicio de sesión con proveedores externos (Google, Facebook)
- Autenticación de dos factores

### Difusión e integraciones
- Newsletter o envío de boletines
- Publicación automática en redes sociales
- Feed de Facebook embebido (presente en el sitio anterior)
- API pública o aplicación móvil
- Feed RSS

### Institucional
- Secciones no informativas del sitio anterior: Servicios, Quiénes Somos, Contacto,
  Afiliación, Catálogo, Bolsa de Trabajo, Convenios
- Directorio de empresas afiliadas
- Registro o gestión de eventos con inscripción

### Analítica y operación
- Panel de analítica más allá del contador de visitas
- Reportes exportables
- Auditoría de acciones más allá del `django_admin_log` nativo
- Caché, CDN o optimización de rendimiento

---

## 8. Decisiones abiertas y deuda documentada

| # | Tema | Estado |
|---|------|--------|
| D1 | **`departamento` es una entidad nueva.** No existe en la estructura de base de datos entregada (PDF 4), que solo contempla `categoria`. Se agrega porque la maqueta del home muestra "departamento que hizo la noticia" como dato distinto de la categoría. **Implica desviarse del esquema entregado**: tabla nueva + FK en `publicacion`. | Decidido — desviación asumida |
| D2 | **Colaborador y Editor no están en el enunciado.** El caso de estudio solo define Operador, Administrador y usuarios. Los roles adicionales provienen de un dato de ejemplo en la maqueta de Gestión de Usuarios. Duplican la superficie de permisos frente a un MVP mínimo. | Decidido — riesgo de sobre-ingeniería asumido |
| D3 | **Contador de visitas en el home.** El enunciado pide mostrar "las visitas que se han realizado" en la página principal. Se resuelve como la **suma de las visitas de todas las publicaciones** (`SUM(publicacion.visitas)`), no como un contador de visitas al sitio. No requiere tabla ni campo nuevo. | Decidido |
| D4 | **Registro de visitas.** El modelo `publicacion` tiene un entero `visitas` sin tabla de registro por evento. No hay forma de distinguir visitas únicas de recargas: cada carga del detalle incrementa el contador. **Se acepta esta limitación en el MVP** para mantener fidelidad al esquema entregado. El número debe leerse como "cargas de página", no como "lectores únicos". | Aceptado en MVP |
| D5 | **Autoría de la noticia.** `publicacion.autor` apunta a un usuario y `publicacion.departamento` al área de CANACO. **Ambos se muestran en la vista pública**: son datos distintos y complementarios — el departamento es la autoría institucional, el autor es la persona que redactó. Ninguno sustituye al otro. | Decidido |

---

## 9. Convención de idioma

El proyecto separa idioma de producto e idioma técnico para evitar mezclas arbitrarias.

| Capa | Idioma | Regla |
|------|--------|-------|
| **Base de datos** — tablas, columnas, índices y valores persistidos | Inglés | El esquema se diseña para acompañar directamente el código Django. El PDF entregado en español es referencia de dominio, no contrato literal de nombres. |
| **Código** — clases, atributos, métodos, variables, módulos y rutas | Inglés | Convención técnica única para todo el código. |
| **Interfaz de usuario** — etiquetas, botones, mensajes y textos | Español | El sitio está dirigido a la comunidad de CANACO Villahermosa. |
| **Documentación del proyecto** | Español | Material de trabajo del equipo y del proyecto académico. |
| **Comentarios de código y docstrings** | Inglés | Acompañan al código. |
| **Mensajes de commit** | Inglés, conventional commits | Estándar del equipo. |

### 9.1 Regla única: código y base de datos en inglés

Los nombres de modelos y campos Django se convierten en los nombres PostgreSQL por defecto.
No se traduce entre capas: `Post.title` persiste en `content_post.title`; `author` persiste
como `author_id`. Los valores de estado también se almacenan en inglés.

```python
class Post(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_PUBLISHED = "published"

    title = models.CharField(max_length=180)
    summary = models.TextField()
    content = models.TextField()
    status = models.CharField(max_length=20, default=STATUS_DRAFT)
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Reglas derivadas:**

- No se usan `Meta.db_table` ni `db_column` para traducir nombres al español. Una excepción
  técnica requiere ADR y prueba de migración.
- Estados persistidos: `draft`, `published`, `pending`, `approved` y `blocked`.
- Los nombres de templates y rutas también van en inglés (`posts/detail.html`, `/posts/<id>/`).
  El texto dentro de la template permanece en español.

### 9.2 Mapa de nomenclatura

| Tabla (BD) | Modelo (código) |
|------------|-----------------|
| `content_post` | `Post` |
| `taxonomy_category` | `Category` |
| `taxonomy_department` | `Department` |
| `media_file` | `File` |
| `media_postgalleryitem` | `PostGalleryItem` |
| `comments_comment` | `Comment` |
| `accounts_profile` | `Profile` |

---

## 10. Fuentes

- `2.- Problema a Resolver.pdf` — caso de estudio, acciones por tipo de usuario, requisitos de home y detalle
- `3.-. Maquetas Pantallas del proyecto.pdf` — catorce maquetas de pantallas públicas y de panel
- `4.- Estructura de la base de datos.pdf` — modelo de datos y modelos Django de referencia
