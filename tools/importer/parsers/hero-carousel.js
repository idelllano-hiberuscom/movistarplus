/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-carousel container block.
 *
 * Block-level model (hero-carousel): autoplay, autoplayInterval
 * Item model (hero-carousel-item): 9 non-collapsed fields per row
 *   Collapsed fields (NOT separate columns): backgroundImageAlt, titleImageAlt, ctaText
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('li.mplus-banner__item');

  const seenBgSrcs = new Set();
  const uniqueSlides = [];
  slides.forEach((slide) => {
    const bgImg = slide.querySelector('.mplus-banner__background img');
    const src = bgImg ? bgImg.getAttribute('src') : null;
    if (src && !seenBgSrcs.has(src)) {
      seenBgSrcs.add(src);
      uniqueSlides.push(slide);
    } else if (!src) {
      uniqueSlides.push(slide);
    }
  });

  const ITEM_COL_COUNT = 9;
  const cells = [];

  // Row 0: Block-level model fields, padded to match item column count
  const autoplayCell = document.createDocumentFragment();
  autoplayCell.appendChild(document.createComment(' field:autoplay '));
  autoplayCell.appendChild(document.createTextNode('true'));

  const intervalCell = document.createDocumentFragment();
  intervalCell.appendChild(document.createComment(' field:autoplayInterval '));
  intervalCell.appendChild(document.createTextNode('5000'));

  const blockRow = [autoplayCell, intervalCell];
  while (blockRow.length < ITEM_COL_COUNT) {
    blockRow.push('');
  }
  cells.push(blockRow);

  // Item rows: 9 columns (collapsed fields folded into HTML attributes)
  uniqueSlides.forEach((slide) => {
    // backgroundImage (collapsed: backgroundImageAlt -> img alt attribute)
    const bgPicture = slide.querySelector('.mplus-banner__background picture');
    const bgImg = slide.querySelector('.mplus-banner__background img');
    const bgCell = document.createDocumentFragment();
    bgCell.appendChild(document.createComment(' field:backgroundImage '));
    if (bgPicture) {
      bgCell.appendChild(bgPicture.cloneNode(true));
    } else if (bgImg) {
      bgCell.appendChild(bgImg.cloneNode(true));
    }

    // titleImage (collapsed: titleImageAlt -> img alt attribute)
    const titleImg = slide.querySelector('.mplus-banner__info > .mplus-banner__image img');
    const titleImgCell = document.createDocumentFragment();
    titleImgCell.appendChild(document.createComment(' field:titleImage '));
    if (titleImg) {
      const pic = document.createElement('picture');
      pic.appendChild(titleImg.cloneNode(true));
      titleImgCell.appendChild(pic);
    }

    // heading
    const headingEl = slide.querySelector('h1.mplus-banner__title, h2.mplus-banner__title');
    const headingCell = document.createDocumentFragment();
    headingCell.appendChild(document.createComment(' field:heading '));
    if (headingEl) {
      headingCell.appendChild(document.createTextNode(headingEl.textContent.trim()));
    }

    // description (richtext)
    const descContainer = slide.querySelector('.mplus-banner__text');
    const descP = descContainer ? descContainer.querySelector('p') : null;
    const descCell = document.createDocumentFragment();
    descCell.appendChild(document.createComment(' field:description '));
    if (descP) {
      descCell.appendChild(descP.cloneNode(true));
    } else if (descContainer) {
      const p = document.createElement('p');
      p.innerHTML = descContainer.innerHTML;
      descCell.appendChild(p);
    }

    // priceInteger
    const priceNumberDiv = slide.querySelector('div.mplus-price__number');
    const priceIntSpan = priceNumberDiv
      ? priceNumberDiv.querySelector(':scope > span.mplus-price__number')
      : null;
    const priceIntCell = document.createDocumentFragment();
    priceIntCell.appendChild(document.createComment(' field:priceInteger '));
    if (priceIntSpan) {
      priceIntCell.appendChild(document.createTextNode(priceIntSpan.textContent.trim()));
    }

    // priceDecimal
    const priceDecSpan = slide.querySelector('span.mplus-price__decimals');
    const priceDecCell = document.createDocumentFragment();
    priceDecCell.appendChild(document.createComment(' field:priceDecimal '));
    if (priceDecSpan) {
      priceDecCell.appendChild(document.createTextNode(priceDecSpan.textContent.trim()));
    }

    // priceSuffix
    const priceSuffixSpan = slide.querySelector('span.mplus-price__text');
    const priceSuffixCell = document.createDocumentFragment();
    priceSuffixCell.appendChild(document.createComment(' field:priceSuffix '));
    if (priceSuffixSpan) {
      priceSuffixCell.appendChild(document.createTextNode(priceSuffixSpan.textContent.trim()));
    }

    // cta (collapsed: ctaText -> link text content)
    const ctaLink = slide.querySelector('a.mplus-button');
    const ctaCell = document.createDocumentFragment();
    ctaCell.appendChild(document.createComment(' field:cta '));
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.getAttribute('href') || '';
      a.textContent = ctaLink.textContent.trim();
      ctaCell.appendChild(a);
    }

    // disclaimer
    const disclaimerP = slide.querySelector('.mplus-price__link p');
    const disclaimerCell = document.createDocumentFragment();
    disclaimerCell.appendChild(document.createComment(' field:disclaimer '));
    if (disclaimerP) {
      disclaimerCell.appendChild(document.createTextNode(disclaimerP.textContent.trim()));
    }

    cells.push([bgCell, titleImgCell, headingCell, descCell, priceIntCell, priceDecCell, priceSuffixCell, ctaCell, disclaimerCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-carousel', cells });
  element.replaceWith(block);
}
