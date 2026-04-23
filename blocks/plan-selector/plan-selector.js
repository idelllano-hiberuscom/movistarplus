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
 * DOM de entrada (matriz EDS xwalk):
 *   block.plan-selector
 *     └── div (fila 0: heading) → texto plano "Elige tu plan" [campo text = fila]
 *     └── div (fila 1+: tarjeta N)
 *           ├── div (col 0: title)        → <p> nombre del plan
 *           ├── div (col 1: features)     → <ul><li>…</li></ul>
 *           ├── div (col 2: priceInteger) → texto
 *           ├── div (col 3: priceDecimals)→ texto
 *           ├── div (col 4: period)       → texto
 *           ├── div (col 5: taxLabel)     → texto
 *           ├── div (col 6: priceFootnote)→ texto
 *           ├── div (col 7: ctaText)      → texto
 *           ├── div (col 8: cta)          → <p><a href>CTA text</a></p>
 *           ├── div (col 9: badge)        → <picture> (opcional)
 *           ├── div (col 10: badgeAlt)    → texto (opcional)
 *           └── div (col 11: featured)   → texto "true"/"false" (opcional)
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

export default function decorate(block) {
  const rows = [...block.children];

  // --- 1. Parent block field (heading): campo text → almacenado como fila 0 en xwalk ---
  const headingRow = rows[0];
  const headingText = headingRow?.textContent.trim() || '';

  // --- 2. Build inner wrapper ---
  const inner = document.createElement('div');
  inner.classList.add('plan-selector__inner');

  if (headingText) {
    const h2 = document.createElement('h2');
    h2.classList.add('plan-selector__heading');
    h2.textContent = headingText;
    moveInstrumentation(headingRow, h2);
    h2.dataset.aueProp = 'heading';
    h2.dataset.aueType = 'text';
    h2.dataset.aueLabel = 'Encabezado de la sección';
    inner.append(h2);
  }

  // --- 3. Build card list (filas 1+ = tarjetas de plan) ---
  const ul = document.createElement('ul');
  ul.classList.add('plan-selector__list');
  ul.setAttribute('role', 'list');

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const cols = [...row.children];

    // Column extraction (orden del modelo plan-selector-item, 12 campos):
    // 0:title 1:features 2:priceInteger 3:priceDecimals 4:period 5:taxLabel
    // 6:priceFootnote 7:ctaText 8:cta(link) 9:badge(img) 10:badgeAlt 11:featured
    const titleText = cols[0]?.textContent.trim() || '';
    const featuresUl = cols[1]?.querySelector('ul');
    const priceInt = cols[2]?.textContent.trim() || '';
    const priceDec = cols[3]?.textContent.trim() || '';
    const period = cols[4]?.textContent.trim() || '';
    const taxLabel = cols[5]?.textContent.trim() || '';
    const footnote = cols[6]?.textContent.trim() || '';
    const ctaText = cols[7]?.textContent.trim() || '';
    const ctaAnchor = cols[8]?.querySelector('a');
    const badgePicture = cols[9]?.querySelector('picture');
    const badgeAlt = cols[10]?.textContent.trim() || '';
    const isFeatured = (cols[11]?.textContent.trim().toLowerCase() === 'true');

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
      pic.dataset.aueProp = 'badge';
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

    // Price area (cada componente del precio en su propia columna)
    const priceDiv = document.createElement('div');
    priceDiv.classList.add('plan-card__price');
    priceDiv.setAttribute('aria-label', buildPriceAriaLabel(priceInt, priceDec, period, taxLabel));

    appendPriceSpan(priceDiv, 'plan-card__price-int', priceInt);
    appendPriceSpan(priceDiv, 'plan-card__price-dec', priceDec);
    appendPriceSpan(priceDiv, 'plan-card__price-period', period);
    appendPriceSpan(priceDiv, 'plan-card__price-tax', taxLabel);
    appendPriceSpan(priceDiv, 'plan-card__price-footnote', footnote);
    li.append(priceDiv);

    // CTA: usar <a> existente o construir uno con ctaText + ctaAnchor.href
    if (ctaAnchor) {
      ctaAnchor.classList.add('plan-card__cta');
      if (ctaText) ctaAnchor.textContent = ctaText;
      ctaAnchor.dataset.aueProp = 'cta';
      ctaAnchor.dataset.aueType = 'aem-content';
      ctaAnchor.dataset.aueLabel = 'Enlace del CTA';
      li.append(ctaAnchor);
    } else if (ctaText) {
      const span = document.createElement('span');
      span.classList.add('plan-card__cta');
      span.textContent = ctaText;
      span.dataset.aueProp = 'ctaText';
      span.dataset.aueType = 'text';
      li.append(span);
    }

    // badgeAlt aplicado al alt del badge si existe
    if (badgeAlt) {
      const badgeImg = li.querySelector('.plan-card__badge img');
      if (badgeImg) badgeImg.setAttribute('alt', badgeAlt);
    }

    ul.append(li);
  }

  inner.append(ul);
  block.replaceChildren(inner);
}
