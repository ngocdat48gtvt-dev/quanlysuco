(function () {
  const cfg = window.SITE_CONFIG || {};

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

  function initMeta() {
    var brand = cfg.siteBrand || cfg.appName || "Phần mềm đường bộ";
    var tagline = cfg.siteTagline || cfg.tagline || "";
    var productId = document.body.getAttribute("data-product-id");
    var product = productId ? findProduct(productId) : null;
    var isHome = document.body.getAttribute("data-page") === "home";

    if (product) {
      document.title = product.name + " — " + brand;
      setText("product-page-title", product.name);
      setText("product-page-tagline", product.tagline);
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && product.tagline) metaDesc.setAttribute("content", product.tagline);
    } else if (document.body.getAttribute("data-page") === "catalog") {
      document.title = "Phần mềm — " + brand;
    } else if (isHome) {
      document.title = brand + " — Đăng ký tư vấn";
      setText("site-brand-hero", brand);
      setText("site-tagline", tagline);
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && tagline) metaDesc.setAttribute("content", tagline);
    }

    setText("app-name", brand);
    setText("app-name-footer", brand);

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
  }

  function initProductBreadcrumb(product) {
    if (!product) return;
    var main = document.querySelector("main");
    if (!main || main.querySelector(".breadcrumb")) return;
    var nav = document.createElement("nav");
    nav.className = "breadcrumb breadcrumb--inset";
    nav.setAttribute("aria-label", "Breadcrumb");
    nav.innerHTML =
      '<a href="index.html">Trang chủ</a><span aria-hidden="true">/</span>' +
      '<a href="san-pham.html">Phần mềm</a><span aria-hidden="true">/</span>' +
      '<span aria-current="page">' +
      escapeHtml(product.shortName || product.name) +
      "</span>";
    var wrap = document.createElement("div");
    wrap.className = "container breadcrumb-wrap";
    wrap.appendChild(nav);
    main.insertBefore(wrap, main.firstChild);
  }

  function productCardImage(p) {
    if (p.cardImage) return assetPath(p.cardImage);
    return "";
  }

  function renderProductCatalogGrid(container, compact) {
    if (!container) return;
    var products = getProducts();
    container.innerHTML = "";
    container.classList.toggle("products-catalog-grid--compact", !!compact);

    products.forEach(function (p) {
      var href = productPageHref(p);
      var imgSrc = productCardImage(p);
      var card = document.createElement("a");
      card.className =
        "product-catalog-card product-catalog-card--" + (p.accent || "blue");
      card.href = href;
      card.setAttribute("aria-label", "Xem chi tiết: " + p.name);

      var mediaHtml = imgSrc
        ? '<img src="' +
          escapeHtml(imgSrc) +
          '" alt="" loading="lazy" />'
        : '<div class="product-catalog-placeholder"><span>Excel → AutoCAD</span></div>';

      var badgeHtml = p.cardBadge
        ? '<span class="product-catalog-badge product-catalog-badge--' +
          escapeHtml(String(p.cardBadge).toLowerCase()) +
          '">' +
          escapeHtml(p.cardBadge) +
          "</span>"
        : "";

      card.innerHTML =
        '<div class="product-catalog-media">' +
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
        '<p class="product-catalog-price">' +
        escapeHtml(p.priceLabel || "Liên hệ") +
        "</p>" +
        "</div>";

      container.appendChild(card);
    });
  }

  function productPageHref(p) {
    var page = p.page || "index.html";
    if (page.indexOf(".") === -1) return page + ".html";
    return page;
  }

  function lockProductForm(product) {
    if (!product) return;
    var wrap = document.getElementById("product-select-wrap");
    var select = document.getElementById("product");
    var hidden = document.querySelector('input[type="hidden"][name="product"]');
    if (wrap) wrap.hidden = true;
    if (select && select.tagName === "SELECT") {
      select.required = false;
      select.value = product.id;
    }
    if (hidden) hidden.value = product.id;
  }

  function getProducts() {
    return Array.isArray(cfg.products) ? cfg.products : [];
  }

  function findProduct(id) {
    return getProducts().find(function (p) {
      return p.id === id;
    });
  }

  function initProducts() {
    var products = getProducts();
    var pills = document.getElementById("hero-pills");
    var stack = document.getElementById("hero-product-stack");
    var catalogGrid = document.getElementById("products-catalog-grid");
    var showcase = document.getElementById("products-showcase");
    var select = document.getElementById("product");

    renderProductCatalogGrid(catalogGrid, false);
    renderProductCatalogGrid(showcase, true);

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
      select.innerHTML = '<option value="">— Chọn sản phẩm —</option>';
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
    if (id && findProduct(id)) select.value = id;
  }

  function normalizeZaloPhone(phone) {
    var d = String(phone || "").replace(/\D/g, "");
    if (!d || d.length < 9) return "";
    if (d.indexOf("84") === 0) return d;
    if (d.charAt(0) === "0") return "84" + d.slice(1);
    return "84" + d;
  }

  function getZaloUrl() {
    var z = cfg.zalo || {};
    var digits = normalizeZaloPhone(z.phone || cfg.supportPhone);
    if (!digits) return "";
    var url = "https://zalo.me/" + digits;
    if (z.defaultMessage) {
      url += "?message=" + encodeURIComponent(z.defaultMessage);
    }
    return url;
  }

  window.getZaloUrl = getZaloUrl;

  function initZaloContact() {
    var url = getZaloUrl();
    var z = cfg.zalo || {};
    var phoneDisplay = (z.phone || cfg.supportPhone || "").trim();
    var label = z.displayName
      ? "Nhắn Zalo — " + z.displayName
      : "Nhắn Zalo ngay";

    document.querySelectorAll("[data-zalo-link]").forEach(function (a) {
      if (url) {
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.classList.remove("is-disabled");
        a.removeAttribute("aria-disabled");
      } else {
        a.href = "#lien-he";
        a.classList.add("is-disabled");
        a.setAttribute("aria-disabled", "true");
        a.title = "Thêm số Zalo trong website/js/config.js → zalo.phone";
      }
      if (a.hasAttribute("data-zalo-label") && url) {
        a.textContent = label;
      }
    });

    var phoneText = phoneDisplay || "— (thêm số trong config.js → zalo.phone)";
    document.querySelectorAll("[data-zalo-phone]").forEach(function (el) {
      el.textContent = phoneText;
    });

    var float = document.getElementById("zalo-float");
    if (float) float.hidden = !url;
  }

  function initBrandImages() {
    const icon = assetPath(cfg.icon);
    if (!icon) return;

    document.querySelectorAll("[data-app-icon]").forEach(function (img) {
      img.src = icon;
    });

    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = icon;
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
      showError("product", "Vui lòng chọn sản phẩm quan tâm.");
      ok = false;
    }
    return ok;
  }

  async function submitLeadToFirestore(payload) {
    var db = window.firebaseDb;
    if (!db) {
      throw new Error("Chưa kết nối Firebase — kiểm tra js/config.js và firebase SDK.");
    }

    await db.collection("leads").add({
      name: payload.name,
      phone: payload.phone,
      email: payload.email.toLowerCase(),
      company: payload.company || "",
      province: payload.province,
      note: payload.note || "",
      status: "new",
      source: "landing_page",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

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
    var card = form.closest(".register-form-card");
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
      const payload = {
        name: form.fullName.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        productId: productId,
        product: (findProduct(productId) || {}).registerLabel || productId,
        company: (findProduct(productId) || {}).registerLabel || productId,
        province: form.address.value.trim(),
        note: "Trang: " + window.location.href,
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

        try {
          await submitLeadToFirestore(payload);
        } catch (fsErr) {
          if (!telegramOk) {
            throw fsErr;
          }
          console.warn("[Firestore]", fsErr);
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
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
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
