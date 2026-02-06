/* eslint-disable */
/* global WebImporter */

/**
 * Parser for banner-list block
 *
 * Source: https://www.business.att.com/
 * Base Block: block with block/item children
 *
 * Block Structure (Universal Editor xwalk format):
 * Container block with multiple banner-item children
 * Each banner-item contains:
 * - Column 1: classes (text) - "banner-item light" or "banner-item dark"
 * - Column 2: image (reference) - Background image extracted
 * - Column 3: text (richtext) - Eyebrow, heading, description, terms, CTA
 *
 * Theme Detection:
 * - Inspects .card.theme-light-bg-img → "light"
 * - Inspects .card.theme-dark-bg-img → "dark"
 * - Default: "light"
 *
 * Generated: 2026-02-06
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

  // Array to hold all banner-item rows
  const bannerItems = [];

  // Process each banner element as a banner-item
  bannerElements.forEach((banner, index) => {
    // Detect theme from banner classes
    let theme = '';
    if (banner.classList.contains('theme-light-bg-img')) {
      theme = 'light';
    } else if (banner.classList.contains('theme-dark-bg-img')) {
      theme = 'dark';
    }
    // Default to light if no theme detected
    if (!theme) {
      theme = 'light';
    }

    // Extract image - different sources depending on banner type
    let imageSrc = '';
    let imageAlt = '';

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
    const imgElement = banner.querySelector('img');
    if (!imageSrc && imgElement && imgElement.src) {
      imageSrc = imgElement.src;
    }

    // Extract alt text from img element if available
    if (imgElement && imgElement.alt) {
      imageAlt = imgElement.alt;
    }

    // Create picture element for image
    const pictureEl = document.createElement('picture');
    if (imageSrc) {
      const imgEl = document.createElement('img');
      imgEl.src = imageSrc;
      imgEl.alt = imageAlt || '';
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

    // Add heading (use h2 for banner-list items)
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

    // Create classes cell with "banner-item" and theme (comma-separated)
    const classesText = `banner-item, ${theme}`;

    // Each banner-item is a row with 3 columns (classes, image, text)
    // Classes must be first column per Universal Editor rules
    bannerItems.push([classesText, pictureEl, textContent]);
  });

  // Create banner-list block with all banner-items as rows
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'banner-list',
    cells: bannerItems
  });

  // Replace the parent element with the banner-list block
  element.replaceWith(block);
}
