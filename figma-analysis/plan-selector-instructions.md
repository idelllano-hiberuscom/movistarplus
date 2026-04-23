# Instrucciones de Bloque: `plan-selector`
> **Generado por:** Figma Analyst
> **Archivo Figma:** MovistarPlus — `fileKey: 3gw50VHnWKIBmy03RYlgTl`
> **Nodos de referencia:**
> - Desktop 1280: `3:8938` (Section, h=648.34, y=1076)
> - Tablet 768: `3:5424` (Section, h=1250.33)
> - Mobile 390: `3:7158` (Section, h=1630.48)
> **Complejidad:** Media
> **Requiere JS:** no *(layout puro CSS, CTAs son enlaces)*
> **Modelo UE:** xwalk

---

## 1. Descripción funcional

Sección de selección de plan de suscripción. Heading principal "Elige tu plan" en `font-size: 67px` Bold blanco centrado, seguido de **3 tarjetas de plan** dispuestas horizontalmente con `gap: 20px`, cada una con `width: 366.06px` (`max-w: 700px`), centradas (`justify-content: center`), `border-radius: 8px`.

**Tarjetas detectadas (de izquierda a derecha):**
1. **Movistar Plus mensual** — fondo blanco, texto negro, badge "Tarifa estrella" 100×100 anclado en esquina superior derecha (`top: -4px`, `right: -4px`). Heading 38px Bold "Movistar Plus mensual", lista de 2 features con iconos check (16×16, glifo 15×11), precio "9" + ",99€" + "MES" + "Imp. incl." + "Precio final al mes", CTA "SUSCRIBIRME" azul rounded-28.
2. **Movistar Plus+ anual** — fondo blanco, texto negro, badge "Movistar Plus+" en mismo anclaje, mismo patrón, precio ",90€" + "AÑO" + "imp. incl.", item adicional con icono "2 meses de ahorro", precio principal "99".
3. **Plan Gratuito** — **VARIANTE FEATURED** → fondo `#232323` (token nuevo `--color-card-bg-dark`), borde 2px `#ffa000` (token nuevo `--color-featured-border`), texto BLANCO, precio "0" + "€" + "Sin coste", CTA "REGISTRARME GRATIS".

> ⚠️ **DECISIÓN VINCULANTE del usuario (Fase 1, ronda 2):** la tarjeta destacada se modela como **variante CSS** (`.plan-card--featured`) activable por un toggle booleano (`featured: boolean`) en el Universal Editor. NO se crea un sub-bloque distinto.

---

## 2. Campos editables para Universal Editor (xwalk)

