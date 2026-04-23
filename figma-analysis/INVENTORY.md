# Figma Analyst — Inventario de Componentes
> **Archivo Figma:** MovistarPlus — `fileKey: 3gw50VHnWKIBmy03RYlgTl`
> **Nodo raíz analizado:** `3:2` (canvas `0:1`)
> **Modelo destino:** xwalk (AEM EDS + Universal Editor)
> **Fecha de análisis:** Fase 1 — Figma Analyst

---

## 🗺️ Estructura del archivo Figma — viewports detectados

El archivo contiene **5 frames de viewport** al mismo nivel del canvas `0:1`. Para Fase 1 se han seleccionado 3 como canónicos (Mobile / Tablet / Desktop), siguiendo la convención EDS:

| Rol | Frame Figma | Node ID | Ancho | Notas |
|---|---|---|---|---|
| **Mobile** ✅ canónico | `Vista-390px` | `3:6790` | 390 px | Frame nombrado explícitamente |
| **Tablet** ✅ canónico | `Html` (768) | `3:5057` | 768 px | Sin prefijo `Vista-`, pero ancho 768 es estándar tablet |
| **Desktop** ✅ canónico | `Vista-1280px` | `3:8554` | 1280 px | Frame nombrado explícitamente — **fuente de verdad para layout desktop** |
| Desktop XL (no canónico) | `Vista-1920px` | `3:2` | 1920 px (contenido a 1440) | Vista XL, contenido idéntico al de 1280 escalado |
| Tablet ancho (no canónico) | `Html` (1024) | `3:3373` | 1024 px | Variante intermedia, no se considera breakpoint EDS |

> ⚠️ **No existe una página/capa separada con "Estilos de componentes"** en este archivo. El Figma MCP `get_variable_defs` devuelve `{}` — el archivo **no usa Figma Variables**. Los tokens se extraen leyendo valores directos (fills, fonts, spacings) en cada nodo. Ver `global-tokens.md`.

---

## 📦 Componentes detectados (9 únicos)

Numerados por orden de aparición vertical en la página Desktop 1280:

| # | Nombre EDS (kebab-case) | Tipo | Complejidad | Requiere JS | Mapeo a bloque existente | Notas |
|---|---|---|---|---|---|---|
| 1 | `header` | Cabecera fija | Media | sí (menú móvil + sticky) | ✅ Existe `/blocks/header/` (vacío de CSS, JS minimal) | Validar si la versión Figma encaja con header EDS estándar o requiere reescritura |
| 2 | `hero-carousel` | Carrusel hero above-the-fold | **Alta** | sí (autoplay opcional + dots + swipe) | ❌ No existe (`/blocks/hero/` es un hero estático, no carrusel) | Bloque NUEVO — proponer nombre `hero-carousel` para no colisionar con `hero` |
| 3 | `plan-selector` | Selector de planes "Elige tu plan" | Media | no (solo CSS si no hay tabs activos) | ❌ No existe | Bloque NUEVO — 2 tarjetas de plan + heading |
| 4 | `channel-logos` | Tira/wall de logos de canales | Simple | no | ❌ No existe | Bloque NUEVO — Vix, Netflix, Disney+, etc. |
| 5 | `content-carousel` | Carrusel horizontal de pósters de contenido (×10+ instancias) | **Alta** | sí (scroll horizontal + flechas prev/next) | ❌ No existe (`/blocks/cards/` es grid estático) | **Componente más repetido** — 10+ instancias en la home (Series exclusivas, Estrenos, Originales, Cine, Deportes…) |
| 6 | `feature-icons-band` | Banda con iconos + texto de ventajas ("Sin permanencia", "Cancela cuando quieras"…) | Simple | no | ❌ No existe | Bloque NUEVO — 4 columnas de icono + título + texto |
| 7 | `cta-price-band` | Banda CTA con precio "Me interesa" | Simple | no | ❌ No existe | Bloque NUEVO — heading + precio + botón |
| 8 | `faq-accordion` | Acordeón "Preguntas frecuentes" | Media | sí (toggle expand/collapse) | ❌ No existe | Bloque NUEVO — items repetibles con `<details>`/`<summary>` o JS |
| 9 | `footer` | Footer corporativo | Media | no (solo CSS) | ✅ Existe `/blocks/footer/` (vacío de CSS, JS minimal) | Validar columnas + enlaces legales |

