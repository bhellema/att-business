/* eslint-disable */
/* global WebImporter */

/**
 * Import script for homepage template
 * Template: AT&T Business homepage with hero section
 * Generated: 2026-02-06T02:07:00.000Z
 */

// PARSER IMPORTS - Import all parsers needed for this template
import heroBusinessParser from './parsers/hero-business.js';
import cardsParser from './parsers/cards.js';
import cardsQuietParser from './parsers/cards-quiet.js';
import bannerListParser from './parsers/banner-list.js';
import carouselParser from './parsers/carousel.js';
import storystackParser from './parsers/storystack.js';

// TRANSFORMER IMPORTS - Import all transformers
import attBusinessCleanupTransformer from './transformers/att-business-cleanup.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-business': heroBusinessParser,
  'cards': cardsParser,
  'cards-quiet': cardsQuietParser,
  'banner-list': bannerListParser,
  'carousel': carouselParser,
  'storystack': storystackParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  attBusinessCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AT&T Business homepage with hero section',
  urls: [
    'https://www.business.att.com/'
  ],
  blocks: [
    {
      name: 'hero-business',
      instances: ['.hero']
    },
    {
      name: 'cards',
      instances: ['.multi-tile-row']
    },
    {
      name: 'banner-list',
      instances: ['.flex-cards']
    },
    {
      name: 'cards-quiet',
      instances: ['.generic-list-icon-vp-row']
    },
    {
      name: 'carousel',
      instances: ['.banner-section.swiper']
    },
    {
      name: 'storystack',
      instances: ['.story-stack']
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, payload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  // Find all block instances defined in the template
  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function
   * @param {Object} payload - Contains { document, url, html, params }
   * @returns {Array} Array of output objects with element, path, and report
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach(block => {
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

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (full localized path without extension)
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '/index').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
