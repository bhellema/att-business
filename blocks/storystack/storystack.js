import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Build image panel (left side on desktop)
  const imagePanel = document.createElement('div');
  imagePanel.classList.add('storystack-image-panel');

  // Build items panel (right side on desktop)
  const itemsPanel = document.createElement('div');
  itemsPanel.classList.add('storystack-items');

  rows.forEach((row, index) => {
    const columns = [...row.children];
    if (columns.length < 3) return;

    const [bgImageCol, iconCol, textCol] = columns;

    // Create image slide for the image panel
    const imageSlide = document.createElement('div');
    imageSlide.classList.add('storystack-image');
    if (index === 0) imageSlide.classList.add('active');

    const bgPicture = bgImageCol.querySelector('picture');
    if (bgPicture) {
      imageSlide.appendChild(bgPicture);
    } else {
      const bgImg = bgImageCol.querySelector('img');
      if (bgImg) imageSlide.appendChild(bgImg);
    }
    imagePanel.appendChild(imageSlide);

    // Create item row for the items panel
    const item = document.createElement('div');
    item.classList.add('storystack-item');
    if (index === 0) item.classList.add('active');
    moveInstrumentation(row, item);

    // Icon
    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('storystack-item-icon');
    const iconPicture = iconCol.querySelector('picture');
    if (iconPicture) {
      iconWrapper.appendChild(iconPicture);
    } else {
      const iconImg = iconCol.querySelector('img');
      if (iconImg) iconWrapper.appendChild(iconImg);
    }
    item.appendChild(iconWrapper);

    // Text content
    const textWrapper = document.createElement('div');
    textWrapper.classList.add('storystack-item-text');
    while (textCol.firstElementChild) {
      textWrapper.appendChild(textCol.firstElementChild);
    }
    item.appendChild(textWrapper);

    // Hover and click handlers
    item.addEventListener('mouseenter', () => {
      activateItem(block, index);
    });
    item.addEventListener('click', () => {
      activateItem(block, index);
    });

    itemsPanel.appendChild(item);
  });

  block.textContent = '';
  block.appendChild(imagePanel);
  block.appendChild(itemsPanel);
}

function activateItem(block, index) {
  const images = block.querySelectorAll('.storystack-image');
  const items = block.querySelectorAll('.storystack-item');

  images.forEach((img, i) => {
    img.classList.toggle('active', i === index);
  });
  items.forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
}
