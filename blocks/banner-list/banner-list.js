import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Each row in the block becomes a banner item
  const banners = [...block.children];

  banners.forEach((banner) => {
    banner.classList.add('banner-list-item');

    // Get the classes from the first cell (classes field)
    const classesCell = banner.querySelector('div:first-child');
    if (classesCell) {
      const classesText = classesCell.textContent.trim();
      // Extract classes from comma-separated text
      // (e.g., "banner-item, dark" -> ["banner-item", "dark"])
      const classNames = classesText.split(',').map((c) => c.trim());
      classNames.forEach((className) => {
        if (className && className !== 'banner-item') {
          banner.classList.add(className);
        }
      });
      // Remove the classes cell from DOM
      classesCell.remove();
    }

    // Find image and create optimized picture element
    const img = banner.querySelector('img');
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
        newImg.alt = alt;
        newImg.loading = 'lazy';
        picture.appendChild(newImg);
      } else {
        // For local images, use createOptimizedPicture
        picture = createOptimizedPicture(
          src,
          alt,
          false,
          [{ width: '1600' }, { width: '1200' }, { width: '750' }],
        );
      }

      // Remove the image column from DOM
      const imgParent = img.closest('div');
      if (imgParent) {
        imgParent.remove();
      }

      // Add picture as first child of banner item (before text)
      banner.prepend(picture);
    }
  });
}
