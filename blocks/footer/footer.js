/**
 * Footer Block — AEM Edge Delivery Services
 *
 * Figma reference: MovistarPlus Footer (desktop 3:9925, tablet 3:6436, mobile 3:8200)
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: ✅ Completado (Fase 3 - UE & QA Specialist)
 * QA audit: ✅ Validado
 *
 * QA Changes:
 * - Sin cambios de comportamiento (Checks 1-10 superados sin issues bloqueantes).
 * - Añadida instrumentación `data-aue-*` sobre el DOM ya poblado por `loadFooterContent`.
 *   La inyección se hace mediante la API `dataset` (consistente con header.js).
 *
 * Decisión UE (matiz fragmento, replica del header):
 *   El footer EDS se autora desde el fragmento `/footer` (o el que indique
 *   `<meta name="footer">`), NO como instancia inline en una página. Por eso
 *   los `data-aue-resource` apuntan a `footerPath` (el fragmento) y NO a
 *   `window.location.pathname`. La instrumentación se aplica DESPUÉS de
 *   poblar el DOM con los datos del fragmento, en `loadFooterContent()`.
 *
 * Patrón EDS estricto (replica del header.js validado):
 *   - `decorate(block)` es SÍNCRONA. Monta el esqueleto con placeholders
 *     `aria-busy="true"` y registra la carga del fragmento.
 *   - `loadFooterContent(block)` es `async`, se invoca con `.catch()` y
 *     puebla los contenedores cuando el fragmento `/footer` llega.
 *   - El `block` original se preserva: nunca `innerHTML=''`, `textContent=''`,
 *     `replaceChildren()` ni mutación de `data-block-name`/`data-block-status`.
 *
 * DOM de entrada (matriz EDS — ver footer-instructions.md sección 3 "ENTRADA"):
 *   El bloque inline en la página (`<div class="footer block">`) NO trae
 *   contenido por sí mismo. El contenido real se carga desde el fragmento
 *   `/footer` (path resoluble vía `getMetadata('footer') || '/footer'`),
 *   cuya estructura tras `loadFragment` contiene:
 *     - N bloques de columnas, cada uno con un <h3> + <ul><li><a>
 *     - una zona inferior con <picture> + <p> (logo + copyright),
 *       <ul><li><a> (legales; último item es "cookies") y
 *       <p> + <ul><li><a><img>...</a></li>... (social).
 *
 * @param {Element} block - Root element of the footer block
 */

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_NETWORKS = [
  { key: 'facebook', label: 'Facebook', match: /facebook\.com/i },
  { key: 'twitter', label: 'Twitter / X', match: /(twitter\.com|x\.com)/i },
  { key: 'instagram', label: 'Instagram', match: /instagram\.com/i },
  { key: 'youtube', label: 'YouTube', match: /youtube\.com|youtu\.be/i },
  { key: 'tiktok', label: 'TikTok', match: /tiktok\.com/i },
  { key: 'linkedin', label: 'LinkedIn', match: /linkedin\.com/i },
];

/* ---------- Constructores de placeholders (esqueleto síncrono) ---------- */

function buildEmptyColumns() {
  const el = document.createElement('div');
  el.className = 'footer-columns';
  el.setAttribute('aria-busy', 'true');
  return el;
}

function buildEmptyBottom() {
  const el = document.createElement('div');
  el.className = 'footer-bottom';
  el.setAttribute('aria-busy', 'true');
  const brand = document.createElement('div');
  brand.className = 'footer-brand';
  const legal = document.createElement('ul');
  legal.className = 'footer-legal';
  const social = document.createElement('div');
  social.className = 'footer-social';
  el.append(brand, legal, social);
  return el;
}

/* ---------- Extracción de datos del fragmento ---------- */

function detectNetwork(href) {
  if (!href) return null;
  return SOCIAL_NETWORKS.find((n) => n.match.test(href)) || null;
}

function isCookiesItem(anchor) {
  if (!anchor) return false;
  const text = (anchor.textContent || '').trim().toLowerCase();
  return text === 'cookies';
}

/**
 * Localiza el <ul> asociado a un <h3> de columna. Tolerante a variaciones:
 * busca el siguiente hermano <ul> o, si no existe, el primer <ul> del padre.
 */
