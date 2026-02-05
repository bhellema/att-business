/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://www.business.att.com/
 * Base Block: cards
 *
 * Block Structure (Universal Editor xwalk format):
 * Container block with repeating card items
 * - Each card has 2 fields: image (reference), text (richtext)
 * - Each card = 1 row with 2 columns
 *
 * Generated: 2026-02-05
 */

export default function parse(element, { document }) {
  // Find all card elements
  const cardElements = element.querySelectorAll('.tile-card');

  // Build cells array - one row per card
  const cells = [];

  // Process each card (limit to first 6 cards)
  const cardsToProcess = Array.from(cardElements).slice(0, 6);

  cardsToProcess.forEach(card => {
    // Extract image
    const imgElement = card.querySelector('.card-img img');
    const imageAlt = (imgElement && imgElement.alt) || '';

    // Create picture element for image reference
    const pictureEl = document.createElement('picture');
    if (imgElement) {
      const imgEl = document.createElement('img');
      imgEl.src = imgElement.src;
      imgEl.alt = imageAlt;
      pictureEl.appendChild(imgEl);
    }

    // Extract text content elements
    const eyebrow = card.querySelector('.eyebrow-text');
    const heading = card.querySelector('.heading-md, h3');
    const description = card.querySelector('.tileSubheading p');
    const pricingSection = card.querySelector('.price-comp');
    const termsSection = card.querySelector('.terms');
    const ctaLink = card.querySelector('.tile-anchor');

    // Build richtext content (title + description + pricing + CTA)
    const textContent = document.createElement('div');

    // Add eyebrow if exists (some cards may not have this)
    if (eyebrow && eyebrow.textContent.trim()) {
      const eyebrowEl = document.createElement('p');
      eyebrowEl.className = 'eyebrow';
      eyebrowEl.textContent = eyebrow.textContent.trim();
      textContent.appendChild(eyebrowEl);
    }

    // Add heading (title)
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

    // Add pricing information if available
    if (pricingSection) {
      // Extract pricing text
      const priceAmount = pricingSection.querySelector('.price-amount-qty');
      const priceDisclosure = pricingSection.querySelector('.price-disclosure');
      const priceStarts = pricingSection.querySelector('.starts');

      if (priceAmount || priceStarts) {
        const pricingEl = document.createElement('p');
        let pricingText = '';

        if (priceStarts) {
          pricingText += priceStarts.textContent.trim() + ' ';
        }
        if (priceAmount) {
          pricingText += priceAmount.textContent.trim();
        }
        if (priceDisclosure) {
          pricingText += ' ' + priceDisclosure.textContent.trim();
        }

        pricingEl.textContent = pricingText.trim();
        textContent.appendChild(pricingEl);
      }
    }

    // Add terms if available
    if (termsSection && termsSection.textContent.trim()) {
      const termsEl = document.createElement('p');
      termsEl.className = 'terms';
      // Extract just the text, remove nested links
      const termsClone = termsSection.cloneNode(true);
      const linksInTerms = termsClone.querySelectorAll('a');
      linksInTerms.forEach(link => link.remove());
      termsEl.textContent = termsClone.textContent.trim();
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

    // Add field hints using DocumentFragment (MANDATORY for xwalk)
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(pictureEl);

    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    textFrag.appendChild(textContent);

    // Add this card as a row with 2 columns
    cells.push([imageFrag, textFrag]);
  });

  // Use WebImporter.Blocks.createBlock() for xwalk cards container
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });

  // Replace element with block
  element.replaceWith(block);
}
