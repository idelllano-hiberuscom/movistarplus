/**
 * FAQ Accordion Block — AEM Edge Delivery Services
 *
 * Figma reference: faq-accordion-instructions.md
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: ✅ Completado (Fase 3)
 * QA audit: ✅ Validado (10/10 checks passed)
 *
 * DOM de entrada (matriz EDS):
 *   block.faq-accordion
 *     ├── div (fila 0: heading)
 *     │     └── div > <p>Preguntas frecuentes</p>
 *     ├── div (fila 1: config)
 *     │     └── div > <p>single-open | multi-open</p>
 *     └── div (fila 2..N: items)
 *           ├── div (col 0: question text)
 *           ├── div (col 1: answer richtext, múltiples <p>)
 *           └── div (col 2: defaultOpen flag "true"/"false"/vacío)
 *
 * Toggle nativo via <details>/<summary>. CERO JS para abrir/cerrar.
 * Solo se añade listener si el modo es single-open (cierra los demás al abrir uno).
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

const CHEVRON_SVG = '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 5l6 5-6 5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export default function decorate(block) {
  // 1. Cache filas ANTES de mutar
  const rows = [...block.children];
  if (rows.length < 2) return;

  const headingRow = rows[0];
  const configRow = rows[1];
  const itemRows = rows.slice(2);

  // 2. Wrapper interno
  const inner = document.createElement('div');
  inner.classList.add('faq-accordion__inner');

  // 3. Heading (fila 0)
  const h2 = document.createElement('h2');
  h2.classList.add('faq-accordion__heading');
  h2.textContent = headingRow.textContent.trim();
  h2.dataset.aueProp = 'heading';
  h2.dataset.aueType = 'text';
  h2.dataset.aueLabel = 'Encabezado de la sección';
  moveInstrumentation(headingRow, h2);
  inner.append(h2);

  // 4. Config (fila 1) → list wrapper con data-mode
  const rawMode = configRow.textContent.trim().toLowerCase();
  const mode = rawMode === 'single-open' ? 'single-open' : 'multi-open';

  const listDiv = document.createElement('div');
  listDiv.classList.add('faq-accordion__list');
  listDiv.dataset.mode = mode;
  listDiv.dataset.aueProp = 'singleOpen';
  listDiv.dataset.aueType = 'text';
  listDiv.dataset.aueLabel = 'Modo de apertura';
  moveInstrumentation(configRow, listDiv);

  // 5. Items (filas 2+)
  itemRows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const details = document.createElement('details');
    details.classList.add('faq-accordion__item');

    // defaultOpen flag (col 2)
    if (cols[2] && cols[2].textContent.trim().toLowerCase() === 'true') {
      details.setAttribute('open', '');
    }

    // Summary con question text + chevron
    const summary = document.createElement('summary');
    summary.classList.add('faq-accordion__question');

    const qText = document.createElement('span');
    qText.classList.add('faq-accordion__question-text');
    qText.textContent = cols[0].textContent.trim();
    qText.dataset.aueProp = 'question';
    qText.dataset.aueType = 'text';
    qText.dataset.aueLabel = 'Pregunta';

    const chevron = document.createElement('span');
    chevron.classList.add('faq-accordion__chevron');
    chevron.setAttribute('aria-hidden', 'true');
    chevron.innerHTML = CHEVRON_SVG;

    summary.append(qText, chevron);

    // Answer richtext (col 1) — mover children preservando <strong>, <em>, <a>...
    const answerDiv = document.createElement('div');
    answerDiv.classList.add('faq-accordion__answer');
    answerDiv.dataset.aueProp = 'answer';
    answerDiv.dataset.aueType = 'richtext';
    answerDiv.dataset.aueLabel = 'Respuesta';
    while (cols[1].firstChild) answerDiv.append(cols[1].firstChild);

    details.append(summary, answerDiv);
    moveInstrumentation(row, details);
    listDiv.append(details);
  });

  // 6. Single-open behavior: el evento toggle NO burbujea → capture phase
  if (mode === 'single-open') {
    listDiv.addEventListener('toggle', (e) => {
      if (e.target.tagName === 'DETAILS' && e.target.open) {
        listDiv.querySelectorAll('details[open]').forEach((d) => {
          if (d !== e.target) d.open = false;
        });
      }
    }, true);
  }

  inner.append(listDiv);
  block.replaceChildren(inner);
}
