# Design Tokens Globales — MovistarPlus
> **Para implementar en:** `/styles/styles.css` y `/styles/fonts.css`
> **Modelo de proyecto:** xwalk (EDS + Universal Editor)
> **Fuente:** valores extraídos vía Figma MCP `get_design_context` sobre nodos representativos del archivo `3gw50VHnWKIBmy03RYlgTl`.
> ⚠️ **El archivo Figma NO usa Figma Variables** (`get_variable_defs` devolvió `{}`). Todos los tokens se han inferido leyendo valores literales en cada nodo. Donde un valor se ha extraído de un único componente y aún no se ha verificado en otros, está marcado como `// ⚠️ verificar al analizar resto de componentes`.

---

## 🎨 Colores

```css
:root {
  /* === Neutros === */
  --color-black:                    #000000;  /* Fondo principal de la home */
  --color-white:                    #ffffff;  /* Texto sobre fondos oscuros (titulares, body) */
  --color-text-muted:               #a6a6a6;  /* Texto secundario gris ej. "MES imp. incl." */
  --color-text-disclaimer:          #adadad;  /* Texto de aviso legal pequeño "Precio final. Sin permanencia." */

  /* === Marca / acción === */
  --color-brand-blue:               #0066ff;  /* Azul primario CTA — botón "SUSCRIBIRME AHORA" (rgb(0,102,255)) */

  /* === Gradientes === */
  --gradient-hero-overlay: linear-gradient(
    0deg,
    rgb(0, 0, 0) 0%,
    rgba(0, 0, 0, 0.96) 5.79%,
    rgba(0, 0, 0, 0.89) 10.88%,
    rgba(0, 0, 0, 0.80) 15.63%,
    rgba(0, 0, 0, 0.698) 20.37%,
    rgba(0, 0, 0, 0.58) 25.46%,
    rgba(0, 0, 0, 0.463) 31.25%,
    rgba(0, 0, 0, 0.345) 38.08%,
    rgba(0, 0, 0, 0.235) 46.30%,
    rgba(0, 0, 0, 0.14) 56.25%,
    rgba(0, 0, 0, 0.067) 68.29%,
    rgba(0, 0, 0, 0.02) 82.75%,
    rgba(0, 0, 0, 0) 100%
  ); /* Overlay degradado de negro a transparente para legibilidad sobre imágenes hero */

  /* === Pendientes de verificación === */
  /* ⚠️ Colores de fondo de tarjetas plan, FAQ, footer NO extraídos aún — requieren análisis de cada componente */
}
```

### Tokens de color: estado de verificación

| Token | Componente origen | Verificado en otros componentes |
|---|---|---|
| `--color-black` | hero-carousel (fondo página) | ⚠️ Por verificar en plan-selector, footer |
| `--color-white` | hero-carousel (titulares, CTA, body) | ⚠️ Por verificar en otros |
| `--color-text-muted` | hero-carousel ("MES imp. incl.") | ⚠️ Por verificar |
| `--color-text-disclaimer` | hero-carousel ("Precio final…") | ⚠️ Por verificar |
| `--color-brand-blue` | hero-carousel (CTA `bg-[#06f]`) | ⚠️ Por verificar en plan-selector, cta-price-band, header (login) |

---

## ✍️ Tipografías

### Familia `ApercuMovistar`

Familia tipográfica propietaria con dos pesos detectados en Figma:

```css
/* /styles/fonts.css */
@font-face {
  font-family: 'ApercuMovistar';
  font-style: normal;
  font-weight: 400;
  /* ⚠️ URL del archivo .woff2 NO disponible en Figma MCP — requiere proporcionarlo el equipo de marca */
  src: url('/fonts/ApercuMovistar-Regular.woff2') format('woff2');
  font-display: swap;
}

@font-face {
  font-family: 'ApercuMovistar';
  font-style: normal;
  font-weight: 700;
  /* ⚠️ URL del archivo .woff2 NO disponible — requiere proporcionarlo el equipo de marca */
  src: url('/fonts/ApercuMovistar-Bold.woff2') format('woff2');
  font-display: swap;
}
```

