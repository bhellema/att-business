import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Set up category navigation toggle (section 2)
  // Desktop: toggle entire row (4 columns); Mobile: toggle individual category
  const isDesktop = window.matchMedia('(min-width: 900px)');
  const catNav = footer.children[1];
  if (catNav) {
    const cols = 4;
    const categories = [...catNav.querySelectorAll(':scope .default-content-wrapper > ul > li')];
    categories.forEach((cat, i) => {
      const heading = cat.querySelector(':scope > p');
      if (heading && cat.querySelector(':scope > ul')) {
        heading.addEventListener('click', () => {
          const isExpanded = cat.getAttribute('aria-expanded') === 'true';
          const targets = isDesktop.matches
            ? categories.slice(Math.floor(i / cols) * cols, Math.floor(i / cols) * cols + cols)
            : [cat];
          targets.forEach((c) => c.setAttribute('aria-expanded', isExpanded ? 'false' : 'true'));
        });
      }
    });
  }

  block.append(footer);
}
