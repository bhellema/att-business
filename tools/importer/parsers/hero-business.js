/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-business block
 *
 * Source: https://www.business.att.com/
 * Base Block: hero
 *
 * Block Structure (Universal Editor xwalk format):
 * - Field 1: image (reference) - Background/hero image
 * - Field 2: imageAlt (text) - Image alt text
 * - Field 3: text (richtext) - Eyebrow, heading, and paragraph content
 *
 * Generated: 2026-02-05
 */

export default function parse(element, { document }) {
  let heroImage = null;
  let imageAlt = '';

  // First priority: Check for data-desktop attribute on custom-hero-absolute-fill
  const heroAbsoluteFill = element.querySelector('.custom-hero-absolute-fill[data-desktop]');
  if (heroAbsoluteFill) {
    const desktopImageUrl = heroAbsoluteFill.getAttribute('data-desktop');
    if (desktopImageUrl) {
      heroImage = { src: desktopImageUrl, alt: '' };
    }
  }

  // Second priority: Extract all images and look for desktop version (hp-dsk)
  if (!heroImage) {
    const allImages = Array.from(element.querySelectorAll('img'));
    heroImage = allImages.find(img => img.src && img.src.includes('hp-dsk'));
  }

  // Third priority: desktop background image selectors
  if (!heroImage) {
    heroImage = element.querySelector('.bg-hero-panel img, .bg-art img');
  }

  // Last resort: mobile image
  if (!heroImage) {
    heroImage = element.querySelector('.hero-panel-image img, .visible-mobile');
  }

  // If we got a mobile image, transform URL to desktop version
  if (heroImage && heroImage.src && heroImage.src.includes('hp-mbl')) {
    const desktopSrc = heroImage.src.replace('hp-mbl', 'hp-dsk');
    heroImage = { src: desktopSrc, alt: heroImage.alt };
  }

  imageAlt = (heroImage && heroImage.alt) || '';

  // Build richtext content (eyebrow + heading + paragraph + links)
  const textContent = document.createElement('div');

  // Extract eyebrow
  const eyebrow = element.querySelector('.eyebrow-xxxl-desktop, .eyebrow-heading');

  // Get heading - try multiple strategies
  let heading = element.querySelector('.heading-seo');
  if (!heading || !heading.textContent.trim()) {
    const allH2s = element.querySelectorAll('h2');
    for (const h2 of allH2s) {
      if (h2.textContent.trim()) {
        heading = h2;
        break;
      }
    }
  }

  // Get all paragraphs (may be multiple)
  const paragraphs = Array.from(element.querySelectorAll('.wysiwyg-editor p, .type-base p, .type-legal p'));

  // Get CTA links
  const ctaLinks = Array.from(element.querySelectorAll('.cta-container a, a[href]')).filter(link => {
    // Filter to only actual CTA links (not empty or javascript:void)
    const href = link.getAttribute('href');
    return href && !href.startsWith('javascript:') && link.textContent.trim();
  });

  // Build content structure
  if (eyebrow) {
    const eyebrowEl = document.createElement('p');
    eyebrowEl.className = 'eyebrow';
    eyebrowEl.textContent = eyebrow.textContent.trim();
    textContent.appendChild(eyebrowEl);
  }

  if (heading) {
    const headingEl = document.createElement('h2');
    headingEl.textContent = heading.textContent.trim();
    textContent.appendChild(headingEl);
  }

  // Add all paragraphs
  paragraphs.forEach(p => {
    if (p.textContent.trim()) {
      const descEl = document.createElement('p');
      descEl.textContent = p.textContent.trim();
      textContent.appendChild(descEl);
    }
  });

  // Add CTA links (limit to first 2)
  ctaLinks.slice(0, 2).forEach(link => {
    const ctaEl = document.createElement('p');
    const linkEl = document.createElement('a');
    linkEl.href = link.getAttribute('href');
    linkEl.textContent = link.textContent.trim();
    ctaEl.appendChild(linkEl);
    textContent.appendChild(ctaEl);
  });

  // Create picture element with collapsed imageAlt field
  // xwalk uses <picture><img> for image references
  const pictureEl = document.createElement('picture');
  if (heroImage) {
    const imgEl = document.createElement('img');
    imgEl.src = heroImage.src;
    imgEl.alt = imageAlt;
    pictureEl.appendChild(imgEl);
  }

  // Add field hints using DocumentFragment (MANDATORY for xwalk)
  const imageFrag = document.createDocumentFragment();
  imageFrag.appendChild(document.createComment(' field:image '));
  imageFrag.appendChild(pictureEl);

  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  textFrag.appendChild(textContent);

  // Create cells array for xwalk block
  // For xwalk: All rows/columns must exist (even if empty)
  // Row 1: image (reference field with collapsed imageAlt)
  // Row 2: text (richtext field)
  const cells = [
    [imageFrag],  // Row 1, column 1
    [textFrag]    // Row 2, column 1
  ];

  // Use exact variant name from block variant management
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-business', cells });

  // Replace element with block
  element.replaceWith(block);
}
