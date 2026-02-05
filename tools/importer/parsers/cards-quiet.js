/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-quiet block
 *
 * Source: https://www.business.att.com/
 * Base Block: cards (quiet variant with icons)
 *
 * Block Structure (Universal Editor xwalk format):
 * Container block with N rows, each row has 2 columns (image field, text field)
 * - Column 1: image field (icon image)
 * - Column 2: text field (richtext with heading, description, terms, CTA)
 *
 * Generated: 2026-02-05
 */

export default function parse(element, { document }) {
  // Find all card elements
  const cardElements = element.querySelectorAll('.generic-list-icon-vp');

  if (cardElements.length === 0) {
    console.warn('No cards-quiet elements found');
    return;
  }

  // Build cells array - one row per card
  const cells = [];

  cardElements.forEach(card => {
    // Extract icon image
    const imgElement = card.querySelector('img');
    const imageAlt = (imgElement && imgElement.alt) || '';

    // Create picture element for image
    const pictureEl = document.createElement('picture');
    if (imgElement) {
      const imgEl = document.createElement('img');
      imgEl.src = imgElement.src;
      imgEl.alt = imageAlt;
      pictureEl.appendChild(imgEl);
    }

    // Extract text content elements
    const heading = card.querySelector('h4');
    const description = card.querySelector('.description p');
    const terms = card.querySelector('.type-legal p, .type-legal-wysiwyg-editor p');
    const ctaLink = card.querySelector('a.primary-cta');

    // Build richtext content for text column
    const textContent = document.createElement('div');

    // Add heading
    if (heading) {
      const headingEl = document.createElement('h4');
      headingEl.textContent = heading.textContent.trim();
      textContent.appendChild(headingEl);
    }

    // Add description
    if (description) {
      const descEl = document.createElement('p');
      descEl.textContent = description.textContent.trim();
      textContent.appendChild(descEl);
    }

    // Add terms if available
    if (terms && terms.textContent.trim()) {
      const termsEl = document.createElement('p');
      termsEl.className = 'terms';
      termsEl.textContent = terms.textContent.trim();
      textContent.appendChild(termsEl);
    }

    // Add CTA link
    if (ctaLink) {
      const ctaEl = document.createElement('p');
      const linkEl = document.createElement('a');
      linkEl.href = ctaLink.href;
      linkEl.textContent = ctaLink.textContent.trim();
      ctaEl.appendChild(linkEl);
      textContent.appendChild(ctaEl);
    }

    // Add field comments for xwalk container blocks
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(pictureEl);

    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    textFrag.appendChild(textContent);

    // Add row: [image column, text column]
    cells.push([imageFrag, textFrag]);
  });

  // Create cards-quiet block using createBlock
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-quiet', cells });

  // Replace the parent element with the cards block
  element.replaceWith(block);
}