```css
/* /styles/styles.css */
:root {
  --font-family-primary: 'ApercuMovistar', 'Helvetica Neue', Helvetica, Arial, sans-serif;

  /* === Pesos === */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* === Escala tipográfica (extraída del Hero — pendiente verificar en otros componentes) === */
  --font-size-display:  64px;   /* Precio grande "9" del hero — line-height 48px */
  --font-size-display-decimal: 38px;  /* Decimal precio ",99€" — line-height 28.5px, letter-spacing -1.26px */
  --font-size-h1:       40px;   /* Heading hero — line-height 42px, letter-spacing -0.51px */
  --font-size-body-lg:  20px;   /* Body grande, CTA — line-height 24px (body) / 20px (CTA) */
  --font-size-body:     15px;   /* Texto disclaimer ("Precio final. Sin permanencia.") — line-height 17px */
  --font-size-small:    14px;   /* Texto auxiliar "MES imp. incl." — line-height 12.54px */

  /* === Line heights === */
  --line-height-display:        48px;
  --line-height-display-decimal: 28.5px;
  --line-height-h1:             42px;
  --line-height-body-lg:        24px;
  --line-height-cta:            20px;
  --line-height-body:           17px;
  --line-height-small:          12.54px;

  /* === Letter spacing === */
  --letter-spacing-h1:           -0.51px;
  --letter-spacing-display-decimal: -1.26px;
  --letter-spacing-cta:          -0.44px;
}
```

### Tipografías: estado de verificación

| Token | Componente origen | Notas |
|---|---|---|
| `--font-family-primary` (`ApercuMovistar`) | hero-carousel | ⚠️ Confirmado en titulares, body, CTA. Falta verificar si plan-selector / footer usan la misma |
| `--font-size-h1: 40px` | hero-carousel `Heading 2` | ⚠️ Otros headings (`H2` carruseles "Series exclusivas", "Estrenos"…) NO medidos aún |
| `--font-size-display: 64px` | hero-carousel precio "9" | Específico del precio, no es escala general |
| `--font-size-body: 15px` | hero-carousel disclaimer | ⚠️ El body "estándar" puede ser 16px en otros componentes — sin verificar |

---

## 📏 Espaciados

> ⚠️ **Aviso:** los espaciados a continuación se derivan únicamente del análisis del `hero-carousel`. Una escala global de spacing requiere analizar todos los componentes. Se documentan los valores literales detectados.

```css
:root {
  /* Espaciados detectados en hero-carousel */
  --spacing-hero-pl:        64px;    /* padding-left del bloque de contenido del hero */
  --spacing-hero-pb:        50px;    /* padding-bottom del bloque de contenido del hero */
  --spacing-content-gap:    20px;    /* gap entre titular y subtítulo del hero */
  --spacing-block-gap-sm:   8px;     /* gap entre precio y CTA */
  --spacing-content-pb:     20px;    /* padding-bottom de bloques de texto */

  /* CTA padding (hero) */
  --spacing-cta-py-top:     13.665px;  /* padding-top calculado del CTA */
  --spacing-cta-py-bottom:  14.335px;  /* padding-bottom calculado del CTA */
  --spacing-cta-px:         20px;       /* padding-x del CTA */

  /* ⚠️ Escala spacing global NO definida — pendiente unificar al analizar todos los componentes */
}
```

---

## 📐 Breakpoints

Extraídos directamente de los anchos de los frames responsive en Figma:

```css
:root {
  /* Breakpoints canónicos del proyecto */
  --bp-mobile:        390px;   /* Vista-390px — diseño móvil de referencia */
  --bp-tablet:        768px;   /* Frame Html 768 — diseño tablet de referencia */
  --bp-desktop:       1280px;  /* Vista-1280px — diseño desktop de referencia */
}

/* Media queries recomendadas */
/* Mobile-first: base styles para 390+ */

@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1280px) {
  /* Desktop */
}
```

> ⚠️ Existen también frames a 1024 (`Html`) y 1920 (`Vista-1920px`) en Figma. Se han descartado como breakpoints canónicos por:
> - **1024:** sin prefijo `Vista-`, parece variante intermedia.
> - **1920:** vista XL con contenido a 1440 — el layout es idéntico al de 1280 escalado, no introduce nuevo breakpoint.
> Si el equipo de QA detecta saltos visuales en esos anchos, considerar añadir breakpoints adicionales.

---

## 🔘 Border radius

```css
:root {
  --radius-button: 5px;  /* Botón CTA "SUSCRIBIRME AHORA" del hero — extraído de rounded-[5px] */
  /* ⚠️ Otros radios (tarjetas plan, inputs, FAQ) NO extraídos aún */
}
```

---

## 🌑 Sombras

