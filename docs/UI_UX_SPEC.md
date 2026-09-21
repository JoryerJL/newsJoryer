# UI_UX_SPEC

**Proyecto:** Sistema de Noticias (CMS) — CANACO SERVYTUR Villahermosa
**Versión del documento:** 1.0
**Destinatario:** diseño de pantallas (Figma) e implementación de plantillas
**Base de estilos:** Tailwind CSS
**Documentos previos:** [PRODUCT_OVERVIEW.md](./PRODUCT_OVERVIEW.md) · [MODULES_SPEC.md](./MODULES_SPEC.md) · [DATA_MODEL.md](./DATA_MODEL.md)

---

## Cómo leer este documento

| Sección | Para quién |
|---------|-----------|
| §1 Variables de diseño | Diseño — tokens para la librería de estilos de Figma |
| §2 Componentes y estados | Diseño — cada componente con todos sus estados |
| §3 Layouts | Diseño — las dos estructuras maestras |
| §4 Mapa de navegación | Diseño y producto — flujo completo |
| §5 Pantallas públicas | Diseño — ocho pantallas detalladas |
| §6 Pantallas del panel | Diseño — once pantallas detalladas |
| §7 Accesibilidad | Diseño — requisitos no negociables |
| §8 Responsive | Diseño — comportamiento por breakpoint |
| §9 Microcopy | Diseño y contenido — todos los textos del sistema |
| §10 Checklist de entrega | Control de completitud |

**Nomenclatura de pantallas:** `P-##` públicas, `A-##` del panel administrativo.
Cada pantalla referencia sus casos de uso (`HU-*`) y reglas de negocio (`RN-*`) de
[MODULES_SPEC.md](./MODULES_SPEC.md).

**Idioma:** toda la interfaz visible está en español. Los nombres de clases, componentes y
archivos van en inglés ([PRODUCT_OVERVIEW §9](./PRODUCT_OVERVIEW.md#9-convención-de-idioma)).

---

## 1. Variables de diseño

### 1.1 Paleta base

Los cinco colores de la paleta aprobada:

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-700` | `#2b6777` | Color primario. Navbar, sidebar, encabezados, enlaces |
| `brand-100` | `#c8d8e4` | Superficies suaves, fondos de sección, bordes destacados |
| `surface` | `#ffffff` | Fondo de tarjetas, formularios y contenido |
| `surface-alt` | `#f2f2f2` | Fondo general de página, filas alternas de tabla |
| `accent-500` | `#52ab98` | Acento visual. **Solo decorativo o con texto oscuro** (ver §1.2) |

### 1.2 Colores derivados — obligatorios

Los cinco colores base **no bastan** para construir la interfaz. Estos derivados resuelven
contraste, jerarquía y acciones destructivas. **Todos los valores están verificados contra
WCAG 2.1 AA.**

#### Escala de marca

| Token | Hex | Contraste vs blanco | Uso |
|-------|-----|:------------------:|-----|
| `brand-900` | `#1f4d59` | 6.36:1 sobre `brand-100` ✅ | **Texto sobre superficies celestes.** Hover del primario |
| `brand-700` | `#2b6777` | **6.35:1** ✅ | Primario. Texto sobre blanco, fondo con texto blanco |
| `brand-500` | `#4a8496` | 3.9:1 ⚠️ | Solo decorativo: iconos grandes, bordes, gráficas |
| `brand-100` | `#c8d8e4` | — | Superficie |
| `brand-50` | `#eef4f8` | — | Superficie muy suave, fondo de fila resaltada |

#### Escala de acento

| Token | Hex | Contraste vs blanco | Uso |
|-------|-----|:------------------:|-----|
| `accent-700` | `#3a7d6f` | **4.84:1** ✅ | **Botón de éxito con texto blanco.** Confirmaciones |
| `accent-500` | `#52ab98` | **2.75:1** ❌ | **Nunca con texto blanco ni negro pequeño.** Solo fondos decorativos, barras, gráficas |
| `accent-100` | `#e7f4f0` | — | Fondo de badge "Publicado" y "Aprobado" |

> ⚠️ **Advertencia crítica de contraste.** `accent-500` `#52ab98` tiene **2.75:1** contra
> blanco. WCAG AA exige **4.5:1** para texto normal. Un botón `#52ab98` con texto blanco
> **reprueba accesibilidad y se lee mal en pantallas con brillo bajo**. Para cualquier
> superficie con texto encima usar `accent-700` `#3a7d6f`.
>
> Igualmente, `brand-700` `#2b6777` sobre `brand-100` `#c8d8e4` da **4.35:1** — por debajo
> del mínimo. Sobre superficies celestes, el texto va en `brand-900` `#1f4d59` (6.36:1).

#### Neutros

| Token | Hex | Contraste vs blanco | Uso |
|-------|-----|:------------------:|-----|
| `ink-900` | `#1a2e35` | **14.13:1** ✅ | Texto principal, títulos |
| `ink-600` | `#5a7784` | **4.77:1** ✅ | Texto secundario, metadatos, placeholders |
| `ink-400` | `#9aacb5` | 2.6:1 ❌ | Solo bordes e iconos decorativos. **Nunca texto** |
| `line` | `#dfe6ea` | — | Bordes de tarjetas, tablas y campos |
| `surface-alt` | `#f2f2f2` | — | Fondo de página |
| `surface` | `#ffffff` | — | Fondo de contenido |

#### Semánticos

Ninguno viene en la paleta base. Son necesarios: el panel tiene acciones destructivas y
estados que el usuario debe distinguir de un vistazo.

| Token | Hex | Texto encima | Contraste | Uso |
|-------|-----|--------------|:---------:|-----|
| `success-700` | `#3a7d6f` | Blanco | 4.84:1 ✅ | Confirmaciones, estado publicado |
| `success-50` | `#e7f4f0` | `#2a5d52` | ≥ 7:1 ✅ | Fondo de badge y alerta de éxito |
| `warning-700` | `#8a5a00` | Blanco | 5.9:1 ✅ | Estado borrador y pendiente |
| `warning-50` | `#fdf4e3` | `#8a5a00` | ≥ 7:1 ✅ | Fondo de badge y alerta de advertencia |
| `danger-700` | `#c0392b` | Blanco | **5.44:1** ✅ | Eliminar, bloquear, errores |
| `danger-50` | `#fdecea` | `#8e2a20` | ≥ 7:1 ✅ | Fondo de badge y alerta de error |
| `info-700` | `#2b6777` | Blanco | 6.35:1 ✅ | Mensajes informativos (reusa el primario) |
| `info-50` | `#eef4f8` | `#1f4d59` | ≥ 7:1 ✅ | Fondo de alerta informativa |

#### Configuración Tailwind

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef4f8',
          100: '#c8d8e4',
          500: '#4a8496',
          700: '#2b6777',
          900: '#1f4d59',
        },
        accent: {
          100: '#e7f4f0',
          500: '#52ab98',
          700: '#3a7d6f',
        },
        ink: {
          400: '#9aacb5',
          600: '#5a7784',
          900: '#1a2e35',
        },
        line: '#dfe6ea',
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f2f2f2',
        },
        success: { 50: '#e7f4f0', 700: '#3a7d6f' },
        warning: { 50: '#fdf4e3', 700: '#8a5a00' },
        danger:  { 50: '#fdecea', 700: '#c0392b' },
        info:    { 50: '#eef4f8', 700: '#2b6777' },
      },
    },
  },
}
```

### 1.3 Tipografía

Dos familias, ambas de Google Fonts, ambas con excelente soporte de acentos y ñ.

| Rol | Familia | Pesos | Uso |
|-----|---------|-------|-----|
| Títulos | **Source Serif 4** | 600, 700 | Títulos de noticia, encabezados de sección. Da carácter editorial |
| Interfaz y cuerpo | **Inter** | 400, 500, 600, 700 | Todo lo demás: navegación, formularios, tablas, cuerpo de texto |

```css
--font-display: 'Source Serif 4', Georgia, serif;
--font-body: 'Inter', system-ui, -apple-system, sans-serif;
```

> Alternativa sin serif, si el diseñador prefiere una sola familia: **Inter** para todo, con
> los títulos en peso 700 y `letter-spacing: -0.02em`.

#### Escala tipográfica

| Token | Tamaño | Interlínea | Peso | Familia | Uso |
|-------|--------|-----------|------|---------|-----|
| `display` | 48 px / 3rem | 1.1 | 700 | Display | Título del slider, título de página de error |
| `h1` | 36 px / 2.25rem | 1.2 | 700 | Display | Título de noticia en el detalle |
| `h2` | 28 px / 1.75rem | 1.25 | 600 | Display | Encabezado de sección, título de pantalla del panel |
| `h3` | 22 px / 1.375rem | 1.3 | 600 | Display | Título de noticia en tarjeta |
| `h4` | 18 px / 1.125rem | 1.4 | 600 | Body | Subtítulos, encabezados de tarjeta del panel |
| `body-lg` | 18 px / 1.125rem | 1.7 | 400 | Body | Cuerpo del contenido de la noticia |
| `body` | 16 px / 1rem | 1.6 | 400 | Body | Texto general, campos de formulario |
| `body-sm` | 14 px / 0.875rem | 1.5 | 400 | Body | Metadatos, celdas de tabla, texto de ayuda |
| `caption` | 12 px / 0.75rem | 1.4 | 500 | Body | Badges, etiquetas, pies de imagen |
| `overline` | 12 px / 0.75rem | 1.4 | 600 | Body | Categoría sobre el título. `letter-spacing: 0.08em`, mayúsculas |

**Medida de línea:** el cuerpo de la noticia se limita a **65–75 caracteres** por línea
(`max-width: 68ch`). Más ancho cansa la lectura.

### 1.4 Espaciado

Escala de 4 px. Todo margen, relleno y hueco sale de aquí.

| Token | Valor | Uso típico |
|-------|-------|------------|
| `space-1` | 4 px | Separación entre icono y texto |
| `space-2` | 8 px | Relleno interno de badges |
| `space-3` | 12 px | Relleno vertical de campos |
| `space-4` | 16 px | Relleno de celdas, hueco entre elementos relacionados |
| `space-5` | 20 px | Relleno interno de tarjetas pequeñas |
| `space-6` | 24 px | Relleno interno de tarjetas y formularios |
| `space-8` | 32 px | Hueco entre bloques de una sección |
| `space-12` | 48 px | Hueco entre secciones |
| `space-16` | 64 px | Margen vertical de sección en escritorio |
| `space-24` | 96 px | Separación mayor entre bloques del home |

### 1.5 Radios, bordes y sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 4 px | Badges, etiquetas |
| `radius-md` | 8 px | Botones, campos, celdas |
| `radius-lg` | 12 px | Tarjetas, paneles, modales |
| `radius-xl` | 16 px | Slider, contenedores destacados |
| `radius-full` | 9999 px | Avatares, botones circulares |

| Token | Valor |
|-------|-------|
| `border` | `1px solid #dfe6ea` |
| `border-strong` | `1px solid #c8d8e4` |
| `shadow-sm` | `0 1px 2px rgba(26,46,53,.06)` |
| `shadow-md` | `0 4px 12px rgba(26,46,53,.08)` |
| `shadow-lg` | `0 12px 32px rgba(26,46,53,.12)` |
| `shadow-focus` | `0 0 0 3px rgba(43,103,119,.35)` |

### 1.6 Breakpoints

| Nombre | Ancho | Dispositivo |
|--------|-------|-------------|
| `base` | < 640 px | Móvil |
| `sm` | ≥ 640 px | Móvil grande |
| `md` | ≥ 768 px | Tableta |
| `lg` | ≥ 1024 px | Escritorio |
| `xl` | ≥ 1280 px | Escritorio amplio |

**Ancho máximo del contenido:** 1200 px, centrado, con 16 px de margen lateral en móvil y
24 px desde `md`.

### 1.7 Elevación (z-index)

| Token | Valor | Capa |
|-------|-------|------|
| `z-base` | 0 | Contenido |
| `z-sticky` | 10 | Navbar fijo |
| `z-dropdown` | 20 | Menú desplegable de categorías |
| `z-overlay` | 30 | Fondo oscurecido de modal |
| `z-modal` | 40 | Modal de confirmación |
| `z-toast` | 50 | Notificaciones |

### 1.8 Movimiento

| Token | Valor | Uso |
|-------|-------|-----|
| `duration-fast` | 150 ms | Hover, cambios de color |
| `duration-base` | 250 ms | Apertura de menú, aparición de toast |
| `duration-slow` | 400 ms | Transición del slider |
| `ease-standard` | `cubic-bezier(.4,0,.2,1)` | Todo salvo el slider |
| `ease-out` | `cubic-bezier(0,0,.2,1)` | Entrada de modales y toasts |

**Obligatorio:** respetar `prefers-reduced-motion`. Con la preferencia activa, el slider no
auto-avanza y todas las transiciones caen a 0 ms.

---

## 2. Componentes y estados

### 2.1 Botones

Cinco variantes. Altura fija **40 px** (`md`), relleno horizontal `space-5`, `radius-md`,
tipografía `body` peso 600.

