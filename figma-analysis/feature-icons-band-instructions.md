# Instrucciones de Bloque: `feature-icons-band`
> **Generado por:** Figma Analyst
> **Archivo Figma:** MovistarPlus — `fileKey: 3gw50VHnWKIBmy03RYlgTl`
> **Nodos de referencia:**
> - Desktop 1280: `3:9050` (Section, h=311, y=1725) — *instancia primaria*
> - Desktop 1280: `3:9761` (Section, h=311, y=7936) — *segunda instancia (variante)*
> - Tablet 768: `3:5536` (h=525) y `3:6270` (h=525)
> - Mobile 390: `3:7270` (h=888) y `3:8023` (h=888)
> **Complejidad:** Simple
> **Requiere JS:** no
> **Modelo UE:** xwalk

---

## 1. Descripción funcional

Banda horizontal de **4 columnas iguales**, cada una con un icono ilustrativo grande (200×100), un encabezado corto en 31px Bold y un texto descriptivo de 1-2 líneas en 18px Regular. Sin fondos, sin tarjetas — los items son simplemente columnas tipográficas con icono.

**Items detectados en `3:9050` (desktop):**
1. "Ahora Movistar Plus+ por libre"
2. "Incluye 2 reproducciones"
3. "Series y mucho cine"
4. "Lo mejor del deporte"

> ✅ Bloque **completamente reutilizable** — la 2ª instancia (`3:9761`) probablemente lleva 4 items distintos (otros mensajes promocionales). Validar contenido de la 2ª instancia en Fase de contenido.

---

## 2. Campos editables para Universal Editor (xwalk)

