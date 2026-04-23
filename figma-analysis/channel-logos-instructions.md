# Instrucciones de Bloque: `channel-logos`
> **Generado por:** Figma Analyst
> **Archivo Figma:** MovistarPlus — `fileKey: 3gw50VHnWKIBmy03RYlgTl`
> **Nodos de referencia:**
> - Desktop 1280: `3:9089` (Section, h=247, y=2036)
> - Tablet 768: `3:5575` (h=281)
> - Mobile 390: `3:7309` (h=232)
> **Complejidad:** Simple
> **Requiere JS:** sí *(scroll horizontal con drag/swipe + autoplay opcional + accesibilidad de teclado)*
> **Modelo UE:** xwalk

---

## 1. Descripción funcional

Banda horizontal con scroll/marquee de **70+ logos de canales TV**. Encabezado a la izquierda en 2 líneas:
- **H2:** "Y más de 80 canales" — 36px Bold blanco con `letter-spacing: -0.53px`.
- **Subtitle:** "Entretenimiento, deportes y actualidad mundial a través de canales internacionales" — 20px Regular blanco con `opacity: 0.78`.

Debajo, una lista horizontal con `overflow: clip` (altura `120.22px`) que muestra logos de canales, cada uno como una **tarjeta `aspect-ratio: 3/2`** (180.34 × 120.22 px) con fondo `#1f1f1f` (token NUEVO `--color-card-bg-channel`), `border-radius: 5px`, padding interior `8px`, y dentro un logo `164.33 × 106.81 px`.

**En el Figma los items están posicionados con `position: absolute`** (left/right pixel-perfect), lo que en EDS se traducirá a un **scroll horizontal natural CSS** o un **carrusel/marquee infinito JS**.

**Logos detectados (selección):** Eurosport 1, Discovery, AXN, Warner TV, TCM, National Geographic, CNN Internacional, BBC World, CNBC, Euronews, TV5 Monde, Al Jazeera, Gol Play, AXN Movies, Mezzo, Wild, Cosmo, Calle 13, Be Mad, Ubeat, Star Channel, Comedy Central, Syfy, DMax, Neox, FDF, Mega Canal Movistar+, Trece, Mega, Energy, Disney Channel, Baby TV, Estrenos M+, Vamos M+, Originales M+, Documentales M+, Real Madrid TV, Ellas Vamos M+, Hits M+, Caza y Pesca, Eurosport 2, Teledeporte HD, A3 Series, Divinity, Ten, MTV, MTV 00s, Nova, DKiss, 24H, CGTN, France 24, Canal 11, Bloomberg, Negocios, DreamWorks, Nickelodeon, Nick Jr, Clan HD, Boing, Canal Sur, Telemadrid, TV3, ETB, ETB1, TV Galicia, Aragón Int, TV Extremadura Sat, La1, La2, Antena 3, Cuatro, Telecinco, La Sexta, El Toro TV, Vamos 2 M+...

---

## 2. Campos editables para Universal Editor (xwalk)

