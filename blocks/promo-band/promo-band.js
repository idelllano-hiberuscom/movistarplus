/**
 * Promo Band Block - AEM Edge Delivery Services
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

function readText(node) {
  return node ? node.textContent.trim() : '';
}

function resolveVariant(block, hasBackgroundPicture) {
  if (block.classList.contains('promo-band--with-image')) return 'with-image';
  if (block.classList.contains('promo-band--plain')) return 'plain';

  const rawVariant = (block.dataset.variant || '').toLowerCase();
  if (rawVariant === 'with-image' || rawVariant === 'plain') return rawVariant;

  return hasBackgroundPicture ? 'with-image' : 'plain';
}

function getMatrixCells(block) {
  const row = [...block.children].find((candidate) => candidate.children.length >= 2);
  if (!row) return null;

  const cols = [...row.children];
  return {
    backgroundCell: cols[0] || null,
    iconCell: cols[1] || null,
    textCell: cols[2] || null,
  };
}

function getFallbackContent(rows, variant) {
  const pictureEntries = rows
    .map((row) => ({ row, picture: row.querySelector('picture') }))
    .filter((entry) => entry.picture);
  const textRows = rows.filter((row) => !row.querySelector('picture') && readText(row));
  const textRowWithLink = [...textRows].reverse().find((row) => row.querySelector('a'));
  const textRow = textRowWithLink || textRows[textRows.length - 1] || null;

  const content = {
    backgroundPicture: null,
    backgroundSource: null,
    backgroundAlt: null,
    iconPicture: null,
    iconSource: null,
    iconAlt: null,
    textElement: null,
    textSource: textRow,
  };

  if (variant === 'with-image' && pictureEntries.length > 1) {
    content.backgroundPicture = pictureEntries[0].picture;
    content.backgroundSource = pictureEntries[0].row;
    content.backgroundAlt = readText(pictureEntries[0].row.nextElementSibling);
    content.iconPicture = pictureEntries[1].picture;
    content.iconSource = pictureEntries[1].row;
    content.iconAlt = readText(pictureEntries[1].row.nextElementSibling);
  } else {
    content.iconPicture = pictureEntries[0]?.picture || null;
    content.iconSource = pictureEntries[0]?.row || null;
    content.iconAlt = content.iconSource ? readText(content.iconSource.nextElementSibling) : null;
  }

  if (textRow) {
    content.textElement = textRow.querySelector('p') || null;
    if (!content.textElement) {
      const text = readText(textRow);
      if (text) {
        content.textElement = document.createElement('p');
        content.textElement.textContent = text;
      }
    }
  }

  return content;
}

function setImageAttrs(picture, altText) {
  const img = picture?.querySelector('img');
  if (!img) return;

  img.setAttribute('loading', 'lazy');
  img.setAttribute('decoding', 'async');

  if (typeof altText === 'string') {
    img.setAttribute('alt', altText);
  }
}

function instrumentField(source, target, prop, type, label) {
  if (!target) return;
  if (source) moveInstrumentation(source, target);

  target.dataset.aueProp = prop;
  target.dataset.aueType = type;
  target.dataset.aueLabel = label;
}

export default function decorate(block) {
  const rows = [...block.children];
  const matrixCells = getMatrixCells(block);
  const hasBackgroundPicture = matrixCells
    ? Boolean(matrixCells.backgroundCell?.querySelector('picture'))
    : rows.filter((row) => row.querySelector('picture')).length > 1;
  const variant = resolveVariant(block, hasBackgroundPicture);

  block.classList.remove('promo-band--with-image', 'promo-band--plain');
  block.classList.add(`promo-band--${variant}`);

  let backgroundPicture = null;
  let backgroundSource = null;
  let backgroundAlt = null;
  let iconPicture = null;
  let iconSource = null;
  let iconAlt = null;
  let textElement = null;
  let textSource = null;

  if (matrixCells) {
    backgroundPicture = matrixCells.backgroundCell?.querySelector('picture') || null;
    backgroundSource = matrixCells.backgroundCell;
    iconPicture = matrixCells.iconCell?.querySelector('picture') || null;
    iconSource = matrixCells.iconCell;
    textSource = matrixCells.textCell;

    textElement = matrixCells.textCell?.querySelector('p') || null;
    if (!textElement) {
      const text = readText(matrixCells.textCell);
      if (text) {
        textElement = document.createElement('p');
        textElement.textContent = text;
      }
    }

    if (variant === 'plain') {
      backgroundPicture = null;
      backgroundSource = null;
    }
  } else {
    const fallback = getFallbackContent(rows, variant);
    backgroundPicture = fallback.backgroundPicture;
    backgroundSource = fallback.backgroundSource;
    backgroundAlt = fallback.backgroundAlt;
    iconPicture = fallback.iconPicture;
    iconSource = fallback.iconSource;
    iconAlt = fallback.iconAlt;
    textElement = fallback.textElement;
    textSource = fallback.textSource;
  }

  const inner = document.createElement('div');
  inner.classList.add('promo-band__inner');

  const content = document.createElement('div');
  content.classList.add('promo-band__content');

  if (backgroundPicture && variant === 'with-image') {
    backgroundPicture.classList.add('promo-band__bg');
    setImageAttrs(backgroundPicture, backgroundAlt);
    instrumentField(
      backgroundSource,
      backgroundPicture,
      'backgroundImage',
      'media',
      'Imagen decorativa de fondo',
    );
  } else {
    backgroundPicture = null;
  }

  if (iconPicture) {
    iconPicture.classList.add('promo-band__icon');
    setImageAttrs(iconPicture, iconAlt);
    instrumentField(iconSource, iconPicture, 'icon', 'media', 'Icono o logo');
    content.append(iconPicture);
  }

  if (textElement) {
    textElement.classList.add('promo-band__text');
    const link = textElement.querySelector('a');
    if (link) link.classList.add('promo-band__link');
    instrumentField(textSource, textElement, 'text', 'text', 'Texto con enlace embebido');
    content.append(textElement);
  }

  inner.append(content);

  if (backgroundPicture) {
    block.replaceChildren(backgroundPicture, inner);
  } else {
    block.replaceChildren(inner);
  }
}