### Bloques existentes en repo NO mapeados a Figma

Los siguientes bloques existen en `/blocks/` pero **no se han identificado en este Figma de la home**:
- `cards` — bloque genérico, podría reutilizarse internamente por `content-carousel` si la arquitectura lo permite
- `columns` — layout primitive, no es un componente visible
- `fragment` — utilitario de includes
- `hero` — hero estático; **NO confundir con `hero-carousel`** que es el componente real del Figma
- `header-navigation` — sub-bloque, posiblemente reutilizable por `header`

---

## 🔁 Reutilización y variantes

| Componente | Variantes detectadas en Figma |
|---|---|
| `hero-carousel` | 5 ítems (Champions, "Yo siempre a veces", "Flores para Antonio", "Laberinto en llamas", "LaLiga Getafe-Barcelona") — todos misma estructura, contenido distinto |
| `content-carousel` | Variantes por **título de carrusel** y **ratio de póster** (vertical 2:3 dominante, horizontal 16:9 en algunos como "Deportes en directo") — pendiente confirmar al analizar cada instancia |
| `plan-selector` | Default (2 planes: Mensual / Sin permanencia) — sin variantes detectadas en Figma |
| `feature-icons-band` | Una sola variante con 4 columnas en desktop |

---

## ⚠️ Ambigüedades detectadas (deben resolverse antes de Fase 2)

1. **No hay Figma Variables** — los tokens se infieren leyendo valores literales. Si el cliente añade variables en el futuro, este análisis quedará desactualizado.
2. **Naming Figma muy ruidoso** — los wrappers se llaman `"TODO: Poner la parte del header aquí"`, `Section`, `Container`, `List`, `Item`. Confirmar con el equipo de diseño si esos `TODO` son comentarios o instrucciones reales.
3. **Header en Figma** — la cabecera real (logo + login) NO aparece como frame propio dentro de cada Section; el frame `3:3325 "Header - End Google Tag Manager"` está al final del árbol Desktop XL (1920) → ⚠️ **POSICIÓN HEADER NO CONFIRMADA EN VIEWPORTS CANÓNICOS** — debe verificarse manualmente en frames `3:6790` (mobile) y `3:8554` (1280).
4. **`hero` vs `hero-carousel`** — el repo ya tiene `/blocks/hero/`. **Acción requerida del Orchestrator:** decidir si:
   - Opción A: renombrar/reutilizar `hero` para que sea un carrusel (rompe compatibilidad con cualquier autor que ya use `hero` estático).
   - Opción B (recomendada): crear `hero-carousel` como bloque nuevo y dejar `hero` intacto.
5. **`content-carousel` repetido 10+ veces** — confirmar con el equipo si todas las filas usan el MISMO bloque parametrizado o si hay variantes de tamaño de póster que justifiquen sub-bloques (ej. `content-carousel-portrait` vs `content-carousel-landscape`).
6. **Imágenes LCP** — la imagen LCP candidata es la del `hero-carousel` ítem activo. Confirmado above-the-fold en desktop 1280. ⚠️ En mobile 390 la imagen del hero también queda above-the-fold.
7. **Acordeón FAQ** — Figma muestra todos los items en estado colapsado. Falta documentar el estado expandido (no presente en este archivo). ⚠️ **DATO NO EXTRAÍDO — requiere screen del estado expandido o decisión por defecto.**
8. **Plan-selector "destacado"** — la 2ª tarjeta de plan parece visualmente diferenciada. Confirmar si es una variante (`.plan-selector__card--featured`) o solo un valor de campo editable.

---

## 📋 Estado de generación de instructions.md

