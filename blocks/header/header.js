/**
 * Header Block — AEM Edge Delivery Services
 *
 * Figma reference: MovistarPlus Header (desktop 122px, mobile drawer)
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: ✅ Completado (Fase 3 - UE & QA Specialist)
 * QA audit: ✅ Validado
 *
 * QA Changes:
 * - Sin cambios de comportamiento (Checks 1-10 superados sin issues bloqueantes).
 * - Añadida instrumentación `data-aue-*` sobre el DOM ya decorado por el Developer.
 *   Toda la inyección se hace mediante la API `dataset` (no `setAttribute`).
 *
 * Decisión UE (matiz fragmento):
 *   El header EDS se autora desde el fragmento `/nav` (o el que indique
 *   `<meta name="nav">`), NO como instancia inline en una página. Por eso
 *   los `data-aue-resource` apuntan a `navPath` (el fragmento) y NO a
 *   `window.location.pathname`. Cuando el autor hace clic en una zona
 *   instrumentada del header en Universal Editor, UE le navega a la página
 *   del fragmento `/nav` para editarlo. La instrumentación se aplica
 *   DESPUÉS de poblar el DOM con los datos del fragmento, en `loadNav()`.
 *
 * Patrón EDS estricto (sin cambios respecto al código entregado por el Developer):
 *   - `decorate(block)` es SÍNCRONA. Monta el esqueleto y registra listeners.
 *   - `loadNav(block)` es `async`, se invoca con `.catch()` y rellena el
 *     contenido cuando el fragmento llega.
 *   - El `block` original se preserva: nunca `innerHTML=''`, `textContent=''`,
 *     `replaceChildren()` ni mutación de `data-block-name`/`data-block-status`.
 */

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const ICONS = {
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="17.4" height="18.4" viewBox="0 0 18 19" fill="none" aria-hidden="true" focusable="false"><circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" stroke-width="1.6"/><path d="M12.5 12.5L17 17.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  profile: `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true" focusable="false"><circle cx="17" cy="17" r="16" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="14" r="4.5" stroke="currentColor" stroke-width="1.6"/><path d="M8 26.5C9.5 22.5 13 20.5 17 20.5C21 20.5 24.5 22.5 26 26.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  burger: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function extractFragmentData(fragment) {
  const data = { logo: null, logoLink: '/', logoAlt: 'Movistar Plus+', navItems: [], cta: null, utilities: [] };
  const sections = [...fragment.children];
  sections.forEach((section) => {
    const picture = section.querySelector('picture');
    if (picture && !data.logo) {
      data.logo = picture;
      const link = picture.closest('a');
      if (link) {
        data.logoLink = link.getAttribute('href') || '/';
        if (link.getAttribute('aria-label')) data.logoAlt = link.getAttribute('aria-label');
      }
      const img = picture.querySelector('img');
      if (img && img.getAttribute('alt')) data.logoAlt = img.getAttribute('alt');
      return;
    }
    const ul = section.querySelector('ul');
    if (ul && !data.navItems.length) {
      ul.querySelectorAll(':scope > li').forEach((li) => {
        const a = li.querySelector('a');
        if (!a) return;
        data.navItems.push({ label: a.textContent.trim(), href: a.getAttribute('href') || '#' });
      });
      return;
    }
    const links = section.querySelectorAll('a');
    links.forEach((a) => {
      if (a.querySelector('picture')) return;
      const href = a.getAttribute('href') || '#';
      const label = a.textContent.trim();
      if (!label) return;
      if (!data.cta) { data.cta = { label, href }; return; }
      const lower = `${href} ${label}`.toLowerCase();
      let key = 'other';
      if (lower.includes('busc') || lower.includes('search')) key = 'search';
      else if (lower.includes('perfil') || lower.includes('profile') || lower.includes('account')) key = 'profile';
      data.utilities.push({ key, label, href });
    });
  });
  return data;
}

function buildBurger() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'header-burger';
  btn.setAttribute('aria-label', 'Abrir menú');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'header-drawer');
  btn.innerHTML = ICONS.burger;
  return btn;
}

function buildEmptyLogo() {
  const a = document.createElement('a');
  a.className = 'header-logo';
  a.href = '/';
  a.setAttribute('aria-label', 'Movistar Plus+');
  return a;
}

function buildEmptyNav() {
  const nav = document.createElement('nav');
  nav.className = 'header-nav';
  nav.setAttribute('aria-label', 'Navegación principal');
  nav.setAttribute('aria-busy', 'true');
  const ul = document.createElement('ul');
  ul.className = 'header-nav-list';
  nav.append(ul);
  return nav;
}

function buildEmptyTools() {
  const tools = document.createElement('div');
  tools.className = 'header-tools';
  tools.setAttribute('aria-busy', 'true');
  return tools;
}

function buildEmptyDrawer() {
  const drawer = document.createElement('div');
  drawer.className = 'header-drawer';
  drawer.id = 'header-drawer';
  drawer.setAttribute('hidden', '');
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Menú principal');
  drawer.setAttribute('aria-busy', 'true');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'header-drawer-close';
  close.setAttribute('aria-label', 'Cerrar menú');
  close.innerHTML = ICONS.close;
  drawer.append(close);
  const list = document.createElement('ul');
  list.className = 'header-drawer-list';
  drawer.append(list);
  return drawer;
}

function populateLogo(logoEl, data) {
  logoEl.href = data.logoLink;
  logoEl.setAttribute('aria-label', data.logoAlt);
  if (!data.logo) { logoEl.textContent = data.logoAlt; return; }
  logoEl.append(data.logo);
  const img = logoEl.querySelector('img');
  if (img) {
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
    img.setAttribute('decoding', 'async');
    if (!img.getAttribute('width')) img.setAttribute('width', '100');
    if (!img.getAttribute('height')) img.setAttribute('height', '44');
    if (!img.getAttribute('alt')) img.setAttribute('alt', data.logoAlt);
  }
}

function populateNav(navEl, data) {
  const ul = navEl.querySelector('.header-nav-list');
  const currentPath = window.location.pathname.replace(/\/$/, '');
  data.navItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'header-nav-item';
    const a = document.createElement('a');
    a.className = 'header-nav-link';
    a.href = item.href;
    a.textContent = item.label;
    const itemPath = (item.href || '').replace(/\/$/, '').replace(/^https?:\/\/[^/]+/, '');
    if (itemPath && itemPath === currentPath) {
      li.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
    li.append(a);
    ul.append(li);
  });
  navEl.setAttribute('aria-busy', 'false');
}

function populateTools(toolsEl, data) {
  const search = data.utilities.find((u) => u.key === 'search');
  const profile = data.utilities.find((u) => u.key === 'profile');
  if (search) {
    const a = document.createElement('a');
    a.className = 'header-tool header-search';
    a.href = search.href;
    a.setAttribute('aria-label', search.label || 'Buscar');
    a.innerHTML = ICONS.search;
    toolsEl.append(a);
  }
  if (data.cta) {
    const cta = document.createElement('a');
    cta.className = 'header-cta';
    cta.href = data.cta.href;
    cta.textContent = data.cta.label;
    toolsEl.append(cta);
  }
  if (profile) {
    const a = document.createElement('a');
    a.className = 'header-tool header-profile';
    a.href = profile.href;
    a.setAttribute('aria-label', profile.label || 'Perfil');
    a.innerHTML = ICONS.profile;
    toolsEl.append(a);
  }
  toolsEl.setAttribute('aria-busy', 'false');
}

function populateDrawer(drawerEl, data) {
  const list = drawerEl.querySelector('.header-drawer-list');
  data.navItems.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    a.className = 'header-drawer-link';
    li.append(a);
    list.append(li);
  });
  if (data.utilities.length) {
    const utils = document.createElement('div');
    utils.className = 'header-drawer-utils';
    data.utilities.forEach((u) => {
      const a = document.createElement('a');
      a.href = u.href;
      a.textContent = u.label;
      a.className = 'header-drawer-link';
      utils.append(a);
    });
    drawerEl.append(utils);
  }
  if (data.cta) {
    const cta = document.createElement('a');
    cta.className = 'header-cta header-drawer-cta';
    cta.href = data.cta.href;
    cta.textContent = data.cta.label;
    drawerEl.append(cta);
  }
  drawerEl.setAttribute('aria-busy', 'false');
}

/**
 * Inyecta los atributos `data-aue-*` (xwalk) sobre el DOM ya poblado.
 * El recurso UE apunta al fragmento `/nav` (no a la página actual): la
 * edición real del header sucede en esa página de autoría.
 *
 * @param {Element} block   Contenedor raíz del bloque.
 * @param {string}  navPath Path del fragmento que contiene la estructura
 *                          editable del header (por ejemplo `/nav`).
 */
function instrumentUE(block, navPath) {
  const resource = `urn:aemconnection:${navPath}#header`;

  // --- Contenedor raíz del bloque ---
  block.dataset.aueResource = resource;
  block.dataset.aueType = 'component';
  block.dataset.aueModel = 'header';
  block.dataset.aueLabel = 'Cabecera';

  // --- Logo (imagen + enlace destino) ---
  const logoEl = block.querySelector('.header-logo');
  if (logoEl) {
    const picture = logoEl.querySelector('picture');
    if (picture) {
      picture.dataset.aueProp = 'logo';
      picture.dataset.aueType = 'media';
      picture.dataset.aueLabel = 'Logo de cabecera';
    }
    // El propio enlace del logo es editable como link destino.
    logoEl.dataset.aueProp = 'logoLink';
    logoEl.dataset.aueType = 'aem-content';
    logoEl.dataset.aueLabel = 'Enlace del logo (normalmente la home)';
  }

  // --- Nav: contenedor de items repetibles ---
  const navEl = block.querySelector('.header-nav');
  if (navEl) {
    navEl.dataset.aueResource = `${resource}/navItems`;
    navEl.dataset.aueType = 'container';
    navEl.dataset.aueModel = 'header-nav-items';
    navEl.dataset.aueFilter = 'header-nav-item'; // ← OBLIGATORIO para añadir/reordenar items en UE
    navEl.dataset.aueLabel = 'Items del menú principal';
    navEl.dataset.aueBehavior = 'component';

    const items = navEl.querySelectorAll('.header-nav-item');
    items.forEach((li, index) => {
      li.dataset.aueResource = `${resource}/navItems/${index}`;
      li.dataset.aueType = 'component';
      li.dataset.aueModel = 'header-nav-item';
      li.dataset.aueLabel = `Item ${index + 1}`;

      const link = li.querySelector('.header-nav-link');
      if (link) {
        link.dataset.aueProp = 'label';
        link.dataset.aueType = 'text';
        link.dataset.aueLabel = 'Etiqueta visible';
      }
    });
  }

  // --- CTA "SUSCRIBIRME AHORA" (texto editable inline; el link es ctaLink) ---
  const ctaEl = block.querySelector('.header-tools .header-cta');
  if (ctaEl) {
    ctaEl.dataset.aueProp = 'ctaText';
    ctaEl.dataset.aueType = 'text';
    ctaEl.dataset.aueLabel = 'Texto del botón principal';
  }

  // --- Buscador (enlace) ---
  const searchEl = block.querySelector('.header-search');
  if (searchEl) {
    searchEl.dataset.aueProp = 'searchLink';
    searchEl.dataset.aueType = 'aem-content';
    searchEl.dataset.aueLabel = 'Enlace destino del buscador';
  }

  // --- Perfil (enlace) ---
  const profileEl = block.querySelector('.header-profile');
  if (profileEl) {
    profileEl.dataset.aueProp = 'profileLink';
    profileEl.dataset.aueType = 'aem-content';
    profileEl.dataset.aueLabel = 'Enlace destino del perfil/login';
  }
}

