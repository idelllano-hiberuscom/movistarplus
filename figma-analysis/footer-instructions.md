# Instrucciones de Bloque: `footer`
> **Generado por:** Figma Analyst
> **Archivo Figma:** MovistarPlus — `fileKey: 3gw50VHnWKIBmy03RYlgTl`
> **Nodos de referencia:**
> - Desktop 1280: `3:9925` (Footer) — sibling de `Body` dentro de `Vista-1280px`
> - Tablet 768: `3:6436` (Footer)
> - Mobile 390: `3:8200` (Footer)
> **Complejidad:** Media
> **Requiere JS:** no *(navegación pura, solo CSS)*
> **Modelo UE:** xwalk
> **Bloque existente en repo:** ✅ `/blocks/footer/` — el boilerplate aporta carga vía `footer.js`. Se debe **extender**, no reemplazar.

---

## 1. Descripción funcional

Footer corporativo de la home, fondo translúcido `rgba(216,216,216,0.06)` (token nuevo `--color-footer-bg`). Altura `687px` en desktop. Contiene dos zonas:

- **Zona superior (5 columnas de enlaces):** cada columna tiene un encabezado de sección (ej. "Seccione[s]") en 18px Regular blanco con `letter-spacing: -0.4px` y debajo una lista vertical de enlaces a 12px Regular blanco con `line-height: 25px`. Cada columna tiene `min-width: 150px`, `max-width: 300px`, ancho dominante `~227px`. Las columnas observadas listan: géneros de Cine, géneros de Series, secciones de la web (Originales, Documentales, Infantil), Deportes (LALIGA, Champions…), y "Sobre Movistar Plus+".
- **Zona inferior (3 bloques flex):** logo Movistar Plus+ (99×24 SVG) + copyright "© Telefónica de España, S.A.U. 202[5]" en 10px / línea de enlaces legales horizontales con divisores verticales (`Prestador del servicio | Aviso legal | Privacidad | cookies` en 12px) / título "Síguenos en redes" en 18px alineado a la derecha + 6 iconos sociales (20×20 cada uno).

> ⚠️ **DECISIÓN VINCULANTE del usuario (Fase 1, ronda 2):** este bloque es FUNDACIONAL. Se documenta aunque el contenido sea muy extenso y los textos del Figma estén truncados (ej. "Cine EspañolO", "Cine Acción", "PelíÌculas Infantile[s]") por overflow del frame.

---

## 2. Campos editables para Universal Editor (xwalk)

> 📌 El footer EDS estándar se autora desde `/footer.docx` con una tabla por columna, no como bloque inline en una página. Los campos editables se modelan a nivel de columna y enlace.

