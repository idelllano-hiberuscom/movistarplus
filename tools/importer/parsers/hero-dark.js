/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-dark
 * Base block: hero
 * Source: https://www.movistarplus.es/
 * Selectors: section#m64ba88277f47881e2325be36, section#m66191b04c349885e443e0cf2
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Generated: 2026-04-28
 *
 * Source DOM structure:
 *   section.mplus-collection.mplus-collection--highlight
 *     .mplus-collection__image img        -> hero image
 *     p.mplus-collection__subtitle        -> subtitle text
 *     h2.mplus-collection__title          -> heading
 *     .mplus-collection__text p           -> description paragraphs
 *     a.mplus-button                      -> CTA button
 *
 * Target table (2 rows, simple block per UE model):
 *   Row 1: image       (field:image)
 *   Row 2: richtext    (field:text) — subtitle + heading + description + CTA
 */
export default function parse(element, { document }) {
  // --- Extract image ---
  const image = element.querySelector('.mplus-collection__image img, .mplus-collection__image picture, img');

  // --- Extract text content elements ---
  const subtitle = element.querySelector('p.mplus-collection__subtitle, .mplus-collection__subtitle');
  const heading = element.querySelector('h2.mplus-collection__title, h1.mplus-collection__title, .mplus-collection__title, h2, h1');
  const descriptionContainer = element.querySelector('.mplus-collection__text');
  const descriptionParagraphs = descriptionContainer
    ? Array.from(descriptionContainer.querySelectorAll('p'))
    : [];
  const ctaLink = element.querySelector('a.mplus-button, a.mplus-cta, .mplus-collection__info > a, a[class*="button"]');

  // --- Row 1: Image with field hint ---
  const imageCell = [];
  if (image) {
    const imageHint = document.createComment(' field:image ');
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(imageHint);
    // Use the picture element if available for responsive images, else img
    const pictureEl = image.closest('picture') || image;
    imageFrag.appendChild(pictureEl);
    imageCell.push(imageFrag);
  }

  // --- Row 2: Text (richtext) with field hint ---
  // Combine subtitle, heading, description paragraphs, and CTA into one richtext cell
  const textFrag = document.createDocumentFragment();
  const textHint = document.createComment(' field:text ');
  textFrag.appendChild(textHint);

  if (subtitle) {
    textFrag.appendChild(subtitle);
  }

  if (heading) {
    textFrag.appendChild(heading);
  }

  descriptionParagraphs.forEach((p) => {
    textFrag.appendChild(p);
  });

  if (ctaLink) {
    // Wrap CTA in a paragraph for proper richtext structure
    const ctaParagraph = document.createElement('p');
    const ctaStrong = document.createElement('strong');
    ctaStrong.appendChild(ctaLink);
    ctaParagraph.appendChild(ctaStrong);
    textFrag.appendChild(ctaParagraph);
  }

  const textCell = [textFrag];

  // --- Build cells array matching UE model (2 rows) ---
  const cells = [];

  // Row 1: image (always present even if empty for xwalk model compliance)
  cells.push(imageCell);

  // Row 2: text (richtext with subtitle + heading + description + CTA)
  cells.push(textCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-dark', cells });
  element.replaceWith(block);
}
