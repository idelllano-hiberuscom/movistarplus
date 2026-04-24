/**
 * Feature Icons Band Block — AEM Edge Delivery Services
 *
 * Figma reference: feature-icons-band (below the fold, y=1725)
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: ✅ Completado (Fase 3 - UE & QA Specialist)
 * QA audit: ✅ Validado
 *
 * QA Changes (vs versión recibida de Fase 2):
 * - [BUG UE corregido] La versión anterior hacía `rows.forEach(row => row.remove())`,
 *   lo que descartaba los `data-aue-*` que AEM coloca por fila para identificar
 *   cada ítem. En un bloque INLINE xwalk eso rompe la edición autoral (los
 *   ítems pierden su identidad y el autor no puede reordenar/editar items
 *   existentes). Se reemplaza por el patrón estándar EDS:
 *      `moveInstrumentation(row, li)` + `block.replaceChildren(ul)`.
 *   Idéntico al patrón usado por `blocks/cards/cards.js`.
 * - [BUG UE corregido] La <img> reemplazada por `createOptimizedPicture` perdía
 *   también los `data-aue-*` del autor. Se aplica `moveInstrumentation` del
 *   <img> original al <img> optimizado.
 * - [Instrumentación UE añadida] `data-aue-prop` sobre <picture>, <h3> y <p>
 *   para edición inline de los campos `icon` / `heading` / `body` del modelo
 *   `feature-icons-band-item`. El `iconAlt` se edita en el panel lateral
 *   (no requiere instrumentación de DOM).
 * - [Sin cambios] decorate() permanece SÍNCRONA, no se introduce async.
 * - [Sin cambios] No se toca `data-block-name` / `data-block-status` del block.
 *
 * Decisión de modelo UE (alineada con la convención del repo):
 *   El root `feature-icons-band` NO tiene props editables propias (no hay
 *   título de banda ni logo). Sólo aloja items repetibles. Por eso sigue el
 *   patrón "cards" del repo: el `template` del root usa `filter` (no `model`),
 *   y sólo el item tiene un `model`. La identidad y el resource del root y
 *   de cada item los inyecta el runtime xwalk a partir del bloque inline en
 *   la página AEM (no se hardcodean rutas en el cliente).
 *
 * DOM de entrada (matriz EDS — ver feature-icons-band-instructions.md §3 ENTRADA):
 *   block.feature-icons-band
 *     └── div (fila = item N)
 *           ├── div (col 0) → <picture> icono
 *           ├── div (col 1) → <p> heading
 *           └── div (col 2) → <p> body
 *
 * DOM de salida:
 *   <ul role="list" class="feature-icons-band-list">
 *     <li class="feature-icons-band-item">
 *       <picture class="feature-icons-band-icon"><img></picture>
 *       <h3 class="feature-icons-band-heading">…</h3>
 *       <p class="feature-icons-band-body">…</p>
 *     </li>
 *     ...
 *   </ul>
 *
 * @param {Element} block - Root element of the block
 */
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // 1. Cachear filas originales antes de tocar nada.
  const rows = [...block.children];

  // 1.a. Block-level fields (orden del modelo): heading, subtitle.
  //      En xwalk, los campos del modelo del bloque se serializan como las
  //      primeras N filas. El modelo feature-icons-band tiene 2 campos.
  const BLOCK_FIELD_COUNT = 2;
  const headingText = rows[0] ? rows[0].textContent.trim() : '';
  const subtitleText = rows[1] ? rows[1].textContent.trim() : '';

  // 1.b. Contenedor raíz final
  const frag = document.createDocumentFragment();

  // Always create header (even when empty) for UE inline editing targets.
  {
    const header = document.createElement('div');
    header.classList.add('feature-icons-band-header');

    const h2 = document.createElement('h2');
    h2.classList.add('feature-icons-band-title');
    h2.textContent = headingText;
    if (rows[0]) moveInstrumentation(rows[0], h2);
    h2.dataset.aueProp = 'heading';
    h2.dataset.aueType = 'text';
    h2.dataset.aueLabel = 'Encabezado de la sección (H2)';
    header.append(h2);

    const p = document.createElement('p');
    p.classList.add('feature-icons-band-subtitle');
    if (subtitleText) p.textContent = subtitleText;
    if (rows[1]) moveInstrumentation(rows[1], p);
    p.dataset.aueProp = 'subtitle';
    p.dataset.aueType = 'text';
    p.dataset.aueLabel = 'Subtítulo descriptivo';
    header.append(p);

    frag.append(header);
  }

  // 2. Construir la nueva lista en memoria.
  const ul = document.createElement('ul');
  ul.setAttribute('role', 'list');
  ul.classList.add('feature-icons-band-list');

  const itemRows = rows.slice(BLOCK_FIELD_COUNT);
  itemRows.forEach((row) => {
    const cols = [...row.children];

    // Extraer datos crudos de las 3 columnas esperadas.
    const iconPicture = cols[0]?.querySelector('picture') || null;
    const itemHeadingText = cols[1]?.textContent.trim() || '';
    const bodyCol = cols[2] || null;

    // Robustez: sin icono → omitir el item completo.
    if (!iconPicture) return;

    const li = document.createElement('li');
    li.classList.add('feature-icons-band-item');

    // Preservar la instrumentación UE de la fila (data-aue-resource del item, etc.).
    // Sin esto, el autor pierde la identidad de cada item al editar en UE.
    moveInstrumentation(row, li);

    // Icono optimizado (200x100, lazy, no LCP).
    const originalImg = iconPicture.querySelector('img');
    const src = originalImg?.getAttribute('src') || '';
    const altRaw = originalImg?.getAttribute('alt') || '';
    const alt = altRaw || itemHeadingText; // fallback al heading si el autor no puso alt
    const optimizedPic = createOptimizedPicture(src, alt, false, [{ width: '200' }]);
    optimizedPic.classList.add('feature-icons-band-icon');
    const optimizedImg = optimizedPic.querySelector('img');
    if (optimizedImg) {
      optimizedImg.setAttribute('width', '200');
      optimizedImg.setAttribute('height', '100');
      optimizedImg.setAttribute('loading', 'lazy');
      optimizedImg.setAttribute('decoding', 'async');
      // Preservar la instrumentación UE de la <img> (campo `icon` editable).
      if (originalImg) moveInstrumentation(originalImg, optimizedImg);
    }
    // El <picture> es el campo editable `icon` del modelo `feature-icons-band-item`.
    optimizedPic.dataset.aueProp = 'icon';
    optimizedPic.dataset.aueType = 'media';
    optimizedPic.dataset.aueLabel = 'Icono o ilustración (200×100)';
    li.append(optimizedPic);

    // Heading (omitir si vacío).
    if (itemHeadingText) {
      const h3 = document.createElement('h3');
      h3.classList.add('feature-icons-band-heading');
      h3.textContent = itemHeadingText;
      h3.dataset.aueProp = 'heading';
      h3.dataset.aueType = 'text';
      h3.dataset.aueLabel = 'Encabezado corto del feature';
      li.append(h3);
    }

    // Body (omitir si vacío). Preservamos texto plano del párrafo entregado.
    if (bodyCol) {
      const bodyText = bodyCol.textContent.trim();
      if (bodyText) {
        const p = document.createElement('p');
        p.classList.add('feature-icons-band-body');
        p.textContent = bodyText;
        p.dataset.aueProp = 'body';
        p.dataset.aueType = 'text';
        p.dataset.aueLabel = 'Texto descriptivo (1-2 líneas)';
        li.append(p);
      }
    }

    ul.append(li);
  });

  // 3. Sustituir los hijos del block por la lista decorada.
  //    `replaceChildren` sólo afecta a los hijos: `data-block-name` y
  //    `data-block-status` (que están en el propio block) se preservan.
  //    Mismo patrón que `blocks/cards/cards.js`.
  frag.append(ul);
  block.replaceChildren(frag);
  block.dataset.aueFilter = 'feature-icons-band';

  // ⚠️ TODO: Confirmar layout responsive tablet (Figma 3:5536) y mobile (3:7270).
  // ⚠️ TODO: ¿Items son enlaces? Si el cliente confirma, envolver heading o item en <a>.
  // ⚠️ TODO: Confirmar fidelidad visual del icono en WebP (createOptimizedPicture).
}
