import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Each row in the block becomes a banner item
  const banners = [...block.children];

  banners.forEach((banner) => {
    banner.classList.add('banner-list-item');

    // Get all child divs
    const children = [...banner.children];

    // First child is classes field - remove it
    if (children[0]) {
      children[0].remove();
    }

    // After removing classes, get updated children
    const updatedChildren = [...banner.children];

    // First remaining div contains the image
    if (updatedChildren[0]) {
      updatedChildren[0].classList.add('banner-list-item-image');

      // Find image and create optimized picture element
      const img = updatedChildren[0].querySelector('img');
      if (img) {
        const { src, alt } = img;

        // Check if image is external (not from same origin)
        const isExternal = src.startsWith('http') && !src.startsWith(window.location.origin);

        let picture;
        if (isExternal) {
          // For external images, create picture without optimization
          picture = document.createElement('picture');
          const newImg = document.createElement('img');
          newImg.src = src;
          newImg.alt = alt || 'background';
          newImg.loading = 'lazy';
          picture.appendChild(newImg);
        } else {
          // For local images, use createOptimizedPicture
          picture = createOptimizedPicture(
            src,
            alt || 'background',
            false,
            [{ width: '1600' }, { width: '1200' }, { width: '750' }],
          );
        }

        img.replaceWith(picture);
        moveInstrumentation(img, picture.querySelector('img'));
      }
    }
    // Second remaining div contains the text content
    if (updatedChildren[1]) {
      updatedChildren[1].classList.add('banner-list-item-text');
    }
  });
}
