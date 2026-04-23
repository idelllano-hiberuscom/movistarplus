/**
 * Media Grid Block - AEM Edge Delivery Services
 *
 * Grid de 4 columnas x 2 filas en desktop. La primera celda (esquina
 * superior-izquierda) suele ser un panel de texto (editorial) con titulo,
 * cuerpo y CTA. El resto son imagenes con caption y enlace opcional.
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

function readText(col) {
  return col ? col.textContent.trim() : '';
}

function readAnchor(col) {
  return col ? col.querySelector('a') : null;
}

function clampSpan(raw) {
  const n = parseInt(raw, 10);
  return n === 2 ? 2 : 1;
}

function buildTextCell(cols, li) {
  const title = readText(cols[1]);
  const body = readText(cols[2]);
  const ctaText = readText(cols[3]);
  const ctaAnchor = readAnchor(cols[4]);

  li.classList.add('media-grid__cell--text');

  if (title) {
    const h3 = document.createElement('h3');
    h3.classList.add('media-grid__title');
    h3.textContent = title;
    h3.dataset.aueProp = 'title';
    h3.dataset.aueType = 'text';
    h3.dataset.aueLabel = 'Titulo del panel editorial';
    li.append(h3);
  }

  if (body) {
    const p = document.createElement('p');
    p.classList.add('media-grid__body');
    p.textContent = body;
    p.dataset.aueProp = 'body';
    p.dataset.aueType = 'text';
    p.dataset.aueLabel = 'Cuerpo del panel editorial';
    li.append(p);
  }

  if (ctaAnchor) {
    ctaAnchor.classList.add('media-grid__cta');
    if (ctaText) ctaAnchor.textContent = ctaText;
    ctaAnchor.dataset.aueProp = 'cta';
    ctaAnchor.dataset.aueType = 'aem-content';
    ctaAnchor.dataset.aueLabel = 'Enlace del CTA';
    li.append(ctaAnchor);
  }
}

function buildImageCell(cols, li) {
  const caption = readText(cols[1]);
  const picture = cols[5]?.querySelector('picture') || null;
  const imageAlt = readText(cols[6]);
  const linkAnchor = readAnchor(cols[7]);

  li.classList.add('media-grid__cell--image');

  if (!picture) return;

  const img = picture.querySelector('img');
  if (img) {
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
    if (imageAlt) img.setAttribute('alt', imageAlt);
  }
  picture.classList.add('media-grid__picture');
  picture.dataset.aueProp = 'image';
  picture.dataset.aueType = 'media';
  picture.dataset.aueLabel = 'Imagen de la celda';

  let container = li;
  if (linkAnchor && linkAnchor.href) {
    const a = document.createElement('a');
    a.classList.add('media-grid__link');
    a.href = linkAnchor.getAttribute('href') || '#';
    a.setAttribute('aria-label', caption || imageAlt || '');
    li.append(a);
    container = a;
  }
  container.append(picture);

  if (caption) {
    const cap = document.createElement('p');
    cap.classList.add('media-grid__caption');
    cap.textContent = caption;
    cap.dataset.aueProp = 'caption';
    cap.dataset.aueType = 'text';
    cap.dataset.aueLabel = 'Pie de imagen / caption';
    container.append(cap);
  }
}

export default function decorate(block) {
  const rows = [...block.children];

  // Block-level field "heading": primera fila sin <picture>
  // y sin multiples columnas (una sola celda de texto).
  let itemStart = 0;
  let headingRow = null;
  if (rows[0] && rows[0].children.length <= 1 && !rows[0].querySelector('picture')) {
    [headingRow] = rows;
    itemStart = 1;
  }
  const headingText = readText(headingRow);

  const inner = document.createElement('div');
  inner.classList.add('media-grid__inner');

  if (headingText) {
    const h2 = document.createElement('h2');
    h2.classList.add('media-grid__heading');
    h2.textContent = headingText;
    if (headingRow) moveInstrumentation(headingRow, h2);
    h2.dataset.aueProp = 'heading';
    h2.dataset.aueType = 'text';
    h2.dataset.aueLabel = 'Encabezado de la seccion';
    inner.append(h2);
  }

  const ul = document.createElement('ul');
  ul.classList.add('media-grid__list');
  ul.setAttribute('role', 'list');

  const itemRows = rows.slice(itemStart);
  itemRows.forEach((row, index) => {
    const cols = [...row.children];
    const cellTypeRaw = readText(cols[0]).toLowerCase();
    const cellType = cellTypeRaw === 'text' ? 'text' : 'image';

    const li = document.createElement('li');
    li.classList.add('media-grid__cell');
    moveInstrumentation(row, li);

    const rowSpan = clampSpan(readText(cols[8]));
    const colSpan = clampSpan(readText(cols[9]));

    if (rowSpan === 2) li.classList.add('media-grid__cell--row-2');
    if (colSpan === 2) li.classList.add('media-grid__cell--col-2');

    // Placement explícito via data-attribute para que el CSS pueda
    // usar nth-child o el JS lo aplique como inline style.
    // Esto resuelve el bug del auto-placement cuando rowSpan=2, colSpan=1:
    // sin posición de columna explícita el navegador puede colocar la celda
    // en cualquier columna libre, rompiendo el layout de 4 columnas.
    li.dataset.gridIndex = index;
    if (rowSpan === 2 && colSpan === 1) {
      // Forzar placement explícito en columna 1, fila 1
      // Solo si es la primera celda del grid (índice 0).
      // Para celdas posteriores con row-span=2 dejamos que el CSS
      // lo gestione con la clase, o se puede extender esta lógica.
      if (index === 0) {
        li.style.setProperty('grid-column', '1');
        li.style.setProperty('grid-row', '1 / span 2');
      }
    }

    if (cellType === 'text') {
      buildTextCell(cols, li);
    } else {
      buildImageCell(cols, li);
    }

    ul.append(li);
  });

  inner.append(ul);
  block.replaceChildren(inner);
  block.dataset.aueFilter = 'media-grid';
}