> ⚠️ **DATO NO EXTRAÍDO** — el `hero-carousel` no presenta sombras. Las tarjetas de `plan-selector` y `feature-icons-band` podrían requerirlas. Se completarán al analizar esos componentes.

---

## 🧩 Notas de implementación para EDS Developer (Fase 2)

1. **Crear `/styles/fonts.css`** con las dos `@font-face` de ApercuMovistar (Regular + Bold). El equipo de marca debe proporcionar los archivos `.woff2`. Hasta entonces, el fallback `Helvetica Neue, Arial` mantiene la jerarquía.
2. **Volcar todos los tokens en `:root` dentro de `/styles/styles.css`**, no en cada bloque.
3. **NO inventar tokens** — cualquier valor adicional necesario debe rastrearse en el Figma vía Figma MCP y añadirse aquí.
4. **El fondo global `<body>` es `--color-black`** (verificado en hero, hipótesis para el resto de la página).
5. **CTA primario:** fondo `--color-brand-blue`, texto `--color-white`, mayúsculas, `border-radius: var(--radius-button)`. Padding y tipografía siguen los tokens listados.
6. **Gradiente hero (`--gradient-hero-overlay`):** se aplica como capa de oscurecimiento entre la imagen del hero y el texto, para garantizar contraste WCAG AA. ♿ Verificar contraste de cada combinación texto/imagen.

---

## 📌 Próximos pasos para completar tokens

Al ejecutar el resto de `*-instructions.md`, este archivo debe actualizarse con:
- Tokens de tarjetas (`plan-selector`, FAQ, footer columns).
- Sombras y radios adicionales.
- Tamaños tipográficos H2/H3 de cabeceras de carrusel ("Series exclusivas", "Estrenos…").
- Color de fondo de footer.
- Colores de iconos / SVGs.
- Espaciados verticales entre secciones.

---

# 📦 ACTUALIZACIÓN — Tokens añadidos en Fase 1 ronda 2 (8 bloques restantes)

> Tokens extraídos de los `get_design_context` aplicados a `header`, `footer`, `plan-selector`, `feature-icons-band`, `channel-logos`, `faq-accordion`, `content-carousel` y `cta-price-band` (bloqueado).
> Todos los valores se han leído literalmente de los nodos del Figma.

## 🎨 Colores nuevos

```css
:root {
  /* === Tarjetas / superficies === */
  --color-card-bg-light:        #ffffff;              /* Fondo tarjetas plan default */
  --color-card-bg-dark:         #232323;              /* Fondo tarjeta "Plan Gratuito" featured */
  --color-card-bg-channel:      #1f1f1f;              /* Fondo tarjeta de logo de canal */
  --color-overlay-card:         rgba(255, 255, 255, 0.1); /* Fondo de items de content-carousel */

  /* === Bordes / acentos === */
  --color-featured-border:      #ffa000;              /* Borde naranja tarjeta plan featured (2px) */

  /* === FAQ === */
  --color-faq-item-default:     rgba(54, 54, 54, 0.4);   /* Fondo item FAQ colapsado */
  --color-faq-item-active:      rgba(89, 89, 89, 0.54);  /* Fondo item FAQ expandido */

  /* === Footer === */
  --color-footer-bg:            rgba(216, 216, 216, 0.06); /* Fondo del footer */

  /* === Texto secundario / grises === */
  --color-text-secondary-grey:  #9c9c9c;   /* Texto pequeño "Imp. incl." en plan-selector */
  --color-text-grey-faq:        #a7a7a7;   /* Texto respuesta FAQ */
  --color-text-grey-channel:    #a9a9a9;   /* Body en card editorial de content-carousel */

  /* === Acento azul para labels === */
  --color-blue-link:            #3588ff;   /* Label "DEPORTES" en card editorial */
}
```

> ⚠️ **Atención:** los grises secundarios (`--color-text-muted: #a6a6a6`, `--color-text-disclaimer: #adadad`, `--color-text-secondary-grey: #9c9c9c`, `--color-text-grey-faq: #a7a7a7`, `--color-text-grey-channel: #a9a9a9`) son todos **muy similares pero NO idénticos**. Validar con diseño si se unifican a 1-2 tokens o si la diferencia es intencionada.

## ✍️ Escala tipográfica ampliada

