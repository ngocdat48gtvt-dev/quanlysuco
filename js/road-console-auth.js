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
  var changeModal = document.querySelector("[data-change-modal]");
  var changeForm = document.querySelector("[data-change-form]");
  var changeError = document.querySelector("[data-change-error]");
  var changeSubmit = document.querySelector("[data-change-submit]");
  var forgotModal = document.querySelector("[data-forgot-modal]");
  var forgotForm = document.querySelector("[data-forgot-form]");
  var forgotError = document.querySelector("[data-forgot-error]");
  var forgotSubmit = document.querySelector("[data-forgot-submit]");
  var nextUrl = new URLSearchParams(location.search).get("next") || "";

  function normalizeRole(value) {
    var role = String(value || "USER").toUpperCase();
    return role === "ADMIN" || role === "VIEWER" || role === "SO_XD" ? role : "USER";
  }

  function roleLabel(role) {
    if (role === "ADMIN") return "Quản trị · ADMIN";
    if (role === "VIEWER") return "Chỉ xem · VIEWER";
    if (role === "SO_XD") return "Sở Xây dựng · SO_XD";
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
    if (portal === "report") return (p.role === "ADMIN" || p.role === "SO_XD") && hasApp(p, ["nhat_ky_tuan_duong", "quan_ly_su_co"]);
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

  function authErrorMessage(error, fallback) {
    var code = String((error && error.code) || "");
    if (code === "auth/wrong-password" || code === "auth/invalid-credential") return "Mật khẩu hiện tại không đúng.";
    if (code === "auth/weak-password") return "Mật khẩu mới tối thiểu 6 ký tự.";
    if (code === "auth/requires-recent-login") return "Phiên đăng nhập hết hạn. Đăng nhập lại rồi đổi mật khẩu.";
    if (code === "auth/invalid-email") return "Email không hợp lệ.";
    if (code === "auth/user-not-found") return "Email không tồn tại trên hệ thống.";
    if (code === "auth/too-many-requests") return "Thử quá nhiều lần. Vui lòng đợi rồi thử lại.";
    if (code === "auth/network-request-failed") return "Lỗi mạng. Kiểm tra kết nối rồi thử lại.";
    return fallback || "Không thực hiện được. Vui lòng thử lại.";
  }

  function openChangePassword() {
    if (!state.user) {
      openLogin("Vui lòng đăng nhập để đổi mật khẩu.");
      return;
    }
    closeLogin();
    closeForgot();
    if (changeForm) changeForm.reset();
    if (changeError) changeError.hidden = true;
    if (changeModal) changeModal.hidden = false;
    setTimeout(function () {
      if (changeForm && changeForm.elements.current) changeForm.elements.current.focus();
    }, 30);
  }

  function closeChange() {
    if (changeModal) changeModal.hidden = true;
    if (changeError) changeError.hidden = true;
  }

  function openForgot() {
    closeLogin();
    closeChange();
    if (forgotError) forgotError.hidden = true;
    if (forgotForm) {
      var email =
        (state.user && state.user.email) ||
        (form && form.elements.email && form.elements.email.value) ||
        "";
      forgotForm.elements.email.value = String(email).trim();
    }
    if (forgotModal) forgotModal.hidden = false;
    setTimeout(function () {
      if (forgotForm && forgotForm.elements.email) forgotForm.elements.email.focus();
    }, 30);
  }

  function closeForgot() {
    if (forgotModal) forgotModal.hidden = true;
    if (forgotError) forgotError.hidden = true;
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
      companyName: String(data.companyName || data.company || data.companyId || "") || (normalizeRole(data.role) === "SO_XD" ? "Sở Xây dựng" : ""),
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
  document.querySelectorAll("[data-change-password]").forEach(function (el) {
    el.addEventListener("click", function () { openChangePassword(); });
  });
  document.querySelectorAll("[data-change-close]").forEach(function (el) {
    el.addEventListener("click", closeChange);
  });
  document.querySelectorAll("[data-forgot-password]").forEach(function (el) {
    el.addEventListener("click", function () { openForgot(); });
  });
  document.querySelectorAll("[data-forgot-close]").forEach(function (el) {
    el.addEventListener("click", closeForgot);
  });
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

  if (changeForm) {
    changeForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!state.user || !state.user.email) {
        openLogin("Vui lòng đăng nhập để đổi mật khẩu.");
        return;
      }
      var current = String(changeForm.elements.current.value || "");
      var next = String(changeForm.elements.next.value || "");
      var confirm = String(changeForm.elements.confirm.value || "");
      changeError.hidden = true;
      if (next.length < 6) {
        changeError.textContent = "Mật khẩu mới tối thiểu 6 ký tự.";
        changeError.hidden = false;
        return;
      }
      if (next !== confirm) {
        changeError.textContent = "Mật khẩu mới nhập lại không khớp.";
        changeError.hidden = false;
        return;
      }
      changeSubmit.disabled = true;
      changeSubmit.textContent = "Đang cập nhật...";
      try {
        var cred = firebase.auth.EmailAuthProvider.credential(state.user.email, current);
        await state.user.reauthenticateWithCredential(cred);
        await state.user.updatePassword(next);
        changeForm.reset();
        closeChange();
        showToast("Đã đổi mật khẩu thành công.");
      } catch (error) {
        changeError.textContent = authErrorMessage(error, "Không đổi được mật khẩu.");
        changeError.hidden = false;
      } finally {
        changeSubmit.disabled = false;
        changeSubmit.textContent = "Cập nhật mật khẩu";
      }
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      var email = String(forgotForm.elements.email.value || "").trim().toLowerCase();
      forgotError.hidden = true;
      if (!email) {
        forgotError.textContent = "Nhập email tài khoản.";
        forgotError.hidden = false;
        return;
      }
      forgotSubmit.disabled = true;
      forgotSubmit.textContent = "Đang gửi...";
      try {
        await auth.sendPasswordResetEmail(email);
        closeForgot();
        showToast("Đã gửi email đặt lại mật khẩu tới " + email + ". Kiểm tra hộp thư (kể cả spam).");
      } catch (error) {
        forgotError.textContent = authErrorMessage(error, "Không gửi được email đặt lại mật khẩu.");
        forgotError.hidden = false;
      } finally {
        forgotSubmit.disabled = false;
        forgotSubmit.textContent = "Gửi email đặt lại";
      }
    });
  }

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