function setupDrawer(burger, drawer) {
  let lastFocused = null;
  const trapFocus = (e) => {
    if (e.key !== 'Tab') return;
    const focusables = [...drawer.querySelectorAll(FOCUSABLE)];
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  function close() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('hidden', '');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('is-header-drawer-open');
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('click', onClickOutside);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }
  function onKey(e) { if (e.key === 'Escape') close(); else trapFocus(e); }
  function onClickOutside(e) { if (!drawer.contains(e.target) && !burger.contains(e.target)) close(); }
  function open() {
    lastFocused = document.activeElement;
    drawer.removeAttribute('hidden');
    drawer.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('is-header-drawer-open');
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClickOutside);
    const firstFocusable = drawer.querySelector(FOCUSABLE);
    if (firstFocusable) firstFocusable.focus();
  }
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (burger.getAttribute('aria-expanded') === 'true') close(); else open();
  });
  const closeBtn = drawer.querySelector('.header-drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', close);
  const mql = window.matchMedia('(min-width: 1280px)');
  mql.addEventListener('change', () => {
    if (mql.matches && burger.getAttribute('aria-expanded') === 'true') close();
  });
}

async function loadNav(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) {
    block.querySelectorAll('[aria-busy="true"]').forEach((el) => el.setAttribute('aria-busy', 'false'));
    return;
  }
  const data = extractFragmentData(fragment);
  const logoEl = block.querySelector('.header-logo');
  const navEl = block.querySelector('.header-nav');
  const toolsEl = block.querySelector('.header-tools');
  const drawerEl = block.querySelector('.header-drawer');
  if (logoEl) populateLogo(logoEl, data);
  if (navEl) populateNav(navEl, data);
  if (toolsEl) populateTools(toolsEl, data);
  if (drawerEl) populateDrawer(drawerEl, data);

  // Instrumentación UE: apunta al fragmento /nav (no a la página actual).
  // Se aplica DESPUÉS de poblar el DOM para que los selectores encuentren los nodos.
  instrumentUE(block, navPath);
}

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'header-wrapper';
  const burger = buildBurger();
  const logo = buildEmptyLogo();
  const nav = buildEmptyNav();
  const tools = buildEmptyTools();
  wrapper.append(burger, logo, nav, tools);
  const drawer = buildEmptyDrawer();
  block.append(wrapper, drawer);
  setupDrawer(burger, drawer);
  loadNav(block).catch((err) => {
    // Logging operativo (no debug). Necesario para diagnosticar fallos
    // de fetch del fragmento /nav en producción.
    // eslint-disable-next-line no-console
    console.error('[header] Error cargando el fragmento de navegación:', err);
    block.classList.add('header--error');
    block.querySelectorAll('[aria-busy="true"]').forEach((el) => el.setAttribute('aria-busy', 'false'));
  });
}