function findListForHeading(h3) {
  let list = h3.nextElementSibling;
  while (list && list.tagName !== 'UL') list = list.nextElementSibling;
  if (!list) {
    const parent = h3.parentElement;
    list = parent ? parent.querySelector('ul') : null;
  }
  return list;
}

/**
 * Extrae las columnas (h3 + ul) y los tres sub-bloques de la zona inferior
 * desde el fragmento. Es tolerante a variaciones del autor: busca por
 * estructura semántica (h3 + ul / picture / aria-label) y no por orden fijo.
 */
function extractFragmentData(fragment) {
  const data = {
    columns: [],
    logo: null,
    logoAlt: 'Movistar Plus+',
    copyright: '',
    legalLinks: [],
    socialTitle: 'Síguenos en redes',
    socialLinks: [],
  };

  // 1. Columnas + registro de las <ul> consumidas para no reusarlas como legal/social.
  const columnLists = new Set();
  fragment.querySelectorAll('h3').forEach((h3) => {
    const heading = h3.textContent.trim();
    if (!heading) return;
    const list = findListForHeading(h3);
    if (!list) return;
    columnLists.add(list);
    const links = [];
    list.querySelectorAll(':scope > li').forEach((li) => {
      const a = li.querySelector('a');
      if (!a) return;
      const label = a.textContent.trim();
      if (!label) return;
      links.push({ label, href: a.getAttribute('href') || '#' });
    });
    if (links.length) data.columns.push({ heading, links });
  });

  // 2. Logo: la primera <picture> del fragmento (zona inferior).
  const picture = fragment.querySelector('picture');
  if (picture) {
    data.logo = picture;
    const img = picture.querySelector('img');
    if (img && img.getAttribute('alt')) data.logoAlt = img.getAttribute('alt');
  }

  // 3. Copyright: primer <p> que contenga ©, año literal o el placeholder {year}.
  const paragraphs = [...fragment.querySelectorAll('p')];
  const copyrightP = paragraphs.find((p) => /©|\{year\}|\b(19|20)\d{2}\b/.test(p.textContent));
  if (copyrightP) data.copyright = copyrightP.textContent.trim();

  // 4. Legales y sociales: recorrer las <ul> restantes.
  fragment.querySelectorAll('ul').forEach((ul) => {
    if (columnLists.has(ul)) return;
    const items = [...ul.querySelectorAll(':scope > li')];
    if (!items.length) return;

    const hasImg = ul.querySelector('img') !== null;
    const looksSocial = hasImg || items.some((li) => {
      const a = li.querySelector('a');
      return a && detectNetwork(a.getAttribute('href')) !== null;
    });

    if (looksSocial && !data.socialLinks.length) {
      items.forEach((li) => {
        const a = li.querySelector('a');
        if (!a) return;
        const href = a.getAttribute('href') || '#';
        const img = a.querySelector('img');
        const network = detectNetwork(href);
        const ariaFromAuthor = a.getAttribute('aria-label');
        const label = ariaFromAuthor
          || (network ? `Síguenos en ${network.label}` : (a.textContent.trim() || 'Red social'));
        data.socialLinks.push({
          href,
          label,
          network: network ? network.key : null,
          img,
        });
      });
      return;
    }

    if (!data.legalLinks.length) {
      items.forEach((li) => {
        const a = li.querySelector('a');
        if (!a) return;
        const label = a.textContent.trim();
        if (!label) return;
        data.legalLinks.push({
          label,
          href: a.getAttribute('href') || '#',
          isCookies: isCookiesItem(a),
        });
      });
    }
  });

  // 5. Título de redes: <p> distinto del copyright que mencione "redes" / "síguenos".
  const socialTitleP = paragraphs.find((p) => p !== copyrightP && /redes|síguenos|follow/i.test(p.textContent));
  if (socialTitleP) data.socialTitle = socialTitleP.textContent.trim();

  return data;
}

/* ---------- Poblado de los contenedores ---------- */

