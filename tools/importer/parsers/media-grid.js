/* eslint-disable */
/* global WebImporter */

/**
 * Parser for media-grid
 * Base block: media
 * Source: https://www.movistarplus.es/
 * Generated: 2026-04-28
 *
 * Mosaic grid of content poster images in mixed sizes with links to detail pages.
 * Each item has an image (with square/horizontal/vertical variants), an optional title,
 * and a link. The first list item may be a text-only editorial cell.
 *
 * UE model (xwalk):
 *   media-grid (parent)  -> heading
 *   media-grid-cell (child) -> cell, title, body, cta (ctaText collapsed), image (imageAlt collapsed), link, rowSpan, colSpan
 *
 * Source DOM structure:
 *   section.mplus-mosaic > div.wrapper > ul.mplus-mosaic__grid > li
 *     - li.no-images  -> text cell: .pretitle, p.title, .descriptcion, a.mplus-button
 *     - li (normal)   -> image cell: a[href] > img.mplus-mosaic-image-*, p.title
 */
export default function parse(element, { document }) {
  // --- Extract optional section heading (parent model field: heading) ---
  // Some instances may have an h2/h3 heading above the grid
  const sectionHeading = element.querySelector(':scope > h2, :scope > h3, :scope > .wrapper > h2, :scope > .wrapper > h3');

  // --- Collect all grid items ---
  const gridItems = Array.from(element.querySelectorAll('ul.mplus-mosaic__grid > li'));

  // --- Build cells array: one row per grid item ---
  const cells = [];

  gridItems.forEach((li) => {
    const isTextCell = li.classList.contains('no-images');

    if (isTextCell) {
      // --- Text/editorial cell ---
      const pretitle = li.querySelector('.pretitle');
      const title = li.querySelector('p.title');
      const bodyEl = li.querySelector('.descriptcion');
      const ctaLink = li.querySelector('a.mplus-button');

      // cell type
      const cellFrag = document.createDocumentFragment();
      cellFrag.appendChild(document.createComment(' field:cell '));
      const cellText = document.createTextNode('text');
      cellFrag.appendChild(cellText);

      // title: combine pretitle + title if both exist
      const titleFrag = document.createDocumentFragment();
      titleFrag.appendChild(document.createComment(' field:title '));
      if (pretitle) {
        titleFrag.appendChild(pretitle.cloneNode(true));
      }
      if (title) {
        titleFrag.appendChild(title.cloneNode(true));
      }

      // body
      const bodyFrag = document.createDocumentFragment();
      if (bodyEl) {
        bodyFrag.appendChild(document.createComment(' field:body '));
        bodyFrag.appendChild(bodyEl.cloneNode(true));
      }

      // cta (link) - ctaText is collapsed into the link text
      const ctaFrag = document.createDocumentFragment();
      if (ctaLink) {
        ctaFrag.appendChild(document.createComment(' field:cta '));
        ctaFrag.appendChild(ctaLink.cloneNode(true));
      }

      // image - empty for text cells
      const imageFrag = document.createDocumentFragment();

      // link - empty for text cells (CTA serves as the link)
      const linkFrag = document.createDocumentFragment();

      // rowSpan - text cells typically span 2 rows
      const rowSpanFrag = document.createDocumentFragment();
      rowSpanFrag.appendChild(document.createComment(' field:rowSpan '));
      rowSpanFrag.appendChild(document.createTextNode('2'));

      // colSpan - text cells typically span 1 column
      const colSpanFrag = document.createDocumentFragment();
      colSpanFrag.appendChild(document.createComment(' field:colSpan '));
      colSpanFrag.appendChild(document.createTextNode('1'));

      cells.push([cellFrag, titleFrag, bodyFrag, ctaFrag, imageFrag, linkFrag, rowSpanFrag, colSpanFrag]);
    } else {
      // --- Image cell ---
      const link = li.querySelector('a');
      const href = link ? link.getAttribute('href') : '';

      // Pick the first available image (prefer horizontal, fall back to square/vertical)
      const img = li.querySelector('img.mplus-mosaic-image-horizontal')
        || li.querySelector('img.mplus-mosaic-image-square')
        || li.querySelector('img.mplus-mosaic-image-vertical')
        || li.querySelector('img');

      const title = li.querySelector('p.title');

      // Determine grid sizing from image class
      // horizontal = wide (2 cols, 1 row), vertical = tall (1 col, 2 rows), square = 1x1
      let rowSpan = '1';
      let colSpan = '1';
      if (img) {
        if (img.classList.contains('mplus-mosaic-image-horizontal')) {
          colSpan = '2';
          rowSpan = '1';
        } else if (img.classList.contains('mplus-mosaic-image-vertical')) {
          colSpan = '1';
          rowSpan = '2';
        }
        // square stays 1x1
      }

      // cell type
      const cellFrag = document.createDocumentFragment();
      cellFrag.appendChild(document.createComment(' field:cell '));
      cellFrag.appendChild(document.createTextNode('image'));

      // title
      const titleFrag = document.createDocumentFragment();
      if (title) {
        titleFrag.appendChild(document.createComment(' field:title '));
        titleFrag.appendChild(title.cloneNode(true));
      }

      // body - empty for image cells
      const bodyFrag = document.createDocumentFragment();

      // cta - empty for image cells
      const ctaFrag = document.createDocumentFragment();

      // image - imageAlt is collapsed (not hinted separately)
      const imageFrag = document.createDocumentFragment();
      if (img) {
        imageFrag.appendChild(document.createComment(' field:image '));
        const imgClone = img.cloneNode(true);
        // Clean up mosaic-specific classes
        imgClone.removeAttribute('class');
        imageFrag.appendChild(imgClone);
      }

      // link
      const linkFrag = document.createDocumentFragment();
      if (href) {
        linkFrag.appendChild(document.createComment(' field:link '));
        const linkEl = document.createElement('a');
        linkEl.setAttribute('href', href);
        linkEl.textContent = title ? title.textContent : href;
        linkFrag.appendChild(linkEl);
      }

      // rowSpan
      const rowSpanFrag = document.createDocumentFragment();
      rowSpanFrag.appendChild(document.createComment(' field:rowSpan '));
      rowSpanFrag.appendChild(document.createTextNode(rowSpan));

      // colSpan
      const colSpanFrag = document.createDocumentFragment();
      colSpanFrag.appendChild(document.createComment(' field:colSpan '));
      colSpanFrag.appendChild(document.createTextNode(colSpan));

      cells.push([cellFrag, titleFrag, bodyFrag, ctaFrag, imageFrag, linkFrag, rowSpanFrag, colSpanFrag]);
    }
  });

  // If there is a section heading, prepend it as default content before the block
  if (sectionHeading) {
    element.parentNode.insertBefore(sectionHeading.cloneNode(true), element);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'media-grid', cells });
  element.replaceWith(block);
}
