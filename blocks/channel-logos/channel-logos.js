/**
 * Channel Logos Block — AEM Edge Delivery Services
 *
 * Figma reference: channel-logos (below the fold, y=2036)
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: ✅ Completado (Fase 3)
 * QA audit: ✅ Validado
 *
 * QA Changes (vs versión recibida de Fase 2):
 * - [Instrumentación UE añadida] data-aue-prop sobre <h2> y <p> del header
 *   para edición inline de los campos heading y subtitle del modelo channel-logos.
 * - [Instrumentación UE añadida] data-aue-prop sobre <picture> de cada item
 *   para edición del campo image (media selector).
 * - [Instrumentación UE añadida] data-aue-prop sobre <a> de cada item
 *   para edición del campo link (content selector).
 * - [Decisión UE] El campo name de cada item es panel-only (controla alt text +
 *   aria-label). No tiene data-aue-prop en el DOM ya que no hay elemento de texto
 *   visible dedicado — se edita vía propiedades en el panel lateral de UE.
 *   Patrón análogo a iconAlt en feature-icons-band-item.
 * - [Decisión UE] scrollMode y marqueeSpeed son campos panel-only (select).
 *   Se configuran en el panel de propiedades de UE, no requieren DOM instrumentation.
 * - [UE fix] setupMarquee: se eliminan data-aue-* de clones para evitar que UE
 *   muestre ítems duplicados como targets editables.
 * - [UE fix] El <p> subtitle se crea siempre para garantizar target de edición
 *   inline en UE. Se oculta vía CSS :empty cuando no tiene contenido.
 * - [Sin cambios] decorate() permanece SÍNCRONA.
 * - [Sin cambios] No se toca data-block-name / data-block-status del block.
 * - [Sin cambios] block.replaceChildren(header, viewport) — patrón aceptado.
 *
 * DOM de entrada (matriz EDS):
 *   block.channel-logos
 *     └── div (fila 1: encabezado)
 *           ├── div (col 0) → <p> heading
 *           └── div (col 1) → <p> subtitle
 *     └── div (fila 2: config — opcional)
 *           └── div (col 0) → <p> "auto-marquee" / "manual"
 *     └── div (fila 3+: logo N)
 *           ├── div (col 0) → <picture> logo
 *           └── div (col 1 — opcional) → <p><a href>nombre canal</a></p>
 *
 * @param {Element} block - Root element of the block
 */
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Clones track items for seamless infinite CSS marquee.
 * Cloned items are aria-hidden and removed from tab order.
 * CSS handles animation via @keyframes translateX(-50%).
 * @param {HTMLUListElement} track
 */
function setupMarquee(track) {
  const items = [...track.children];
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    // Strip UE instrumentation from clones — prevent duplicate edit targets in UE
    [clone, ...clone.querySelectorAll('*')].forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-aue-')) el.removeAttribute(attr.name);
      });
    });
    // Prevent cloned links from being in tab order
    clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
    track.append(clone);
  });
}

/**
 * Enables mouse drag to scroll horizontally (desktop UX).
 * Touch scrolling is handled natively by the browser.
 * @param {HTMLElement} viewport
 */
function setupDragScroll(viewport) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasDragged = false;

  viewport.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDown = true;
    hasDragged = false;
    viewport.classList.add('channel-logos__viewport--dragging');
    startX = e.pageX - viewport.offsetLeft;
    scrollLeft = viewport.scrollLeft;
  });

  const stop = () => {
    isDown = false;
    viewport.classList.remove('channel-logos__viewport--dragging');
  };

  viewport.addEventListener('mouseleave', stop);
  viewport.addEventListener('mouseup', stop);

  viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const dx = x - startX;
    if (Math.abs(dx) > 5) hasDragged = true;
    viewport.scrollLeft = scrollLeft - dx;
  });

  // Prevent accidental click on links after a drag gesture
  viewport.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      hasDragged = false;
    }
  });
}

/**
 * Enables left/right arrow key scrolling when track has focus.
 * In marquee mode with overflow:clip, scrollBy is a no-op (harmless).
 * In reduced-motion fallback (overflow-x:auto), arrows scroll as expected.
 * @param {HTMLUListElement} track
 * @param {HTMLElement} viewport
 */
function setupKeyboardNav(track, viewport) {
  const scrollAmount = 200;
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      viewport.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      viewport.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  });
}

