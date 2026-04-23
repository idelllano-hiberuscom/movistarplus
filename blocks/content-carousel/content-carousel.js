/**
 * Content Carousel Block — AEM Edge Delivery Services
 *
 * Figma reference: figma-analysis/content-carousel-instructions.md
 *   Desktop 3:9327 (mosaic), 3:9407 (portrait), 3:9453 (landscape) — y otras 4 instancias.
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: ✅ Completado (Fase 3)
 * QA audit: ✅ Validado
 *
 * QA Changes:
 *  - Sin cambios estructurales. Añadidos data-aue-prop / data-aue-type a los
 *    elementos editables inline de cada tarjeta (image y editorial).
 *  - cardType / imageAlt / rowSpan / colSpan / ctaText: panel-only (sin DOM binding).
 *
 * DOM de entrada (matriz EDS) — 1 fila por item, 12 columnas en orden estricto:
 *   block.content-carousel
 *     └── div (item N)
 *           ├── div (col 0:  cardType)         "image" | "editorial"
 *           ├── div (col 1:  image)            <picture>  (image card)
 *           ├── div (col 2:  imageAlt)         <p>texto alt</p>
 *           ├── div (col 3:  caption)          <p>uppercase</p>
 *           ├── div (col 4:  link)             <p><a href></a></p>
 *           ├── div (col 5:  rowSpan)          "1" | "2"  (solo mosaic)
 *           ├── div (col 6:  colSpan)          "1" | "2"  (solo mosaic)
 *           ├── div (col 7:  editorialLabel)   <p>"DEPORTES"</p>
 *           ├── div (col 8:  editorialHeading) <p>"Cada jornada..."</p>
 *           ├── div (col 9:  editorialBody)    <p>...<strong>...</strong></p>
 *           ├── div (col 10: ctaText)          <p>"MÁS DEPORTES"</p>
 *           └── div (col 11: ctaLink)          <p><a href></a></p>
 *
 * Config del bloque (Fase 3 inyectará vía JSON model como data-* attrs):
 *   - block.dataset.variant            "mosaic" | "portrait" | "landscape"  (default "portrait")
 *   - block.dataset.heading            string opcional para H2
 *   - block.dataset.subtitle           string opcional
 *   - block.dataset.itemsPerView       "3" | "4" | "5" | "6" | "auto"       (default "auto")
 *   - block.dataset.showArrows         "true" | "false"                     (default "true")
 *   - block.dataset.autoplay           "true" | "false"                     (default "false")
 *   - block.dataset.autoplayInterval   ms                                   (default 5000)
 *
 * Performance:
 *   - Bloque NO LCP (debajo del fold). TODAS las imágenes lazy + decoding async.
 *   - NO se usa createOptimizedPicture: EDS ya entrega <picture> optimizado.
 *   - NO IntersectionObserver para carga: el bloque se decora síncronamente.
 *   - Estado de flechas (disabled en extremos) vía scroll event con listener pasivo.
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

/* -------------------------------------------------------------------------- */
/* Helpers de lectura de columnas                                             */
/* -------------------------------------------------------------------------- */

function readText(col) {
  if (!col) return '';
  return col.textContent.trim();
}

function readPicture(col) {
  return col ? col.querySelector('picture') : null;
}

function readAnchor(col) {
  return col ? col.querySelector('a') : null;
}

/* -------------------------------------------------------------------------- */
/* Builders de tarjetas                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Construye una tarjeta tipo "image" reutilizando el <picture> entregado por EDS.
 * @param {Element[]} cols
 * @returns {HTMLElement} <a class="card card--image"> o <article class="card card--image">
 */
function buildImageCard(cols) {
  const picture = readPicture(cols[1]);
  const alt = readText(cols[2]);
  const captionText = readText(cols[3]);
  const linkAnchor = readAnchor(cols[4]);
  const href = linkAnchor && linkAnchor.getAttribute('href');

  // Tarjeta raíz — <a> si hay link, <article> si no
  const card = document.createElement(href ? 'a' : 'article');
  card.classList.add('card', 'card--image');
  if (href) {
    card.setAttribute('href', href);
    // UE: el <a> raíz expone el campo "link" cuando existe URL destino
    card.dataset.aueProp = 'link';
    card.dataset.aueType = 'aem-content';
  }

  // Reusar <picture> entregado por EDS (NO recrear)
  if (picture) {
    picture.classList.add('card__media');
    const img = picture.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      if (alt) img.setAttribute('alt', alt);
    }
    // UE: <picture> editable como asset desde el DAM
    picture.dataset.aueProp = 'image';
    picture.dataset.aueType = 'media';
    card.appendChild(picture);
  }

  // Overlay degradado (decorativo, no interactivo)
  const overlay = document.createElement('div');
  overlay.classList.add('card__overlay');
  overlay.setAttribute('aria-hidden', 'true');
  card.appendChild(overlay);

  // Caption opcional
  if (captionText) {
    const caption = document.createElement('p');
    caption.classList.add('card__caption');
    caption.textContent = captionText;
    // UE: caption editable inline
    caption.dataset.aueProp = 'caption';
    caption.dataset.aueType = 'text';
    card.appendChild(caption);
  }

  return card;
}

