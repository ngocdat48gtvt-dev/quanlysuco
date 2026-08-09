(function () {
  "use strict";

  var cfg = window.SITE_CONFIG && window.SITE_CONFIG.firebase;
  if (!cfg || !window.firebase) return;
  if (!firebase.apps.length) firebase.initializeApp(cfg);

  var auth = firebase.auth();
  var db = firebase.firestore();
  var state = { user: null, profile: null };
  var modal = document.querySelector("[data-auth-modal]");
  var form = document.querySelector("[data-login-form]");
  var errorBox = document.querySelector("[data-auth-error]");
  var submitButton = document.querySelector("[data-login-submit]");
  var toast = document.querySelector("[data-portal-toast]");
  var nextUrl = new URLSearchParams(location.search).get("next") || "";

  function normalizeRole(value) {
    var role = String(value || "USER").toUpperCase();
    return role === "ADMIN" || role === "VIEWER" ? role : "USER";
  }

  function roleLabel(role) {
    if (role === "ADMIN") return "Quản trị · ADMIN";
    if (role === "VIEWER") return "Chỉ xem · VIEWER";
    return "Nghiệp vụ · USER";
  }

  function isExpired(value) {
    if (!value) return false;
    var iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    if (iso) return Date.now() > new Date(+iso[1], +iso[2] - 1, +iso[3], 23, 59, 59).getTime();
    var dmy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(value));
    return dmy ? Date.now() > new Date(+dmy[3], +dmy[2] - 1, +dmy[1], 23, 59, 59).getTime() : false;
  }

  function hasApp(profile, ids) {
    var apps = Array.isArray(profile.allowedApps) ? profile.allowedApps.map(String) : [];
    return !apps.length || ids.some(function (id) { return apps.indexOf(id) >= 0; });
  }

  function canOpen(portal) {
    var p = state.profile;
    if (portal === "backup") return true;
    if (!state.user || !p) return false;
    if (portal === "dispatch") return p.role === "ADMIN" && hasApp(p, ["quan_ly_su_co"]);
    if (portal === "report") return p.role === "ADMIN" && hasApp(p, ["nhat_ky_tuan_duong", "quan_ly_su_co"]);
    if (portal === "office") return hasApp(p, ["nhat_ky_tuan_duong", "quan_ly_su_co"]);
    return false;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () { toast.hidden = true; }, 4200);
  }

  function openLogin(message) {
    if (message) {
      errorBox.textContent = message;
      errorBox.hidden = false;
    } else {
      errorBox.hidden = true;
    }
    modal.hidden = false;
    setTimeout(function () { form.elements.email.focus(); }, 30);
  }

  function closeLogin() {
    modal.hidden = true;
    errorBox.hidden = true;
  }

  function render() {
    var signedIn = Boolean(state.user && state.profile);
    document.querySelectorAll("[data-account-panel]").forEach(function (el) { el.hidden = !signedIn; });
    document.querySelectorAll("[data-login-open]").forEach(function (el) { el.hidden = signedIn; });
    document.querySelectorAll("[data-logout]").forEach(function (el) { el.hidden = !signedIn; });

    if (signedIn) {
      var p = state.profile;
      document.querySelectorAll("[data-user-name]").forEach(function (el) { el.textContent = p.displayName; });
      document.querySelectorAll("[data-user-role]").forEach(function (el) { el.textContent = roleLabel(p.role); });
      document.querySelectorAll("[data-user-initial]").forEach(function (el) { el.textContent = (p.displayName || "U").trim().charAt(0).toUpperCase(); });
      document.querySelector("[data-company-name]").textContent = p.companyName || "Đơn vị quản lý đường bộ";
      document.querySelector("[data-company-subtitle]").textContent = p.displayName + " · " + roleLabel(p.role);
    } else {
      document.querySelector("[data-company-name]").textContent = "Trung tâm nghiệp vụ đường bộ";
      document.querySelector("[data-company-subtitle]").textContent = "Đăng nhập để sử dụng các cổng được cấp quyền";
    }

    document.querySelectorAll("[data-portal]").forEach(function (el) {
      var portal = el.getAttribute("data-portal");
      var allowed = canOpen(portal);
      el.classList.toggle("is-locked", !signedIn);
      el.classList.toggle("is-denied", signedIn && !allowed);
      el.setAttribute("aria-disabled", allowed ? "false" : "true");
    });
  }

  async function loadProfile(user) {
    var snap = await db.collection("users").doc(user.uid).get();
    if (!snap.exists) return null;
    var data = snap.data() || {};
    if (data.active !== true || isExpired(data.expireDate)) return null;
    return {
      uid: user.uid,
      role: normalizeRole(data.role),
      companyId: String(data.companyId || ""),
      companyName: String(data.companyName || data.company || data.companyId || ""),
      displayName: String(data.name || data.displayName || data.email || user.email || "Người dùng"),
      allowedApps: data.allowedApps,
      expireDate: data.expireDate
    };
  }

  function portalFromUrl(raw) {
    try {
      var url = new URL(raw, location.origin);
      if (url.origin !== location.origin) return "";
      if (url.pathname.indexOf("/dieu-hanh") === 0 || url.pathname.indexOf("/dashboard") === 0) return "dispatch";
      if (url.pathname.indexOf("/nhat-ky") === 0 && url.searchParams.get("bao-cao") === "1") return "report";
      if (url.pathname.indexOf("/nhat-ky") === 0) return "office";
    } catch (_) { /* ignore */ }
    return "";
  }

  document.querySelectorAll("[data-login-open]").forEach(function (el) { el.addEventListener("click", function () { openLogin(); }); });
  document.querySelectorAll("[data-login-close]").forEach(function (el) { el.addEventListener("click", closeLogin); });
  document.querySelectorAll("[data-logout]").forEach(function (el) {
    el.addEventListener("click", function () { auth.signOut(); });
  });
  document.querySelectorAll("[data-portal]").forEach(function (el) {
    el.addEventListener("click", function (event) {
      var portal = el.getAttribute("data-portal");
      if (canOpen(portal)) return;
      event.preventDefault();
      if (!state.user) openLogin("Vui lòng đăng nhập để mở chức năng này.");
      else showToast("Tài khoản " + state.profile.role + " không được cấp quyền mở chức năng này.");
    });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    errorBox.hidden = true;
    submitButton.disabled = true;
    submitButton.textContent = "Đang đăng nhập...";
    try {
      var credential = await auth.signInWithEmailAndPassword(form.elements.email.value.trim(), form.elements.password.value);
      var profile = await loadProfile(credential.user);
      if (!profile) {
        await auth.signOut();
        throw new Error("Tài khoản chưa kích hoạt, hết hạn hoặc chưa có hồ sơ công ty.");
      }
      state.user = credential.user;
      state.profile = profile;
      form.elements.password.value = "";
      render();
      closeLogin();
      var requestedPortal = portalFromUrl(nextUrl);
      if (nextUrl && requestedPortal && canOpen(requestedPortal)) location.href = new URL(nextUrl, location.origin).href;
    } catch (error) {
      errorBox.textContent = error && error.message && error.message.indexOf("Tài khoản") === 0
        ? error.message
        : "Email hoặc mật khẩu không đúng.";
      errorBox.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Đăng nhập";
    }
  });

  auth.onAuthStateChanged(async function (user) {
    state.user = user;
    state.profile = null;
    if (user) {
      try {
        state.profile = await loadProfile(user);
        if (!state.profile) await auth.signOut();
      } catch (_) {
        showToast("Không tải được thông tin tài khoản. Vui lòng thử lại.");
      }
    }
    render();
  });

  var params = new URLSearchParams(location.search);
  if (params.get("login") === "1") openLogin();
  if (params.get("denied")) showToast("Tài khoản hiện tại không có quyền mở chức năng vừa chọn.");
  render();
})();
