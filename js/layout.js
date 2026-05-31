(function () {
  var cfg = window.SITE_CONFIG || {};

  function escapeHtml(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function products() {
    return Array.isArray(cfg.products) ? cfg.products : [];
  }

  function currentPageFile() {
    var path = window.location.pathname || "";
    var file = path.split("/").pop() || "";
    if (!file || file === "") return "index.html";
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
    var page = p.page || "index.html";
    if (page.indexOf(".") === -1) return page + ".html";
    return page;
  }

  function isHomePage() {
    var f = currentPageFile();
    return f === "index.html" || f === "";
  }

  function isCatalogPage() {
    return normalizePage(currentPageFile()) === "san-pham";
  }

  function isProductPage() {
    return products().some(function (p) {
      return isSamePage(currentPageFile(), productHref(p));
    });
  }

  function initSiteNav() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;

    var items = [
      { href: "index.html", label: "Trang chủ", match: isHomePage() },
      {
        href: "san-pham.html",
        label: "Phần mềm",
        match: isCatalogPage() || isProductPage(),
      },
      {
        href: isHomePage() ? "#lien-he" : "index.html#lien-he",
        label: "Liên hệ",
        match: false,
      },
      {
        href: isHomePage() ? "#dang-ky" : "index.html#dang-ky",
        label: "Đăng ký",
        match: false,
      },
    ];

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
      .join("") + '<a href="san-pham.html">Tất cả phần mềm</a><a href="index.html#dang-ky">Đăng ký tư vấn</a>';
  }

  function initBrandLink() {
    document.querySelectorAll("[data-brand-link]").forEach(function (a) {
      a.href = "index.html";
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
      if (productId) {
        a.href = "#dang-ky";
      } else {
        a.href = "index.html#dang-ky";
      }
    });
  }

  window.SiteLayout = {
    currentPageFile: currentPageFile,
    isHomePage: isHomePage,
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
