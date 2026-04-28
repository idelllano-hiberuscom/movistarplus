/* eslint-disable */
/* global WebImporter */

/**
 * Parser for content-carousel variant.
 * Base block: content-carousel (container block with content-carousel-item children).
 * Source: https://www.movistarplus.es/
 * Generated: 2026-04-28
 *
 * UE Model (content-carousel parent fields):
 *   heading (text) - section heading
 *   subtitle (text) - optional subtitle
 *   variant, itemsPerView, showArrows, autoplay, autoplayInterval - config (not imported)
 *
 * UE Model (content-carousel-item fields per card):
 *   image (reference) + imageAlt (collapsed into img alt)
 *   caption (text) - date/label text below image
 *   link (aem-content) - destination URL wrapping the image
 *   cardVariant, rowSpan, colSpan - config (not imported as content)
 *   editorialLabel, editorialHeading, editorialBody, ctaText, cta - editorial variant (not in source)
 *
 * Source DOM structure:
 *   section.mplus-collection.mplus-collection__horizontal
 *     .wrapper > .section-header > h2.section-header__title  --> heading
 *     .wrapper > .mplus-collection__content > ul > li        --> each carousel item
 *       li > .mplus-collection__image > a[href] > img        --> image + link (when linked)
 *       li > .mplus-collection__image > img                  --> image (when not linked)
 *       li > .mplus-collection__text > p                     --> caption
 */
export default function parse(element, { document }) {
  // --- Extract parent-level heading ---
  // Validated selector: h2.section-header__title inside .section-header
  const headingEl = element.querySelector('h2.section-header__title, .section-header h2');
  const headingText = headingEl ? headingEl.textContent.trim() : '';

  // --- Extract carousel items ---
  // Validated selector: ul > li inside .mplus-collection__content
  const items = element.querySelectorAll('.mplus-collection__content ul > li');

  const cells = [];

  items.forEach((item) => {
    // 1. image: .mplus-collection__image img
    //    imageAlt is a collapsed field -- its value lives in the img alt attribute
    const imgContainer = item.querySelector('.mplus-collection__image');
    const img = imgContainer ? imgContainer.querySelector('img') : null;

    // 2. link: .mplus-collection__image a[href]
    //    Some items wrap the image in an <a>, some do not
    const linkEl = imgContainer ? imgContainer.querySelector('a[href]') : null;

    // 3. caption: .mplus-collection__text p
    const captionP = item.querySelector('.mplus-collection__text p');

    // --- Build cells for this item row ---
    // Container block: each item = one row, item model fields = columns
    // Column order follows content-carousel-item model fields (excluding collapsed and config):
    // image | caption | link

    // image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      // Preserve img with alt attribute (imageAlt is collapsed into it)
      const pic = document.createElement('picture');
      const clonedImg = img.cloneNode(true);
      // Filter out data:image SVG sources (carousel navigation icons)
      const src = clonedImg.getAttribute('src') || '';
      if (!src.startsWith('data:image/svg')) {
        pic.appendChild(clonedImg);
        imageCell.appendChild(pic);
      }
    }

    // caption cell with field hint
    const captionCell = document.createDocumentFragment();
    captionCell.appendChild(document.createComment(' field:caption '));
    if (captionP) {
      captionCell.appendChild(document.createTextNode(captionP.textContent.trim()));
    }

    // link cell with field hint
    const linkCell = document.createDocumentFragment();
    linkCell.appendChild(document.createComment(' field:link '));
    if (linkEl) {
      const a = document.createElement('a');
      a.href = linkEl.getAttribute('href') || '';
      a.textContent = linkEl.getAttribute('title') || linkEl.textContent.trim() || a.href;
      linkCell.appendChild(a);
    }

    cells.push([imageCell, captionCell, linkCell]);
  });

  // Create the block table (items only -- container block pattern)
  const block = WebImporter.Blocks.createBlock(document, { name: 'content-carousel', cells });

  // Place heading before the block as default content so it becomes
  // the parent model's "heading" field during xwalk authoring
  if (headingText) {
    const h2 = document.createElement('h2');
    h2.textContent = headingText;
    const wrapper = document.createDocumentFragment();
    wrapper.appendChild(h2);
    wrapper.appendChild(block);
    element.replaceWith(wrapper);
  } else {
    element.replaceWith(block);
  }
}
