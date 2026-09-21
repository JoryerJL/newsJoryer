# MODULES_SPEC

**Proyecto:** Sistema de Noticias (CMS) — CANACO SERVYTUR Villahermosa
**Versión del documento:** 1.0
**Documento previo:** [PRODUCT_OVERVIEW.md](./PRODUCT_OVERVIEW.md)

Este documento define el mapa de módulos del sistema y el comportamiento esperado de cada
uno mediante casos de uso en formato Gherkin.

**Convención de escenarios:** los escenarios usan palabras clave Gherkin en español
(`Dado`, `Cuando`, `Entonces`, `Y`, `Pero`, `Esquema del escenario`). Los identificadores
de código que aparecen en ellos siguen la convención de [PRODUCT_OVERVIEW §9](./PRODUCT_OVERVIEW.md#9-convención-de-idioma):
código en inglés, columnas y valores almacenados en español.

---

## 1. Mapa de módulos

| ID | Módulo | Responsabilidad | Roles que lo operan |
|----|--------|-----------------|---------------------|
| **M1** | Autenticación y Cuentas | Identidad, sesión, registro, perfil y contraseña | Visitante, todos los autenticados |
| **M2** | Portal Público | Consumo de noticias: home, listado, categoría, detalle, búsqueda | Visitante, Lector |
| **M3** | Gestión de Publicaciones | Ciclo de vida de la noticia: crear, editar, publicar, eliminar | Colaborador, Editor, Admin |
| **M4** | Taxonomía | Categorías y departamentos | Editor, Admin |
| **M5** | Moderación de Comentarios | Alta de comentarios y su aprobación, bloqueo o eliminación | Lector (alta), Admin (moderación) |
| **M6** | Administración de Usuarios | CRUD de usuarios, asignación de rol, bloqueo y desbloqueo | Admin |
| **M7** | Gestión de Archivos | Subida y almacenamiento de imágenes. Módulo transversal | M1, M3 |
| **M8** | Métricas de Visitas | Conteo y exposición de visitas. Módulo transversal | M2, M3 |

### 1.1 Dependencias entre módulos

```
        M1 Auth ──────────┬──────────────┬──────────────┐
                          │              │              │
                          ▼              ▼              ▼
                    M3 Publicaciones  M5 Comentarios  M6 Usuarios
                          │              │
              ┌───────────┤              │
              ▼           ▼              │
        M4 Taxonomía   M7 Archivos       │
              │           │              │
              └───────────┴──────────────┴──────► M2 Portal Público
                                                        │
                                                        ▼
                                                  M8 Visitas
```

- **M1** es prerrequisito de todo lo que exija sesión.
- **M7** es consumido por M1 (foto de perfil) y M3 (portada y galería).
- **M2** solo lee; no escribe salvo el incremento de visitas de M8.

---

## 2. M1 — Autenticación y Cuentas

**Propósito:** gestionar la identidad de las personas que usan el sistema.

**Entidades:** `auth_user`, `auth_group`, `core_perfil`, `archivo`

**Pantallas:** Registro, Iniciar sesión, Mi perfil, Editar perfil, Cambiar contraseña

### 2.1 Reglas de negocio

| ID | Regla |
|----|-------|
| RN-M1-01 | El nombre de usuario y el correo electrónico son únicos en el sistema. |
| RN-M1-02 | Toda cuenta creada desde el registro público queda **activa de inmediato** y se asigna al grupo `Lector`. No requiere aprobación. |
| RN-M1-03 | Las contraseñas se almacenan con el hasher de Django. Nunca en texto plano. |
| RN-M1-04 | Un usuario bloqueado (`is_active = False`) no puede iniciar sesión. Sus comentarios ya aprobados permanecen visibles. |
| RN-M1-05 | Cada usuario tiene exactamente un `core_perfil`, creado automáticamente al crearse el usuario. |
| RN-M1-06 | Cambiar la contraseña propia exige confirmar la contraseña actual. |
| RN-M1-07 | No existe recuperación de contraseña por correo en el MVP. La reposición la ejecuta un Administrador desde M6. |

### 2.2 Casos de uso

#### HU-M1-01 — Registrar una cuenta

> Como visitante, quiero crear una cuenta para poder comentar las noticias.

```gherkin
Escenario: Registro exitoso
  Dado que soy un visitante no autenticado
  Y estoy en la pantalla de registro
  Cuando ingreso un nombre de usuario no utilizado
  Y un correo electrónico no registrado
  Y una contraseña válida repetida correctamente en la confirmación
  Y envío el formulario
  Entonces el sistema crea la cuenta en estado activo
  Y la asigna al grupo "Lector"
  Y crea su perfil vacío asociado
  Y me redirige a la pantalla de inicio de sesión con un mensaje de éxito

Escenario: Nombre de usuario ya existente
  Dado que existe un usuario registrado con el nombre "jperez"
  Cuando intento registrarme con el nombre de usuario "jperez"
  Entonces el sistema rechaza el registro
  Y muestra el mensaje "Ese nombre de usuario ya está en uso"
  Y conserva los demás datos que ingresé en el formulario

Escenario: Correo electrónico ya registrado
  Dado que existe un usuario con el correo "juan@example.com"
  Cuando intento registrarme con el correo "juan@example.com"
  Entonces el sistema rechaza el registro
  Y muestra el mensaje "Ese correo electrónico ya está registrado"

Escenario: Las contraseñas no coinciden
  Cuando ingreso una contraseña y una confirmación distintas
  Y envío el formulario
  Entonces el sistema rechaza el registro
  Y muestra el mensaje "Las contraseñas no coinciden"
  Y no crea ninguna cuenta
```

#### HU-M1-02 — Iniciar sesión

> Como usuario registrado, quiero iniciar sesión para acceder a las funciones de mi rol.

```gherkin
Escenario: Inicio de sesión exitoso con nombre de usuario
  Dado que tengo una cuenta activa
  Cuando ingreso mi nombre de usuario y mi contraseña correctos
  Entonces el sistema inicia mi sesión
  Y el encabezado muestra mi nombre de usuario y la opción de cerrar sesión

Escenario: Inicio de sesión exitoso con correo electrónico
  Dado que tengo una cuenta activa
  Cuando ingreso mi correo electrónico y mi contraseña correctos
  Entonces el sistema inicia mi sesión

Escenario: Credenciales incorrectas
  Cuando ingreso una contraseña incorrecta
  Entonces el sistema rechaza el acceso
  Y muestra el mensaje "Usuario o contraseña incorrectos"
  Y no revela si el usuario existe

Escenario: Cuenta bloqueada
  Dado que mi cuenta fue bloqueada por un administrador
  Cuando ingreso mis credenciales correctas
  Entonces el sistema rechaza el acceso
  Y muestra el mensaje "Tu cuenta está desactivada. Contacta al administrador"

Escenario: Destino según rol
  Dado que tengo una cuenta activa
  Cuando inicio sesión correctamente
  Entonces el sistema me redirige al panel administrativo si mi rol es Colaborador, Editor o Administrador
  Y me redirige a la página de inicio si mi rol es Lector
```

#### HU-M1-03 — Cerrar sesión

```gherkin
Escenario: Cierre de sesión
  Dado que tengo una sesión iniciada
  Cuando selecciono "Cerrar sesión"
  Entonces el sistema destruye mi sesión
  Y me redirige a la página de inicio
  Y el encabezado vuelve a mostrar las opciones de iniciar sesión y registrarse
```

#### HU-M1-04 — Ver y editar el perfil propio

> Como usuario autenticado, quiero ver y actualizar mis datos personales.

```gherkin
Escenario: Ver el perfil
  Dado que tengo una sesión iniciada
  Cuando accedo a "Mi perfil"
  Entonces veo mi foto de perfil, nombre, apellido paterno, apellido materno y correo
  Y veo un botón para editar el perfil
  Pero no veo mi contraseña en ninguna forma

Escenario: Actualizar datos del perfil
  Dado que estoy en la pantalla de edición de perfil
  Cuando modifico mi nombre y mis apellidos
  Y guardo los cambios
  Entonces el sistema actualiza mi perfil
  Y muestra un mensaje de confirmación

Escenario: Cambiar la foto de perfil
  Dado que estoy en la pantalla de edición de perfil
  Cuando selecciono una imagen válida y guardo
  Entonces el sistema almacena el archivo mediante el módulo M7
  Y asocia el archivo a mi perfil
  Y la nueva foto aparece en mi perfil y en el encabezado

Escenario: Usuario sin foto de perfil
  Dado que nunca subí una foto de perfil
  Cuando accedo a "Mi perfil"
  Entonces el sistema muestra una imagen genérica por defecto
```

#### HU-M1-05 — Cambiar la contraseña propia

```gherkin
Escenario: Cambio de contraseña exitoso
  Dado que tengo una sesión iniciada
  Y estoy en la pantalla de cambio de contraseña
  Cuando ingreso mi contraseña actual correcta
  Y una nueva contraseña válida repetida en la confirmación
  Entonces el sistema actualiza mi contraseña
  Y mantiene mi sesión activa
  Y muestra un mensaje de confirmación

Escenario: Contraseña actual incorrecta
  Cuando ingreso una contraseña actual que no corresponde
  Entonces el sistema rechaza el cambio
  Y muestra el mensaje "La contraseña actual es incorrecta"
  Y mi contraseña permanece sin cambios

Escenario: La nueva contraseña no coincide con su confirmación
  Cuando la nueva contraseña y su confirmación difieren
  Entonces el sistema rechaza el cambio
  Y muestra el mensaje "Las contraseñas no coinciden"
```

---

## 3. M2 — Portal Público

**Propósito:** exponer el contenido publicado a cualquier persona, autenticada o no.

**Entidades (solo lectura):** `publicacion`, `categoria`, `departamento`, `archivo`,
`galeria_publicacion`, `comentario`

**Pantallas:** Home, Listado de noticias, Noticias por categoría, Detalle de noticia,
Resultados de búsqueda

### 3.1 Reglas de negocio

| ID | Regla |
|----|-------|
| RN-M2-01 | El portal público **solo muestra publicaciones en estado `publicado`**. Los borradores son invisibles fuera del panel. |
| RN-M2-02 | El slider del home se alimenta de **las cinco publicaciones publicadas más recientes**, ordenadas por fecha de publicación descendente. Es automático: no hay selección manual ni campo de destacado. |
| RN-M2-03 | El home muestra **al menos cuatro** publicaciones recientes además del slider. |
| RN-M2-04 | Cada tarjeta de noticia muestra: imagen de portada, título, fecha, departamento, autor, resumen y enlace al detalle. |
| RN-M2-05 | El detalle solo muestra los comentarios en estado `aprobado`, del más reciente al más antiguo. |
| RN-M2-06 | El contador de visitas del home es la suma de `publicacion.visitas` de todas las publicaciones. |
| RN-M2-07 | La búsqueda opera sobre título, resumen y contenido de publicaciones publicadas, sin distinguir mayúsculas ni acentos. |
| RN-M2-08 | El sidebar del detalle muestra hasta cinco publicaciones de la misma categoría, excluida la actual. Si no hay suficientes, completa con las más recientes. |
| RN-M2-09 | Una publicación sin imagen de portada muestra una imagen genérica por defecto. |

### 3.2 Casos de uso

#### HU-M2-01 — Ver la página de inicio

```gherkin
Escenario: Home con contenido suficiente
  Dado que existen al menos cinco publicaciones en estado "publicado"
  Cuando accedo a la página de inicio
  Entonces veo un slider con las cinco publicaciones publicadas más recientes
  Y veo al menos cuatro tarjetas de noticias recientes
  Y cada tarjeta muestra imagen de portada, título, fecha, departamento, autor y resumen
  Y veo un botón para acceder al listado completo de noticias
  Y veo el total de visitas acumuladas del sitio

Escenario: Los borradores no aparecen
  Dado que existe una publicación en estado "borrador"
  Cuando accedo a la página de inicio
  Entonces esa publicación no aparece ni en el slider ni en las tarjetas

Escenario: Sitio sin publicaciones
  Dado que no existe ninguna publicación en estado "publicado"
  Cuando accedo a la página de inicio
  Entonces el slider no se muestra
  Y veo el mensaje "Aún no hay noticias publicadas"

Escenario: Menos de cinco publicaciones disponibles
  Dado que existen tres publicaciones en estado "publicado"
  Cuando accedo a la página de inicio
  Entonces el slider muestra esas tres publicaciones
  Y no se muestran espacios vacíos
```

#### HU-M2-02 — Ver el detalle de una noticia

```gherkin
Escenario: Detalle completo
  Dado que existe una publicación en estado "publicado"
  Cuando accedo a su detalle
  Entonces veo su imagen de portada, título, fecha, categoría, departamento y autor
  Y veo su resumen y su contenido completo
  Y veo su galería de imágenes si tiene archivos asociados
  Y veo su contador de visitas
  Y veo sus comentarios aprobados
  Y veo un sidebar con noticias relacionadas de la misma categoría

Escenario: Intentar ver un borrador
  Dado que existe una publicación en estado "borrador"
  Cuando intento acceder a su detalle sin ser parte del equipo editorial
  Entonces el sistema responde con un error 404

Escenario: Publicación inexistente
  Cuando accedo a la URL de una publicación que no existe
  Entonces el sistema responde con un error 404
  Y muestra una página de error con enlace al inicio

Escenario: Publicación sin galería
  Dado que una publicación no tiene archivos en su galería
  Cuando accedo a su detalle
  Entonces la sección de galería no se muestra

Escenario: Publicación sin comentarios aprobados
  Dado que una publicación no tiene comentarios en estado "aprobado"
  Cuando accedo a su detalle
  Entonces veo el mensaje "Sé el primero en comentar"
  Y veo el acceso para agregar un comentario
```

#### HU-M2-03 — Listar noticias y filtrar por categoría

```gherkin
Escenario: Listado completo
  Cuando accedo al listado de noticias
  Entonces veo todas las publicaciones en estado "publicado"
  Y están ordenadas de la más reciente a la más antigua
  Y el listado está paginado

Escenario: Filtrar por categoría
  Dado que existen publicaciones en la categoría "Eventos"
  Cuando accedo al listado de la categoría "Eventos"
  Entonces veo únicamente las publicaciones publicadas de esa categoría
  Y el encabezado indica "Categoría: Eventos"

Escenario: Categoría sin publicaciones
  Dado que la categoría "Ciencia" no tiene publicaciones publicadas
  Cuando accedo al listado de esa categoría
  Entonces veo el mensaje "No hay noticias en esta categoría"
```

#### HU-M2-04 — Buscar noticias

```gherkin
Escenario: Búsqueda con resultados
  Dado que existe una publicación publicada cuyo título contiene "Simposium"
  Cuando busco el término "simposium"
  Entonces veo esa publicación en los resultados
  Y los resultados indican cuántas coincidencias se encontraron

Escenario: Búsqueda sin distinción de acentos
  Dado que existe una publicación cuyo título contiene "Capacitación"
  Cuando busco el término "capacitacion"
  Entonces veo esa publicación en los resultados

Escenario: Búsqueda sin resultados
  Cuando busco un término que no aparece en ninguna publicación
  Entonces veo el mensaje "No se encontraron noticias para tu búsqueda"
  Y veo un enlace para volver al listado completo

Escenario: La búsqueda no expone borradores
  Dado que existe una publicación en estado "borrador" cuyo título contiene "Simposium"
  Cuando busco el término "simposium"
  Entonces esa publicación no aparece en los resultados

Escenario: Búsqueda vacía
  Cuando envío el formulario de búsqueda sin ingresar ningún término
  Entonces el sistema me devuelve al listado completo de noticias
```

---

## 4. M3 — Gestión de Publicaciones

**Propósito:** administrar el ciclo de vida completo de una noticia.

**Entidades:** `publicacion`, `categoria`, `departamento`, `archivo`, `galeria_publicacion`

**Pantallas:** Panel de noticias, Crear publicación, Editar publicación

### 4.1 Máquina de estados

```
   [crear]
      │
      ▼
  ┌──────────┐   publicar    ┌────────────┐
  │ borrador │ ────────────► │ publicado  │
  └──────────┘ ◄──────────── └────────────┘
                despublicar
```

### 4.2 Reglas de negocio

| ID | Regla |
|----|-------|
| RN-M3-01 | Toda publicación nace en estado `borrador`. |
| RN-M3-02 | Solo Editor y Administrador pueden pasar una publicación a `publicado` o devolverla a `borrador`. |
| RN-M3-03 | El Colaborador solo puede crear y editar publicaciones **de su propia autoría** y **en estado `borrador`**. Una vez publicada, pierde la capacidad de editarla. |
| RN-M3-04 | Editor y Administrador pueden editar y eliminar cualquier publicación, sea propia o ajena. |
| RN-M3-05 | El autor se asigna automáticamente al usuario que crea la publicación y no se modifica al editarla. |
| RN-M3-06 | Título, resumen, contenido, categoría y departamento son obligatorios para publicar. Un borrador puede guardarse solo con el título. |
| RN-M3-07 | La eliminación de una publicación es **física** y exige confirmación explícita. |
| RN-M3-08 | Al eliminar una publicación se eliminan en cascada sus comentarios y las entradas de su galería. Los archivos permanecen en `archivo`. |
| RN-M3-09 | El contenido se captura con un editor enriquecido y se almacena como HTML. |
| RN-M3-10 | La imagen de portada es opcional. La galería admite cero o más imágenes. |

### 4.3 Casos de uso

#### HU-M3-01 — Ver el panel de noticias

```gherkin
Escenario: Listado para Editor o Administrador
  Dado que tengo el rol "Editor"
  Cuando accedo a la sección de noticias del panel
  Entonces veo todas las publicaciones del sistema
  Y cada fila muestra título, autor, fecha de creación, fecha de actualización, visitas y estado
  Y veo las acciones ver, editar y eliminar en cada fila
  Y veo el botón "Crear publicación"

Escenario: Listado para Colaborador
  Dado que tengo el rol "Colaborador"
  Cuando accedo a la sección de noticias del panel
  Entonces veo únicamente las publicaciones de mi autoría
  Y no veo la acción de eliminar
```

#### HU-M3-02 — Crear una publicación

```gherkin
Escenario: Guardar un borrador
  Dado que tengo el rol "Colaborador"
  Y estoy en el formulario de creación de publicación
  Cuando ingreso un título
  Y guardo la publicación
  Entonces el sistema la crea en estado "borrador"
  Y me asigna como autor
  Y registra la fecha de creación
  Y la publicación no es visible en el portal público

Escenario: Crear y publicar en un solo paso
  Dado que tengo el rol "Editor"
  Cuando completo título, resumen, contenido, categoría y departamento
  Y selecciono el estado "publicado"
  Y guardo la publicación
  Entonces el sistema la crea en estado "publicado"
  Y la publicación aparece de inmediato en el portal público

Escenario: Intentar publicar sin los campos obligatorios
  Dado que tengo el rol "Editor"
  Cuando selecciono el estado "publicado"
  Pero dejo el contenido vacío
  Y guardo la publicación
  Entonces el sistema rechaza el guardado
  Y indica qué campos obligatorios faltan
  Y conserva los datos que ya había ingresado

Escenario: El Colaborador no puede publicar
  Dado que tengo el rol "Colaborador"
  Cuando accedo al formulario de creación de publicación
  Entonces el campo de estado no está disponible
  Y la publicación solo puede guardarse como borrador

Escenario: Adjuntar imagen de portada y galería
  Dado que estoy creando una publicación
  Cuando selecciono una imagen de portada
  Y selecciono tres imágenes para la galería
  Y guardo la publicación
  Entonces el sistema almacena los cuatro archivos mediante el módulo M7
  Y asocia la portada a la publicación
  Y crea tres entradas de galería asociadas a la publicación
```

#### HU-M3-03 — Editar una publicación

```gherkin
Escenario: Editor modifica cualquier publicación
  Dado que tengo el rol "Editor"
  Y existe una publicación creada por otro usuario
  Cuando la edito y guardo los cambios
  Entonces el sistema actualiza la publicación
  Y actualiza su fecha de actualización
  Pero conserva el autor original

Escenario: Colaborador edita su propio borrador
  Dado que tengo el rol "Colaborador"
  Y soy el autor de una publicación en estado "borrador"
  Cuando la edito y guardo los cambios
  Entonces el sistema actualiza la publicación

Escenario: Colaborador intenta editar una publicación ajena
  Dado que tengo el rol "Colaborador"
  Y existe una publicación de otro autor
  Cuando intento acceder a su formulario de edición
  Entonces el sistema deniega el acceso con un error 403

Escenario: Colaborador intenta editar su publicación ya publicada
  Dado que tengo el rol "Colaborador"
  Y soy el autor de una publicación en estado "publicado"
  Cuando intento acceder a su formulario de edición
  Entonces el sistema deniega el acceso con un error 403
  Y muestra el mensaje "Esta publicación ya fue publicada y no puede editarse"

Escenario: Eliminar una imagen de la galería
  Dado que edito una publicación con tres imágenes en su galería
  Cuando elimino una de ellas y guardo
  Entonces el sistema elimina esa entrada de la galería
  Y la publicación conserva las otras dos imágenes
```

#### HU-M3-04 — Publicar y despublicar

```gherkin
Escenario: Publicar un borrador
  Dado que tengo el rol "Editor"
  Y existe una publicación en estado "borrador" con todos sus campos obligatorios
  Cuando cambio su estado a "publicado" y guardo
  Entonces la publicación aparece en el portal público
  Y su estado en el panel se muestra como "Publicado"

Escenario: Despublicar una noticia
  Dado que tengo el rol "Editor"
  Y existe una publicación en estado "publicado"
  Cuando cambio su estado a "borrador" y guardo
  Entonces la publicación deja de ser visible en el portal público
  Y conserva sus visitas acumuladas
  Y conserva sus comentarios
```

#### HU-M3-05 — Eliminar una publicación

```gherkin
Escenario: Eliminación con confirmación
  Dado que tengo el rol "Editor"
  Cuando selecciono eliminar una publicación
  Entonces el sistema me pide confirmar la acción
  Y me advierte que se eliminarán también sus comentarios
  Cuando confirmo la eliminación
  Entonces el sistema elimina la publicación de forma definitiva
  Y elimina sus comentarios y las entradas de su galería
  Pero conserva los archivos en el repositorio de archivos

Escenario: Cancelar la eliminación
  Cuando selecciono eliminar una publicación
  Y cancelo en el diálogo de confirmación
  Entonces la publicación permanece sin cambios

Escenario: El Colaborador no puede eliminar
  Dado que tengo el rol "Colaborador"
  Cuando accedo al panel de noticias
  Entonces no veo la acción de eliminar en ninguna fila
```

---

## 5. M4 — Taxonomía

**Propósito:** mantener las clasificaciones que ordenan el contenido: categorías temáticas
y departamentos de CANACO.

**Entidades:** `categoria`, `departamento`

**Pantallas:** Administrar categorías, Administrar departamentos

### 5.1 Reglas de negocio

| ID | Regla |
|----|-------|
| RN-M4-01 | El nombre de una categoría es único. El nombre de un departamento es único. |
| RN-M4-02 | Una categoría **no puede eliminarse si tiene publicaciones asociadas**. El sistema bloquea el borrado e informa cuántas publicaciones la usan. Lo mismo aplica a departamentos. |
| RN-M4-03 | El sistema registra qué usuario creó cada categoría y cada departamento. |
| RN-M4-04 | Categorías y departamentos son obligatorios para publicar una noticia (RN-M3-06). El sistema debe tener al menos uno de cada uno antes de permitir publicar. |

### 5.2 Casos de uso

#### HU-M4-01 — Administrar categorías

```gherkin
Escenario: Crear una categoría
  Dado que tengo el rol "Editor"
  Y estoy en la pantalla de administración de categorías
  Cuando ingreso el nombre "Capacitación"
  Y selecciono agregar
  Entonces el sistema crea la categoría
  Y la registra a mi nombre como creador
  Y aparece en el listado

Escenario: Nombre de categoría duplicado
  Dado que existe la categoría "Eventos"
  Cuando intento crear una categoría con el nombre "Eventos"
  Entonces el sistema rechaza la creación
  Y muestra el mensaje "Ya existe una categoría con ese nombre"

Escenario: Eliminar una categoría sin publicaciones
  Dado que la categoría "Pruebas" no tiene publicaciones asociadas
  Cuando selecciono eliminarla y confirmo
  Entonces el sistema la elimina
  Y desaparece del listado

Escenario: Intentar eliminar una categoría en uso
  Dado que la categoría "Eventos" tiene 12 publicaciones asociadas
  Cuando selecciono eliminarla
  Entonces el sistema bloquea la eliminación
  Y muestra el mensaje "No se puede eliminar: 12 publicaciones usan esta categoría"
  Y la categoría permanece sin cambios
```

#### HU-M4-02 — Administrar departamentos

```gherkin
Escenario: Crear un departamento
  Dado que tengo el rol "Editor"
  Cuando ingreso el nombre "Consume Local" y selecciono agregar
  Entonces el sistema crea el departamento
  Y aparece disponible en el formulario de publicaciones

Escenario: Intentar eliminar un departamento en uso
  Dado que el departamento "Afiliación" tiene publicaciones asociadas
  Cuando selecciono eliminarlo
  Entonces el sistema bloquea la eliminación
  Y muestra cuántas publicaciones lo usan
```

---

## 6. M5 — Moderación de Comentarios

**Propósito:** permitir la participación de los lectores bajo control editorial.

**Entidades:** `comentario`, `publicacion`, `auth_user`

**Pantallas:** Detalle de noticia (alta), Panel de comentarios (moderación)

### 6.1 Máquina de estados

```
   [crear]
      │
      ▼
  ┌───────────┐  aprobar   ┌──────────┐
  │ pendiente │ ─────────► │ aprobado │
  └───────────┘            └──────────┘
      │    ▲                    │
      │    └────────────────────┘
      │         desaprobar
      │ bloquear                │ bloquear
      ▼                         ▼
  ┌────────────┐
  │ bloqueado  │
  └────────────┘

  Desde cualquier estado: [eliminar] → borrado físico
```

### 6.2 Reglas de negocio

| ID | Regla |
|----|-------|
| RN-M5-01 | Solo los usuarios autenticados pueden comentar. El visitante ve un enlace para iniciar sesión. |
| RN-M5-02 | Todo comentario nace en estado `pendiente` y **no es visible públicamente** hasta que un Administrador lo aprueba. |
| RN-M5-03 | Solo el Administrador aprueba, bloquea o elimina comentarios. |
| RN-M5-04 | El autor de un comentario puede ver su propio comentario pendiente en el detalle, marcado como "pendiente de aprobación". Nadie más lo ve. |
| RN-M5-05 | `bloqueado` y eliminar son acciones distintas: bloquear conserva el registro para auditoría, eliminar lo borra físicamente. |
| RN-M5-06 | No existen respuestas anidadas ni reacciones. Los comentarios son planos. |
| RN-M5-07 | El contenido de un comentario no puede estar vacío. |
| RN-M5-08 | Al eliminar el usuario autor de un comentario, el comentario se elimina en cascada. Por eso los usuarios se bloquean en lugar de eliminarse (RN-M6-04). |

### 6.3 Casos de uso

#### HU-M5-01 — Crear un comentario

```gherkin
Escenario: Comentario creado por un usuario autenticado
  Dado que tengo una sesión iniciada
  Y estoy en el detalle de una publicación publicada
  Cuando escribo un comentario y lo envío
  Entonces el sistema lo registra en estado "pendiente"
  Y me asocia como autor del comentario
  Y muestra el mensaje "Tu comentario será visible cuando lo apruebe un administrador"
  Y el comentario no es visible para los demás visitantes

Escenario: Visitante intenta comentar
  Dado que no tengo una sesión iniciada
  Cuando accedo al detalle de una publicación
  Entonces no veo el formulario de comentarios
  Y veo un enlace que me invita a iniciar sesión para comentar

Escenario: Comentario vacío
  Dado que tengo una sesión iniciada
  Cuando envío el formulario de comentario sin escribir contenido
  Entonces el sistema rechaza el envío
  Y muestra el mensaje "El comentario no puede estar vacío"

Escenario: El autor ve su comentario pendiente
  Dado que envié un comentario que aún está en estado "pendiente"
  Cuando vuelvo al detalle de la publicación
  Entonces veo mi comentario marcado como "pendiente de aprobación"
  Pero otro usuario que visita la misma publicación no lo ve
```

#### HU-M5-02 — Moderar comentarios

```gherkin
Escenario: Ver la bandeja de comentarios
  Dado que tengo el rol "Administrador"
  Cuando accedo a la sección de comentarios del panel
  Entonces veo todos los comentarios del sistema
  Y cada fila muestra autor, correo, fecha, contenido y estado
  Y veo las acciones de aprobar, bloquear y eliminar según el estado de cada uno

Escenario: Aprobar un comentario
  Dado que existe un comentario en estado "pendiente"
  Cuando selecciono aprobarlo
  Entonces el sistema cambia su estado a "aprobado"
  Y el comentario pasa a ser visible en el detalle de su publicación

Escenario: Bloquear un comentario aprobado
  Dado que existe un comentario en estado "aprobado"
  Cuando selecciono bloquearlo
  Entonces el sistema cambia su estado a "bloqueado"
  Y el comentario deja de ser visible en el portal público
  Pero permanece registrado en la bandeja de moderación

Escenario: Eliminar un comentario
  Dado que existe un comentario en cualquier estado
  Cuando selecciono eliminarlo y confirmo
  Entonces el sistema lo elimina de forma definitiva
  Y desaparece de la bandeja de moderación

Escenario: Un Editor no puede moderar
  Dado que tengo el rol "Editor"
  Cuando intento acceder a la sección de comentarios del panel
  Entonces el sistema deniega el acceso con un error 403
```

---

## 7. M6 — Administración de Usuarios

**Propósito:** gestionar las cuentas y los permisos del sistema.

**Entidades:** `auth_user`, `auth_group`, `core_perfil`

**Pantallas:** Gestión de usuarios, Crear usuario, Editar usuario

### 7.1 Reglas de negocio

| ID | Regla |
|----|-------|
| RN-M6-01 | Solo el Administrador accede a este módulo. |
| RN-M6-02 | Un usuario pertenece a exactamente un rol a la vez. |
| RN-M6-03 | El Administrador puede crear usuarios con cualquier rol, incluido Administrador. |
| RN-M6-04 | **Los usuarios no se eliminan: se bloquean.** La acción "Eliminar" del panel desactiva la cuenta (`is_active = False`). Se conserva el registro para no perder la autoría de publicaciones y comentarios (RN-M5-08). |
| RN-M6-05 | Un Administrador no puede bloquearse ni cambiarse el rol a sí mismo. |
| RN-M6-06 | El sistema debe conservar siempre al menos un Administrador activo. |
| RN-M6-07 | El Administrador puede reponer la contraseña de otro usuario sin conocer la anterior. |
| RN-M6-08 | Bloquear una cuenta no oculta sus comentarios ya aprobados ni sus publicaciones publicadas. |

### 7.2 Casos de uso

#### HU-M6-01 — Gestionar el listado de usuarios

```gherkin
Escenario: Ver el listado de usuarios
  Dado que tengo el rol "Administrador"
  Cuando accedo a la sección de usuarios del panel
  Entonces veo todos los usuarios del sistema
  Y cada fila muestra nombre, correo, rol, fecha de registro y estado
  Y veo las acciones de editar, bloquear o desbloquear en cada fila

Escenario: Un Editor no accede
  Dado que tengo el rol "Editor"
  Cuando intento acceder a la sección de usuarios
  Entonces el sistema deniega el acceso con un error 403
```

#### HU-M6-02 — Crear un usuario desde el panel

```gherkin
Escenario: Creación exitosa
  Dado que tengo el rol "Administrador"
  Cuando ingreso usuario, contraseña, correo, nombre, apellido paterno y apellido materno
  Y asigno el rol "Editor"
  Y confirmo la creación
  Entonces el sistema crea la cuenta en estado activo
  Y la asigna al grupo "Editor"
  Y crea su perfil con los apellidos ingresados
  Y la cuenta aparece en el listado

Escenario: Datos duplicados
  Dado que existe un usuario con el correo "ana@example.com"
  Cuando intento crear un usuario con ese mismo correo
  Entonces el sistema rechaza la creación
  Y muestra el mensaje "Ese correo electrónico ya está registrado"
```

#### HU-M6-03 — Cambiar el rol de un usuario

```gherkin
Escenario: Promover a un usuario
  Dado que existe un usuario con el rol "Lector"
  Cuando le asigno el rol "Colaborador" y guardo
  Entonces el sistema actualiza su grupo
  Y en su siguiente inicio de sesión accede al panel administrativo

Escenario: El Administrador no puede degradarse a sí mismo
  Dado que tengo el rol "Administrador"
  Cuando intento cambiar mi propio rol
  Entonces el sistema bloquea la acción
  Y muestra el mensaje "No puedes modificar tu propio rol"
```

#### HU-M6-04 — Bloquear y desbloquear usuarios

```gherkin
Escenario: Bloquear una cuenta
  Dado que tengo el rol "Administrador"
  Y existe un usuario activo
  Cuando selecciono bloquearlo y confirmo
  Entonces el sistema desactiva la cuenta
  Y ese usuario no puede iniciar sesión
  Pero sus publicaciones publicadas siguen visibles
  Y sus comentarios aprobados siguen visibles

Escenario: Desbloquear una cuenta
  Dado que existe un usuario bloqueado
  Cuando selecciono desbloquearlo
  Entonces el sistema reactiva la cuenta
  Y ese usuario puede volver a iniciar sesión

Escenario: El Administrador no puede bloquearse a sí mismo
  Cuando intento bloquear mi propia cuenta
  Entonces el sistema bloquea la acción
  Y muestra el mensaje "No puedes bloquear tu propia cuenta"

Escenario: Proteger al último Administrador
  Dado que soy el único Administrador activo del sistema
  Cuando intento bloquear la única otra cuenta de Administrador
  Entonces el sistema permite la acción solo si queda al menos un Administrador activo

Escenario: La acción "Eliminar" desactiva
  Dado que tengo el rol "Administrador"
  Cuando selecciono "Eliminar" sobre un usuario
  Entonces el sistema me advierte que la cuenta será desactivada, no borrada
  Y al confirmar, desactiva la cuenta
  Y el usuario permanece en el listado marcado como inactivo
```

#### HU-M6-05 — Reponer la contraseña de un usuario

```gherkin
Escenario: Reposición por el Administrador
  Dado que tengo el rol "Administrador"
  Y un usuario perdió el acceso a su cuenta
  Cuando establezco una contraseña nueva para esa cuenta
  Entonces el sistema la actualiza sin requerir la contraseña anterior
  Y ese usuario puede iniciar sesión con la nueva contraseña
```

---

## 8. M7 — Gestión de Archivos

**Propósito:** almacenar y servir las imágenes del sistema. Es un módulo transversal: no
tiene pantalla propia, se consume desde M1 y M3.

**Entidades:** `archivo`, `galeria_publicacion`

### 8.1 Reglas de negocio

| ID | Regla |
|----|-------|
| RN-M7-01 | Un archivo registra nombre original, nombre temporal en disco, ruta, tipo MIME, tamaño, fecha y usuario que lo subió. |
| RN-M7-02 | Si ya existe un archivo con el mismo nombre, el sistema genera un nombre temporal único. No sobrescribe. |
| RN-M7-03 | Solo se admiten imágenes: JPEG, PNG y WebP. |
| RN-M7-04 | El tamaño máximo por archivo es 5 MB. |
| RN-M7-05 | Un mismo archivo puede ser referenciado por varias entidades. Eliminar la referencia no elimina el archivo. |
| RN-M7-06 | Los archivos subidos se almacenan en `uploads/`. Los recursos estáticos del sitio se sirven desde `static/`. |

### 8.2 Casos de uso

#### HU-M7-01 — Subir un archivo

```gherkin
Escenario: Subida exitosa
  Dado que estoy subiendo una imagen desde el formulario de publicación
  Cuando selecciono un archivo JPEG de 2 MB
  Y guardo el formulario
  Entonces el sistema almacena el archivo en el directorio de subidas
  Y registra su nombre, ruta, tipo y tamaño
  Y lo asocia a mi usuario como responsable de la subida

Escenario: Tipo de archivo no permitido
  Cuando intento subir un archivo PDF como imagen de portada
  Entonces el sistema rechaza la subida
  Y muestra el mensaje "Solo se permiten imágenes JPEG, PNG o WebP"

Escenario: Archivo demasiado grande
  Cuando intento subir una imagen de 8 MB
  Entonces el sistema rechaza la subida
  Y muestra el mensaje "El archivo no puede superar los 5 MB"

Escenario: Nombre de archivo repetido
  Dado que ya existe un archivo almacenado con el nombre "evento.jpg"
  Cuando subo otro archivo llamado "evento.jpg"
  Entonces el sistema almacena el nuevo con un nombre temporal único
  Y conserva el archivo anterior intacto
```

---

## 9. M8 — Métricas de Visitas

**Propósito:** contar y exponer el alcance de las publicaciones. Módulo transversal
consumido por M2 y M3.

**Entidades:** `publicacion.visitas`

### 9.1 Reglas de negocio

| ID | Regla |
|----|-------|
| RN-M8-01 | Cada carga del detalle de una publicación publicada incrementa su contador en uno. |
| RN-M8-02 | **No se distinguen visitas únicas de recargas.** El contador refleja cargas de página, no lectores. Limitación aceptada en el MVP ([PRODUCT_OVERVIEW D4](./PRODUCT_OVERVIEW.md#8-decisiones-abiertas-y-deuda-documentada)). |
| RN-M8-03 | Las vistas del panel administrativo **no** incrementan el contador. |
| RN-M8-04 | El total del home es la suma de `visitas` de todas las publicaciones. |
| RN-M8-05 | El contador se conserva al despublicar y solo desaparece si se elimina la publicación. |

### 9.2 Casos de uso

#### HU-M8-01 — Contabilizar una visita

```gherkin
Escenario: Visita desde el portal público
  Dado que una publicación tiene 100 visitas
  Cuando un visitante accede a su detalle
  Entonces el contador de esa publicación pasa a 101
  Y el detalle muestra 101 visitas

Escenario: La vista previa del panel no cuenta
  Dado que tengo el rol "Editor"
  Y una publicación tiene 100 visitas
  Cuando la abro desde la acción "Ver" del panel administrativo
  Entonces el contador permanece en 100

Escenario: Recargas repetidas
  Dado que una publicación tiene 100 visitas
  Cuando el mismo visitante recarga el detalle tres veces
  Entonces el contador pasa a 103
  Y el sistema no distingue que se trata del mismo visitante
```

---

## 10. Matriz de trazabilidad

Relación entre los requisitos del caso de estudio y los módulos que los implementan.

| Requisito del caso de estudio | Módulo | Casos de uso |
|-------------------------------|--------|--------------|
| Iniciar sesión y cerrar sesión | M1 | HU-M1-02, HU-M1-03 |
| Registrar una cuenta | M1 | HU-M1-01 |
| Modificar contraseña propia | M1 | HU-M1-05 |
| Ver perfil personal (foto, nombres) | M1 | HU-M1-04 |
| Leer noticias | M2 | HU-M2-01, HU-M2-02, HU-M2-03 |
| Slider principal automatizado | M2 | HU-M2-01 |
| Al menos cuatro noticias actualizadas en el home | M2 | HU-M2-01 |
| Botón para ver todas las noticias | M2 | HU-M2-01, HU-M2-03 |
| Detalle con portada, título, fecha, contenido, categoría, visitas y galería | M2 | HU-M2-02 |
| Crear, actualizar y eliminar noticias | M3 | HU-M3-02, HU-M3-03, HU-M3-05 |
| Publicar noticias | M3 | HU-M3-04 |
| Crear comentarios solo con cuenta | M5 | HU-M5-01 |
| Los comentarios no se publican hasta que el administrador autoriza | M5 | HU-M5-01, HU-M5-02 |
| Aprobar y eliminar comentarios | M5 | HU-M5-02 |
| Aprobar y bloquear publicación de comentarios | M5 | HU-M5-02 |
| Administrar usuarios (CRUD, bloquear, desbloquear) | M6 | HU-M6-01 a HU-M6-05 |
| Las visitas que se han realizado | M8 | HU-M8-01 |
| Búsqueda de noticias *(alcance ampliado)* | M2 | HU-M2-04 |
| Sidebar de noticias relacionadas *(alcance ampliado)* | M2 | HU-M2-02 |

---

## 11. Decisiones tomadas en este documento

| # | Decisión | Impacto |
|---|----------|---------|
| DM-01 | El slider del home se alimenta de las cinco publicaciones publicadas más recientes. Sin campo de destacado ni selección manual. | Sin cambios de esquema |
| DM-02 | El registro público crea cuentas activas de inmediato con rol Lector. Sin aprobación previa. | El control queda en la moderación de comentarios |
| DM-03 | Categorías y departamentos con publicaciones asociadas **no pueden eliminarse**. | Requiere validación en la vista; se aparta del `SET_NULL` del esquema, que lo permitiría |
| DM-04 | Los usuarios no se eliminan: se desactivan. La acción "Eliminar" del panel ejecuta un bloqueo. | Preserva la autoría de publicaciones y comentarios |
| DM-05 | Publicaciones, categorías, departamentos y comentarios sí se eliminan físicamente, con confirmación. | Fiel al esquema entregado. Irreversible |
| DM-06 | El Colaborador pierde la capacidad de editar su publicación una vez publicada. | Deriva del rol y no estaba explícito en las fuentes |
