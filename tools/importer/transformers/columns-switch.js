/* eslint-disable */
/* global WebImporter */

/**
 * Columns Transformer — "Switch. Save. Soar." / "Make the switch to AT&T Business"
 *
 * Wraps the offer section into a Columns block with image in column 1
 * and text content in column 2.
 *
 * The transformer runs on the SOURCE page DOM. The H2 and image are in
 * different containers, so we find the image by URL pattern and the
 * content section by its parent container, then build a Columns block table.
 */

function wrapSwitchColumns(element, document) {
  // Find the source container for the "Switch" section — look for the
  // story-tile-row or the nearest ancestor that holds both image and text
  const switchImg = element.querySelector('img[src*="offer-SW-HP"]')
    || element.querySelector('img[src*="story-tile"]');
  const switchH2 = Array.from(element.querySelectorAll('h2')).find(
    (h2) => h2.textContent.trim() === 'Make the switch to AT&T Business',
  );
  if (!switchH2) return;

  // Find the common ancestor that contains both the image and the H2
  // Walk up from the H2 to find a container that also holds the image
  let container = switchH2.parentElement;
  while (container && container !== element) {
    if (switchImg && container.contains(switchImg) && container.contains(switchH2)) {
      break;
    }
    container = container.parentElement;
  }

  // Build column 1: the image
  const td1 = document.createElement('td');
  if (switchImg) {
    const p = document.createElement('p');
    const img = document.createElement('img');
    img.setAttribute('src', switchImg.getAttribute('src'));
    img.setAttribute('alt', switchImg.getAttribute('alt') || '');
    p.appendChild(img);
    td1.appendChild(p);
  }

  // Build column 2: text content from the H2's immediate container
  const td2 = document.createElement('td');

  // Get eyebrow (sibling before H2)
  const eyebrow = switchH2.previousElementSibling;
  if (eyebrow) {
    const eyebrowP = document.createElement('p');
    eyebrowP.textContent = eyebrow.textContent.trim();
    td2.appendChild(eyebrowP);
  }

  // H2
  const h2El = document.createElement('h2');
  h2El.textContent = switchH2.textContent.trim();
  td2.appendChild(h2El);

  // Description and list — walk forward from H2
  let sibling = switchH2.nextElementSibling;
  while (sibling) {
    // Find text content (wysiwyg-editor divs, list items, CTA links)
    const text = sibling.textContent.trim();
    if (text) {
      // Check for bullet points / perks
      const listItems = sibling.querySelectorAll('li');
      if (listItems.length > 0) {
        // First add any intro text before the list
        const introText = sibling.querySelector('p, .wysiwyg-editor');
        if (introText && introText.textContent.trim()) {
          const pEl = document.createElement('p');
          pEl.textContent = introText.textContent.trim();
          td2.appendChild(pEl);
        }
        const ul = document.createElement('ul');
        listItems.forEach((li) => {
          const liEl = document.createElement('li');
          liEl.textContent = li.textContent.trim();
          ul.appendChild(liEl);
        });
        td2.appendChild(ul);
      } else {
        // Check for CTA links
        const links = sibling.querySelectorAll('a[href]');
        if (links.length > 0) {
          links.forEach((link) => {
            if (link.textContent.trim() && !link.getAttribute('href').startsWith('javascript:')) {
              const pEl = document.createElement('p');
              const aEl = document.createElement('a');
              aEl.setAttribute('href', link.getAttribute('href'));
              aEl.textContent = link.textContent.trim();
              pEl.appendChild(aEl);
              td2.appendChild(pEl);
            }
          });
        } else if (!sibling.querySelector('img')) {
          const pEl = document.createElement('p');
          pEl.textContent = text;
          td2.appendChild(pEl);
        }
      }
    }
    sibling = sibling.nextElementSibling;
  }

  // Build the block table
  const table = document.createElement('table');

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('th');
  headerCell.setAttribute('colspan', '2');
  headerCell.textContent = 'Columns';
  headerRow.appendChild(headerCell);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  const contentRow = document.createElement('tr');
  contentRow.appendChild(td1);
  contentRow.appendChild(td2);
  tbody.appendChild(contentRow);
  table.appendChild(tbody);

  // Replace the source container with our block table
  // Walk up from H2 to find the story-tile level container
  let storyContainer = switchH2.closest('.story-tile-row')
    || switchH2.closest('[class*="story-tile"]')
    || switchH2.closest('[class*="offer"]');

  if (!storyContainer && container && container !== element) {
    storyContainer = container;
  }

  if (storyContainer) {
    storyContainer.replaceWith(table);
  }
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const { document } = payload;
  wrapSwitchColumns(element, document);
}