**Campos del contenedor raíz** (`id: channel-logos` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Encabezado | `heading` | `text` | `string` | sí | "Encabezado de la sección (H2)" |
| Subtítulo | `subtitle` | `text` | `string` | no | "Subtítulo descriptivo" |
| Modo de scroll | `scrollMode` | `select` (manual / auto-marquee) | `string` | sí | "Comportamiento del scroll horizontal" |
| Velocidad marquee | `marqueeSpeed` | `select` (lenta / media / rápida) | `string` | no | "Velocidad de marquee si autoMarquee está activo" |
| Logos | `logos` | `container` | `string` | sí | "Logos de canales" |

**Campos de cada logo** (`id: channel-logos-item` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Imagen del logo | `image` | `reference` (image) | `string` | sí | "Logo del canal (recomendado: SVG o PNG transparente)" |
| Nombre del canal | `name` | `text` | `string` | sí | "Nombre del canal (texto alt + tooltip)" |
| Enlace (opcional) | `link` | `aem-content` | `string` | no | "URL destino (página del canal). Vacío = no clicable." |

---

## 3. Estructura DOM

### ENTRADA — Matriz EDS

```
block.channel-logos
  └── div (fila 1: encabezado)
        ├── div (col 0: heading)
        │     └── <p> ← "Y más de 80 canales"
        └── div (col 1: subtitle)
              └── <p> ← "Entretenimiento, deportes y actualidad mundial..."
  └── div (fila 2: config — opcional)
        └── div (col 0)
              └── <p> ← "auto-marquee" / "manual"
  └── div (fila 3: logo 1)
        ├── div (col 0: image)
        │     └── <picture> ← logo entregado por EDS
        └── div (col 1: link — opcional)
              └── <p><a href="...">Nombre del canal</a></p>
  └── div (fila 4: logo 2) ← mismo patrón
  └── ... (70+ filas más)
```

> 📌 Cada fila a partir de la 3ª = 1 logo. Esta autoría puede ser **muy verbosa** (70+ filas). Alternativa recomendada: usar el patrón EDS de **fragmento dedicado** (ej. `/fragments/canales`) que el bloque carga vía `loadFragment()` y entrega como tabla pre-procesada.

> ⚠️ **DECISIÓN PARA UE Specialist (Fase 3):** evaluar si los 70+ logos se autoran inline (verboso pero auto-contenido) o como fragmento (mejor mantenibilidad, separación de responsabilidades).

### SALIDA — DOM decorado

```html
<div class="channel-logos block" data-block-name="channel-logos" data-block-status="loaded">
  <div class="channel-logos__header">
    <h2 class="channel-logos__heading">Y más de 80 canales</h2>
    <p class="channel-logos__subtitle">Entretenimiento, deportes y actualidad mundial a través de canales internacionales</p>
  </div>

  <div class="channel-logos__viewport" data-scroll-mode="auto-marquee">
    <ul class="channel-logos__track" role="list">
      <li class="channel-logos__item">
        <a href="/canales/eurosport-1" class="channel-logos__link" aria-label="Canal Eurosport 1">
          <picture>
            <img src="..." alt="Eurosport 1" loading="lazy" width="164" height="107">
          </picture>
        </a>
      </li>
      <li class="channel-logos__item">
        <a href="/canales/discovery" class="channel-logos__link" aria-label="Canal Discovery">
          <picture>
            <img src="..." alt="Discovery" loading="lazy" width="164" height="107">
          </picture>
        </a>
      </li>
      <!-- ... 68+ items más -->
    </ul>
  </div>
</div>
```

**Notas de transformación DOM:**
- Wrapping del listado con `<ul role="list">`.
- Cada item es un `<li>` con `<a>` envolvente (si `link` está autorado) o solo `<picture>` si no tiene enlace.
- `<picture>` con `<img>` (NO `<div>` con background-image — los logos son contenido informativo).
- El `data-scroll-mode` permite el JS leer la configuración para activar marquee/manual.

---

## 4. Tokens utilizados

| Propiedad CSS | Token |
|---|---|
| Padding sección (top) | `padding-top: 50px` |
| Padding heading (lateral) | `padding-inline: 63.23px` |
| H2 | `font-size: 36px / line-height: 38px / weight: bold / letter-spacing: -0.53px` (token NUEVO `--font-size-h2: 36px`) |
| Subtitle | `font-size: 20px / line-height: 22px / opacity: 0.78 / weight: regular` |
| Gap heading → subtitle | `padding-bottom: 5px` |
| Gap header → list | `12px` |
| Item: dimensiones | `aspect-ratio: 3/2 / max-width: 180.34px / min-width: 180.33px` |
| Item: fondo | `var(--color-card-bg-channel)` (NUEVO: `#1f1f1f`) |
| Item: border-radius | `var(--radius-button)` (5px) |
| Item: padding interno | `8px` |
| Logo interno: dimensiones | `width: 164.33px / height: 106.81px / border-radius: 5px` |
| Track: altura | `120.22px` |
| Track: overflow | `overflow-x: auto / overflow-y: clip` (manual) o `overflow: clip` con animación CSS (marquee) |

---

## 5. Gestión de imágenes y media

| Imagen | Origen | Tratamiento | Notas |
|---|---|---|---|
| **Logos de canales** (~70+) | Celda del bloque o fragmento → `<picture>` ya entregado por EDS | `loading="lazy"` + `width="164" height="107"` explícitos | NO above-the-fold (sección a y=2036). Recomendado **SVG transparente** para escalabilidad y peso. Si son PNG, deben ir en formato WebP con fallback. |

**Texto alternativo (`alt`):** nombre exacto del canal (ej. "Eurosport 1", "BBC World").

> ⚠️ Performance: 70+ imágenes lazy son aceptables si están fuera del viewport, pero si el scroll horizontal expone muchas a la vez puede haber un pequeño coste. Considerar IntersectionObserver para forzar `loading="eager"` solo a las primeras 5-6 visibles.

---

## 6. Comportamiento responsivo

### Desktop ≥ 1280px
- **Datos extraídos del nodo `3:9089`:** altura `247px`. Heading + scroll horizontal.

### Tablet 768px – 1279px
- **Nodo equivalente:** `3:5575` (h=281). Altura similar a desktop, sugiere mismo layout con scroll horizontal.
- **DATOS NO CONFIRMADOS POR get_design_context.**

### Mobile < 768px
- **Nodo equivalente:** `3:7309` (h=232). Altura similar a desktop, **mismo patrón scroll horizontal** (no se reorganiza a stack vertical — sería absurdo con 70+ items).
- **DATOS NO CONFIRMADOS POR get_design_context.**
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:7309` para confirmar tamaño de cada item card en mobile (probable que se mantengan en 180×120 o se reduzcan ligeramente).

---

## 7. Estados / interacciones

| Estado | Trigger | Comportamiento |
|---|---|---|
| **Scroll manual con drag** | mouse down + drag (desktop), touch swipe (mobile) | Scroll horizontal nativo del navegador. CSS: `scroll-snap-type: x mandatory` opcional para snap a logo. |
| **Scroll con teclado** | flechas izq/der cuando el track tiene focus | Requiere `tabindex="0"` en el `<ul>` y handler JS. ♿ |
| **Marquee automático (autoplay)** | configurado con `scrollMode="auto-marquee"` | Animación CSS `@keyframes` o JS con `requestAnimationFrame`. **Requiere JS si es infinite-loop** (clonar nodos para efecto sin "salto"). |
| **Pausa en hover** | mouse hover sobre el track (si auto-marquee) | `animation-play-state: paused`. ♿ requerido. |
| **Pausa en focus** | focus dentro del track (si auto-marquee) | Mismo comportamiento que hover. ♿ requerido. |
| **Reduced motion** | `prefers-reduced-motion: reduce` | **Desactivar marquee automático**, pasar a scroll manual. ♿ crítico. |
| **Hover sobre logo** | mouse hover | Posible escala o cambio de opacidad. ⚠️ NO extraído del Figma. |
| **Focus en enlace** | Tab/teclado | Outline visible WCAG 2.4.7. ♿ |

**Clasificación:**
- **Solo CSS:** scroll manual con `overflow-x: auto`, snap, animación de marquee básica.
- **Requiere JS:** marquee infinito (clonado de nodos), navegación por teclado (flechas), pausa con detección de focus interno, lazy-load avanzado con IntersectionObserver.

---

## 8. Notas de rendimiento, accesibilidad y TODOs

### Performance
- ⚠️ 70+ imágenes — usar `loading="lazy"` y formato WebP/SVG.
- ⚠️ Si se usa marquee con clonado de nodos para loop infinito, validar que el DOM no crece descontroladamente.
- ✅ `width`/`height` explícitos en cada `<img>` para evitar CLS.

### Accesibilidad ♿
- `<h2>` para el encabezado.
- `<ul role="list">` para el listado.
- Cada `<a>` con `aria-label="Canal {nombre}"` para contexto.
- Marquee automático **DEBE** respetar `prefers-reduced-motion`.
- Marquee automático **DEBE** pausarse en hover Y focus interno (WCAG 2.2.2).
- Si los logos NO son enlaces, el track entero debe ser navegable con teclado.
- Contraste de los logos sobre fondo `#1f1f1f`: depende del logo individual — verificar en QA.

### TODOs y ambigüedades
1. ⚠️ **Confirmar layout responsive** de tablet y mobile con `get_design_context`.
2. ⚠️ **Confirmar modo de scroll por defecto** con el cliente (manual con drag o auto-marquee).
3. ⚠️ **Confirmar si los logos son enlaces** clicables a página del canal o solo elementos visuales.
4. ⚠️ **70+ logos en el Figma** — confirmar la lista definitiva y orden con el cliente. Algunos parecen duplicados/variantes (Eurosport 1 / Eurosport 2 / Vamos / Vamos 2…).
5. ⚠️ **Decisión PUE Specialist:** ¿autoría inline (70+ filas en la tabla) o fragmento dedicado? Recomendación: fragmento.
6. ⚠️ **Hover state** de cada logo NO extraído del Figma.
