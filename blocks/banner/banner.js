export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`banner-${cols.length}-cols`);

  // Find image and move it to direct child of banner as picture element
  const img = block.querySelector('img');
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

    // Add picture as direct child of banner
    block.appendChild(picture);
  }
}
