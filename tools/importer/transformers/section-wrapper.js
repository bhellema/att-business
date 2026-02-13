/* eslint-disable */
/* global WebImporter */

/**
 * Section Transformer
 * Creates EDS section boundaries and applies section-metadata styles.
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

/**
 * Helper to create a Section Metadata block with a given style
 */
function createSectionMetadata(document, style) {
  return WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: [
      [createTextDiv(document, 'style'), createTextDiv(document, style)],
    ],
  });
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const { document } = payload;

  // --- Neutral "Why work with AT&T Business?" section ---
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

      endEl.parentElement.insertBefore(createSectionMetadata(document, 'neutral'), endEl);

      const hrAfter = document.createElement('hr');
      endEl.parentElement.insertBefore(hrAfter, endEl);
    }
  }

  // --- Neutral "Looking for more?" section ---
  const lookingH2 = Array.from(element.querySelectorAll('h2')).find(
    (h2) => h2.textContent.trim() === 'Looking for more?',
  );
  if (lookingH2) {
    // Insert section break before the heading
    lookingH2.parentElement.insertBefore(document.createElement('hr'), lookingH2);

    // Find the last UL sibling after the heading — the merged link list
    let lastUl = null;
    let sibling = lookingH2.nextElementSibling;
    while (sibling) {
      if (sibling.tagName === 'UL') lastUl = sibling;
      sibling = sibling.nextElementSibling;
    }

    // Insert section metadata after the last UL (or after the heading if no UL found)
    const insertAfter = lastUl || lookingH2;
    insertAfter.parentElement.insertBefore(
      createSectionMetadata(document, 'neutral'),
      insertAfter.nextElementSibling,
    );

    // Insert section break after the section metadata to separate from metadata block
    const sectionMeta = insertAfter.nextElementSibling;
    if (sectionMeta && sectionMeta.nextElementSibling) {
      sectionMeta.parentElement.insertBefore(
        document.createElement('hr'),
        sectionMeta.nextElementSibling,
      );
    }
  }
}
