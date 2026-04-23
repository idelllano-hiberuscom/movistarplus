# Instrucciones de Bloque: `faq-accordion`
> **Generado por:** Figma Analyst
> **Archivo Figma:** MovistarPlus — `fileKey: 3gw50VHnWKIBmy03RYlgTl`
> **Nodos de referencia:**
> - Desktop 1280: `3:9820` (Section, h=1088, y=8520)
> - Tablet 768: `3:6329` (h=1242)
> - Mobile 390: `3:8082` (h=1114)
> **Complejidad:** Media
> **Requiere JS:** no *(implementación nativa con `<details>/<summary>` — sin JS, solo CSS)*
> **Modelo UE:** xwalk

---

## 1. Descripción funcional

Sección de **Preguntas frecuentes**. Encabezado centrado "Preguntas frecuentes" en 34px Bold blanco con `letter-spacing: -0.53px`. Debajo, una lista vertical de **12 items** (acordeón clásico). Cada item:

- **Estado colapsado (default):** fondo `rgba(54,54,54,0.4)` (token NUEVO `--color-faq-item-default`), `border-radius: 5px`, padding `18px 48px 18px 18px`, pregunta en 16px Bold blanco, chevron derecho 20×20 (rotación 0°).
- **Estado expandido:** fondo `rgba(89,89,89,0.54)` (token NUEVO `--color-faq-item-active`), padding extendido (con espacio para la respuesta), pregunta misma tipo, chevron rotado 90° (apunta abajo), respuesta en 16px (mezcla Regular y Bold) color `#a7a7a7` (token NUEVO `--color-text-grey-faq`) con `line-height: 18px`.

**Comportamiento:** acordeón con **un solo item expandido a la vez** (excluyente) **O múltiples items expandidos simultáneamente** — confirmar con cliente. En el Figma se ve el primer item expandido.

> ⚠️ **DECISIÓN VINCULANTE del usuario (Fase 1, ronda 2):** se utilizará la implementación nativa **`<details>/<summary>` de HTML5** sin JS para toggle. JS opcional solo para tracking analítico (`onclick`) y para mejoras de accesibilidad (`aria-expanded` controlado).

**Items detectados (12):**
1. ¿Qué es Movistar Plus+? *(expandido en Figma — incluye respuesta de 4 párrafos)*
2. ¿Cuánto cuesta Movistar Plus+?
3. ¿Qué puedo ver en Movistar Plus+?
4. ¿Qué competiciones deportivas puedo ver en Movistar Plus+?
5. ¿Cuántos canales hay en Movistar Plus+?
6. ¿Hay permanencia en Movistar Plus+?
7. ¿Debo tener contratado Movistar, Fibra en casa y/o el móvil, para disfrutar de Movistar Plus+?
8. ¿En qué dispositivos puedo ver Movistar Plus+?
9. ¿Puedo ver Movistar Plus+ fuera de España?
10. ¿Cómo veo el contenido de Movistar Plus+?
11. ¿Cuáles son las principales ventajas del nuevo Movistar Plus+?
12. ¿Cómo puedo dar de baja mi suscripción a Movistar Plus+?

---

## 2. Campos editables para Universal Editor (xwalk)

