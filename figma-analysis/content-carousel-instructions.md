# Instrucciones de Bloque: `content-carousel`
> **Generado por:** Figma Analyst
> **Archivo Figma:** MovistarPlus — `fileKey: 3gw50VHnWKIBmy03RYlgTl`
> **Nodos de referencia:**
> - Desktop 1280: `3:9327`, `3:9407`, `3:9453`, `3:9505`, `3:9553`, `3:9637`, `3:9673` *(7 instancias en el frame Desktop)*
> - Adicionalmente posibles instancias variante: `3:9724` (gift cards) — ver decisión en sección 1
> - Tablet 768: `3:5820`, `3:5901`, `3:5945`, `3:6001`, `3:6047`, `3:6137`, `3:6176`
> - Mobile 390: `3:7552`, `3:7638`, `3:7686`, `3:7740`, `3:7790`, `3:7881`, `3:7925`
> **Complejidad:** Alta
> **Requiere JS:** sí *(navegación con flechas, swipe touch, teclado, autoplay opcional, scroll snapping)*
> **Modelo UE:** xwalk

---

## 1. Descripción funcional

> ⚠️ **DECISIÓN VINCULANTE del usuario (Fase 1, ronda 2):** UN ÚNICO bloque `content-carousel` parametrizado con variantes CSS modificadoras y campos UE controlables, en lugar de 5 bloques distintos. Documentar TODAS las variantes detectadas en el Figma.

Bloque genérico de **carrusel/grid de tarjetas de contenido** (películas, series, eventos deportivos). Aparece **7+ veces** en la home con configuraciones distintas. Estructura común:

- **Encabezado opcional** (heading 36px Bold + subtítulo opcional).
- **Track horizontal o grid** con tarjetas de contenido.
- Cada tarjeta: imagen de fondo + degradado inferior + caption corta (14px Regular blanco uppercase, `line-height: 15.75px`).
- Tarjeta variante "editorial": label de categoría (`#3588ff` 26px), heading grande blanco (30px), body explicativo (`#a9a9a9` 16px), CTA inferior con gradiente (`from-[#1a1a1a]`).

### Variantes detectadas

| Variante CSS | Nodo ejemplo | Layout | Descripción |
|---|---|---|---|
| `.content-carousel--mosaic` | `3:9327` (Deportes) | `display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 199px` con items de `row-span: 1 o 2` | Mosaico de tarjetas de altura mixta (199 / 224 / 448 px). 1 tarjeta editorial (DEPORTES + CTA "MÁS DEPORTES"). |
| `.content-carousel--portrait` | `3:9407`, `3:9505`, `3:9637`, `3:9673` *(probable)* | Scroll horizontal con cards verticales (relación ~2:3) | Pósters de series/películas. |
| `.content-carousel--landscape` | `3:9453`, `3:9553`, *(probable)* | Scroll horizontal con cards horizontales (relación 16:9 o ~3:2) | Episodios, programas, contenido en formato apaisado. |
| `.content-carousel--gift` | `3:9724` *(candidato)* | Scroll horizontal h=206 + edge gradient mask | Tarjetas regalo "Movistar Plus+, lo regalas y triunfas". Posiblemente NO sea content-carousel sino un bloque distinto — ver §8 TODOs. |

**Elementos comunes a TODAS las variantes:**
- Padding sección: `px-63.23 py-50` (px).
- Item: fondo `rgba(255,255,255,0.1)` (token NUEVO `--color-overlay-card`), `border-radius: 6px` (token NUEVO `--radius-card-content`), `overflow: clip`.
- Imagen fill + degradado bottom (linear `rgba(0,0,0,0.8)` → `rgba(0,0,0,0)` over 224px o ~50% del item).
- Caption: 14px Regular blanco uppercase con `line-height: 15.75px`.

