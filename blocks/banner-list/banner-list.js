import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Each row in the block becomes a banner item
  const banners = [...block.children];

  banners.forEach((banner) => {
    // if there are three children, then remove the first one
    if (banner.children.length === 3) {
      // remove the first child
      banner.children[0].remove();
    }

    banner.classList.add('banner-list-item');

    const children = [...banner.children];

    // First remaining div contains the image
    if (children[0]) {
      children[0].classList.add('banner-list-item-image');

      // Find image and create optimized picture element
      const img = children[0].querySelector('img');
      if (img) {
        const { src, alt } = img;

        // Check if image is external (not from same origin)
        const isExternal = src.startsWith('http') && !src.startsWith(window.location.origin);

        let picture;
        if (isExternal) {
          picture = document.createElement('picture');
          const newImg = document.createElement('img');
          newImg.src = src;
          newImg.alt = alt || 'background';
          newImg.loading = 'lazy';
          [
            { width: 1600, media: '(min-width: 1600px)' },
            { width: 1200, media: '(min-width: 1200px)' },
            { width: 750, media: '(min-width: 750px)' },
          ].forEach(({ width, media }) => {
            const source = document.createElement('source');
            source.srcset = `${src}?width=${width}&format=webply&optimize=medium`;
            source.type = 'image/webp';
            source.media = media;
            picture.appendChild(source);
          });
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

        moveInstrumentation(img, picture.querySelector('img'));
        const parentP = img.closest('p');
        if (parentP) {
          parentP.replaceWith(picture);
        } else {
          img.replaceWith(picture);
        }
      }
    }
    // Second remaining div contains the text content
    if (children[1]) {
      children[1].classList.add('banner-list-item-text');
    }
  });
}