function populateColumns(columnsEl, data) {
  data.columns.forEach((col) => {
    const section = document.createElement('section');
    section.className = 'footer-column';

    const h3 = document.createElement('h3');
    h3.className = 'footer-column-heading';
    h3.textContent = col.heading;

    const ul = document.createElement('ul');
    ul.className = 'footer-column-list';
    col.links.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'footer-column-item';
      const a = document.createElement('a');
      a.className = 'footer-column-link';
      a.href = item.href;
      a.textContent = item.label;
      li.append(a);
      ul.append(li);
    });

    section.append(h3, ul);
    columnsEl.append(section);
  });
  columnsEl.setAttribute('aria-busy', 'false');
}

function resolveCopyright(raw) {
  const year = String(new Date().getFullYear());
  // ⚠️ TODO: confirmar con cliente si el año debe ser dinámico siempre o respetar el literal del fragmento.
  if (!raw) return `© Telefónica de España, S.A.U. ${year}`;
  if (raw.includes('{year}')) return raw.replace(/\{year\}/g, year);
  if (/\b(19|20)\d{2}\b/.test(raw)) return raw; // respetar año literal
  return `${raw} ${year}`.trim();
}

function populateBottom(bottomEl, data) {
  /* --- Brand: logo + copyright --- */
  const brand = bottomEl.querySelector('.footer-brand');
  if (data.logo) {
    const wrapper = document.createElement('a');
    wrapper.className = 'footer-logo';
    wrapper.href = '/';
    wrapper.setAttribute('aria-label', data.logoAlt);
    wrapper.append(data.logo);
    const img = wrapper.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      if (!img.getAttribute('width')) img.setAttribute('width', '99');
      if (!img.getAttribute('height')) img.setAttribute('height', '24');
      if (!img.getAttribute('alt')) img.setAttribute('alt', data.logoAlt);
    }
    brand.append(wrapper);
  }
  const copyP = document.createElement('p');
  copyP.className = 'footer-copyright';
  copyP.textContent = resolveCopyright(data.copyright);
  brand.append(copyP);

  /* --- Legales: <a> + último <button> "cookies" --- */
  const legal = bottomEl.querySelector('.footer-legal');
  data.legalLinks.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'footer-legal-item';
    if (item.isCookies) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'footer-cookies-btn';
      btn.textContent = item.label;
      // ⚠️ TODO: confirmar trigger del CMP esperado por el cliente (OneTrust / Cookiebot / propio).
      // El bloque solo expone el data-attribute; la integración real del CMP es externa.
      btn.setAttribute('data-cookie-trigger', '');
      li.append(btn);
    } else {
      const a = document.createElement('a');
      a.className = 'footer-legal-link';
      a.href = item.href;
      a.textContent = item.label;
      li.append(a);
    }
    legal.append(li);
  });

  /* --- Sociales --- */
  const social = bottomEl.querySelector('.footer-social');
  if (data.socialTitle) {
    const title = document.createElement('p');
    title.className = 'footer-social-title';
    title.textContent = data.socialTitle;
    social.append(title);
  }
  if (data.socialLinks.length) {
    const ul = document.createElement('ul');
    ul.className = 'footer-social-list';
    data.socialLinks.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'footer-social-item';
      const a = document.createElement('a');
      a.className = `footer-social-link${item.network ? ` footer-social--${item.network}` : ''}`;
      a.href = item.href;
      a.setAttribute('aria-label', item.label);
      a.rel = 'noopener noreferrer';
      a.target = '_blank';
      if (item.img) {
        // Reutilizamos el <img> entregado por el fragmento.
        item.img.setAttribute('alt', '');
        item.img.setAttribute('loading', 'lazy');
        item.img.setAttribute('decoding', 'async');
        if (!item.img.getAttribute('width')) item.img.setAttribute('width', '20');
        if (!item.img.getAttribute('height')) item.img.setAttribute('height', '20');
        a.append(item.img);
      } else {
        // ⚠️ TODO: el fragmento no entregó <img> para esta red social.
        // Fallback a span vacío decorativo; el aria-label del <a> mantiene la accesibilidad.
        const span = document.createElement('span');
        span.className = 'footer-social-icon-fallback';
        span.setAttribute('aria-hidden', 'true');
        a.append(span);
      }
      li.append(a);
      ul.append(li);
    });
    social.append(ul);
  }

  bottomEl.setAttribute('aria-busy', 'false');
}