| Variante | Fondo | Texto | Borde | Uso |
|----------|-------|-------|-------|-----|
| **Primario** | `brand-700` | Blanco | — | Acción principal de cada pantalla |
| **Secundario** | Transparente | `brand-700` | `1px brand-700` | Acción alterna, cancelar |
| **Terciario** | Transparente | `brand-700` | — | Acciones de baja jerarquía, enlaces de acción |
| **Éxito** | `accent-700` | Blanco | — | Confirmar, aprobar, publicar |
| **Peligro** | `danger-700` | Blanco | — | Eliminar, bloquear |

#### Estados de cada variante

| Estado | Primario | Secundario | Éxito | Peligro |
|--------|----------|-----------|-------|---------|
| **Default** | fondo `#2b6777` | borde y texto `#2b6777` | fondo `#3a7d6f` | fondo `#c0392b` |
| **Hover** | fondo `#1f4d59` | fondo `#eef4f8` | fondo `#2f6659` | fondo `#a03025` |
| **Active** | fondo `#183c46`, `translateY(1px)` | fondo `#c8d8e4` | fondo `#275449` | fondo `#88281f` |
| **Focus visible** | + `shadow-focus`, `outline: 2px solid #2b6777`, `outline-offset: 2px` | igual | igual | anillo en `danger-700` |
| **Disabled** | fondo `#c8d8e4`, texto `#5a7784`, `cursor: not-allowed`, `opacity: 1` | borde y texto `#9aacb5` | igual que primario | igual que primario |
| **Loading** | spinner de 16 px a la izquierda, texto conservado, `pointer-events: none` | igual | igual | igual |

#### Tamaños

| Tamaño | Altura | Relleno horizontal | Tipografía |
|--------|--------|--------------------|-----------|
| `sm` | 32 px | `space-4` | `body-sm` |
| `md` | 40 px | `space-5` | `body` |
| `lg` | 48 px | `space-6` | `body` peso 600 |

**Botón de icono:** cuadrado del tamaño de la altura correspondiente, `radius-md`, siempre
con `aria-label`.

### 2.2 Campos de formulario

Altura **40 px**, relleno `space-3` `space-4`, `radius-md`, borde `line`, fondo blanco,
tipografía `body`.

| Estado | Borde | Fondo | Detalle |
|--------|-------|-------|---------|
| **Default** | `#dfe6ea` | Blanco | Placeholder en `ink-600` |
| **Hover** | `#c8d8e4` | Blanco | — |
| **Focus** | `#2b6777` | Blanco | + `shadow-focus` |
| **Filled** | `#dfe6ea` | Blanco | Texto en `ink-900` |
| **Error** | `#c0392b` | `#fdecea` | Mensaje debajo en `danger-700`, `body-sm` |
| **Disabled** | `#dfe6ea` | `#f2f2f2` | Texto `ink-400`, `cursor: not-allowed` |
| **Readonly** | `#dfe6ea` | `#f2f2f2` | Texto `ink-900`, sin cursor de bloqueo |

#### Anatomía del campo

```
┌────────────────────────────────────────┐
│ Etiqueta *                             │  body-sm, peso 600, ink-900
│ ┌────────────────────────────────────┐ │
│ │ Valor o placeholder                │ │  altura 40px
│ └────────────────────────────────────┘ │
│ Texto de ayuda o mensaje de error      │  body-sm, ink-600 o danger-700
└────────────────────────────────────────┘
```

- El asterisco de campo obligatorio va en `danger-700`, con `aria-required="true"`.
- El mensaje de error reemplaza al texto de ayuda, no se suma.
- La etiqueta **siempre visible**. Nunca usar el placeholder como etiqueta.

#### Tipos de campo del sistema

| Tipo | Dónde aparece | Particularidad |
|------|---------------|----------------|
| Texto | Título, nombre, usuario | — |
| Correo | Registro, usuario | Teclado de correo en móvil |
| Contraseña | Login, registro, cambio | Botón de ojo para mostrar u ocultar |
| Textarea | Resumen, comentario | Alto mínimo 96 px, redimensionable en vertical |
| Select | Categoría, departamento, estado, rol | Flecha propia, nunca la nativa |
| Archivo | Portada, galería, foto de perfil | Ver §2.3 |
| Editor enriquecido | Contenido de la publicación | Ver §2.4 |
| Búsqueda | Navbar | Icono de lupa a la izquierda, `radius-full` |

### 2.3 Carga de archivos

Dos formas, según el contexto:

**Simple (portada, foto de perfil):**

```
┌──────────────────────────────────────────────┐
│  ┌────────┐                                  │
│  │ vista  │   evento-canaco.jpg              │
│  │ previa │   248 KB · JPEG        [Quitar]  │
│  └────────┘                                  │
└──────────────────────────────────────────────┘
```

- Vista previa de 64 × 64 px, `radius-md`.
- Sin archivo: zona punteada con borde `2px dashed #c8d8e4`, icono y texto
  "Arrastra una imagen o haz clic para seleccionar".
- Debajo, siempre: "JPEG, PNG o WebP · máximo 5 MB".

**Múltiple (galería):** cuadrícula de vistas previas de 96 × 96 px con botón de quitar en la
esquina superior derecha de cada una, más una celda final con un `+` para agregar.

| Estado | Apariencia |
|--------|-----------|
| Vacío | Borde punteado `brand-100`, icono y texto de invitación |
| Arrastrando encima | Borde `brand-700` sólido, fondo `brand-50` |
| Cargando | Barra de progreso de 4 px en `brand-700` sobre la vista previa |
| Cargado | Vista previa con nombre, peso y botón de quitar |
| Error | Borde `danger-700`, fondo `danger-50`, mensaje con el motivo |

### 2.4 Editor de contenido enriquecido

Barra de herramientas fija sobre el área de edición. Área mínima de **320 px** de alto,
crece con el contenido.

**Herramientas mínimas:** formato de párrafo, negrita, cursiva, subrayado, enlace, lista
con viñetas, lista numerada, limpiar formato.

| Elemento | Especificación |
|----------|----------------|
| Barra | Fondo `surface-alt`, borde inferior `line`, alto 40 px, botones de icono de 32 px |
| Área de edición | Fondo blanco, relleno `space-4`, tipografía `body-lg` |
| Botón activo | Fondo `brand-100`, icono `brand-900` |
| Foco | Borde exterior `brand-700` + `shadow-focus` en todo el bloque |

### 2.5 Badges de estado

Alto 24 px, relleno `space-1` `space-2`, `radius-sm`, tipografía `caption` peso 600.
Fondo tintado + texto oscuro: siempre superan 4.5:1.

| Estado | Fondo | Texto | Dónde |
|--------|-------|-------|-------|
| Publicado | `#e7f4f0` | `#2a5d52` | Panel de noticias |
| Borrador | `#fdf4e3` | `#8a5a00` | Panel de noticias |
| Aprobado | `#e7f4f0` | `#2a5d52` | Panel de comentarios |
| Pendiente | `#fdf4e3` | `#8a5a00` | Panel de comentarios |
| Bloqueado | `#fdecea` | `#8e2a20` | Panel de comentarios |
| Activo | `#e7f4f0` | `#2a5d52` | Panel de usuarios |
| Inactivo | `#f2f2f2` | `#5a7784` | Panel de usuarios |
| Categoría | `#eef4f8` | `#1f4d59` | Tarjetas y detalle de noticia |

> **El color nunca es el único indicador.** Cada badge lleva su texto. Quien no distingue
> colores lee "Borrador" igual.

### 2.6 Tablas

Todas las tablas del panel comparten estructura.

| Parte | Especificación |
|-------|----------------|
| Contenedor | Fondo blanco, `radius-lg`, `shadow-sm`, borde `line`, `overflow: hidden` |
| Encabezado | Fondo `surface-alt`, texto `body-sm` peso 600 `ink-900`, alto 48 px |
| Fila | Alto 56 px, borde inferior `line`, texto `body-sm` |
| Fila par | Fondo `#fafbfc` |
| Fila hover | Fondo `brand-50` |
| Celda | Relleno `space-4`, alineación vertical centrada |
| Columna de acciones | Última, alineada a la derecha, ancho automático |
| Columna numérica | Alineada a la derecha, cifras tabulares (`font-variant-numeric: tabular-nums`) |

**Acciones por fila:** botones `sm`. Máximo tres visibles; si hay más, menú de tres puntos.

**Orden:** columnas ordenables con flecha en el encabezado. Estado activo en `brand-700`.

**Estado vacío de tabla:** fila única a todo el ancho, alto 200 px, centrada, con icono de
64 px en `ink-400`, mensaje en `body` `ink-600` y, cuando aplique, el botón de acción
primaria.

**Estado de carga:** tres filas fantasma con bloques grises animados.

### 2.7 Paginación

Centrada bajo el listado, `space-8` de margen superior.

```
   ← Anterior    1   2  [3]   4   5    Siguiente →
```

| Elemento | Especificación |
|----------|----------------|
| Página actual | Fondo `brand-700`, texto blanco, 36 × 36 px, `radius-md` |
| Otras páginas | Texto `brand-700`, hover fondo `brand-50` |
| Anterior / Siguiente | Texto `brand-700` con icono; `ink-400` y sin clic cuando no aplica |
| Resumen | A la izquierda en `md` y superiores: "Mostrando 1–10 de 47" en `body-sm` `ink-600` |

**Tamaño de página:** 9 en listados públicos (cuadrícula de 3 × 3), 10 en tablas del panel.

### 2.8 Alertas y notificaciones

**Alerta en línea** — dentro del contenido, para resultados de una acción o avisos de
contexto. Relleno `space-4`, `radius-md`, borde izquierdo de 4 px en el color semántico.

| Tipo | Fondo | Borde y texto | Icono |
|------|-------|---------------|-------|
| Éxito | `#e7f4f0` | `#3a7d6f` | Palomita en círculo |
| Advertencia | `#fdf4e3` | `#8a5a00` | Triángulo |
| Error | `#fdecea` | `#c0392b` | Círculo con equis |
| Información | `#eef4f8` | `#2b6777` | Círculo con i |

**Toast** — esquina superior derecha, ancho 360 px, `shadow-lg`, `radius-lg`, se retira solo
a los 5 s, con botón de cerrar. Entra deslizando desde la derecha en `duration-base`.
Contenedor con `role="status"` y `aria-live="polite"`.

### 2.9 Modal de confirmación

