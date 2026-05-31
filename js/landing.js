(function () {
  var cfg = window.SITE_CONFIG || {};

  function escapeHtml(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function findProduct(id) {
    return (Array.isArray(cfg.products) ? cfg.products : []).find(function (p) {
      return p.id === id;
    });
  }

  function productHref(p) {
    var page = p.page || "san-pham.html";
    if (page.indexOf(".") === -1) return page + ".html";
    return page;
  }

  function assetPath(file) {
    if (!file) return "";
    var base = (cfg.assetsFolder || "").trim();
    if (!base) return file;
    return base.replace(/\/$/, "") + "/" + file.replace(/^\//, "");
  }

  function initSolutionsGrid() {
    var grid = document.getElementById("lp-solutions-grid");
    if (!grid) return;

    var items = (cfg.landing && cfg.landing.solutions && cfg.landing.solutions.items) || [];
    grid.innerHTML = items
      .map(function (item) {
        var p = findProduct(item.productId);
        var href = p ? productHref(p) : "san-pham.html";
        var featured = item.featured || (p && p.featured);
        return (
          '<a class="lp-solution-card reveal' +
          (featured ? " lp-solution-card--featured" : "") +
          '" href="' +
          escapeHtml(href) +
          '">' +
          (featured ? '<span class="lp-solution-hot">Hot</span>' : "") +
          "<h3>" +
          escapeHtml(item.title) +
          "</h3>" +
          "<p>" +
          escapeHtml(item.desc) +
          "</p>" +
          '<span class="lp-solution-link">Xem chi tiết →</span>' +
          "</a>"
        );
      })
      .join("");

    observeReveal(grid.querySelectorAll(".reveal"));
  }

  function initDemoVideo() {
    var root = document.getElementById("lp-demo-video");
    var heroWrap = document.getElementById("hero-media-wrap");
    if (!root) return;

    var demo = (cfg.landing && cfg.landing.demoVideo) || {};
    var id = String(demo.youtubeId || "").trim();
    var valid = id && !id.startsWith("VIDEO_ID");

    var embedHtml = "";
    if (valid) {
      embedHtml =
        '<div class="video-embed video-embed--landscape">' +
        '<iframe src="https://www.youtube.com/embed/' +
        encodeURIComponent(id) +
        '?rel=0&modestbranding=1" title="' +
        escapeHtml(demo.title || "Video demo phần mềm") +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>' +
        "</div>";

      if (heroWrap) {
        heroWrap.innerHTML =
          '<div class="video-embed video-embed--landscape">' +
          '<iframe src="https://www.youtube.com/embed/' +
          encodeURIComponent(id) +
          '?rel=0&modestbranding=1" title="Video demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>' +
          "</div>";
      }
    } else {
      embedHtml =
        '<div class="lp-video-placeholder">' +
        "<p><strong>Video demo sắp có</strong></p>" +
        "<p>Thêm <code>landing.demoVideo.youtubeId</code> trong <code>js/config.js</code></p>" +
        "</div>";
    }

    root.innerHTML = embedHtml;
  }

  function initHeroBanner() {
    var img = document.getElementById("hero-banner-img");
    if (img && cfg.banner) {
      img.src = assetPath(cfg.banner);
    }
  }

  function observeReveal(nodes) {
    if (!nodes || !nodes.length) return;
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    nodes.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initScrollReveal() {
    observeReveal(document.querySelectorAll(".reveal"));
  }

  function showError(inputId, message) {
    var input = document.getElementById(inputId);
    var err = document.querySelector('[data-error-for="' + inputId + '"]');
    if (input) input.setAttribute("aria-invalid", "true");
    if (err) {
      err.textContent = message;
      err.classList.add("visible");
    }
    return false;
  }

  function clearErrors() {
    document.querySelectorAll(".form-error").forEach(function (el) {
      el.classList.remove("visible");
      el.textContent = "";
    });
    document.querySelectorAll("[aria-invalid]").forEach(function (el) {
      el.removeAttribute("aria-invalid");
    });
  }

  function validateLandingForm(data) {
    clearErrors();
    var ok = true;

    if (!data.name || data.name.length < 2) {
      showError("fullName", "Vui lòng nhập họ tên.");
      ok = false;
    }
    if (!/^[\d\s+().-]{9,15}$/.test(String(data.phone || "").replace(/\s/g, ""))) {
      showError("phone", "Số điện thoại không hợp lệ.");
      ok = false;
    }
    if (!data.company || data.company.length < 2) {
      showError("company", "Vui lòng nhập đơn vị công tác.");
      ok = false;
    }
    if (!data.needs || data.needs.length < 5) {
      showError("needs", "Vui lòng mô tả nhu cầu (ít nhất 5 ký tự).");
      ok = false;
    }
    return ok;
  }

  function telegramApiUrl() {
    return window.location.origin + "/api/telegram-lead";
  }

  async function notifyTelegram(payload) {
    var res = await fetch(telegramApiUrl(), {
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

  async function submitLeadToFirestore(payload) {
    var db = window.firebaseDb;
    if (!db) {
      throw new Error("Chưa kết nối Firebase.");
    }

    await db.collection("leads").add({
      name: payload.name,
      phone: payload.phone,
      email: payload.email || "",
      company: payload.company || "",
      productId: payload.productId || "",
      province: payload.company || "",
      note: payload.note || "",
      status: "new",
      leadType: payload.leadType || "consultation",
      source: payload.source || "landing_home",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  function showFormSuccess(card, status) {
    if (status) {
      status.className = "form-status success";
      status.textContent =
        "Cảm ơn bạn! Chúng tôi sẽ liên hệ tư vấn trong thời gian sớm nhất.";
    }
    if (card) {
      card.classList.add("is-submitted");
      var success = document.createElement("div");
      success.className = "lp-register-success";
      success.innerHTML =
        "<h3>✓ Đã gửi thành công</h3>" +
        "<p>Chúng tôi sẽ gọi hoặc nhắn Zalo trong 24 giờ. Bạn cũng có thể chat Zalo ngay (nút góc màn hình).</p>";
      card.appendChild(success);
    }
  }

  function initLandingForm() {
    var form = document.getElementById("landing-register-form");
    if (!form) return;

    var status = document.getElementById("landing-form-status");
    var btn = form.querySelector('button[type="submit"]');
    var card = form.closest(".lp-register-card");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearErrors();

      var payload = {
        name: form.fullName.value.trim(),
        phone: form.phone.value.trim(),
        company: form.company.value.trim(),
        needs: form.needs.value.trim(),
        email: "",
        productId: "",
        product: "Tư vấn landing page",
        productLabel: "Tư vấn landing page",
        province: form.company.value.trim(),
        note: "Nhu cầu: " + form.needs.value.trim(),
        leadType: "consultation",
        source: "landing_home",
      };

      if (!validateLandingForm(payload)) return;

      if (status) {
        status.className = "form-status";
        status.textContent = "Đang gửi…";
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
          if (!telegramOk) throw fsErr;
          console.warn("[Firestore]", fsErr);
        }

        showFormSuccess(card, status);
        form.reset();
      } catch (err) {
        if (status) {
          status.className = "form-status error";
          status.textContent = (err.message || "Lỗi gửi form") + " — thử lại hoặc chat Zalo.";
        }
        if (btn) btn.disabled = false;
      }
    });
  }

  function initSeoFromConfig() {
    var seo = cfg.seo || {};
    if (!seo.siteUrl) return;

    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = seo.siteUrl.replace(/\/$/, "") + "/";
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeroBanner();
    initSolutionsGrid();
    initDemoVideo();
    initScrollReveal();
    initLandingForm();
    initSeoFromConfig();
  });
})();
