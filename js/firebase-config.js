/**
 * Firebase — dùng chung project với app Quản lý sự cố & License Admin.
 * Chỉ khởi tạo Firestore để ghi lead (không cần đăng nhập).
 */
(function () {
  var cfg = window.SITE_CONFIG && window.SITE_CONFIG.firebase;
  if (!cfg || !cfg.apiKey) {
    console.warn("[Firebase] Chưa cấu hình firebase trong js/config.js");
    return;
  }

  if (typeof firebase === "undefined") {
    console.error("[Firebase] Thiếu SDK — kiểm tra script firebase-app-compat trong index.html");
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(cfg);
  }

  window.firebaseDb = firebase.firestore();
})();