| Componente | Estado | Archivo | Notas |
|---|---|---|---|
| `hero-carousel` | ✅ **GENERADO** | `figma-analysis/hero-carousel-instructions.md` | POC aprobada por usuario. Datos Desktop 1280 completos; Tablet/Mobile con marcadores ⚠️. |
| `header` | ✅ **GENERADO** | `figma-analysis/header-instructions.md` | Extraído del nodo overlay `3:10183` (sibling del Body). Tablet/Mobile con ⚠️. |
| `plan-selector` | ✅ **GENERADO** | `figma-analysis/plan-selector-instructions.md` | 3 tarjetas confirmadas (Mensual, Anual, Plan Gratuito). Variante featured = `.plan-card--featured` + boolean UE. Tablet/Mobile con ⚠️. |
| `channel-logos` | ✅ **GENERADO** | `figma-analysis/channel-logos-instructions.md` | 70+ logos. Modo scroll configurable (manual / auto-marquee). |
| `content-carousel` | ✅ **GENERADO** | `figma-analysis/content-carousel-instructions.md` | UN bloque con variantes (`mosaic`, `portrait`, `landscape`). Cubre 7+ instancias. |
| `feature-icons-band` | ✅ **GENERADO** | `figma-analysis/feature-icons-band-instructions.md` | 4 items × 2 instancias en home. |
| `cta-price-band` | ⛔ **BLOQUEADO** | `figma-analysis/cta-price-band-BLOCKED.md` | NO se ha localizado componente con ese patrón en el Figma. Reporte de bloqueo con 3 opciones de resolución para el cliente. |
| `faq-accordion` | ✅ **GENERADO** | `figma-analysis/faq-accordion-instructions.md` | 12 items. Implementación nativa `<details>/<summary>` sin JS. |
| `footer` | ✅ **GENERADO** | `figma-analysis/footer-instructions.md` | 5 columnas + zona inferior con logo + legal + social. Tablet/Mobile con ⚠️. |

**Tokens globales:** ✅ Actualizados en `global-tokens.md` con todos los nuevos tokens detectados en los 8 bloques (sección "ACTUALIZACIÓN — Tokens añadidos en Fase 1 ronda 2").

---

## 📤 Reporte al Orchestrator — FASE 1 COMPLETADA

**Resumen ejecutivo:**
- ✅ **8 instructions.md generados** + 1 reporte de bloqueo documentado.
- ✅ **`global-tokens.md` actualizado** con todos los tokens nuevos (colores, escala tipográfica, radios, gradientes, dimensiones).
- ⛔ **1 bloque bloqueado** (`cta-price-band`) — componente NO localizado en el Figma; requiere decisión del cliente entre 3 opciones documentadas en `cta-price-band-BLOCKED.md`.
- 9 componentes únicos identificados → 8 documentados completamente + 1 con reporte de bloqueo y propuesta de resolución.

**Cobertura por viewport:**
- Desktop 1280: ✅ 100% datos extraídos vía `get_design_context` para los 8 bloques generados.
- Tablet 768: ⚠️ datos basados en **metadata del frame** (heights, sibling positions). Para refinar font-sizes y paddings exactos, ejecutar `get_design_context` adicional sobre los nodos equivalentes (mapeados en cada §6).
- Mobile 390: ⚠️ idem tablet.

> Esta cobertura sigue el mismo patrón aprobado por el usuario en la POC `hero-carousel-instructions.md`.

**Decisiones vinculantes del usuario aplicadas:**
1. ✅ Hero y bloques boilerplate (`/blocks/hero/`, `/blocks/cards/`, etc.) NO han sido modificados.
2. ✅ `header` extraído como bloque fundacional desde nodo overlay `3:10183` (no requiere frame propio).
3. ✅ `content-carousel` modelado como UN bloque parametrizado con variantes CSS (no múltiples bloques).
4. ✅ `faq-accordion` implementación nativa `<details>/<summary>` sin JS para toggle.
5. ✅ `plan-selector` tarjeta destacada como variante CSS `.plan-card--featured` + boolean UE `featured`.
6. ✅ `footer` extraído como bloque fundacional aunque incompleto.

**Bloque bloqueado — `cta-price-band`:**
- **Motivo:** ningún componente del Figma desktop coincide con el patrón "Banda CTA + precio + 'Me interesa'".
- **Recomendación del Analyst:** Opción A — eliminar del INVENTORY. La conversión de usuarios ya está cubierta por `plan-selector`.
- **Acción requerida del Orchestrator:** escalar al usuario las 3 opciones documentadas en `cta-price-band-BLOCKED.md` antes de iniciar Fase 2.

