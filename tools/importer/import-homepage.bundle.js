var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-business.js
  function parse(element, { document }) {
    let heroImage = null;
    let imageAlt = "";
    let theme = "";
    const heroWrapper = element.closest(".hero-wrapper") || element.querySelector(".hero-wrapper");
    if (heroWrapper) {
      if (heroWrapper.classList.contains("theme-dark-bg-img")) {
        theme = "dark";
      } else if (heroWrapper.classList.contains("theme-light-bg-img")) {
        theme = "light";
      }
    }
    if (!theme) {
      if (element.classList.contains("theme-dark-bg-img")) {
        theme = "dark";
      } else if (element.classList.contains("theme-light-bg-img")) {
        theme = "light";
      }
    }
    if (!theme) {
      theme = "light";
    }
    const heroAbsoluteFill = element.querySelector(".custom-hero-absolute-fill[data-desktop]");
    if (heroAbsoluteFill) {
      const desktopImageUrl = heroAbsoluteFill.getAttribute("data-desktop");
      if (desktopImageUrl) {
        heroImage = { src: desktopImageUrl, alt: "" };
      }
    }
    if (!heroImage) {
      const allImages = Array.from(element.querySelectorAll("img"));
      heroImage = allImages.find((img) => img.src && img.src.includes("hp-dsk"));
    }
    if (!heroImage) {
      heroImage = element.querySelector(".bg-hero-panel img, .bg-art img");
    }
    if (!heroImage) {
      heroImage = element.querySelector(".hero-panel-image img, .visible-mobile");
    }
    if (heroImage && heroImage.src && heroImage.src.includes("hp-mbl")) {
      const desktopSrc = heroImage.src.replace("hp-mbl", "hp-dsk");
      heroImage = { src: desktopSrc, alt: heroImage.alt };
    }
    imageAlt = heroImage && heroImage.alt || "";
    const textContent = document.createElement("div");
    const eyebrow = element.querySelector(".eyebrow-xxxl-desktop, .eyebrow-heading");
    let heading = element.querySelector(".heading-seo");
    if (!heading || !heading.textContent.trim()) {
      const allH2s = element.querySelectorAll("h2");
      for (const h2 of allH2s) {
        if (h2.textContent.trim()) {
          heading = h2;
          break;
        }
      }
    }
    const paragraphs = Array.from(element.querySelectorAll(".wysiwyg-editor p, .type-base p, .type-legal p"));
    const ctaLinks = Array.from(element.querySelectorAll(".cta-container a, a[href]")).filter((link) => {
      const href = link.getAttribute("href");
      return href && !href.startsWith("javascript:") && link.textContent.trim();
    });
    if (eyebrow) {
      const eyebrowEl = document.createElement("p");
      eyebrowEl.className = "eyebrow";
      eyebrowEl.textContent = eyebrow.textContent.trim();
      textContent.appendChild(eyebrowEl);
    }
    if (heading) {
      const headingEl = document.createElement("h2");
      headingEl.textContent = heading.textContent.trim();
      textContent.appendChild(headingEl);
    }
    paragraphs.forEach((p) => {
      if (p.textContent.trim()) {
        const descEl = document.createElement("p");
        descEl.textContent = p.textContent.trim();
        textContent.appendChild(descEl);
      }
    });
    ctaLinks.slice(0, 2).forEach((link) => {
      const ctaEl = document.createElement("p");
      const linkEl = document.createElement("a");
      linkEl.href = link.getAttribute("href");
      linkEl.textContent = link.textContent.trim();
      ctaEl.appendChild(linkEl);
      textContent.appendChild(ctaEl);
    });
    const pictureEl = document.createElement("picture");
    if (heroImage) {
      const imgEl = document.createElement("img");
      imgEl.src = heroImage.src;
      imgEl.alt = imageAlt;
      pictureEl.appendChild(imgEl);
    }
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(" field:image "));
    imageFrag.appendChild(pictureEl);
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    textFrag.appendChild(textContent);
    const cells = [
      [imageFrag],
      // Row 1, column 1
      [textFrag]
      // Row 2, column 1
    ];
    const blockName = `hero-business (${theme})`;
    const block = WebImporter.Blocks.createBlock(document, { name: blockName, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const cardElements = element.querySelectorAll(".tile-card");
    const cells = [];
    const cardsToProcess = Array.from(cardElements).slice(0, 6);
    cardsToProcess.forEach((card) => {
      const imgElement = card.querySelector(".card-img img");
      const imageAlt = imgElement && imgElement.alt || "";
      const pictureEl = document.createElement("picture");
      if (imgElement) {
        const imgEl = document.createElement("img");
        imgEl.src = imgElement.src;
        imgEl.alt = imageAlt;
        pictureEl.appendChild(imgEl);
      }
      const eyebrow = card.querySelector(".eyebrow-text");
      const heading = card.querySelector(".heading-md, h3");
      const description = card.querySelector(".tileSubheading p");
      const pricingSection = card.querySelector(".price-comp");
      const termsSection = card.querySelector(".terms");
      const ctaLink = card.querySelector(".tile-anchor");
      const textContent = document.createElement("div");
      if (eyebrow && eyebrow.textContent.trim()) {
        const eyebrowEl = document.createElement("p");
        eyebrowEl.className = "eyebrow";
        eyebrowEl.textContent = eyebrow.textContent.trim();
        textContent.appendChild(eyebrowEl);
      }
      if (heading) {
        const headingEl = document.createElement("h3");
        headingEl.textContent = heading.textContent.trim();
        textContent.appendChild(headingEl);
      }
      if (description) {
        const descEl = document.createElement("p");
        descEl.textContent = description.textContent.trim();
        textContent.appendChild(descEl);
      }
      if (pricingSection) {
        const priceAmount = pricingSection.querySelector(".price-amount-qty");
        const priceDisclosure = pricingSection.querySelector(".price-disclosure");
        const priceStarts = pricingSection.querySelector(".starts");
        if (priceAmount || priceStarts) {
          const pricingEl = document.createElement("p");
          let pricingText = "";
          if (priceStarts) {
            pricingText += priceStarts.textContent.trim() + " ";
          }
          if (priceAmount) {
            pricingText += priceAmount.textContent.trim();
          }
          if (priceDisclosure) {
            pricingText += " " + priceDisclosure.textContent.trim();
          }
          pricingEl.textContent = pricingText.trim();
          textContent.appendChild(pricingEl);
        }
      }
      if (termsSection && termsSection.textContent.trim()) {
        const termsEl = document.createElement("p");
        termsEl.className = "terms";
        const termsClone = termsSection.cloneNode(true);
        const linksInTerms = termsClone.querySelectorAll("a");
        linksInTerms.forEach((link) => link.remove());
        termsEl.textContent = termsClone.textContent.trim();
        textContent.appendChild(termsEl);
      }
      if (ctaLink) {
        const ctaEl = document.createElement("p");
        const linkEl = document.createElement("a");
        linkEl.href = ctaLink.href;
        linkEl.textContent = ctaLink.textContent.trim();
        ctaEl.appendChild(linkEl);
        textContent.appendChild(ctaEl);
      }
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      imageFrag.appendChild(pictureEl);
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      textFrag.appendChild(textContent);
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-quiet.js
  function parse3(element, { document }) {
    const cardElements = element.querySelectorAll(".generic-list-icon-vp");
    if (cardElements.length === 0) {
      console.warn("No cards-quiet elements found");
      return;
    }
    const cells = [];
    cardElements.forEach((card) => {
      const imgElement = card.querySelector("img");
      const imageAlt = imgElement && imgElement.alt || "";
      const pictureEl = document.createElement("picture");
      if (imgElement) {
        const imgEl = document.createElement("img");
        imgEl.src = imgElement.src;
        imgEl.alt = imageAlt;
        pictureEl.appendChild(imgEl);
      }
      const heading = card.querySelector("h4");
      const descriptionEl = card.querySelector(".description");
      const descriptionP = descriptionEl ? descriptionEl.querySelector("p") : null;
      const terms = card.querySelector(".type-legal p, .type-legal-wysiwyg-editor p");
      const ctaLink = card.querySelector("a.primary-cta");
      const textContent = document.createElement("div");
      if (heading) {
        const headingEl = document.createElement("h4");
        headingEl.textContent = heading.textContent.trim();
        textContent.appendChild(headingEl);
      }
      const descText = descriptionP ? descriptionP.textContent.trim() : descriptionEl ? descriptionEl.textContent.trim() : "";
      if (descText) {
        const descEl = document.createElement("p");
        descEl.textContent = descText;
        textContent.appendChild(descEl);
      }
      if (terms && terms.textContent.trim()) {
        const termsEl = document.createElement("p");
        termsEl.className = "terms";
        termsEl.textContent = terms.textContent.trim();
        textContent.appendChild(termsEl);
      }
      if (ctaLink) {
        const ctaEl = document.createElement("p");
        const linkEl = document.createElement("a");
        linkEl.href = ctaLink.href;
        linkEl.textContent = ctaLink.textContent.trim();
        ctaEl.appendChild(linkEl);
        textContent.appendChild(ctaEl);
      }
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      imageFrag.appendChild(pictureEl);
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      textFrag.appendChild(textContent);
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-quiet", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/banner-list.js
  function parse4(element, { document }) {
    let bannerElements = [];
    if (element.classList.contains("hero")) {
      bannerElements = [element];
    } else {
      bannerElements = Array.from(element.querySelectorAll(".card.flex-card"));
    }
    if (bannerElements.length === 0) {
      console.warn("No banner elements found");
      return;
    }
    const bannerItems = [];
    bannerElements.forEach((banner, index) => {
      let theme = "";
      if (banner.classList.contains("theme-light-bg-img")) {
        theme = "light";
      } else if (banner.classList.contains("theme-dark-bg-img")) {
        theme = "dark";
      }
      if (!theme) {
        theme = "light";
      }
      let imageSrc = "";
      let imageAlt = "";
      const styleAttr = banner.getAttribute("style");
      if (styleAttr) {
        const match = styleAttr.match(/--image-desktop:\s*url\(([^)]+)\)/);
        if (match && match[1]) {
          imageSrc = match[1].trim();
          imageSrc = imageSrc.replace(/^['"]|['"]$/g, "");
        }
      }
      const imgElement = banner.querySelector("img");
      if (!imageSrc && imgElement && imgElement.src) {
        imageSrc = imgElement.src;
      }
      if (imgElement && imgElement.alt) {
        imageAlt = imgElement.alt;
      }
      const pictureEl = document.createElement("picture");
      if (imageSrc) {
        const imgEl = document.createElement("img");
        imgEl.src = imageSrc;
        imgEl.alt = imageAlt || "";
        pictureEl.appendChild(imgEl);
      }
      const eyebrow = banner.querySelector(".eyebrow-lg-desktop, .eyebrow-lg-tablet, .eyebrow-lg-mobile, .eyebrow-xxxl-desktop, .eyebrow-xxxl-tablet, .eyebrow-xxxl-mobile");
      const heading = banner.querySelector("h3.heading-lg-desktop, h3, h2.heading-xxl-desktop, h2");
      const description = banner.querySelector(".type-base p, .wysiwyg-editor p");
      const terms = banner.querySelector(".type-legal p, .type-legal-wysiwyg-editor p");
      let ctaLinks = [];
      const flexCardCta = banner.querySelector(".flexCardItemCta a, .anchor4-button-link");
      if (flexCardCta) {
        ctaLinks.push(flexCardCta);
      } else {
        const ctaContainer = banner.querySelector(".cta-container");
        if (ctaContainer) {
          ctaLinks = Array.from(ctaContainer.querySelectorAll("a"));
        }
      }
      const textContent = document.createElement("div");
      if (eyebrow && eyebrow.textContent.trim()) {
        const eyebrowEl = document.createElement("p");
        eyebrowEl.className = "eyebrow";
        eyebrowEl.textContent = eyebrow.textContent.trim();
        textContent.appendChild(eyebrowEl);
      }
      if (heading) {
        const headingEl = document.createElement("h2");
        headingEl.textContent = heading.textContent.trim();
        textContent.appendChild(headingEl);
      }
      if (description) {
        const descEl = document.createElement("p");
        descEl.textContent = description.textContent.trim();
        textContent.appendChild(descEl);
      }
      if (terms && terms.textContent.trim()) {
        const termsEl = document.createElement("p");
        termsEl.className = "terms";
        termsEl.textContent = terms.textContent.trim();
        textContent.appendChild(termsEl);
      }
      ctaLinks.forEach((ctaLink) => {
        if (ctaLink) {
          const ctaEl = document.createElement("p");
          const linkEl = document.createElement("a");
          linkEl.href = ctaLink.href;
          linkEl.textContent = ctaLink.textContent.trim();
          ctaEl.appendChild(linkEl);
          textContent.appendChild(ctaEl);
        }
      });
      const classesText = `banner-item, ${theme}`;
      bannerItems.push([classesText, pictureEl, textContent]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "banner-list",
      cells: bannerItems
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel.js
  function parse5(element, { document }) {
    const slideElements = element.querySelectorAll(".swiper-slide");
    if (slideElements.length === 0) {
      console.warn("No carousel slides found");
      return;
    }
    const cells = [];
    slideElements.forEach((slide) => {
      const headingSection = slide.querySelector(".heading-section p b");
      const headingText = headingSection ? headingSection.textContent.trim() : "";
      const bodyText = slide.querySelector(".body-text p, .type-base p");
      const bodyTextContent = bodyText ? bodyText.textContent.trim() : "";
      const legalText = slide.querySelector(".legal-container .legal-text p");
      const legalTextContent = legalText ? legalText.innerHTML.trim() : "";
      const textContent = document.createElement("div");
      if (headingText) {
        const headingEl = document.createElement("p");
        const strongEl = document.createElement("strong");
        strongEl.textContent = headingText;
        headingEl.appendChild(strongEl);
        textContent.appendChild(headingEl);
      }
      if (bodyTextContent) {
        const bodyEl = document.createElement("p");
        bodyEl.textContent = bodyTextContent;
        textContent.appendChild(bodyEl);
      }
      if (legalTextContent) {
        const legalEl = document.createElement("p");
        legalEl.innerHTML = legalTextContent;
        textContent.appendChild(legalEl);
      }
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:media "));
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:content "));
      textFrag.appendChild(textContent);
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/storystack.js
  function parse6(element, { document }) {
    const duplicateImage = element.querySelector(".ss-visual-img-container");
    if (duplicateImage) {
      duplicateImage.remove();
    }
    const storystackContainer = element.querySelector("#storystack-container");
    if (!storystackContainer) {
      console.warn("No storystack container found");
      return;
    }
    const storySlides = storystackContainer.querySelectorAll(".swiper-slide");
    if (storySlides.length === 0) {
      console.warn("No storystack slides found");
      return;
    }
    const cells = [];
    storySlides.forEach((story) => {
      const bgImage = story.querySelector(".swiper-image");
      const bgImageSrc = bgImage ? bgImage.src : "";
      const bgImageAlt = bgImage ? bgImage.alt : "";
      const bgPictureEl = document.createElement("picture");
      if (bgImage) {
        const bgImgEl = document.createElement("img");
        bgImgEl.src = bgImageSrc;
        bgImgEl.alt = bgImageAlt;
        bgPictureEl.appendChild(bgImgEl);
      }
      const iconImage = story.querySelector(".story-icon-img");
      const iconImageSrc = iconImage ? iconImage.src : "";
      const iconImageAlt = iconImage ? iconImage.alt : "";
      const iconPictureEl = document.createElement("picture");
      if (iconImage) {
        const iconImgEl = document.createElement("img");
        iconImgEl.src = iconImageSrc;
        iconImgEl.alt = iconImageAlt;
        iconPictureEl.appendChild(iconImgEl);
      }
      const heading = story.querySelector(".ss-desktop-container .heading-sm");
      const description = story.querySelector(".ss-desktop-container .story-description p");
      const textContent = document.createElement("div");
      if (heading) {
        const h3El = document.createElement("h3");
        h3El.textContent = heading.textContent.trim();
        textContent.appendChild(h3El);
      }
      if (description) {
        const pEl = document.createElement("p");
        pEl.innerHTML = description.innerHTML.trim();
        textContent.appendChild(pEl);
      }
      const bgImageFrag = document.createDocumentFragment();
      bgImageFrag.appendChild(document.createComment(" field:image "));
      bgImageFrag.appendChild(bgPictureEl);
      const iconFrag = document.createDocumentFragment();
      iconFrag.appendChild(document.createComment(" field:icon "));
      iconFrag.appendChild(iconPictureEl);
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      textFrag.appendChild(textContent);
      cells.push([bgImageFrag, iconFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "storystack", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/att-business-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".global-navigation",
        ".main-header-wrapper",
        ".headband-swiper-container",
        "#headband-container",
        "header",
        "nav"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "footer",
        ".footer",
        "#summaryCost-wrapper",
        ".video-overlay",
        ".cookie-disclaimer-component",
        "form",
        ".form",
        ".contact-form",
        ".rai-form",
        ".cookie-banner",
        ".video-container",
        "iframe",
        "link",
        "script",
        "style"
      ]);
      let changed = true;
      while (changed) {
        changed = false;
        const uls = Array.from(element.querySelectorAll("ul:not([class])"));
        for (let i = 0; i < uls.length - 1; i++) {
          const currentUl = uls[i];
          const nextUl = uls[i + 1];
          if (nextUl && currentUl.nextElementSibling === nextUl) {
            Array.from(nextUl.children).forEach((child) => {
              currentUl.appendChild(child);
            });
            nextUl.remove();
            changed = true;
            break;
          }
        }
      }
    }
  }

  // tools/importer/transformers/section-wrapper.js
  function createTextDiv(document, text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const { document } = payload;
    const startEl = Array.from(element.querySelectorAll("h2")).find(
      (h2) => h2.textContent.trim() === "Why work with AT&T Business?"
    );
    if (!startEl) return;
    const endEl = Array.from(element.querySelectorAll(".micro-banner")).find(
      (p) => p.textContent.includes("Try AT&T Business for 30 days")
    );
    if (!endEl) return;
    const sectionMetadata = WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: [
        [createTextDiv(document, "Style"), createTextDiv(document, "neutral")]
      ]
    });
    const hrBefore = document.createElement("hr");
    startEl.parentElement.insertBefore(hrBefore, startEl);
    const hrAfter = document.createElement("hr");
    endEl.parentElement.insertBefore(sectionMetadata, endEl);
    endEl.parentElement.insertBefore(hrAfter, endEl);
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-business": parse,
    "cards": parse2,
    "cards-quiet": parse3,
    "banner-list": parse4,
    "carousel": parse5,
    "storystack": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AT&T Business homepage with hero section",
    urls: [
      "https://www.business.att.com/"
    ],
    blocks: [
      {
        name: "hero-business",
        instances: [".hero"]
      },
      {
        name: "cards",
        instances: [".multi-tile-row"]
      },
      {
        name: "banner-list",
        instances: [".flex-cards"]
      },
      {
        name: "cards-quiet",
        instances: [".generic-list-icon-vp-row"]
      },
      {
        name: "carousel",
        instances: [".banner-section.swiper"]
      },
      {
        name: "storystack",
        instances: [".story-stack"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, payload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    /**
     * Main transformation function
     * @param {Object} payload - Contains { document, url, html, params }
     * @returns {Array} Array of output objects with element, path, and report
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "/index").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
