# Instrucciones de Bloque: `hero-carousel`
> **Generado por:** Figma Analyst
> **Archivo Figma:** MovistarPlus — `fileKey: 3gw50VHnWKIBmy03RYlgTl`
> **Nodos de referencia:**
> - Desktop 1280: `3:8557` (Section) → `3:8559` (List = carrusel) → `3:8560` (Item 1)
> - Tablet 768: `3:5060` (Section)
> - Mobile 390: `3:6793` (Section)
> **Complejidad:** Alta
> **Requiere JS:** sí *(carrusel con dots + autoplay opcional + swipe táctil)*
> **Modelo UE:** xwalk

---

## 1. Descripción funcional

Carrusel hero **above-the-fold** que ocupa el 100% del ancho del viewport. Cada slide muestra un contenido editorial promocional de Movistar Plus+ (película, serie o evento deportivo) con:

- Imagen de fondo a sangre (con gradiente oscuro en la mitad inferior para legibilidad).
- Logo o título tipográfico del contenido (puede ser una imagen-título personalizada por slide, ej. "LABERINTO EN LLAMAS" como logo SVG, o un heading textual).
- Heading + descripción del contenido.
- Bloque de precio (precio entero grande + decimales + leyenda "MES imp. incl.").
- CTA primario "SUSCRIBIRME AHORA" (azul, full-width en mobile).
- Texto disclaimer "Precio final. Sin permanencia.".
- Paginación con **dots** en esquina inferior derecha (5 slides detectados).

Es el primer componente visible al cargar la home. La imagen del slide activo es **candidata a LCP**.

---

## 2. Campos editables para Universal Editor (xwalk)

