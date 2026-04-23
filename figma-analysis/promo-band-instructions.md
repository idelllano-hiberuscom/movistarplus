# Instrucciones de Bloque: `promo-band`
> **Generado por:** Figma Analyst
> **Archivo Figma:** MovistarPlus — `fileKey: 3gw50VHnWKIBmy03RYlgTl`
> **Nodos de referencia:**
> - Desktop 1280 — Variant A (`--with-image`): `3:9401` (Section, h=123.83, y=3055.90, w=1264.67)
>   - Picture (calendar): `3:9404` (91.25×77.83)
>   - Picture (background, estadio): asset `imgSection` (overflow, h=full, w=163.19%, left=-31.6%)
>   - Texto: `3:9406` ("CONSULTA CALENDARIO PRÓXIMAS COMPETICIONES")
> - Desktop 1280 — Variant B (`--plain`): `3:9755` (Section, h=116.33, y=7820.53, w=1264.67)
>   - Picture (BONO CULTURAL logo): `3:9758` (76.5×70.33)
>   - Texto: `3:9760` ("PROMOCIÓN · 12 MESES x 39€ CON TU BONO CULTURAL JOVEN")
> - Tablet 768 / Mobile 390: ⚠️ **TODO** — no extraídos en esta pasada (revisar frames `3:5536+` y `3:7270+` en próxima auditoría)
> **Complejidad:** Simple
> **Requiere JS:** no
> **Modelo UE:** xwalk

---

## 1. Descripción funcional

Banda horizontal **full-bleed** sobre el fondo negro de página con un overlay tenue blanco al 10 % (`rgba(255,255,255,0.1)`), que aporta una franja ligeramente más clara que el resto de la página. Contiene:

- Un **icono / logo** a la izquierda (≈65–95 px de lado).
- Un **texto en una línea** centrado verticalmente, con una **palabra/frase clave** convertida en **enlace azul subrayado** (`#3588ff`, token `--color-blue-link`).

Existen **2 variantes confirmadas**:

| Variante | Modificador CSS | Fondo decorativo | Icono | Texto + enlace |
|---|---|---|---|---|
| **A — With image** | `.promo-band--with-image` | Imagen decorativa de fondo (estadio/luces deportivas en azules) sobre el overlay blanco al 10 % | Pictograma de calendario blanco (91×78) | `CONSULTA `**`CALENDARIO PRÓXIMAS COMPETICIONES`** |
| **B — Plain** | `.promo-band--plain` (o sin modificador → default) | Sólo overlay blanco al 10 % sobre fondo de página negro | Logo "BONO CULTURAL" stylizado (76×70) | `PROMOCIÓN · 12 MESES x 39€ CON TU `**`BONO CULTURAL JOVEN`** |

> **Importante:** el bloque **NO contiene precio ni botón "Me interesa"**. La acción de conversión es el propio enlace embebido en el texto. No es un patrón "CTA + price band" — es un **promo banner inline**.

> **NOTA:** El texto en el Figma viene en mayúsculas en el contenido fuente (no es `text-transform: uppercase` aplicado por CSS). El autor en Universal Editor escribirá el texto **ya en mayúsculas**.

---

## 2. Campos editables para Universal Editor (xwalk)

**Single-row block.** No hay items repetibles. Una sola tabla.

