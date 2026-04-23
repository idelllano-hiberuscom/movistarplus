/**
 * Promo Band Block — AEM Edge Delivery Services
 *
 * Figma reference: Desktop 1280 — Variant A (3:9401), Variant B (3:9755)
 * Model: xwalk (EDS + Universal Editor)
 *
 * Estrategia robusta: en lugar de asumir el índice exacto de cada fila
 * (que varía según cómo xwalk serialice el campo `variant` — a veces en
 * dataset, a veces como fila), localizamos los <picture> y los <p> reales
 * en el DOM de entrada y los asignamos por ORDEN de aparición:
 *   - primera <picture> encontrada → fondo
 *   - segunda <picture>            → icono
 *   - <p> inmediatamente posterior a cada <picture> → texto alt
 *   - último <p> con texto y/o enlace → texto visible
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

function readText(node) {
  return node ? node.textContent.trim() : '';
}

export default function decorate(block) {
  const rows = [...block.children];

  // Localizar todas las <picture> y todas las filas que contienen texto.
  const pictures = rows
    .map((row) => ({ row, picture: row.querySelector('picture') }))
    .filter((entry) => entry.picture);
  const textRows = rows.filter((row) => !row.querySelector('picture') && readText(row));

  const bgEntry = pictures[0] || null;
  const iconEntry = pictures[1] || null;

  // Variant: primero dataset (si xwalk lo pone ahí), si no, heurística.
  const variantRaw = (block.dataset.variant || (bgEntry ? 'with-image' : 'plain')).toLowerCase();
  const variant = variantRaw === 'with-image' ? 'with-image' : 'plain';
  block.classList.add(`promo-band--${variant}`);

  // El alt de la imagen de fondo será la fila de texto INMEDIATAMENTE después
  // de la fila del <picture> de fondo (patrón del modelo xwalk).
  const bgAltText = bgEntry ? readText(bgEntry.row.nextElementSibling) : '';
  const iconAltText = iconEntry ? readText(iconEntry.row.nextElementSibling) : '';

  // El texto visible es la ÚLTIMA fila con texto (o la que contenga un enlace).
  const textRowWithLink = [...textRows].reverse().find((r) => r.querySelector('a'));
  const textRow = textRowWithLink || textRows[textRows.length - 1] || null;

  const inner = document.createElement('div');
  inner.classList.add('promo-band__inner');

  // --- Imagen de fondo ---
  let bgPicture = null;
  if (bgEntry) {
    bgPicture = bgEntry.picture;
    bgPicture.classList.add('promo-band__bg');
    const bgImg = bgPicture.querySelector('img');
    if (bgImg) {
      bgImg.setAttribute('loading', 'lazy');
      bgImg.setAttribute('decoding', 'async');
      bgImg.setAttribute('alt', bgAltText);
    }
    bgPicture.dataset.aueProp = 'backgroundImage';
    bgPicture.dataset.aueType = 'media';
    bgPicture.dataset.aueLabel = 'Imagen decorativa de fondo';
  }

  // --- Content wrapper (icono + texto) ---
  const content = document.createElement('div');
  content.classList.add('promo-band__content');

  if (iconEntry) {
    const iconPicture = iconEntry.picture;
    iconPicture.classList.add('promo-band__icon');
    const iconImg = iconPicture.querySelector('img');
    if (iconImg) {
      iconImg.setAttribute('loading', 'lazy');
      iconImg.setAttribute('decoding', 'async');
      iconImg.setAttribute('alt', iconAltText);
    }
    iconPicture.dataset.aueProp = 'icon';
    iconPicture.dataset.aueType = 'media';
    iconPicture.dataset.aueLabel = 'Icono o logo';
    content.append(iconPicture);
  }

  if (textRow) {
    const textEl = textRow.querySelector('p') || document.createElement('p');
    if (!textEl.parentElement) textEl.textContent = readText(textRow);
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

  if (bgPicture) {
    block.replaceChildren(bgPicture, inner);
  } else {
    block.replaceChildren(inner);
  }
}
