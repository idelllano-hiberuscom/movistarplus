/**
 * Promo Band Block — AEM Edge Delivery Services
 *
 * Figma reference: Desktop 1280 — Variant A (3:9401), Variant B (3:9755)
 * Model: xwalk (EDS + Universal Editor)
 *
 * DOM de entrada xwalk (cada block-level field → su propia FILA):
 *   block (div.promo-band)
 *     ├── div (row 0: variant — texto "with-image" | "plain")
 *     ├── div (row 1: backgroundImage — <picture> o vacío)
 *     ├── div (row 2: backgroundImageAlt — texto)
 *     ├── div (row 3: icon — <picture>)
 *     ├── div (row 4: iconAlt — texto)
 *     └── div (row 5: text — texto con enlace embebido)
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Cada block-level field es su propia fila en xwalk (incluidos selects).
  const variantRow = rows[0];
  const bgRow = rows[1];
  const bgAltRow = rows[2];
  const iconRow = rows[3];
  const iconAltRow = rows[4];
  const textRow = rows[5];

  const variantRaw = (variantRow?.textContent.trim() || block.dataset.variant || 'plain').toLowerCase();
  const variant = variantRaw === 'with-image' ? 'with-image' : 'plain';
  block.classList.add(`promo-band--${variant}`);

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
    bgPicture.dataset.aueProp = 'backgroundImage';
    bgPicture.dataset.aueType = 'media';
    bgPicture.dataset.aueLabel = 'Imagen decorativa de fondo';
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
    iconPicture.dataset.aueProp = 'icon';
    iconPicture.dataset.aueType = 'media';
    iconPicture.dataset.aueLabel = 'Icono o logo';
    content.append(iconPicture);
  }

  // Texto con enlace (row 4) — preservar <a> embebida
  if (textRow) {
    const textEl = textRow.querySelector('p') || document.createElement('p');
    if (!textEl.parentElement) {
      textEl.textContent = textRow.textContent.trim();
    }
    textEl.classList.add('promo-band__text');
    const link = textEl.querySelector('a');
    if (link) link.classList.add('promo-band__link');
    textEl.dataset.aueProp = 'text';
    textEl.dataset.aueType = 'text';
    textEl.dataset.aueLabel = 'Texto con enlace embebido';
    if (textRow.firstElementChild) moveInstrumentation(textRow, textEl);
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
