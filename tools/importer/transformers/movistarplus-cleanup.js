/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Movistar Plus+ site-wide cleanup.
 * Removes non-authorable content from the DOM before and after block parsing.
 * All selectors verified against captured DOM at migration-work/cleaned.html.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // OneTrust cookie consent SDK (banner, overlay, preference center)
    // Found in DOM: <div id="onetrust-consent-sdk"> (line 3342)
    // Contains: .onetrust-pc-dark-filter, #onetrust-banner-sdk, preference center
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
    ]);

    // Carousel navigation UI elements (not authorable, JS-driven)
    // Found in DOM: <div class="carousel-indicators"> (lines 509, 1143, etc.)
    // Found in DOM: <button class="carousel-prev"> / <button class="carousel-next">
    WebImporter.DOMUtils.remove(element, [
      '.carousel-indicators',
      '.carousel-prev',
      '.carousel-next',
    ]);

    // Empty anchor divs used for scroll targeting (19 instances)
    // Found in DOM: <div class="anchor"> (e.g. line 91)
    element.querySelectorAll('div.anchor').forEach((el) => {
      if (!el.textContent.trim()) {
        el.remove();
      }
    });
  }

  if (hookName === 'afterTransform') {
    // Site header with logo, navigation menu, search, login/subscribe buttons
    // Found in DOM: <header class="mplus-header scrolled"> (line 4)
    WebImporter.DOMUtils.remove(element, ['header.mplus-header']);

    // Site footer with section links, legal, social media links
    // Found in DOM: <footer class="mplus-footer"> (line 3056)
    WebImporter.DOMUtils.remove(element, ['footer.mplus-footer']);

    // Tracking pixel container and ad/retargeting iframes
    // Found in DOM: <div id="m20D"> containing doubleclick iframe (line 3597)
    // Found in DOM: <iframe src="https://www.mainadv.com/..."> (line 3595)
    WebImporter.DOMUtils.remove(element, [
      '#m20D',
      'iframe[src*="mainadv.com"]',
      'iframe[src*="doubleclick.net"]',
      'iframe.ot-text-resize',
    ]);

    // Remove <source> elements inside <picture> tags (browser-specific srcset, not authorable)
    // Found in DOM: 24 <source> elements within <picture> tags
    element.querySelectorAll('picture > source').forEach((el) => el.remove());

    // Remove <noscript> tags (fallback content, not authorable)
    WebImporter.DOMUtils.remove(element, ['noscript']);

    // Remove <link> elements (stylesheet/preload references, not authorable)
    WebImporter.DOMUtils.remove(element, ['link']);
  }
}
