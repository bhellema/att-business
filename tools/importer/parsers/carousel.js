/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block
 *
 * Source: https://www.business.att.com/
 * Base Block: carousel (text-only slides)
 *
 * Block Structure (Universal Editor xwalk format):
 * Container block with N rows (slides), each row has 2 columns (image field, text field)
 * - Column 1: image field (optional background image)
 * - Column 2: text field (richtext with heading, body, legal text)
 *
 * Generated: 2026-02-05
 */

export default function parse(element, { document }) {
  // Find all carousel slides
  const slideElements = element.querySelectorAll('.swiper-slide');

  if (slideElements.length === 0) {
    console.warn('No carousel slides found');
    return;
  }

  // Build cells array - one row per slide
  const cells = [];

  slideElements.forEach(slide => {
    // Extract heading (required)
    const headingSection = slide.querySelector('.heading-section p b');
    const headingText = headingSection ? headingSection.textContent.trim() : '';

    // Extract body text (optional)
    const bodyText = slide.querySelector('.body-text p, .type-base p');
    const bodyTextContent = bodyText ? bodyText.textContent.trim() : '';

    // Extract legal text (optional)
    const legalText = slide.querySelector('.legal-container .legal-text p');
    const legalTextContent = legalText ? legalText.innerHTML.trim() : '';

    // Build richtext content for text column
    const textContent = document.createElement('div');

    // Add heading
    if (headingText) {
      const headingEl = document.createElement('p');
      const strongEl = document.createElement('strong');
      strongEl.textContent = headingText;
      headingEl.appendChild(strongEl);
      textContent.appendChild(headingEl);
    }

    // Add body text
    if (bodyTextContent) {
      const bodyEl = document.createElement('p');
      bodyEl.textContent = bodyTextContent;
      textContent.appendChild(bodyEl);
    }

    // Add legal text (preserve links)
    if (legalTextContent) {
      const legalEl = document.createElement('p');
      legalEl.innerHTML = legalTextContent;
      textContent.appendChild(legalEl);
    }

    // Create empty image field (no background images in text carousel)
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:media '));

    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:content '));
    textFrag.appendChild(textContent);

    // Add row: [image column (empty), text column]
    cells.push([imageFrag, textFrag]);
  });

  // Create carousel block using createBlock
  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });

  // Replace the parent element with the carousel block
  element.replaceWith(block);
}