**Campos del contenedor raíz** (`id: faq-accordion` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Encabezado | `heading` | `text` | `string` | sí | "Encabezado de la sección (H2)" |
| Modo único | `singleOpen` | `boolean` | `boolean` | no | "Solo permitir un item abierto a la vez" |
| Items FAQ | `items` | `container` | `string` | sí | "Preguntas y respuestas" |

**Campos de cada item** (`id: faq-accordion-item` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Pregunta | `question` | `text` | `string` | sí | "Pregunta (visible siempre)" |
| Respuesta | `answer` | `richtext` | `string` | sí | "Respuesta (visible al expandir, soporta formato)" |
| Abierto por defecto | `defaultOpen` | `boolean` | `boolean` | no | "Mostrar como expandido al cargar" |

---

## 3. Estructura DOM

### ENTRADA — Matriz EDS

```
block.faq-accordion
  └── div (fila 1: encabezado)
        └── div (col 0)
              └── <p> ← "Preguntas frecuentes"
  └── div (fila 2: config)
        └── div (col 0)
              └── <p> ← "single-open" / "multi-open"
  └── div (fila 3: item 1)
        ├── div (col 0: question)
        │     └── <p> ← "¿Qué es Movistar Plus+?"
        ├── div (col 1: answer — richtext, múltiples <p>)
        │     ├── <p>Movistar Plus+ es la única plataforma...</p>
        │     ├── <p>El precio de la suscripción es de 9,9€...</p>
        │     └── <p>No tiene permanencia y la suscripción incluye...</p>
        └── div (col 2: defaultOpen)
              └── <p> ← "true"
  └── div (fila 4: item 2) ← mismo patrón, defaultOpen vacío
  └── ... (10 filas más)
```

### SALIDA — DOM decorado

```html
<div class="faq-accordion block" data-block-name="faq-accordion" data-block-status="loaded">
  <h2 class="faq-accordion__heading">Preguntas frecuentes</h2>

  <div class="faq-accordion__list" data-mode="single-open">

    <details class="faq-accordion__item" open>
      <summary class="faq-accordion__question">
        ¿Qué es Movistar Plus+?
        <span class="faq-accordion__chevron" aria-hidden="true">
          <!-- SVG chevron -->
        </span>
      </summary>
      <div class="faq-accordion__answer">
        <p>Movistar Plus+ es la única plataforma de TV en la que podrás disfrutar de lo mejor del deporte, fútbol, cine, series internacionales, todas las series originales de producción propia de Movistar Plus+, documentales, programas propios de entretenimiento, programas de deporte y más de 80 canales.</p>
        <p>El precio de la suscripción es de 9,9€ mes, impuestos incluidos.</p>
        <p>No tiene permanencia y la suscripción <strong>incluye dos reproducciones simultáneas</strong>, desde smartphone, TV, PC o Tablet. Ambas reproducciones puedes estar en la misma o diferente ubicación.</p>
      </div>
    </details>

    <details class="faq-accordion__item">
      <summary class="faq-accordion__question">
        ¿Cuánto cuesta Movistar Plus+?
        <span class="faq-accordion__chevron" aria-hidden="true"><!-- SVG --></span>
      </summary>
      <div class="faq-accordion__answer">
        <p>...</p>
      </div>
    </details>

    <!-- ... 10 items más con misma estructura -->

  </div>
</div>
```

**Notas de transformación DOM:**
- Wrapping del bloque con `<div class="faq-accordion">`.
- Cada item es un `<details>` con `<summary>` (pregunta) y un `<div>` (respuesta).
- El `<details>` aporta toggle nativo del navegador SIN JS.
- El chevron es un SVG inline dentro de `<summary>` con `aria-hidden="true"` (decorativo — el toggle nativo ya es accesible).
- Si `singleOpen` es `true`, JS opcional cierra los demás `<details>` cuando uno se abre.

---

## 4. Tokens utilizados

| Propiedad CSS | Token |
|---|---|
| Padding sección | `pt-50 px-63.23` |
| H2 | `font-size: 34px / line-height: 36px / weight: bold / letter-spacing: -0.53px / text-align: center / color: var(--color-white)` (token NUEVO `--font-size-h2-faq: 34px`) |
| Gap heading → list | `30px` |
| Gap entre items | `12px` |
| Item default: fondo | `var(--color-faq-item-default)` (NUEVO: `rgba(54,54,54,0.4)`) |
| Item expandido: fondo | `var(--color-faq-item-active)` (NUEVO: `rgba(89,89,89,0.54)`) |
| Item: border-radius | `5px` |
| Item: padding | `18px 48px 18px 18px` |
| Question | `font-size: 16px / line-height: 18px / weight: bold / color: var(--color-white)` |
| Answer | `font-size: 16px / line-height: 18px / weight: regular (mix con bold) / color: var(--color-text-grey-faq)` (NUEVO: `#a7a7a7`) |
| Chevron | `width: 20px / height: 20px / position: absolute right: 18px top: 50% transform: translateY(-50%)` |
| Chevron expandido | `transform: translateY(-50%) rotate(90deg)` |

---

## 5. Gestión de imágenes y media

| Imagen | Origen | Tratamiento | Notas |
|---|---|---|---|
| **Chevron icon** (20×20) | SVG inline en el HTML del bloque o asset en `/icons/chevron.svg` | Decorativo: `aria-hidden="true"` o `alt=""` | Animar rotación con CSS `transition: transform 200ms ease`. |

---

## 6. Comportamiento responsivo

### Desktop ≥ 1280px
- **Datos extraídos del nodo `3:9820`:** altura `1088px`. Items con `min-width: 1138.21px` (`100% - padding`).

### Tablet 768px – 1279px
- **Nodo equivalente:** `3:6329` (h=1242). Mismo patrón vertical, ancho adaptado.
- **DATOS NO CONFIRMADOS POR get_design_context.**

### Mobile < 768px
- **Nodo equivalente:** `3:8082` (h=1114). Mismo patrón vertical.
- **DATOS NO CONFIRMADOS POR get_design_context.**
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:8082` para confirmar font-size del H2 y padding lateral en mobile.

---

## 7. Estados / interacciones

| Estado | Trigger | Comportamiento |
|---|---|---|
| **Item colapsado** | default (sin `[open]`) | Solo question + chevron 0° visibles. Respuesta oculta (vía `<details>`). |
| **Item expandido** | atributo `[open]` en `<details>` (toggle nativo) | Question + chevron 90° + respuesta visibles. Cambio de fondo. |
| **Toggle (click/Enter/Space en summary)** | mouse o teclado | Toggle nativo de `<details>`. SIN JS. |
| **Single-open mode** | configurado con `singleOpen=true` | JS opcional: al abrir un `<details>`, cerrar los demás (`document.querySelectorAll('details[open]')`). |
| **Hover sobre item colapsado** | mouse hover | Cambio sutil de fondo (`rgba(54,54,54,0.6)`). ⚠️ NO extraído del Figma. |
| **Focus en summary** | Tab/teclado | Outline visible WCAG 2.4.7. ♿ |
| **Animación de apertura** | `<details>` toggle | Por defecto `<details>` no anima — para añadir transición usar `details[open] > .answer { animation: ... }` o el atributo CSS `interpolate-size` (Chrome 129+). |
| **Reduced motion** | `prefers-reduced-motion: reduce` | Desactivar animaciones de apertura. ♿ |

**Clasificación:**
- **Solo CSS / HTML nativo:** todo el toggle. Cero JS necesario.
- **Requiere JS opcional:** modo `single-open` (cerrar los demás), tracking analítico (`addEventListener('toggle')` para enviar evento al data layer).

---

## 8. Notas de rendimiento, accesibilidad y TODOs

### Performance
- ✅ Cero JS para el toggle — bundle 0kb adicional.
- ✅ Sin imágenes pesadas (solo chevron SVG inline o single asset).
- ✅ Below-the-fold (sección a y=8520) — no afecta a LCP.

### Accesibilidad ♿
- **`<details>/<summary>` es nativo y accesible** — los lectores de pantalla anuncian el estado expandido/colapsado automáticamente.
- `<h2>` para el encabezado.
- Chevron decorativo: `aria-hidden="true"`.
- Contraste:
  - Item default `rgba(54,54,54,0.4)` sobre body negro → fondo casi negro → texto blanco AAA ✅.
  - Item expandido `rgba(89,89,89,0.54)` sobre body negro → fondo gris medio → texto blanco AAA ✅.
  - Respuesta `#a7a7a7` sobre fondo gris medio → ⚠️ verificar AA (4.5:1 para texto normal).
- Focus outline visible.
- NO usar `tabindex="-1"` ni `pointer-events: none` en summaries.
- Si se usa la pseudo-clase `:open` (Baseline 2024+), añadir fallback con `[open]` para navegadores antiguos.

### TODOs y ambigüedades
1. ⚠️ **Confirmar modo single-open vs multi-open** con el cliente.
2. ⚠️ **Confirmar layout responsive** de mobile con `get_design_context` sobre `3:8082`.
3. ⚠️ **Hover state** de items NO extraído del Figma.
4. ⚠️ **Solo el primer item tiene contenido visible** en el Figma (los otros 11 están colapsados). Los textos de respuesta de las otras 11 preguntas deben ser aportados por el cliente.
5. ⚠️ **Tracking analítico:** el cliente debe definir si quiere capturar eventos de apertura de cada FAQ (data layer push). En tal caso, se requiere JS mínimo (~10 líneas).
6. ⚠️ **Animación de apertura:** los `<details>` nativos NO animan el desplegado por defecto. Si se desea animación suave, evaluar `interpolate-size: allow-keywords` (Chrome 129+) o pequeña polyfill JS.
7. ⚠️ **Contraste del color `#a7a7a7`** sobre fondo translúcido del item expandido — verificar con herramienta de contraste ya que el fondo translúcido cambia según lo que esté detrás.
