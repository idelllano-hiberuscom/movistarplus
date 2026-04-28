/* eslint-disable */
/* global WebImporter */

/**
 * Parser for promo-band
 * Base block: promo-band
 * Source: https://www.movistarplus.es/
 * Generated: 2026-04-28
 *
 * Horizontal promotional banner strip.
 * Two source DOM patterns mapped to the same UE model:
 *
 *   1. "with-image" (section.mplus-cintillo.mplus-cintillo--with-image):
 *      - Background image: section > img (direct child, outside .wrapper)
 *      - Icon/logo: .mplus-cintillo__image picture > img
 *      - Text with link: .mplus-cintillo__text (inline text + a.mplus-cintillo__link)
 *
 *   2. "plain" (section.mplus-price):
 *      - No background image
 *      - No icon
 *      - Text content: section-header h2 + price display + CTA button + supporting text
 *
 * UE Model fields (from _promo-band.json):
 *   variant         - select: "with-image" | "plain"
 *   backgroundImage - reference (decorative bg image; backgroundImageAlt collapsed)
 *   icon            - reference (icon/logo; iconAlt collapsed)
 *   text            - text with embedded link
 */
export default function parse(element, { document }) {
  // --- Determine variant based on DOM class ---
  // Validated: mplus-cintillo--with-image class on section for image variant
  // Validated: mplus-price class on section for plain/price variant
  const isCintillo = element.classList.contains('mplus-cintillo');
  const isPrice = element.classList.contains('mplus-price');
  const hasImageVariant = element.classList.contains('mplus-cintillo--with-image');
  const variantValue = hasImageVariant ? 'with-image' : 'plain';

  // --- Build cells matching UE model (simple block: 1 col, 4 rows) ---
  const cells = [];

  // Row 1: variant
  const variantFrag = document.createDocumentFragment();
  variantFrag.appendChild(document.createComment(' field:variant '));
  variantFrag.appendChild(document.createTextNode(variantValue));
  cells.push([variantFrag]);

  // Row 2: backgroundImage (only for cintillo with-image variant)
  // Validated: direct child <img> of <section> is the background image
  const bgFrag = document.createDocumentFragment();
  if (isCintillo) {
    const bgImage = element.querySelector(':scope > img');
    if (bgImage) {
      bgFrag.appendChild(document.createComment(' field:backgroundImage '));
      bgFrag.appendChild(bgImage.cloneNode(true));
    }
  }
  cells.push([bgFrag]);

  // Row 3: icon (only for cintillo variant)
  // Validated: .mplus-cintillo__image contains <picture><img> with alt/title
  const iconFrag = document.createDocumentFragment();
  if (isCintillo) {
    const iconPicture = element.querySelector('.mplus-cintillo__image picture');
    const iconImg = element.querySelector('.mplus-cintillo__image img');
    if (iconPicture || iconImg) {
      iconFrag.appendChild(document.createComment(' field:icon '));
      if (iconPicture) {
        iconFrag.appendChild(iconPicture.cloneNode(true));
      } else {
        iconFrag.appendChild(iconImg.cloneNode(true));
      }
    }
  }
  cells.push([iconFrag]);

  // Row 4: text
  const textFrag = document.createDocumentFragment();
  if (isCintillo) {
    // Validated: .mplus-cintillo__text has inline text + <a class="mplus-cintillo__link">
    const textEl = element.querySelector('.mplus-cintillo__text');
    if (textEl) {
      textFrag.appendChild(document.createComment(' field:text '));
      Array.from(textEl.childNodes).forEach((node) => {
        textFrag.appendChild(node.cloneNode(true));
      });
    }
  } else if (isPrice) {
    // Validated selectors for mplus-price variant:
    //   h2.section-header__title  -> "Me interesa"
    //   .mplus-price__number span.mplus-price__number -> "9"
    //   span.mplus-price__decimals -> ",99EUR"
    //   span.mplus-price__text -> "MES imp. incl."
    //   a.mplus-button -> "Suscribirme ahora"
    //   .mplus-price__link p -> "Precio final. Sin permanencia."
    const heading = element.querySelector('.section-header__title');
    const priceNumber = element.querySelector('.mplus-price__box .mplus-price__number span.mplus-price__number');
    const priceDecimals = element.querySelector('.mplus-price__box .mplus-price__decimals');
    const priceText = element.querySelector('.mplus-price__box .mplus-price__text');
    const ctaButton = element.querySelector('a.mplus-button');
    const supportText = element.querySelector('.mplus-price__link p');

    // Build composite text content for the text field
    const hasContent = heading || priceNumber || ctaButton;
    if (hasContent) {
      textFrag.appendChild(document.createComment(' field:text '));

      if (heading) {
        const h = document.createElement('h2');
        h.textContent = heading.textContent.trim();
        textFrag.appendChild(h);
      }

      // Price line: combine number + decimals + unit text
      if (priceNumber || priceDecimals) {
        const priceLine = document.createElement('p');
        let priceStr = '';
        if (priceNumber) priceStr += priceNumber.textContent.trim();
        if (priceDecimals) priceStr += priceDecimals.textContent.trim();
        if (priceText) priceStr += ' ' + priceText.textContent.trim();
        priceLine.textContent = priceStr;
        textFrag.appendChild(priceLine);
      }

      if (ctaButton) {
        textFrag.appendChild(ctaButton.cloneNode(true));
      }

      if (supportText) {
        const sp = document.createElement('p');
        sp.textContent = supportText.textContent.trim();
        textFrag.appendChild(sp);
      }
    }
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'promo-band', cells });
  element.replaceWith(block);
}
