/**
 * Promo Band Block — AEM Edge Delivery Services
 *
 * Figma reference: Desktop 1280 — Variant A (3:9401), Variant B (3:9755)
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: ✅ Completado (Fase 3)
 * QA audit: ✅ Validado
 *
 * QA Changes:
 * - Sin cambios funcionales necesarios
 *
 * DOM de entrada xwalk (block-level fields → columnas en una sola fila):
 *   block (div.promo-band)
 *     data-variant → select field (block.dataset.variant)
 *     └── div (row 0)
 *           ├── div (col 0) → backgroundImage (<picture> o vacío)
 *           ├── div (col 1) → backgroundImageAlt (texto plano)
 *           ├── div (col 2) → icon (<picture>)
 *           ├── div (col 3) → iconAlt (texto plano)
 *           └── div (col 4) → text (texto plano con enlace embebido)
 *
 * @param {Element} block - Root element of the block
 */
export default function decorate(block) {
  const rows = [...block.children];

  // variant es un campo select → se almacena en block.dataset
  const variant = (block.dataset.variant || 'plain').toLowerCase();
  block.classList.add(`promo-band--${variant}`);

  // Block-level fields are columns within a single row in xwalk
  const row = rows[0];
  const cols = row ? [...row.children] : [];
  const bgCol = cols[0];
  const bgAltCol = cols[1];
  const iconCol = cols[2];
  const iconAltCol = cols[3];
  const textCol = cols[4];

  // Inner wrapper — centrado y max-width
  const inner = document.createElement('div');
  inner.classList.add('promo-band__inner');

  // --- Imagen de fondo (col 0) — solo si existe ---
  const bgPicture = bgCol?.querySelector('picture');
  if (bgPicture) {
    bgPicture.classList.add('promo-band__bg');
    const bgImg = bgPicture.querySelector('img');
    if (bgImg) {
      bgImg.setAttribute('loading', 'lazy');
      bgImg.setAttribute('decoding', 'async');
      const altText = bgAltCol?.textContent.trim() || '';
      bgImg.setAttribute('alt', altText);
    }
  }

  // --- Content wrapper (icono + texto) ---
  const content = document.createElement('div');
  content.classList.add('promo-band__content');

  // Icono (col 2)
  const iconPicture = iconCol?.querySelector('picture');
  if (iconPicture) {
    iconPicture.classList.add('promo-band__icon');
    const iconImg = iconPicture.querySelector('img');
    if (iconImg) {
      iconImg.setAttribute('loading', 'lazy');
      iconImg.setAttribute('decoding', 'async');
      const altText = iconAltCol?.textContent.trim() || '';
      iconImg.setAttribute('alt', altText);
    }
    content.append(iconPicture);
  }

  // Texto con enlace (col 4)
  const textSource = textCol;
  if (textSource) {
    const textEl = textSource.querySelector('p') || textSource;
    textEl.classList.add('promo-band__text');
    const link = textEl.querySelector('a');
    if (link) {
      link.classList.add('promo-band__link');
    }
    content.append(textEl);
  }

  inner.append(content);

  // bg image va como hermano de inner (directo en block) para cubrir full-bleed
  if (bgPicture) {
    block.replaceChildren(bgPicture, inner);
  } else {
    block.replaceChildren(inner);
  }
}
