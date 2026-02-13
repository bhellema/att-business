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

  // --- Section 5: Neutral "Why work with AT&T Business?" ---
  const startEl = Array.from(element.querySelectorAll('h2')).find(
    (h2) => h2.textContent.trim() === 'Why work with AT&T Business?',
  );
  if (startEl) {
    const endEl = element.querySelector('.micro-banner')
      || Array.from(element.querySelectorAll('.micro-banner')).find(
        (el) => el.textContent.includes('Try AT&T Business for 30 days'),
      );
    if (endEl) {
      const hrBefore = document.createElement('hr');
      startEl.parentElement.insertBefore(hrBefore, startEl);

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
  }
}
