import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Convert images to optimized pictures FIRST
    li.querySelectorAll('img').forEach((img) => {
      const { src, alt } = img;

      // Check if image is external (not from same origin)
      const isExternal = src.startsWith('http') && !src.startsWith(window.location.origin);

      let picture;
      if (isExternal) {
        // For external images, wrap in picture element without optimization
        picture = document.createElement('picture');
        const newImg = document.createElement('img');
        newImg.src = src;
        newImg.alt = alt;
        newImg.loading = 'lazy';
        picture.appendChild(newImg);
        moveInstrumentation(img, newImg);
      } else {
        // For local images, use createOptimizedPicture
        picture = createOptimizedPicture(src, alt, false, [{ width: '750' }]);
        moveInstrumentation(img, picture.querySelector('img'));
      }

      // Check if img is wrapped in a <p> tag and replace the <p> instead
      const parentP = img.closest('p');
      if (parentP) {
        parentP.replaceWith(picture);
      } else {
        img.replaceWith(picture);
      }
    });

    // THEN assign classes based on content
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
