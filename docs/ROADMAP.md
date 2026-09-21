# Roadmap de implementación — CMS de Noticias CANACO

Este roadmap convierte las 19 maquetas de Stitch en un producto Django completo. El orden sigue dependencias reales: primero las decisiones y cimientos que permiten construir; luego los módulos que crean datos; al final los que los exponen, moderan y administran.

## Alcance confirmado

- Producto completo: Django, base de datos, autenticación, autorización por rol, panel editorial, portal público, archivos, comentarios y pruebas.
- UI en español; código en inglés; tablas y columnas de base de datos en español, conforme a `PRODUCT_OVERVIEW.md`.
- Las maquetas son referencia visual, no código de producción.

## Fuente de diseño obligatoria: Stitch

**Proyecto canónico:** [Diseño Web Markdown en Stitch](https://stitch.withgoogle.com/projects/14921403100817785323) · ID `14921403100817785323`.

Cada referencia `P-xx` o `A-xx` de este roadmap apunta a la pantalla Stitch indicada abajo. Antes de implementar o revisar un checkpoint, se debe contrastar la pantalla contra esa fuente visual y su export local. No se rediseña ni se sustituye la maqueta sin registrar la decisión.

| Ref. | Pantalla fuente en Stitch | ID de pantalla Stitch | Export local |
|---|---|---|---|
| UI/UX | `UI_UX_SPEC.md` | `11162008934687650888` | `stitch-export/screens/01-UI-UX-SPEC-md.md` |
| P-01 | Home (Rediseñado con Cards) | `9feff14d80b249aab77af84bcb8a106b` | `stitch-export/screens/21-P-01-Home-Redise-ado-con-Cards.html` |
| P-02 | Listado de noticias (Rediseñado con Cards) | `3819e8770d7f425b837eb84df6044142` | `stitch-export/screens/10-P-02-Listado-de-noticias-Redise-ado-con-Cards.html` |
| P-03 | Noticias por categoría | `53aab36af4a34e1ca74deb1cb0c1ab56` | `stitch-export/screens/17-P-03-Noticias-por-categor-a.html` |
| P-04 | Detalle de noticia | `7c35fae5ed5a42ce97d18dce9a78448a` | `stitch-export/screens/19-P-04-Detalle-de-noticia.html` |
| P-05 | Resultados de búsqueda | `a359a338eaea473593f3ba2693ce4b88` | `stitch-export/screens/18-P-05-Resultados-de-b-squeda.html` |
| P-06 | Iniciar sesión | `8624b4a0a9a74360a3f7c3c27fc4af15` | `stitch-export/screens/08-P-06-Iniciar-sesi-n.html` |
| P-07 | Registro | `4842e40cf1f145bfbbdac74011d6a64f` | `stitch-export/screens/12-P-07-Registro.html` |
| P-08 | Pantallas de Error (404, 403, 500) | `969bbbda0f1541618ca8c1c32547b22b` | `stitch-export/screens/03-P-08-Pantallas-de-Error-404-403-500.html` |
| A-00 | Dashboard administrativo | `3279a10730be4e219f498ed9823cb7c8` | `stitch-export/screens/09-A-00-Dashboard-administrativo.html` |
| A-01 | Mi perfil | `67af765ee7fe4cf3af8e34c38005ec62` | `stitch-export/screens/13-A-01-Mi-perfil.html` |
| A-02 | Editar perfil | `eb531d00959d474eb7de591cabcaf486` | `stitch-export/screens/06-A-02-Editar-perfil.html` |
| A-03 | Cambiar contraseña | `2336107d6d3f490b9472f7dad5df0c89` | `stitch-export/screens/16-A-03-Cambiar-contrase-a.html` |
| A-04 | Panel de noticias | `7210a61dd8534f39892ce0d8f45143e3` | `stitch-export/screens/02-A-04-Panel-de-noticias.html` |
| A-05 | Crear y editar publicación | `dc2a76bd2aa846eca088ea03d1cc0796` | `stitch-export/screens/07-A-05-Crear-y-editar-publicaci-n.html` |
| A-06 | Comentarios | `b3e8b70beb7d41c5bb04229cb99e2fd2` | `stitch-export/screens/15-A-06-Comentarios.html` |
| A-07 | Categorías | `eb8dde4dba06454b89d38216f862f3d6` | `stitch-export/screens/04-A-07-Categor-as.html` |
| A-08 | Departamentos | `3c0fd2e7b7bb462b93f073a3f85f0ae2` | `stitch-export/screens/05-A-08-Departamentos.html` |
| A-09 | Usuarios | `800c957fbdee4b9880b5ab81417f9479` | `stitch-export/screens/14-A-09-Usuarios.html` |
| A-10 | Crear y editar usuario | `6cbe1e444ce04b90b9599e88d3eac6d2` | `stitch-export/screens/20-A-10-Crear-y-editar-usuario.html` |
| Asset | Logo CANACO SERVYTUR Villahermosa | `b6530a120a494304b3209259e1e42396` | `stitch-export/screens/11-Logo-CANACO-SERVYTUR-Villahermosa.svg` |

### Regla de revisión visual por checkpoint

Para cada pantalla incluida en el checkpoint: abrir la fuente Stitch, comparar estructura, jerarquía, tokens, estados y responsive con la implementación. Toda diferencia se registra como corrección o como desviación aprobada con su motivo.

## Mapa de dependencias

```text
F0 Base técnica
 ├─ F1 Modelo de dominio y archivos
 │   ├─ F2 Cuentas y permisos
 │   │   ├─ F3 Taxonomía
 │   │   ├─ F4 Publicaciones
 │   │   │   ├─ F5 Portal público y visitas
 │   │   │   └─ F6 Comentarios
 │   │   └─ F7 Administración de usuarios
 │   └─ F8 Integración, accesibilidad y entrega
```

> **Regla:** una fase no empieza hasta que su contrato de datos, permisos y pruebas de la fase anterior esté aceptado.

## Método de ejecución: checkpoints, no cascada

Cada fase se trabaja en ciclos cortos. No avanzamos por haber escrito código: avanzamos sólo tras revisar evidencia juntos.

1. **Preparar:** acordamos el objetivo pequeño, sus pantallas, reglas de negocio y criterio verificable.
2. **Construir:** implementamos únicamente ese corte.
3. **Verificar:** revisamos comportamiento, permisos, datos, UI responsive y pruebas.
4. **Corregir o aprobar:** si hay desvíos, se corrigen y se vuelve a verificar; si no los hay, se marca el checkpoint y recién entonces sigue el próximo.

| Checkpoint | Qué se revisa antes de seguir |
|---|---|
| C0 · Fundación | Proyecto levanta, configuración segura, layouts y handlers de error funcionan. |
| C1 · Datos | Migraciones, relaciones, estados y archivos conservan integridad. |
| C2 · Identidad | Registro, sesión, perfil y matriz de permisos por rol. |
| C3 · Catálogos | Categorías/departamentos y restricciones de eliminación. |
| C4 · Editorial | Borrador, publicación, despublicación, propiedad y archivos de una noticia. |
| C5 · Público | Sólo contenido publicado, búsqueda, categoría, detalle y visitas. |
| C6 · Moderación | Comentarios pendientes, aprobados, bloqueados y visibilidad correcta. |
| C7 · Gobierno | Usuarios, roles, bloqueos y protección del último administrador. |
| C8 · Release | Recorrido completo, responsive, accesibilidad, pruebas y despliegue. |

> Un checkpoint rechazado **no abre trabajo nuevo**. Genera una lista de correcciones acotada, se resuelve y se vuelve a revisar el mismo checkpoint.

## Inventario de pantallas por módulo

| Módulo | Pantallas Stitch | Pantallas o superficies a crear |
|---|---|---|
| Base transversal | — | Layout público, layout del panel, navegación, sidebar, footer, sistema de alertas/toasts, modales de confirmación, estados vacío/carga/error |
| M1 · Cuentas | P-06 Login, P-07 Registro, A-01 Mi perfil, A-02 Editar perfil, A-03 Cambiar contraseña | Cerrar sesión como acción de navegación; redirección post-login. No requiere pantalla nueva. |
| M2 · Portal público | P-01 Home, P-02 Listado, P-03 Categoría, P-04 Detalle, P-05 Búsqueda, P-08 Errores | Página de acceso denegado 403 y error 500 ya están dentro de P-08. |
| M3 · Publicaciones | A-00 Dashboard, A-04 Panel de noticias, A-05 Crear/editar publicación | Confirmar eliminar y despublicar como modales, no pantallas nuevas. |
| M4 · Taxonomía | A-07 Categorías, A-08 Departamentos | Confirmar eliminación como modal. |
| M5 · Comentarios | P-04 Detalle, A-06 Comentarios | Comentar se integra en P-04; moderar se integra en A-06. No pantalla nueva. |
| M6 · Usuarios | A-09 Usuarios, A-10 Crear/editar usuario | Restablecer contraseña como modal dentro de A-10. |
| M7 · Archivos | A-02, A-05 | Selector/subida de archivos, galería y visor: componentes reutilizables, no pantallas. |
| M8 · Visitas | P-01, P-04, A-00, A-04 | Sin pantalla nueva; métrica integrada. |

## Fases de trabajo

### F0 — Fundación técnica y contrato de arquitectura

**Objetivo:** dejar un proyecto Django ejecutable, consistente y preparado para crecer sin reescribir sus bases.

**Entregables**
- Proyecto Django, configuración por ambiente, base de datos, variables de entorno, archivos estáticos y media.
- Apps de dominio: `core`, `accounts`, `content`, `taxonomy`, `comments` y `media` (nombres sujetos a validar contra la estructura existente).
- Layout público y layout de panel; tokens visuales de la maqueta; componentes base reutilizables.
- Plantillas de 403, 404 y 500 (P-08) conectadas a los handlers reales de Django.
- Base de pruebas, fixtures de roles y datos semilla mínimos.

**Pantallas habilitadas:** P-08 inicialmente; cascarón compartido para las 18 restantes.

**Criterios de salida**
- App levanta desde cero con instrucciones reproducibles.
- 403/404/500 responden con la vista diseñada.
- Sin secretos ni rutas locales en control de versiones.

---

### F1 — Dominio, persistencia y archivos

**Objetivo:** modelar la información antes de construir formularios. El CMS no puede ser sólido si los datos nacen después de las vistas.

**Entregables**
- Modelos y migraciones: perfil, categoría, departamento, publicación, archivo, galería de publicación y comentario.
- Mapeo explícito de modelos/campos de código inglés a tablas/columnas españolas mediante `db_table` y `db_column`.
- Estados: publicación `borrador/publicado`; comentario `pendiente/aprobado/bloqueado`.
- Servicio de subida/validación de JPEG, PNG y WebP hasta 5 MB; borrado seguro de referencias de galería.
- Datos semilla: roles, un administrador inicial, categorías, departamentos y publicaciones de ejemplo.

**Pantallas habilitadas:** ninguna final; habilita los formularios de F2–F7.

**Criterios de salida**
- Integridad referencial y restricciones de eliminación cubiertas por pruebas.
- Una publicación puede conservar portada y múltiples elementos de galería.

---

### F2 — Cuentas, sesión y autorización

**Objetivo:** establecer quién puede entrar y qué puede hacer antes de abrir el panel.

**Dependencia:** F0, F1.

**Pantallas**
- P-06 · Iniciar sesión.
- P-07 · Registro.
- A-01 · Mi perfil.
- A-02 · Editar perfil.
- A-03 · Cambiar contraseña.

**Entregables**
- Registro, login, logout, sesión, edición de perfil, foto y cambio de contraseña.
- Roles Django: lector, colaborador, editor y administrador.
- Guards de rutas y permisos: usuario inactivo no inicia sesión; acceso no autorizado devuelve 403.
- Validaciones y mensajes definidos en `UI_UX_SPEC.md`.

**Criterios de salida**
- Cada rol pasa pruebas de permiso positivas y negativas.
- Un usuario sólo edita su propio perfil y contraseña.

---

### F3 — Taxonomía editorial

**Objetivo:** crear los catálogos de los que depende publicar correctamente.

**Dependencia:** F1, F2.

**Pantallas**
- A-07 · Categorías.
- A-08 · Departamentos.

**Entregables**
- Alta y baja de categorías y departamentos para editor y administrador.
- Prevención de duplicados y de borrado cuando existan publicaciones asociadas.
- Estados vacíos, modales de confirmación y avisos de bloqueo.

**Criterios de salida**
- Un colaborador no puede administrar taxonomía.
- Las categorías y departamentos creados aparecen disponibles en F4.

---

### F4 — Flujo editorial de publicaciones

**Objetivo:** entregar el núcleo de negocio: redactar, editar, publicar, despublicar y eliminar noticias con reglas por rol.

**Dependencia:** F1, F2, F3.

**Pantallas**
- A-00 · Dashboard administrativo.
- A-04 · Panel de noticias.
- A-05 · Crear y editar publicación.

**Entregables**
- CRUD de publicaciones, búsqueda y filtros internos, paginación y métricas de panel.
- Editor de contenido, portada y galería usando M7.
- Regla de propiedad: colaborador sólo manipula sus borradores; editor/admin pueden publicar y eliminar.
- Validación de campos necesarios para publicar; borrador permite incompletitud controlada.
- Confirmaciones destructivas y protección ante cambios sin guardar.

**Criterios de salida**
- Una publicación pasa de borrador a publicado sólo con permisos válidos.
- El borrado elimina/gestiona sus relaciones conforme al contrato de datos.

---

### F5 — Portal público y medición de visitas

**Objetivo:** exponer únicamente contenido publicado y convertir la gestión editorial en una experiencia útil para visitantes.

**Dependencia:** F4.

**Pantallas**
- P-01 · Home.
- P-02 · Listado de noticias.
- P-03 · Noticias por categoría.
- P-04 · Detalle de noticia.
- P-05 · Resultados de búsqueda.

**Entregables**
- Home con slider, recientes, contador acumulado y enlaces de navegación.
- Listados, filtros por categoría, búsqueda por título/contenido, paginación y estados vacíos.
- Detalle con portada, metadatos, galería/visor y noticias relacionadas.
- Incremento de visitas por cada carga del detalle; se documenta como cargas, no visitantes únicos.

**Criterios de salida**
- Un borrador nunca aparece por URL, búsqueda, home, categoría ni relacionados.
- Las visitas se muestran de modo consistente en detalle y panel.

---

### F6 — Participación y moderación

**Objetivo:** permitir comentarios sin sacrificar control editorial.

**Dependencia:** F2, F4, F5.

**Pantallas**
- P-04 · Detalle de noticia (formulario y lista pública).
- A-06 · Comentarios.

**Entregables**
- Alta de comentario para usuarios autenticados; estado inicial `pendiente`.
- Panel de moderación para administrador: aprobar, bloquear, eliminar y acciones por lote.
- En el portal sólo se muestran comentarios aprobados; el autor puede ver el estado de su comentario según la especificación.

**Criterios de salida**
- Un comentario nuevo no se filtra públicamente sin aprobación.
- Editor y colaborador no acceden a moderación.

---

### F7 — Administración de usuarios

**Objetivo:** permitir al administrador operar cuentas sin romper la seguridad del sistema.

**Dependencia:** F2.

**Pantallas**
- A-09 · Usuarios.
- A-10 · Crear y editar usuario.

**Entregables**
- Listado, filtros, alta, edición, roles, bloqueo/desbloqueo y restablecimiento de contraseña.
- Protección contra autobloqueo/autocambio de rol.
- Protección del último administrador activo.
- Bloqueo lógico: conserva publicaciones y comentarios.

**Criterios de salida**
- Sólo administrador accede a las rutas.
- Nunca se puede dejar el sistema sin administrador activo.

---

### F8 — Integración, calidad y entrega

**Objetivo:** verificar el producto como sistema, no como una colección de pantallas aisladas.

**Dependencia:** F3–F7.

**Entregables**
- Navegación completa entre las 19 pantallas y redirecciones post-acción.
- Adaptación móvil, tablet y desktop según la especificación.
- Auditoría de accesibilidad WCAG 2.1 AA, teclado, foco, modales y formularios.
- Pruebas unitarias, de integración y de permisos; pruebas de rutas críticas de extremo a extremo.
- Documentación de instalación, variables de entorno, carga de datos semilla y despliegue.

**Criterios de salida**
- Las 19 pantallas, sus estados vacíos/error y flujos críticos se verifican en un ambiente similar a producción.
- Cero rutas protegidas accesibles por URL directa sin permiso.

## Orden de releases recomendado

| Release | Incluye | Resultado demostrable |
|---|---|---|
| R1 · Cimientos | F0–F2 | Usuarios se registran, inician sesión y administran su perfil. |
| R2 · Backoffice editorial | F3–F4 | Equipo editorial crea, clasifica y publica noticias. |
| R3 · Portal público | F5 | Visitantes consumen, buscan y navegan noticias publicadas. |
| R4 · Gobierno del sistema | F6–F7 | Comentarios moderados y usuarios administrados. |
| R5 · Calidad | F8 | Producto integrado, accesible y listo para evaluación/despliegue. |

## Decisiones pendientes antes de F0

1. Motor y versión exactos de base de datos; las migraciones y el mapeo del esquema dependen de ello.
2. Estrategia de almacenamiento de archivos en desarrollo y producción.
3. Destino de despliegue y proveedor de correo, aunque recuperación de contraseña queda fuera del MVP.

## Checklist de avance

- [ ] F0 · Base técnica
- [ ] F1 · Dominio y archivos
- [ ] F2 · Cuentas y permisos
- [ ] F3 · Taxonomía
- [ ] F4 · Publicaciones
- [ ] F5 · Portal y visitas
- [ ] F6 · Comentarios
- [ ] F7 · Usuarios
- [ ] F8 · Calidad y entrega
