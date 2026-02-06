/* eslint-disable */
/* global WebImporter */

/**
 * Section Transformer
 * Creates EDS sections with section metadata for styled areas
 *
 * Sections in EDS are created using horizontal rules (<hr>) as dividers.
 * Section Metadata blocks are added to apply styles (e.g., "grey-background").
 *
 * Based on: https://github.com/blefebvre/ec-xwalk-jan-21/blob/477e54261cc7c28edbf4edb8d6f21cfdcd7f62aa/tools/importer/transformers/sections.js
 */

/**
 * Helper to create a div with text content
 */
function createTextDiv(document, text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div;
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const { document } = payload;

  // Find the specific H2 that starts the dark section
  const startEl = Array.from(element.querySelectorAll('h2')).find(
    (h2) => h2.textContent.trim() === 'Why work with AT&T Business?'
  );

  if (!startEl) return;

  const endEl = Array.from(element.querySelectorAll('.micro-banner')).find(
    (p) => p.textContent.includes('Try AT&T Business for 30 days')
  );


  if (!endEl) return;

  // Create Section Metadata block for dark style
  const sectionMetadata = WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: [
      [createTextDiv(document, 'Style'), createTextDiv(document, 'neutral')]
    ]
  });

  // Insert HR before the H2 (creates section break before dark section)
  const hrBefore = document.createElement('hr');
  startEl.parentElement.insertBefore(hrBefore, startEl);

  // Insert Section Metadata and HR before the "Latest news" H3
  const hrAfter = document.createElement('hr');
  endEl.parentElement.insertBefore(sectionMetadata, endEl);
  endEl.parentElement.insertBefore(hrAfter, endEl);
}
