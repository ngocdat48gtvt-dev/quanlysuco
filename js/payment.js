(function () {
  var cfg = window.SITE_CONFIG || {};

  function removeDiacritics(str) {
    return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  function getBankConfig() {
    return cfg.bankTransfer || {};
  }

  function buildTransferNote(fullName, productLabel) {
    var name = removeDiacritics(String(fullName || "").trim()).toUpperCase();
    var product = removeDiacritics(String(productLabel || "").trim());
    if (!name) return product.slice(0, 50);
    if (!product) return name.slice(0, 50);
    var note = name + " - " + product;
    if (note.length > 50) {
      var maxProduct = Math.max(8, 50 - name.length - 3);
      note = name + " - " + product.slice(0, maxProduct);
    }
    return note.slice(0, 50);
  }

  function buildVietQrImageUrl(options) {
    var bank = getBankConfig();
    var bankId = bank.bankId || "970405";
    var accountNo = String(bank.accountNumber || "").replace(/\D/g, "");
    var template = bank.qrTemplate || "compact2";
    if (!accountNo) return "";

    var url =
      "https://img.vietqr.io/image/" +
      encodeURIComponent(bankId + "-" + accountNo + "-" + template) +
      ".png";

    var params = [];
    if (options.amount != null && !isNaN(Number(options.amount))) {
      params.push("amount=" + encodeURIComponent(String(Math.round(Number(options.amount)))));
    }
    if (options.addInfo) {
      params.push("addInfo=" + encodeURIComponent(String(options.addInfo)));
    }
    var accountName = options.accountName || bank.accountName;
    if (accountName && !String(accountName).includes("[")) {
      params.push("accountName=" + encodeURIComponent(String(accountName)));
    }
    if (params.length) url += "?" + params.join("&");
    return url;
  }

  function formatVnd(amount) {
    if (amount == null || amount === "" || isNaN(Number(amount))) return "Liên hệ";
    return Number(amount).toLocaleString("vi-VN") + " vnđ";
  }

  window.SitePayment = {
    removeDiacritics: removeDiacritics,
    buildTransferNote: buildTransferNote,
    buildVietQrImageUrl: buildVietQrImageUrl,
    formatVnd: formatVnd,
    getBankConfig: getBankConfig,
  };
})();
