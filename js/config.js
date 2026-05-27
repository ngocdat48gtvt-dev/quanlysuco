/**
 * Cấu hình trang web — chỉnh file này trước khi đăng lên host.
 */
window.SITE_CONFIG = {
  appName: "Quản lý sự cố đường bộ",
  tagline:
    "Ghi sự cố trên điện thoại, đồng bộ cloud an toàn, xuất Excel thống kê và Word ghép ảnh trước/sau thi công.",
  playStoreUrl:
    "https://play.google.com/store/apps/details?id=com.tuanduong.quanlysuco",
  supportEmail: "[EMAIL_HỖ_TRỢ]",
  supportPhone: "",

  /** Zalo liên hệ — điền SĐT đăng ký Zalo (vd: 0912345678) */
  zalo: {
    phone: "0968549116",
    displayName: "Dương Ngọc Đạt",
    defaultMessage:
      "Xin chào, tôi muốn tư vấn / đăng ký app Quản lý sự cố đường bộ.",
  },

  /** URL Web App sau khi triển khai Google Apps Script (xem google-apps-script/README.md) */
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbxu5Ha8WjZBCNpNV3sdbD-6mmm6PiX4OV7JxXwO4ICPaMwvd6Fl7GqZq7L2TOWUxAxHjg/exec",

  /** Trang kế toán / xác nhận sau khi gửi form */
  accountingPageUrl: "ke-toan.html",

  /** Thư mục ảnh CH Play (đã copy vào website) */
  assetsFolder: "Ho so dang CH play",
  /** Ảnh minh họa hero (không chữ) — tính năng hiển thị ở section HTML bên dưới */
  banner: "banner2.png",
  bannerFeatureGraphic: "921d2d07-8356-43ca-94cc-602a4c63dbe1.png",
  icon: "ic_launcher_play_store_512.png",

  /**
   * false = ẩn section video & menu Hướng dẫn (chưa quay xong).
   * Khi có video: đặt true, điền youtubeId bên dưới rồi deploy lại.
   */
  showVideos: true,

  /** 4 video hướng dẫn (quay dọc điện thoại) — thay VIDEO_ID bằng ID YouTube / Shorts */
  videos: [
    {
      id: 1,
      title: "Giới thiệu & đăng nhập",
      description: "Cài app, đăng nhập tài khoản được cấp và làm quen màn hình chính.",
      youtubeId: "VIDEO_ID_1",
    },
    {
      id: 2,
      title: "Thêm sự cố & chụp ảnh",
      description: "Nhập tuyến, lý trình, loại sự cố và ảnh trước / sau xử lý.",
      youtubeId: "VIDEO_ID_2",
    },
    {
      id: 3,
      title: "Danh sách, lọc & tìm kiếm",
      description: "Tra cứu sự cố theo ngày, tuyến và xem chi tiết trên hiện trường.",
      youtubeId: "VIDEO_ID_3",
    },
    {
      id: 4,
      title: "Báo cáo & xuất Word/Excel",
      description: "Thống kê, xuất file báo cáo và đồng bộ dữ liệu lên cloud.",
      youtubeId: "VIDEO_ID_4",
    },
  ],

  /** Ảnh chụp màn hình app (thứ tự: màn chính → thêm → danh sách → chi tiết → thống kê) */
  screenshots: [
    { file: "1.jpg", caption: "Màn chính — thời tiết & thống kê hôm nay" },
    { file: "2.jpg", caption: "Thêm sự cố — nhập liệu & ảnh hiện trường" },
    { file: "3.jpg", caption: "Danh sách sự cố — lọc, tìm kiếm, đồng bộ" },
    { file: "5.jpg", caption: "Chi tiết sự cố — xem & cập nhật, ảnh trước / sau" },
    { file: "4.jpg", caption: "Thống kê — xuất Excel, Word & ảnh ZIP" },
  ],

  pricing: {
    note: "Giá và gói dịch vụ do đơn vị cấp — vui lòng liên hệ sau khi đăng ký.",
    packages: [
      { name: "Gói cơ bản", detail: "Theo số tài khoản / thiết bị", price: "Liên hệ" },
      { name: "Gói doanh nghiệp", detail: "Nhiều tuyến, hỗ trợ triển khai", price: "Liên hệ" },
    ],
  },

  /** false = ẩn hộp chuyển khoản trên trang xác nhận (giai đoạn dùng thử) */
  showPayment: false,

  bankTransfer: {
    accountName: "[TÊN_CHỦ_TÀI_KHOẢN]",
    bankName: "[TÊN_NGÂN_HÀNG]",
    accountNumber: "[SỐ_TÀI_KHOẢN]",
    transferNote: "QLSC [SĐT_KHÁCH]",
  },
};