```css
:root {
  /* === Display & headings === */
  --font-size-display-mega:    70px;   /* Precio entero "9", "99", "0" en plan-selector */
  --font-size-h2-large:        67px;   /* Heading "Elige tu plan" */
  --font-size-h3:              38px;   /* Título tarjeta plan + decimales precio */
  --font-size-h2:              36px;   /* Heading "Y más de 80 canales", "Movistar Plus+, lo regalas..." */
  --font-size-h2-faq:          34px;   /* Heading "Preguntas frecuentes" */
  --font-size-h3-banner:       31px;   /* Headings de feature-icons-band */
  --font-size-h3-deportes:     30px;   /* Heading card editorial content-carousel */
  --font-size-blue-label:      26px;   /* Label "DEPORTES" en card editorial */
  --font-size-subtitle:        22px;   /* Subtítulo "Regala tarjetas Movistar Plus+..." */
  --font-size-body-md:         20px;   /* Body en plan-selector cards, subtitle channel-logos */
  --font-size-nav:             18px;   /* Nav items header + footer column heading */
  --font-size-body-sm:         16px;   /* Body FAQ + caption secundaria */
  --font-size-card-meta:       16px;   /* "MES", "AÑO", "Precio final al mes" */
  --font-size-caption:         14px;   /* Caption inferior content-carousel cards */
  --font-size-footer-link:     12px;   /* Enlaces de footer */
  --font-size-copyright:       10px;   /* © Telefónica... */
}
```

## 📏 Espaciados verticales entre secciones

```css
:root {
  /* La mayoría de secciones usan padding-top 50px */
  --section-pt:                50px;
  /* Padding lateral global */
  --section-px:                63.23px;
}
```

## 🔘 Radios añadidos

```css
:root {
  --radius-card:               8px;    /* Tarjetas plan-selector */
  --radius-card-content:       6px;    /* Tarjetas de content-carousel */
  --radius-button-pill:        28px;   /* Botón CTA "SUSCRIBIRME" en plan-selector (más redondeado que el header) */
  /* --radius-button: 5px ya definido en sección anterior */
}
```

## 🌈 Gradientes añadidos

```css
:root {
  /* Gradiente bottom-to-top para overlay de tarjetas content-carousel */
  --gradient-card-overlay: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.77) 5.79%,
    rgba(0, 0, 0, 0.714) 10.88%,
    rgba(0, 0, 0, 0.643) 15.63%,
    rgba(0, 0, 0, 0.557) 20.37%,
    rgba(0, 0, 0, 0.467) 25.46%,
    rgba(0, 0, 0, 0.37) 31.25%,
    rgba(0, 0, 0, 0.28) 38.08%,
    rgba(0, 0, 0, 0.19) 46.30%,
    rgba(0, 0, 0, 0.114) 56.25%,
    rgba(0, 0, 0, 0.055) 68.29%,
    rgba(0, 0, 0, 0.016) 82.75%,
    rgba(0, 0, 0, 0) 100%
  );

  /* Gradiente sobre el CTA "MÁS DEPORTES" del card editorial */
  --gradient-cta-mask: linear-gradient(
    to top,
    rgba(26, 26, 26, 0) 0%,
    #1a1a1a 100%
  );

  /* Edge mask para gift carousel (bordes laterales) */
  --gradient-edge-mask-left: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  --gradient-edge-mask-right: linear-gradient(
    to left,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}
```

## 📐 Dimensiones fijas

```css
:root {
  --height-header-desktop:     122px;   /* Altura header en Desktop 1280 */
  /* ⚠️ height header tablet/mobile NO extraído — pendiente get_design_context sobre 3:6698 y 3:8462 */
}
```

## 🚧 Tokens NO confirmados o pendientes (Fase 2)

- **Hover states** de cualquier elemento interactivo (CTA, nav items, tarjetas, flechas de carrusel, items FAQ): **NO extraídos del Figma** — los maquetadores deben proponer y validar con diseño.
- **Sombras (`box-shadow`)**: ningún componente analizado las usa visiblemente. Ausentes del token set.
- **`@font-face` de `ApercuMovistar`**: archivos `.woff2` aún NO disponibles. El equipo de marca debe proporcionarlos.
- **Tokens responsive**: las medidas extraídas son del viewport Desktop 1280. Tablet (768) y Mobile (390) requieren ejecución adicional de `get_design_context` para confirmar font-sizes reescalados.
- **Spacing scale unificada**: continúan apareciendo paddings literales por componente. Una propuesta de escala (`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 50 / 64`) puede consolidarse al iniciar Fase 2.

