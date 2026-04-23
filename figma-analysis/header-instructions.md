# Instrucciones de Bloque: `header`
> **Generado por:** Figma Analyst
> **Archivo Figma:** MovistarPlus — `fileKey: 3gw50VHnWKIBmy03RYlgTl`
> **Nodos de referencia:**
> - Desktop 1280: `3:10183` (Header - End Google Tag Manager (noscript)) — sibling de `Body` y `Footer` dentro de `Vista-1280px` (no aparece como `Section` propia)
> - Tablet 768: `3:6698` (Header) — sibling al final del frame `Html` 768
> - Mobile 390: `3:8462` (Header) — sibling al final del frame `Vista-390px`
> **Complejidad:** Media
> **Requiere JS:** sí *(menú móvil hamburguesa + sticky-on-scroll opcional)*
> **Modelo UE:** xwalk
> **Bloque existente en repo:** ✅ `/blocks/header/` — el boilerplate aporta carga vía `header.js`. Se debe **extender**, no reemplazar.

---

## 1. Descripción funcional

Cabecera fija superior, fondo negro `--color-black`, altura `122.01px` en desktop. Visualmente NO aparece como un `frame Section` dentro del cuerpo de la home: en Figma está modelada como un nodo **hermano** del `Body` y `Footer`, posicionado al final del árbol del viewport (técnica de overlay). En desktop incluye:

- **Logo SVG** Movistar Plus+ (100 × 44 px) a la izquierda, padding-left `63.23px`.
- **Navegación primaria horizontal** (5 items): `Series`, `Cine`, `Fútbol`, `Plan Gratuito`, `Más`. Tipografía 18px ApercuMovistar Regular, color blanco. Cada item lleva un dot azul (`--color-brand-blue`, 4×4 rounded 2) como separador a su derecha (excepto el último).
- **Bloque de utilidades a la derecha:** icono de búsqueda (17.4 × 18.4), CTA primario "SUSCRIBIRME AHORA" (azul `#06f`, rounded 5, 19px uppercase, padding 20.4 / 12.6) y botón de perfil (34 × 34 SVG circular).

> ⚠️ **DECISIÓN VINCULANTE del usuario (Fase 1, ronda 2):** este bloque es FUNDACIONAL — se extrae aunque no aparezca como un frame `Section` propio. Documentado a partir del nodo overlay `3:10183` para desktop y sus equivalentes en tablet/mobile.

---

## 2. Campos editables para Universal Editor (xwalk)

**Campos del contenedor raíz** (`id: header` en `component-models.json`):

> El bloque `header` en EDS se autora típicamente desde `/header.docx` o un fragmento dedicado, no como instancia inline en una página. Se documentan los campos esperados.

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Logo (imagen) | `logo` | `reference` (image) | `string` | sí | "Logo de cabecera" |
| Texto alternativo del logo | `logoAlt` | `text` | `string` | sí | "Texto alternativo del logo" |
| Enlace del logo | `logoLink` | `aem-content` | `string` | sí | "Enlace del logo (normalmente la home)" |
| Items de navegación | `navItems` | `container` | `string` | sí | "Items del menú principal" |
| Texto del CTA | `ctaText` | `text` | `string` | sí | "Texto del botón principal" |
| Enlace del CTA | `ctaLink` | `aem-content` | `string` | sí | "Enlace destino del botón" |
| Mostrar buscador | `showSearch` | `boolean` | `boolean` | no | "Mostrar icono de búsqueda" |
| Enlace de búsqueda | `searchLink` | `aem-content` | `string` | no | "Enlace destino del buscador" |
| Mostrar perfil | `showProfile` | `boolean` | `boolean` | no | "Mostrar icono de perfil" |
| Enlace de perfil | `profileLink` | `aem-content` | `string` | no | "Enlace destino del perfil/login" |

