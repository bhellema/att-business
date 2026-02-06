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

    // Find image and move it to direct child of banner item as picture element
    const img = banner.querySelector('img');
    if (img) {
      // Create picture element
      const picture = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt;
      picture.appendChild(newImg);

      // Remove the image column from DOM
      const imgParent = img.closest('div');
      if (imgParent) {
        imgParent.remove();
      }

      // Add picture as direct child of banner item
      banner.appendChild(picture);
    }
  });
}
