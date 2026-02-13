/* eslint-disable */
/* global WebImporter */

/**
 * Parser for storystack block
 *
 * Source: https://www.business.att.com/
 * Base Block: storystack (custom container block with icon overlay)
 *
 * Block Structure (Universal Editor xwalk format):
 * Container block with N rows (stories), each row has 3 columns
 * - Column 1: image field (background image)
 * - Column 2: icon field (icon overlay image)
 * - Column 3: text field (richtext with heading and description)
 *
 * Generated: 2026-02-05
 */

export default function parse(element, { document }) {
  // Remove the duplicate default image (outside the carousel)
  const duplicateImage = element.querySelector('.ss-visual-img-container');
  if (duplicateImage) {
    duplicateImage.remove();
  }

  // Find the actual storystack container
  const storystackContainer = element.querySelector('#storystack-container');
  if (!storystackContainer) {
    console.warn('No storystack container found');
    return;
  }

  // Find all story slides within the storystack container
  const storySlides = storystackContainer.querySelectorAll('.swiper-slide');

  if (storySlides.length === 0) {
    console.warn('No storystack slides found');
    return;
  }

  // Build cells array - one row per story
  const cells = [];

  storySlides.forEach(story => {
    // Extract background image
    const bgImage = story.querySelector('.swiper-image');
    const bgImageSrc = bgImage ? bgImage.src : '';
    const bgImageAlt = bgImage ? bgImage.alt : '';

    // Create picture element for background image column
    const bgPictureEl = document.createElement('picture');
    if (bgImage) {
      const bgImgEl = document.createElement('img');
      bgImgEl.src = bgImageSrc;
      bgImgEl.alt = bgImageAlt;
      bgPictureEl.appendChild(bgImgEl);
    }

    // Extract icon image
    const iconImage = story.querySelector('.story-icon-img');
    const iconImageSrc = iconImage ? iconImage.src : '';
    const iconImageAlt = iconImage ? iconImage.alt : '';

    // Create picture element for icon column
    const iconPictureEl = document.createElement('picture');
    if (iconImage) {
      const iconImgEl = document.createElement('img');
      iconImgEl.src = iconImageSrc;
      iconImgEl.alt = iconImageAlt;
      iconPictureEl.appendChild(iconImgEl);
    }

    // Extract text content
    const heading = story.querySelector('.ss-desktop-container .heading-sm');
    const description = story.querySelector('.ss-desktop-container .story-description p');

    // Build richtext content for text column
    const textContent = document.createElement('div');

    // Add heading
    if (heading) {
      const h3El = document.createElement('h3');
      h3El.textContent = heading.textContent.trim();
      textContent.appendChild(h3El);
    }

    // Add description
    if (description) {
      const pEl = document.createElement('p');
      pEl.innerHTML = description.innerHTML.trim();
      textContent.appendChild(pEl);
    }

    // Add field comments for xwalk container blocks
    const bgImageFrag = document.createDocumentFragment();
    bgImageFrag.appendChild(document.createComment(' field:image '));
    bgImageFrag.appendChild(bgPictureEl);

    const iconFrag = document.createDocumentFragment();
    iconFrag.appendChild(document.createComment(' field:icon '));
    iconFrag.appendChild(iconPictureEl);

    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    textFrag.appendChild(textContent);

    // Add row: [background image column, icon column, text column]
    cells.push([bgImageFrag, iconFrag, textFrag]);
  });

  // Extract section heading/description above the storystack carousel
  // (e.g. "Solutions for every kind of business" + description text)
  const masterHeader = element.querySelector('.ss-masterHeader');
  const headerElements = [];
  if (masterHeader) {
    const heading = masterHeader.querySelector('.heading-xxl, .heading-xl');
    if (heading && heading.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      headerElements.push(h2);
    }
    const desc = masterHeader.querySelector('.type-base');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      headerElements.push(p);
    }
  }

  // Create storystack block using createBlock
  const block = WebImporter.Blocks.createBlock(document, { name: 'storystack', cells });

  // Replace the element: insert header elements as default content before the block
  if (headerElements.length > 0) {
    const wrapper = document.createDocumentFragment();
    headerElements.forEach((el) => wrapper.appendChild(el));
    wrapper.appendChild(block);
    element.replaceWith(wrapper);
  } else {
    element.replaceWith(block);
  }
}
