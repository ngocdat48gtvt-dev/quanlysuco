(function () {
  const cfg = window.SITE_CONFIG || {};

  function setSummary() {
    let data = null;
    try {
      const raw = sessionStorage.getItem("quanlysuco_lead");
      if (raw) data = JSON.parse(raw);
    } catch (_) {
      /* ignore */
    }

    const box = document.getElementById("lead-summary");
    if (!box) return;

    if (!data) {
      box.innerHTML =
        "<p>Không có thông tin đăng ký trong phiên này. Vui lòng <a href=\"index.html#dang-ky\">đăng ký lại</a>.</p>";
      return;
    }

    const fields = [
      ["Họ tên", data.fullName],
      ["Số điện thoại", data.phone],
      ["Gmail", data.email],
      ["Địa chỉ", data.address],
    ];

    box.innerHTML = fields
      .map(
        ([label, value]) =>
          "<dt>" +
          label +
          "</dt><dd>" +
          escapeHtml(value || "—") +
          "</dd>"
      )
      .join("");
  }

  function setPaymentVisibility() {
    const section = document.getElementById("payment-section");
    const trial = document.getElementById("trial-notice");
    const showPayment = cfg.showPayment === true;

    if (section) {
      section.hidden = !showPayment;
    }
    if (trial) {
      trial.hidden = showPayment;
    }
  }

  function setBank() {
    const bank = cfg.bankTransfer || {};
    setText("bank-name", bank.bankName);
    setText("bank-account-name", bank.accountName);
    setText("bank-account-number", bank.accountNumber);
    setText("bank-note", bank.transferNote);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text && !String(text).includes("[")) {
      el.textContent = text;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.title = "Xác nhận đăng ký — " + (cfg.appName || "Quản lý sự cố");
    setSummary();
    setPaymentVisibility();
    setBank();
  });
})();