**Campos del contenedor raíz** (`id: plan-selector` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Encabezado | `heading` | `text` | `string` | sí | "Encabezado de la sección (H2)" |
| Tarjetas de plan | `plans` | `container` | `string` | sí | "Tarjetas de planes (recomendado: 2-3)" |

**Campos de cada `plan-item`** (`id: plan-selector-item` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Título del plan | `title` | `text` | `string` | sí | "Nombre del plan (ej. 'Movistar Plus mensual')" |
| Lista de features | `features` | `richtext` | `string` | sí | "Lista de beneficios (ul/li)" |
| Precio entero | `priceInteger` | `text` | `string` | sí | "Parte entera del precio (ej. '9')" |
| Precio decimales + moneda | `priceDecimals` | `text` | `string` | no | "Decimales y moneda (ej. ',99€'). Vacío para planes gratuitos." |
| Periodo | `period` | `text` | `string` | sí | "Periodo de facturación (ej. 'MES', 'AÑO', 'Sin coste')" |
| Suplemento impuestos | `taxLabel` | `text` | `string` | no | "Texto fiscal pequeño (ej. 'Imp. incl.')" |
| Texto bajo precio | `priceFootnote` | `text` | `string` | no | "Texto bajo el precio (ej. 'Precio final al mes')" |
| Texto del CTA | `ctaText` | `text` | `string` | sí | "Texto del botón (ej. 'SUSCRIBIRME')" |
| Enlace del CTA | `ctaLink` | `aem-content` | `string` | sí | "URL destino del botón" |
| Imagen del badge | `badgeImage` | `reference` (image) | `string` | no | "Badge esquina superior (ej. 'Tarifa estrella'). Vacío = sin badge." |
| Texto alt del badge | `badgeAlt` | `text` | `string` | no | "Texto alternativo del badge" |
| ✨ **Destacado** | `featured` | `boolean` | `boolean` | no | "Marcar como tarjeta destacada (aplica estilo dark + borde naranja)" |

---

## 3. Estructura DOM

### ENTRADA — Matriz EDS (lo que `decorate(block)` recibe)

Cada tarjeta de plan se autora como una fila de la tabla del bloque, con columnas separadas para cada campo, o bien como una sub-tabla anidada por tarjeta. La matriz esperada:

```
block.plan-selector
  └── div (fila 1: encabezado)
        └── div (col 0)
              └── <p> ← "Elige tu plan" (texto plano)
  └── div (fila 2: tarjeta 1 — sub-tabla anidada o columnas)
        ├── div (col 0: title)
        │     └── <p> ← "Movistar Plus mensual"
        ├── div (col 1: features)
        │     └── <ul>
        │           ├── <li>...</li>
        │           └── <li>...</li>
        ├── div (col 2: price grid — 5 sub-campos texto)
        │     ├── <p> ← "9"
        │     ├── <p> ← ",99€"
        │     ├── <p> ← "MES"
        │     ├── <p> ← "Imp. incl."
        │     └── <p> ← "Precio final al mes"
        ├── div (col 3: cta)
        │     └── <p><a href="/suscribir">SUSCRIBIRME</a></p>
        ├── div (col 4: badge image)
        │     └── <picture> ← badge "Tarifa estrella"
        └── div (col 5: featured flag)
              └── <p>false</p>  ← (texto literal "true"/"false" o vacío)
  └── div (fila 3: tarjeta 2)  ← mismo patrón
  └── div (fila 4: tarjeta 3 - PLAN GRATUITO)  ← mismo patrón, featured=true
```

> 📌 **NOTA:** EDS preserva el orden de las columnas. El `decorate()` debe leer cada celda por **índice de posición** (`row.children[0]`, `[1]`, `[2]`...) o por convención de nomenclatura del bloque. Existe el patrón EDS de "config from first row" para metadata, pero aquí cada fila es una tarjeta completa.

> ⚠️ Alternativa más limpia: usar **un sub-bloque anidado** `plan-card` por tarjeta. Decisión final del UE Specialist en Fase 3.

### SALIDA — DOM decorado (lo que `decorate(block)` produce)

```html
<div class="plan-selector block" data-block-name="plan-selector" data-block-status="loaded">
  <div class="plan-selector__inner">
    <h2 class="plan-selector__heading">Elige tu plan</h2>

    <ul class="plan-selector__list" role="list">

      <!-- Tarjeta 1: mensual (NO featured) -->
      <li class="plan-card">
        <picture class="plan-card__badge">
          <img src="/assets/badge-tarifa-estrella.svg" alt="Tarifa estrella" loading="lazy">
        </picture>
        <h3 class="plan-card__title">Movistar Plus mensual</h3>
        <ul class="plan-card__features">
          <li>Lo mejor del cine, series y deporte</li>
          <li>2 reproducciones simultáneas</li>
        </ul>
        <div class="plan-card__price" aria-label="9,99 euros al mes, impuestos incluidos">
          <span class="plan-card__price-int">9</span>
          <span class="plan-card__price-dec">,99€</span>
          <span class="plan-card__price-period">MES</span>
          <span class="plan-card__price-tax">Imp. incl.</span>
          <span class="plan-card__price-footnote">Precio final al mes</span>
        </div>
        <a href="/suscribir" class="plan-card__cta button">SUSCRIBIRME</a>
      </li>

      <!-- Tarjeta 2: anual (NO featured) -->
      <li class="plan-card">
        <picture class="plan-card__badge">
          <img src="/assets/badge-movistar-plus.svg" alt="Movistar Plus+" loading="lazy">
        </picture>
        <h3 class="plan-card__title">Movistar Plus+ anual</h3>
        <ul class="plan-card__features">
          <li>Acceso 12 meses</li>
          <li>2 meses de ahorro</li>
        </ul>
        <div class="plan-card__price" aria-label="99,90 euros al año, impuestos incluidos">
          <span class="plan-card__price-int">99</span>
          <span class="plan-card__price-dec">,90€</span>
          <span class="plan-card__price-period">AÑO</span>
          <span class="plan-card__price-tax">Imp. incl.</span>
          <span class="plan-card__price-footnote">Precio final al año</span>
        </div>
        <a href="/suscribir-anual" class="plan-card__cta button">SUSCRIBIRME</a>
      </li>

      <!-- Tarjeta 3: Plan Gratuito (FEATURED) -->
      <li class="plan-card plan-card--featured">
        <h3 class="plan-card__title">Plan Gratuito</h3>
        <ul class="plan-card__features">
          <li>Acceso a contenido seleccionado</li>
          <li>Sin tarjeta de crédito</li>
        </ul>
        <div class="plan-card__price" aria-label="Sin coste">
          <span class="plan-card__price-int">0</span>
          <span class="plan-card__price-dec">€</span>
          <span class="plan-card__price-period">Sin coste</span>
        </div>
        <a href="/registro-gratuito" class="plan-card__cta button">REGISTRARME GRATIS</a>
      </li>

    </ul>
  </div>
</div>
```

**Notas de transformación DOM aplicadas por `decorate()`:**
- Wrapping del listado con `<ul role="list">` (listas con `list-style: none` requieren `role="list"` en VoiceOver).
- Cada tarjeta es un `<li>` con clase `plan-card` y modificador opcional `--featured`.
- El precio es un `<div>` con `aria-label` que verbaliza el precio completo (los lectores de pantalla leerían "9 ,99€ MES" sin contexto, lo cual es confuso).
- El badge es un `<picture>` posicionado absolutamente (CSS) en la esquina superior derecha.
- El CTA es un `<a class="button">` (estilo de botón sobre `<a>` real, navegación).

---

## 4. Tokens utilizados

| Propiedad CSS | Token |
|---|---|
| Heading sección | `font-size: 67px / weight: bold / color: var(--color-white) / text-align: center` (token NUEVO `--font-size-h2-large: 67px`) |
| Fondo tarjeta default | `var(--color-white)` (token NUEVO `--color-card-bg-light: #ffffff`) |
| Color texto tarjeta default | `var(--color-black)` |
| Fondo tarjeta featured | `var(--color-card-bg-dark)` (NUEVO: `#232323`) |
| Borde tarjeta featured | `2px solid var(--color-featured-border)` (NUEVO: `#ffa000`) |
| Color texto tarjeta featured | `var(--color-white)` |
| Border-radius tarjeta | `var(--radius-card)` (NUEVO: `8px`) |
| Padding tarjeta default | `padding: 30px 40px 40px 40px` |
| Padding tarjeta featured | `padding: 32.67px 42.67px 42px 42.67px` *(compensa el borde 2px)* |
| Título tarjeta H3 | `font-size: 38px / line-height: 40px / weight: bold` (token NUEVO `--font-size-h3: 38px`) |
| Lista features | `font-size: 20px / line-height: ~24px` (token NUEVO `--font-size-body-md: 20px`) |
| Precio entero | `font-size: 70px / letter-spacing: -2px / weight: bold` (token NUEVO `--font-size-display-mega: 70px`) |
| Precio decimales | `font-size: 38px / letter-spacing: -2px / weight: bold` |
| Precio periodo (MES/AÑO) | `font-size: 16px / weight: bold` (token NUEVO `--font-size-card-meta: 16px`) |
| Precio tax (Imp. incl.) | `font-size: 12px / color: var(--color-text-secondary-grey)` (NUEVO: `#9c9c9c`) |
| Precio footnote | `font-size: 16px` |
| CTA fondo | `var(--color-brand-blue)` (#0066ff) |
| CTA texto | `var(--color-white) / font-size: 20px / weight: regular / text-transform: uppercase` |
| CTA padding | `padding: 16px 20px` |
| CTA border-radius | `var(--radius-button-pill)` (NUEVO: `28px`) |
| Gap entre tarjetas | `20px` |
| Gap del listado al heading | `35px` |

---

## 5. Gestión de imágenes y media

| Imagen | Origen | Tratamiento | Notas |
|---|---|---|---|
| **Badge "Tarifa estrella"** (100×100) | Celda del bloque → `<picture>` ya entregado por EDS | `loading="lazy"` *(la sección no es above-the-fold; está a y=1076)* | Decorativo pero con valor informativo — `alt` debe describir el contenido (ej. "Tarifa estrella"). |
| **Badge "Movistar Plus+"** (100×100) | Celda del bloque → `<picture>` | `loading="lazy"` | Mismo tratamiento. |
| **Iconos check** (16×16, glifo 15×11) | SVG en `/icons/check.svg` o inline en el HTML del bloque | Renderizar con `width="16" height="16"` explícitos | Decorativos: `aria-hidden="true"`. |
| **Icono "2 meses de ahorro"** (en card anual) | SVG dedicado | Tratamiento similar | ⚠️ Verificar si es un icono o un texto con estilos. |

---

## 6. Comportamiento responsivo

### Desktop ≥ 1280px
- **Datos extraídos del nodo `3:8938`:** altura `648.34px`, padding `pt-50 px-63.23`, heading 67px Bold centrado.
- **Layout:** las 3 tarjetas en una sola fila, `justify-content: center`, `gap: 20px`. Cada tarjeta `width: 366.06px`.

### Tablet 768px – 1279px
- **Nodo equivalente:** `3:5424` (existe en frame Tablet 768, altura `1250.33px` — significativamente mayor que desktop, lo que sugiere reorganización).
- **DATOS NO CONFIRMADOS POR get_design_context** — basado en metadata.
- **Layout esperado:** las 3 tarjetas pueden mantenerse horizontales con tamaños reducidos, o reorganizarse a layout 2+1 (2 arriba, 1 abajo) o stack vertical. La altura sugiere stack vertical o 1+2.
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:5424`.

### Mobile < 768px (390px de referencia)
- **Nodo equivalente:** `3:7158` (existe en frame Mobile 390, altura `1630.48px` — confirma stack vertical de 3 tarjetas).
- **DATOS NO CONFIRMADOS POR get_design_context** — basado en metadata.
- **Layout esperado:** stack vertical de 3 tarjetas, ancho cercano al viewport (probablemente ~358px = 390 - 16×2 padding).
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:7158` para confirmar paddings, font-size del heading H2 y de los precios en mobile (probable que el "67px" se reduzca proporcionalmente).

---

## 7. Estados / interacciones

| Estado | Trigger | Comportamiento |
|---|---|---|
| **Hover sobre tarjeta** | mouse hover (desktop) | Posible `transform: scale(1.02)` o `box-shadow`. ⚠️ NO extraído del Figma — propuesta del Analyst. |
| **Hover sobre CTA** | mouse hover | Oscurecer fondo (`filter: brightness(0.9)`). |
| **Focus en CTA** | Tab/teclado | Outline visible WCAG 2.4.7. ♿ |
| **Tarjeta featured (estado persistente)** | clase `.plan-card--featured` | Aplicar fondo dark + borde naranja + texto blanco. Solo CSS. |
| **Reduced motion** | `prefers-reduced-motion: reduce` | Sin transiciones de hover. ♿ |

**Clasificación:**
- **Solo CSS:** TODO. El bloque NO requiere JS.

---

## 8. Notas de rendimiento, accesibilidad y TODOs

### Performance
- ✅ Los badges con `loading="lazy"` (no above-the-fold).
- ✅ El bloque entero NO requiere JS — cero bundle adicional.
- ⚠️ Reservar altura mínima de las tarjetas vía CSS para evitar CLS si los textos son largos.

### Accesibilidad ♿
- `<h2>` para el encabezado de sección, `<h3>` para el título de cada tarjeta (jerarquía respetada).
- `<ul role="list">` para el listado de tarjetas (anula la supresión de `list-style: none` en VoiceOver).
- El precio compuesto (`9` + `,99€` + `MES` + ...) debe leerse como un todo coherente — usar `aria-label="9,99 euros al mes, impuestos incluidos"` en el wrapper `.plan-card__price` y `aria-hidden="true"` en los `<span>` internos para evitar lectura fragmentada.
- Iconos check decorativos: `aria-hidden="true"`.
- CTA con texto descriptivo (no solo "Click aquí"): "SUSCRIBIRME", "REGISTRARME GRATIS" — ✅ ya cumple.
- Contraste:
  - Tarjeta default: texto negro sobre blanco — AAA ✅.
  - Tarjeta featured: texto blanco sobre `#232323` — AAA ✅.
  - CTA: blanco sobre `#0066ff` — verificar AA (debe estar OK).
  - Texto `#9c9c9c` sobre blanco (Imp. incl.) — verificar contraste (al límite de AA para texto pequeño).

### TODOs y ambigüedades
1. ⚠️ **Confirmar layout exacto** de tablet (768) y mobile (390) con `get_design_context` adicional sobre `3:5424` y `3:7158` (críticos por la altura inflada en mobile).
2. ⚠️ **Texto exacto de los features** de cada tarjeta — el Figma muestra placeholders. El cliente debe aportar los textos definitivos.
3. ⚠️ **Card 3 "Plan Gratuito"** — `priceDecimals` está vacío y `period` es "Sin coste". El layout del bloque precio debe adaptarse cuando faltan campos (CSS grid flexible o `:empty` selectors).
4. ⚠️ **Hover state** de la tarjeta NO extraído del Figma — definir con diseño si debe haber elevation/scale.
5. ⚠️ **Token `--color-text-secondary-grey: #9c9c9c`** vs el ya existente `--color-text-muted: #a6a6a6` — son colores muy similares pero no idénticos. Validar con diseño si se unifican o se mantienen separados.