/**
 * Construye una tarjeta tipo "editorial" con label + heading + body + CTA.
 * @param {Element[]} cols
 * @returns {HTMLElement} <article class="card card--editorial">
 */
function buildEditorialCard(cols) {
  const labelText = readText(cols[7]);
  const headingText = readText(cols[8]);
  const bodyEl = cols[9];
  const ctaText = readText(cols[10]);
  const ctaAnchor = readAnchor(cols[11]);
  const ctaHref = ctaAnchor && ctaAnchor.getAttribute('href');

  const article = document.createElement('article');
  article.classList.add('card', 'card--editorial');

  if (labelText) {
    const label = document.createElement('p');
    label.classList.add('card__label');
    label.textContent = labelText;
    // UE: label superior editable inline
    label.dataset.aueProp = 'editorialLabel';
    label.dataset.aueType = 'text';
    article.appendChild(label);
  }

  if (headingText) {
    const h3 = document.createElement('h3');
    h3.classList.add('card__heading');
    h3.textContent = headingText;
    // UE: heading editable inline
    h3.dataset.aueProp = 'editorialHeading';
    h3.dataset.aueType = 'text';
    article.appendChild(h3);
  }

  if (bodyEl && bodyEl.children.length) {
    const body = document.createElement('div');
    body.classList.add('card__body');
    // Mover los <p> originales (preserva richtext con <strong> y nodos hijos sin clonar)
    [...bodyEl.children].forEach((child) => body.appendChild(child));
    // UE: body editable como richtext (WYSIWYG)
    body.dataset.aueProp = 'editorialBody';
    body.dataset.aueType = 'richtext';
    article.appendChild(body);
  }

  if (ctaText && ctaHref) {
    const cta = document.createElement('a');
    cta.classList.add('card__cta', 'button');
    cta.setAttribute('href', ctaHref);
    cta.textContent = ctaText;
    // UE: el <a> CTA expone el campo destino. ctaText comparte elemento — gana ctaLink.
    cta.dataset.aueProp = 'cta';
    cta.dataset.aueType = 'aem-content';
    article.appendChild(cta);
  }

  return article;
}

/**
 * Construye el header opcional (<header><h2/><p subtitle/></header>) si dataset.heading existe.
 * @param {Element} block
 * @returns {HTMLElement|null}
 */
function buildHeader(block) {
  const heading = (block.dataset.heading || '').trim();
  const subtitle = (block.dataset.subtitle || '').trim();
  if (!heading && !subtitle) return null;

  const header = document.createElement('header');
  header.classList.add('content-carousel__header');

  if (heading) {
    const h2 = document.createElement('h2');
    h2.classList.add('content-carousel__heading');
    h2.textContent = heading;
    header.appendChild(h2);
  }

  if (subtitle) {
    const p = document.createElement('p');
    p.classList.add('content-carousel__subtitle');
    p.textContent = subtitle;
    header.appendChild(p);
  }

  return header;
}

/* -------------------------------------------------------------------------- */
/* Interacciones                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Calcula el ancho de scroll (item + gap) para avances/retrocesos consistentes.
 */
function getStepWidth(track) {
  const item = track.querySelector('.content-carousel__item');
  const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
  if (!item) return track.clientWidth * 0.8;
  return item.getBoundingClientRect().width + gap;
}

/**
 * Conecta los botones prev/next al track horizontal y actualiza su estado disabled.
 */
function setupArrows(track, prevBtn, nextBtn) {
  const goTo = (dir) => {
    track.scrollBy({ left: dir * getStepWidth(track), behavior: 'smooth' });
  };
  prevBtn.addEventListener('click', () => goTo(-1));
  nextBtn.addEventListener('click', () => goTo(1));

  const updateState = () => {
    const max = track.scrollWidth - track.clientWidth - 1;
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft >= max;
  };
  track.addEventListener('scroll', updateState, { passive: true });
  window.addEventListener('resize', updateState, { passive: true });
  updateState();
}

/**
 * Habilita navegación por teclado (←/→) cuando el track tiene focus.
 */
