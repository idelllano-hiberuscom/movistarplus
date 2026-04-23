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
 * DOM de entrada (matriz EDS):
 *   block (div.promo-band[.promo-band--with-image | .promo-band--plain])
 *     └── div (fila 1, única)
 *           ├── div (col 0) → backgroundImage (<picture> o vacío)
 *           ├── div (col 1) → icono (<picture>)
 *           └── div (col 2) → texto con enlace (<p> con <a>)
 *
 * @param {Element} block - Root element of the block
 */
export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const [bgCol, iconCol, textCol] = [...row.children];

  // Inner wrapper — centrado y max-width
  const inner = document.createElement('div');
  inner.classList.add('promo-band__inner');

  // --- Imagen de fondo (col 0) — solo si existe ---
  const bgPicture = bgCol?.querySelector('picture');
  if (bgPicture) {
    bgPicture.classList.add('promo-band__bg');
    const bgImg = bgPicture.querySelector('img');
    if (bgImg) {
      bgImg.setAttribute('loading', 'lazy');
      bgImg.setAttribute('decoding', 'async');
      bgImg.setAttribute('alt', ''); // decorativa
    }
    // UE: DOM-bound prop
    bgPicture.dataset.aueProp = 'backgroundImage';
    bgPicture.dataset.aueType = 'media';
    bgPicture.dataset.aueLabel = 'Imagen decorativa de fondo';
    inner.append(bgPicture);
  }

  // --- Content wrapper (icono + texto) ---
  const content = document.createElement('div');
  content.classList.add('promo-band__content');

  // Icono (col 1)
  const iconPicture = iconCol?.querySelector('picture');
  if (iconPicture) {
    iconPicture.classList.add('promo-band__icon');
    const iconImg = iconPicture.querySelector('img');
    if (iconImg) {
      iconImg.setAttribute('loading', 'lazy');
      iconImg.setAttribute('decoding', 'async');
    }
    // UE: DOM-bound prop
    iconPicture.dataset.aueProp = 'icon';
    iconPicture.dataset.aueType = 'media';
    iconPicture.dataset.aueLabel = 'Icono o logo';
    content.append(iconPicture);
  }

  // Texto con enlace (col 2)
  const textP = textCol?.querySelector('p');
  if (textP) {
    textP.classList.add('promo-band__text');
    const link = textP.querySelector('a');
    if (link) {
      link.classList.add('promo-band__link');
    }
    // UE: DOM-bound prop
    textP.dataset.aueProp = 'text';
    textP.dataset.aueType = 'richtext';
    textP.dataset.aueLabel = 'Texto con enlace embebido';
    content.append(textP);
  }

  inner.append(content);
  block.replaceChildren(inner);

  // --- INSTRUMENTACIÓN UE (xwalk) — Contenedor raíz ---
  block.dataset.aueResource = `urn:aemconnection:${window.location.pathname}#promo-band`;
  block.dataset.aueType = 'component';
  block.dataset.aueModel = 'promo-band';
  block.dataset.aueLabel = 'Promo Band';
}
