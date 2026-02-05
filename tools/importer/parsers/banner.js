/* eslint-disable */
/* global WebImporter */

/**
 * Parser for banner block
 *
 * Source: https://www.business.att.com/
 * Base Block: columns (adapted for banner)
 *
 * Block Structure (Universal Editor xwalk format):
 * Columns-based block with 1 row and 2 columns (image, text)
 * - Column 1: image (background image extracted)
 * - Column 2: text (richtext with eyebrow, heading, description, terms, CTA)
 *
 * Note: Columns blocks do NOT use field comments per xwalk guide
 *
 * Generated: 2026-02-05
 */

export default function parse(element, { document }) {
  // Find banner elements - can be flex-cards or hero elements
  let bannerElements = [];

  // Check if element itself is a banner (hero)
  if (element.classList.contains('hero')) {
    bannerElements = [element];
  } else {
    // Query for flex-card children
    bannerElements = Array.from(element.querySelectorAll('.card.flex-card'));
  }

  if (bannerElements.length === 0) {
    console.warn('No banner elements found');
    return;
  }

  // Create a container for all banner blocks
  const bannerContainer = document.createElement('div');

  // Process each banner
  bannerElements.forEach((banner, index) => {
    // Extract image - different sources depending on banner type
    let imageSrc = '';

    // Try CSS custom property first (flex-cards)
    const styleAttr = banner.getAttribute('style');
    if (styleAttr) {
      const match = styleAttr.match(/--image-desktop:\s*url\(([^)]+)\)/);
      if (match && match[1]) {
        imageSrc = match[1].trim();
        imageSrc = imageSrc.replace(/^['"]|['"]$/g, '');
      }
    }

    // If no CSS image, try <img> tag (hero elements)
    if (!imageSrc) {
      const imgElement = banner.querySelector('img');
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
    const eyebrow = banner.querySelector('.eyebrow-lg-desktop, .eyebrow-lg-tablet, .eyebrow-lg-mobile, .eyebrow-xxxl-desktop, .eyebrow-xxxl-tablet, .eyebrow-xxxl-mobile');
    const heading = banner.querySelector('h3.heading-lg-desktop, h3, h2.heading-xxl-desktop, h2');
    const description = banner.querySelector('.type-base p, .wysiwyg-editor p');
    const terms = banner.querySelector('.type-legal p, .type-legal-wysiwyg-editor p');

    // CTAs can be in different containers
    let ctaLinks = [];
    const flexCardCta = banner.querySelector('.flexCardItemCta a, .anchor4-button-link');
    if (flexCardCta) {
      ctaLinks.push(flexCardCta);
    } else {
      // Hero elements may have multiple CTAs in .cta-container
      const ctaContainer = banner.querySelector('.cta-container');
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
      const headingEl = document.createElement('h3');
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
    // Note: Columns blocks do NOT use field comments in xwalk
    const cells = [
      [pictureEl, textContent]  // Row 1: column 1 (image), column 2 (text)
    ];

    // Create banner block using createBlock
    const block = WebImporter.Blocks.createBlock(document, { name: 'banner', cells });

    // Add banner block to container
    bannerContainer.appendChild(block);
  });

  // Replace the parent element with the container of banner blocks
  element.replaceWith(bannerContainer);
}
