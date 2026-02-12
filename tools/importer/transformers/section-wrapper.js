/* eslint-disable */
/* global WebImporter */

/**
 * Section Transformer
 * Creates EDS section boundary around the "Why work with AT&T Business?" area
 * and applies section-metadata with style: neutral.
 *
 * Sections in EDS are created using horizontal rules (<hr>) as dividers.
 * Section Metadata blocks are added to apply styles (e.g., "neutral").
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

  // Find the H2 that starts the neutral section
  const startEl = Array.from(element.querySelectorAll('h2')).find(
    (h2) => h2.textContent.trim() === 'Why work with AT&T Business?',
  );
  if (!startEl) return;

  // Find the element that marks the start of the next section (carousel area)
  const endEl = element.querySelector('.micro-banner')
    || Array.from(element.querySelectorAll('.micro-banner')).find(
      (el) => el.textContent.includes('Try AT&T Business for 30 days'),
    );
  if (!endEl) return;

  // Insert <hr> before the H2 to start the neutral section
  const hrBefore = document.createElement('hr');
  startEl.parentElement.insertBefore(hrBefore, startEl);

  // Insert Section Metadata (neutral) and <hr> before the next section
  const sectionMetadata = WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: [
      [createTextDiv(document, 'style'), createTextDiv(document, 'neutral')],
    ],
  });
  endEl.parentElement.insertBefore(sectionMetadata, endEl);

  const hrAfter = document.createElement('hr');
  endEl.parentElement.insertBefore(hrAfter, endEl);
}
