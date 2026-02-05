/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for AT&T Business site cleanup
 * Purpose: Remove navigation, footer, and unwanted elements
 * Applies to: AT&T Business pages (www.business.att.com)
 * Generated: 2026-02-05
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Initial cleanup - before block parsing
    // Remove navigation, header elements that block content access

    WebImporter.DOMUtils.remove(element, [
      '.global-navigation',
      '.main-header-wrapper',
      '.headband-swiper-container',
      '#headband-container',
      'header',
      'nav'
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Final cleanup - after block parsing
    // Remove footer and any remaining non-content elements

    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.footer',
      '#summaryCost-wrapper',
      '.video-overlay',
      '.cookie-disclaimer-component',
      'form',
      '.form',
      '.contact-form',
      '.rai-form',
      '.cookie-banner',
      '.video-container',
      'iframe',
      'link',
      'script',
      'style'
    ]);

    // Combine consecutive ul elements into a single list (only unclassed ones)
    let changed = true;
    while (changed) {
      changed = false;
      const uls = Array.from(element.querySelectorAll('ul:not([class])'));
      for (let i = 0; i < uls.length - 1; i++) {
        const currentUl = uls[i];
        const nextUl = uls[i + 1];
        // Check if they are actually siblings
        if (nextUl && currentUl.nextElementSibling === nextUl) {
          // Move all children from next ul to current ul
          Array.from(nextUl.children).forEach((child) => {
            currentUl.appendChild(child);
          });
          nextUl.remove();
          changed = true;
          break; // Restart the loop since DOM has changed
        }
      }
    }

    // Note: Previously removed content after hero for hero-only migration
    // Now preserving all blocks (hero, cards, banner) for full page migration
  }
}
