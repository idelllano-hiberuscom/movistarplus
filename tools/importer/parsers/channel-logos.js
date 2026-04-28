/* eslint-disable */
/* global WebImporter */

/**
 * Parser: channel-logos
 * Base block: channel-logos (container block)
 * Source: https://www.movistarplus.es/
 * Selector: section#m6788c28c7f4788477b7c1e32
 * Project type: xwalk (field hinting enabled)
 *
 * UE Model (channel-logos):
 *   - heading (string, required) -> H2 section heading
 *   - subtitle (string) -> description paragraph
 *   - scrollMode (select) -> not extractable from source, omit
 *   - marqueeSpeed (select) -> not extractable from source, omit
 *
 * UE Model (channel-logos-item):
 *   - image (reference, required) -> logo image
 *   - name (string, required) -> channel name from alt text
 *   - link (aem-content) -> href from anchor
 *
 * Source structure:
 *   section.mplus-collection.mplus-collection__logos
 *     .wrapper > .section-header > h2.section-header__title
 *     .wrapper > .section-header > .section-header__text > p
 *     .wrapper > .mplus-collection__content > ul.brand-carousel > li > a.mplus-collection__image > img
 *
 * Target: Container block with header row (heading, subtitle) then one row per logo item (image, name, link).
 * Generated: 2026-04-28
 */
export default function parse(element, { document }) {
  // --- Extract block-level fields ---
  const heading = element.querySelector('.section-header__title, h2');
  const subtitleEl = element.querySelector('.section-header__text p, .section-header__text');

  // --- Extract logo items ---
  const logoItems = Array.from(element.querySelectorAll('ul.brand-carousel > li'));

  // --- Build cells array ---
  // Container block: first row = block-level fields, subsequent rows = one per item
  const cells = [];

  // Row 1: Block-level fields (heading + subtitle)
  // heading and subtitle are grouped into a single cell for a simple block header row
  const headerCell = document.createDocumentFragment();
  if (heading) {
    headerCell.appendChild(document.createComment(' field:heading '));
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    headerCell.appendChild(h);
  }
  if (subtitleEl) {
    const subText = subtitleEl.textContent.trim();
    if (subText) {
      headerCell.appendChild(document.createComment(' field:subtitle '));
      const p = document.createElement('p');
      p.textContent = subText;
      headerCell.appendChild(p);
    }
  }
  cells.push([headerCell]);

  // Rows 2+: One row per channel logo item
  // Each row has columns matching channel-logos-item fields: image, name, link
  logoItems.forEach((li) => {
    const anchor = li.querySelector('a.mplus-collection__image, a');
    const img = li.querySelector('img');
    if (!img) return; // skip items without an image

    // Column 1: image (reference field)
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    const clonedImg = img.cloneNode(true);
    imageCell.appendChild(clonedImg);

    // Column 2: name (string field - extracted from img alt attribute)
    // "name" does not end with a collapsed suffix, so it gets its own column
    const nameCell = document.createDocumentFragment();
    const channelName = (img.getAttribute('alt') || img.getAttribute('title') || '').replace(/^Logo del Canal\s*/i, '').trim();
    if (channelName) {
      nameCell.appendChild(document.createComment(' field:name '));
      nameCell.appendChild(document.createTextNode(channelName));
    }

    // Column 3: link (aem-content field)
    const linkCell = document.createDocumentFragment();
    const href = anchor ? anchor.getAttribute('href') : '';
    if (href) {
      linkCell.appendChild(document.createComment(' field:link '));
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = href;
      linkCell.appendChild(a);
    }

    cells.push([imageCell, nameCell, linkCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'channel-logos', cells });
  element.replaceWith(block);
}
