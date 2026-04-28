/* eslint-disable */
/* global WebImporter */

/**
 * Parser: feature-icons-band
 * Base block: feature-icons
 * Source: https://www.movistarplus.es/
 * Description: Row of 4 benefit items each with icon image, title heading, and description text.
 * UE Model: Container block - parent (heading, subtitle) + items (icon, iconAlt, heading, body)
 * Generated: 2026-04-28
 */
export default function parse(element, { document }) {
  // --- Extract optional parent-level heading/subtitle (not present in source but model supports it) ---
  const sectionHeading = element.querySelector(':scope > h2, :scope > .wrapper > h2');
  const sectionSubtitle = sectionHeading
    ? sectionHeading.nextElementSibling && sectionHeading.nextElementSibling.matches('p')
      ? sectionHeading.nextElementSibling
      : null
    : null;

  // --- Extract all benefit items ---
  // Source uses li.mplus-benefits__box inside ul.mplus-benefits__container
  const items = Array.from(element.querySelectorAll('li.mplus-benefits__box, .mplus-benefits__box'));

  const cells = [];

  // --- Build one row per item (container block pattern) ---
  // Each row has 3 columns: icon, heading, body
  // Field hints are mandatory for xwalk (skip iconAlt - collapsed field ending in "Alt")
  items.forEach((item) => {
    // Icon image - validated selector: div.mplus-benefits__image > img
    const iconImg = item.querySelector('.mplus-benefits__image img, img');

    // Title heading - validated selector: h3.mplus-benefits__boxtitle
    const heading = item.querySelector('h3.mplus-benefits__boxtitle, h3, [class*="boxtitle"]');

    // Description text - validated selector: div.mplus-benefits__boxtext p
    const body = item.querySelector('.mplus-benefits__boxtext p, .mplus-benefits__boxtext, p');

    // Build icon cell with field hint
    const iconCell = document.createDocumentFragment();
    if (iconImg) {
      iconCell.appendChild(document.createComment(' field:icon '));
      iconCell.appendChild(iconImg);
    }

    // Build heading cell with field hint
    const headingCell = document.createDocumentFragment();
    if (heading) {
      headingCell.appendChild(document.createComment(' field:heading '));
      headingCell.appendChild(heading);
    }

    // Build body cell with field hint
    const bodyCell = document.createDocumentFragment();
    if (body) {
      bodyCell.appendChild(document.createComment(' field:body '));
      bodyCell.appendChild(body);
    }

    // Each item row: [icon, heading, body]
    cells.push([iconCell, headingCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'feature-icons-band',
    cells,
  });

  element.replaceWith(block);
}
