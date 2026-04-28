/* eslint-disable */
/* global WebImporter */

/**
 * Parser: faq-accordion
 * Base block: faq-accordion
 * Source: https://www.movistarplus.es/
 * Generated: 2026-04-28
 *
 * Extracts an FAQ accordion section with a heading and expandable Q&A items.
 * Source structure:
 *   section.mplus-accordion > div.wrapper >
 *     div.section-header > h2.section-header__title  (heading)
 *     ul > li.mplus-accordion__question              (items, repeated)
 *       h3.mplus-accordion__title                    (question)
 *       div.mplus-accordion__content                 (answer richtext)
 *
 * UE model (xwalk):
 *   faq-accordion        -> heading (string), singleOpen (select)
 *   faq-accordion-item   -> question (string), answer (richtext), defaultOpen (boolean)
 *
 * Container block: heading is a block-level row, each FAQ item is a child row
 * with question (col 1) and answer (col 2).
 */
export default function parse(element, { document }) {
  // --- Extract heading ---
  const heading = element.querySelector(
    'h2.section-header__title, .section-header h2, h2[class*="title"], h2'
  );

  // --- Extract FAQ items ---
  const items = Array.from(
    element.querySelectorAll(
      'li.mplus-accordion__question, li[class*="accordion__question"]'
    )
  );

  // --- Build cells array ---
  // Row 1: heading (block-level field)
  const cells = [];

  if (heading) {
    const headingFrag = document.createDocumentFragment();
    headingFrag.appendChild(document.createComment(' field:heading '));
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    headingFrag.appendChild(h2);
    cells.push([headingFrag]);
  }

  // Remaining rows: one per FAQ item (container children)
  // Each row has two columns: question, answer
  for (const item of items) {
    const questionEl = item.querySelector(
      'h3.mplus-accordion__title, h3[class*="accordion__title"], h3'
    );
    const answerEl = item.querySelector(
      'div.mplus-accordion__content, div[class*="accordion__content"]'
    );

    // Column 1: question
    const questionFrag = document.createDocumentFragment();
    questionFrag.appendChild(document.createComment(' field:question '));
    if (questionEl) {
      questionFrag.appendChild(questionEl);
    }

    // Column 2: answer (richtext — preserve inner HTML structure)
    const answerFrag = document.createDocumentFragment();
    answerFrag.appendChild(document.createComment(' field:answer '));
    if (answerEl) {
      // Move all child nodes from the answer container into the fragment
      while (answerEl.firstChild) {
        answerFrag.appendChild(answerEl.firstChild);
      }
    }

    cells.push([questionFrag, answerFrag]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'faq-accordion',
    cells,
  });

  element.replaceWith(block);
}
