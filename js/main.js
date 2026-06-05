(function () {
  const cfg = window.SITE_CONFIG || {};

  function homePage() {
    return cfg.homePage || "index.html";
  }

  function catalogPage() {
    return cfg.catalogPage || "san-pham.html";
  }

  function registerPageUrl(productId) {
    var page = cfg.registerPage || "dang-ky.html";
    if (productId) {
      return page + "?product=" + encodeURIComponent(productId);
    }
    return page;
  }

  function buyPageUrl(productId) {
    var page = cfg.purchasePage || "mua.html";
    if (productId) {
      return page + "?product=" + encodeURIComponent(productId);
    }
    return page;
  }

  function getProductLabel(productId) {
    var p = findProduct(productId);
    if (!p) return productId || "";
    return p.registerLabel || p.shortName || p.name || productId;
  }

  function publicAssetPath(file) {
    if (!file) return "";
    return String(file).replace(/^\//, "");
  }

  function assetPath(file) {
    if (!file) return "";
    var base = (cfg.assetsFolder || "").trim();
    if (!base) return file;
    return base.replace(/\/$/, "") + "/" + file.replace(/^\//, "");
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function siteBaseUrl() {
    var seo = cfg.seo || {};
    return String(seo.siteUrl || "").replace(/\/$/, "");
  }

  function upsertMeta(name, content) {
    if (!content) return;
    var el = document.querySelector('meta[name="' + name + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function upsertOg(property, content) {
    if (!content) return;
    var el = document.querySelector('meta[property="' + property + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", property);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function upsertCanonical(href) {
    if (!href) return;
    var el = document.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  }

  function initProductSeo(product) {
    if (!product || !product.seo) return;
    var seo = product.seo;
    var base = siteBaseUrl();
    var slug = seo.slug || String(product.page || "").replace(/\.html$/i, "");
    var canonical = base && slug ? base + "/" + slug : "";

    if (seo.title) document.title = seo.title;
    upsertMeta("description", seo.description);
    upsertMeta("keywords", seo.keywords);
    upsertCanonical(canonical);
    upsertOg("og:title", seo.title || product.name);
    upsertOg("og:description", seo.description || product.tagline);
    if (canonical) upsertOg("og:url", canonical);

    var h1 = document.getElementById("product-page-title");
    if (h1 && product.name) h1.textContent = product.name;
    setText("product-page-tagline", product.tagline);
  }

  function initMeta() {
    var brand = cfg.siteBrand || cfg.appName || "Phần mềm đường bộ";
    var tagline = cfg.siteTagline || cfg.tagline || "";
    var productId = document.body.getAttribute("data-product-id");
    var product = productId ? findProduct(productId) : null;
    var pageType = document.body.getAttribute("data-page");

    if (product) {
      initProductSeo(product);
      if (!product.seo) {
        document.title = product.name + " — " + brand;
        setText("product-page-title", product.name);
        setText("product-page-tagline", product.tagline);
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && product.tagline) metaDesc.setAttribute("content", product.tagline);
      }
    } else if (pageType === "catalog") {
      document.title = "Phần mềm — " + brand;
    } else if (pageType === "register") {
      document.title = "Đăng ký — " + brand;
    } else if (pageType === "purchase") {
      document.title = "Mua phần mềm — " + brand;
    }

    setText("app-name", brand);
    setText("app-name-footer", brand);
    setText("footer-brand", brand);

    const playLinks = document.querySelectorAll("[data-play-store]");
    playLinks.forEach((a) => {
      a.href = cfg.playStoreUrl;
      if (product && !product.hasPlayStore) a.hidden = true;
    });

    const mail = document.getElementById("support-email");
    if (mail && cfg.supportEmail && !cfg.supportEmail.includes("[")) {
      mail.href = "mailto:" + cfg.supportEmail;
      mail.textContent = "✉️ " + cfg.supportEmail;
    }

    initBrandImages();
    initHeroBanner();
    initZaloContact();
    initProducts();
    lockProductForm(product);
    initProductBreadcrumb(product);
    initProductShopHero(product);
    initProductFeatures(product);
    initProductIntroVideo(product);
  }

  function formatVnd(amount) {
    if (amount == null || amount === "" || isNaN(Number(amount))) return "Liên hệ";
    return Number(amount).toLocaleString("vi-VN") + " vnđ";
  }

  function getPriceUnit(p) {
    if (p && p.priceUnit != null && p.priceUnit !== "") return p.priceUnit;
    var u = (cfg.productPricing || {}).priceUnit;
    return u != null && u !== "" ? u : "/năm";
  }

  function formatProductPrice(amount, p) {
    if (amount == null || amount === "" || isNaN(Number(amount))) return "Liên hệ";
    return formatVnd(amount) + getPriceUnit(p);
  }

  function getProductPricing(p) {
    var base = cfg.productPricing || {};
    if (p && (p.isFree || p.price === 0)) {
      return { price: 0, priceOriginal: null, isFree: true, label: p.priceLabel || "Miễn phí" };
    }
    var priceOriginal =
      p && Object.prototype.hasOwnProperty.call(p, "priceOriginal")
        ? p.priceOriginal
        : null;
    return {
      price: p.price != null ? p.price : base.price,
      priceOriginal: priceOriginal,
      isFree: false,
      label: null,
      priceUnit: getPriceUnit(p),
    };
  }

  function renderProductDetailPricing(product) {
    var pricingEl = document.getElementById("product-shop-pricing");
    if (!pricingEl || !product) return;

    pricingEl.hidden = false;
    var pricing = getProductPricing(product);

    if (pricing.isFree) {
      pricingEl.innerHTML =
        '<span class="product-price-current product-price-free">' +
        escapeHtml(pricing.label || "Miễn phí") +
        "</span>";
      return;
    }

    var html = "";
    if (pricing.priceOriginal && pricing.priceOriginal > pricing.price) {
      html +=
        '<span class="product-price-old">' +
        escapeHtml(formatProductPrice(pricing.priceOriginal, product)) +
        "</span> ";
    }
    html +=
      '<span class="product-price-current">' +
      escapeHtml(formatProductPrice(pricing.price, product)) +
      "</span>";
    pricingEl.innerHTML = html;
  }

  function getProductDownloadUrl(p) {
    if (p.hasPlayStore && cfg.playStoreUrl) {
      return cfg.playStoreUrl;
    }
    if (p.downloadUrl) {
      return publicAssetPath(p.downloadUrl);
    }
    var msg = "Xin chào, tôi muốn tải / demo: " + (p.name || "");
    return getZaloUrl(msg) || registerPageUrl(p.id);
  }

  function initProductShopHero(product) {
    if (!product) return;
    var hero = document.getElementById("product-shop-hero");
    if (!hero) return;

    hero.classList.add("product-shop-hero--" + (product.accent || "blue"));

    var badge = document.getElementById("product-detail-badge");
    if (badge) badge.textContent = product.badge || product.platform || "";

    setText("product-page-title", product.name);
    setText("product-page-tagline", product.tagline);

    var pricingEl = document.getElementById("product-shop-pricing");
    if (pricingEl) {
      renderProductDetailPricing(product);
    }

    var media = document.getElementById("product-shop-media");
    if (media) {
      var imgSrc = productCardImage(product);
      if (!imgSrc && product.cardUseIcon && cfg.icon) {
        imgSrc = assetPath(cfg.icon);
      }
      media.className = "product-shop-media" + productCardImageFitClass(product);
      if (imgSrc) {
        media.innerHTML =
          '<img src="' + escapeHtml(imgSrc) + '" alt="' + escapeHtml(product.name) + '" />';
      } else {
        media.className = "product-shop-media";
        media.innerHTML =
          '<div class="product-shop-placeholder product-shop-placeholder--' +
          escapeHtml(product.accent || "blue") +
          '"><span>' +
          escapeHtml(product.shortName || product.name) +
          "</span><small>" +
          escapeHtml(product.placeholderSub || product.badge || product.platform || "") +
          "</small></div>";
      }
    }

    var downloadBtn = document.getElementById("product-btn-download");
    if (downloadBtn) {
      var dl = getProductDownloadUrl(product);
      downloadBtn.href = dl;
      if (product.hasPlayStore) {
        downloadBtn.target = "_blank";
        downloadBtn.rel = "noopener noreferrer";
        downloadBtn.removeAttribute("download");
        downloadBtn.innerHTML =
          '<span class="btn-shop-icon" aria-hidden="true">▶</span> CH Play';
        downloadBtn.setAttribute("aria-label", "Tải app trên CH Play");
      } else if (product.downloadUrl) {
        downloadBtn.removeAttribute("target");
        downloadBtn.removeAttribute("rel");
        downloadBtn.setAttribute(
          "download",
          product.downloadFileName || product.downloadUrl.split("/").pop() || "",
        );
        downloadBtn.innerHTML =
          '<span class="btn-shop-icon" aria-hidden="true">⬇</span> Tải xuống';
        downloadBtn.setAttribute(
          "aria-label",
          "Tải " + (product.downloadFileName || "phần mềm"),
        );
      } else {
        downloadBtn.removeAttribute("download");
        downloadBtn.removeAttribute("target");
        downloadBtn.removeAttribute("rel");
        downloadBtn.innerHTML =
          '<span class="btn-shop-icon" aria-hidden="true">⬇</span> Tải xuống';
        downloadBtn.removeAttribute("aria-label");
      }
    }

    var regUrl = registerPageUrl(product.id);
    document.querySelectorAll(".btn-shop-trial, [data-register-href]").forEach(function (a) {
      a.href = regUrl;
    });

    var buyBtn = document.getElementById("product-btn-buy");
    if (buyBtn) {
      if (product.isFree || product.price === 0) {
        buyBtn.hidden = true;
      } else {
        buyBtn.href = buyPageUrl(product.id);
        buyBtn.hidden = false;
      }
    }

    var dispatchPath =
      (cfg.dispatchPortal && cfg.dispatchPortal.path) ||
      (cfg.dispatchPortal && cfg.dispatchPortal.altPath) ||
      "/dashboard/";
    document.querySelectorAll("[data-dispatch-href]").forEach(function (a) {
      a.hidden = !product.hasDispatchPortal;
      if (product.hasDispatchPortal) {
        a.href = dispatchPath;
        var label =
          (cfg.dispatchPortal && cfg.dispatchPortal.loginLabel) || "Điều hành web";
        a.textContent = label;
      }
    });

    var trustList = document.getElementById("product-trust-list");
    if (trustList && Array.isArray(cfg.productTrust)) {
      trustList.innerHTML = cfg.productTrust
        .map(function (item) {
          return (
            "<li><span class=\"product-trust-icon\" aria-hidden=\"true\">✓</span>" +
            "<div><strong>" +
            escapeHtml(item.title) +
            "</strong><span>" +
            escapeHtml(item.desc || "") +
            "</span></div></li>"
          );
        })
        .join("");
    }
  }

  function initProductBreadcrumb(product) {
    if (!product) return;
    var main = document.querySelector("main");
    if (!main || main.querySelector(".breadcrumb")) return;
    var nav = document.createElement("nav");
    nav.className = "breadcrumb breadcrumb--inset";
    nav.setAttribute("aria-label", "Breadcrumb");
    nav.innerHTML =
      '<a href="' +
      escapeHtml(catalogPage()) +
      '">Phần mềm</a><span aria-hidden="true">/</span>' +
      '<span aria-current="page">' +
      escapeHtml(product.shortName || product.name) +
      "</span>";
    var wrap = document.createElement("div");
    wrap.className = "container breadcrumb-wrap";
    wrap.appendChild(nav);
    main.insertBefore(wrap, main.firstChild);
  }

  function productCardImage(p) {
    if (p.cardUseIcon) return "";
    if (p.cardImage) {
      var img = String(p.cardImage);
      if (img.indexOf("assets/") === 0 || img.indexOf("downloads/") === 0) {
        return publicAssetPath(img);
      }
      return assetPath(img);
    }
    return "";
  }

  function productCardImageFitClass(p) {
    return p.cardImageFit === "contain" ? " product-media--contain" : "";
  }

  function productCatalogMediaHtml(p) {
    var altText = (p.seo && p.seo.title) || p.name;

    if (p.cardUseIcon) {
      var iconSrc = assetPath(cfg.icon);
      return (
        '<div class="product-catalog-placeholder product-catalog-placeholder--app">' +
        '<img class="product-catalog-app-icon" src="' +
        escapeHtml(iconSrc) +
        '" alt="' +
        escapeHtml(altText) +
        '" loading="lazy" width="88" height="88" />' +
        "</div>"
      );
    }

    var imgSrc = productCardImage(p);
    if (imgSrc) {
      return (
        '<img src="' +
        escapeHtml(imgSrc) +
        '" alt="' +
        escapeHtml(altText) +
        '" loading="lazy" />'
      );
    }

    return (
      '<div class="product-catalog-placeholder"><span>' +
      escapeHtml(p.platform || "AutoCAD") +
      "</span></div>"
    );
  }

  function renderProductCatalogGrid(container, compact) {
    if (!container) return;
    var products = getProducts();
    container.innerHTML = "";
    container.classList.toggle("products-catalog-grid--compact", !!compact);

    products.forEach(function (p) {
      var href = productPageHref(p);
      var card = document.createElement("a");
      card.className =
        "product-catalog-card product-catalog-card--" + (p.accent || "blue");
      card.href = href;
      card.setAttribute("aria-label", "Xem chi tiết: " + p.name);

      var mediaHtml = productCatalogMediaHtml(p);

      var badgeVariant = p.isFree
        ? "free"
        : String(p.cardBadge || "")
            .toLowerCase()
            .replace(/\s+/g, "-");
      var badgeHtml = p.cardBadge
        ? '<span class="product-catalog-badge product-catalog-badge--' +
          escapeHtml(badgeVariant) +
          '">' +
          escapeHtml(p.cardBadge) +
          "</span>"
        : "";

      card.innerHTML =
        '<div class="product-catalog-media' +
        productCardImageFitClass(p) +
        '">' +
        badgeHtml +
        mediaHtml +
        "</div>" +
        '<div class="product-catalog-body">' +
        "<h3>" +
        escapeHtml(p.name) +
        "</h3>" +
        '<p class="product-catalog-summary">' +
        escapeHtml(p.cardSummary || p.tagline || "") +
        "</p>" +
        (cfg.showCatalogPrice === true
          ? '<p class="product-catalog-price">' +
            (p.isFree || p.price === 0
              ? escapeHtml(p.priceLabel || "Miễn phí")
              : escapeHtml(formatVnd(getProductPricing(p).price))) +
            "</p>"
          : "") +
        "</div>";

      container.appendChild(card);
    });
  }

  function productPageHref(p) {
    var page = p.page || homePage();
    if (page.indexOf(".") === -1) return page + ".html";
    return page;
  }

  function lockProductForm(product) {
    if (!product) return;
    var wrap = document.getElementById("product-select-wrap");
    var select = document.getElementById("product");
    var locked = document.getElementById("product-locked-display");
    if (select && select.tagName === "SELECT") {
      select.value = product.id;
    }
    if (locked) {
      locked.hidden = false;
      locked.textContent = "Loại phần mềm: " + (product.registerLabel || product.name);
    }
    if (wrap) wrap.hidden = true;
    if (select) select.required = false;
  }

  function getProducts() {
    return Array.isArray(cfg.products) ? cfg.products : [];
  }

  function findProduct(id) {
    return getProducts().find(function (p) {
      return p.id === id;
    });
  }

  function initProductFeatures(product) {
    if (!product) return;
    var root = document.getElementById("product-features-root");
    if (!root) return;

    var section = document.getElementById("product-features-section");
    var fs = product.featuresSection || {};
    var accent = product.accent || "blue";

    if (section) {
      section.classList.add("product-features-section--" + accent);
    }

    setText("product-features-eyebrow", fs.eyebrow || "Tính năng");
    setText("product-features-title", fs.title || "Tính năng sản phẩm");
    setText("product-features-sub", fs.subtitle || "");

    var highlights = Array.isArray(product.featureHighlights)
      ? product.featureHighlights
      : [];
    var features = Array.isArray(product.features) ? product.features : [];

    var html = "";

    if (highlights.length) {
      html +=
        '<ul class="highlights-top product-feature-highlights" role="list">' +
        highlights
          .map(function (item) {
            return (
              '<li class="highlight-top-item highlight-top-item--' +
              escapeHtml(accent) +
              '"><span class="highlight-top-icon highlight-top-icon--emoji" aria-hidden="true">' +
              escapeHtml(item.icon || "✓") +
              '</span><span class="highlight-top-text highlight-top-text--stack"><strong>' +
              escapeHtml(item.title) +
              "</strong><small>" +
              escapeHtml(item.desc || "") +
              "</small></span></li>"
            );
          })
          .join("") +
        "</ul>";
    }

    if (features.length) {
      html += '<div class="highlights-panel"><div class="features-grid product-features-grid">';
      features.forEach(function (item) {
        html +=
          '<article class="feature-card"><div class="feature-icon" aria-hidden="true">' +
          escapeHtml(item.icon || "✓") +
          "</div><h3>" +
          escapeHtml(item.title) +
          "</h3><p>" +
          escapeHtml(item.desc || "") +
          "</p></article>";
      });
      html += "</div></div>";
    }

    root.innerHTML = html;
  }

  function initProductIntroVideo(product) {
    var section = document.getElementById("product-intro-video-section");
    var root = document.getElementById("product-intro-video");
    if (!root || !product || !product.introVideo) {
      if (section) section.hidden = true;
      return;
    }

    var v = product.introVideo;
    setText("product-video-title", v.title || "Video giới thiệu sản phẩm");
    setText("product-video-sub", v.description || "");

    var id = String(v.youtubeId || "").trim();
    var valid = id && !id.startsWith("VIDEO_ID");

    var embedHtml = '<div class="video-embed video-embed--landscape">';
    if (valid) {
      embedHtml +=
        '<iframe src="https://www.youtube.com/embed/' +
        encodeURIComponent(id) +
        '?rel=0&modestbranding=1" title="' +
        escapeHtml(v.title || "Video giới thiệu") +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    } else {
      embedHtml +=
        '<div class="video-placeholder"><p><strong>Video giới thiệu</strong></p><p>Thêm <code>introVideo.youtubeId</code> trong <code>js/config.js</code></p></div>';
    }
    embedHtml += "</div>";

    root.innerHTML = embedHtml;
    if (section) section.hidden = false;
  }

  function initProducts() {
    var products = getProducts();
    var pills = document.getElementById("hero-pills");
    var stack = document.getElementById("hero-product-stack");
    var catalogGrid = document.getElementById("products-catalog-grid");
    var select = document.getElementById("product");

    renderProductCatalogGrid(catalogGrid, false);

    if (pills) {
      pills.innerHTML = "";
      products.forEach(function (p) {
        var a = document.createElement("a");
        a.className = "pill";
        a.href = productPageHref(p);
        a.textContent = p.shortName || p.name;
        pills.appendChild(a);
      });
    }

    if (stack) {
      stack.innerHTML = "";
      products.forEach(function (p) {
        var card = document.createElement("a");
        card.className = "hero-product-card hero-product-card--" + (p.accent || "blue");
        card.href = productPageHref(p);
        card.innerHTML =
          '<span class="hero-product-card-badge">' +
          escapeHtml(p.badge || p.platform || "") +
          "</span><strong>" +
          escapeHtml(p.shortName || p.name) +
          "</strong><span>" +
          escapeHtml(p.platform || "") +
          "</span>";
        stack.appendChild(card);
      });
    }

    if (select) {
      var current = select.value;
      select.innerHTML = '<option value="">Loại phần mềm *</option>';
      products.forEach(function (p) {
        var opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.registerLabel || p.name;
        select.appendChild(opt);
      });
      if (current) select.value = current;
    }

    document.querySelectorAll("[data-register-product]").forEach(function (a) {
      a.addEventListener("click", function () {
        var id = a.getAttribute("data-register-product");
        if (select && id) select.value = id;
      });
    });

    applyProductFromUrl();
    initBuyLinks();
  }

  function initBuyLinks() {
    var productId = document.body.getAttribute("data-product-id") || "";
    var select = document.getElementById("product");
    if (!productId && select && select.value) {
      productId = select.value;
    }
    if (!productId) {
      var params = new URLSearchParams(window.location.search);
      productId = params.get("product") || "";
    }
    document.querySelectorAll("[data-buy-link]").forEach(function (a) {
      a.href = buyPageUrl(productId);
    });
  }

  function escapeHtml(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function applyProductFromUrl() {
    var select = document.getElementById("product");
    var bodyProduct = document.body.getAttribute("data-product-id");
    if (bodyProduct && findProduct(bodyProduct)) {
      lockProductForm(findProduct(bodyProduct));
      return;
    }
    if (!select || select.tagName !== "SELECT") return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get("product");
    if (id && findProduct(id)) {
      select.value = id;
      var pageType = document.body.getAttribute("data-page");
      if (pageType === "register" || pageType === "purchase") {
        lockProductForm(findProduct(id));
      }
    }
  }

  function normalizeZaloPhone(phone) {
    var d = String(phone || "").replace(/\D/g, "");
    if (!d || d.length < 9) return "";
    if (d.indexOf("84") === 0) return d;
    if (d.charAt(0) === "0") return "84" + d.slice(1);
    return "84" + d;
  }

  function formatPhoneDisplay(phone) {
    var z = cfg.zalo || {};
    if (z.phoneDisplay) return z.phoneDisplay;
    var d = String(phone || "").replace(/\D/g, "");
    if (d.indexOf("84") === 0 && d.length >= 11) d = "0" + d.slice(2);
    if (d.length === 10) {
      return d.slice(0, 4) + "." + d.slice(4, 7) + "." + d.slice(7);
    }
    return phone || "";
  }

  function getZaloUrl(customMessage) {
    var z = cfg.zalo || {};
    var digits = normalizeZaloPhone(z.phone || cfg.supportPhone);
    if (!digits) return "";
    var url = "https://zalo.me/" + digits;
    var msg = customMessage || z.defaultMessage;
    if (msg) {
      url += "?message=" + encodeURIComponent(msg);
    }
    return url;
  }

  function getZaloIconHtml() {
    var z = cfg.zalo || {};
    var src = publicAssetPath(z.icon || "assets/zalo-mark.svg");
    return (
      '<img class="zalo-float-btn-icon" src="' +
      escapeHtml(src) +
      '" alt="" width="48" height="48" loading="lazy" decoding="async">'
    );
  }

  function getZaloFloatButton() {
    var z = cfg.zalo || {};
    if (z.floatButton) return z.floatButton;
    if (Array.isArray(z.floatButtons) && z.floatButtons.length) {
      return z.floatButtons[0];
    }
    return { label: "Chat Zalo", variant: "blue" };
  }

  function initZaloFloatStack() {
    var stack =
      document.getElementById("zalo-float-stack") ||
      document.getElementById("zalo-float");
    if (!stack) return;

    stack.id = "zalo-float-stack";
    stack.className = "zalo-float-stack";
    stack.removeAttribute("hidden");

    var z = cfg.zalo || {};
    var digits = normalizeZaloPhone(z.phone || cfg.supportPhone);
    if (!digits) {
      stack.hidden = true;
      return;
    }

    var phoneShow = formatPhoneDisplay(z.phone || cfg.supportPhone);
    var btn = getZaloFloatButton();
    var href = getZaloUrl(btn.message || z.defaultMessage);
    var variant = btn.variant || "blue";

    stack.innerHTML =
      '<a class="zalo-float-btn zalo-float-btn--' +
      escapeHtml(variant) +
      '" href="' +
      escapeHtml(href) +
      '" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo ' +
      escapeHtml(phoneShow) +
      '">' +
      getZaloIconHtml() +
      '<span class="zalo-float-btn-body">' +
      '<span class="zalo-float-btn-label">' +
      escapeHtml(btn.label || "Chat Zalo") +
      '</span><span class="zalo-float-btn-phone">' +
      escapeHtml(phoneShow) +
      "</span></span></a>";
  }

  window.getZaloUrl = getZaloUrl;

  function initZaloContact() {
    var url = getZaloUrl();
    var phoneDisplay = formatPhoneDisplay((cfg.zalo || {}).phone || cfg.supportPhone);

    document.querySelectorAll("[data-zalo-link]").forEach(function (a) {
      if (url) {
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.classList.remove("is-disabled");
        a.removeAttribute("aria-disabled");
      } else {
        a.hidden = true;
      }
    });

    var phoneText = phoneDisplay || "";
    document.querySelectorAll("[data-zalo-phone]").forEach(function (el) {
      el.textContent = phoneText;
    });

    initZaloFloatStack();
  }

  function brandLogoPath() {
    if (cfg.siteLogo) return publicAssetPath(cfg.siteLogo);
    return assetPath(cfg.icon);
  }

  function initBrandImages() {
    var logo = brandLogoPath();

    document.querySelectorAll("[data-app-icon]").forEach(function (img) {
      if (cfg.showSiteLogo === false || !logo) {
        img.hidden = true;
        return;
      }
      img.hidden = false;
      img.src = logo;
      img.alt = cfg.siteBrand || cfg.appName || "Logo";
    });

    if (logo) {
      var favicon = document.querySelector('link[rel="icon"]');
      if (favicon) favicon.href = logo;
    }
  }

  function initHeroBanner() {
    const bannerImg = document.getElementById("hero-banner-img");
    if (bannerImg && cfg.banner) {
      bannerImg.src = assetPath(cfg.banner);
      bannerImg.alt = cfg.appName + " — minh họa ứng dụng";
    }

  }

  function initScreenshotLightbox() {
    var lb = document.getElementById("shot-lightbox");
    var lbImg = document.getElementById("shot-lightbox-img");
    var lbCap = document.getElementById("shot-lightbox-caption");
    var closeBtn = lb && lb.querySelector(".shot-lightbox-close");
    if (!lb || !lbImg) return;

    function open(src, caption) {
      lbImg.src = src;
      lbImg.alt = caption;
      if (lbCap) lbCap.textContent = caption;
      lb.hidden = false;
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function close() {
      lb.hidden = true;
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lbImg.src = "";
    }

    if (closeBtn) closeBtn.addEventListener("click", close);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lb.hidden) close();
    });

    return open;
  }

  function initScreenshots() {
    const grid = document.getElementById("screenshot-grid");
    if (!grid || !cfg.screenshots) return;

    const openLightbox = initScreenshotLightbox();

    grid.innerHTML = "";
    cfg.screenshots.forEach((shot, index) => {
      const card = document.createElement("article");
      card.className = "shot-card";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "shot-zoom";
      btn.setAttribute("aria-label", "Phóng to: " + shot.caption);

      const phone = document.createElement("div");
      phone.className = "phone-frame";

      const frame = document.createElement("div");
      frame.className = "shot-frame";

      const img = document.createElement("img");
      const src = assetPath(shot.file);
      img.src = src;
      img.alt = shot.caption;
      img.loading = index < 2 ? "eager" : "lazy";
      img.decoding = "async";
      if (index < 2) img.setAttribute("fetchpriority", "high");

      const placeholder = document.createElement("div");
      placeholder.className = "shot-placeholder";
      placeholder.hidden = true;
      placeholder.innerHTML =
        "<strong>Ảnh " +
        (index + 1) +
        "</strong><br/>Thiếu file<br/><code>" +
        src +
        "</code>";

      img.onerror = function () {
        img.style.display = "none";
        placeholder.hidden = false;
      };

      img.onload = function () {
        if (img.naturalWidth) {
          img.sizes = "(max-width: 700px) 96vw, 48vw";
        }
      };

      frame.appendChild(img);
      frame.appendChild(placeholder);
      phone.appendChild(frame);

      const hint = document.createElement("span");
      hint.className = "shot-zoom-hint";
      hint.textContent = "Bấm để phóng to";

      btn.appendChild(phone);
      btn.appendChild(hint);

      if (openLightbox) {
        btn.addEventListener("click", function () {
          openLightbox(src, shot.caption);
        });
      }

      const cap = document.createElement("p");
      cap.className = "shot-caption";
      cap.textContent = shot.caption;

      card.appendChild(btn);
      card.appendChild(cap);
      grid.appendChild(card);
    });
  }

  function shouldShowVideos() {
    if (cfg.showVideos === false) return false;
    if (cfg.showVideos === true) return true;
    if (!cfg.videos || !cfg.videos.length) return false;
    return cfg.videos.some(function (v) {
      var id = String(v.youtubeId || "").trim();
      return id && !id.startsWith("VIDEO_ID");
    });
  }

  function initVideoSection() {
    var show = shouldShowVideos();
    var section = document.getElementById("video");
    if (section) section.hidden = !show;

    document.querySelectorAll('a[href="#video"]').forEach(function (a) {
      a.hidden = !show;
    });
  }

  function initVideos() {
    initVideoSection();
    if (!shouldShowVideos()) return;

    const grid = document.getElementById("videos-grid");
    if (!grid || !cfg.videos) return;

    grid.innerHTML = "";
    cfg.videos.forEach((video) => {
      const card = document.createElement("article");
      card.className = "video-card";
      card.id = "video-" + video.id;

      const title = document.createElement("h3");
      title.textContent = video.title;

      const desc = document.createElement("p");
      desc.textContent = video.description;

      const embed = document.createElement("div");
      embed.className = "video-embed";

      const id = (video.youtubeId || "").trim();
      const valid = id && !id.startsWith("VIDEO_ID");

      if (valid) {
        const iframe = document.createElement("iframe");
        iframe.src =
          "https://www.youtube.com/embed/" +
          encodeURIComponent(id) +
          "?rel=0&modestbranding=1";
        iframe.title = video.title;
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        embed.appendChild(iframe);
      } else {
        const ph = document.createElement("div");
        ph.className = "video-placeholder";
        ph.innerHTML =
          "<p><strong>Video " +
          video.id +
          "</strong></p><p>Thêm <code>youtubeId</code> trong <code>js/config.js</code></p>";
        embed.appendChild(ph);
      }

      const body = document.createElement("div");
      body.className = "video-body";
      body.appendChild(title);
      body.appendChild(desc);

      card.appendChild(embed);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const err = document.querySelector('[data-error-for="' + inputId + '"]');
    if (input) input.setAttribute("aria-invalid", "true");
    if (err) {
      err.textContent = message;
      err.classList.add("visible");
    }
    return false;
  }

  function clearErrors() {
    document.querySelectorAll(".form-error").forEach((el) => {
      el.classList.remove("visible");
      el.textContent = "";
    });
    document.querySelectorAll("[aria-invalid]").forEach((el) => {
      el.removeAttribute("aria-invalid");
    });
  }

  function validateForm(data) {
    clearErrors();
    let ok = true;

    if (!data.name || data.name.length < 2) {
      showError("fullName", "Vui lòng nhập họ tên (ít nhất 2 ký tự).");
      ok = false;
    }
    if (!/^[\d\s+().-]{9,15}$/.test(data.phone.replace(/\s/g, ""))) {
      showError("phone", "Số điện thoại không hợp lệ.");
      ok = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showError("email", "Vui lòng nhập đúng địa chỉ Gmail / email.");
      ok = false;
    }
    if (!data.province || data.province.length < 5) {
      showError("address", "Vui lòng nhập địa chỉ (ít nhất 5 ký tự).");
      ok = false;
    }
    if (!data.productId) {
      showError("product", "Vui lòng chọn loại phần mềm.");
      ok = false;
    }
    return ok;
  }

  window.validateRegisterForm = validateForm;

  async function submitPurchaseLead(payload) {
    var telegramOk = false;
    try {
      await notifyTelegram(payload);
      telegramOk = true;
    } catch (tgErr) {
      console.warn("[Telegram]", tgErr);
      notifyTelegramBeacon(payload);
    }

    var firestoreOk = false;
    try {
      await submitLeadToFirestore(payload);
      firestoreOk = true;
    } catch (fsErr) {
      console.error("[Firestore] Ghi leads thất bại:", fsErr);
      if (!telegramOk) {
        throw fsErr;
      }
    }
    if (telegramOk && !firestoreOk) {
      throw new Error(
        "Đã gửi Telegram nhưng chưa lưu License Admin (Firestore). Liên hệ kỹ thuật hoặc thử lại sau."
      );
    }

    return { ok: true };
  }

  window.submitPurchaseLead = submitPurchaseLead;

  async function submitLeadToFirestore(payload) {
    var db = window.firebaseDb;
    if (!db) {
      throw new Error("Chưa kết nối Firebase — kiểm tra js/config.js và firebase SDK.");
    }

    var doc = {
      name: payload.name,
      phone: payload.phone,
      email: payload.email.toLowerCase(),
      company: payload.productLabel || payload.company || "",
      productId: payload.productId || "",
      province: payload.province,
      note: payload.note || "",
      status: payload.leadType === "purchase" ? "pending_payment" : "new",
      leadType: payload.leadType || "trial",
      source: "landing_page",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    if (payload.leadType === "purchase") {
      doc.amount = Number(payload.amount) || 0;
      doc.transferNote = payload.transferNote || "";
    }

    await db.collection("leads").add(doc);

    return { ok: true };
  }

  function telegramApiUrl() {
    return window.location.origin + "/api/telegram-lead";
  }

  async function notifyTelegram(payload) {
    var url = telegramApiUrl();
    var res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    if (!res.ok) {
      var data = await res.json().catch(function () {
        return {};
      });
      throw new Error(data.hint || data.error || "Telegram lỗi " + res.status);
    }
    return true;
  }

  function notifyTelegramBeacon(payload) {
    if (!navigator.sendBeacon) return false;
    try {
      var blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      return navigator.sendBeacon(telegramApiUrl(), blob);
    } catch {
      return false;
    }
  }

  function showFormSuccess(form, status) {
    if (status) {
      status.className = "form-status success";
      status.textContent =
        "Cảm ơn bạn đã đăng ký. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.";
    }
    form.reset();
    form.querySelectorAll("input, textarea, button").forEach(function (el) {
      el.disabled = true;
    });
    var card = form.closest(".register-page-card") || form.closest(".register-form-card");
    if (card) card.classList.add("is-submitted");
  }

  function initForm() {
    const form = document.getElementById("register-form");
    if (!form) return;

    const status = document.getElementById("form-status");
    const btn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearErrors();

      const productEl = form.product;
      const productId = productEl ? productEl.value.trim() : "";
      const productLabel = getProductLabel(productId);
      const payload = {
        name: form.fullName.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        productId: productId,
        product: productLabel,
        company: productLabel,
        productLabel: productLabel,
        province: form.address.value.trim(),
        note: "Trang: " + window.location.href,
        leadType: "trial",
      };

      if (!validateForm(payload)) return;

      if (status) {
        status.className = "form-status";
        status.textContent = "Đang gửi thông tin…";
      }
      if (btn) btn.disabled = true;

      try {
        var telegramOk = false;
        try {
          await notifyTelegram(payload);
          telegramOk = true;
        } catch (tgErr) {
          console.warn("[Telegram]", tgErr);
          notifyTelegramBeacon(payload);
        }

        var firestoreOk = false;
        try {
          await submitLeadToFirestore(payload);
          firestoreOk = true;
        } catch (fsErr) {
          console.error("[Firestore] Ghi leads thất bại:", fsErr);
          if (!telegramOk) {
            throw fsErr;
          }
        }
        if (telegramOk && !firestoreOk && status) {
          status.className = "form-status error";
          status.textContent =
            "Đã gửi Telegram nhưng chưa lưu License Admin (Firestore). Liên hệ kỹ thuật hoặc thử lại sau.";
          if (btn) btn.disabled = false;
          return;
        }

        sessionStorage.setItem("quanlysuco_lead", JSON.stringify(payload));
        showFormSuccess(form, status);
      } catch (err) {
        if (status) {
          status.className = "form-status error";
          status.textContent =
            (err.message || "Lỗi gửi form") +
            " — kiểm tra Firestore rules đã Publish chưa.";
        }
        if (btn) btn.disabled = false;
      }
    });
  }

  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMeta();
    initScreenshots();
    initVideos();
    initForm();
    initMobileNav();
  });
})();
