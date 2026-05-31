(function () {
  var cfg = window.SITE_CONFIG || {};
  var pay = window.SitePayment || {};

  function $(id) {
    return document.getElementById(id);
  }

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

  function getProductLabel(productId) {
    var p = findProduct(productId);
    if (!p) return productId || "";
    return p.registerLabel || p.shortName || p.name || productId;
  }

  function getPriceUnit() {
    var u = (cfg.productPricing || {}).priceUnit;
    return u != null && u !== "" ? u : "/năm";
  }

  function getProductPrice(productId) {
    var p = findProduct(productId);
    if (p && (p.isFree || p.price === 0)) return 0;
    var base = cfg.productPricing || {};
    if (p && p.price != null) return Number(p.price);
    if (base.price != null) return Number(base.price);
    return 0;
  }

  function formatVnd(amount) {
    if (pay.formatVnd) return pay.formatVnd(amount);
    return Number(amount).toLocaleString("vi-VN") + " vnđ";
  }

  function formatPriceLabel(productId) {
    var p = findProduct(productId);
    if (p && (p.isFree || p.price === 0)) return p.priceLabel || "Miễn phí";
    return formatVnd(getProductPrice(productId)) + getPriceUnit();
  }

  function getUrlProductId() {
    return new URLSearchParams(window.location.search).get("product") || "";
  }

  function isPaymentStepUrl() {
    return new URLSearchParams(window.location.search).get("step") === "pay";
  }

  function getSavedPurchase() {
    try {
      var raw = sessionStorage.getItem("quanlysuco_purchase");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function clearPurchaseSession() {
    sessionStorage.removeItem("quanlysuco_purchase");
  }

  function setFormUrl(productId) {
    var path = window.location.pathname || "mua.html";
    var params = new URLSearchParams();
    if (productId) params.set("product", productId);
    var qs = params.toString();
    history.replaceState(null, "", qs ? path + "?" + qs : path);
  }

  function setPaymentUrl(productId) {
    var path = window.location.pathname || "mua.html";
    var params = new URLSearchParams();
    if (productId) params.set("product", productId);
    params.set("step", "pay");
    history.replaceState(null, "", path + "?" + params.toString());
  }

  function trialLinkForProduct(productId) {
    var page = cfg.registerPage || "dang-ky.html";
    if (productId) return page + "?product=" + encodeURIComponent(productId);
    return page;
  }

  function updatePriceDisplay() {
    var select = $("product");
    var line = $("purchase-price-line");
    var display = $("purchase-price-display");
    if (!select || !line || !display) return;

    var id = select.value;
    if (!id || !findProduct(id)) {
      line.hidden = true;
      return;
    }

    line.hidden = false;
    display.textContent = formatPriceLabel(id);
  }

  function initTrialLink() {
    document.querySelectorAll("[data-trial-link]").forEach(function (a) {
      var select = $("product");
      var id = select && select.value ? select.value : "";
      if (!id) id = getUrlProductId();
      a.href = trialLinkForProduct(id);
    });
  }

  function showFormPanel(productId) {
    var formPanel = $("purchase-form-panel");
    var payPanel = $("purchase-payment-panel");
    var card = $("purchase-card");
    if (formPanel) formPanel.hidden = false;
    if (payPanel) payPanel.hidden = true;
    if (card) card.classList.remove("is-payment-shown");

    var select = $("product");
    if (productId && select) select.value = productId;

    document.title = "Mua phần mềm — " + (cfg.siteBrand || cfg.appName || "Phần mềm");
    updatePriceDisplay();
    initTrialLink();
  }

  function showPaymentPanel(data) {
    var formPanel = $("purchase-form-panel");
    var payPanel = $("purchase-payment-panel");
    var card = $("purchase-card");
    if (formPanel) formPanel.hidden = true;
    if (payPanel) payPanel.hidden = false;
    if (card) card.classList.add("is-payment-shown");

    var bank = pay.getBankConfig ? pay.getBankConfig() : cfg.bankTransfer || {};
    var transferNote = data.transferNote;
    var amount = data.amount;
    var amountText = formatVnd(amount) + getPriceUnit();
    var qrUrl = pay.buildVietQrImageUrl
      ? pay.buildVietQrImageUrl({
          amount: amount,
          addInfo: transferNote,
          accountName: bank.accountName,
        })
      : "";

    var qrImg = $("payment-qr-img");
    if (qrImg && qrUrl) {
      qrImg.src = qrUrl;
      qrImg.alt = "QR chuyển khoản " + amountText;
    }

    setText("payment-account-name", bank.accountName);
    setText("payment-bank-name", bank.bankName);
    setText("payment-account-number", bank.accountNumber);
    setText("payment-amount-text", amountText);
    setText("payment-amount-box", amountText);
    setText("payment-transfer-note", transferNote);

    var summary = $("purchase-summary");
    if (summary) {
      summary.innerHTML =
        "<dt>Họ tên</dt><dd>" +
        escapeHtml(data.name) +
        "</dd>" +
        "<dt>Loại phần mềm</dt><dd>" +
        escapeHtml(data.productLabel) +
        "</dd>" +
        "<dt>Điện thoại</dt><dd>" +
        escapeHtml(data.phone) +
        "</dd>" +
        "<dt>Email</dt><dd>" +
        escapeHtml(data.email) +
        "</dd>";
    }

    document.title = "Quét mã thanh toán — " + (cfg.siteBrand || cfg.appName || "Phần mềm");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setText(id, text) {
    var el = $(id);
    if (el && text) el.textContent = text;
  }

  function resetToNewPurchase(productId) {
    clearPurchaseSession();
    setFormUrl(productId || "");
    showFormPanel(productId || "");
  }

  function initPurchasePageState() {
    var urlProductId = getUrlProductId();
    var saved = getSavedPurchase();
    var onPayStep = isPaymentStepUrl();

    if (urlProductId && saved && saved.productId !== urlProductId) {
      clearPurchaseSession();
      saved = null;
    }

    if (urlProductId && !onPayStep) {
      clearPurchaseSession();
      showFormPanel(urlProductId);
      return;
    }

    if (onPayStep && saved && saved.transferNote && saved.name) {
      if (!urlProductId || saved.productId === urlProductId) {
        showPaymentPanel(saved);
        return;
      }
    }

    showFormPanel(urlProductId);
  }

  async function copyText(text, statusEl, okMsg) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (statusEl) {
        statusEl.className = "form-status success";
        statusEl.textContent = okMsg || "Đã sao chép.";
      }
    } catch {
      if (statusEl) {
        statusEl.className = "form-status";
        statusEl.textContent = "Không sao chép được — hãy chọn và copy thủ công.";
      }
    }
  }

  function initCopyButtons() {
    var noteBtn = $("copy-transfer-note");
    var accBtn = $("copy-account-number");
    var status = $("payment-copy-status");

    if (noteBtn) {
      noteBtn.addEventListener("click", function () {
        var note = $("payment-transfer-note");
        copyText(note ? note.textContent : "", status, "Đã sao chép nội dung chuyển khoản.");
      });
    }

    if (accBtn) {
      accBtn.addEventListener("click", function () {
        var bank = pay.getBankConfig ? pay.getBankConfig() : cfg.bankTransfer || {};
        copyText(bank.accountNumber || "", status, "Đã sao chép số tài khoản.");
      });
    }

    var resetBtn = $("purchase-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        resetToNewPurchase("");
      });
    }
  }

  function initPurchaseForm() {
    var form = $("purchase-form");
    if (!form) return;

    var status = $("purchase-form-status");
    var btn = form.querySelector('button[type="submit"]');
    var select = $("product");

    if (select) {
      select.addEventListener("change", function () {
        var id = select.value;
        if (isPaymentStepUrl()) {
          resetToNewPurchase(id);
          return;
        }
        updatePriceDisplay();
        initTrialLink();
        if (id) setFormUrl(id);
      });
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (typeof window.validateRegisterForm === "function") {
        var productId = form.product ? form.product.value.trim() : "";
        var payload = {
          name: form.fullName.value.trim(),
          phone: form.phone.value.trim(),
          email: form.email.value.trim(),
          productId: productId,
          province: form.address.value.trim(),
        };
        if (!window.validateRegisterForm(payload)) return;
      }

      var productId = form.product ? form.product.value.trim() : "";
      var productLabel = getProductLabel(productId);
      var amount = getProductPrice(productId);
      var transferNote = pay.buildTransferNote
        ? pay.buildTransferNote(form.fullName.value.trim(), productLabel)
        : form.fullName.value.trim() + " - " + productLabel;

      var leadPayload = {
        name: form.fullName.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        productId: productId,
        product: productLabel,
        company: productLabel,
        productLabel: productLabel,
        province: form.address.value.trim(),
        note: "Mua phần mềm — CK: " + transferNote,
        leadType: "purchase",
        amount: amount,
        transferNote: transferNote,
      };

      if (status) {
        status.className = "form-status";
        status.textContent = "Đang lưu thông tin…";
      }
      if (btn) btn.disabled = true;

      try {
        if (typeof window.submitPurchaseLead === "function") {
          await window.submitPurchaseLead(leadPayload);
        }

        var saved = {
          name: leadPayload.name,
          phone: leadPayload.phone,
          email: leadPayload.email,
          address: leadPayload.province,
          productId: productId,
          productLabel: productLabel,
          amount: amount,
          transferNote: transferNote,
        };

        sessionStorage.setItem("quanlysuco_purchase", JSON.stringify(saved));
        setPaymentUrl(productId);
        showPaymentPanel(leadPayload);
      } catch (err) {
        if (status) {
          status.className = "form-status error";
          status.textContent = (err.message || "Lỗi gửi form") + " — thử lại hoặc chat Zalo.";
        }
        if (btn) btn.disabled = false;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPurchaseForm();
    initCopyButtons();
    initPurchasePageState();
  });
})();
