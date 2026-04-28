var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // tools/importer/parsers/hero-carousel.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll("li.mplus-banner__item");
    const seenBgSrcs = /* @__PURE__ */ new Set();
    const uniqueSlides = [];
    slides.forEach((slide) => {
      const bgImg = slide.querySelector(".mplus-banner__background img");
      const src = bgImg ? bgImg.getAttribute("src") : null;
      if (src && !seenBgSrcs.has(src)) {
        seenBgSrcs.add(src);
        uniqueSlides.push(slide);
      } else if (!src) {
        uniqueSlides.push(slide);
      }
    });
    const ITEM_COL_COUNT = 9;
    const cells = [];
    const autoplayCell = document.createDocumentFragment();
    autoplayCell.appendChild(document.createComment(" field:autoplay "));
    autoplayCell.appendChild(document.createTextNode("true"));
    const intervalCell = document.createDocumentFragment();
    intervalCell.appendChild(document.createComment(" field:autoplayInterval "));
    intervalCell.appendChild(document.createTextNode("5000"));
    const blockRow = [autoplayCell, intervalCell];
    while (blockRow.length < ITEM_COL_COUNT) {
      blockRow.push("");
    }
    cells.push(blockRow);
    uniqueSlides.forEach((slide) => {
      const bgPicture = slide.querySelector(".mplus-banner__background picture");
      const bgImg = slide.querySelector(".mplus-banner__background img");
      const bgCell = document.createDocumentFragment();
      bgCell.appendChild(document.createComment(" field:backgroundImage "));
      if (bgPicture) {
        bgCell.appendChild(bgPicture.cloneNode(true));
      } else if (bgImg) {
        bgCell.appendChild(bgImg.cloneNode(true));
      }
      const titleImg = slide.querySelector(".mplus-banner__info > .mplus-banner__image img");
      const titleImgCell = document.createDocumentFragment();
      titleImgCell.appendChild(document.createComment(" field:titleImage "));
      if (titleImg) {
        const pic = document.createElement("picture");
        pic.appendChild(titleImg.cloneNode(true));
        titleImgCell.appendChild(pic);
      }
      const headingEl = slide.querySelector("h1.mplus-banner__title, h2.mplus-banner__title");
      const headingCell = document.createDocumentFragment();
      headingCell.appendChild(document.createComment(" field:heading "));
      if (headingEl) {
        headingCell.appendChild(document.createTextNode(headingEl.textContent.trim()));
      }
      const descContainer = slide.querySelector(".mplus-banner__text");
      const descP = descContainer ? descContainer.querySelector("p") : null;
      const descCell = document.createDocumentFragment();
      descCell.appendChild(document.createComment(" field:description "));
      if (descP) {
        descCell.appendChild(descP.cloneNode(true));
      } else if (descContainer) {
        const p = document.createElement("p");
        p.innerHTML = descContainer.innerHTML;
        descCell.appendChild(p);
      }
      const priceNumberDiv = slide.querySelector("div.mplus-price__number");
      const priceIntSpan = priceNumberDiv ? priceNumberDiv.querySelector(":scope > span.mplus-price__number") : null;
      const priceIntCell = document.createDocumentFragment();
      priceIntCell.appendChild(document.createComment(" field:priceInteger "));
      if (priceIntSpan) {
        priceIntCell.appendChild(document.createTextNode(priceIntSpan.textContent.trim()));
      }
      const priceDecSpan = slide.querySelector("span.mplus-price__decimals");
      const priceDecCell = document.createDocumentFragment();
      priceDecCell.appendChild(document.createComment(" field:priceDecimal "));
      if (priceDecSpan) {
        priceDecCell.appendChild(document.createTextNode(priceDecSpan.textContent.trim()));
      }
      const priceSuffixSpan = slide.querySelector("span.mplus-price__text");
      const priceSuffixCell = document.createDocumentFragment();
      priceSuffixCell.appendChild(document.createComment(" field:priceSuffix "));
      if (priceSuffixSpan) {
        priceSuffixCell.appendChild(document.createTextNode(priceSuffixSpan.textContent.trim()));
      }
      const ctaLink = slide.querySelector("a.mplus-button");
      const ctaCell = document.createDocumentFragment();
      ctaCell.appendChild(document.createComment(" field:cta "));
      if (ctaLink) {
        const a = document.createElement("a");
        a.href = ctaLink.getAttribute("href") || "";
        a.textContent = ctaLink.textContent.trim();
        ctaCell.appendChild(a);
      }
      const disclaimerP = slide.querySelector(".mplus-price__link p");
      const disclaimerCell = document.createDocumentFragment();
      disclaimerCell.appendChild(document.createComment(" field:disclaimer "));
      if (disclaimerP) {
        disclaimerCell.appendChild(document.createTextNode(disclaimerP.textContent.trim()));
      }
      cells.push([bgCell, titleImgCell, headingCell, descCell, priceIntCell, priceDecCell, priceSuffixCell, ctaCell, disclaimerCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-dark.js
  function parse2(element, { document }) {
    const image = element.querySelector(".mplus-collection__image img, .mplus-collection__image picture, img");
    const subtitle = element.querySelector("p.mplus-collection__subtitle, .mplus-collection__subtitle");
    const heading = element.querySelector("h2.mplus-collection__title, h1.mplus-collection__title, .mplus-collection__title, h2, h1");
    const descriptionContainer = element.querySelector(".mplus-collection__text");
    const descriptionParagraphs = descriptionContainer ? Array.from(descriptionContainer.querySelectorAll("p")) : [];
    const ctaLink = element.querySelector('a.mplus-button, a.mplus-cta, .mplus-collection__info > a, a[class*="button"]');
    const imageCell = [];
    if (image) {
      const imageHint = document.createComment(" field:image ");
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(imageHint);
      const pictureEl = image.closest("picture") || image;
      imageFrag.appendChild(pictureEl);
      imageCell.push(imageFrag);
    }
    const textFrag = document.createDocumentFragment();
    const textHint = document.createComment(" field:text ");
    textFrag.appendChild(textHint);
    if (subtitle) {
      textFrag.appendChild(subtitle);
    }
    if (heading) {
      textFrag.appendChild(heading);
    }
    descriptionParagraphs.forEach((p) => {
      textFrag.appendChild(p);
    });
    if (ctaLink) {
      const ctaParagraph = document.createElement("p");
      const ctaStrong = document.createElement("strong");
      ctaStrong.appendChild(ctaLink);
      ctaParagraph.appendChild(ctaStrong);
      textFrag.appendChild(ctaParagraph);
    }
    const textCell = [textFrag];
    const cells = [];
    cells.push(imageCell);
    cells.push(textCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-dark", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/plan-selector.js
  function parse3(element, { document }) {
    const heading = element.querySelector("h2.mplus-hero-info__title, h2, h1");
    const cards = Array.from(
      element.querySelectorAll(".mplus-hero-info__details")
    );
    const cells = [];
    const headingFrag = document.createDocumentFragment();
    if (heading) {
      headingFrag.appendChild(document.createComment(" field:heading "));
      headingFrag.appendChild(heading);
    }
    cells.push([headingFrag]);
    cards.forEach((card) => {
      const titleEl = card.querySelector('h3.mplus-hero-info__titlebox, h3, [class*="titlebox"]');
      const titleFrag = document.createDocumentFragment();
      if (titleEl) {
        titleFrag.appendChild(document.createComment(" field:title "));
        titleFrag.appendChild(titleEl);
      }
      const featuresList = card.querySelector(".mplus-hero-info__list ul, ul");
      const featuresFrag = document.createDocumentFragment();
      if (featuresList) {
        featuresFrag.appendChild(document.createComment(" field:features "));
        featuresFrag.appendChild(featuresList);
      }
      const priceIntegerEl = card.querySelector(".mplus-hero-price__number span, .mplus-hero-price__number");
      const priceIntegerFrag = document.createDocumentFragment();
      if (priceIntegerEl) {
        priceIntegerFrag.appendChild(document.createComment(" field:priceInteger "));
        priceIntegerFrag.appendChild(priceIntegerEl);
      }
      const priceDecimalsEl = card.querySelector(".mplus-hero-price__decimals");
      const priceDecimalsFrag = document.createDocumentFragment();
      if (priceDecimalsEl) {
        priceDecimalsFrag.appendChild(document.createComment(" field:priceDecimals "));
        priceDecimalsFrag.appendChild(priceDecimalsEl);
      }
      const periodEl = card.querySelector(".mplus-hero-price__temp");
      const periodFrag = document.createDocumentFragment();
      if (periodEl) {
        periodFrag.appendChild(document.createComment(" field:period "));
        periodFrag.appendChild(periodEl);
      }
      const taxLabelEl = card.querySelector(".mplus-hero-price__imp");
      const taxLabelFrag = document.createDocumentFragment();
      if (taxLabelEl) {
        taxLabelFrag.appendChild(document.createComment(" field:taxLabel "));
        taxLabelFrag.appendChild(taxLabelEl);
      }
      const priceFootnoteEl = card.querySelector(".mplus-hero-price__text");
      const priceFootnoteFrag = document.createDocumentFragment();
      if (priceFootnoteEl) {
        priceFootnoteFrag.appendChild(document.createComment(" field:priceFootnote "));
        const footnoteText = priceFootnoteEl.textContent.trim();
        if (footnoteText) {
          const p = document.createElement("p");
          p.textContent = footnoteText;
          priceFootnoteFrag.appendChild(p);
        }
      }
      const ctaLink = card.querySelector('.mplus-hero-info__cta a, a.mplus-button, a[class*="button"]');
      const ctaFrag = document.createDocumentFragment();
      if (ctaLink) {
        ctaFrag.appendChild(document.createComment(" field:cta "));
        ctaFrag.appendChild(ctaLink);
      }
      const badgeImg = card.querySelector(".mplus-hero-info__icon img, .mplus-hero-info__icon picture");
      const badgeFrag = document.createDocumentFragment();
      if (badgeImg) {
        badgeFrag.appendChild(document.createComment(" field:badge "));
        const pictureEl = badgeImg.closest("picture") || badgeImg;
        badgeFrag.appendChild(pictureEl);
      }
      const isFeatured = card.classList.contains("mplus-hero-info__details--light");
      const featuredFrag = document.createDocumentFragment();
      featuredFrag.appendChild(document.createComment(" field:featured "));
      const featuredText = document.createTextNode(isFeatured ? "true" : "false");
      featuredFrag.appendChild(featuredText);
      cells.push([
        titleFrag,
        featuresFrag,
        priceIntegerFrag,
        priceDecimalsFrag,
        periodFrag,
        taxLabelFrag,
        priceFootnoteFrag,
        ctaFrag,
        badgeFrag,
        featuredFrag
      ]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "plan-selector",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/feature-icons-band.js
  function parse4(element, { document }) {
    const sectionHeading = element.querySelector(":scope > h2, :scope > .wrapper > h2");
    const sectionSubtitle = sectionHeading ? sectionHeading.nextElementSibling && sectionHeading.nextElementSibling.matches("p") ? sectionHeading.nextElementSibling : null : null;
    const items = Array.from(element.querySelectorAll("li.mplus-benefits__box, .mplus-benefits__box"));
    const cells = [];
    items.forEach((item) => {
      const iconImg = item.querySelector(".mplus-benefits__image img, img");
      const heading = item.querySelector('h3.mplus-benefits__boxtitle, h3, [class*="boxtitle"]');
      const body = item.querySelector(".mplus-benefits__boxtext p, .mplus-benefits__boxtext, p");
      const iconCell = document.createDocumentFragment();
      if (iconImg) {
        iconCell.appendChild(document.createComment(" field:icon "));
        iconCell.appendChild(iconImg);
      }
      const headingCell = document.createDocumentFragment();
      if (heading) {
        headingCell.appendChild(document.createComment(" field:heading "));
        headingCell.appendChild(heading);
      }
      const bodyCell = document.createDocumentFragment();
      if (body) {
        bodyCell.appendChild(document.createComment(" field:body "));
        bodyCell.appendChild(body);
      }
      cells.push([iconCell, headingCell, bodyCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "feature-icons-band",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/channel-logos.js
  function parse5(element, { document }) {
    const heading = element.querySelector(".section-header__title, h2");
    const subtitleEl = element.querySelector(".section-header__text p, .section-header__text");
    const logoItems = Array.from(element.querySelectorAll("ul.brand-carousel > li"));
    const cells = [];
    const headerCell = document.createDocumentFragment();
    if (heading) {
      headerCell.appendChild(document.createComment(" field:heading "));
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      headerCell.appendChild(h);
    }
    if (subtitleEl) {
      const subText = subtitleEl.textContent.trim();
      if (subText) {
        headerCell.appendChild(document.createComment(" field:subtitle "));
        const p = document.createElement("p");
        p.textContent = subText;
        headerCell.appendChild(p);
      }
    }
    cells.push([headerCell]);
    logoItems.forEach((li) => {
      const anchor = li.querySelector("a.mplus-collection__image, a");
      const img = li.querySelector("img");
      if (!img) return;
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      const clonedImg = img.cloneNode(true);
      imageCell.appendChild(clonedImg);
      const nameCell = document.createDocumentFragment();
      const channelName = (img.getAttribute("alt") || img.getAttribute("title") || "").replace(/^Logo del Canal\s*/i, "").trim();
      if (channelName) {
        nameCell.appendChild(document.createComment(" field:name "));
        nameCell.appendChild(document.createTextNode(channelName));
      }
      const linkCell = document.createDocumentFragment();
      const href = anchor ? anchor.getAttribute("href") : "";
      if (href) {
        linkCell.appendChild(document.createComment(" field:link "));
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = href;
        linkCell.appendChild(a);
      }
      cells.push([imageCell, nameCell, linkCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "channel-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/media-grid.js
  function parse6(element, { document }) {
    const sectionHeading = element.querySelector(":scope > h2, :scope > h3, :scope > .wrapper > h2, :scope > .wrapper > h3");
    const gridItems = Array.from(element.querySelectorAll("ul.mplus-mosaic__grid > li"));
    const cells = [];
    gridItems.forEach((li) => {
      const isTextCell = li.classList.contains("no-images");
      if (isTextCell) {
        const pretitle = li.querySelector(".pretitle");
        const title = li.querySelector("p.title");
        const bodyEl = li.querySelector(".descriptcion");
        const ctaLink = li.querySelector("a.mplus-button");
        const cellFrag = document.createDocumentFragment();
        cellFrag.appendChild(document.createComment(" field:cell "));
        const cellText = document.createTextNode("text");
        cellFrag.appendChild(cellText);
        const titleFrag = document.createDocumentFragment();
        titleFrag.appendChild(document.createComment(" field:title "));
        if (pretitle) {
          titleFrag.appendChild(pretitle.cloneNode(true));
        }
        if (title) {
          titleFrag.appendChild(title.cloneNode(true));
        }
        const bodyFrag = document.createDocumentFragment();
        if (bodyEl) {
          bodyFrag.appendChild(document.createComment(" field:body "));
          bodyFrag.appendChild(bodyEl.cloneNode(true));
        }
        const ctaFrag = document.createDocumentFragment();
        if (ctaLink) {
          ctaFrag.appendChild(document.createComment(" field:cta "));
          ctaFrag.appendChild(ctaLink.cloneNode(true));
        }
        const imageFrag = document.createDocumentFragment();
        const linkFrag = document.createDocumentFragment();
        const rowSpanFrag = document.createDocumentFragment();
        rowSpanFrag.appendChild(document.createComment(" field:rowSpan "));
        rowSpanFrag.appendChild(document.createTextNode("2"));
        const colSpanFrag = document.createDocumentFragment();
        colSpanFrag.appendChild(document.createComment(" field:colSpan "));
        colSpanFrag.appendChild(document.createTextNode("1"));
        cells.push([cellFrag, titleFrag, bodyFrag, ctaFrag, imageFrag, linkFrag, rowSpanFrag, colSpanFrag]);
      } else {
        const link = li.querySelector("a");
        const href = link ? link.getAttribute("href") : "";
        const img = li.querySelector("img.mplus-mosaic-image-horizontal") || li.querySelector("img.mplus-mosaic-image-square") || li.querySelector("img.mplus-mosaic-image-vertical") || li.querySelector("img");
        const title = li.querySelector("p.title");
        let rowSpan = "1";
        let colSpan = "1";
        if (img) {
          if (img.classList.contains("mplus-mosaic-image-horizontal")) {
            colSpan = "2";
            rowSpan = "1";
          } else if (img.classList.contains("mplus-mosaic-image-vertical")) {
            colSpan = "1";
            rowSpan = "2";
          }
        }
        const cellFrag = document.createDocumentFragment();
        cellFrag.appendChild(document.createComment(" field:cell "));
        cellFrag.appendChild(document.createTextNode("image"));
        const titleFrag = document.createDocumentFragment();
        if (title) {
          titleFrag.appendChild(document.createComment(" field:title "));
          titleFrag.appendChild(title.cloneNode(true));
        }
        const bodyFrag = document.createDocumentFragment();
        const ctaFrag = document.createDocumentFragment();
        const imageFrag = document.createDocumentFragment();
        if (img) {
          imageFrag.appendChild(document.createComment(" field:image "));
          const imgClone = img.cloneNode(true);
          imgClone.removeAttribute("class");
          imageFrag.appendChild(imgClone);
        }
        const linkFrag = document.createDocumentFragment();
        if (href) {
          linkFrag.appendChild(document.createComment(" field:link "));
          const linkEl = document.createElement("a");
          linkEl.setAttribute("href", href);
          linkEl.textContent = title ? title.textContent : href;
          linkFrag.appendChild(linkEl);
        }
        const rowSpanFrag = document.createDocumentFragment();
        rowSpanFrag.appendChild(document.createComment(" field:rowSpan "));
        rowSpanFrag.appendChild(document.createTextNode(rowSpan));
        const colSpanFrag = document.createDocumentFragment();
        colSpanFrag.appendChild(document.createComment(" field:colSpan "));
        colSpanFrag.appendChild(document.createTextNode(colSpan));
        cells.push([cellFrag, titleFrag, bodyFrag, ctaFrag, imageFrag, linkFrag, rowSpanFrag, colSpanFrag]);
      }
    });
    if (sectionHeading) {
      element.parentNode.insertBefore(sectionHeading.cloneNode(true), element);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "media-grid", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/promo-band.js
  function parse7(element, { document }) {
    const isCintillo = element.classList.contains("mplus-cintillo");
    const isPrice = element.classList.contains("mplus-price");
    const hasImageVariant = element.classList.contains("mplus-cintillo--with-image");
    const variantValue = hasImageVariant ? "with-image" : "plain";
    const cells = [];
    const variantFrag = document.createDocumentFragment();
    variantFrag.appendChild(document.createComment(" field:variant "));
    variantFrag.appendChild(document.createTextNode(variantValue));
    cells.push([variantFrag]);
    const bgFrag = document.createDocumentFragment();
    if (isCintillo) {
      const bgImage = element.querySelector(":scope > img");
      if (bgImage) {
        bgFrag.appendChild(document.createComment(" field:backgroundImage "));
        bgFrag.appendChild(bgImage.cloneNode(true));
      }
    }
    cells.push([bgFrag]);
    const iconFrag = document.createDocumentFragment();
    if (isCintillo) {
      const iconPicture = element.querySelector(".mplus-cintillo__image picture");
      const iconImg = element.querySelector(".mplus-cintillo__image img");
      if (iconPicture || iconImg) {
        iconFrag.appendChild(document.createComment(" field:icon "));
        if (iconPicture) {
          iconFrag.appendChild(iconPicture.cloneNode(true));
        } else {
          iconFrag.appendChild(iconImg.cloneNode(true));
        }
      }
    }
    cells.push([iconFrag]);
    const textFrag = document.createDocumentFragment();
    if (isCintillo) {
      const textEl = element.querySelector(".mplus-cintillo__text");
      if (textEl) {
        textFrag.appendChild(document.createComment(" field:text "));
        Array.from(textEl.childNodes).forEach((node) => {
          textFrag.appendChild(node.cloneNode(true));
        });
      }
    } else if (isPrice) {
      const heading = element.querySelector(".section-header__title");
      const priceNumber = element.querySelector(".mplus-price__box .mplus-price__number span.mplus-price__number");
      const priceDecimals = element.querySelector(".mplus-price__box .mplus-price__decimals");
      const priceText = element.querySelector(".mplus-price__box .mplus-price__text");
      const ctaButton = element.querySelector("a.mplus-button");
      const supportText = element.querySelector(".mplus-price__link p");
      const hasContent = heading || priceNumber || ctaButton;
      if (hasContent) {
        textFrag.appendChild(document.createComment(" field:text "));
        if (heading) {
          const h = document.createElement("h2");
          h.textContent = heading.textContent.trim();
          textFrag.appendChild(h);
        }
        if (priceNumber || priceDecimals) {
          const priceLine = document.createElement("p");
          let priceStr = "";
          if (priceNumber) priceStr += priceNumber.textContent.trim();
          if (priceDecimals) priceStr += priceDecimals.textContent.trim();
          if (priceText) priceStr += " " + priceText.textContent.trim();
          priceLine.textContent = priceStr;
          textFrag.appendChild(priceLine);
        }
        if (ctaButton) {
          textFrag.appendChild(ctaButton.cloneNode(true));
        }
        if (supportText) {
          const sp = document.createElement("p");
          sp.textContent = supportText.textContent.trim();
          textFrag.appendChild(sp);
        }
      }
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "promo-band", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/content-carousel.js
  function parse8(element, { document }) {
    const headingEl = element.querySelector("h2.section-header__title, .section-header h2");
    const headingText = headingEl ? headingEl.textContent.trim() : "";
    const items = element.querySelectorAll(".mplus-collection__content ul > li");
    const cells = [];
    items.forEach((item) => {
      const imgContainer = item.querySelector(".mplus-collection__image");
      const img = imgContainer ? imgContainer.querySelector("img") : null;
      const linkEl = imgContainer ? imgContainer.querySelector("a[href]") : null;
      const captionP = item.querySelector(".mplus-collection__text p");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const pic = document.createElement("picture");
        const clonedImg = img.cloneNode(true);
        const src = clonedImg.getAttribute("src") || "";
        if (!src.startsWith("data:image/svg")) {
          pic.appendChild(clonedImg);
          imageCell.appendChild(pic);
        }
      }
      const captionCell = document.createDocumentFragment();
      captionCell.appendChild(document.createComment(" field:caption "));
      if (captionP) {
        captionCell.appendChild(document.createTextNode(captionP.textContent.trim()));
      }
      const linkCell = document.createDocumentFragment();
      linkCell.appendChild(document.createComment(" field:link "));
      if (linkEl) {
        const a = document.createElement("a");
        a.href = linkEl.getAttribute("href") || "";
        a.textContent = linkEl.getAttribute("title") || linkEl.textContent.trim() || a.href;
        linkCell.appendChild(a);
      }
      cells.push([imageCell, captionCell, linkCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "content-carousel", cells });
    if (headingText) {
      const h2 = document.createElement("h2");
      h2.textContent = headingText;
      const wrapper = document.createDocumentFragment();
      wrapper.appendChild(h2);
      wrapper.appendChild(block);
      element.replaceWith(wrapper);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-dark.js
  function parse9(element, { document }) {
    const cardItems = Array.from(
      element.querySelectorAll(
        ".mplus-collection__content ul > li, .mplus-collection__content > ul > li"
      )
    );
    const cells = [];
    cardItems.forEach((li) => {
      const img = li.querySelector(".mplus-collection__image img, img");
      const link = li.querySelector(".mplus-collection__image a, a");
      const imageFrag = document.createDocumentFragment();
      const imageHint = document.createComment(" field:image ");
      imageFrag.appendChild(imageHint);
      if (img) {
        const pictureEl = img.closest("picture") || img;
        imageFrag.appendChild(pictureEl);
      }
      const textFrag = document.createDocumentFragment();
      const textHint = document.createComment(" field:text ");
      textFrag.appendChild(textHint);
      if (link) {
        const cardTitle = link.getAttribute("title") || img && img.getAttribute("alt") || "";
        const a = document.createElement("a");
        a.setAttribute("href", link.getAttribute("href") || "#");
        if (link.getAttribute("title")) {
          a.setAttribute("title", link.getAttribute("title"));
        }
        a.textContent = cardTitle;
        const p = document.createElement("p");
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-dark", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/faq-accordion.js
  function parse10(element, { document }) {
    const heading = element.querySelector(
      'h2.section-header__title, .section-header h2, h2[class*="title"], h2'
    );
    const items = Array.from(
      element.querySelectorAll(
        'li.mplus-accordion__question, li[class*="accordion__question"]'
      )
    );
    const cells = [];
    if (heading) {
      const headingFrag = document.createDocumentFragment();
      headingFrag.appendChild(document.createComment(" field:heading "));
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      headingFrag.appendChild(h2);
      cells.push([headingFrag]);
    }
    for (const item of items) {
      const questionEl = item.querySelector(
        'h3.mplus-accordion__title, h3[class*="accordion__title"], h3'
      );
      const answerEl = item.querySelector(
        'div.mplus-accordion__content, div[class*="accordion__content"]'
      );
      const questionFrag = document.createDocumentFragment();
      questionFrag.appendChild(document.createComment(" field:question "));
      if (questionEl) {
        questionFrag.appendChild(questionEl);
      }
      const answerFrag = document.createDocumentFragment();
      answerFrag.appendChild(document.createComment(" field:answer "));
      if (answerEl) {
        while (answerEl.firstChild) {
          answerFrag.appendChild(answerEl.firstChild);
        }
      }
      cells.push([questionFrag, answerFrag]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "faq-accordion",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/movistarplus-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".carousel-indicators",
        ".carousel-prev",
        ".carousel-next"
      ]);
      element.querySelectorAll("div.anchor").forEach((el) => {
        if (!el.textContent.trim()) {
          el.remove();
        }
      });
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, ["header.mplus-header"]);
      WebImporter.DOMUtils.remove(element, ["footer.mplus-footer"]);
      WebImporter.DOMUtils.remove(element, [
        "#m20D",
        'iframe[src*="mainadv.com"]',
        'iframe[src*="doubleclick.net"]',
        "iframe.ot-text-resize"
      ]);
      element.querySelectorAll("picture > source").forEach((el) => el.remove());
      WebImporter.DOMUtils.remove(element, ["noscript"]);
      WebImporter.DOMUtils.remove(element, ["link"]);
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-carousel": parse,
    "hero-dark": parse2,
    "plan-selector": parse3,
    "feature-icons-band": parse4,
    "channel-logos": parse5,
    "media-grid": parse6,
    "promo-band": parse7,
    "content-carousel": parse8,
    "cards-dark": parse9,
    "faq-accordion": parse10
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Movistar Plus+ homepage with hero content, featured shows, channel listings, and promotional sections",
    urls: [
      "https://www.movistarplus.es/"
    ],
    blocks: [
      {
        name: "hero-carousel",
        instances: ["section#m66c59d1ec3498818d50ec4db"]
      },
      {
        name: "hero-dark",
        instances: ["section#m64ba88277f47881e2325be36", "section#m66191b04c349885e443e0cf2"]
      },
      {
        name: "plan-selector",
        instances: ["section#m698c45f5c349880b3c5d4f69"]
      },
      {
        name: "feature-icons-band",
        instances: ["section#m661d31edc3498864727521d2", "section#m660fcb9fc3498859916b2440"]
      },
      {
        name: "channel-logos",
        instances: ["section#m6788c28c7f4788477b7c1e32"]
      },
      {
        name: "media-grid",
        instances: [
          "section#m64be96b7c34988316053359c",
          "section#m64bfe4887f47880f4d1c8ff2",
          "section#m64bfeb97c349883f0e668272",
          "section#m654d15a0c349883e3e28242d",
          "section#m654d13637f47883dc53d0cdf"
        ]
      },
      {
        name: "promo-band",
        instances: [
          "section#m65f8607f7f4788457b274356",
          "section#m66a8f24c7f4788666e693db0",
          "section#m64bea684c349885f444336c4"
        ]
      },
      {
        name: "content-carousel",
        instances: ["section#m67efc3487f478827303e64d1"]
      },
      {
        name: "cards-dark",
        instances: ["section#m681cbc65c3498813c315f6bc", "section#m6938329bc349884fd4145182"]
      },
      {
        name: "faq-accordion",
        instances: ["section#m665986e97f47883688067ac3"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
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
    transform: (payload) => {
      const { document, url, params } = payload;
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
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
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
