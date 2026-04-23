/**
 * Plan Selector Block — AEM Edge Delivery Services
 *
 * Figma reference: plan-selector (Desktop 3:8938, Tablet 3:5424, Mobile 3:7158)
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: ✅ Completado (Fase 3)
 * QA audit: ✅ Validado
 *
 * QA Changes:
 * - [Instrumentación UE] data-aue-prop="heading" en <h2> para edición inline.
 * - [Instrumentación UE] data-aue-prop="title" en <h3> de cada tarjeta.
 * - [Instrumentación UE] data-aue-prop="features" en <ul> de cada tarjeta (richtext).
 * - [Instrumentación UE] data-aue-prop="ctaLink" en <a> CTA de cada tarjeta.
 * - [Instrumentación UE] data-aue-prop="badgeImage" en <picture> badge de cada tarjeta.
 * - [Decisión UE] Precio (priceInteger, priceDecimals, period, taxLabel, priceFootnote):
 *   panel-only. Spans aria-hidden con aria-label compuesto en contenedor.
 * - [Decisión UE] ctaText: panel-only (ctaLink ya ocupa el <a>).
 * - [Decisión UE] badgeAlt: panel-only (sin elemento texto dedicado).
 * - [Decisión UE] featured: boolean panel-only (controla clase CSS).
 * - [Sin cambios] decorate() permanece SÍNCRONA.
 * - [Sin cambios] block.replaceChildren(inner) — patrón aceptado.
 *
 * DOM de entrada (matriz EDS):
 *   block.plan-selector
 *     └── div (fila 1: encabezado)
 *           └── div (col 0) → <p> "Elige tu plan"
 *     └── div (fila 2+: tarjeta N)
 *           ├── div (col 0: title)        → <p> nombre del plan
 *           ├── div (col 1: features)     → <ul><li>…</li></ul>
 *           ├── div (col 2: price grid)   → <p> × 5 (int, dec, period, tax, footnote)
 *           ├── div (col 3: cta)          → <p><a href>CTA text</a></p>
 *           ├── div (col 4: badge image)  → <picture> (opcional)
 *           └── div (col 5: featured)     → <p>"true"/"false"</p> (opcional)
 *
 * DOM de salida:
 *   <div class="plan-selector__inner">
 *     <h2 class="plan-selector__heading">…</h2>
 *     <ul class="plan-selector__list" role="list">
 *       <li class="plan-card [plan-card--featured]">
 *         [<picture class="plan-card__badge">…</picture>]
 *         <h3 class="plan-card__title">…</h3>
 *         <ul class="plan-card__features">…</ul>
 *         <div class="plan-card__price" aria-label="…">
 *           <span class="plan-card__price-int" aria-hidden="true">…</span>
 *           …
 *         </div>
 *         <a class="plan-card__cta" href="…">…</a>
 *       </li>
 *     </ul>
 *   </div>
 *
 * @param {Element} block - Root element of the block
 */
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // --- 1. Parse heading row (always first) ---
  const headingRow = rows[0];
  const headingText = headingRow?.textContent.trim() || '';

  // --- 2. Build inner wrapper ---
  const inner = document.createElement('div');
  inner.classList.add('plan-selector__inner');

  const h2 = document.createElement('h2');
  h2.classList.add('plan-selector__heading');
  h2.textContent = headingText;
  moveInstrumentation(headingRow, h2);
  h2.dataset.aueProp = 'heading';
  h2.dataset.aueType = 'text';
  h2.dataset.aueLabel = 'Encabezado de la sección';
  inner.append(h2);

  // --- 3. Build card list ---
  const ul = document.createElement('ul');
  ul.classList.add('plan-selector__list');
  ul.setAttribute('role', 'list');

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const cols = [...row.children];

    // Column extraction
    const titleText = cols[0]?.textContent.trim() || '';
    const featuresUl = cols[1]?.querySelector('ul');
    const priceParagraphs = cols[2]
      ? [...cols[2].querySelectorAll(':scope > p')]
      : [];
    const ctaAnchor = cols[3]?.querySelector('a');
    const badgePicture = cols[4]?.querySelector('picture');
    const isFeatured = (cols[5]?.textContent.trim().toLowerCase() === 'true');

    // Build card <li>
    const li = document.createElement('li');
    li.classList.add('plan-card');
    if (isFeatured) li.classList.add('plan-card--featured');
    moveInstrumentation(row, li);

    // Badge (optional — positioned absolute via CSS)
    if (badgePicture) {
      const origImg = badgePicture.querySelector('img');
      const src = origImg?.getAttribute('src') || '';
      const alt = origImg?.getAttribute('alt') || '';
      const pic = createOptimizedPicture(src, alt, false, [{ width: '200' }]);
      pic.classList.add('plan-card__badge');
      const newImg = pic.querySelector('img');
      if (newImg) {
        newImg.setAttribute('width', '100');
        newImg.setAttribute('height', '100');
        newImg.setAttribute('loading', 'lazy');
        newImg.setAttribute('decoding', 'async');
        if (origImg) moveInstrumentation(origImg, newImg);
      }
      pic.dataset.aueProp = 'badgeImage';
      pic.dataset.aueType = 'media';
      pic.dataset.aueLabel = 'Badge esquina superior';
      li.append(pic);
    }

    // Title
    const h3 = document.createElement('h3');
    h3.classList.add('plan-card__title');
    h3.textContent = titleText;
    h3.dataset.aueProp = 'title';
    h3.dataset.aueType = 'text';
    h3.dataset.aueLabel = 'Nombre del plan';
    li.append(h3);

    // Features list (move existing <ul> node)
    if (featuresUl) {
      featuresUl.classList.add('plan-card__features');
      featuresUl.dataset.aueProp = 'features';
      featuresUl.dataset.aueType = 'richtext';
      featuresUl.dataset.aueLabel = 'Lista de beneficios';
      li.append(featuresUl);
    }

    // Price area
    const priceInt = priceParagraphs[0]?.textContent.trim() || '';
    const priceDec = priceParagraphs[1]?.textContent.trim() || '';
    const period = priceParagraphs[2]?.textContent.trim() || '';
    const taxLabel = priceParagraphs[3]?.textContent.trim() || '';
    const footnote = priceParagraphs[4]?.textContent.trim() || '';

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('plan-card__price');
    priceDiv.setAttribute('aria-label', buildPriceAriaLabel(priceInt, priceDec, period, taxLabel));

    appendPriceSpan(priceDiv, 'plan-card__price-int', priceInt);
    appendPriceSpan(priceDiv, 'plan-card__price-dec', priceDec);
    appendPriceSpan(priceDiv, 'plan-card__price-period', period);
    appendPriceSpan(priceDiv, 'plan-card__price-tax', taxLabel);
    appendPriceSpan(priceDiv, 'plan-card__price-footnote', footnote);
    li.append(priceDiv);

    // CTA (move existing <a> node)
    if (ctaAnchor) {
      ctaAnchor.classList.add('plan-card__cta');
      ctaAnchor.dataset.aueProp = 'ctaLink';
      ctaAnchor.dataset.aueType = 'aem-content';
      ctaAnchor.dataset.aueLabel = 'Enlace del CTA';
      li.append(ctaAnchor);
    }

    ul.append(li);
  }

  inner.append(ul);
  block.replaceChildren(inner);
}

/**
 * Creates a <span> with aria-hidden and appends it to parent. Skips if text is empty.
 * @param {Element} parent
 * @param {string} className
 * @param {string} text
 */
function appendPriceSpan(parent, className, text) {
  if (!text) return;
  const span = document.createElement('span');
  span.classList.add(className);
  span.textContent = text;
  span.setAttribute('aria-hidden', 'true');
  parent.append(span);
}

/**
 * Builds a readable aria-label from the price parts.
 * E.g. "9,99€, MES, Imp. incl." or "0€, Sin coste"
 * @param {string} integer
 * @param {string} decimals
 * @param {string} period
 * @param {string} tax
 * @returns {string}
 */
function buildPriceAriaLabel(integer, decimals, period, tax) {
  const parts = [];
  const amount = `${integer}${decimals}`.trim();
  if (amount) parts.push(amount);
  if (period) parts.push(period);
  if (tax) parts.push(tax);
  return parts.join(', ');
}