**Campos del contenedor raíz** (`id: hero-carousel` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Items del carrusel | `items` | `container` | `string` | sí | "Slides del carrusel" |
| Reproducción automática | `autoplay` | `boolean` | `boolean` | no | "Activar reproducción automática" |
| Intervalo (ms) | `autoplayInterval` | `number` | `string` | no | "Intervalo de auto-avance (ms)" |

**Campos de cada item** (`id: hero-carousel-item` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Imagen de fondo | `backgroundImage` | `reference` (image) | `string` | sí | "Imagen de fondo" |
| Texto alternativo | `backgroundImageAlt` | `text` | `string` | sí | "Texto alternativo (alt) de la imagen" |
| Imagen-título (logo) | `titleImage` | `reference` (image) | `string` | no | "Imagen del título / logo (opcional)" |
| Texto alternativo del logo | `titleImageAlt` | `text` | `string` | no *(requerido si `titleImage` presente)* | "Alt del logo del título" |
| Heading | `heading` | `text` | `string` | sí | "Titular" |
| Descripción | `description` | `richtext` | `string` | sí | "Descripción / subtítulo" |
| Precio entero | `priceInteger` | `text` | `string` | sí | "Precio (parte entera, ej. 9)" |
| Precio decimales | `priceDecimal` | `text` | `string` | sí | "Precio (decimales, ej. ,99€)" |
| Sufijo precio | `priceSuffix` | `text` | `string` | no | "Sufijo precio (ej. MES imp. incl.)" |
| Texto del CTA | `ctaText` | `text` | `string` | sí | "Texto del botón CTA" |
| Enlace del CTA | `ctaLink` | `aem-content` | `string` | sí | "Enlace destino del CTA" |
| Disclaimer | `disclaimer` | `text` | `string` | no | "Texto de aviso legal bajo el CTA" |

> ⚠️ **Decisión pendiente para Fase 3 (UE & QA Specialist):** la pareja `priceInteger` + `priceDecimal` se podría unificar en un solo campo `price` con parsing en JS, pero se separan aquí porque el diseño aplica tipografías DIFERENTES a la parte entera (`64px`) y la decimal (`38px`). Mantener separados facilita la edición sin lógica JS extra.

---

## 3. Estructura DOM

### ENTRADA — Matriz EDS (lo que `decorate(block)` recibe)

El bloque se autora como una tabla de 1 columna × N filas, donde cada fila contiene los datos de un slide. Para soportar todos los campos editables, la tabla tendrá **1 columna por campo principal** (estructura recomendada: cada slide ocupa 8 filas consecutivas con etiquetas de campo en una primera columna, o cada slide es un sub-bloque/contenedor reconocido por el bloque del padre con la palabra clave `hero-carousel-item`).

> 📌 **Patrón recomendado:** usar el mecanismo de **bloques anidados** de EDS — el bloque `hero-carousel` contiene N sub-bloques `hero-carousel-item` (uno por slide). Esto se traduce en el DOM como divs anidados con la siguiente forma:

```
block.hero-carousel
  └── div (fila 1 → wrapper de items)
        └── div (col 0 → contenedor de items repetidos)
              ├── div (item 1 — un sub-bloque hero-carousel-item)
              │     └── div (fila 1 del item: imagen)
              │     │     └── div (col 0)
              │     │           └── <picture> ← imagen entregada por EDS
              │     ├── div (fila 2 del item: texto alt imagen)
              │     │     └── div (col 0)
              │     │           └── <p> ← texto alternativo
              │     ├── div (fila 3 del item: imagen-título / logo)
              │     │     └── div (col 0)
              │     │           └── <picture> ← logo entregado por EDS (opcional)
              │     ├── div (fila 4 del item: heading)
              │     │     └── div (col 0)
              │     │           └── <h1> o <h2> ← según nivel del documento
              │     ├── div (fila 5 del item: descripción)
              │     │     └── div (col 0)
              │     │           └── <p> ← texto plano (puede contener <strong> si rich text)
              │     ├── div (fila 6 del item: precio entero)
              │     │     └── div (col 0)
              │     │           └── <p> ← texto "9"
              │     ├── div (fila 7 del item: precio decimal)
              │     │     └── div (col 0)
              │     │           └── <p> ← texto ",99€"
              │     ├── div (fila 8 del item: sufijo precio)
              │     │     └── div (col 0)
              │     │           └── <p> ← texto "MES imp. incl."
              │     ├── div (fila 9 del item: CTA)
              │     │     └── div (col 0)
              │     │           └── <p><a href="...">SUSCRIBIRME AHORA</a></p>
              │     └── div (fila 10 del item: disclaimer)
              │           └── div (col 0)
              │                 └── <p> ← "Precio final. Sin permanencia."
              ├── div (item 2 — mismo patrón)
              ├── div (item 3 — mismo patrón)
              ├── div (item 4 — mismo patrón)
              └── div (item 5 — mismo patrón)
```

> ⚠️ **NOTA al EDS Developer (Fase 2):** la estructura exacta de filas/columnas dentro de cada `hero-carousel-item` es susceptible de simplificación. La lista de arriba prioriza explicitud sobre concisión. El Developer puede optar por una variante más densa (varias columnas por fila) tras validar con el `_hero-carousel.json` de Fase 3. El **contrato firme** son los **nombres de los campos** documentados en la sección 2, no la geometría de la tabla.

### SALIDA — DOM decorado (lo que `decorate(block)` produce)

```html
<div class="hero-carousel block" data-block-name="hero-carousel" data-block-status="loaded">
  <ul class="hero-carousel__track" role="region" aria-roledescription="carrusel" aria-label="Contenido destacado">

    <li class="hero-carousel__slide is-active" aria-hidden="false">
      <!-- Imagen de fondo (LCP en slide activo) -->
      <picture class="hero-carousel__bg">
        <source srcset="..." media="(min-width: 1280px)">
        <source srcset="..." media="(min-width: 768px)">
        <img src="..." alt=""
             loading="eager"
             fetchpriority="high"
             decoding="async"
             class="hero-carousel__bg-img">
      </picture>
      <!-- Gradiente overlay -->
      <div class="hero-carousel__gradient" aria-hidden="true"></div>

      <!-- Contenido textual -->
      <div class="hero-carousel__content">
        <!-- Logo del contenido (opcional) -->
        <picture class="hero-carousel__title-img">
          <img src="..." alt="LABERINTO EN LLAMAS" loading="eager">
        </picture>

        <h2 class="hero-carousel__heading">Basada en hechos reales</h2>
        <p  class="hero-carousel__description">Protagonizada por Matthew McConaughey</p>

        <div class="hero-carousel__price">
          <span class="hero-carousel__price-int">9</span><!--
       --><span class="hero-carousel__price-dec">,99€</span>
          <span class="hero-carousel__price-suffix">MES imp. incl.</span>
        </div>

        <a href="/suscribirse" class="hero-carousel__cta button">SUSCRIBIRME AHORA</a>

        <p class="hero-carousel__disclaimer">Precio final. Sin permanencia.</p>
      </div>
    </li>

    <li class="hero-carousel__slide" aria-hidden="true"> ... </li>
    <li class="hero-carousel__slide" aria-hidden="true"> ... </li>
    <li class="hero-carousel__slide" aria-hidden="true"> ... </li>
    <li class="hero-carousel__slide" aria-hidden="true"> ... </li>
  </ul>

  <!-- Paginación (dots) -->
  <nav class="hero-carousel__nav" aria-label="Paginación del carrusel">
    <button type="button" class="hero-carousel__dot is-active" aria-label="Slide 1" aria-current="true"></button>
    <button type="button" class="hero-carousel__dot" aria-label="Slide 2"></button>
    <button type="button" class="hero-carousel__dot" aria-label="Slide 3"></button>
    <button type="button" class="hero-carousel__dot" aria-label="Slide 4"></button>
    <button type="button" class="hero-carousel__dot" aria-label="Slide 5"></button>
  </nav>

  <!-- Controles prev/next (opcional, solo desktop) -->
  <button type="button" class="hero-carousel__btn hero-carousel__btn--prev" aria-label="Slide anterior"></button>
  <button type="button" class="hero-carousel__btn hero-carousel__btn--next" aria-label="Slide siguiente"></button>
</div>
```

**Notas de transformación DOM aplicadas por `decorate()`:**
- Se reorganizan los hijos de cada `hero-carousel-item` en una estructura semántica (`<li>` con `<picture>`, `<h2>`, `<p>`, `<a>`).
- Se inyectan los nodos UI nuevos: `<ul>`, paginación `<nav>` con `<button>` por dot, controles prev/next.
- Se añade `loading="eager"` + `fetchpriority="high"` SOLO al slide inicial (LCP). Los demás slides reciben `loading="lazy"`.
- Los `<picture>` ya vienen entregados por EDS (origen: celda del bloque). El Developer NO debe regenerarlos con `createOptimizedPicture` — solo gestionar atributos LCP/lazy y mover los nodos al lugar adecuado del slide.

---

## 4. Tokens utilizados

Referencias a `global-tokens.md`:

| Propiedad CSS | Token |
|---|---|
| Color de texto principal | `var(--color-white)` |
| Color disclaimer | `var(--color-text-disclaimer)` (#adadad) |
| Color sufijo precio | `var(--color-text-muted)` (#a6a6a6) |
| Fondo del CTA | `var(--color-brand-blue)` (#0066ff) |
| Texto del CTA | `var(--color-white)` |
| Border-radius CTA | `var(--radius-button)` (5px) |
| Familia tipográfica | `var(--font-family-primary)` |
| Heading hero | `font-size: var(--font-size-h1)` (40px) / `line-height: 42px` / `letter-spacing: -0.51px` / `font-weight: var(--font-weight-bold)` |
| Body | `font-size: var(--font-size-body-lg)` (20px) / `line-height: 24px` |
| Precio entero | `font-size: var(--font-size-display)` (64px) / `line-height: 48px` |
| Precio decimal | `font-size: var(--font-size-display-decimal)` (38px) / `line-height: 28.5px` / `letter-spacing: -1.26px` |
| Sufijo precio | `font-size: var(--font-size-small)` (14px) |
| Disclaimer | `font-size: var(--font-size-body)` (15px) / `line-height: 17px` |
| CTA | `font-size: var(--font-size-body-lg)` (20px) / `letter-spacing: -0.44px` / `text-transform: uppercase` |
| Gradiente overlay | `background: var(--gradient-hero-overlay)` |

---

## 5. Gestión de imágenes y media

| Imagen | Origen | Tratamiento | Notas |
|---|---|---|---|
| **Imagen de fondo del slide activo** | Celda del bloque → `<picture>` ya entregado por EDS | `loading="eager"` + `fetchpriority="high"` + `decoding="async"` | ✅ **CANDIDATA A LCP** confirmada — está above-the-fold en los 3 viewports (Desktop 600px alto, Tablet ~1526px alto en stack vertical, Mobile ~770px alto en stack vertical) |
| **Imágenes de fondo de slides 2-5** | Celda del bloque → `<picture>` ya entregado por EDS | `loading="lazy"` + `decoding="async"` | El primer renderizado solo necesita el slide 1; el resto se carga bajo demanda |
| **Imagen-título / logo del contenido** (opcional) | Celda del bloque → `<picture>` ya entregado por EDS | `loading="eager"` SOLO para slide activo, `lazy` para resto | Es un PNG/SVG transparente (logo del título) sobre el gradiente |

**Proporciones detectadas (de la imagen de fondo):**
- Desktop 1280: 1280 × 600 (ratio ≈ 2.13:1, formato landscape muy ancho)
- Tablet 768: ⚠️ ratio NO confirmado por `get_design_context` adicional — pendiente
- Mobile 390: ⚠️ ratio NO confirmado — pendiente

**Breakpoints recomendados para `<source>` dentro de `<picture>`:**
```html
<picture>
  <source srcset="hero-1280w.webp" media="(min-width: 1280px)" type="image/webp">
  <source srcset="hero-768w.webp"  media="(min-width: 768px)"  type="image/webp">
  <source srcset="hero-390w.webp"                              type="image/webp">
  <img src="hero-fallback.jpg" alt="..." loading="eager" fetchpriority="high">
</picture>
```

**Texto alternativo (`alt`):** debe ser proporcionado por el autor en el campo `backgroundImageAlt`. ♿ Si la imagen es decorativa porque toda la información clave ya aparece como texto en `heading`/`description`, el autor debe poder dejarlo vacío (`alt=""`).

---

## 6. Comportamiento responsivo

### Desktop ≥ 1280px
- **Layout:** imagen de fondo a sangre (1280 × 600). Contenido textual posicionado a la **izquierda**, ocupando `max-width: 704px`, padding-left `64px`, padding-bottom `50px`. El gradiente oscuro va de **izquierda → derecha** y de **abajo → arriba** para garantizar legibilidad.
- **CTA:** ancho según contenido (min `230px`, max `452px`).
- **Dots de paginación:** esquina inferior derecha.
- **Controles prev/next:** visibles a izquierda y derecha del slide.

### Tablet 768px – 1279px
- **Layout:** ⚠️ **DATOS NO CONFIRMADOS POR get_design_context — basado en screenshot del frame 3:5060.**
  Visualmente la altura del slide aumenta (~1526px en el frame Figma) y el contenido textual parece colocarse **debajo** o **superpuesto al borde inferior** de la imagen, en stack vertical en lugar de columna.
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:5060` para confirmar paddings, font-sizes y posicionamiento exactos.
- **CTA:** posiblemente full-width al ancho del contenedor con padding lateral.

### Mobile < 768px (390px de referencia)
- **Layout:** ⚠️ **DATOS NO CONFIRMADOS POR get_design_context — basado en screenshot del frame 3:6793.**
  Stack vertical: imagen arriba, texto debajo (o superpuesto al borde inferior con gradiente fuerte). Altura ~770px.
- **CTA:** full-width (100% del contenedor con padding lateral).
- **Dots:** centrados o esquina derecha (a confirmar).
- **Controles prev/next:** ocultos en mobile (interacción por swipe táctil).
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:6793` para confirmar paddings, tamaños de fuente reducidos, y orden visual exacto.

> ⚠️ **POSICIÓN LCP CONFIRMADA en los 3 viewports** — la imagen del slide activo siempre está above-the-fold (altura del hero ≥ 600px en todos los casos, viewport visible mínimo ~700px en mobile estándar).

---

## 7. Estados / interacciones

| Estado | Trigger | Comportamiento |
|---|---|---|
| **Hover sobre CTA** | mouse hover (desktop) | Oscurecer fondo del botón (CSS) — propuesta `filter: brightness(0.9)` o `background-color: #0052cc`. ⚠️ Color hover NO extraído de Figma — pendiente confirmación. |
| **Focus sobre CTA** | navegación por teclado | Outline visible WCAG 2.4.7 — `outline: 2px solid var(--color-white); outline-offset: 2px;`. ♿ Crítico para accesibilidad. |
| **Hover sobre dot** | mouse hover | Aumentar opacidad/escala del dot inactivo (CSS). |
| **Click sobre dot** | mouse click / Enter | Ir al slide N. **Requiere JS.** |
| **Click prev/next** | mouse click / Enter | Slide anterior/siguiente con animación de transición (slide o fade). **Requiere JS.** |
| **Swipe táctil** | gesto en pantalla táctil | Slide anterior/siguiente. **Requiere JS** (event listeners `touchstart`/`touchend`). |
| **Autoplay** | timer | Auto-avance cada N ms (configurable vía campo editable `autoplayInterval`). **Requiere JS.** Debe detenerse al hacer hover/focus en el carrusel (♿ WCAG 2.2.2). |
| **Reduced motion** | `prefers-reduced-motion: reduce` | Desactivar autoplay y reducir/eliminar transiciones. ♿ Crítico. |

**Clasificación:**
- **Solo CSS:** hover/focus de botones y dots, gradiente, layout responsive.
- **Requiere JS:** navegación entre slides (dots, prev/next, swipe), autoplay, anuncio de cambio de slide para lectores de pantalla.

---

## 8. Notas de rendimiento, accesibilidad y TODOs

### Performance
- ✅ Imagen del slide 1 marcada como LCP (`loading="eager"` + `fetchpriority="high"`).
- ✅ Imágenes de slides 2-5 con `loading="lazy"` para no penalizar LCP.
- ⚠️ Si se usa autoplay, considerar pausar la transición hasta que el LCP esté pintado (`window.addEventListener('load', ...)`).
- ⚠️ Pre-cargar el logo (imagen-título) del slide 1 si está presente, ya que también es above-the-fold.

### Accesibilidad ♿
- `<ul>` con `role="region"`, `aria-roledescription="carrusel"`, `aria-label="Contenido destacado"`.
- Cada `<li>` slide con `aria-hidden` reflejando estado (solo el activo `aria-hidden="false"`).
- Dots como `<button>` con `aria-label="Slide N"` y `aria-current="true"` en el activo.
- Controles prev/next con `aria-label` descriptivo.
- ♿ **Autoplay:** debe ofrecer mecanismo de pausa visible (botón pause/play) según WCAG 2.2.2 si el contenido se anima >5s.
- ♿ **Reduced motion:** respetar `prefers-reduced-motion`.
- ♿ **Contraste:** verificar contraste del texto blanco sobre cada imagen base (independientemente del gradiente). Imágenes con áreas claras pueden fallar AA.
- ♿ **Foco visible:** el outline del CTA y de los dots debe ser perceptible sobre fondo oscuro (usar color claro).

### TODOs y ambigüedades
1. ⚠️ Confirmar layout exacto de tablet (768) y mobile (390) con `get_design_context` adicional. Se requieren al menos 2 llamadas más al Figma MCP para completar la sección 6.
2. ⚠️ Confirmar color **hover** del CTA (no extraído del Figma — el diseño solo muestra el estado base).
3. ⚠️ Confirmar diseño de los **dots de paginación** (color activo/inactivo, tamaño, separación) — visibles en screenshot pero sin medidas extraídas.
4. ⚠️ Confirmar si los **controles prev/next** existen en el diseño Figma o son una invención del Analyst (en el screenshot Desktop no se ven explícitamente — podrían estar ocultos hasta hover).
5. ⚠️ Decisión de producto: ¿el carrusel debe llevar **autoplay activado por defecto**? Se ha incluido como campo editable `autoplay` con valor por defecto recomendado `false` por accesibilidad.
6. ⚠️ La pareja `priceInteger` + `priceDecimal` está separada por motivos de tipografía. Validar con UE Specialist en Fase 3 si es ergonómico para el autor.
7. ⚠️ El campo `titleImage` (logo del contenido) debe permitir **transparencia** (PNG/WebP). Documentar en la guía de autor.
