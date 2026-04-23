/**
 * Hero Carousel Block — AEM Edge Delivery Services
 *
 * Figma reference: hero-carousel-instructions.md
 *   Desktop 3:8557 / Tablet 3:5060 / Mobile 3:6793
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: ✅ Completado (Fase 3 - UE & QA Specialist)
 * QA audit: ✅ Validado — 10/10 checks
 *
 * QA Changes:
 * - Sin cambios técnicos: el código de Fase 2 cumplía DOM integrity y performance.
 * - Añadidos atributos data-aue-* en bgPicture, titlePicture, h2, description,
 *   ctaAnchor, disclaimer.
 *
 * DOM de entrada (matriz EDS) — 1 fila por slide, 11 columnas:
 *   block.hero-carousel
 *     └── div (slide N)
 *           ├── div (col 0: <picture> imagen de fondo)
 *           ├── div (col 1: <p> alt imagen fondo)
 *           ├── div (col 2: <picture> logo/título — opcional)
 *           ├── div (col 3: <p> alt logo)
 *           ├── div (col 4: <p> heading)
 *           ├── div (col 5: <p>... descripción richtext)
 *           ├── div (col 6: <p> precio entero)
 *           ├── div (col 7: <p> precio decimal)
 *           ├── div (col 8: <p> sufijo precio)
 *           ├── div (col 9: <p><a> CTA)
 *           └── div (col 10: <p> disclaimer)
 *
 * Config del bloque (Fase 3 inyectará via JSON model):
 *   - block.dataset.autoplay = 'true' → activa autoplay
 *   - block.dataset.autoplayInterval = '5000' → intervalo ms (default 5000)
 *
 * Performance:
 *   - Slide 0: <img loading="eager" fetchpriority="high"> (LCP del sitio)
 *   - Slides 1+: <img loading="lazy" decoding="async">
 *   - NO se usa createOptimizedPicture: EDS ya entrega <picture> optimizado.
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

const PREV_SVG = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const NEXT_SVG = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* -------------------------- Helpers de módulo -------------------------- */

function goToSlide(state, index) {
  const nextIndex = ((index % state.total) + state.total) % state.total;
  if (nextIndex === state.current) return;

  const prevSlide = state.slides[state.current];
  const nextSlide = state.slides[nextIndex];
  prevSlide.classList.remove('is-active');
  prevSlide.setAttribute('aria-hidden', 'true');
  nextSlide.classList.add('is-active');
  nextSlide.setAttribute('aria-hidden', 'false');

  const prevDot = state.dots[state.current];
  const nextDot = state.dots[nextIndex];
  prevDot.classList.remove('is-active');
  prevDot.setAttribute('aria-current', 'false');
  nextDot.classList.add('is-active');
  nextDot.setAttribute('aria-current', 'true');

  state.current = nextIndex;
  state.liveRegion.textContent = `Slide ${nextIndex + 1} de ${state.total}`;
}

function next(state) {
  goToSlide(state, state.current + 1);
}

function prev(state) {
  goToSlide(state, state.current - 1);
}

function stopAutoplay(state) {
  if (state.autoplayId) {
    window.clearInterval(state.autoplayId);
    state.autoplayId = null;
  }
}

function startAutoplay(state) {
  if (!state.autoplay || state.autoplayId) return;
  state.autoplayId = window.setInterval(() => next(state), state.interval);
}

function restartAutoplay(state) {
  if (!state.autoplay) return;
  stopAutoplay(state);
  if (!state.isHovering && !state.isFocused) startAutoplay(state);
}

function setupKeyboard(carousel, state) {
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev(state);
      restartAutoplay(state);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next(state);
      restartAutoplay(state);
    }
  });
}

function setupSwipe(track, state) {
  const THRESHOLD = 50;
  let startX = 0;
  let startY = 0;
  let tracking = false;

  track.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    if (Math.abs(dx) < THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next(state);
    else prev(state);
    restartAutoplay(state);
  }, { passive: true });
}

function appendPriceSpan(parent, className, text) {
  if (!text) return;
  const span = document.createElement('span');
  span.classList.add(className);
  span.textContent = text;
  span.setAttribute('aria-hidden', 'true');
  parent.append(span);
}

function buildPriceAriaLabel(integer, decimals, suffix) {
  const parts = [];
  if (integer || decimals) {
    const decClean = decimals.replace(/[^\d,€$]/g, '').replace(/€/g, ' euros');
    parts.push(`${integer}${decClean}`.trim());
  }
  if (suffix) parts.push(suffix);
  return parts.join(', ');
}

/* -------------------------- decorate -------------------------- */