**Campos del contenedor raíz** (`id: footer` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Columnas de enlaces | `columns` | `container` | `string` | sí | "Columnas del footer (recomendado: 5)" |
| Logo (imagen) | `logo` | `reference` (image) | `string` | sí | "Logo en zona inferior" |
| Texto alternativo del logo | `logoAlt` | `text` | `string` | sí | "Texto alternativo del logo" |
| Texto de copyright | `copyright` | `text` | `string` | sí | "Texto de copyright (ej. © Telefónica…)" |
| Enlaces legales | `legalLinks` | `container` | `string` | sí | "Enlaces legales (Aviso, Privacidad, Cookies…)" |
| Título redes sociales | `socialTitle` | `text` | `string` | no | "Título sobre los iconos sociales" |
| Iconos sociales | `socialLinks` | `container` | `string` | no | "Iconos de redes sociales" |

**Campos de cada columna** (`id: footer-column` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Encabezado de columna | `heading` | `text` | `string` | sí | "Título de la columna" |
| Lista de enlaces | `links` | `container` | `string` | sí | "Enlaces de esta columna" |

**Campos de cada enlace** (`id: footer-link` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Texto | `label` | `text` | `string` | sí | "Texto visible del enlace" |
| Destino | `link` | `aem-content` | `string` | sí | "URL destino" |

**Campos de cada enlace social** (`id: footer-social` en `component-models.json`):

| Campo | `name` | `component` | `valueType` | ¿Requerido? | Label (ES) |
|---|---|---|---|---|---|
| Red social | `network` | `select` (facebook/twitter/instagram/youtube/tiktok/linkedin) | `string` | sí | "Red social" |
| URL del perfil | `link` | `aem-content` | `string` | sí | "URL del perfil" |
| Etiqueta accesible | `ariaLabel` | `text` | `string` | sí | "Aria-label del enlace (ej. 'Síguenos en Facebook')" |

---

## 3. Estructura DOM

### ENTRADA — Matriz EDS (lo que `decorate(block)` recibe)

El footer EDS se autora típicamente como un documento `/footer.docx` con tablas anidadas: una para las columnas, otra para la zona inferior. La matriz que `decorate` recibe será:

```
block.footer
  └── div (fila 1: columnas de enlaces — bloque anidado)
        └── div (col 0)
              └── <div> ← contenedor de columnas (puede ser <ul> de columnas)
                    ├── <div> col 1
                    │     ├── <h3> ← encabezado "Cine"
                    │     └── <ul>
                    │           ├── <li><a href="...">Cine Original M+</a></li>
                    │           ├── <li><a href="...">Cine Español</a></li>
                    │           └── ...
                    ├── <div> col 2 — mismo patrón
                    ├── <div> col 3
                    ├── <div> col 4
                    └── <div> col 5
  └── div (fila 2: zona inferior)
        └── div (col 0: logo + copyright)
              ├── <picture> ← logo
              └── <p> ← "© Telefónica de España, S.A.U. 2025"
        └── div (col 1: enlaces legales)
              └── <ul>
                    ├── <li><a href="...">Prestador del servicio</a></li>
                    ├── <li><a href="...">Aviso legal</a></li>
                    ├── <li><a href="...">Privacidad</a></li>
                    └── <li><button>cookies</button></li>  ← cookies abre panel JS, no es link
        └── div (col 2: redes sociales)
              ├── <p> ← "Síguenos en redes"
              └── <ul>
                    ├── <li><a href="..." aria-label="Facebook"><img src="/icons/facebook.svg" alt=""></a></li>
                    ├── <li><a href="..." aria-label="Twitter"><img src="/icons/twitter.svg" alt=""></a></li>
                    └── ...
```

> 📌 EDS genera `<ul><li><a>` automáticamente cuando el documento contiene listas. El developer NO debe reconstruirlas.

### SALIDA — DOM decorado (lo que `decorate(block)` produce)

```html
<footer class="footer block" data-block-name="footer" data-block-status="loaded">
  <div class="footer__inner">

    <div class="footer__columns">
      <section class="footer__column">
        <h3 class="footer__column-heading">Cine</h3>
        <ul class="footer__column-list">
          <li><a href="/cine">Cine</a></li>
          <li><a href="/cine-original">Cine Original M+</a></li>
          <li><a href="/cine-espanol">Cine Español</a></li>
          <li><a href="/cine-comedia">Cine Comedia</a></li>
          <li><a href="/cine-accion">Cine Acción</a></li>
          <li><a href="/cortos">Cortos</a></li>
          <li><a href="/peliculas-infantiles">Películas Infantiles</a></li>
          <!-- ... -->
        </ul>
      </section>
      <!-- 4 columnas más, mismo patrón -->
    </div>

    <div class="footer__bottom">
      <div class="footer__brand">
        <picture class="footer__logo">
          <img src="/icons/logo-movistar-plus.svg" alt="Movistar Plus+" loading="lazy">
        </picture>
        <p class="footer__copyright">© Telefónica de España, S.A.U. 2025</p>
      </div>

      <ul class="footer__legal">
        <li><a href="/legal/prestador">Prestador del servicio</a></li>
        <li><a href="/legal/aviso">Aviso legal</a></li>
        <li><a href="/legal/privacidad">Privacidad</a></li>
        <li><button type="button" class="footer__cookies-btn">cookies</button></li>
      </ul>

      <div class="footer__social">
        <p class="footer__social-title">Síguenos en redes</p>
        <ul class="footer__social-list">
          <li><a href="..." aria-label="Síguenos en Facebook"><img src="/icons/facebook.svg" alt="" width="20" height="20"></a></li>
          <li><a href="..." aria-label="Síguenos en Twitter / X"><img src="/icons/twitter.svg" alt="" width="20" height="20"></a></li>
          <li><a href="..." aria-label="Síguenos en Instagram"><img src="/icons/instagram.svg" alt="" width="20" height="20"></a></li>
          <li><a href="..." aria-label="Síguenos en YouTube"><img src="/icons/youtube.svg" alt="" width="20" height="20"></a></li>
          <li><a href="..." aria-label="Síguenos en TikTok"><img src="/icons/tiktok.svg" alt="" width="20" height="20"></a></li>
          <li><a href="..." aria-label="Síguenos en LinkedIn"><img src="/icons/linkedin.svg" alt="" width="20" height="20"></a></li>
        </ul>
      </div>
    </div>

  </div>
</footer>
```

**Notas de transformación DOM aplicadas por `decorate()`:**
- Wrapping con `<footer>` semántico.
- Conversión de `<div>` columna a `<section>` semántico con `<h3>` para el encabezado.
- Detección del enlace "cookies" y conversión a `<button>` (porque abre un panel JS, no navega).
- Inyección de `aria-label` en cada icono social a partir del campo `network` o `ariaLabel`.
- Iconos sociales como `<img src="/icons/...svg">` con `alt=""` (decorativos, el aria-label está en el `<a>`).

---

## 4. Tokens utilizados

Referencias a `global-tokens.md`:

| Propiedad CSS | Token |
|---|---|
| Fondo del footer | `var(--color-footer-bg)` (NUEVO: `rgba(216,216,216,0.06)`) |
| Color de texto | `var(--color-white)` |
| Color de divisor vertical (legal) | `var(--color-white)` (1px) |
| Familia tipográfica | `var(--font-family-primary)` |
| Encabezado de columna | `font-size: 18px / line-height: 20px / letter-spacing: -0.4px / weight: regular` |
| Items de lista | `font-size: 12px / line-height: 25px` |
| Copyright | `font-size: 10px / line-height: 12px` |
| Enlaces legales | `font-size: 12px / line-height: 20px` |
| Título "Síguenos en redes" | `font-size: 18px / line-height: 20px / letter-spacing: -0.4px` (alineado a derecha) |
| Padding contenedor | `pt-45 pb-50 px-63.23` (px) |
| Gap entre zona superior e inferior | `gap-50` (px) |
| Gap entre social icons | `gap-20` (px) |
| Gap entre legal links | `gap-26` (px) |

> ⚠️ **Tokens NUEVOS añadidos a `global-tokens.md`:**
> - `--color-footer-bg: rgba(216,216,216,0.06)`
> - `--font-size-footer-link: 12px`
> - `--font-size-copyright: 10px`
> - `--line-height-footer-link: 25px`

---

## 5. Gestión de imágenes y media

| Imagen | Origen | Tratamiento | Notas |
|---|---|---|---|
| **Logo Movistar Plus+** (99×24) | Asset estático en `/icons/logo-movistar-plus.svg` | `loading="lazy"` | Está below-the-fold (al final de la página) — NO es candidato LCP. |
| **Iconos sociales** (20×20 cada uno × 6) | Assets SVG en `/icons/facebook.svg`, `twitter.svg`, `instagram.svg`, `youtube.svg`, `tiktok.svg`, `linkedin.svg` | `loading="lazy"` + `width`/`height` explícitos para evitar CLS | Decorativos visualmente (el aria-label está en el `<a>` padre). |

**Texto alternativo (`alt`):**
- Logo: `"Movistar Plus+"`.
- Iconos sociales: `alt=""` (el `<a>` lleva `aria-label`).

---

## 6. Comportamiento responsivo

### Desktop ≥ 1280px
- **Datos extraídos del nodo `3:9925`:** altura `687px`, ancho contenedor 1264.67px (`px-63.23`).
- **Layout zona superior:** `display: flex` con 5 columnas, cada una `flex: 1 0 0` con `max-width: 300px / min-width: 150px`. Centradas horizontalmente. Altura uniforme 461px.
- **Layout zona inferior:** `display: flex; justify-content: space-between` con 3 bloques: brand (235.61px), legal (508.65px centrado), social (293.95px alineado derecha).

### Tablet 768px – 1279px
- **Nodo equivalente:** `3:6436` (existe en frame Tablet 768, altura `563px`).
- **DATOS NO CONFIRMADOS POR get_design_context** — basado en metadata.
- **Layout esperado:** las 5 columnas probablemente se reorganizan a **2-3 columnas** con wrap. La zona inferior puede mantenerse en 3 bloques o reorganizarse en 2 filas.
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:6436` para confirmar.

### Mobile < 768px (390px de referencia)
- **Nodo equivalente:** `3:8200` (existe en frame Mobile 390, altura `1024px` — significativamente mayor que desktop, lo que confirma que las columnas se apilan).
- **DATOS NO CONFIRMADOS POR get_design_context** — basado en metadata.
- **Layout esperado:** las 5 columnas se apilan **verticalmente (1 columna por fila)**. La zona inferior pasa a stack vertical: logo arriba, copyright debajo, enlaces legales en wrap, redes sociales abajo centradas.
- **Acción requerida del Orchestrator:** ejecutar `get_design_context` sobre `3:8200` para confirmar paddings, font-sizes y orden visual exacto.

---

## 7. Estados / interacciones

| Estado | Trigger | Comportamiento |
|---|---|---|
| **Hover sobre enlace** | mouse hover (desktop) | Subrayado + ligero cambio de color (CSS). ⚠️ Color hover NO extraído del Figma. |
| **Focus en cualquier link/botón** | Tab/teclado | Outline visible WCAG 2.4.7 — `outline: 2px solid var(--color-white); outline-offset: 2px;`. ♿ |
| **Hover sobre icono social** | mouse hover | Cambio de opacidad/escala (CSS). |
| **Click en "cookies"** | mouse/teclado | Abre panel de gestión de cookies (CMP). **Requiere JS** — el código del CMP NO forma parte del bloque footer. El footer solo expone el botón con `data-cookie-trigger` o similar. |

**Clasificación:**
- **Solo CSS:** TODO lo visual (hover, focus, layout responsive, divisores). El bloque footer en sí mismo NO requiere JS.
- **Requiere JS externo:** el botón `cookies` invoca al CMP de la página (fuera del scope del bloque).

---

## 8. Notas de rendimiento, accesibilidad y TODOs

### Performance
- ✅ Below-the-fold: todas las imágenes con `loading="lazy"`.
- ✅ Iconos SVG con `width`/`height` explícitos para evitar CLS.
- ⚠️ Si el footer es MUY largo en mobile (1024px), considerar lazy-render de las columnas o IntersectionObserver para diferir asset loading.

### Accesibilidad ♿
- `<footer>` semántico como wrapper (no `<div>`).
- Cada columna como `<section>` con `<h3>` (jerarquía respetada — el `<h2>` queda libre para el bloque `faq-accordion` que está justo encima).
- Listas de enlaces como `<ul><li><a>`.
- Iconos sociales: el `<a>` lleva `aria-label="Síguenos en {red}"`, el `<img>` lleva `alt=""`.
- Botón "cookies": `<button type="button">` (no `<a>`) porque dispara JS, no navega.
- Contraste: texto blanco sobre fondo translúcido oscuro debe alcanzar AA (4.5:1). ⚠️ El fondo `rgba(216,216,216,0.06)` resulta casi negro sobre body negro — verificar contraste.
- Indicador de visited state si aplica (UX común en footers).

### TODOs y ambigüedades
1. ⚠️ **Confirmar layout exacto** de tablet (768) y mobile (390) con `get_design_context` adicional sobre `3:6436` y `3:8200`.
2. ⚠️ **Textos del Figma truncados** por overflow ("Cine EspañolO", "PelíÌculas Infantile") — los enlaces reales del cliente aportarán los textos correctos en la fase de contenido. Los textos del Figma son ilustrativos.
3. ⚠️ **6 iconos sociales detectados** en el Figma pero las URLs reales y la red social específica de cada uno deben validarse (Facebook, X/Twitter, Instagram, YouTube, TikTok, LinkedIn — orden y presencia es presunción del Analyst).
4. ⚠️ **Fondo translúcido** `rgba(216,216,216,0.06)` sobre `--color-black` resulta apenas perceptible. Validar con diseño si era intencionado o si el Figma muestra un nivel de transparencia alterado.
5. ⚠️ **Año del copyright "202[5]"** truncado en Figma. Confirmar año real (probable que sea año dinámico generado por JS o template AEM).
6. ⚠️ El bloque existente `/blocks/footer/` del boilerplate carga su contenido desde `/footer.plain.html`. Se debe **respetar este patrón** y no romper compatibilidad con la convención EDS.
7. ⚠️ **CMP de cookies:** el botón "cookies" depende de un script externo de gestión de consentimiento. Confirmar con el cliente qué CMP está en uso (OneTrust, Cookiebot, propio) para integrar correctamente el trigger.
