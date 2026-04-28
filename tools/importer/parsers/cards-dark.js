/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-dark
 * Base block: cards
 * Source: https://www.movistarplus.es/
 * Selectors: section#m681cbc65c3498813c315f6bc, section#m6938329bc349884fd4145182
 * UE Model: container block "cards" with child "card" items
 * UE Model fields per card: image (reference), text (richtext)
 * Collapsed fields: imageAlt (Alt suffix)
 * Generated: 2026-04-28
 *
 * Source DOM structure:
 *   section.mplus-collection.mplus-collection__vertical
 *     .wrapper
 *       .section-header
 *         h2.section-header__title          -> section heading (not part of cards block)
 *         .section-header__text p           -> section description (not part of cards block)
 *       .mplus-collection__content ul
 *         li
 *           .mplus-collection__image
 *             a[href][title]
 *               img[src][alt][title]        -> card image with link
 *
 * Target table (container block, N rows = N cards):
 *   Each row = 1 card with 2 columns:
 *     Column 1: image  (field:image)
 *     Column 2: text   (field:text) — link with card title as anchor text
 */
export default function parse(element, { document }) {
  // --- Extract card items from the list ---
  const cardItems = Array.from(
    element.querySelectorAll(
      '.mplus-collection__content ul > li, .mplus-collection__content > ul > li'
    )
  );

  // --- Build cells: one row per card (container block) ---
  const cells = [];

  cardItems.forEach((li) => {
    // Extract image
    const img = li.querySelector('.mplus-collection__image img, img');
    const link = li.querySelector('.mplus-collection__image a, a');

    // Column 1: image with field hint
    const imageFrag = document.createDocumentFragment();
    const imageHint = document.createComment(' field:image ');
    imageFrag.appendChild(imageHint);
    if (img) {
      const pictureEl = img.closest('picture') || img;
      imageFrag.appendChild(pictureEl);
    }

    // Column 2: text (richtext) with field hint
    // Use the link title/alt as card text; wrap in a link to preserve the href
    const textFrag = document.createDocumentFragment();
    const textHint = document.createComment(' field:text ');
    textFrag.appendChild(textHint);

    if (link) {
      const cardTitle = link.getAttribute('title')
        || (img && img.getAttribute('alt'))
        || '';
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href') || '#');
      if (link.getAttribute('title')) {
        a.setAttribute('title', link.getAttribute('title'));
      }
      a.textContent = cardTitle;
      const p = document.createElement('p');
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-dark', cells });
  element.replaceWith(block);
}