export default function decorate(block) {
  // 1. Cache filas ANTES de mutar
  const rows = [...block.children];
  if (!rows.length) return;

  // 2. Wrapper interno
  const inner = document.createElement('div');
  inner.classList.add('hero-carousel__inner');

  // 3. Track (UL con slides)
  const track = document.createElement('ul');
  track.classList.add('hero-carousel__track');
  track.setAttribute('role', 'region');
  track.setAttribute('aria-roledescription', 'carrusel');
  track.setAttribute('aria-label', 'Contenido destacado');

  // 4. Live region (anuncia "Slide N de M" al cambiar)
  const liveRegion = document.createElement('div');
  liveRegion.classList.add('hero-carousel__sr-only');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');

  // 5. Construcción de slides
  rows.forEach((row, slideIndex) => {
    const cols = [...row.children];
    const isFirst = slideIndex === 0;

    const li = document.createElement('li');
    li.classList.add('hero-carousel__slide');
    if (isFirst) li.classList.add('is-active');
    li.setAttribute('aria-hidden', isFirst ? 'false' : 'true');
    li.setAttribute('aria-roledescription', 'slide');
    li.setAttribute('aria-label', `Slide ${slideIndex + 1}`);
    moveInstrumentation(row, li);

    // --- col 0: imagen de fondo (<picture>) ---
    const bgPicture = cols[0]?.querySelector('picture');
    const bgAltText = cols[1]?.textContent.trim() || '';
    if (bgPicture) {
      bgPicture.classList.add('hero-carousel__bg');
      bgPicture.dataset.aueProp = 'backgroundImage';
      bgPicture.dataset.aueType = 'media';
      bgPicture.dataset.aueLabel = 'Imagen de fondo';
      const bgImg = bgPicture.querySelector('img');
      if (bgImg) {
        if (bgAltText) bgImg.setAttribute('alt', bgAltText);
        bgImg.setAttribute('decoding', 'async');
        if (isFirst) {
          bgImg.setAttribute('loading', 'eager');
          bgImg.setAttribute('fetchpriority', 'high');
        } else {
          bgImg.setAttribute('loading', 'lazy');
          bgImg.removeAttribute('fetchpriority');
        }
      }
      li.append(bgPicture);
    }

    // --- gradiente de overlay (decorativo) ---
    const gradient = document.createElement('div');
    gradient.classList.add('hero-carousel__gradient');
    gradient.setAttribute('aria-hidden', 'true');
    li.append(gradient);

    // --- contenido textual ---
    const content = document.createElement('div');
    content.classList.add('hero-carousel__content');

    // col 2: logo/título (opcional)
    const titlePicture = cols[2]?.querySelector('picture');
    const titleAltText = cols[3]?.textContent.trim() || '';
    if (titlePicture) {
      titlePicture.classList.add('hero-carousel__title-img');
      titlePicture.dataset.aueProp = 'titleImage';
      titlePicture.dataset.aueType = 'media';
      titlePicture.dataset.aueLabel = 'Imagen del título / logo';
      const titleImg = titlePicture.querySelector('img');
      if (titleImg) {
        if (titleAltText) titleImg.setAttribute('alt', titleAltText);
        titleImg.setAttribute('decoding', 'async');
        titleImg.setAttribute('loading', isFirst ? 'eager' : 'lazy');
        if (isFirst) titleImg.setAttribute('fetchpriority', 'high');
      }
      content.append(titlePicture);
    }

    // col 4: heading → <h2>
    const headingText = cols[4]?.textContent.trim() || '';
    if (headingText) {
      const h2 = document.createElement('h2');
      h2.classList.add('hero-carousel__heading');
      h2.dataset.aueProp = 'heading';
      h2.dataset.aueType = 'text';
      h2.dataset.aueLabel = 'Titular';
      h2.textContent = headingText;
      content.append(h2);
    }

    // col 5: descripción richtext (mover hijos preservando <strong>, <em>, <a>...)
    if (cols[5] && cols[5].firstChild) {
      const descDiv = document.createElement('div');
      descDiv.classList.add('hero-carousel__description');
      descDiv.dataset.aueProp = 'description';
      descDiv.dataset.aueType = 'richtext';
      descDiv.dataset.aueLabel = 'Descripción / subtítulo';
      while (cols[5].firstChild) descDiv.append(cols[5].firstChild);
      content.append(descDiv);
    }

    // cols 6/7/8: precio
    const priceInt = cols[6]?.textContent.trim() || '';
    const priceDec = cols[7]?.textContent.trim() || '';
    const priceSuffix = cols[8]?.textContent.trim() || '';
    if (priceInt || priceDec) {
      const priceDiv = document.createElement('div');
      priceDiv.classList.add('hero-carousel__price');
      priceDiv.setAttribute('aria-label', buildPriceAriaLabel(priceInt, priceDec, priceSuffix));

      appendPriceSpan(priceDiv, 'hero-carousel__price-int', priceInt);
      appendPriceSpan(priceDiv, 'hero-carousel__price-dec', priceDec);
      appendPriceSpan(priceDiv, 'hero-carousel__price-suffix', priceSuffix);
      content.append(priceDiv);
    }

    // col 9: ctaText | col 10: cta (aem-content link)
    const ctaText = cols[9]?.textContent.trim() || '';
    const ctaAnchor = cols[10]?.querySelector('a');
    if (ctaAnchor) {
      ctaAnchor.classList.add('hero-carousel__cta');
      if (ctaText) ctaAnchor.textContent = ctaText;
      ctaAnchor.dataset.aueProp = 'cta';
      ctaAnchor.dataset.aueType = 'aem-content';
      ctaAnchor.dataset.aueLabel = 'Enlace destino del CTA';
      content.append(ctaAnchor);
    } else if (ctaText) {
      const span = document.createElement('span');
      span.classList.add('hero-carousel__cta');
      span.textContent = ctaText;
      content.append(span);
    }

    // col 11: disclaimer
    const disclaimerText = cols[11]?.textContent.trim() || '';
    if (disclaimerText) {
      const disclaimer = document.createElement('p');
      disclaimer.classList.add('hero-carousel__disclaimer');
      disclaimer.dataset.aueProp = 'disclaimer';
      disclaimer.dataset.aueType = 'text';
      disclaimer.dataset.aueLabel = 'Aviso legal';
      disclaimer.textContent = disclaimerText;
      content.append(disclaimer);
    }

    li.append(content);
    track.append(li);
  });

  inner.append(track);

  // 6. Dots de paginación
  const total = rows.length;
  const nav = document.createElement('nav');
  nav.classList.add('hero-carousel__nav');
  nav.setAttribute('aria-label', 'Paginación del carrusel');

  for (let i = 0; i < total; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.classList.add('hero-carousel__dot');
    if (i === 0) dot.classList.add('is-active');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    dot.dataset.index = String(i);
    nav.append(dot);
  }
  inner.append(nav);

  // 7. Botones prev/next (visibles desktop por CSS)
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.classList.add('hero-carousel__btn', 'hero-carousel__btn--prev');
  prevBtn.setAttribute('aria-label', 'Slide anterior');
  prevBtn.innerHTML = PREV_SVG;

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.classList.add('hero-carousel__btn', 'hero-carousel__btn--next');
  nextBtn.setAttribute('aria-label', 'Slide siguiente');
  nextBtn.innerHTML = NEXT_SVG;

  inner.append(prevBtn, nextBtn, liveRegion);

  // 8. Reemplazar contenido del bloque (NO innerHTML, NO replaceChildren sin args)
  block.replaceChildren(inner);

  // Si solo hay 1 slide, no hay controles de navegación
  if (total <= 1) {
    nav.remove();
    prevBtn.remove();
    nextBtn.remove();
    return;
  }

  // 9. Estado del carrusel (closure compartido por helpers)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const interval = parseInt(block.dataset.autoplayInterval, 10) || 5000;
  const state = {
    current: 0,
    total,
    track,
    slides: [...track.children],
    dots: [...nav.children],
    liveRegion,
    autoplayId: null,
    autoplay: block.dataset.autoplay === 'true' && !reduceMotion,
    interval,
    isHovering: false,
    isFocused: false,
  };

  // 10. Navegación: dots
  nav.addEventListener('click', (e) => {
    const dot = e.target.closest('.hero-carousel__dot');
    if (!dot) return;
    const idx = parseInt(dot.dataset.index, 10);
    if (Number.isNaN(idx)) return;
    goToSlide(state, idx);
    restartAutoplay(state);
  });

  // 11. Navegación: prev/next
  prevBtn.addEventListener('click', () => {
    prev(state);
    restartAutoplay(state);
  });
  nextBtn.addEventListener('click', () => {
    next(state);
    restartAutoplay(state);
  });

  // 12. Pausa por hover/focus
  inner.addEventListener('mouseenter', () => {
    state.isHovering = true;
    stopAutoplay(state);
  });
  inner.addEventListener('mouseleave', () => {
    state.isHovering = false;
    if (!state.isFocused) startAutoplay(state);
  });
  inner.addEventListener('focusin', () => {
    state.isFocused = true;
    stopAutoplay(state);
  });
  inner.addEventListener('focusout', (e) => {
    if (!inner.contains(e.relatedTarget)) {
      state.isFocused = false;
      if (!state.isHovering) startAutoplay(state);
    }
  });

  // 13. Keyboard
  setupKeyboard(inner, state);

  // 14. Swipe táctil
  setupSwipe(track, state);

  // 15. Autoplay si procede
  if (state.autoplay) startAutoplay(state);
}