**Campos de cada nav-item** (`id: header-nav-item` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Texto del enlace | `label` | `text` | `string` | sí | "Etiqueta visible" |
| Destino | `link` | `aem-content` | `string` | sí | "URL destino" |
| Es activo | `active` | `boolean` | `boolean` | no | "Marcar como sección activa" |

> ⚠️ **DECISIÓN PARA UE Specialist (Fase 3):** los nav-items podrían modelarse alternativamente con sub-bloques anidados `header-nav-item` o como una tabla key-value. La opción `container` es más ergonómica para el autor.

---

## 3. Estructura DOM

### ENTRADA — Matriz EDS (lo que `decorate(block)` recibe)

El header EDS estándar se construye desde el documento `/header.docx` que usualmente contiene una **única tabla con bloque "Nav"** y filas para cada sección de navegación. Para este proyecto, dada la riqueza del componente Figma, la entrada esperada será:

```
block.header
  └── div (fila 1: logo)
        └── div (col 0)
              └── <picture> ← logo SVG/PNG entregado por EDS
  └── div (fila 2: navegación principal — bloque anidado o lista <ul>)
        └── div (col 0)
              └── <ul>
                    ├── <li><a href="...">Series</a></li>
                    ├── <li><a href="...">Cine</a></li>
                    ├── <li><a href="...">Fútbol</a></li>
                    ├── <li><a href="...">Plan Gratuito</a></li>
                    └── <li><a href="...">Más</a></li>
  └── div (fila 3: CTA)
        └── div (col 0)
              └── <p><a href="/suscribirse">SUSCRIBIRME AHORA</a></p>
  └── div (fila 4: utilidades — opcional)
        └── div (col 0)
              └── <p><a href="/buscar">Buscar</a></p>
        └── div (col 1)
              └── <p><a href="/perfil">Perfil</a></p>
```

> 📌 **NOTA:** EDS genera automáticamente `<ul><li><a>` cuando el documento contiene una lista markdown. El developer NO debe reconstruir esta estructura — solo debe **decorarla** con clases.

### SALIDA — DOM decorado (lo que `decorate(block)` produce)

```html
<header class="header block" data-block-name="header" data-block-status="loaded">
  <div class="header__inner">
    <a href="/" class="header__logo-link" aria-label="Movistar Plus+ — ir a inicio">
      <picture class="header__logo">
        <img src="..." alt="Movistar Plus+" loading="eager" fetchpriority="high">
      </picture>
    </a>

    <nav class="header__nav" aria-label="Navegación principal">
      <ul class="header__nav-list">
        <li class="header__nav-item"><a href="/series">Series</a></li>
        <li class="header__nav-item"><a href="/cine">Cine</a></li>
        <li class="header__nav-item"><a href="/futbol">Fútbol</a></li>
        <li class="header__nav-item"><a href="/plan-gratuito">Plan Gratuito</a></li>
        <li class="header__nav-item"><a href="/mas">Más</a></li>
      </ul>
    </nav>

    <div class="header__actions">
      <button type="button" class="header__icon-btn header__search" aria-label="Buscar">
        <!-- SVG icono lupa -->
      </button>
      <a href="/suscribirse" class="header__cta button">SUSCRIBIRME AHORA</a>
      <a href="/perfil" class="header__icon-btn header__profile" aria-label="Mi cuenta">
        <!-- SVG icono perfil -->
      </a>
    </div>

    <button type="button" class="header__burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="header-nav">
      <!-- SVG hamburguesa - solo visible en mobile -->
    </button>
  </div>
</header>
```

**Notas de transformación DOM aplicadas por `decorate()`:**
- Wrapping del bloque entero con `<header>` semántico (no `<div>`).
- Inyección del `<nav>` y `aria-label`.
- Conversión de los enlaces de utilidad (`Buscar`, `Perfil`) en `<button>` o `<a>` con icono SVG inline.
- Inyección del botón hamburguesa para mobile (no presente en el DOM de entrada).
- Los iconos SVG (lupa, perfil, hamburguesa) deben venir de `/icons/` en el proyecto (patrón EDS estándar).

---

## 4. Tokens utilizados

Referencias a `global-tokens.md`:

| Propiedad CSS | Token |
|---|---|
| Fondo del header | `var(--color-black)` |
| Color de texto nav | `var(--color-white)` |
| Color separador dot | `var(--color-brand-blue)` (#0066ff) |
| Familia tipográfica | `var(--font-family-primary)` |
| Tamaño nav items | `font-size: 18px / line-height: 21.6px` (token `--font-size-nav: 18px`) |
| CTA: fondo | `var(--color-brand-blue)` |
| CTA: texto | `var(--color-white)` / `font-size: 19px` / `line-height: 22.8px` / `text-transform: uppercase` / `padding: 12.6px 20.4px` |
| CTA: border-radius | `var(--radius-button)` (5px) |
| Altura header desktop | `122.01px` (token `--height-header-desktop: 122px`) |

> ⚠️ Token nuevo añadido a `global-tokens.md`: `--height-header-desktop: 122px`, `--height-header-mobile` (pendiente de extraer de `3:8462`).

---

## 5. Gestión de imágenes y media

| Imagen | Origen | Tratamiento | Notas |
|---|---|---|---|
| **Logo Movistar Plus+** | Celda del bloque → `<picture>` ya entregado por EDS, o asset estático en `/icons/logo.svg` | `loading="eager"` + `fetchpriority="high"` | El logo aparece en TODAS las páginas y es above-the-fold pero NO es candidato LCP (es pequeño 100×44 px). Sigue siendo crítico para FCP. |
| **Iconos lupa, perfil, hamburguesa** | Assets SVG en `/icons/` (patrón EDS) | Inline SVG embebido o `<img src="/icons/...svg">` con `loading="eager"` | SVGs deben estar optimizados (sin metadata, paths simplificados). |

**Texto alternativo (`alt`):**
- Logo: `"Movistar Plus+"` (configurable vía `logoAlt`).
- Iconos puramente decorativos junto a `<button aria-label>`: `alt=""`.
- Iconos como único contenido del enlace: el enlace debe tener `aria-label` descriptivo, el icono `alt=""`.

---

## 6. Comportamiento responsivo

### Desktop ≥ 1280px
- **Datos extraídos del nodo `3:10183`:** altura `122.01px`, fondo `bg-black`.
- **Layout:** flex horizontal, `padding: 39px 63.23px` (logo top 39px, ancho contenido 1138.21px). Logo a la izquierda (max-width 100px), bloque de navegación con `gap: 40px` entre items, bloque de utilidades a la derecha (`width: 302.003px`, gap interno 10px).
- **Nav items:** 18px Regular, dot azul como separador (4×4 rounded 2px) entre items.
- **CTA:** `padding: 12.6px 20.4px`, rounded 5px, texto 19px uppercase.

### Tablet 768px – 1279px
- **Nodo equivalente:** `3:6698` (existe en frame Tablet 768).
- **DATOS NO CONFIRMADOS POR get_design_context** — basado en metadata del frame.
- **Layout esperado:** la altura debe ser similar a desktop (~122px), pero el ancho del contenedor reduce el padding lateral. Es probable que algunos items de navegación se condensen o que el botón hamburguesa aparezca a partir de aquí.
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:6698` para confirmar paddings y comportamiento del menú.

### Mobile < 768px (390px de referencia)
- **Nodo equivalente:** `3:8462` (existe en frame Mobile 390).
- **DATOS NO CONFIRMADOS POR get_design_context** — basado en metadata del frame.
- **Layout esperado:** el menú principal se colapsa en un drawer/off-canvas activado por el botón hamburguesa. Solo logo + CTA (posiblemente comprimido a icono) + hamburguesa quedan visibles.
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:8462` para confirmar:
  1. Altura exacta del header en mobile.
  2. Si el CTA "SUSCRIBIRME" se mantiene visible o pasa al drawer.
  3. Posición y tamaño del botón hamburguesa.
  4. Diseño del drawer abierto (si existe screenshot).

---

## 7. Estados / interacciones

| Estado | Trigger | Comportamiento |
|---|---|---|
| **Hover sobre nav item** | mouse hover (desktop) | Subrayado o cambio de color (CSS). ⚠️ Color hover NO extraído del Figma — pendiente confirmación. |
| **Item activo** | atributo `active` en autoría o coincidencia con URL actual | Subrayado azul o dot persistente. Requiere comparación JS de `location.pathname`. |
| **Hover sobre CTA** | mouse hover (desktop) | Oscurecer fondo (`filter: brightness(0.9)`). ⚠️ Color hover NO extraído del Figma. |
| **Focus en cualquier link/botón** | Tab/teclado | Outline visible WCAG 2.4.7 — `outline: 2px solid var(--color-white); outline-offset: 2px;`. ♿ Crítico. |
| **Click en hamburguesa (mobile)** | tap/click | Despliega menú off-canvas. Toggle `aria-expanded="true/false"`. **Requiere JS.** |
| **Cierre del menú móvil** | tap fuera, ESC, click en X interna | Cierra drawer, restaura `aria-expanded="false"`, restaura `body` scroll. **Requiere JS.** |
| **Sticky on scroll (opcional)** | scroll vertical | Header se mantiene visible al hacer scroll, posiblemente con fondo más opaco. **Requiere JS** o `position: sticky` (CSS puro). ⚠️ NO confirmado en el diseño Figma — decisión de producto. |
| **Reduced motion** | `prefers-reduced-motion: reduce` | Menú móvil sin transición, aparición instantánea. ♿ |

**Clasificación:**
- **Solo CSS:** hover/focus de items y CTA, sticky positioning si se opta por `position: sticky`.
- **Requiere JS:** drawer móvil (toggle, focus trap, ESC, body-scroll-lock), detección de item activo por URL.

---

## 8. Notas de rendimiento, accesibilidad y TODOs

### Performance
- ✅ Logo y CTA son above-the-fold pero pequeños — no son candidatos LCP, pero deben renderizarse sin layout shift.
- ⚠️ **Evitar CLS** reservando altura `122px` (desktop) y la equivalente mobile mediante CSS, NO esperando a que el JS cargue para definirla.
- ⚠️ Los SVG de iconos deben estar inline o pre-cargados para evitar parpadeo.
- ⚠️ Si se opta por sticky-on-scroll, usar `position: sticky` (CSS) en lugar de listener `scroll` para mejor rendimiento.

### Accesibilidad ♿
- `<header>` semántico como wrapper (no `<div>`).
- `<nav aria-label="Navegación principal">` envolviendo la lista de items.
- Cada `<li><a>` accesible por teclado en orden lógico.
- Botón hamburguesa: `<button aria-label="Abrir menú" aria-expanded="false" aria-controls="header-nav">`.
- Drawer móvil: focus trap mientras está abierto (Tab no debe escapar al body), cierre con ESC, botón de cierre interno con `aria-label="Cerrar menú"`.
- Iconos como único contenido de un enlace/botón: el contenedor lleva `aria-label`, el icono `alt=""` o `aria-hidden="true"`.
- Skip link "Saltar al contenido" debe existir antes del header (recomendado por EDS).
- Indicador "página actual" en nav items: `aria-current="page"` además del estilo visual.

### TODOs y ambigüedades
1. ⚠️ **Confirmar layout exacto** de tablet (768) y mobile (390) con `get_design_context` adicional sobre `3:6698` y `3:8462`.
2. ⚠️ **Confirmar diseño del drawer móvil abierto** — no hay screenshot del estado expandido. Decisión por defecto: full-screen overlay con lista vertical de items y CTA al fondo.
3. ⚠️ **Confirmar color hover** del CTA y de los nav items (no extraído del Figma — solo hay estado base).
4. ⚠️ **Decisión de producto:** ¿el header debe ser **sticky-on-scroll**? No queda claro en Figma (las maquetas son estáticas).
5. ⚠️ **Mostrar/ocultar buscador y perfil:** documentados como `boolean` en la sección 2 para flexibilidad. Validar si en producción siempre estarán visibles o si dependen de estado de login (en cuyo caso requieren JS dinámico).
6. ⚠️ El bloque existente `/blocks/header/` del boilerplate carga su contenido desde `/header.plain.html`. Se debe **respetar este patrón** y no romper compatibilidad con la convención EDS.
7. ⚠️ El sub-bloque `/blocks/header-navigation/` ya existe en el repo (sin contenido). Evaluar en Fase 2 si se reutiliza o se elimina.
