/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCarouselParser from './parsers/hero-carousel.js';
import heroDarkParser from './parsers/hero-dark.js';
import planSelectorParser from './parsers/plan-selector.js';
import featureIconsBandParser from './parsers/feature-icons-band.js';
import channelLogosParser from './parsers/channel-logos.js';
import mediaGridParser from './parsers/media-grid.js';
import promoBandParser from './parsers/promo-band.js';
import contentCarouselParser from './parsers/content-carousel.js';
import cardsDarkParser from './parsers/cards-dark.js';
import faqAccordionParser from './parsers/faq-accordion.js';

// TRANSFORMER IMPORTS
import movistarCleanupTransformer from './transformers/movistarplus-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'hero-carousel': heroCarouselParser,
  'hero-dark': heroDarkParser,
  'plan-selector': planSelectorParser,
  'feature-icons-band': featureIconsBandParser,
  'channel-logos': channelLogosParser,
  'media-grid': mediaGridParser,
  'promo-band': promoBandParser,
  'content-carousel': contentCarouselParser,
  'cards-dark': cardsDarkParser,
  'faq-accordion': faqAccordionParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  movistarCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Movistar Plus+ homepage with hero content, featured shows, channel listings, and promotional sections',
  urls: [
    'https://www.movistarplus.es/',
  ],
  blocks: [
    {
      name: 'hero-carousel',
      instances: ['section#m66c59d1ec3498818d50ec4db'],
    },
    {
      name: 'hero-dark',
      instances: ['section#m64ba88277f47881e2325be36', 'section#m66191b04c349885e443e0cf2'],
    },
    {
      name: 'plan-selector',
      instances: ['section#m698c45f5c349880b3c5d4f69'],
    },
    {
      name: 'feature-icons-band',
      instances: ['section#m661d31edc3498864727521d2', 'section#m660fcb9fc3498859916b2440'],
    },
    {
      name: 'channel-logos',
      instances: ['section#m6788c28c7f4788477b7c1e32'],
    },
    {
      name: 'media-grid',
      instances: [
        'section#m64be96b7c34988316053359c',
        'section#m64bfe4887f47880f4d1c8ff2',
        'section#m64bfeb97c349883f0e668272',
        'section#m654d15a0c349883e3e28242d',
        'section#m654d13637f47883dc53d0cdf',
      ],
    },
    {
      name: 'promo-band',
      instances: [
        'section#m65f8607f7f4788457b274356',
        'section#m66a8f24c7f4788666e693db0',
        'section#m64bea684c349885f444336c4',
      ],
    },
    {
      name: 'content-carousel',
      instances: ['section#m67efc3487f478827303e64d1'],
    },
    {
      name: 'cards-dark',
      instances: ['section#m681cbc65c3498813c315f6bc', 'section#m6938329bc349884fd4145182'],
    },
    {
      name: 'faq-accordion',
      instances: ['section#m665986e97f47883688067ac3'],
    },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