**Campos del contenedor raíz** (`id: promo-band` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Variante | `variant` | `select` (opciones: `with-image`, `plain`) | `string` | sí | "Variante de fondo" |
| Imagen decorativa de fondo | `backgroundImage` | `reference` (image) | `string` | no | "Imagen decorativa de fondo (solo visible en variant=with-image)" |
| Texto alternativo del fondo | `backgroundImageAlt` | `text` | `string` | no | "Texto alternativo de la imagen de fondo (decorativa: dejar vacío para `alt=\"\"`)" |
| Icono o logo | `icon` | `reference` (image) | `string` | sí | "Icono o logo a la izquierda (≈65–95px)" |
| Texto alternativo del icono | `iconAlt` | `text` | `string` | sí | "Texto alternativo del icono" |
| Texto + enlace | `text` | `richtext` | `string` | sí | "Texto completo en una línea, con la palabra/frase clave envuelta en `<a href=\"…\">…</a>`" |

> **Decisión de mapeo Universal Editor / Phase 3 (a confirmar por UE Specialist):**
> - `variant` ⇒ panel-only (no aparece en DOM como celda). Se inyecta como **clase modificadora** en `<div class="promo-band">` (`promo-band--with-image` / `promo-band--plain`) por el filter de xwalk. El Developer la lee desde `block.classList`.
> - `backgroundImage` ⇒ **celda 0** del DOM (`<picture>` o vacío si la variante no la usa).
> - `backgroundImageAlt` y `iconAlt` ⇒ panel-only, propagados al `<img alt="…">` correspondiente vía xwalk model bindings.
> - `icon` ⇒ **celda 1** del DOM (`<picture>`).
> - `text` ⇒ **celda 2** del DOM (`<p>` con `<a>` embebido).

---

## 3. Estructura DOM

### ENTRADA — Matriz EDS (lo que `decorate(block)` recibe)

```
block (div.promo-band[.promo-band--with-image | .promo-band--plain])
  └── div                                      ← fila 1 (única fila, hijo directo de block)
        ├── div                                ← columna 0 — backgroundImage
        │     └── <picture>                    ← imagen decorativa entregada por EDS
        │         (cuando variant === "plain": columna VACÍA, sin <picture>)
        ├── div                                ← columna 1 — icono
        │     └── <picture>                    ← icono / logo entregado por EDS
        └── div                                ← columna 2 — texto con enlace embebido
              └── <p>                          ← texto principal
                    │ "CONSULTA "              ← nodo de texto plano
                    └── <a href="…">CALENDARIO PRÓXIMAS COMPETICIONES</a>
```

> ⚠️ **Recordatorio EDS:** EDS entrega siempre divs anidados. La columna 0 puede estar vacía (sin `<picture>`) cuando el autor no rellena `backgroundImage`. El Developer debe detectar el caso `col0.querySelector('picture') === null` y comportarse en consecuencia (no añadir clase `.promo-band__bg`, no mover nada).

### SALIDA — DOM decorado (lo que `decorate()` produce)

```html
<!-- Variante A: with-image -->
<div class="promo-band promo-band--with-image">
  <div class="promo-band__inner">
    <picture class="promo-band__bg">
      <source ... />
      <img alt="" loading="lazy" decoding="async" />
    </picture>
    <div class="promo-band__content">
      <picture class="promo-band__icon">
        <source ... />
        <img alt="Calendario de competiciones deportivas" loading="lazy" decoding="async" />
      </picture>
      <p class="promo-band__text">
        CONSULTA <a class="promo-band__link" href="/calendario-competiciones">CALENDARIO PRÓXIMAS COMPETICIONES</a>
      </p>
    </div>
  </div>
</div>

<!-- Variante B: plain (sin <picture> de fondo) -->
<div class="promo-band promo-band--plain">
  <div class="promo-band__inner">
    <div class="promo-band__content">
      <picture class="promo-band__icon">
        <source ... />
        <img alt="Bono Cultural Joven" loading="lazy" decoding="async" />
      </picture>
      <p class="promo-band__text">
        PROMOCIÓN · 12 MESES x 39€ CON TU <a class="promo-band__link" href="/bono-cultural-joven">BONO CULTURAL JOVEN</a>
      </p>
    </div>
  </div>
</div>
```

**Notas de decoración:**

- El Developer **decora** el DOM existente: añade clases, NO destruye los `<picture>` ni el `<p>` que EDS ya entregó.
- `promo-band__bg` se asigna sólo si la celda 0 contiene un `<picture>`.
- El `<a>` interno del texto ya viene generado por EDS dentro del `<p>`. El Developer sólo añade la clase `promo-band__link` (`block.querySelector('p > a')?.classList.add('promo-band__link')`).
- Wrapper `promo-band__inner` envuelve el contenido para limitarlo a `max-width: 51.25rem` (820 px Figma) y centrarlo, mientras la banda en sí ocupa el ancho completo de la página.

---

## 4. Variables CSS del bloque

Tokens propios (definir en `blocks/promo-band/promo-band.css`, referenciando los globales de `styles.css`):

```css
.promo-band {
  --promo-band-bg-overlay:      rgba(255, 255, 255, 0.1);   /* overlay blanco al 10% */
  --promo-band-text-color:      var(--color-text-primary, #fff);
  --promo-band-link-color:      var(--color-blue-link, #3588ff);
  --promo-band-font:            var(--font-family-apercu, 'ApercuMovistar', sans-serif);
  --promo-band-font-size:       1.3125rem;   /* 21px Figma */
  --promo-band-line-height:     1.575rem;    /* 25.2px Figma */
  --promo-band-letter-spacing:  -0.029em;    /* -0.47px sobre 21px */
  --promo-band-min-height:      7.25rem;     /* 116px (variant plain); variant with-image crece a ~124px de forma natural */
  --promo-band-content-max:     51.25rem;    /* 820px Figma */
  --promo-band-content-gap:     0.875rem;    /* 14px Figma (variant B: 14.2px, variant A: 13.75px → unificado a 14px) */
  --promo-band-icon-min:        4.0625rem;   /* 65px (mín. del aspect-ratio Figma) */
  --promo-band-icon-max:        5.6875rem;   /* 91px (icono más grande, variant A) */
}
```

> **Token global ya disponible:** `--color-blue-link: #3588ff` confirmado en `figma-analysis/global-tokens.md` (línea 254).
> **Token de fuente:** `--font-family-apercu` referenciado por el resto de bloques. Si no estuviera registrado en `styles.css`, ⚠️ TODO para Phase 3.

---

## 5. Auto-layouts → CSS

| Auto-layout Figma | CSS equivalente |
|---|---|
| Section `3:9401` / `3:9755` — vertical, items center, justify center, padding-inline 222.33/222.34 px | `.promo-band { display: flex; flex-direction: column; align-items: stretch; justify-content: center; min-height: var(--promo-band-min-height); position: relative; overflow: hidden; background-color: var(--promo-band-bg-overlay); }` |
| Inner `3:9402` / `3:9756` — horizontal, gap 14 px, items center, justify center, max-width 820 px | `.promo-band__inner { position: relative; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--promo-band-content-gap); width: 100%; max-width: var(--promo-band-content-max); margin-inline: auto; padding-inline: 1rem; }` |
| Container icono `3:9403` / `3:9757` — horizontal, items start, py-23 | `.promo-band__icon { display: block; flex: 0 0 auto; min-width: var(--promo-band-icon-min); max-width: var(--promo-band-icon-max); height: auto; }` |
| Container texto `3:9405` / `3:9759` — vertical, padding vertical asimétrico | `.promo-band__content { display: flex; flex: 1 1 auto; min-width: 10.625rem; align-items: center; }` (centrado vertical, padding gestionado por gap) |
| Imagen de fondo `imgSection` — absolute, w=163.19%, left=-31.6%, h=100% | `.promo-band__bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }` + `img { width: 100%; height: 100%; object-fit: cover; object-position: center; }` (no se replica el `163%/-31%` exacto: se usa `object-fit: cover` para responsive correcto). |
| Overlay blanco al 10 % (variant A) | El overlay vive en el contenedor raíz vía `background-color: var(--promo-band-bg-overlay)`. La imagen va en una capa `<picture>` por debajo del contenido pero por encima del fondo de página. Usar `z-index: 0` en `.promo-band__bg` y `z-index: 1` (o sin z-index pero declarado `position: relative`) en `.promo-band__inner`. |

---

## 6. Comportamiento responsivo

⚠️ **Datos sólo extraídos de Desktop 1280.** Las reglas siguientes son **propuesta razonada** del Analyst, a confirmar/ajustar cuando se auditen los frames Tablet 768 y Mobile 390.

- **Desktop (≥1024 px):** banner full-bleed, contenido centrado max 820 px, icono + texto en una sola línea.
- **Tablet (768–1023 px):** mantener layout horizontal; reducir `padding-inline` lateral del inner; el texto puede romper a 2 líneas si no cabe (`flex-wrap` ya cubierto por el `inner`).
- **Mobile (<768 px):** stack vertical (`flex-direction: column`) cuando el texto no quepa en una línea junto al icono; icono arriba (centrado), texto debajo (centrado, alineación left). Imagen de fondo (variant A): mantener `object-fit: cover`, posiblemente desplazar `object-position` hacia el centro o hacia el icono para que la luz brillante no quede recortada.

```css
@media (max-width: 47.9375rem) {
  .promo-band__inner {
    flex-direction: column;
    text-align: center;
  }
  .promo-band__text {
    font-size: 1rem; /* ⚠️ TODO: validar con frame Mobile 390 */
  }
}
```

---

## 7. Gestión de imágenes y media

| # | Imagen | Origen | Variante | LCP | Atributos recomendados |
|---|---|---|---|---|---|
| 1 | Fondo (estadio/luces) — Variant A | **Celda del bloque** ⇒ `<picture>` ya en DOM | `--with-image` | ❌ NO LCP — el bloque aparece a y≈3055 (muy por debajo del fold del viewport ≈600–800 px). | `loading="lazy"`, `decoding="async"`, `alt=""` (decorativa) |
| 2 | Icono calendario — Variant A | **Celda del bloque** ⇒ `<picture>` ya en DOM | `--with-image` | ❌ NO LCP | `loading="lazy"`, `decoding="async"`, `alt="Calendario de competiciones deportivas"` (texto desde `iconAlt`) |
| 3 | Logo BONO CULTURAL — Variant B | **Celda del bloque** ⇒ `<picture>` ya en DOM | `--plain` | ❌ NO LCP — el bloque aparece a y≈7820. | `loading="lazy"`, `decoding="async"`, `alt="Bono Cultural Joven"` (texto desde `iconAlt`) |

> ✅ **Ningún `<picture>` requiere `createOptimizedPicture`** — todos provienen de celdas del bloque y EDS los entrega ya construidos.
> ✅ **Ninguna imagen es candidata LCP** — ambas instancias del bloque están claramente below-the-fold en el flujo de la home.

**Ratios y formatos:**

- Imagen de fondo: ratio ≈ 1264:124 ≈ **10.2 : 1** (banda ultra panorámica). Recomendar a contenido suministrar en WebP de al menos 1920×190 px para ratios `2x`.
- Icono variant A (calendario): ratio 91.25 : 77.83 ≈ **1.17 : 1**. SVG preferible (es un pictograma).
- Logo variant B (BONO CULTURAL): ratio 76.5 : 70.33 ≈ **1.09 : 1**. SVG preferible (es un logotipo).

---

## 8. Interacciones y animaciones

**Estados detectados:** sólo `:hover` y `:focus-visible` sobre el enlace embebido. No hay animaciones, no hay estados activos detectables en Figma.

| Estado | Descripción | Implementación |
|---|---|---|
| Default `<a>` | Color `#3588ff`, subrayado sólido | `color: var(--promo-band-link-color); text-decoration: underline; text-decoration-skip-ink: none;` |
| Hover `<a>` | ⚠️ NO especificado en Figma — propuesta: subrayado se engrosa o se aclara el color | `&:hover { text-decoration-thickness: 2px; }` (propuesta) |
| Focus visible `<a>` | ⚠️ NO especificado en Figma — propuesta: outline accesible | `&:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }` |

**Clasificación:** ✅ **Solo CSS.** Cero JS de comportamiento.

**Decisión `Requiere JS: no`** — el `decorate(block)` será una función puramente estructural (asignar clases, leer celdas, opcional limpiar wrappers vacíos). No hay listeners ni temporizadores.

---

## 9. Variantes — resumen para UE Specialist

```
.promo-band                       ← contenedor base (siempre)
.promo-band--with-image           ← variant=with-image (banda con <picture> de fondo)
.promo-band--plain                ← variant=plain (sólo overlay blanco al 10%)
.promo-band__inner                ← wrapper interno max-width 820px
.promo-band__bg                   ← <picture> de fondo (sólo variant A)
.promo-band__content              ← contenedor del icono+texto (envuelve los hijos no-bg)
.promo-band__icon                 ← <picture> del icono/logo
.promo-band__text                 ← <p> con texto + <a>
.promo-band__link                 ← <a> azul subrayado
```

> **Activación de la variante por el autor:** vía panel de Universal Editor (`select`). El xwalk filter inyectará la clase `promo-band--<value>` automáticamente en el bloque. **No** se activa escribiendo "with-image" como segunda fila en la tabla del documento.

---

## 10. Notas y ambigüedades

- ⚠️ **Frames Tablet 768 y Mobile 390 NO auditados en esta pasada.** El Orchestrator debe decidir si aceptar el comportamiento responsivo propuesto (sección 6) o lanzar una segunda iteración del Analyst con esos frames.
- ⚠️ **Estados `:hover` y `:focus-visible` no especificados en Figma.** Propuesta del Analyst en sección 8 — el Developer puede implementarlos con la propuesta o el Designer puede sobrescribirlos en una iteración posterior.
- ⚠️ **`href` de los enlaces NO definido en Figma** (es contenido de autor). El autor en Universal Editor proporcionará el `href` real al crear el `<a>` dentro del richtext. El Developer no debe cablear ningún href fijo.
- ⚠️ **`hostname` de las imágenes no definido** — en la home actual ambas vienen como assets de Figma. El autor publicará las imágenes definitivas vía DAM/AEM Assets antes de subir el bloque a producción.
- ♿ **Accesibilidad:** el `<a>` debe tener un `accessible-name` claro. El texto del enlace ("CALENDARIO PRÓXIMAS COMPETICIONES" / "BONO CULTURAL JOVEN") ya es descriptivo por sí mismo — no se necesita `aria-label` adicional.
- ♿ **Contraste:** texto blanco (#fff) sobre overlay blanco al 10 % sobre fondo negro = contraste alto, válido AAA. El enlace `#3588ff` sobre el mismo fondo ronda 6.3:1 (AA Large). En Variant A, validar contraste contra zonas claras de la imagen de estadio (puntos brillantes blancos pueden bajar el contraste local del enlace) — **♿ TODO: revisar accesibilidad del enlace sobre la imagen de fondo en Variant A**.
- ⚠️ **Posición LCP confirmada NO-LCP** para ambas instancias (y≈3055 y y≈7820, ambas muy por debajo del fold del viewport).
- ✅ **Modelo `single-row block`** confirmado — no hay items repetibles. **No** procede una segunda tabla `id: promo-band-item` en `component-models.json`.

---

**Fin del análisis del bloque `promo-band`.**