**Variante editorial (presente en `mosaic` como item especial):**
- Fondo igual.
- Padding interno `20px`.
- Label categoría: 26px Regular `#3588ff` con `letter-spacing: -0.84px` (token NUEVO `--color-blue-link: #3588ff`, `--font-size-blue-label: 26px`).
- Heading: 30px Regular blanco, `letter-spacing: -0.97px`, `line-height: 29px`, en 3 líneas máx.
- Body: 16px Regular/Bold mezclado, `color: var(--color-text-grey-channel)` (NUEVO: `#a9a9a9`), `line-height: 17px`, `letter-spacing: -0.09px`.
- CTA inferior: fondo `var(--color-brand-blue)`, padding `8.5px 5px`, rounded 5px, texto 16px blanco uppercase, con gradiente sobre el CTA (`from-[#1a1a1a]` to transparent).

---

## 2. Campos editables para Universal Editor (xwalk)

**Campos del contenedor raíz** (`id: content-carousel` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Encabezado | `heading` | `text` | `string` | no | "Encabezado opcional (H2)" |
| Subtítulo | `subtitle` | `text` | `string` | no | "Subtítulo opcional" |
| Variante de layout | `variant` | `select` (mosaic / portrait / landscape) | `string` | sí | "Layout del carrusel" |
| Items por viewport | `itemsPerView` | `select` (3 / 4 / 5 / 6 / auto) | `string` | no | "Items visibles a la vez (no aplica a mosaic)" |
| Mostrar flechas | `showArrows` | `boolean` | `boolean` | no | "Mostrar flechas de navegación" |
| Autoplay | `autoplay` | `boolean` | `boolean` | no | "Autoplay del carrusel" |
| Items | `items` | `container` | `string` | sí | "Tarjetas de contenido" |

**Campos de cada item** (`id: content-carousel-item` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Tipo de tarjeta | `cardType` | `select` (image / editorial) | `string` | sí | "Tipo: imagen normal o tarjeta editorial con CTA" |
| Imagen | `image` | `reference` (image) | `string` | sí | "Imagen del contenido" |
| Texto alt | `imageAlt` | `text` | `string` | sí | "Texto alternativo de la imagen" |
| Caption | `caption` | `text` | `string` | no | "Caption inferior (uppercase). Solo cardType=image" |
| Enlace | `link` | `aem-content` | `string` | no | "URL destino al click" |
| Span de filas | `rowSpan` | `select` (1 / 2) | `string` | no | "Span de filas (solo variant=mosaic)" |
| Span de columnas | `colSpan` | `select` (1 / 2) | `string` | no | "Span de columnas (solo variant=mosaic)" |
| Label categoría | `editorialLabel` | `text` | `string` | no | "Label superior. Solo cardType=editorial" |
| Heading editorial | `editorialHeading` | `text` | `string` | no | "Heading principal. Solo cardType=editorial" |
| Body editorial | `editorialBody` | `richtext` | `string` | no | "Texto descriptivo. Solo cardType=editorial" |
| CTA texto | `ctaText` | `text` | `string` | no | "Texto del CTA. Solo cardType=editorial" |
| CTA enlace | `ctaLink` | `aem-content` | `string` | no | "URL del CTA. Solo cardType=editorial" |

---

## 3. Estructura DOM

### ENTRADA — Matriz EDS

```
block.content-carousel.content-carousel--mosaic  (clase variant aplicada por el autor)
  └── div (fila 1: encabezado — opcional)
        ├── div (col 0: heading)
        │     └── <p> ← "Cada jornada, fútbol y lo mejor del deporte"  (puede estar vacío)
        └── div (col 1: subtitle)
              └── <p> ← (vacío o subtítulo)
  └── div (fila 2: config — opcional)
        └── div (col 0: variant)
              └── <p> ← "mosaic" / "portrait" / "landscape"
  └── div (fila 3: item 1 — image card)
        ├── div (col 0: cardType)
        │     └── <p> ← "image"
        ├── div (col 1: image)
        │     └── <picture> ← imagen
        ├── div (col 2: caption)
        │     └── <p> ← "LALIGA EA SPORTS · EL PARTIDO MOVISTAR PLUS+: GETAFE-BARCELONA, 25 ABR."
        ├── div (col 3: link)
        │     └── <p><a href="..."></a></p>
        └── div (col 4: rowSpan/colSpan — solo mosaic)
              └── <p> ← "2"
  └── div (fila 4..N: más items image)
  └── div (fila N+1: editorial card)
        ├── div (col 0: cardType)
        │     └── <p> ← "editorial"
        ├── div (col 1: editorialLabel)
        │     └── <p> ← "DEPORTES"
        ├── div (col 2: editorialHeading)
        │     └── <p> ← "Cada jornada, fútbol y lo mejor del deporte"
        ├── div (col 3: editorialBody)
        │     ├── <p>Disfruta del mejor fútbol: cada jornada <strong>el partido Movistar Plus+</strong>...</p>
        │     └── <p>...</p>
        ├── div (col 4: ctaText)
        │     └── <p> ← "MÁS DEPORTES"
        └── div (col 5: ctaLink)
              └── <p><a href="/deportes"></a></p>
```

### SALIDA — DOM decorado (variante `mosaic`)

```html
<div class="content-carousel content-carousel--mosaic block" data-block-name="content-carousel" data-block-status="loaded" data-variant="mosaic">

  <!-- Encabezado opcional -->
  <header class="content-carousel__header">
    <h2 class="content-carousel__heading">Cada jornada, fútbol y lo mejor del deporte</h2>
  </header>

  <ul class="content-carousel__track" role="list">

    <!-- Item editorial (DEPORTES) -->
    <li class="content-carousel__item content-carousel__item--editorial" style="--row-span:2; --col-span:1;">
      <article class="card card--editorial">
        <p class="card__label">DEPORTES</p>
        <h3 class="card__heading">Cada jornada, fútbol y lo mejor del deporte</h3>
        <div class="card__body">
          <p>Disfruta del mejor fútbol: cada jornada <strong>el partido Movistar Plus+</strong> de <strong>LALIGA EA SPORTS</strong>, <strong>toda LALIGA HYPERMOTION</strong>...</p>
        </div>
        <a href="/deportes" class="card__cta button">MÁS DEPORTES</a>
      </article>
    </li>

    <!-- Items de tipo image -->
    <li class="content-carousel__item" style="--row-span:2;">
      <a href="/lal-eaports/getafe-barcelona" class="card card--image">
        <picture class="card__media">
          <img src="..." alt="Getafe vs Barcelona, LALIGA EA SPORTS, 25 abril" loading="lazy">
        </picture>
        <div class="card__overlay" aria-hidden="true"></div>
        <p class="card__caption">LALIGA EA SPORTS · EL PARTIDO MOVISTAR PLUS+: GETAFE-BARCELONA, 25 ABR.</p>
      </a>
    </li>

    <li class="content-carousel__item">
      <a href="/tenis/mutua-madrid-open" class="card card--image">
        <picture class="card__media">
          <img src="..." alt="Mutua Madrid Open" loading="lazy">
        </picture>
        <div class="card__overlay" aria-hidden="true"></div>
        <p class="card__caption">LO MEJOR DEL MUTUA MADRID OPEN, 20 ABR. AL 3 MAY.</p>
      </a>
    </li>

    <!-- ... más items -->

  </ul>

  <!-- Botones de navegación (solo si showArrows=true y variant != mosaic) -->
  <button type="button" class="content-carousel__arrow content-carousel__arrow--prev" aria-label="Anterior">‹</button>
  <button type="button" class="content-carousel__arrow content-carousel__arrow--next" aria-label="Siguiente">›</button>
</div>
```

**Notas de transformación DOM:**
- Wrapping con `<ul role="list">` para el track.
- Cada item es un `<li>` con `<article class="card">` dentro.
- Variantes `mosaic` usan CSS Grid; variantes `portrait`/`landscape` usan flex con scroll horizontal.
- Items con `<a>` envolvente si tienen `link`; si no, solo `<article>` sin enlace.
- Degradado inferior implementado con un `<div class="card__overlay">` posicionado absoluto y `aria-hidden="true"`.
- Botones de navegación inyectados por el JS (no presentes en DOM de entrada).

---

## 4. Tokens utilizados

| Propiedad CSS | Token |
|---|---|
| Padding sección | `padding: 50px 63.23px` |
| Heading H2 | `font-size: 36px / weight: bold / color: var(--color-white) / letter-spacing: -0.53px` |
| Item: fondo | `var(--color-overlay-card)` (NUEVO: `rgba(255,255,255,0.1)`) |
| Item: border-radius | `var(--radius-card-content)` (NUEVO: `6px`) |
| Track gap (mosaic) | `25.6px` |
| Track gap (carousel) | `~16px` ⚠️ aproximado, no extraído |
| Item caption | `font-size: 14px / line-height: 15.75px / weight: regular / text-transform: uppercase / color: var(--color-white)` |
| Card editorial label | `font-size: 26px / line-height: 28px / color: var(--color-blue-link)` (NUEVO: `#3588ff`) `/ letter-spacing: -0.84px` |
| Card editorial heading | `font-size: 30px / line-height: 29px / color: var(--color-white) / letter-spacing: -0.97px / weight: regular` (token NUEVO `--font-size-h3-deportes: 30px`) |
| Card editorial body | `font-size: 16px / line-height: 17px / color: var(--color-text-grey-channel)` (NUEVO: `#a9a9a9`) `/ letter-spacing: -0.09px` |
| Card editorial CTA | `background: var(--color-brand-blue) / padding: 8.5px 5px / border-radius: 5px / font-size: 16px / color: var(--color-white) / text-transform: uppercase` |
| Gradiente bottom | `linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)` |
| Gradiente CTA editorial | `linear-gradient(to top, rgba(26,26,26,0) 0%, #1a1a1a 100%)` |

---

## 5. Gestión de imágenes y media

| Imagen | Origen | Tratamiento | Notas |
|---|---|---|---|
| **Imagen de tarjeta** | Celda del bloque → `<picture>` ya entregado por EDS | `loading="lazy"` + `width`/`height` explícitos | NO above-the-fold (la primera instancia está a y=2700+). Imágenes de contenido editorial (pósters, frames de programas) — `alt` debe ser descriptivo. |

> 📌 Las imágenes en este bloque vienen del **catálogo de contenido** del cliente. Es probable que se autoren como `<img>` con URL de un CDN externo o como `aem-content` referencia.

---

## 6. Comportamiento responsivo

### Desktop ≥ 1280px
- **Datos extraídos del nodo `3:9327`:** padding `px-63.23 py-50`, grid 4 columnas con gap 25.6px y filas de altura mixta (199/223.38/199.01).

### Tablet 768px – 1279px
- **Nodos equivalentes:** `3:5820` (h=1145.7), `3:5901` (h=1033), `3:5945` (h=336), `3:6001` (h=1014), `3:6047` (h=485), `3:6137` (h=976), `3:6176` (h=996).
- Las alturas variables sugieren que la **variante mosaic** se reorganiza a 2 columnas (mayor altura), y las variantes `portrait`/`landscape` se mantienen en scroll horizontal con menos items por viewport.
- **DATOS NO CONFIRMADOS POR get_design_context.**

### Mobile < 768px
- **Nodos equivalentes:** `3:7552` (h=1341.1), `3:7638` (h=1151), `3:7686` (h=345), `3:7740` (h=1111), `3:7790` (h=416), `3:7881` (h=1091), `3:7925` (h=1093).
- Comportamiento esperado: **scroll horizontal con 1.5-2 items visibles**, peek del siguiente item visible para indicar swipe.
- **DATOS NO CONFIRMADOS POR get_design_context.**
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre al menos `3:7552` (mosaic) y `3:7638` (carrusel) para confirmar tamaño y layout.

---

## 7. Estados / interacciones

| Estado | Trigger | Comportamiento |
|---|---|---|
| **Hover sobre tarjeta image** | mouse hover | Posible escala (`scale(1.03)`) o cambio de overlay. ⚠️ NO extraído del Figma. |
| **Click sobre tarjeta** | mouse/teclado | Navega al `link` (página del contenido). |
| **Hover sobre flecha** | mouse hover | Cambio de fondo/opacidad. ⚠️ NO extraído del Figma. |
| **Click en flecha prev/next** | mouse/teclado | Scroll de N items (donde N depende de `itemsPerView`). **Requiere JS.** |
| **Swipe táctil** | touch (mobile/tablet) | Scroll horizontal nativo + scroll-snap. CSS solo. |
| **Drag con mouse** | mousedown + mousemove | Scroll horizontal por drag. **Requiere JS** (no nativo desktop). |
| **Navegación con teclado** | flechas izq/der cuando track tiene focus | **Requiere JS.** ♿ |
| **Autoplay** | configurado con `autoplay=true` | Cambio automático de slide cada N segundos. **Requiere JS.** |
| **Pausa autoplay en hover/focus** | mouse hover o focus interno | Pausar timer. ♿ requerido por WCAG 2.2.2. |
| **Reduced motion** | `prefers-reduced-motion: reduce` | Desactivar autoplay y animaciones de transición. ♿ |
| **Focus en tarjeta** | Tab/teclado | Outline visible WCAG 2.4.7. ♿ |

**Clasificación:**
- **Solo CSS:** layout grid (mosaic), scroll horizontal nativo (carousel), scroll-snap, swipe táctil, hover effects básicos.
- **Requiere JS:** flechas prev/next, drag con mouse, navegación por teclado, autoplay, pausas, focus management dentro del carrusel.

---

## 8. Notas de rendimiento, accesibilidad y TODOs

### Performance
- ⚠️ **Muchas imágenes** (la home tiene 7+ instancias × ~6-8 cards cada una = 40-60 imágenes lazy). Mantener `loading="lazy"` estricto.
- ⚠️ Si hay autoplay, usar `requestAnimationFrame` o CSS `@keyframes` (NO `setInterval` de JS pesado).
- ✅ `width`/`height` explícitos en cada `<img>` para evitar CLS.

### Accesibilidad ♿
- `<ul role="list">` para el track.
- Cada `<li>` con `<article>` semántico.
- Caption descriptivo y `<img alt="">` informativo.
- Flechas con `<button aria-label="Anterior" / "Siguiente">`.
- Si autoplay: respetar `prefers-reduced-motion` y pausar en hover/focus.
- Tarjeta editorial: `<h3>` para el heading, no usar `<h2>` (ya hay un `<h2>` global por bloque).
- Indicador de scroll (dots opcionales) accesible por teclado si presente.

### TODOs y ambigüedades
1. ⚠️ **Confirmar variante de cada instancia** (`3:9327`, `3:9407`, `3:9453`, `3:9505`, `3:9553`, `3:9637`, `3:9673`) con `get_design_context` adicional para mapear el `variant` correcto a cada una.
2. ⚠️ **`3:9724` ("Movistar Plus+, lo regalas y triunfas")** — pendiente confirmar si encaja en este bloque como `--gift` o si requiere su propio bloque (ver `cta-price-band-instructions.md`).
3. ⚠️ **Confirmar layout responsive** de tablet y mobile con `get_design_context`.
4. ⚠️ **Hover state** de tarjetas y flechas NO extraído del Figma.
5. ⚠️ **Decisión de producto:** ¿la variante `mosaic` se autoriza solo en escritorio (alto valor visual) o también en mobile (con reorganización)?
6. ⚠️ **Decisión de UE Specialist:** la cantidad de campos por item es alta (16+ campos). Evaluar si se simplifica con `cardType` controlando visibilidad condicional de campos en el editor.
7. ⚠️ **Imágenes externas:** si vienen de un CDN del catálogo de contenido del cliente, se requerirá whitelisting en `helix-config.yaml` y verificación de que `optimized-picture` no rompe URLs externas.