export default function decorate(block) {
  const rows = [...block.children];

  // --- 1. Parent block fields ---
  // text fields (heading, subtitle) → stored as child div rows in xwalk
  // select fields (scrollMode, marqueeSpeed) → stored in block.dataset
  const headingRow = rows[0];
  const subtitleRow = rows[1];
  const headingText = headingRow?.textContent.trim() || '';
  const subtitleText = subtitleRow?.textContent.trim() || '';
  const scrollModeAttr = (block.dataset.scrollMode || 'manual').toLowerCase();
  const scrollMode = scrollModeAttr === 'auto-marquee' ? 'auto-marquee' : 'manual';

  // --- 2. Item rows: start after heading + subtitle rows ---
  const logoStartIndex = 2;

  // --- 3. Build header ---
  const header = document.createElement('div');
  header.classList.add('channel-logos__header');

  const h2 = document.createElement('h2');
  h2.classList.add('channel-logos__heading');
  h2.textContent = headingText;
  // UE: inline editing for heading field (parent block field)
  if (headingRow) moveInstrumentation(headingRow, h2);
  h2.dataset.aueProp = 'heading';
  h2.dataset.aueType = 'text';
  h2.dataset.aueLabel = 'Encabezado de la sección (H2)';
  header.append(h2);

  // Always create subtitle element for UE inline editing target (hidden via CSS :empty)
  const subtitle = document.createElement('p');
  subtitle.classList.add('channel-logos__subtitle');
  if (subtitleText) subtitle.textContent = subtitleText;
  // UE: inline editing for subtitle field (parent block field)
  if (subtitleRow) moveInstrumentation(subtitleRow, subtitle);
  subtitle.dataset.aueProp = 'subtitle';
  subtitle.dataset.aueType = 'text';
  subtitle.dataset.aueLabel = 'Subtítulo descriptivo';
  header.append(subtitle);

  // --- 4. Build viewport + track ---
  const viewport = document.createElement('div');
  viewport.classList.add('channel-logos__viewport');
  viewport.dataset.scrollMode = scrollMode;

  const track = document.createElement('ul');
  track.classList.add('channel-logos__track');
  track.setAttribute('role', 'list');
  track.setAttribute('tabindex', '0');
  track.setAttribute('aria-label', headingText || 'Logos de canales');

  // --- 5. Process logo rows ---
  const logoRows = rows.slice(logoStartIndex);

  logoRows.forEach((row) => {
    const cols = [...row.children];
    const pictureEl = cols[0]?.querySelector('picture');
    if (!pictureEl) return;

    const li = document.createElement('li');
    li.classList.add('channel-logos__item');
    moveInstrumentation(row, li);

    // Extract optional link from col 1
    // Extract name (col 1) and link (col 2)
    const nameText = cols[1]?.textContent.trim() || '';
    const linkEl = cols[2]?.querySelector('a');
    const linkHref = linkEl?.getAttribute('href') || '';

    // Original image data
    const originalImg = pictureEl.querySelector('img');
    const imgSrc = originalImg?.getAttribute('src') || '';
    const imgAlt = originalImg?.getAttribute('alt') || nameText || '';

    // Optimized picture (below-the-fold — lazy, not LCP)
    const optimizedPic = createOptimizedPicture(imgSrc, imgAlt, false, [{ width: '164' }]);
    const optimizedImg = optimizedPic.querySelector('img');
    if (optimizedImg) {
      optimizedImg.setAttribute('width', '164');
      optimizedImg.setAttribute('height', '107');
      optimizedImg.setAttribute('loading', 'lazy');
      optimizedImg.setAttribute('decoding', 'async');
      if (originalImg) moveInstrumentation(originalImg, optimizedImg);
    }

    // UE: media selector for image field (on <picture>)
    optimizedPic.dataset.aueProp = 'image';
    optimizedPic.dataset.aueType = 'media';
    optimizedPic.dataset.aueLabel = 'Logo del canal';

    // Wrap in link if href exists
    if (linkHref) {
      const a = document.createElement('a');
      a.classList.add('channel-logos__link');
      a.href = linkHref;
      a.setAttribute('aria-label', `Canal ${imgAlt}`);
      // UE: content selector for link field
      a.dataset.aueProp = 'link';
      a.dataset.aueType = 'aem-content';
      a.dataset.aueLabel = 'URL destino';
      a.append(optimizedPic);
      li.append(a);
    } else {
      li.append(optimizedPic);
    }

    track.append(li);
  });

  viewport.append(track);

  // --- 6. Replace block content (precedent: cards.js / feature-icons-band.js) ---
  block.replaceChildren(header, viewport);

  // --- 7. Marquee: clone items for seamless infinite CSS loop ---
  if (scrollMode === 'auto-marquee') {
    setupMarquee(track);
  }

  // --- 8. Drag-to-scroll (manual mode; no-op when overflow is clip) ---
  setupDragScroll(viewport);

  // --- 9. Keyboard navigation (arrow keys on focused track) ---
  setupKeyboardNav(track, viewport);
}