/* ---------- Instrumentación Universal Editor (xwalk) ---------- */

/**
 * Inyecta los atributos `data-aue-*` (xwalk) sobre el DOM ya poblado.
 * El recurso UE apunta al fragmento `/footer` (no a la página actual): la
 * edición real del footer sucede en esa página de autoría, igual que el header.
 *
 * @param {Element} block      Contenedor raíz del bloque.
 * @param {string}  footerPath Path del fragmento que contiene la estructura
 *                             editable del footer (por ejemplo `/footer`).
 */
function instrumentUE(block, footerPath) {
  const resource = `urn:aemconnection:${footerPath}#footer`;

  // --- Contenedor raíz del bloque ---
  block.dataset.aueResource = resource;
  block.dataset.aueType = 'component';
  block.dataset.aueModel = 'footer';
  block.dataset.aueLabel = 'Pie de página';

  // --- Columnas: contenedor de items repetibles + items + sus links anidados ---
  const columnsEl = block.querySelector('.footer-columns');
  if (columnsEl) {
    columnsEl.dataset.aueResource = `${resource}/columns`;
    columnsEl.dataset.aueType = 'container';
    columnsEl.dataset.aueModel = 'footer-columns';
    columnsEl.dataset.aueFilter = 'footer-column'; // ← OBLIGATORIO para añadir/reordenar columnas en UE
    columnsEl.dataset.aueLabel = 'Columnas del footer';
    columnsEl.dataset.aueBehavior = 'component';

    columnsEl.querySelectorAll('.footer-column').forEach((section, i) => {
      section.dataset.aueResource = `${resource}/columns/${i}`;
      section.dataset.aueType = 'component';
      section.dataset.aueModel = 'footer-column';
      section.dataset.aueLabel = `Columna ${i + 1}`;

      const heading = section.querySelector('.footer-column-heading');
      if (heading) {
        heading.dataset.aueProp = 'heading';
        heading.dataset.aueType = 'text';
        heading.dataset.aueLabel = 'Título de la columna';
      }

      const list = section.querySelector('.footer-column-list');
      if (list) {
        list.dataset.aueResource = `${resource}/columns/${i}/links`;
        list.dataset.aueType = 'container';
        list.dataset.aueModel = 'footer-column-links';
        list.dataset.aueFilter = 'footer-link';
        list.dataset.aueLabel = 'Enlaces de la columna';
        list.dataset.aueBehavior = 'component';

        list.querySelectorAll('.footer-column-item').forEach((li, j) => {
          li.dataset.aueResource = `${resource}/columns/${i}/links/${j}`;
          li.dataset.aueType = 'component';
          li.dataset.aueModel = 'footer-link';
          li.dataset.aueLabel = `Enlace ${j + 1}`;

          const a = li.querySelector('.footer-column-link');
          if (a) {
            a.dataset.aueProp = 'label';
            a.dataset.aueType = 'text';
            a.dataset.aueLabel = 'Etiqueta visible';
          }
        });
      }
    });
  }

  // --- Brand: logo + copyright (props del propio modelo `footer`) ---
  const logoEl = block.querySelector('.footer-logo');
  if (logoEl) {
    const picture = logoEl.querySelector('picture');
    if (picture) {
      picture.dataset.aueProp = 'logo';
      picture.dataset.aueType = 'media';
      picture.dataset.aueLabel = 'Logo del footer';
    }
    logoEl.dataset.aueProp = 'logoLink';
    logoEl.dataset.aueType = 'aem-content';
    logoEl.dataset.aueLabel = 'Enlace del logo (normalmente la home)';
  }
  const copyrightEl = block.querySelector('.footer-copyright');
  if (copyrightEl) {
    copyrightEl.dataset.aueProp = 'copyright';
    copyrightEl.dataset.aueType = 'text';
    copyrightEl.dataset.aueLabel = 'Texto de copyright';
  }

  // --- Legales: contenedor + items (label editable; el botón cookies se
  //     detecta automáticamente por texto en `populateBottom`) ---
  const legalEl = block.querySelector('.footer-legal');
  if (legalEl) {
    legalEl.dataset.aueResource = `${resource}/legalLinks`;
    legalEl.dataset.aueType = 'container';
    legalEl.dataset.aueModel = 'footer-legal-links';
    legalEl.dataset.aueFilter = 'footer-link';
    legalEl.dataset.aueLabel = 'Enlaces legales';
    legalEl.dataset.aueBehavior = 'component';

    legalEl.querySelectorAll('.footer-legal-item').forEach((li, i) => {
      li.dataset.aueResource = `${resource}/legalLinks/${i}`;
      li.dataset.aueType = 'component';
      li.dataset.aueModel = 'footer-link';
      li.dataset.aueLabel = `Enlace legal ${i + 1}`;

      // Tanto <a class="footer-legal-link"> como <button class="footer-cookies-btn">
      // exponen el mismo `label` editable (texto visible).
      const editable = li.querySelector('.footer-legal-link, .footer-cookies-btn');
      if (editable) {
        editable.dataset.aueProp = 'label';
        editable.dataset.aueType = 'text';
        editable.dataset.aueLabel = 'Etiqueta visible';
      }
    });
  }

  // --- Sociales: título (prop del root) + lista (container) + items ---
  const socialEl = block.querySelector('.footer-social');
  if (socialEl) {
    const socialTitleEl = socialEl.querySelector('.footer-social-title');
    if (socialTitleEl) {
      socialTitleEl.dataset.aueProp = 'socialTitle';
      socialTitleEl.dataset.aueType = 'text';
      socialTitleEl.dataset.aueLabel = 'Título de la zona de redes';
    }

    const socialList = socialEl.querySelector('.footer-social-list');
    if (socialList) {
      socialList.dataset.aueResource = `${resource}/socialLinks`;
      socialList.dataset.aueType = 'container';
      socialList.dataset.aueModel = 'footer-social-links';
      socialList.dataset.aueFilter = 'footer-social';
      socialList.dataset.aueLabel = 'Redes sociales';
      socialList.dataset.aueBehavior = 'component';

      socialList.querySelectorAll('.footer-social-item').forEach((li, i) => {
        li.dataset.aueResource = `${resource}/socialLinks/${i}`;
        li.dataset.aueType = 'component';
        li.dataset.aueModel = 'footer-social';
        li.dataset.aueLabel = `Red social ${i + 1}`;

        const a = li.querySelector('.footer-social-link');
        if (a) {
          a.dataset.aueProp = 'link';
          a.dataset.aueType = 'aem-content';
          a.dataset.aueLabel = 'URL destino de la red social';
        }
      });
    }
  }
}

