/* eslint-disable */
/* global WebImporter */

/**
 * Parser for banner block (standalone single banner)
 *
 * Source: https://www.business.att.com/
 * Base Block: columns (adapted for banner)
 *
 * Block Structure (Universal Editor xwalk format):
 * Columns-based block with 1 row and 2 columns (image, text)
 * - Column 1: image (background image extracted)
 * - Column 2: text (richtext with eyebrow, heading, description, terms, CTA)
 *
 * Note: Use banner-list for multiple banners in grid layout
 *
 * Generated: 2026-02-06
 */

export default function parse(element, { document }) {
  // This parser handles single banner instances only
  // For multiple banners in grid layout, use banner-list parser

  let bannerElement = null;

  // Check if element itself is a banner (hero)
  if (element.classList.contains('hero')) {
    bannerElement = element;
  } else {
    // Query for single flex-card
    const flexCard = element.querySelector('.card.flex-card');
    if (flexCard) {
      bannerElement = flexCard;
    }
  }

  if (!bannerElement) {
    console.warn('No banner element found');
    return;
  }

  // Extract image - different sources depending on banner type
  let imageSrc = '';

  // Try CSS custom property first (flex-cards)
  const styleAttr = bannerElement.getAttribute('style');
  if (styleAttr) {
    const match = styleAttr.match(/--image-desktop:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      imageSrc = match[1].trim();
      imageSrc = imageSrc.replace(/^['"]|['"]$/g, '');
    }
  }

  // If no CSS image, try <img> tag (hero elements)
  if (!imageSrc) {
    const imgElement = bannerElement.querySelector('img');
    if (imgElement && imgElement.src) {
      imageSrc = imgElement.src;
    }
  }

  // Create picture element for image
  const pictureEl = document.createElement('picture');
  if (imageSrc) {
    const imgEl = document.createElement('img');
    imgEl.src = imageSrc;
    imgEl.alt = '';  // Banner images are decorative
    pictureEl.appendChild(imgEl);
  }

  // Extract text content elements - different selectors for flex-cards vs heroes
  const eyebrow = bannerElement.querySelector('.eyebrow-lg-desktop, .eyebrow-lg-tablet, .eyebrow-lg-mobile, .eyebrow-xxxl-desktop, .eyebrow-xxxl-tablet, .eyebrow-xxxl-mobile');
  const heading = bannerElement.querySelector('h3.heading-lg-desktop, h3, h2.heading-xxl-desktop, h2');
  const description = bannerElement.querySelector('.type-base p, .wysiwyg-editor p');
  const terms = bannerElement.querySelector('.type-legal p, .type-legal-wysiwyg-editor p');

  // CTAs can be in different containers
  let ctaLinks = [];
  const flexCardCta = bannerElement.querySelector('.flexCardItemCta a, .anchor4-button-link');
  if (flexCardCta) {
    ctaLinks.push(flexCardCta);
  } else {
    // Hero elements may have multiple CTAs in .cta-container
    const ctaContainer = bannerElement.querySelector('.cta-container');
    if (ctaContainer) {
      ctaLinks = Array.from(ctaContainer.querySelectorAll('a'));
    }
  }

  // Build richtext content for text column
  const textContent = document.createElement('div');

  // Add eyebrow if exists
  if (eyebrow && eyebrow.textContent.trim()) {
    const eyebrowEl = document.createElement('p');
    eyebrowEl.className = 'eyebrow';
    eyebrowEl.textContent = eyebrow.textContent.trim();
    textContent.appendChild(eyebrowEl);
  }

  // Add heading
  if (heading) {
    const headingEl = document.createElement('h2');
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

  // Add CTA links (may be multiple)
  ctaLinks.forEach(ctaLink => {
    if (ctaLink) {
      const ctaEl = document.createElement('p');
      const linkEl = document.createElement('a');
      linkEl.href = ctaLink.href;
      linkEl.textContent = ctaLink.textContent.trim();
      ctaEl.appendChild(linkEl);
      textContent.appendChild(ctaEl);
    }
  });

  // Create cells array: 1 row with 2 columns (image, text)
  const cells = [
    [pictureEl, textContent]  // Row 1: column 1 (image), column 2 (text)
  ];

  // Create banner block using createBlock
  const block = WebImporter.Blocks.createBlock(document, { name: 'banner', cells });

  // Replace the element with the banner block
  element.replaceWith(block);
}