**Campos del contenedor raíz** (`id: feature-icons-band` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Items | `items` | `container` | `string` | sí | "Items de la banda (recomendado: 3-4)" |

**Campos de cada item** (`id: feature-icons-band-item` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Icono / ilustración | `icon` | `reference` (image) | `string` | sí | "Icono o ilustración (200×100)" |
| Texto alternativo | `iconAlt` | `text` | `string` | sí | "Texto alternativo del icono" |
| Encabezado | `heading` | `text` | `string` | sí | "Encabezado corto del feature" |
| Descripción | `body` | `text` | `string` | no | "Texto descriptivo (1-2 líneas)" |

---

## 3. Estructura DOM

### ENTRADA — Matriz EDS (lo que `decorate(block)` recibe)

```
block.feature-icons-band
  └── div (fila 1: item 1)
        ├── div (col 0: icon)
        │     └── <picture> ← icono entregado por EDS
        ├── div (col 1: heading)
        │     └── <p> ← "Ahora Movistar Plus+ por libre"
        └── div (col 2: body)
              └── <p> ← "Texto descriptivo..."
  └── div (fila 2: item 2) ← mismo patrón
  └── div (fila 3: item 3) ← mismo patrón
  └── div (fila 4: item 4) ← mismo patrón
```

> 📌 Cada fila de la tabla = 1 item. Tres columnas por fila: icono, heading, body.

### SALIDA — DOM decorado (lo que `decorate(block)` produce)

```html
<div class="feature-icons-band block" data-block-name="feature-icons-band" data-block-status="loaded">
  <ul class="feature-icons-band__list" role="list">
    <li class="feature-icons-band__item">
      <picture class="feature-icons-band__icon">
        <img src="..." alt="Icono ilustrativo" loading="lazy" width="200" height="100">
      </picture>
      <h3 class="feature-icons-band__heading">Ahora Movistar Plus+ por libre</h3>
      <p class="feature-icons-band__body">Texto descriptivo del beneficio.</p>
    </li>
    <li class="feature-icons-band__item">
      <picture class="feature-icons-band__icon">
        <img src="..." alt="Icono 2 reproducciones" loading="lazy" width="200" height="100">
      </picture>
      <h3 class="feature-icons-band__heading">Incluye 2 reproducciones</h3>
      <p class="feature-icons-band__body">Disfruta en dos dispositivos a la vez.</p>
    </li>
    <li class="feature-icons-band__item">
      <picture class="feature-icons-band__icon">
        <img src="..." alt="Icono series y cine" loading="lazy" width="200" height="100">
      </picture>
      <h3 class="feature-icons-band__heading">Series y mucho cine</h3>
      <p class="feature-icons-band__body">El mejor catálogo a tu alcance.</p>
    </li>
    <li class="feature-icons-band__item">
      <picture class="feature-icons-band__icon">
        <img src="..." alt="Icono deporte" loading="lazy" width="200" height="100">
      </picture>
      <h3 class="feature-icons-band__heading">Lo mejor del deporte</h3>
      <p class="feature-icons-band__body">LALIGA, Champions, Premier League…</p>
    </li>
  </ul>
</div>
```

**Notas de transformación DOM:**
- Wrapping con `<ul role="list">` (semántico para listado).
- Cada item es un `<li>` con icono + H3 + body.
- Las imágenes con `width`/`height` explícitos para evitar CLS.

---

## 4. Tokens utilizados

| Propiedad CSS | Token |
|---|---|
| Padding sección | `pt-50 px-63.23` (px) |
| Layout | `display: flex / justify-content: center / gap: 40px` |
| Item: dimensiones | `width: 254.55px / max-width: 405px / min-width: 180px / height: 261px` |
| Icono: dimensiones | `width: 200px / height: 100px` |
| Heading | `font-size: 31px / line-height: 30px / letter-spacing: -0.17px / weight: bold / max-width: 303px` (token NUEVO `--font-size-h3-banner: 31px`) |
| Body | `font-size: 18px / line-height: 19px / weight: regular` |
| Color texto | `var(--color-white)` |

---

## 5. Gestión de imágenes y media

| Imagen | Origen | Tratamiento | Notas |
|---|---|---|---|
| **Iconos ilustrativos** (200×100, 4 unidades) | Celda del bloque → `<picture>` ya entregado por EDS | `loading="lazy"` + `width`/`height` explícitos | NO above-the-fold (sección a y=1725 en desktop). Iconos descriptivos — `alt` debe explicar el icono (ej. "Icono de televisor", no solo "Icono"). |

---

## 6. Comportamiento responsivo

### Desktop ≥ 1280px
- **Datos extraídos del nodo `3:9050`:** altura `311px`, 4 items en una fila, `gap: 40px`.

### Tablet 768px – 1279px
- **Nodo equivalente:** `3:5536` (h=525). Altura ~1.7× desktop sugiere reorganización a **2 columnas × 2 filas**.
- **DATOS NO CONFIRMADOS POR get_design_context.**
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:5536`.

### Mobile < 768px
- **Nodo equivalente:** `3:7270` (h=888). Altura ~2.85× desktop confirma **stack vertical (1 columna × 4 filas)**.
- **DATOS NO CONFIRMADOS POR get_design_context.**
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:7270`.

---

## 7. Estados / interacciones

| Estado | Trigger | Comportamiento |
|---|---|---|
| **Estado base** | siempre | Solo CSS, sin interacciones. |
| **Hover sobre item** | mouse hover (si el item es enlace) | ⚠️ No queda claro en Figma si los items son enlaces — el cliente debe confirmar. |

**Clasificación:** **Solo CSS.**

---

## 8. Notas de rendimiento, accesibilidad y TODOs

### Performance
- ✅ Below-the-fold: imágenes con `loading="lazy"`.
- ✅ `width`/`height` explícitos para evitar CLS.

### Accesibilidad ♿
- `<ul role="list">` para el listado.
- `<h3>` para el título de cada item (jerarquía respetada — el `<h2>` libre).
- Iconos con `alt` descriptivo (no solo "Icono").
- Contraste: blanco sobre fondo negro — AAA ✅.

### TODOs y ambigüedades
1. ⚠️ **Confirmar items de la 2ª instancia** (`3:9761`) — son contenidos distintos al primer band.
2. ⚠️ **Confirmar layout responsive** de tablet y mobile con `get_design_context`.
3. ⚠️ **¿Items son enlaces?** El Figma no muestra estado hover. Confirmar con cliente si cada feature lleva a una landing dedicada.
4. ⚠️ **Iconos al ser ilustraciones** (no glifos) requieren `<img>` real, no SVG inline. Confirmar formato (PNG, WebP, SVG) preferido por diseño para mantener fidelidad visual.
