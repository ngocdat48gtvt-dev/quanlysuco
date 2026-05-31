(function () {
  var cfg = window.SITE_CONFIG || {};

  function escapeHtml(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function homePage() {
    return cfg.homePage || "index.html";
  }

  function catalogPage() {
    return cfg.catalogPage || "san-pham.html";
  }

  function registerPage() {
    return cfg.registerPage || "dang-ky.html";
  }

  function products() {
    return Array.isArray(cfg.products) ? cfg.products : [];
  }

  function currentPageFile() {
    var path = window.location.pathname || "";
    var file = path.split("/").pop() || "";
    if (!file || file === "") return homePage();
    if (file.indexOf(".") === -1) return file + ".html";
    return file;
  }

  function normalizePage(name) {
    return String(name || "").replace(/\.html$/i, "").toLowerCase();
  }

  function isSamePage(a, b) {
    return normalizePage(a) === normalizePage(b);
  }

  function productHref(p) {
    var page = p.page || homePage();
    if (page.indexOf(".") === -1) return page + ".html";
    return page;
  }

  function isLandingPage() {
    var f = normalizePage(currentPageFile());
    return f === "index";
  }

  function isCatalogPage() {
    var f = normalizePage(currentPageFile());
    return f === normalizePage(catalogPage());
  }

  function isRegisterPage() {
    return normalizePage(currentPageFile()) === normalizePage(registerPage());
  }

  function isProductPage() {
    return products().some(function (p) {
      return isSamePage(currentPageFile(), productHref(p));
    });
  }

  function registerHref(productId) {
    var base = registerPage();
    if (productId) {
      return base + "?product=" + encodeURIComponent(productId);
    }
    return base;
  }

  function initSiteNav() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;

    var items;
    if (isLandingPage()) {
      items = [
        { href: "#san-pham", label: "Sản phẩm", match: false },
        { href: "#giai-phap", label: "Giải pháp", match: false },
        { href: "#hieu-qua", label: "Hiệu quả", match: false },
        { href: "#faq", label: "FAQ", match: false },
      ];
    } else {
      items = [
        {
          href: homePage(),
          label: "Trang chủ",
          match: isLandingPage(),
        },
        {
          href: catalogPage(),
          label: "Sản phẩm",
          match: isCatalogPage() || isProductPage(),
        },
        {
          href: registerHref(),
          label: "Đăng ký",
          match: isRegisterPage(),
        },
      ];
    }

    nav.innerHTML = items
      .map(function (item) {
        return (
          '<a href="' +
          escapeHtml(item.href) +
          '"' +
          (item.match ? ' class="is-active" aria-current="page"' : "") +
          ">" +
          escapeHtml(item.label) +
          "</a>"
        );
      })
      .join("");
  }

  function initFooterProducts() {
    var col = document.getElementById("footer-products");
    if (!col) return;

    col.innerHTML = products()
      .map(function (p) {
        return (
          '<a href="' +
          escapeHtml(productHref(p)) +
          '">' +
          escapeHtml(p.shortName || p.name) +
          "</a>"
        );
      })
      .join("");
  }

  function initBrandLink() {
    document.querySelectorAll("[data-brand-link]").forEach(function (a) {
      a.href = homePage();
    });
  }

  function initHeaderCta() {
    var playBtn = document.querySelector(".header-cta [data-play-store]");
    var productId = document.body.getAttribute("data-product-id");
    var product = products().find(function (p) {
      return p.id === productId;
    });

    if (playBtn) {
      playBtn.hidden = !(product && product.hasPlayStore);
    }

    document.querySelectorAll("[data-register-href]").forEach(function (a) {
      a.href = registerHref(productId || "");
    });

    document.querySelectorAll("[data-buy-link]").forEach(function (a) {
      var id = productId || "";
      if (!id) {
        var params = new URLSearchParams(window.location.search);
        id = params.get("product") || "";
      }
      var page = cfg.purchasePage || "mua.html";
      a.href = id ? page + "?product=" + encodeURIComponent(id) : page;
    });
  }

  window.SiteLayout = {
    currentPageFile: currentPageFile,
    homePage: homePage,
    catalogPage: catalogPage,
    registerPage: registerPage,
    registerHref: registerHref,
    isLandingPage: isLandingPage,
    isCatalogPage: isCatalogPage,
    isRegisterPage: isRegisterPage,
    productHref: productHref,
    init: function () {
      initBrandLink();
      initSiteNav();
      initFooterProducts();
      initHeaderCta();
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    window.SiteLayout.init();
  });
})();
