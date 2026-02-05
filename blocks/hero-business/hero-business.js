import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Get the two main divs (image and text)
  const children = [...block.children];

  // First child contains the image
  const imageDiv = children[0];
  // Second child contains the text
  const textDiv = children[1];

  // Process image: find img tag and create picture element
  const img = imageDiv.querySelector('img');
  if (img) {
    let picture = document.createElement('picture');
    const { src, alt } = img;

    // Check if image is external (not from same origin)
    const isExternal = src.startsWith('http') && !src.startsWith(window.location.origin);

    if (isExternal) {
      // For external images, use the original src without optimization
      const newImg = document.createElement('img');
      newImg.src = src;
      newImg.alt = alt;
      newImg.loading = 'eager'; // Hero images should load eagerly
      picture.appendChild(newImg);
    } else {
      // For local images, use createOptimizedPicture
      const optimizedPicture = createOptimizedPicture(
        src,
        alt,
        false,
        [{ width: '750' }, { width: '1200' }],
      );
      // Update picture reference to the optimized version
      picture = optimizedPicture;
    }

    // Clear the imageDiv and add picture directly to block
    imageDiv.remove();
    block.appendChild(picture);
  }

  // Process text: extract content from nested divs and flatten
  if (textDiv) {
    const textContent = textDiv.querySelector('div');
    if (textContent) {
      // Move all text content children directly to block
      const contentElements = [...textContent.children];
      textDiv.remove();

      // Wrap text content in a div for styling
      const textWrapper = document.createElement('div');
      textWrapper.classList.add('hero-business-text');
      contentElements.forEach((el) => {
        textWrapper.appendChild(el);
      });
      block.appendChild(textWrapper);
    }
  }
}
