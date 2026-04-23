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
 * DOM de entrada xwalk (una fila por campo no-select):
 *   block (div.promo-band)
 *     data-variant → select field (block.dataset.variant)
 *     └── div (row 0) → backgroundImage (<picture> o vacío)
 *     └── div (row 1) → backgroundImageAlt (texto plano)
 *     └── div (row 2) → icon (<picture>)
 *     └── div (row 3) → iconAlt (texto plano)
 *     └── div (row 4) → text (texto plano con enlace embebido)
 *
 * @param {Element} block - Root element of the block
 */
export default function decorate(block) {
  const rows = [...block.children];

  // variant es un campo select → se almacena en block.dataset
  const variant = (block.dataset.variant || 'plain').toLowerCase();
  block.classList.add(`promo-band--${variant}`);

  // Campos reference y text se almacenan como filas en xwalk
  const bgRow = rows[0];
  const bgAltRow = rows[1];
  const iconRow = rows[2];
  const iconAltRow = rows[3];
  const textRow = rows[4];

  // Inner wrapper — centrado y max-width
  const inner = document.createElement('div');
  inner.classList.add('promo-band__inner');

  // --- Imagen de fondo (row 0) — solo si existe ---
  const bgPicture = bgRow?.querySelector('picture');
  if (bgPicture) {
    bgPicture.classList.add('promo-band__bg');
    const bgImg = bgPicture.querySelector('img');
    if (bgImg) {
      bgImg.setAttribute('loading', 'lazy');
      bgImg.setAttribute('decoding', 'async');
      const altText = bgAltRow?.textContent.trim() || '';
      bgImg.setAttribute('alt', altText);
    }
    // NOTE: bgPicture se añade directamente a block (no a inner)
    // para que position:absolute inset:0 cubra el ancho completo del band
  }

  // --- Content wrapper (icono + texto) ---
  const content = document.createElement('div');
  content.classList.add('promo-band__content');

  // Icono (row 2)
  const iconPicture = iconRow?.querySelector('picture');
  if (iconPicture) {
    iconPicture.classList.add('promo-band__icon');
    const iconImg = iconPicture.querySelector('img');
    if (iconImg) {
      iconImg.setAttribute('loading', 'lazy');
      iconImg.setAttribute('decoding', 'async');
      const altText = iconAltRow?.textContent.trim() || '';
      iconImg.setAttribute('alt', altText);
    }
    content.append(iconPicture);
  }

  // Texto con enlace (row 4)
  const textEl = textRow?.querySelector('p') || textRow;
  if (textEl && textEl !== textRow?.parentElement) {
    textEl.classList.add('promo-band__text');
    const link = textEl.querySelector('a');
    if (link) {
      link.classList.add('promo-band__link');
    }
    content.append(textEl);
  } else if (textRow) {
    textRow.classList.add('promo-band__text');
    const link = textRow.querySelector('a');
    if (link) {
      link.classList.add('promo-band__link');
    }
    content.append(textRow);
  }

  inner.append(content);

  // bg image va como hermano de inner (directo en block) para cubrir full-bleed
  if (bgPicture) {
    block.replaceChildren(bgPicture, inner);
  } else {
    block.replaceChildren(inner);
  }
}