function setupKeyboard(track) {
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    track.scrollBy({ left: dir * getStepWidth(track), behavior: 'smooth' });
  });
}

/**
 * Autoplay cíclico. Respeta prefers-reduced-motion. Pausa en hover/focus.
 */
function setupAutoplay(track, interval) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let timer = null;
  const tick = () => {
    const max = track.scrollWidth - track.clientWidth - 1;
    if (track.scrollLeft >= max) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: getStepWidth(track), behavior: 'smooth' });
    }
  };
  const start = () => { if (!timer) timer = setInterval(tick, interval); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);
  track.addEventListener('focusin', stop);
  track.addEventListener('focusout', start);

  // Pausar también si el documento queda oculto (tab change)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  start();
}

/* -------------------------------------------------------------------------- */
/* SVGs de flechas (inline para evitar request HTTP)                          */
/* -------------------------------------------------------------------------- */

const ARROW_PREV_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ARROW_NEXT_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* -------------------------------------------------------------------------- */
/* decorate (síncrona — SIEMPRE)                                              */
/* -------------------------------------------------------------------------- */

export default function decorate(block) {
  // 1. Lectura de defaults desde dataset (sanitizados)
  const allowedVariants = ['mosaic', 'portrait', 'landscape'];
  const variant = allowedVariants.includes(block.dataset.variant)
    ? block.dataset.variant
    : 'portrait';
  const itemsPerView = block.dataset.itemsPerView || 'auto';
  const showArrows = block.dataset.showArrows !== 'false';
  const autoplay = block.dataset.autoplay === 'true';
  const autoplayInterval = parseInt(block.dataset.autoplayInterval, 10) || 5000;

  block.classList.add(`content-carousel--${variant}`);
  if (itemsPerView !== 'auto') {
    block.style.setProperty('--items-per-view', itemsPerView);
  }

  // 2. Cache de filas — cada fila = 1 item completo
  const rows = [...block.children];

  // 3. Wrapper interno para alojar header + track + flechas (NO sustituye a block)
  const inner = document.createElement('div');
  inner.classList.add('content-carousel__inner');

  // 4. Header opcional
  const header = buildHeader(block);
  if (header) inner.appendChild(header);

  // 5. Track <ul role="list">
  const track = document.createElement('ul');
  track.classList.add('content-carousel__track');
  track.setAttribute('role', 'list');

  rows.forEach((row) => {
    const cols = [...row.children];
    const cardType = readText(cols[0]) || 'image';

    const li = document.createElement('li');
    li.classList.add('content-carousel__item');
    // Preservar instrumentación UE de la fila original en el <li>
    moveInstrumentation(row, li);

    let cardEl;
    if (cardType === 'editorial') {
      li.classList.add('content-carousel__item--editorial');
      cardEl = buildEditorialCard(cols);
    } else {
      cardEl = buildImageCard(cols);
    }

    // Spans de mosaico — solo aplican si variant=mosaic
    if (variant === 'mosaic') {
      const rowSpan = parseInt(readText(cols[5]), 10);
      const colSpan = parseInt(readText(cols[6]), 10);
      if (rowSpan > 0) li.style.setProperty('--row-span', rowSpan);
      if (colSpan > 0) li.style.setProperty('--col-span', colSpan);
    }

    li.appendChild(cardEl);
    track.appendChild(li);
  });

  inner.appendChild(track);

  // 6. Flechas (solo en variantes carrusel y con > 1 item)
  let prevBtn = null;
  let nextBtn = null;
  if (variant !== 'mosaic' && showArrows && rows.length > 1) {
    prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.classList.add('content-carousel__arrow', 'content-carousel__arrow--prev');
    prevBtn.setAttribute('aria-label', 'Anterior');
    prevBtn.innerHTML = ARROW_PREV_SVG;

    nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.classList.add('content-carousel__arrow', 'content-carousel__arrow--next');
    nextBtn.setAttribute('aria-label', 'Siguiente');
    nextBtn.innerHTML = ARROW_NEXT_SVG;

    inner.appendChild(prevBtn);
    inner.appendChild(nextBtn);
  }

  // 7. Sustituir hijos del block por el wrapper (con argumento — preserva data-block-name/status)
  block.replaceChildren(inner);

  // 8. Setup interactivo solo en variantes carrusel
  if (variant !== 'mosaic') {
    if (prevBtn && nextBtn) setupArrows(track, prevBtn, nextBtn);
    setupKeyboard(track);
    if (autoplay) setupAutoplay(track, autoplayInterval);
  }

  // ⚠️ TODO: drag con mouse para desktop. Scroll horizontal nativo + swipe táctil
  // cubren mobile/tablet. Drag desktop puede añadirse en QA si UX lo requiere.
}