Obligatorio antes de toda acción destructiva
([RN-M3-07](./MODULES_SPEC.md#42-reglas-de-negocio)).

```
┌─────────────────────────────────────────────┐
│  ⚠  Eliminar publicación                 ✕  │
│                                             │
│  ¿Seguro que deseas eliminar                │
│  "Simposium Inmobiliario 2026"?             │
│                                             │
│  Se eliminarán también sus 12 comentarios.  │
│  Esta acción no se puede deshacer.          │
│                                             │
│                  [ Cancelar ]  [ Eliminar ] │
└─────────────────────────────────────────────┘
```

| Parte | Especificación |
|-------|----------------|
| Fondo oscurecido | `rgba(26,46,53,.5)`, `z-overlay` |
| Caja | Ancho 480 px, blanco, `radius-lg`, `shadow-lg`, relleno `space-6`, `z-modal` |
| Título | `h4`, con icono del color semántico |
| Cuerpo | `body`, `ink-600`. Nombra el elemento concreto y sus consecuencias |
| Acciones | Alineadas a la derecha. Cancelar secundario, confirmar del color de la acción |
| Comportamiento | El foco entra al modal y queda atrapado. `Esc` cancela. Al cerrar, el foco vuelve al botón que lo abrió |

En móvil ocupa el ancho completo menos 16 px de margen y se ancla al fondo de la pantalla.

### 2.10 Tarjeta de noticia

El componente más repetido del sitio: home, listados, categorías, búsqueda.

```
┌──────────────────────────────┐
│                              │
│      IMAGEN DE PORTADA       │   ratio 16:9, object-fit: cover
│                              │
├──────────────────────────────┤
│ EVENTOS                      │   overline, brand-700
│ Simposium Inmobiliario 2026  │   h3, ink-900, máx. 3 líneas
│ 20 may 2026 · Afiliación     │   body-sm, ink-600
│ Por María López              │   body-sm, ink-600
│                              │
│ Resumen de la noticia en dos │   body-sm, ink-600, máx. 3 líneas
│ o tres líneas como máximo... │
│                              │
│ Saber más →                  │   terciario
└──────────────────────────────┘
```

| Aspecto | Especificación |
|---------|----------------|
| Contenedor | Blanco, `radius-lg`, borde `line`, `shadow-sm`, `overflow: hidden` |
| Hover | `shadow-md`, `translateY(-2px)`, `duration-fast`. La imagen escala a 1.03 |
| Imagen | Relación 16:9. Sin portada: fondo `brand-100` con el logo en `brand-500` al 40 % |
| Cuerpo | Relleno `space-5` |
| Recorte | Título a 3 líneas, resumen a 3 líneas, ambos con puntos suspensivos |
| Área de clic | **La tarjeta completa es un enlace.** "Saber más" es refuerzo visual, no el único destino |
| Altura | Uniforme dentro de una misma fila de la cuadrícula |

### 2.11 Slider

Solo en el home. Muestra las cinco publicaciones más recientes
([RN-M2-02](./MODULES_SPEC.md#31-reglas-de-negocio)).

| Aspecto | Especificación |
|---------|----------------|
| Alto | 480 px en `lg`, 360 px en `md`, 280 px en móvil |
| Imagen | Portada a todo el ancho, `object-fit: cover` |
| Degradado | De `rgba(26,46,53,.85)` abajo a transparente arriba, para que el texto se lea |
| Contenido | Alineado abajo a la izquierda, con el ancho máximo del contenedor |
| Texto | Categoría en `overline` blanco, título en `display` blanco, fecha y departamento en `body-sm` `brand-100` |
| Acción | Botón primario "Leer noticia" |
| Autoavance | 6 s por diapositiva. **Se detiene al pasar el cursor y al recibir foco** |
| Controles | Flechas circulares de 48 px semitransparentes a los costados; puntos indicadores abajo al centro |
| Punto activo | `brand-100`, ancho 24 px, `radius-full`. Inactivos: blanco al 50 %, 8 px |
| Accesibilidad | `aria-roledescription="carrusel"`, botón de pausa visible, flechas con `aria-label` |
| Reduced motion | Sin autoavance. Solo navegación manual |

### 2.12 Galería de imágenes

En el detalle de la noticia. Cuadrícula de miniaturas cuadradas.

| Aspecto | Especificación |
|---------|----------------|
| Cuadrícula | 4 columnas en `lg`, 3 en `md`, 2 en móvil. Hueco `space-4` |
| Miniatura | Cuadrada 1:1, `radius-md`, `object-fit: cover` |
| Hover | Escala 1.04 y sombra `shadow-md` |
| Clic | Abre visor a pantalla completa con flechas, contador "3 / 8" y cierre |
| Visor | Fondo `rgba(26,46,53,.95)`. `Esc` cierra, flechas navegan |

### 2.13 Comentario

```
┌─────────────────────────────────────────────┐
│ ◯  Juan Martínez            30 may · 14:22  │
│    Muy buen artículo, gracias por           │
│    compartir la información.                │
└─────────────────────────────────────────────┘
```

| Parte | Especificación |
|-------|----------------|
| Avatar | 40 px, `radius-full`. Sin foto: iniciales sobre `brand-100`, texto `brand-900` |
| Nombre | `body` peso 600 `ink-900` |
| Fecha | `body-sm` `ink-600`, alineada a la derecha |
| Texto | `body` `ink-900`, respeta saltos de línea |
| Separación | `space-5` entre comentarios, borde inferior `line` |
| Propio pendiente | Fondo `warning-50`, borde izquierdo 4 px `warning-700`, badge "Pendiente de aprobación" ([RN-M5-04](./MODULES_SPEC.md#62-reglas-de-negocio)) |

### 2.14 Estado vacío

Patrón único para toda pantalla o listado sin datos.

```
          ┌────────┐
          │  icono │        64 px, ink-400
          └────────┘

     No hay noticias publicadas          h4, ink-900
  Cuando se publique la primera,          body, ink-600
        aparecerá aquí.

       [ Crear publicación ]              primario, si aplica
```

Centrado, con `space-16` de relleno vertical. El texto explica **por qué está vacío**, no
solo que lo está.

### 2.15 Avatar

| Tamaño | Píxeles | Dónde |
|--------|---------|-------|
| `xs` | 24 px | Celda de tabla |
| `sm` | 32 px | Navbar |
| `md` | 40 px | Comentario |
| `lg` | 96 px | Perfil |
| `xl` | 128 px | Edición de perfil |

Siempre `radius-full`, `object-fit: cover`. Sin foto: iniciales en `brand-900` sobre
`brand-100`, peso 600.

### 2.16 Tarjeta de métrica

Solo en el dashboard del panel (§6.1).

```
┌────────────────────────────┐
│ ◷  VISITAS TOTALES         │   overline, ink-600
│                            │
│ 12,847                     │   display, brand-700, tabular-nums
│                            │
│ en 47 publicaciones        │   body-sm, ink-600
└────────────────────────────┘
```

| Aspecto | Especificación |
|---------|----------------|
| Contenedor | Blanco, `radius-lg`, borde `line`, `shadow-sm`, relleno `space-6` |
| Icono | 20 px en `brand-500`, junto al rótulo |
| Cifra | `display` peso 700, cifras tabulares. Separador de miles con coma |
| Clic | Si la métrica lleva a un listado, toda la tarjeta es enlace y toma hover de tarjeta |

---

## 3. Layouts

### 3.1 Layout público

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                     z-sticky    │  64 px
├─────────────────────────────────────────────────────────┤
│                                                         │
│                      CONTENIDO                          │  max-width 1200px
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

#### Navbar público

Alto **64 px**, fondo `brand-700`, texto blanco, fijo al hacer scroll con `shadow-md`.

| Zona | Contenido |
|------|-----------|
| Izquierda | Logo de CANACO, alto 40 px. Enlace al home |
| Centro | Inicio · Noticias · Categorías (desplegable) |
| Derecha | Buscador + bloque de sesión |

**Bloque de sesión según estado:**

| Estado | Contenido |
|--------|-----------|
| No autenticado | "Iniciar sesión" terciario blanco + "Registrarse" secundario con borde blanco |
| Lector | Avatar `sm` + nombre + menú: Mi perfil, Cambiar contraseña, Cerrar sesión |
| Colaborador, Editor, Admin | Igual + entrada "Panel administrativo" al inicio del menú |

**Enlace activo:** subrayado de 2 px en `brand-100`, 4 px bajo el texto.

**Buscador:** campo `radius-full` de 240 px, fondo `rgba(255,255,255,.15)`, texto blanco,
placeholder `brand-100`, icono de lupa a la izquierda. En foco: fondo blanco, texto
`ink-900`, se expande a 320 px. Bajo `md` colapsa a botón de lupa que abre una barra
a pantalla completa.

**Móvil:** logo + lupa + botón de menú de tres líneas. El menú se abre desde la derecha
ocupando el 80 % del ancho, con fondo `brand-700` y fondo oscurecido detrás.

#### Footer

Fondo `ink-900`, texto `brand-100`, relleno `space-16` arriba y abajo. Cuatro columnas en
`lg`, dos en `md`, una en móvil.

| Columna | Contenido |
|---------|-----------|
| 1 | Logo, dirección, teléfono, correo |
| 2 | Páginas: Inicio, Noticias, Iniciar sesión, Registrarse |
| 3 | Categorías: las ocho activas |
| 4 | Redes sociales: iconos de 24 px, hover `accent-500` |

Barra inferior separada por borde `rgba(255,255,255,.1)`:
"© 2026 CANACO SERVYTUR Villahermosa. Todos los derechos reservados." en `body-sm`.

### 3.2 Layout del panel administrativo

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                 │  64 px
├──────────────┬──────────────────────────────────────────┤
│              │  Título de la pantalla        [ Acción ] │
│   SIDEBAR    ├──────────────────────────────────────────┤
│   240 px     │                                          │
│              │              CONTENIDO                   │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

#### Sidebar

Ancho **240 px**, fondo blanco, borde derecho `line`, alto completo, fijo al hacer scroll.

| Parte | Especificación |
|-------|----------------|
| Bloque de usuario | Arriba: avatar `md`, nombre, badge del rol. Relleno `space-5`, borde inferior `line` |
| Entrada de menú | Alto 44 px, relleno `space-4`, icono de 20 px + texto `body`, `radius-md`, margen lateral `space-2` |
| Hover | Fondo `brand-50`, texto `brand-700` |
| Activa | Fondo `brand-100`, texto `brand-900` peso 600, barra izquierda de 3 px en `brand-700` |
| Cerrar sesión | Al fondo, separada por borde superior, texto `danger-700`, hover fondo `danger-50` |

**Entradas según rol** — cada una solo aparece si el rol tiene permiso:

| Entrada | Lector | Colaborador | Editor | Admin |
|---------|:------:|:-----------:|:------:|:-----:|
| Dashboard | — | ✅ | ✅ | ✅ |
| Mi perfil | ✅ | ✅ | ✅ | ✅ |
| Noticias | — | ✅ | ✅ | ✅ |
| Comentarios | — | — | — | ✅ |
| Categorías | — | — | ✅ | ✅ |
| Departamentos | — | — | ✅ | ✅ |
| Usuarios | — | — | — | ✅ |
| Cambiar contraseña | ✅ | ✅ | ✅ | ✅ |

> El Lector no entra al panel: su perfil y su cambio de contraseña se resuelven en el layout
> público. La columna existe para dejar claro qué **no** ve.

**Encabezado de pantalla:** título en `h2`, a la derecha la acción primaria. Debajo, si la
navegación tiene más de un nivel, migas de pan en `body-sm`.

**Móvil:** el sidebar se oculta y se abre desde la izquierda con el botón de menú.

---

## 4. Mapa de navegación

### 4.1 Flujo del visitante

```
                    ┌──────────────┐
                    │  P-01 Home   │
                    └──────┬───────┘
          ┌────────────────┼────────────────┬──────────────┐
          ▼                ▼                ▼              ▼
   ┌─────────────┐  ┌─────────────┐  ┌───────────┐  ┌────────────┐
   │ P-02 Listado│  │P-03 Por cat.│  │P-05 Búsq. │  │ P-06 Login │
   └──────┬──────┘  └──────┬──────┘  └─────┬─────┘  └──────┬─────┘
          └────────────────┼───────────────┘               │
                           ▼                               ▼
                  ┌─────────────────┐              ┌──────────────┐
                  │ P-04 Detalle    │              │P-07 Registro │
                  └────────┬────────┘              └──────┬───────┘
                           │ comentar                     │
                           ▼                              ▼
                  ┌─────────────────┐              ┌──────────────┐
                  │  P-06 Login     │◄─────────────│  P-06 Login  │
                  └─────────────────┘              └──────────────┘
```

### 4.2 Flujo tras iniciar sesión

```
   ┌──────────────┐
   │  P-06 Login  │
   └──────┬───────┘
          │ según rol (HU-M1-02)
    ┌─────┴──────┐
    ▼            ▼
┌────────┐  ┌──────────────────┐
│P-01 Home│  │ A-00 Dashboard   │
│ (Lector)│  │(Colab/Edit/Admin)│
└────────┘  └────────┬─────────┘
                     │
   ┌─────────┬───────┼────────┬──────────┬───────────┐
   ▼         ▼       ▼        ▼          ▼           ▼
┌──────┐ ┌───────┐ ┌──────┐ ┌────────┐ ┌────────┐ ┌────────┐
│A-01  │ │A-04   │ │A-06  │ │A-07    │ │A-09    │ │A-03    │
│Perfil│ │Noticia│ │Coment│ │Categor.│ │Usuarios│ │Contras.│
└──┬───┘ └───┬───┘ └──────┘ └────────┘ └───┬────┘ └────────┘
   │         │                             │
   ▼         ▼                             ▼
┌──────┐ ┌──────────┐              ┌──────────────┐
│A-02  │ │A-05      │              │A-10          │
│Editar│ │Crear/Edit│              │Crear/Editar  │
│perfil│ │publicac. │              │usuario       │
└──────┘ └──────────┘              └──────────────┘
```

### 4.3 Rutas

| ID | Pantalla | Ruta | Acceso |
|----|----------|------|--------|
| P-01 | Home | `/` | Público |
| P-02 | Listado de noticias | `/posts/` | Público |
| P-03 | Noticias por categoría | `/posts/category/<slug>/` | Público |
| P-04 | Detalle de noticia | `/posts/<id>/<slug>/` | Público |
| P-05 | Resultados de búsqueda | `/search/?q=<término>` | Público |
| P-06 | Iniciar sesión | `/accounts/login/` | Anónimo |
| P-07 | Registro | `/accounts/register/` | Anónimo |
| P-08 | Error | — | Público |
| A-00 | Dashboard | `/panel/` | Colaborador+ |
| A-01 | Mi perfil | `/panel/profile/` | Autenticado |
| A-02 | Editar perfil | `/panel/profile/edit/` | Autenticado |
| A-03 | Cambiar contraseña | `/panel/password/` | Autenticado |
| A-04 | Panel de noticias | `/panel/posts/` | Colaborador+ |
| A-05 | Crear / editar publicación | `/panel/posts/new/` · `/panel/posts/<id>/edit/` | Colaborador+ |
| A-06 | Comentarios | `/panel/comments/` | Admin |
| A-07 | Categorías | `/panel/categories/` | Editor+ |
| A-08 | Departamentos | `/panel/departments/` | Editor+ |
| A-09 | Usuarios | `/panel/users/` | Admin |
| A-10 | Crear / editar usuario | `/panel/users/new/` · `/panel/users/<id>/edit/` | Admin |

### 4.4 Redirecciones

| Situación | Destino |
|-----------|---------|
| Visitante entra a una ruta del panel | P-06 con `?next=` de la ruta original |
| Rol sin permiso entra a una ruta del panel | P-08 con error 403 |
| Autenticado entra a P-06 o P-07 | P-01 |
| Login exitoso con `?next=` | La ruta solicitada |
| Login exitoso sin `?next=`, rol Lector | P-01 |
| Login exitoso sin `?next=`, rol Colaborador o superior | A-00 |
| Cerrar sesión | P-01 con toast de despedida |
| Publicación inexistente o en borrador | P-08 con error 404 |

---

## 5. Pantallas públicas

### 5.1 P-01 · Home

**Ruta:** `/` · **Acceso:** público · **Casos de uso:** [HU-M2-01](./MODULES_SPEC.md#hu-m2-01--ver-la-página-de-inicio)

#### Estructura

```
┌───────────────────────────────────────────────────┐
│ NAVBAR                                            │
├───────────────────────────────────────────────────┤
│                                                   │
│                   SLIDER                          │  480px
│   [categoría] Título grande                       │
│   fecha · departamento      [ Leer noticia ]      │
│                          ● ● ○ ○ ○                │
├───────────────────────────────────────────────────┤
│  Últimas noticias                                 │  h2
│  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ tarjeta │  │ tarjeta │  │ tarjeta │            │  3 columnas
│  └─────────┘  └─────────┘  └─────────┘            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ tarjeta │  │ tarjeta │  │ tarjeta │            │
│  └─────────┘  └─────────┘  └─────────┘            │
│                                                   │
│            [ Ver todas las noticias ]             │
├───────────────────────────────────────────────────┤
│  Explora por categoría                            │
│  [Eventos] [Política] [Deportes] [Tecnología] ... │  chips
├───────────────────────────────────────────────────┤
│         12,847 visitas en 47 publicaciones        │  franja brand-50
├───────────────────────────────────────────────────┤
│ FOOTER                                            │
└───────────────────────────────────────────────────┘
```

#### Componentes

| # | Componente | Datos | Detalle |
|---|-----------|-------|---------|
| 1 | Slider (§2.11) | 5 publicaciones más recientes | Orden `publishedat DESC` |
| 2 | Encabezado de sección | "Últimas noticias" | `h2`, `space-16` de margen superior |
| 3 | Cuadrícula de tarjetas (§2.10) | 6 publicaciones siguientes a las del slider | 3 col `lg` · 2 col `md` · 1 col móvil. Hueco `space-6` |
| 4 | Botón "Ver todas las noticias" | → P-02 | Primario `lg`, centrado |
| 5 | Chips de categoría | Las 8 categorías | Fondo `brand-50`, texto `brand-900`, `radius-full`, alto 36 px. Hover: fondo `brand-100`. → P-03 |
| 6 | Franja de visitas | Suma de `visitas` + total de publicaciones | Fondo `brand-50`, alto 80 px, texto centrado `h4` `brand-900`, cifras tabulares |

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Sin publicaciones** | Sin slider. Estado vacío (§2.14): "Aún no hay noticias publicadas · Cuando se publique la primera, aparecerá aquí." Los chips y la franja se ocultan |
| **1 a 4 publicaciones** | El slider muestra las que haya. No se dibujan diapositivas vacías. La cuadrícula puede quedar vacía |
| **5 a 10 publicaciones** | Slider con 5, cuadrícula con las restantes |
| **Carga** | Bloque gris animado del alto del slider + 6 tarjetas fantasma |
| **Sin portada** | Fondo `brand-100` con el logo en `brand-500` al 40 % |

#### Responsive

| Breakpoint | Slider | Cuadrícula | Chips |
|------------|--------|-----------|-------|
| `lg` ≥ 1024 | 480 px, flechas visibles | 3 columnas | En una línea |
| `md` 768–1023 | 360 px, flechas visibles | 2 columnas | En una línea, con salto |
| `base` < 768 | 280 px, sin flechas, solo deslizar | 1 columna | Fila deslizable horizontal |

---

### 5.2 P-02 · Listado de noticias

**Ruta:** `/posts/` · **Acceso:** público · **Casos de uso:** [HU-M2-03](./MODULES_SPEC.md#hu-m2-03--listar-noticias-y-filtrar-por-categoría)

#### Estructura

```
┌───────────────────────────────────────────────────┐
│ NAVBAR                                            │
├───────────────────────────────────────────────────┤
│  Noticias                                         │  h2
│  Todas las publicaciones de CANACO Villahermosa   │  body, ink-600
│                                                   │
│  [Todas] [Eventos] [Política] [Deportes] ...      │  filtro de categoría
│                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ tarjeta │  │ tarjeta │  │ tarjeta │            │  3 × 3 = 9
│  └─────────┘  └─────────┘  └─────────┘            │
│         ... 9 tarjetas en total ...               │
│                                                   │
│  Mostrando 1–9 de 47    ← 1 [2] 3 4 5 →           │
├───────────────────────────────────────────────────┤
│ FOOTER                                            │
└───────────────────────────────────────────────────┘
```

#### Componentes

| # | Componente | Detalle |
|---|-----------|---------|
| 1 | Encabezado de página | Título `h2` + descripción `body` `ink-600`. Margen inferior `space-8` |
| 2 | Filtro de categoría | Chips. "Todas" activo por defecto: fondo `brand-700`, texto blanco. Al elegir una, navega a P-03 |
| 3 | Cuadrícula | 9 tarjetas, 3 × 3 en `lg` |
| 4 | Paginación (§2.7) | 9 por página |

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Con resultados** | Cuadrícula paginada, orden `publishedat DESC` |
| **Sin publicaciones** | Estado vacío: "Aún no hay noticias publicadas" |
| **Última página incompleta** | Las tarjetas se alinean a la izquierda. Sin huecos fantasma |
| **Carga** | 9 tarjetas fantasma |

---

### 5.3 P-03 · Noticias por categoría

**Ruta:** `/posts/category/<slug>/` · **Acceso:** público

Idéntica a P-02 salvo:

| Diferencia | Detalle |
|------------|---------|
| Encabezado | "Categoría: Eventos" en `h2`. Debajo: "12 noticias en esta categoría" en `body` `ink-600` |
| Migas de pan | Inicio › Noticias › Eventos, en `body-sm`. Último elemento sin enlace |
| Filtro | El chip de la categoría actual aparece activo |
| Estado vacío | "No hay noticias en esta categoría · Prueba con otra categoría o vuelve al listado completo" + botón secundario "Ver todas las noticias" |
| Categoría inexistente | P-08 con error 404 |

---

### 5.4 P-04 · Detalle de noticia

**Ruta:** `/posts/<id>/<slug>/` · **Acceso:** público · **Casos de uso:** [HU-M2-02](./MODULES_SPEC.md#hu-m2-02--ver-el-detalle-de-una-noticia), [HU-M5-01](./MODULES_SPEC.md#hu-m5-01--crear-un-comentario)

La pantalla más compleja del sitio.

#### Estructura

```
┌───────────────────────────────────────────────────────────┐
│ NAVBAR                                                    │
├───────────────────────────────────────────────────────────┤
│ Inicio › Noticias › Eventos › Simposium Inmobiliario      │  migas
│                                                           │
│ ┌───────────────────────────────────┐ ┌─────────────────┐ │
│ │ EVENTOS                           │ │ NOTICIAS        │ │
│ │ Simposium Inmobiliario 2026       │ │ RELACIONADAS    │ │
│ │                                   │ │ ┌─────────────┐ │ │
│ │ 20 may 2026 · Afiliación          │ │ │ ▣ título    │ │ │
│ │ Por María López · 👁 1,234        │ │ │   fecha     │ │ │
│ │                                   │ │ └─────────────┘ │ │
│ │ ┌───────────────────────────────┐ │ │   × 5           │ │
│ │ │    IMAGEN DE PORTADA          │ │ │                 │ │
│ │ └───────────────────────────────┘ │ │ CATEGORÍAS      │ │
│ │                                   │ │ Eventos     12  │ │
│ │ Resumen destacado de la noticia   │ │ Política     8  │ │
│ │                                   │ │ ...             │ │
│ │ Contenido completo de la noticia  │ └─────────────────┘ │
│ │ en párrafos...                    │                     │
│ │                                   │                     │
│ │ GALERÍA                           │                     │
│ │ ▣ ▣ ▣ ▣                           │                     │
│ │ ▣ ▣ ▣ ▣                           │                     │
│ │                                   │                     │
│ │ ─────────────────────────────     │                     │
│ │ Comentarios (3)                   │                     │
│ │ ◯ Juan Martínez       30 may      │                     │
│ │   Muy buen artículo...            │                     │
│ │ ◯ Laura Pérez         29 may      │                     │
│ │   ...                             │                     │
│ │                                   │                     │
│ │ ┌───────────────────────────────┐ │                     │
│ │ │ Escribe tu comentario...      │ │                     │
│ │ └───────────────────────────────┘ │                     │
│ │              [ Publicar comentario]│                     │
│ └───────────────────────────────────┘                     │
├───────────────────────────────────────────────────────────┤
│ FOOTER                                                    │
└───────────────────────────────────────────────────────────┘
```

**Cuadrícula:** 8 columnas de contenido + 4 de barra lateral en `lg`. En `md` y móvil, la
barra lateral pasa debajo del contenido.

#### Componentes del contenido principal

| # | Componente | Especificación |
|---|-----------|----------------|
| 1 | Migas de pan | `body-sm` `ink-600`, separador `›`. El último sin enlace, recortado a 40 caracteres |
| 2 | Categoría | `overline` `brand-700`. Enlaza a P-03 |
| 3 | Título | `h1` `ink-900`, `max-width: 20ch` en pantallas grandes para evitar líneas larguísimas |
| 4 | Barra de metadatos | Fecha · departamento · autor con avatar `xs` · visitas con icono de ojo. `body-sm` `ink-600`, separados por `·` |
| 5 | Imagen de portada | Ancho completo del contenido, `radius-lg`, relación 16:9 |
| 6 | Resumen | `body-lg` peso 500 `ink-900`, borde izquierdo 4 px `brand-100`, relleno izquierdo `space-5` |
| 7 | Contenido | HTML del editor. `body-lg`, `max-width: 68ch`. Estilos definidos abajo |
| 8 | Galería (§2.12) | Encabezado "Galería" en `h4`. Solo si hay imágenes |
| 9 | Sección de comentarios | Encabezado "Comentarios (N)" en `h4`, precedido de separador |
| 10 | Lista de comentarios (§2.13) | Solo estado `aprobado`, más el propio pendiente del usuario |
| 11 | Formulario de comentario | Ver estados abajo |

#### Estilos del contenido enriquecido

| Elemento | Estilo |
|----------|--------|
| `p` | `body-lg`, margen inferior `space-5` |
| `h2`, `h3` | Familia display, margen superior `space-8`, inferior `space-4` |
| `a` | `brand-700`, subrayado con `text-underline-offset: 3px`. Hover `brand-900` |
| `ul`, `ol` | Sangría `space-6`, hueco `space-2` entre elementos |
| `strong` | Peso 600 |
| `blockquote` | Borde izquierdo 4 px `accent-500`, relleno izquierdo `space-5`, cursiva, `ink-600` |
| `img` | Ancho completo, `radius-md`, margen vertical `space-6` |

#### Formulario de comentario según estado de sesión

| Estado | Contenido |
|--------|-----------|
| **No autenticado** | Caja con fondo `brand-50`, `radius-lg`, relleno `space-6`, centrada: "Inicia sesión para comentar esta noticia" en `body` + botón primario "Iniciar sesión" + enlace terciario "Crear una cuenta" |
| **Autenticado** | Avatar `md` + textarea de 96 px con placeholder "Escribe tu comentario..." + botón primario "Publicar comentario" alineado a la derecha, deshabilitado mientras el campo esté vacío |
| **Enviando** | Botón en estado loading, textarea en readonly |
| **Enviado** | El textarea se limpia. Alerta de éxito en línea: "Tu comentario será visible cuando lo apruebe un administrador". El comentario aparece arriba con el estilo de pendiente |
| **Error** | Textarea en estado error + mensaje "El comentario no puede estar vacío" |

#### Barra lateral

| # | Bloque | Especificación |
|---|--------|----------------|
| 1 | Noticias relacionadas | Encabezado `overline` `ink-600`. Hasta 5 elementos: miniatura de 64 × 64 px `radius-md` + título a 2 líneas `body-sm` peso 600 + fecha `caption` `ink-600`. Separación `space-4` |
| 2 | Categorías | Lista de las 8, con el conteo de publicaciones a la derecha en `caption` sobre `brand-50` `radius-full`. Hover: fondo `brand-50` en toda la fila |

La barra lateral es `position: sticky` con `top: 88px` en `lg`.

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Sin galería** | La sección completa no se renderiza |
| **Sin comentarios aprobados** | "Comentarios (0)" + estado vacío compacto: "Sé el primero en comentar" |
| **Sin portada** | Se omite el bloque de imagen. El contenido sube |
| **Sin relacionadas de la misma categoría** | Se completa con las más recientes. El encabezado cambia a "Noticias recientes" |
| **Borrador o inexistente** | P-08 con error 404 |
| **Comentario propio pendiente** | Aparece al inicio de la lista con el estilo de §2.13 |

#### Responsive

| Breakpoint | Comportamiento |
|------------|----------------|
| `lg` | 8 + 4 columnas, barra lateral pegajosa |
| `md` | Una columna. La barra lateral pasa debajo de los comentarios |
| `base` | Una columna. Título a `h2`. Galería a 2 columnas. Migas recortadas a "‹ Volver a Eventos" |

---

### 5.5 P-05 · Resultados de búsqueda

**Ruta:** `/search/?q=<término>` · **Acceso:** público · **Casos de uso:** [HU-M2-04](./MODULES_SPEC.md#hu-m2-04--buscar-noticias)

#### Estructura

```
┌───────────────────────────────────────────────────┐
│ NAVBAR (con el término en el buscador)            │
├───────────────────────────────────────────────────┤
│  Resultados para "simposium"                      │  h2
│  4 noticias encontradas                           │  body, ink-600
│                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ tarjeta │  │ tarjeta │  │ tarjeta │            │
│  └─────────┘  └─────────┘  └─────────┘            │
│                                                   │
│  ← 1 [2] →                                        │
├───────────────────────────────────────────────────┤
│ FOOTER                                            │
└───────────────────────────────────────────────────┘
```

#### Detalles

| Aspecto | Especificación |
|---------|----------------|
| Término | Entre comillas dentro del título, en peso 700 |
| Conteo | "4 noticias encontradas" · en singular: "1 noticia encontrada" |
| Resaltado | El término se marca en el título y el resumen de cada tarjeta con fondo `warning-50` |
| Buscador del navbar | Conserva el término escrito |

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Con resultados** | Cuadrícula paginada de 9 |
| **Sin resultados** | Estado vacío con icono de lupa: "No se encontraron noticias para «simposium» · Revisa la ortografía o prueba con otras palabras" + botón secundario "Ver todas las noticias" |
| **Término vacío** | Redirige a P-02 |
| **Término de 1 carácter** | Mensaje de advertencia: "Escribe al menos 2 caracteres para buscar" |

---

### 5.6 P-06 · Iniciar sesión

**Ruta:** `/accounts/login/` · **Acceso:** anónimo · **Casos de uso:** [HU-M1-02](./MODULES_SPEC.md#hu-m1-02--iniciar-sesión)

#### Estructura

```
┌───────────────────────────────────────────────────┐
│ NAVBAR                                            │
├───────────────────────────────────────────────────┤
│                                                   │
│            ┌───────────────────────┐              │
│            │        [logo]         │              │
│            │    Iniciar sesión     │  h2          │
│            │  Accede a tu cuenta   │  body-sm     │
│            │                       │              │
│            │ Usuario o correo *    │              │
│            │ ┌───────────────────┐ │              │
│            │ └───────────────────┘ │              │
│            │                       │              │
│            │ Contraseña *          │              │
│            │ ┌─────────────────┬─┐ │              │
│            │ └─────────────────┴─┘ │  ojo         │
│            │                       │              │
│            │ [    Ingresar       ] │  primario lg │
│            │                       │              │
│            │ ¿No tienes cuenta?    │              │
│            │      Regístrate       │              │
│            └───────────────────────┘              │
│                                                   │
├───────────────────────────────────────────────────┤
│ FOOTER                                            │
└───────────────────────────────────────────────────┘
```

**Contenedor:** ancho 420 px, centrado vertical y horizontalmente, fondo blanco,
`radius-lg`, `shadow-md`, relleno `space-8`. Fondo de página `surface-alt`.

#### Campos

| Campo | Tipo | Obligatorio | Validación | Mensaje de error |
|-------|------|:-----------:|-----------|------------------|
| Usuario o correo | Texto | Sí | No vacío | "Ingresa tu usuario o correo" |
| Contraseña | Password | Sí | No vacío | "Ingresa tu contraseña" |

**Botón:** "Ingresar", primario `lg`, ancho completo.

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Inicial** | Foco automático en el primer campo |
| **Enviando** | Botón en loading, campos en readonly |
| **Credenciales incorrectas** | Alerta de error sobre el formulario: "Usuario o contraseña incorrectos". **Ambos campos en estado error, sin decir cuál falló.** Se conserva el usuario, se limpia la contraseña |
| **Cuenta bloqueada** | Alerta de error: "Tu cuenta está desactivada. Contacta al administrador" |
| **Con `?next=`** | Alerta informativa sobre el formulario: "Inicia sesión para continuar" |

---

### 5.7 P-07 · Registro

**Ruta:** `/accounts/register/` · **Acceso:** anónimo · **Casos de uso:** [HU-M1-01](./MODULES_SPEC.md#hu-m1-01--registrar-una-cuenta)

Mismo contenedor que P-06, con ancho **480 px**.

#### Campos

| Campo | Tipo | Obligatorio | Validación | Mensaje de error |
|-------|------|:-----------:|-----------|------------------|
| Nombre de usuario | Texto | Sí | 3–150 caracteres, letras, números, `@ . + - _`. Único | "Ese nombre de usuario ya está en uso" |
| Correo electrónico | Correo | Sí | Formato válido. Único | "Ese correo electrónico ya está registrado" |
| Contraseña | Password | Sí | Mínimo 8 caracteres, no solo numérica, no común, distinta del usuario | El texto de la regla incumplida |
| Confirmar contraseña | Password | Sí | Igual a la anterior | "Las contraseñas no coinciden" |

**Botón:** "Registrarse", primario `lg`, ancho completo.

#### Elementos de apoyo

| Elemento | Especificación |
|----------|----------------|
| Ayuda bajo la contraseña | Lista de requisitos en `body-sm` `ink-600`. Cada requisito cumplido pasa a `success-700` con palomita, en tiempo real |
| Medidor de fuerza | Barra de 4 px bajo el campo: débil `danger-700`, media `warning-700`, fuerte `success-700` |
| Pie | "¿Ya tienes cuenta? **Inicia sesión**" |

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Validación en vivo** | Usuario y correo se validan al salir del campo (`blur`) |
| **Enviando** | Botón en loading |
| **Éxito** | Redirige a P-06 con toast de éxito: "Cuenta creada. Ya puedes iniciar sesión" |
| **Error de campo** | El campo entra en estado error con su mensaje. Se conservan todos los demás valores |
| **Error general** | Alerta de error sobre el formulario |

---

### 5.8 P-08 · Errores

**Acceso:** público

Una sola plantilla parametrizada. Contenedor centrado de 520 px, fondo `surface-alt`.

| Código | Ilustración | Título | Mensaje | Acciones |
|--------|-------------|--------|---------|----------|
| **404** | Icono de documento con lupa, 96 px `ink-400` | "Página no encontrada" | "La noticia que buscas no existe o fue retirada." | "Volver al inicio" primario · "Ver todas las noticias" secundario |
| **403** | Icono de candado, 96 px `ink-400` | "No tienes permiso" | "Tu cuenta no tiene acceso a esta sección." | "Volver al inicio" primario · "Ir a mi panel" secundario si está autenticado |
| **500** | Icono de advertencia, 96 px `danger-700` | "Algo salió mal" | "Ocurrió un error inesperado. Intenta de nuevo en unos minutos." | "Volver al inicio" primario |

El código del error se muestra en `display` `brand-100` detrás del icono, como marca de agua.

---

## 6. Pantallas del panel administrativo

### 6.1 A-00 · Dashboard

**Ruta:** `/panel/` · **Acceso:** Colaborador, Editor, Administrador

Pantalla nueva, no presente en las maquetas originales. Es la primera que ve el equipo
editorial al entrar.

#### Estructura

```
┌──────────────┬────────────────────────────────────────────┐
│              │  Panel                    [ Crear noticia ]│
│   SIDEBAR    ├────────────────────────────────────────────┤
│              │ ┌────────┐┌────────┐┌────────┐┌────────┐   │
│              │ │Publica-││Borrado-││Comenta-││Visitas │   │
│              │ │das  47 ││res   12││rios   3││ 12,847 │   │
│              │ └────────┘└────────┘└────────┘└────────┘   │
│              │                                            │
│              │ ┌──────────────────────┐┌────────────────┐ │
│              │ │ Noticias más vistas  ││ Actividad      │ │
│              │ │ 1. Simposium   1,234 ││ reciente       │ │
│              │ │ 2. Rodada        987 ││ · Ana publicó  │ │
│              │ │ 3. Consume       456 ││ · Juan comentó │ │
│              │ │ 4. ...               ││ · ...          │ │
│              │ │ 5. ...               ││                │ │
│              │ └──────────────────────┘└────────────────┘ │
│              │                                            │
│              │ ┌──────────────────────────────────────┐   │
│              │ │ Publicaciones por categoría          │   │
│              │ │ Eventos      ████████████████  12    │   │
│              │ │ Política     ██████████         8    │   │
│              │ │ Deportes     ███████            6    │   │
│              │ └──────────────────────────────────────┘   │
└──────────────┴────────────────────────────────────────────┘
```

#### Componentes

| # | Componente | Contenido | Visible para |
|---|-----------|-----------|--------------|
| 1 | Tarjeta de métrica (§2.16) | **Publicadas** — conteo de estado `publicado`. Enlaza a A-04 filtrado | Todos |
| 2 | Tarjeta de métrica | **Borradores** — conteo de estado `borrador`. Enlaza a A-04 filtrado | Todos |
| 3 | Tarjeta de métrica | **Comentarios pendientes** — conteo de estado `pendiente`. Enlaza a A-06. **Si es mayor que cero, la cifra va en `warning-700`** | Solo Admin |
| 4 | Tarjeta de métrica | **Visitas totales** — suma de `visitas` + "en N publicaciones" | Todos |
| 5 | Lista de más vistas | Top 5 por `visitas`: posición, título a 1 línea, cifra a la derecha. Cada fila enlaza al detalle público | Todos |
| 6 | Actividad reciente | Últimas 8 acciones: publicaciones creadas o publicadas y comentarios recibidos. Avatar `xs` + texto + tiempo relativo ("hace 2 h") | Todos |
| 7 | Barras por categoría | Barra horizontal por categoría. Relleno `brand-500`, fondo de pista `surface-alt`, alto 12 px, `radius-full`. Etiqueta a la izquierda, cifra a la derecha | Todos |

> **Sobre gráficas.** El único dato cuantitativo del sistema es `visitas`, un contador
> acumulado **sin registro por evento** ([DATA_MODEL RN-M8-02](./DATA_MODEL.md#35-galeria_publicacion)).
> Por eso **no hay series de tiempo**: no se puede dibujar "visitas por día" porque el dato
> no existe. Las barras por categoría son conteos, no una gráfica temporal, y se resuelven
> con CSS puro — **no hace falta ninguna librería de charts**.

#### Cuadrícula

| Breakpoint | Métricas | Bloques inferiores |
|------------|----------|--------------------|
| `lg` | 4 columnas | 2 columnas (7+5) + barras a todo el ancho |
| `md` | 2 columnas | 1 columna |
| `base` | 1 columna | 1 columna |

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Sistema vacío** | Las métricas muestran 0. Los bloques de listas muestran estado vacío compacto. Se destaca el botón "Crear noticia" |
| **Colaborador** | Sin tarjeta de comentarios pendientes. Las métricas de publicaciones cuentan **solo las propias** |
| **Carga** | Tarjetas y bloques en estado fantasma |

---

### 6.2 A-01 · Mi perfil

**Ruta:** `/panel/profile/` · **Acceso:** autenticado · **Casos de uso:** [HU-M1-04](./MODULES_SPEC.md#hu-m1-04--ver-y-editar-el-perfil-propio)

#### Estructura

```
┌──────────────┬────────────────────────────────────────────┐
│   SIDEBAR    │  Mi perfil                                 │
│              ├────────────────────────────────────────────┤
│              │  ┌──────────────────────────────────────┐  │
│              │  │              ◯                       │  │  avatar lg
│              │  │         María López                  │  │  h3
│              │  │         Editor                       │  │  badge
│              │  │                                      │  │
│              │  │  Nombre        María                 │  │
│              │  │  Apellido pat. López                 │  │
│              │  │  Apellido mat. Hernández             │  │
│              │  │  Usuario       mlopez                │  │
│              │  │  Correo        maria@canaco.mx       │  │
│              │  │  Miembro desde 12 mar 2026           │  │
│              │  │                                      │  │
│              │  │           [ Editar perfil ]          │  │
│              │  └──────────────────────────────────────┘  │
└──────────────┴────────────────────────────────────────────┘
```

**Tarjeta:** ancho máximo 640 px, blanca, `radius-lg`, `shadow-sm`, relleno `space-8`.

#### Detalles

| Elemento | Especificación |
|----------|----------------|
| Avatar | `lg` 96 px, centrado. Sin foto: iniciales |
| Nombre | `h3` centrado. Si no hay nombre ni apellidos, muestra el nombre de usuario |
| Badge de rol | Bajo el nombre, fondo `brand-50`, texto `brand-900` |
| Lista de datos | Dos columnas: etiqueta `body-sm` peso 600 `ink-600` a la izquierda, valor `body` `ink-900` a la derecha. Separación `space-4`, borde inferior `line` entre filas |
| Campo vacío | Muestra "—" en `ink-400` |
| Botón | "Editar perfil", primario, centrado |

---

### 6.3 A-02 · Editar perfil

**Ruta:** `/panel/profile/edit/` · **Acceso:** autenticado

#### Campos

| Campo | Tipo | Obligatorio | Validación |
|-------|------|:-----------:|-----------|
| Foto de perfil | Archivo simple (§2.3) | No | JPEG, PNG o WebP, máximo 5 MB |
| Nombre | Texto | No | Máximo 150 caracteres |
| Apellido paterno | Texto | No | Máximo 80 caracteres |
| Apellido materno | Texto | No | Máximo 80 caracteres |
| Correo electrónico | Correo | Sí | Formato válido, único |

**Campos de solo lectura:** nombre de usuario y rol, en estado readonly con texto de ayuda
"El nombre de usuario no se puede modificar".

#### Disposición

Foto de perfil arriba, centrada, con avatar `xl` 128 px y botón secundario "Cambiar foto"
debajo. Luego los campos en dos columnas en `lg` (nombre + paterno, materno + correo), una
columna en móvil.

**Acciones:** al pie, alineadas a la derecha: "Cancelar" secundario · "Guardar cambios"
primario.

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Sin cambios** | "Guardar cambios" deshabilitado |
| **Con cambios** | Botón habilitado. Al intentar salir, confirmación: "Tienes cambios sin guardar" |
| **Guardando** | Botón en loading |
| **Éxito** | Redirige a A-01 con toast: "Perfil actualizado" |
| **Error de archivo** | El campo entra en error con el motivo: tipo o tamaño |

---

### 6.4 A-03 · Cambiar contraseña

**Ruta:** `/panel/password/` · **Acceso:** autenticado · **Casos de uso:** [HU-M1-05](./MODULES_SPEC.md#hu-m1-05--cambiar-la-contraseña-propia)

**Contenedor:** tarjeta de 480 px, alineada a la izquierda del área de contenido.

#### Campos

| Campo | Tipo | Obligatorio | Validación | Mensaje de error |
|-------|------|:-----------:|-----------|------------------|
| Contraseña actual | Password | Sí | Debe coincidir con la almacenada | "La contraseña actual es incorrecta" |
| Nueva contraseña | Password | Sí | Mínimo 8 caracteres, no solo numérica, no común | El texto de la regla incumplida |
| Confirmar nueva contraseña | Password | Sí | Igual a la anterior | "Las contraseñas no coinciden" |

Los tres campos con botón de ojo. Bajo el segundo, la lista de requisitos y el medidor de
fuerza de P-07.

**Botón:** "Actualizar contraseña", primario, ancho completo.

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Éxito** | Los tres campos se limpian. Toast de éxito: "Contraseña actualizada". **La sesión se mantiene** |
| **Actual incorrecta** | Solo ese campo en error. Los otros dos conservan su valor |
| **No coinciden** | El tercer campo en error |

---

### 6.5 A-04 · Panel de noticias

**Ruta:** `/panel/posts/` · **Acceso:** Colaborador, Editor, Administrador · **Casos de uso:** [HU-M3-01](./MODULES_SPEC.md#hu-m3-01--ver-el-panel-de-noticias)

#### Estructura

```
┌──────────────┬──────────────────────────────────────────────────────┐
│   SIDEBAR    │  Noticias                        [ Crear publicación]│
│              ├──────────────────────────────────────────────────────┤
│              │ [Buscar...]  [Estado ▾] [Categoría ▾] [Depto ▾]      │
│              │ ┌──────────────────────────────────────────────────┐ │
│              │ │Título    │Autor │Creación│Actualiz│Visitas│Estado││ │
│              │ ├──────────────────────────────────────────────────┤ │
│              │ │Simposium │M.Lópe│20 may  │22 may  │ 1,234 │[Pub] ││ │
│              │ │          │      │        │        │       │ 👁✎🗑 ││ │
│              │ ├──────────────────────────────────────────────────┤ │
│              │ │Rodada    │C.Pére│18 may  │18 may  │   987 │[Bor] ││ │
│              │ └──────────────────────────────────────────────────┘ │
│              │  Mostrando 1–10 de 47        ← 1 [2] 3 4 5 →         │
└──────────────┴──────────────────────────────────────────────────────┘
```

#### Columnas

| Columna | Contenido | Ancho | Orden |
|---------|-----------|-------|:-----:|
| Título | Miniatura de portada 40 × 40 px `radius-sm` + título a 2 líneas peso 600. Enlaza a la edición | Flexible | ✅ |
| Autor | Avatar `xs` + nombre | 160 px | ✅ |
| Fecha de creación | `dd mmm yyyy` | 120 px | ✅ |
| Fecha de actualización | `dd mmm yyyy` | 120 px | ✅ |
| Visitas | Número, alineado a la derecha, tabular | 90 px | ✅ |
| Estado | Badge (§2.5) | 110 px | ✅ |
| Acciones | Ver, Editar, Eliminar | 140 px | — |

**Orden por defecto:** fecha de actualización descendente.

#### Filtros

| Filtro | Opciones | Comportamiento |
|--------|----------|----------------|
| Búsqueda | Texto libre sobre el título | Aplica al escribir, con 300 ms de espera |
| Estado | Todos · Publicado · Borrador | Select |
| Categoría | Todas + las 8 | Select |
| Departamento | Todos + los existentes | Select |

Los filtros van en una barra sobre la tabla, hueco `space-3`, con un botón terciario
"Limpiar filtros" visible solo si hay alguno activo.

#### Acciones por fila

| Acción | Icono | Variante | Destino o efecto | Quién |
|--------|-------|----------|------------------|-------|
| Ver | Ojo | Terciario | Abre el detalle público en pestaña nueva. **No suma visita** ([RN-M8-03](./MODULES_SPEC.md#91-reglas-de-negocio)) | Todos |
| Editar | Lápiz | Terciario | A-05 | Según RN-M3-03 |
| Publicar / Despublicar | Flecha arriba / abajo | Terciario | Cambio de estado en línea con confirmación | Editor, Admin |
| Eliminar | Bote | Peligro | Modal de confirmación (§2.9) | Editor, Admin |

#### Estados por rol

| Rol | Qué ve |
|-----|--------|
| **Colaborador** | Solo sus publicaciones. Sin columna de autor. Sin acciones de eliminar ni publicar. Editar solo si está en borrador |
| **Editor y Admin** | Todas las publicaciones y todas las acciones |

#### Estados de la pantalla

| Estado | Comportamiento |
|--------|----------------|
| **Sin publicaciones** | Estado vacío: "Aún no hay publicaciones · Crea la primera noticia para que aparezca en el sitio" + botón "Crear publicación" |
| **Filtros sin resultados** | "No hay publicaciones con estos filtros" + botón terciario "Limpiar filtros" |
| **Carga** | Tres filas fantasma |

#### Responsive

Bajo `md` la tabla se convierte en tarjetas apiladas: portada a la izquierda, título y
metadatos a la derecha, badge arriba a la derecha, acciones en una fila al pie.

---

### 6.6 A-05 · Crear y editar publicación

**Rutas:** `/panel/posts/new/` · `/panel/posts/<id>/edit/` · **Acceso:** Colaborador, Editor, Administrador
**Casos de uso:** [HU-M3-02](./MODULES_SPEC.md#hu-m3-02--crear-una-publicación), [HU-M3-03](./MODULES_SPEC.md#hu-m3-03--editar-una-publicación)

La pantalla más densa del panel.

#### Estructura

```
┌──────────────┬──────────────────────────────────────────────────────┐
│   SIDEBAR    │  Crear publicación                                   │
│              ├──────────────────────────────────────────────────────┤
│              │ ┌──────────────────────────┐ ┌────────────────────┐  │
│              │ │ Título *                 │ │ PUBLICACIÓN        │  │
│              │ │ ┌──────────────────────┐ │ │ Estado *           │  │
│              │ │ └──────────────────────┘ │ │ [Borrador      ▾]  │  │
│              │ │                          │ │                    │  │
│              │ │ Resumen *                │ │ Categoría *        │  │
│              │ │ ┌──────────────────────┐ │ │ [Selecciona    ▾]  │  │
│              │ │ │                      │ │ │                    │  │
│              │ │ └──────────────────────┘ │ │ Departamento *     │  │
│              │ │                          │ │ [Selecciona    ▾]  │  │
│              │ │ Contenido *              │ │                    │  │
│              │ │ ┌──────────────────────┐ │ │ Autor              │  │
│              │ │ │ B I U 🔗 ≡ ≔ ✕       │ │ │ María López        │  │
│              │ │ ├──────────────────────┤ │ └────────────────────┘  │
│              │ │ │                      │ │ ┌────────────────────┐  │
│              │ │ │  contenido...        │ │ │ IMAGEN DE PORTADA  │  │
│              │ │ │                      │ │ │ ┌────────────────┐ │  │
│              │ │ └──────────────────────┘ │ │ │  vista previa  │ │  │
│              │ │                          │ │ └────────────────┘ │  │
│              │ │ Galería                  │ │ [Cambiar] [Quitar] │  │
│              │ │ ▣ ▣ ▣ [+]                │ └────────────────────┘  │
│              │ └──────────────────────────┘                         │
│              ├──────────────────────────────────────────────────────┤
│              │          [ Cancelar ]  [ Guardar borrador ]  [Publicar]│
└──────────────┴──────────────────────────────────────────────────────┘
```

**Cuadrícula:** 8 columnas de formulario + 4 de barra lateral en `lg`. Una columna bajo `lg`,
con la barra lateral **arriba** del contenido para que el estado se decida primero.

#### Campos

| Campo | Tipo | Obligatorio para publicar | Validación | Ubicación |
|-------|------|:------------------------:|-----------|-----------|
| Título | Texto | Sí | 1–180 caracteres | Principal |
| Resumen | Textarea | Sí | 1–300 caracteres recomendados | Principal |
| Contenido | Editor (§2.4) | Sí | No vacío | Principal |
| Galería | Archivo múltiple (§2.3) | No | Cada archivo: JPEG, PNG o WebP, máximo 5 MB | Principal |
| Estado | Select | — | `borrador` o `publicado` | Lateral |
| Categoría | Select | Sí | Debe existir | Lateral |
| Departamento | Select | Sí | Debe existir | Lateral |
| Imagen de portada | Archivo simple | No | JPEG, PNG o WebP, máximo 5 MB | Lateral |
| Autor | Solo lectura | — | Se asigna solo, no se edita ([RN-M3-05](./MODULES_SPEC.md#42-reglas-de-negocio)) | Lateral |

**Contadores de caracteres:** bajo título y resumen, en `body-sm` `ink-600`: "84 / 180".
Pasa a `warning-700` al 90 % y a `danger-700` al superar el límite.

#### Barra de acciones

Fija al pie del área de contenido, fondo blanco, borde superior `line`, `shadow-md` hacia
arriba, relleno `space-4`.

| Botón | Variante | Comportamiento | Quién |
|-------|----------|----------------|-------|
| Cancelar | Secundario | Vuelve a A-04. Si hay cambios, confirma antes | Todos |
| Guardar borrador | Secundario | Guarda con estado `borrador`. **Solo exige el título** | Todos |
| Publicar | Éxito | Valida **todos** los campos obligatorios y publica | Editor, Admin |
| Guardar cambios | Primario | Solo en edición de una publicación ya publicada | Editor, Admin |

#### Diferencias por rol y modo

| Situación | Comportamiento |
|-----------|----------------|
| **Colaborador creando** | Sin select de estado ni botón "Publicar". Solo "Guardar borrador". Aviso informativo: "Tu publicación quedará como borrador. Un editor la revisará antes de publicarla" |
| **Colaborador editando su borrador** | Igual que arriba |
| **Colaborador ante una publicación ya publicada** | No llega a esta pantalla: A-04 no ofrece la acción y la ruta responde 403 ([RN-M3-03](./MODULES_SPEC.md#42-reglas-de-negocio)) |
| **Editor o Admin creando** | Todos los campos y los tres botones |
| **Editor o Admin editando publicada** | Además, botón terciario "Despublicar" en la barra lateral, con confirmación |

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Nuevo** | Estado en "Borrador". Autor con el usuario actual. Foco en el título |
| **Edición** | Todos los campos precargados. El título de la pantalla pasa a "Editar publicación" y muestra el nombre de la noticia |
| **Sin categorías o departamentos** | Los selects se muestran deshabilitados con un aviso: "Primero crea al menos una categoría" + enlace a A-07 o A-08. "Publicar" queda deshabilitado |
| **Validación al publicar** | Los campos faltantes entran en error a la vez. La página se desplaza al primero. Alerta de error arriba: "Completa los campos obligatorios para publicar" |
| **Guardando** | Botón pulsado en loading, los demás deshabilitados |
| **Éxito al guardar borrador** | Permanece en la pantalla, en modo edición. Toast: "Borrador guardado" |
| **Éxito al publicar** | Redirige a A-04. Toast: "Publicación publicada" + enlace "Ver en el sitio" |
| **Cambios sin guardar** | Al intentar salir o cerrar la pestaña, confirmación del navegador |

---

### 6.7 A-06 · Comentarios

**Ruta:** `/panel/comments/` · **Acceso:** Administrador · **Casos de uso:** [HU-M5-02](./MODULES_SPEC.md#hu-m5-02--moderar-comentarios)

#### Estructura

```
┌──────────────┬──────────────────────────────────────────────────────┐
│   SIDEBAR    │  Comentarios                                         │
│              ├──────────────────────────────────────────────────────┤
│              │ [Pendientes 3] [Aprobados] [Bloqueados] [Todos]      │  pestañas
│              │ ┌──────────────────────────────────────────────────┐ │
│              │ │Autor  │Correo  │Noticia │Fecha│Contenido│Est│Acc.│ │
│              │ ├──────────────────────────────────────────────────┤ │
│              │ │◯ Juan │juan@...│Simpo.. │30may│Muy buen │[P]│✓✕🗑│ │
│              │ ├──────────────────────────────────────────────────┤ │
│              │ │◯ Laura│laura@..│Rodada  │29may│No estoy │[A]│ ✕🗑│ │
│              │ └──────────────────────────────────────────────────┘ │
│              │  Mostrando 1–10 de 24        ← 1 [2] 3 →             │
└──────────────┴──────────────────────────────────────────────────────┘
```

#### Pestañas de filtro

| Pestaña | Contenido | Indicador |
|---------|-----------|-----------|
| Pendientes | Estado `pendiente` | **Badge con el conteo en `warning-700`.** Es la pestaña activa al entrar |
| Aprobados | Estado `aprobado` | — |
| Bloqueados | Estado `bloqueado` | — |
| Todos | Sin filtro | — |

#### Columnas

| Columna | Contenido | Ancho |
|---------|-----------|-------|
| Autor | Avatar `xs` + nombre | 160 px |
| Correo | Correo en `body-sm` `ink-600` | 180 px |
| Noticia | Título a 1 línea, enlaza al detalle público | 180 px |
| Fecha | `dd mmm · HH:mm` | 120 px |
| Contenido | Texto recortado a 2 líneas. Clic expande la fila | Flexible |
| Estado | Badge (§2.5) | 110 px |
| Acciones | Según el estado | 130 px |

#### Acciones según el estado

| Estado actual | Acciones disponibles |
|---------------|---------------------|
| `pendiente` | **Aprobar** (éxito, palomita) · **Bloquear** (secundario, prohibido) · **Eliminar** (peligro, bote) |
| `aprobado` | **Bloquear** · **Eliminar** |
| `bloqueado` | **Aprobar** · **Eliminar** |

| Acción | Confirmación |
|--------|--------------|
| Aprobar | Sin modal. Toast: "Comentario aprobado" |
| Bloquear | Sin modal. Toast: "Comentario bloqueado" con acción "Deshacer" durante 5 s |
| Eliminar | **Modal obligatorio** (§2.9): "Se eliminará de forma permanente. Esta acción no se puede deshacer" |

#### Acciones en lote

Casilla de selección en la primera columna y en el encabezado. Al seleccionar al menos una,
aparece una barra sobre la tabla: "3 seleccionados" + "Aprobar" + "Bloquear" + "Eliminar" +
"Deseleccionar".

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Sin comentarios** | Estado vacío: "Aún no hay comentarios · Cuando los lectores comenten las noticias, aparecerán aquí" |
| **Sin pendientes** | En esa pestaña: "No hay comentarios pendientes · Todo al día" con icono de palomita en `success-700` |
| **Fila expandida** | La fila crece para mostrar el contenido completo, con fondo `brand-50` |

---

### 6.8 A-07 · Categorías

**Ruta:** `/panel/categories/` · **Acceso:** Editor, Administrador · **Casos de uso:** [HU-M4-01](./MODULES_SPEC.md#hu-m4-01--administrar-categorías)

#### Estructura

```
┌──────────────┬──────────────────────────────────────────────────────┐
│   SIDEBAR    │  Categorías                                          │
│              ├──────────────────────────────────────────────────────┤
│              │ ┌────────────────────────────────┐ ┌──────────────┐  │
│              │ │ Nueva categoría                │ │  [ Agregar ] │  │
│              │ └────────────────────────────────┘ └──────────────┘  │
│              │ ┌──────────────────────────────────────────────────┐ │
│              │ │ # │ Nombre     │ Publicaciones │ Creada │ Acc.  │ │
│              │ ├──────────────────────────────────────────────────┤ │
│              │ │ 1 │ Eventos    │      12       │ 20 may │ ✎ 🗑   │ │
│              │ │ 2 │ Política   │       8       │ 20 may │ ✎ 🗑   │ │
│              │ │ 3 │ Ciencia    │       0       │ 20 may │ ✎ 🗑   │ │
│              │ └──────────────────────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────────────────────┘
```

#### Alta rápida

Campo de texto de ancho flexible + botón primario "Agregar", en una sola fila sobre la
tabla. `Enter` en el campo equivale a pulsar el botón.

| Campo | Validación | Mensaje de error |
|-------|-----------|------------------|
| Nombre | 1–60 caracteres, único | "Ya existe una categoría con ese nombre" |

#### Columnas

| Columna | Contenido | Ancho |
|---------|-----------|-------|
| # | Número consecutivo | 60 px |
| Nombre | Texto peso 600. **Editable en línea** al hacer clic | Flexible |
| Publicaciones | Conteo, alineado a la derecha. Enlaza a A-04 filtrado | 130 px |
| Creada | `dd mmm yyyy` | 120 px |
| Acciones | Editar · Eliminar | 100 px |

#### Comportamiento de eliminación

Esta es la particularidad de la pantalla
([RN-M4-02](./MODULES_SPEC.md#51-reglas-de-negocio)):

| Caso | Comportamiento |
|------|----------------|
| **Sin publicaciones** | Botón activo. Modal de confirmación estándar. Toast: "Categoría eliminada" |
| **Con publicaciones** | **Botón deshabilitado**, con tooltip al pasar el cursor: "No se puede eliminar: 12 publicaciones usan esta categoría". Si se fuerza por otra vía, alerta de error con el mismo texto |

> El botón deshabilitado con explicación es mejor que un botón activo que falla. El usuario
> entiende **por qué** antes de intentarlo, no después.

#### Edición en línea

Al hacer clic en el nombre, la celda se convierte en un campo con el valor precargado y
seleccionado. `Enter` guarda, `Esc` cancela, salir del campo guarda. Mientras guarda, la
celda muestra un spinner de 16 px.

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Sin categorías** | Estado vacío: "Aún no hay categorías · Crea la primera para poder clasificar las noticias". El campo de alta queda enfocado |
| **Nombre duplicado** | El campo de alta entra en error. La fila existente parpadea en `warning-50` durante 1 s |

---

### 6.9 A-08 · Departamentos

**Ruta:** `/panel/departments/` · **Acceso:** Editor, Administrador · **Casos de uso:** [HU-M4-02](./MODULES_SPEC.md#hu-m4-02--administrar-departamentos)

**Idéntica a A-07** en estructura, componentes y comportamiento. Cambian únicamente:

| Aspecto | Valor |
|---------|-------|
| Título | "Departamentos" |
| Descripción bajo el título | "Áreas de CANACO que originan las noticias" |
| Placeholder del alta | "Nuevo departamento" |
| Mensaje de duplicado | "Ya existe un departamento con ese nombre" |
| Mensaje de bloqueo | "No se puede eliminar: 12 publicaciones usan este departamento" |
| Estado vacío | "Aún no hay departamentos · Crea el primero para poder publicar noticias" |

---

### 6.10 A-09 · Usuarios

**Ruta:** `/panel/users/` · **Acceso:** Administrador · **Casos de uso:** [HU-M6-01](./MODULES_SPEC.md#hu-m6-01--gestionar-el-listado-de-usuarios), [HU-M6-04](./MODULES_SPEC.md#hu-m6-04--bloquear-y-desbloquear-usuarios)

#### Estructura

```
┌──────────────┬──────────────────────────────────────────────────────┐
│   SIDEBAR    │  Usuarios                           [ Crear usuario ]│
│              ├──────────────────────────────────────────────────────┤
│              │ [Buscar...]  [Rol ▾]  [Estado ▾]                     │
│              │ ┌──────────────────────────────────────────────────┐ │
│              │ │# │Usuario    │Correo   │Rol    │Registro│Est│Acc.│ │
│              │ ├──────────────────────────────────────────────────┤ │
│              │ │1 │◯ Ana Torre│ana@...  │Admin  │01 mar  │[A]│✎ ⊘ │ │
│              │ │2 │◯ Juan Pére│juanp@...│Editor │12 mar  │[A]│✎ ⊘ │ │
│              │ │3 │◯ Laura Sán│laura@...│Lector │22 abr  │[I]│✎ ⊙ │ │
│              │ └──────────────────────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────────────────────┘
```

#### Columnas

| Columna | Contenido | Ancho | Orden |
|---------|-----------|-------|:-----:|
| # | Consecutivo | 50 px | — |
| Usuario | Avatar `xs` + nombre completo. Debajo, `@usuario` en `caption` `ink-600` | Flexible | ✅ |
| Correo | `body-sm` | 200 px | ✅ |
| Rol | Badge en `brand-50` / `brand-900` | 130 px | ✅ |
| Registro | `dd mmm yyyy` | 120 px | ✅ |
| Estado | Badge Activo / Inactivo | 100 px | ✅ |
| Acciones | Editar · Bloquear o Desbloquear | 120 px | — |

#### Filtros

| Filtro | Opciones |
|--------|----------|
| Búsqueda | Sobre nombre, usuario y correo |
| Rol | Todos · Lector · Colaborador · Editor · Administrador |
| Estado | Todos · Activos · Inactivos |

#### Acciones

| Acción | Icono | Variante | Comportamiento |
|--------|-------|----------|----------------|
| Editar | Lápiz | Terciario | A-10 |
| Bloquear | Círculo tachado | Peligro | Modal: "Se desactivará la cuenta de Juan Pérez. No podrá iniciar sesión, pero sus publicaciones y comentarios seguirán visibles." Confirmar: "Bloquear" |
| Desbloquear | Círculo con palomita | Éxito | Sin modal. Toast: "Cuenta reactivada" |

> **No existe la acción de eliminar.** La maqueta original tenía un botón "ELIMINAR"; en este
> sistema esa acción **desactiva**, no borra ([RN-M6-04](./MODULES_SPEC.md#71-reglas-de-negocio)).
> Por eso el botón se llama "Bloquear" y su icono no es un bote de basura: llamarlo
> "Eliminar" haría creer al administrador que el registro desaparece, y no es así.

#### Restricciones visibles

| Caso | Comportamiento |
|------|----------------|
| **Fila del propio usuario** | Fondo `brand-50` permanente y etiqueta "(Tú)" junto al nombre. Acciones de bloquear y cambiar rol deshabilitadas, con tooltip: "No puedes modificar tu propia cuenta" ([RN-M6-05](./MODULES_SPEC.md#71-reglas-de-negocio)) |
| **Último administrador activo** | Su acción de bloquear queda deshabilitada, con tooltip: "Debe existir al menos un administrador activo" ([RN-M6-06](./MODULES_SPEC.md#71-reglas-de-negocio)) |
| **Usuario inactivo** | La fila baja a 60 % de opacidad. El avatar pasa a escala de grises |

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Solo el administrador** | La tabla muestra una fila con la etiqueta "(Tú)" y un mensaje bajo la tabla invitando a crear más usuarios |
| **Filtros sin resultados** | "No hay usuarios con estos filtros" + "Limpiar filtros" |

---

### 6.11 A-10 · Crear y editar usuario

**Rutas:** `/panel/users/new/` · `/panel/users/<id>/edit/` · **Acceso:** Administrador
**Casos de uso:** [HU-M6-02](./MODULES_SPEC.md#hu-m6-02--crear-un-usuario-desde-el-panel), [HU-M6-03](./MODULES_SPEC.md#hu-m6-03--cambiar-el-rol-de-un-usuario), [HU-M6-05](./MODULES_SPEC.md#hu-m6-05--reponer-la-contraseña-de-un-usuario)

**Contenedor:** tarjeta de 640 px.

#### Campos

| Campo | Tipo | Obligatorio | Validación | Solo en |
|-------|------|:-----------:|-----------|---------|
| Nombre de usuario | Texto | Sí | 3–150 caracteres, único | Ambos. **Readonly en edición** |
| Correo electrónico | Correo | Sí | Formato válido, único | Ambos |
| Nombre | Texto | No | Máximo 150 caracteres | Ambos |
| Apellido paterno | Texto | No | Máximo 80 caracteres | Ambos |
| Apellido materno | Texto | No | Máximo 80 caracteres | Ambos |
| Rol | Select | Sí | Lector, Colaborador, Editor, Administrador | Ambos |
| Contraseña | Password | Sí | Mínimo 8 caracteres | Solo creación |
| Confirmar contraseña | Password | Sí | Igual a la anterior | Solo creación |
| Estado | Interruptor | — | Activo / Inactivo | Solo edición |

#### Disposición

Dos columnas en `lg`: usuario + correo, nombre + paterno, materno + rol. Contraseñas en su
propio bloque separado por un borde, bajo el encabezado "Credenciales".

En **edición**, el bloque de contraseña se sustituye por un botón secundario
"Restablecer contraseña", que abre un modal con dos campos (nueva y confirmación) y no pide
la contraseña anterior ([RN-M6-07](./MODULES_SPEC.md#71-reglas-de-negocio)).

**Acciones:** "Cancelar" secundario · "Crear usuario" o "Guardar cambios" primario.

#### Ayuda del campo de rol

Bajo el select, descripción del rol elegido en `body-sm` `ink-600`, que cambia al
seleccionar:

| Rol | Descripción |
|-----|-------------|
| Lector | "Puede leer noticias y comentar. No accede al panel." |
| Colaborador | "Puede redactar borradores propios. No puede publicar." |
| Editor | "Puede crear, editar, publicar y eliminar noticias, y gestionar categorías y departamentos." |
| Administrador | "Acceso total, incluyendo moderación de comentarios y gestión de usuarios." |

#### Estados

| Estado | Comportamiento |
|--------|----------------|
| **Editando la propia cuenta** | Rol y estado deshabilitados con aviso: "No puedes modificar tu propio rol ni tu estado" |
| **Editando al último admin activo** | El interruptor de estado queda deshabilitado con su tooltip |
| **Éxito al crear** | Redirige a A-09. Toast: "Usuario creado" |
| **Éxito al editar** | Redirige a A-09. Toast: "Usuario actualizado" |
| **Correo o usuario duplicado** | El campo entra en error con su mensaje. Los demás valores se conservan |

---

## 7. Accesibilidad

Requisitos **no negociables**. Nivel objetivo: **WCAG 2.1 AA**.

| # | Requisito |
|---|-----------|
| A-01 | Contraste mínimo **4.5:1** para texto normal y **3:1** para texto de 18 px o mayor en negrita. Los tokens de §1.2 ya lo cumplen; **`accent-500` nunca lleva texto encima** |
| A-02 | Todo elemento interactivo alcanzable con teclado, en orden lógico de lectura |
| A-03 | Indicador de foco visible en todo elemento enfocable: `outline: 2px solid #2b6777` con `outline-offset: 2px`. **Nunca `outline: none` sin reemplazo** |
| A-04 | Toda imagen con `alt`. Las decorativas con `alt=""`. Las portadas usan el título de la noticia |
| A-05 | Todo campo con `<label>` asociado por `for` e `id`. El placeholder no sustituye a la etiqueta |
| A-06 | Los errores de formulario se anuncian con `aria-live="polite"` y el campo lleva `aria-invalid="true"` y `aria-describedby` apuntando al mensaje |
| A-07 | Área táctil mínima de **44 × 44 px** en móvil |
| A-08 | El color nunca es el único portador de información: todo estado lleva texto o icono |
| A-09 | Jerarquía de encabezados sin saltos: un solo `h1` por página |
| A-10 | Enlace "Saltar al contenido" como primer elemento enfocable, visible al recibir foco |
| A-11 | Los modales atrapan el foco, se cierran con `Esc` y devuelven el foco al origen |
| A-12 | El slider tiene botón de pausa, se detiene con el foco y respeta `prefers-reduced-motion` |
| A-13 | Las tablas usan `<th scope="col">` y un `<caption>` accesible |
| A-14 | Texto redimensionable al 200 % sin pérdida de contenido ni funciones |
| A-15 | Idioma declarado: `<html lang="es">` |

---

## 8. Responsive

### 8.1 Regla general

Diseño **móvil primero**. Cada pantalla se define primero a 375 px y se enriquece hacia
arriba.

### 8.2 Comportamiento por componente

| Componente | `base` < 640 | `md` 768+ | `lg` 1024+ |
|-----------|--------------|-----------|-----------|
| Navbar | Logo + lupa + menú hamburguesa | Completo, buscador colapsado | Completo con buscador expandido |
| Sidebar del panel | Oculto, se abre desde la izquierda | Oculto, se abre | Fijo de 240 px |
| Cuadrícula de tarjetas | 1 columna | 2 columnas | 3 columnas |
| Slider | 280 px, solo deslizar | 360 px con flechas | 480 px con flechas |
| Detalle de noticia | 1 columna, lateral abajo | 1 columna, lateral abajo | 8 + 4 columnas |
| Tablas del panel | Tarjetas apiladas | Tabla con desplazamiento horizontal | Tabla completa |
| Formularios | 1 columna | 1 columna | 2 columnas donde se indique |
| Modales | Ancho completo menos 16 px, anclado abajo | Centrado 480 px | Centrado 480 px |
| Métricas del dashboard | 1 columna | 2 columnas | 4 columnas |
| Galería | 2 columnas | 3 columnas | 4 columnas |
| Footer | 1 columna | 2 columnas | 4 columnas |

### 8.3 Reglas de conversión de tabla a tarjeta

Bajo `md`, cada fila se convierte en una tarjeta:

```
┌──────────────────────────────────┐
│ ▣  Simposium Inmobiliario  [Pub] │  portada + título + badge
│    Por María López               │  autor
│    20 may · 1,234 visitas        │  metadatos
│    ─────────────────────────     │
│    [ Ver ] [ Editar ] [Eliminar] │  acciones
└──────────────────────────────────┘
```

---

## 9. Microcopy

Todos los textos del sistema, para que el diseñador no invente ninguno.

### 9.1 Acciones

| Contexto | Texto |
|----------|-------|
| Enviar login | Ingresar |
| Enviar registro | Registrarse |
| Cerrar sesión | Cerrar sesión |
| Guardar formulario | Guardar cambios |
| Guardar borrador | Guardar borrador |
| Publicar | Publicar |
| Despublicar | Despublicar |
| Cancelar | Cancelar |
| Eliminar | Eliminar |
| Confirmar eliminación | Sí, eliminar |
| Bloquear usuario | Bloquear |
| Desbloquear usuario | Desbloquear |
| Aprobar comentario | Aprobar |
| Bloquear comentario | Bloquear |
| Crear noticia | Crear publicación |
| Crear usuario | Crear usuario |
| Agregar categoría | Agregar |
| Enviar comentario | Publicar comentario |
| Ir al detalle | Saber más |
| Ver listado | Ver todas las noticias |
| Cambiar contraseña | Actualizar contraseña |

### 9.2 Mensajes de éxito

| Situación | Texto |
|-----------|-------|
| Registro | Cuenta creada. Ya puedes iniciar sesión |
| Cierre de sesión | Cerraste sesión correctamente |
| Perfil actualizado | Perfil actualizado |
| Contraseña cambiada | Contraseña actualizada |
| Borrador guardado | Borrador guardado |
| Publicación publicada | Publicación publicada |
| Publicación despublicada | La publicación volvió a borrador |
| Publicación eliminada | Publicación eliminada |
| Comentario enviado | Tu comentario será visible cuando lo apruebe un administrador |
| Comentario aprobado | Comentario aprobado |
| Comentario bloqueado | Comentario bloqueado |
| Comentario eliminado | Comentario eliminado |
| Categoría creada | Categoría creada |
| Categoría eliminada | Categoría eliminada |
| Usuario creado | Usuario creado |
| Usuario bloqueado | Cuenta desactivada |
| Usuario desbloqueado | Cuenta reactivada |

### 9.3 Mensajes de error

| Situación | Texto |
|-----------|-------|
| Credenciales incorrectas | Usuario o contraseña incorrectos |
| Cuenta desactivada | Tu cuenta está desactivada. Contacta al administrador |
| Usuario duplicado | Ese nombre de usuario ya está en uso |
| Correo duplicado | Ese correo electrónico ya está registrado |
| Contraseñas distintas | Las contraseñas no coinciden |
| Contraseña actual incorrecta | La contraseña actual es incorrecta |
| Contraseña corta | La contraseña debe tener al menos 8 caracteres |
| Campo obligatorio vacío | Este campo es obligatorio |
| Comentario vacío | El comentario no puede estar vacío |
| Faltan campos para publicar | Completa los campos obligatorios para publicar |
| Tipo de archivo inválido | Solo se permiten imágenes JPEG, PNG o WebP |
| Archivo muy grande | El archivo no puede superar los 5 MB |
| Categoría duplicada | Ya existe una categoría con ese nombre |
| Categoría en uso | No se puede eliminar: {n} publicaciones usan esta categoría |
| Departamento en uso | No se puede eliminar: {n} publicaciones usan este departamento |
| Autocambio de rol | No puedes modificar tu propio rol |
| Autobloqueo | No puedes bloquear tu propia cuenta |
| Último administrador | Debe existir al menos un administrador activo |
| Error general | Ocurrió un error. Intenta de nuevo |

### 9.4 Estados vacíos

| Pantalla | Título | Descripción |
|----------|--------|-------------|
| P-01 Home | Aún no hay noticias publicadas | Cuando se publique la primera, aparecerá aquí |
| P-02 Listado | Aún no hay noticias publicadas | Vuelve pronto para ver las novedades de CANACO |
| P-03 Categoría | No hay noticias en esta categoría | Prueba con otra categoría o vuelve al listado completo |
| P-04 Comentarios | Sé el primero en comentar | — |
| P-05 Búsqueda | No se encontraron noticias para «{término}» | Revisa la ortografía o prueba con otras palabras |
| A-00 Dashboard | Todo listo para empezar | Crea tu primera noticia para ver las métricas aquí |
| A-04 Noticias | Aún no hay publicaciones | Crea la primera noticia para que aparezca en el sitio |
| A-06 Comentarios | Aún no hay comentarios | Cuando los lectores comenten las noticias, aparecerán aquí |
| A-06 Sin pendientes | No hay comentarios pendientes | Todo al día |
| A-07 Categorías | Aún no hay categorías | Crea la primera para poder clasificar las noticias |
| A-08 Departamentos | Aún no hay departamentos | Crea el primero para poder publicar noticias |
| Filtros sin resultado | No hay resultados con estos filtros | Prueba a limpiar los filtros |

### 9.5 Confirmaciones

| Acción | Título | Cuerpo |
|--------|--------|--------|
| Eliminar publicación | Eliminar publicación | ¿Seguro que deseas eliminar «{título}»? Se eliminarán también sus {n} comentarios. Esta acción no se puede deshacer |
| Eliminar comentario | Eliminar comentario | El comentario se eliminará de forma permanente. Esta acción no se puede deshacer |
| Eliminar categoría | Eliminar categoría | ¿Seguro que deseas eliminar la categoría «{nombre}»? |
| Bloquear usuario | Bloquear cuenta | Se desactivará la cuenta de {nombre}. No podrá iniciar sesión, pero sus publicaciones y comentarios seguirán visibles |
| Despublicar | Despublicar noticia | La noticia dejará de ser visible en el sitio. Conservará sus visitas y comentarios |
| Salir con cambios | Tienes cambios sin guardar | Si sales ahora, perderás los cambios que hiciste |

### 9.6 Formatos

| Dato | Formato | Ejemplo |
|------|---------|---------|
| Fecha en tarjeta y listado | `dd mmm yyyy` | 20 may 2026 |
| Fecha en detalle | `dd de mmmm de yyyy` | 20 de mayo de 2026 |
| Fecha con hora | `dd mmm · HH:mm` | 30 may · 14:22 |
| Tiempo relativo | Hasta 24 h | hace 2 h |
| Número de visitas | Separador de miles con coma | 12,847 |
| Tamaño de archivo | Entero + unidad | 248 KB |
| Conteo singular | Sin la "s" | 1 noticia encontrada |

---

## 10. Checklist de entrega

Lo que el diseño debe incluir para considerarse completo.

### Librería de estilos

- [ ] Los 24 tokens de color de §1.2 como estilos de color
- [ ] Las dos familias tipográficas con sus 10 estilos de texto (§1.3)
- [ ] La escala de espaciado de 10 pasos (§1.4)
- [ ] Los 5 radios y las 5 sombras (§1.5)

### Componentes

- [ ] Botón: 5 variantes × 6 estados × 3 tamaños
- [ ] Campo: 7 estados × 8 tipos
- [ ] Carga de archivos: simple y múltiple, 5 estados cada una
- [ ] Editor enriquecido con su barra
- [ ] Badge: 8 estados
- [ ] Tabla: encabezado, fila, fila par, hover, vacía, cargando
- [ ] Paginación
- [ ] Alerta en línea: 4 tipos · Toast: 4 tipos
- [ ] Modal de confirmación
- [ ] Tarjeta de noticia: con portada, sin portada, hover
- [ ] Slider con controles e indicadores
- [ ] Galería y visor a pantalla completa
- [ ] Comentario: normal y propio pendiente
- [ ] Estado vacío
- [ ] Avatar: 5 tamaños, con foto y con iniciales
- [ ] Tarjeta de métrica

### Pantallas — 19 en total

**Públicas (8):**
- [ ] P-01 Home — con contenido, vacío, móvil
- [ ] P-02 Listado — con contenido, vacío
- [ ] P-03 Por categoría — con contenido, vacío
- [ ] P-04 Detalle — completo, sin galería, sin comentarios, no autenticado, móvil
- [ ] P-05 Búsqueda — con resultados, sin resultados
- [ ] P-06 Login — inicial, error
- [ ] P-07 Registro — inicial, error de validación
- [ ] P-08 Errores — 404, 403, 500

**Panel (11):**
- [ ] A-00 Dashboard — con datos, vacío, vista de Colaborador
- [ ] A-01 Mi perfil
- [ ] A-02 Editar perfil
- [ ] A-03 Cambiar contraseña — inicial, error
- [ ] A-04 Noticias — Editor, Colaborador, vacío, móvil
- [ ] A-05 Crear/editar — nuevo, edición, vista de Colaborador, errores de validación
- [ ] A-06 Comentarios — pendientes, vacío, selección en lote
- [ ] A-07 Categorías — con datos, vacío, eliminación bloqueada
- [ ] A-08 Departamentos
- [ ] A-09 Usuarios — con datos, fila propia, último administrador
- [ ] A-10 Crear/editar usuario — creación, edición

### Verificación

- [ ] Todo par de color de texto y fondo verificado contra WCAG AA
- [ ] Cada pantalla diseñada a 375 px, 768 px y 1440 px
- [ ] Estado de foco visible documentado en todo componente interactivo
- [ ] Ningún texto sobre `accent-500` `#52ab98`

---

## 11. Fuentes

- `3.-. Maquetas Pantallas del proyecto.pdf` — catorce maquetas de referencia
- `2.- Problema a Resolver.pdf` — requisitos de home y detalle
- [PRODUCT_OVERVIEW.md](./PRODUCT_OVERVIEW.md) — roles, alcance y convención de idioma
- [MODULES_SPEC.md](./MODULES_SPEC.md) — reglas de negocio y casos de uso referenciados
- [DATA_MODEL.md](./DATA_MODEL.md) — campos disponibles en cada pantalla
- Paleta base aprobada por el cliente: `#2b6777` `#c8d8e4` `#ffffff` `#f2f2f2` `#52ab98`
