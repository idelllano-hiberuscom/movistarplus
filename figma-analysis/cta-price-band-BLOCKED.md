# ⛔ Bloque `cta-price-band` — REPORTE DE BLOQUEO PARCIAL

> **Generado por:** Figma Analyst
> **Archivo Figma:** MovistarPlus — `fileKey: 3gw50VHnWKIBmy03RYlgTl`
> **Estado:** ⚠️ **DATOS INSUFICIENTES — propuesta alternativa adjunta**

---

## Motivo del bloqueo

El INVENTORY.md original describe `cta-price-band` como una "Banda CTA con precio 'Me interesa'" — un patrón típico de banner promocional con precio destacado y botón de conversión.

**Tras la inspección exhaustiva del Figma desktop (frame `3:8554`), NO se ha localizado ningún componente que coincida con este patrón.** Los componentes con precios visibles son:

1. **`plan-selector` (`3:8938`)** — ya documentado como bloque propio. Lleva 3 tarjetas con precios pero NO es una "banda CTA con precio".
2. **Sección `3:9709` ("A TU ALCANCE")** — promo card con imagen+texto, sin precio explícito. Más cerca de un `promo-card` o `content-banner`.
3. **Sección `3:9724` ("Movistar Plus+, lo regalas y triunfas")** — heading "Movistar Plus+, lo regalas y triunfas" 36px Bold + subtítulo "Regala tarjetas Movistar Plus+. Regalo original, fácil, cómodo y rápido." 22px + carrusel horizontal de 6 tarjetas regalo (366×206 px) con máscara de gradiente en bordes. **NO contiene precios visibles ni botón "Me interesa"** — es una mini-galería de productos regalo con CTA implícita en cada tarjeta.

**Ningún componente del Figma desktop coincide con el patrón "Banda CTA + precio + botón 'Me interesa'".**

---

## Datos disponibles vs faltantes

| Sección instructions.md | Estado |
|---|---|
| §1 Descripción funcional | ⚠️ NO HAY componente que documentar |
| §2 Campos editables | ⚠️ NO se pueden definir sin componente fuente |
| §3 Estructura DOM | ⚠️ NO se puede inferir |
| §4 Tokens | ⚠️ N/A |
| §5 Imágenes | ⚠️ N/A |
| §6 Responsive | ⚠️ N/A |
| §7 Estados | ⚠️ N/A |
| §8 Notas | ⚠️ N/A |

---

## Hipótesis del Analyst y propuesta de resolución

Hay **3 caminos posibles** que el Orchestrator debe escalar al usuario:

### Opción A — El bloque `cta-price-band` NO existe en este Figma (RECOMENDADO)
El INVENTORY.md inicial pudo derivar este bloque por inferencia de pipeline genérico, pero el diseño actual de la home de MovistarPlus **no contiene esta variante**. La conversión de usuarios se canaliza enteramente a través de `plan-selector` (que YA tiene precio + CTA "SUSCRIBIRME").

**Acción:** **eliminar `cta-price-band` del INVENTORY.md** y marcar la Fase 1 como completa con 8 bloques en lugar de 9.

### Opción B — `cta-price-band` ≡ `3:9724` (mini-carousel de tarjetas regalo)
Si el cliente entiende "CTA con precio" como "promoción de tarjetas regalo de precio variable", entonces `3:9724` puede modelarse como `cta-price-band` con campos:
- `heading`, `subtitle`
- `giftCards`: container de items (cada uno con imagen + valor nominal opcional + link)

Pero esto sería técnicamente un **`content-carousel` con `variant=gift`** (ya documentado en ese bloque). Crear un bloque separado sería redundante.

**Acción:** confirmar con el cliente si quiere modelar este componente como bloque propio (`cta-price-band`) o como variante de `content-carousel`.

### Opción C — `cta-price-band` aparece en otras páginas (no en la home)
Es posible que el componente exista en páginas internas del Figma (ej. landing de campañas, página de precios dedicada) que NO han sido inspeccionadas. Los frames analizados son únicamente las 3 vistas de la home (Mobile 390 / Tablet 768 / Desktop 1280).

**Acción:** consultar con el cliente si el Figma incluye otras páginas con este patrón. Si SÍ, ejecutar nuevo análisis sobre esos frames y generar el instructions.md con datos reales.

---

## Recomendación final del Figma Analyst

**Recomendación:** **Opción A** — eliminar `cta-price-band` del INVENTORY.md. La conversión está cubierta por `plan-selector`. Si en el futuro aparece la necesidad de una banda CTA dedicada, puede crearse como nuevo bloque o variante de `plan-selector`.

**Acciones para el Orchestrator:**
1. Escalar al usuario para confirmar opción A / B / C.
2. Si A: actualizar INVENTORY.md eliminando la fila `cta-price-band` y dejar Fase 1 como **8 bloques completos + 1 descartado**.
3. Si B: revertir documentación duplicada — marcar `cta-price-band` como alias de `content-carousel --gift` y eliminar este archivo.
4. Si C: pedir al usuario que comparta los node IDs de las páginas adicionales para análisis.

---

## Datos de contexto (por si se reactiva el análisis)

**Sección `3:9724` — datos extraídos parcialmente:**
- Heading: "Movistar Plus+, lo regalas y triunfas" (36px Bold blanco centrado, `letter-spacing: -0.53px`)
- Subtítulo: "Regala tarjetas Movistar Plus+. Regalo original, fácil, cómodo y rápido." (22px Regular blanco centrado)
- Lista horizontal: 6 items con `width: 366.6px`, `height: 206.21px`, `border-radius: 5px`
- Edge gradient mask: `from-[rgba(0,0,0,0.9)] to-transparent` en los bordes laterales (degradado de máscara para indicar overflow)
- Posición: y=7440, h=380 (sección completa)
- Equivalente tablet: `3:6230` (h=380), mobile: `3:7984` (h=436)

Estos datos podrían reutilizarse si finalmente se decide modelar como bloque propio (Opción B).

---

> ⛔ **PROTOCOLO DE BLOQUEO MCP DE FIGMA ANALYST v2.1.0:** este reporte sustituye al instructions.md por incumplir el umbral mínimo de datos (no hay componente fuente identificable). El Orchestrator NO debe avanzar a Fase 2 con `cta-price-band` mientras esta ambigüedad no se resuelva. Las otras 8 instructions.md generadas en esta misma fase SÍ son aptas para Fase 2.