/* ---------- Carga asíncrona del fragmento (NO se hace await en decorate) ---------- */

async function loadFooterContent(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) {
    block.querySelectorAll('[aria-busy="true"]').forEach((el) => el.setAttribute('aria-busy', 'false'));
    return;
  }
  const data = extractFragmentData(fragment);
  const columnsEl = block.querySelector('.footer-columns');
  const bottomEl = block.querySelector('.footer-bottom');
  if (columnsEl) populateColumns(columnsEl, data);
  if (bottomEl) populateBottom(bottomEl, data);

  // Instrumentación UE: apunta al fragmento /footer (no a la página actual).
  // Se aplica DESPUÉS de poblar el DOM para que los selectores encuentren los nodos.
  instrumentUE(block, footerPath);
}

/* ---------- decorate (SÍNCRONA — contrato EDS inviolable) ---------- */

export default function decorate(block) {
  // 1. Esqueleto síncrono: <footer> semántico + dos contenedores con aria-busy.
  const wrapper = document.createElement('footer');
  wrapper.className = 'footer-wrapper';
  wrapper.setAttribute('aria-label', 'Pie de página');

  const columns = buildEmptyColumns();
  const bottom = buildEmptyBottom();

  wrapper.append(columns, bottom);
  block.append(wrapper);

  // 2. Carga asíncrona disparada SIN await — preserva el contrato EDS.
  loadFooterContent(block).catch((err) => {
    // Logging operativo para diagnosticar fallos de fetch del fragmento /footer.
    // eslint-disable-next-line no-console
    console.error('[footer] Error cargando el fragmento del footer:', err);
    block.classList.add('footer--error');
    block.querySelectorAll('[aria-busy="true"]').forEach((el) => el.setAttribute('aria-busy', 'false'));
  });
}
