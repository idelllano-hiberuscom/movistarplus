/* eslint-disable */
/* global WebImporter */

/**
 * Parser: plan-selector
 * Base block: plan-selector
 * Source: https://www.movistarplus.es/
 * Selector: section#m698c45f5c349880b3c5d4f69
 * UE Model: Container block
 *   - Block-level (plan-selector): heading
 *   - Item-level (plan-selector-item): title, features, priceInteger, priceDecimals,
 *     period, taxLabel, priceFootnote, cta (ctaText collapsed), badge (badgeAlt collapsed), featured
 * Generated: 2026-04-28
 *
 * Source DOM structure:
 *   section.mplus-tarifas
 *     h2.mplus-hero-info__title                    -> section heading ("Elige tu plan")
 *     .mplus-hero-info__containerDetails
 *       .mplus-hero-info__details (x3)             -> plan cards
 *         .mplus-hero-info__icon img               -> badge image (optional)
 *         h3.mplus-hero-info__titlebox             -> plan title
 *         ul > li                                  -> feature list
 *         .mplus-hero-price__number span           -> price integer
 *         .mplus-hero-price__decimals              -> price decimals + currency
 *         .mplus-hero-price__temp                  -> billing period
 *         .mplus-hero-price__imp                   -> tax label
 *         .mplus-hero-price__text                  -> price footnote text
 *         .mplus-hero-info__cta a                  -> CTA link
 *         --light / --border modifier              -> featured vs standard
 *
 * Target table (container block):
 *   Row 0 (block-level): heading
 *   Row 1..N (item rows, 10 cols each):
 *     title | features | priceInteger | priceDecimals | period | taxLabel | priceFootnote | cta | badge | featured
 */
export default function parse(element, { document }) {
  // --- Block-level field: heading ---
  const heading = element.querySelector('h2.mplus-hero-info__title, h2, h1');

  // --- Extract plan card items ---
  const cards = Array.from(
    element.querySelectorAll('.mplus-hero-info__details')
  );

  const cells = [];

  // --- Row 0: Block-level heading (single column) ---
  const headingFrag = document.createDocumentFragment();
  if (heading) {
    headingFrag.appendChild(document.createComment(' field:heading '));
    headingFrag.appendChild(heading);
  }
  cells.push([headingFrag]);

  // --- Item rows: one row per plan card ---
  cards.forEach((card) => {
    // 1. title (h3.mplus-hero-info__titlebox)
    const titleEl = card.querySelector('h3.mplus-hero-info__titlebox, h3, [class*="titlebox"]');
    const titleFrag = document.createDocumentFragment();
    if (titleEl) {
      titleFrag.appendChild(document.createComment(' field:title '));
      titleFrag.appendChild(titleEl);
    }

    // 2. features (ul with li items — richtext)
    const featuresList = card.querySelector('.mplus-hero-info__list ul, ul');
    const featuresFrag = document.createDocumentFragment();
    if (featuresList) {
      featuresFrag.appendChild(document.createComment(' field:features '));
      featuresFrag.appendChild(featuresList);
    }

    // 3. priceInteger (.mplus-hero-price__number span)
    const priceIntegerEl = card.querySelector('.mplus-hero-price__number span, .mplus-hero-price__number');
    const priceIntegerFrag = document.createDocumentFragment();
    if (priceIntegerEl) {
      priceIntegerFrag.appendChild(document.createComment(' field:priceInteger '));
      priceIntegerFrag.appendChild(priceIntegerEl);
    }

    // 4. priceDecimals (.mplus-hero-price__decimals)
    const priceDecimalsEl = card.querySelector('.mplus-hero-price__decimals');
    const priceDecimalsFrag = document.createDocumentFragment();
    if (priceDecimalsEl) {
      priceDecimalsFrag.appendChild(document.createComment(' field:priceDecimals '));
      priceDecimalsFrag.appendChild(priceDecimalsEl);
    }

    // 5. period (.mplus-hero-price__temp)
    const periodEl = card.querySelector('.mplus-hero-price__temp');
    const periodFrag = document.createDocumentFragment();
    if (periodEl) {
      periodFrag.appendChild(document.createComment(' field:period '));
      periodFrag.appendChild(periodEl);
    }

    // 6. taxLabel (.mplus-hero-price__imp)
    const taxLabelEl = card.querySelector('.mplus-hero-price__imp');
    const taxLabelFrag = document.createDocumentFragment();
    if (taxLabelEl) {
      taxLabelFrag.appendChild(document.createComment(' field:taxLabel '));
      taxLabelFrag.appendChild(taxLabelEl);
    }

    // 7. priceFootnote (.mplus-hero-price__text) — may contain text and/or savings badge image
    const priceFootnoteEl = card.querySelector('.mplus-hero-price__text');
    const priceFootnoteFrag = document.createDocumentFragment();
    if (priceFootnoteEl) {
      priceFootnoteFrag.appendChild(document.createComment(' field:priceFootnote '));
      // Extract just the text content, not nested badge images (those belong in badge field)
      const footnoteText = priceFootnoteEl.textContent.trim();
      if (footnoteText) {
        const p = document.createElement('p');
        p.textContent = footnoteText;
        priceFootnoteFrag.appendChild(p);
      }
    }

    // 8. cta (.mplus-hero-info__cta a) — ctaText collapsed into cta
    const ctaLink = card.querySelector('.mplus-hero-info__cta a, a.mplus-button, a[class*="button"]');
    const ctaFrag = document.createDocumentFragment();
    if (ctaLink) {
      ctaFrag.appendChild(document.createComment(' field:cta '));
      ctaFrag.appendChild(ctaLink);
    }

    // 9. badge (.mplus-hero-info__icon img) — badgeAlt collapsed into badge
    const badgeImg = card.querySelector('.mplus-hero-info__icon img, .mplus-hero-info__icon picture');
    const badgeFrag = document.createDocumentFragment();
    if (badgeImg) {
      badgeFrag.appendChild(document.createComment(' field:badge '));
      const pictureEl = badgeImg.closest('picture') || badgeImg;
      badgeFrag.appendChild(pictureEl);
    }

    // 10. featured (boolean — based on card style modifier)
    // Cards with --light class are paid/featured; --border is the free/non-featured card
    const isFeatured = card.classList.contains('mplus-hero-info__details--light');
    const featuredFrag = document.createDocumentFragment();
    featuredFrag.appendChild(document.createComment(' field:featured '));
    const featuredText = document.createTextNode(isFeatured ? 'true' : 'false');
    featuredFrag.appendChild(featuredText);

    // Build item row: 10 columns matching plan-selector-item model fields
    cells.push([
      titleFrag,
      featuresFrag,
      priceIntegerFrag,
      priceDecimalsFrag,
      periodFrag,
      taxLabelFrag,
      priceFootnoteFrag,
      ctaFrag,
      badgeFrag,
      featuredFrag,
    ]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'plan-selector',
    cells,
  });

  element.replaceWith(block);
}