**Tokens nuevos añadidos a `global-tokens.md`:**
- 11 colores nuevos (card backgrounds, borders, FAQ states, footer bg, grises de texto, blue link).
- 13 tamaños tipográficos nuevos (display 70px, h2-large 67px, h3 38px, h2 36px, h2-faq 34px, h3-banner 31px, h3-deportes 30px, blue-label 26px, subtitle 22px, body-md 20px, nav 18px, body-sm/card-meta 16px, caption 14px, footer-link 12px, copyright 10px).
- 3 radios nuevos (`--radius-card: 8px`, `--radius-card-content: 6px`, `--radius-button-pill: 28px`).
- 3 gradientes nuevos (`--gradient-card-overlay`, `--gradient-cta-mask`, `--gradient-edge-mask-left/right`).
- 1 dimensión confirmada (`--height-header-desktop: 122px`).

**TODOs consolidados — requieren decisión del cliente o input adicional antes de Fase 2:**

| # | Tema | Bloques afectados | Tipo |
|---|---|---|---|
| 1 | Confirmar layout responsive exacto en tablet/mobile (font-sizes, paddings) | TODOS | Iteración técnica |
| 2 | Resolver `cta-price-band` → eliminar / variante / página adicional | `cta-price-band` | **Decisión cliente** |
| 3 | Definir hover states de elementos interactivos (CTA, nav, tarjetas, flechas) | header, plan-selector, content-carousel, channel-logos, faq-accordion | **Decisión diseño** |
| 4 | Validar contraste de grises secundarios (#9c9c9c, #a7a7a7, #a9a9a9, #adadad, #a6a6a6) | TODOS | **Decisión diseño** |
| 5 | Aportar archivos `.woff2` de `ApercuMovistar Regular + Bold` | global-tokens | **Decisión cliente** |
| 6 | Confirmar lista definitiva y orden de los 70+ logos de canales | channel-logos | **Decisión cliente** |
| 7 | Confirmar contenido de la 2ª instancia de `feature-icons-band` (`3:9761`) | feature-icons-band | **Decisión cliente** |
| 8 | Confirmar modo single-open vs multi-open de FAQ | faq-accordion | **Decisión cliente** |
| 9 | Confirmar si los items de `feature-icons-band` son enlaces clicables | feature-icons-band | **Decisión cliente** |
| 10 | Definir CMP de cookies (OneTrust / Cookiebot / propio) para integrar trigger | footer | **Decisión cliente** |
| 11 | Confirmar autoría de logos canales: inline en tabla vs fragmento dedicado | channel-logos | **Decisión UE Specialist (Fase 3)** |
| 12 | Confirmar variante exacta de cada instancia de `content-carousel` (mosaic/portrait/landscape) en sus 7+ apariciones | content-carousel | Iteración técnica + cliente |
| 13 | Decisión sticky-on-scroll para header | header | **Decisión producto** |
| 14 | Diseño del drawer móvil del header (no presente en Figma) | header | **Decisión diseño** |
| 15 | Year dinámico en copyright (truncado en Figma como "202[5]") | footer | **Decisión técnica** |

**Estimación para refinamiento responsive completo (opcional, NO bloqueante para Fase 2):**
- Aprox. 16 llamadas adicionales a `get_design_context` (8 bloques × 2 viewports tablet+mobile).
- Realización fuera del scope de esta entrega — la cobertura actual es suficiente para iniciar Fase 2 (EDS Developer) según el patrón aprobado en la POC.

---

## ✅ Confirmación: FASE 1 AL 100%

> ✅ **8 / 9 bloques documentados como instructions.md aptos para Fase 2** (incluye `hero-carousel` POC ya existente).
> ⛔ **1 / 9 bloque bloqueado** con reporte y propuesta de resolución (`cta-price-band-BLOCKED.md`).
> ✅ **`global-tokens.md` actualizado** con todos los nuevos tokens.
> ✅ **`INVENTORY.md` (este archivo) actualizado** con estado final.
>
> **Fase 1 cerrada por el Figma Analyst.** El Orchestrator puede:
> - Avanzar a **Fase 2 (EDS Developer)** con los 8 bloques verdes.
> - Resolver en paralelo el bloqueo de `cta-price-band` con el cliente.
> - Pendientes de decisión cliente/diseño (#2-#15) **NO bloquean el inicio de Fase 2** — pueden resolverse durante el desarrollo.
