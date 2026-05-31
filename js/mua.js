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

  function getProductPrice(productId) {
    var p = findProduct(productId);
    if (p && (p.isFree || p.price === 0)) return 0;
    var base = cfg.productPricing || {};
    if (p && p.price != null) return Number(p.price);
    if (base.price != null) return Number(base.price);
    return 0;
  }

  function formatPriceLabel(productId) {
    var p = findProduct(productId);
    if (p && (p.isFree || p.price === 0)) return p.priceLabel || "Miễn phí";
    return formatVnd(getProductPrice(productId));
  }

  function formatVnd(amount) {
    if (pay.formatVnd) return pay.formatVnd(amount);
    return Number(amount).toLocaleString("vi-VN") + " vnđ";
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

    var amount = getProductPrice(id);
    line.hidden = false;
    display.textContent = formatPriceLabel(id);
  }

  function initTrialLink() {
    document.querySelectorAll("[data-trial-link]").forEach(function (a) {
      var select = $("product");
      var id = select && select.value ? select.value : "";
      var params = new URLSearchParams(window.location.search);
      if (!id) id = params.get("product") || "";
      a.href = trialLinkForProduct(id);
    });
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
      qrImg.alt = "QR chuyển khoản " + formatVnd(amount);
    }

    setText("payment-account-name", bank.accountName);
    setText("payment-bank-name", bank.bankName);
    setText("payment-account-number", bank.accountNumber);
    setText("payment-amount-text", formatVnd(amount));
    setText("payment-amount-box", formatVnd(amount));
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
  }

  function initPurchaseForm() {
    var form = $("purchase-form");
    if (!form) return;

    var status = $("purchase-form-status");
    var btn = form.querySelector('button[type="submit"]');
    var select = $("product");

    if (select) {
      select.addEventListener("change", function () {
        updatePriceDisplay();
        initTrialLink();
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

        sessionStorage.setItem(
          "quanlysuco_purchase",
          JSON.stringify({
            name: leadPayload.name,
            phone: leadPayload.phone,
            email: leadPayload.email,
            address: leadPayload.province,
            productId: productId,
            productLabel: productLabel,
            amount: amount,
            transferNote: transferNote,
          })
        );

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

  function restorePaymentFromSession() {
    try {
      var raw = sessionStorage.getItem("quanlysuco_purchase");
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data && data.transferNote && data.name) {
        showPaymentPanel(data);
      }
    } catch (_) {
      /* ignore */
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    updatePriceDisplay();
    initTrialLink();
    initCopyButtons();
    initPurchaseForm();
    restorePaymentFromSession();
  });
})();
