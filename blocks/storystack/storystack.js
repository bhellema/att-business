import { moveInstrumentation } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

function showStory(block, index) {
  const slides = block.querySelectorAll('.storystack-slide');
  const buttons = block.querySelectorAll('.storystack-nav-button');

  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  buttons.forEach((button, i) => {
    if (i === index) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

export default function decorate(block) {
  // Convert to ul/li structure for stories
  const ul = document.createElement('ul');
  ul.classList.add('storystack-slides');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('storystack-slide');
    moveInstrumentation(row, li);

    // Each row has 3 columns: background image, icon, text
    const columns = [...row.children];

    if (columns.length >= 3) {
      const [bgImageCol, iconCol, textCol] = columns;

      // Create image wrapper for background image
      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('storystack-image-wrapper');

      // Process background image
      const bgPicture = bgImageCol.querySelector('picture');
      if (bgPicture) {
        const bgImg = bgPicture.querySelector('img');
        if (bgImg) {
          const optimizedBg = createOptimizedPicture(bgImg.src, bgImg.alt, false, [{ width: '750' }]);
          moveInstrumentation(bgImg, optimizedBg.querySelector('img'));
          imageWrapper.appendChild(optimizedBg);
        }
      }

      // Process icon image (overlay on background)
      const iconPicture = iconCol.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        if (iconImg) {
          const iconContainer = document.createElement('div');
          iconContainer.classList.add('storystack-icon');
          const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '200' }]);
          moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
          iconContainer.appendChild(optimizedIcon);
          imageWrapper.appendChild(iconContainer);
        }
      }

      li.appendChild(imageWrapper);

      // Process text content
      const textWrapper = document.createElement('div');
      textWrapper.classList.add('storystack-content');

      while (textCol.firstElementChild) {
        textWrapper.appendChild(textCol.firstElementChild);
      }

      li.appendChild(textWrapper);
    }

    ul.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(ul);

  // Add navigation if more than one story
  if (ul.children.length > 1) {
    const nav = document.createElement('div');
    nav.classList.add('storystack-nav');

    [...ul.children].forEach((_, index) => {
      const button = document.createElement('button');
      button.classList.add('storystack-nav-button');
      button.setAttribute('aria-label', `Go to story ${index + 1}`);
      if (index === 0) button.classList.add('active');
      button.addEventListener('click', () => {
        showStory(block, index);
      });
      nav.appendChild(button);
    });

    block.appendChild(nav);
  }

  // Initialize first story as active
  if (ul.children.length > 0) {
    ul.children[0].classList.add('active');
  }
}
