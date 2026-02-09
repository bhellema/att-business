import { moveInstrumentation } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/placeholders.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');

  // Skip clones for active slide tracking
  if (slide.classList.contains('carousel-slide-clone')) {
    return;
  }

  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide:not(.carousel-slide-clone)');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

export function showSlide(block, slideIndex = 0, behavior = 'smooth') {
  const realSlides = block.querySelectorAll('.carousel-slide:not(.carousel-slide-clone)');
  const slidesContainer = block.querySelector('.carousel-slides');
  const allSlides = Array.from(slidesContainer.querySelectorAll('.carousel-slide'));
  const totalRealSlides = realSlides.length;

  // Determine the target slide index
  let targetPhysicalIndex;
  let needsWrap = false;
  let wrapToIndex;

  if (slideIndex >= totalRealSlides) {
    // Going forward past the last slide - scroll to first slide clone at the end
    targetPhysicalIndex = allSlides.length - 1;
    needsWrap = true;
    wrapToIndex = 1; // Real first slide is at index 1 (after the prepended clone)
    block.dataset.activeSlide = 0;
  } else if (slideIndex < 0) {
    // Going backward past the first slide - scroll to last slide clone at the beginning
    targetPhysicalIndex = 0;
    needsWrap = true;
    wrapToIndex = totalRealSlides; // Real last slide is at index totalRealSlides
    block.dataset.activeSlide = totalRealSlides - 1;
  } else {
    // Normal navigation - add 1 to account for prepended clone
    targetPhysicalIndex = slideIndex + 1;
    block.dataset.activeSlide = slideIndex;
  }

  const targetSlide = allSlides[targetPhysicalIndex];

  // Safety check - if targetSlide doesn't exist, exit early
  if (!targetSlide) {
    return;
  }

  targetSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));

  // Add smooth scroll class for animated transition
  if (behavior === 'smooth') {
    slidesContainer.classList.add('smooth-scroll');
  }

  slidesContainer.scrollTo({
    top: 0,
    left: targetSlide.offsetLeft,
    behavior: 'auto', // Always use auto, CSS class controls smoothness
  });

  // After animation completes, snap to the real slide if we wrapped
  if (needsWrap && behavior === 'smooth') {
    setTimeout(() => {
      // Remove smooth scroll for instant snap
      slidesContainer.classList.remove('smooth-scroll');
      slidesContainer.scrollLeft = allSlides[wrapToIndex].offsetLeft;
    }, 600);
  } else if (behavior === 'smooth') {
    // Remove smooth scroll class after animation
    setTimeout(() => {
      slidesContainer.classList.remove('smooth-scroll');
    }, 600);
  }
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class= "slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;

    container.append(slideNavButtons);
  }

  const createdSlides = [];
  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    createdSlides.push(slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  // Create clones for infinite loop effect
  if (!isSingleSlide && createdSlides.length > 0) {
    // Clone last slide and prepend it
    const lastSlideClone = createdSlides[createdSlides.length - 1].cloneNode(true);
    lastSlideClone.classList.add('carousel-slide-clone');
    lastSlideClone.removeAttribute('id');
    lastSlideClone.setAttribute('aria-hidden', 'true');
    slidesWrapper.prepend(lastSlideClone);

    // Clone first slide and append it
    const firstSlideClone = createdSlides[0].cloneNode(true);
    firstSlideClone.classList.add('carousel-slide-clone');
    firstSlideClone.removeAttribute('id');
    firstSlideClone.setAttribute('aria-hidden', 'true');
    slidesWrapper.append(firstSlideClone);
  }

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    // Initialize active slide to 0
    block.dataset.activeSlide = 0;

    bindEvents(block);
    // Initialize to show the first real slide (index 1 with clones)
    const allSlides = slidesWrapper.querySelectorAll('.carousel-slide');
    if (allSlides.length > 1) {
      slidesWrapper.scrollTo({
        top: 0,
        left: allSlides[1].offsetLeft,
        behavior: 'auto',
      });
    }
  }
}
