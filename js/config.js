/**
 * Cấu hình trang web — chỉnh file này trước khi đăng lên host.
 */
window.SITE_CONFIG = {
  /** Tên thương hiệu / cổng sản phẩm (hiển thị header & hero) */
  siteBrand: "Chuyển đổi số công tác quản lý và bảo trì đường bộ",
  siteTagline:
    "App Android quản lý sự cố hiện trường và công cụ AutoCAD tự động từ Excel — phục vụ BDTX, KPLB và hồ sơ hạ tầng giao thông.",

  appName: "Quản lý sự cố đường bộ",
  tagline:
    "Ghi sự cố trên điện thoại, đồng bộ cloud an toàn, xuất Excel thống kê và Word ghép ảnh trước/sau thi công.",
  playStoreUrl:
    "https://play.google.com/store/apps/details?id=com.tuanduong.quanlysuco",
  supportEmail: "[EMAIL_HỖ_TRỢ]",
  supportPhone: "",

  /** Web điều hành sự cố (React, build vào thư mục /dieu-hanh/) */
  dispatchPortal: {
    /** Cổng điều hành (React) — /dashboard và /dieu-hanh cùng một app */
    path: "/dashboard/",
    altPath: "/dieu-hanh/",
    navLabel: "Điều hành",
    loginLabel: "Đăng nhập điều hành",
  },

  /** Web hiện trường USER (PWA — iPhone / trình duyệt, build vào /user/) */
  userPortal: {
    path: "/user/",
    navLabel: "App hiện trường",
    loginLabel: "Dùng trên iPhone / trình duyệt",
  },

  /** Trang mặc định — danh mục 4 sản phẩm */
  homePage: "san-pham.html",
  catalogPage: "san-pham.html",
  /** Trang đăng ký riêng */
  registerPage: "dang-ky.html",
  /** Trang mua / thanh toán chuyển khoản */
  purchasePage: "mua.html",

  /** Zalo liên hệ */
  zalo: {
    phone: "0968549116",
    phoneDisplay: "0968.549.116",
    displayName: "Dương Ngọc Đạt",
    icon: "assets/zalo-mark.svg",
    defaultMessage:
      "Xin chào, tôi muốn tư vấn phần mềm / công cụ đường bộ (App Android hoặc AutoCAD).",
    floatButton: {
      label: "Chat Zalo",
      variant: "zalo",
    },
  },

  /** Hiển thị giá trên danh mục (false = ẩn — giá chỉ ở trang chi tiết) */
  showCatalogPrice: false,

  /** Giá mặc định — dùng trang mua (mua.html) khi cần QR thanh toán */
  productPricing: {
    price: 499000,
    priceUnit: "/năm",
  },

  /** Lợi ích cột phải trang chi tiết sản phẩm */
  productTrust: [
    { title: "Cập nhật miễn phí", desc: "Liên tục cập nhật tính năng mới" },
    { title: "Tiết kiệm chi phí", desc: "Tối ưu chi phí sử dụng phần mềm" },
    { title: "Phần mềm bản quyền", desc: "100% được cấp phép sử dụng" },
    { title: "An toàn & uy tín", desc: "Cam kết không mã độc hại" },
    { title: "Hỗ trợ tốt nhất", desc: "Hotline — Zalo tư vấn nhanh" },
  ],

  /** Danh sách sản phẩm — thêm/sửa tại đây khi có tool mới */
  products: [
    {
      id: "app-quan-ly-su-co",
      name: "Quản lý sự cố đường bộ",
      shortName: "App sự cố",
      platform: "Android · CH Play",
      badge: "App di động",
      tagline:
        "Ghi nhận sự cố hiện trường, ảnh minh chứng, báo cáo Word/Excel và đồng bộ cloud — offline 24 giờ.",
      page: "app-quan-ly-su-co.html",
      registerLabel: "App Quản lý sự cố đường bộ (Android)",
      accent: "blue",
      cardBadge: "Hot",
      cardUseIcon: true,
      cardSummary:
        "Ghi nhận hiện trường, GPS, ảnh minh chứng, theo dõi xử lý và báo cáo Word/Excel trên Android.",
      seo: {
        title:
          "Phần mềm Quản Lý Sự Cố Đường Bộ | Ghi Nhận Hiện Trường & Theo Dõi Xử Lý Sự Cố",
        description:
          "Phần mềm quản lý sự cố đường bộ giúp ghi nhận hiện trường, lưu ảnh, định vị GPS, theo dõi tiến độ xử lý và tổng hợp báo cáo nhanh chóng cho đơn vị quản lý, bảo trì đường bộ.",
        keywords:
          "phần mềm quản lý sự cố đường bộ, app sự cố đường bộ, ghi nhận hiện trường, GPS sự cố, báo cáo sự cố đường bộ, app Android đường bộ",
        slug: "app-quan-ly-su-co",
      },
      hasPlayStore: true,
      perks: [
        "Không mạng vẫn ghi được",
        "Đồng bộ cloud an toàn",
        "Xuất Excel & Word",
        "Ảnh trước / sau thi công",
        "Web điều hành cho lãnh đạo",
      ],
      hasDispatchPortal: true,
    },
    {
      id: "tool-ho-so-htgt",
      name: "Hồ sơ quản lý kết cấu hạ tầng giao thông",
      shortName: "Hồ sơ HTGT",
      platform: "AutoCAD · Plugin/Tool",
      badge: "Excel → AutoCAD",
      tagline:
        "Tự động vẽ hồ sơ quản lý kết cấu hạ tầng giao thông từ bảng Excel sang bản vẽ AutoCAD — tiết kiệm thời gian, đúng chuẩn hồ sơ.",
      page: "ho-so-htgt.html",
      registerLabel: "Tool Excel→AutoCAD — Hồ sơ HTGT",
      accent: "teal",
      cardBadge: "New",
      cardImage: "",
      cardSummary: "Vẽ hồ sơ quản lý kết cấu HTGT tự động từ Excel sang AutoCAD.",
      seo: {
        title: "Tool Hồ Sơ Quản Lý HTGT | Excel sang AutoCAD Tự Động",
        description:
          "Tự động vẽ hồ sơ quản lý kết cấu hạ tầng giao thông từ Excel sang AutoCAD — giảm nhập liệu, chuẩn hóa layer, profile và mặt cắt tuyến.",
        keywords:
          "hồ sơ HTGT AutoCAD, tool Excel AutoCAD, quản lý kết cấu đường bộ, vẽ profile tuyến",
        slug: "ho-so-htgt",
      },
      perks: [
        "Import Excel một lần",
        "Vẽ profile / kết cấu tự động",
        "Chuẩn hồ sơ quản lý HTGT",
        "Giảm nhập liệu thủ công",
      ],
      featuresSection: {
        eyebrow: "Tính năng",
        title: "Vẽ hồ sơ HTGT tự động từ Excel",
        subtitle:
          "Phù hợp đơn vị quản lý đường bộ, tư vấn thiết kế và lập hồ sơ quản lý kết cấu hạ tầng giao thông.",
      },
      featureHighlights: [
        {
          icon: "📥",
          title: "Import Excel một lần",
          desc: "Đọc danh mục lý trình, kết cấu và thông số kỹ thuật từ file Excel chuẩn.",
        },
        {
          icon: "⚙️",
          title: "Vẽ tự động trên AutoCAD",
          desc: "Tạo profile, mặt cắt và chi tiết kết cấu — không cần vẽ tay từng điểm.",
        },
        {
          icon: "📐",
          title: "Chuẩn hóa hồ sơ HTGT",
          desc: "Thống nhất layer, ký hiệu và bố cục theo quy trình hồ sơ quản lý kết cấu.",
        },
      ],
      features: [
        {
          icon: "📊",
          title: "Đọc bảng Excel",
          desc: "Import lý trình, loại kết cấu, kích thước và ghi chú từ sheet chuẩn.",
        },
        {
          icon: "🛣️",
          title: "Profile & mặt cắt",
          desc: "Vẽ profile tuyến và mặt cắt kết cấu mặt đường tự động trên AutoCAD.",
        },
        {
          icon: "🗂️",
          title: "Layer & ký hiệu",
          desc: "Áp dụng layer, text style và ký hiệu thống nhất cho toàn bộ hồ sơ.",
        },
        {
          icon: "⏱️",
          title: "Tiết kiệm thời gian",
          desc: "Giảm nhập tay hàng trăm điểm — chỉ cần cập nhật Excel rồi chạy lại tool.",
        },
        {
          icon: "🔄",
          title: "Cập nhật nhanh",
          desc: "Sửa số liệu Excel và vẽ lại bản vẽ khi có thay đổi thiết kế hoặc khảo sát.",
        },
        {
          icon: "📁",
          title: "Xuất bản vẽ DWG",
          desc: "File AutoCAD sẵn sàng in ấn, nộp hồ sơ và lưu trữ theo tuyến.",
        },
      ],
      introVideo: {
        title: "Video giới thiệu tool Hồ sơ HTGT",
        description:
          "Quy trình import Excel và vẽ tự động hồ sơ quản lý kết cấu hạ tầng giao thông trên AutoCAD.",
        youtubeId: "VIDEO_ID_HTGT",
      },
    },
    {
      id: "tool-bao-lu",
      name: "Bình đồ điểm sự cố bão lũ",
      shortName: "Bình đồ bão lũ",
      platform: "AutoCAD · Plugin/Tool",
      badge: "Excel → AutoCAD",
      tagline:
        "Tự động vẽ bình đồ các điểm sự cố bão lũ từ Excel (tọa độ, lý trình) sang AutoCAD — nhanh, thống nhất ký hiệu.",
      page: "binh-do-bao-lu.html",
      registerLabel: "Tool Excel→AutoCAD — Bình đồ bão lũ",
      accent: "orange",
      cardBadge: "New",
      cardImage: "",
      cardSummary: "Vẽ bình đồ điểm sự cố bão lũ tự động từ Excel sang AutoCAD.",
      seo: {
        title: "Tool Vẽ Bình Đồ Sự Cố Bão Lũ | Excel sang AutoCAD",
        description:
          "Tự động vẽ bình đồ các điểm sự cố bão lũ từ Excel (tọa độ, lý trình) sang AutoCAD — nhanh, thống nhất ký hiệu, phục vụ báo cáo khẩn.",
        keywords:
          "bình đồ bão lũ AutoCAD, bình đồ tuyến đường bộ, điểm sự cố Excel AutoCAD",
        slug: "binh-do-bao-lu",
      },
      perks: [
        "Gắn tọa độ từ Excel",
        "Ký hiệu điểm sự cố chuẩn",
        "Bản vẽ bình đồ nhanh",
        "Phục vụ báo cáo khẩn cấp",
      ],
      featuresSection: {
        eyebrow: "Tính năng",
        title: "Bình đồ sự cố bão lũ tự động từ Excel",
        subtitle:
          "Gắn điểm sự cố đúng vị trí trên bản vẽ — thống nhất ký hiệu, xuất nhanh phục vụ báo cáo khẩn cấp.",
      },
      featureHighlights: [
        {
          icon: "📋",
          title: "Danh sách từ Excel",
          desc: "Đọc bảng điểm sự cố: lý trình, tọa độ, mức độ và ghi chú hiện trường.",
        },
        {
          icon: "📍",
          title: "Gắn đúng vị trí",
          desc: "Đặt điểm sự cố chính xác trên bản đồ / mặt bằng tuyến trong AutoCAD.",
        },
        {
          icon: "🗺️",
          title: "Bình đồ thống nhất",
          desc: "Ký hiệu, màu sắc và chú thích đồng bộ — sẵn sàng báo cáo và lưu hồ sơ.",
        },
      ],
      features: [
        {
          icon: "📊",
          title: "Import Excel",
          desc: "Nhập danh sách điểm sự cố bão lũ từ file Excel theo mẫu quy định.",
        },
        {
          icon: "🧭",
          title: "Tọa độ & lý trình",
          desc: "Gắn điểm theo km, tọa độ hoặc hệ quy chiếu tuyến đường.",
        },
        {
          icon: "⚠️",
          title: "Ký hiệu chuẩn",
          desc: "Biểu tượng sự cố bão lũ thống nhất trên toàn bộ bình đồ.",
        },
        {
          icon: "⚡",
          title: "Vẽ nhanh",
          desc: "Tạo bản vẽ hàng chục — hàng trăm điểm trong vài phút thay vì vẽ tay.",
        },
        {
          icon: "📝",
          title: "Chú thích tự động",
          desc: "Gắn nhãn lý trình, mức độ và mô tả ngắn cho từng điểm sự cố.",
        },
        {
          icon: "🖨️",
          title: "Xuất DWG / in ấn",
          desc: "File AutoCAD phục vụ báo cáo khẩn, họp chỉ đạo và lưu trữ hồ sơ.",
        },
      ],
      introVideo: {
        title: "Video giới thiệu tool Bình đồ bão lũ",
        description:
          "Quy trình import Excel và vẽ bình đồ các điểm sự cố bão lũ trên AutoCAD.",
        youtubeId: "VIDEO_ID_BAO_LU",
      },
    },
    {
      id: "tool-in-an-qlcl",
      name: "In ấn hồ sơ QLCL hàng loạt",
      shortName: "In QLCL hàng loạt",
      platform: "Windows · Tool in ấn",
      badge: "In hàng loạt · QLCL",
      tagline:
        "In toàn bộ hồ sơ quản lý chất lượng theo điều kiện lọc — một lệnh in, tự động sắp xếp biên bản, phụ lục và các loại tài liệu khác nhau.",
      page: "in-an-qlcl.html",
      registerLabel: "Tool in ấn hồ sơ QLCL hàng loạt",
      accent: "purple",
      cardBadge: "Tool Windows",
      isFree: false,
      price: 299000,
      priceOriginal: null,
      priceUnit: "/năm",
      cardImage: "assets/tool-in-qlcl-logo.png",
      cardImageFit: "contain",
      /** File cài đặt Windows — đặt trong website/downloads/ */
      downloadUrl: "downloads/Print-QLCL.exe",
      downloadFileName: "Print QLCL.exe",
      cardSummary:
        "In hàng loạt hồ sơ QLCL theo điều kiện — 1 lệnh in, tự sắp xếp biên bản & phụ lục.",
      seo: {
        title: "Tool In Hồ Sơ QLCL Hàng Loạt | In Biên Bản Tự Động",
        description:
          "In toàn bộ hồ sơ quản lý chất lượng theo điều kiện lọc — một lệnh in, tự động sắp xếp biên bản, phụ lục và tài liệu QLCL.",
        keywords:
          "in hồ sơ QLCL hàng loạt, in biên bản tự động, tool in ấn QLCL, in hồ sơ thi công",
        slug: "in-an-qlcl",
      },
      placeholderSub: "In hàng loạt · QLCL",
      perks: [
        "Lọc theo điều kiện",
        "In 1 lệnh toàn bộ hồ sơ",
        "Tự sắp xếp biên bản",
        "Gom phụ lục đúng thứ tự",
      ],
      featuresSection: {
        eyebrow: "Tính năng",
        title: "In hồ sơ QLCL hàng loạt — tự động & có thứ tự",
        subtitle:
          "Dành cho đơn vị thi công, giám sát và QLCL cần in bộ hồ sơ đầy đủ theo gói thầu, hạng mục hoặc kỳ nghiệm thu.",
      },
      featureHighlights: [
        {
          icon: "🎯",
          title: "In theo điều kiện lọc",
          desc: "Chọn theo công trình, hạng mục, kỳ, loại biên bản — chỉ in đúng hồ sơ cần thiết.",
        },
        {
          icon: "🖨️",
          title: "Một lệnh — in toàn bộ",
          desc: "Không mở từng file — chạy một lệnh để in trọn bộ hồ sơ QLCL đã chọn.",
        },
        {
          icon: "📑",
          title: "Tự sắp xếp tài liệu",
          desc: "Biên bản, phụ lục, checklist… được xếp đúng thứ tự chuẩn trước khi gửi máy in.",
        },
      ],
      features: [
        {
          icon: "🔍",
          title: "Bộ lọc linh hoạt",
          desc: "Lọc theo tuyến, gói thầu, nhà thầu, thời gian, loại hồ sơ hoặc trạng thái nghiệm thu.",
        },
        {
          icon: "📋",
          title: "Nhiều loại biên bản",
          desc: "Hỗ trợ in đồng thời nhiều mẫu biên bản QLCL khác nhau trong cùng một đợt.",
        },
        {
          icon: "📎",
          title: "Phụ lục tự gom",
          desc: "Tự động gắn và sắp xếp phụ lục đi kèm từng biên bản — không bị thiếu hoặc lộn trang.",
        },
        {
          icon: "🗂️",
          title: "Thứ tự in chuẩn",
          desc: "Sắp xếp trang bìa, mục lục, biên bản chính, phụ lục theo quy trình hồ sơ QLCL.",
        },
        {
          icon: "⚡",
          title: "Tiết kiệm thời gian",
          desc: "Thay cho việc mở và in thủ công từng file — rút ngắn thời gian in hồ sơ hàng trăm trang.",
        },
        {
          icon: "✅",
          title: "Kiểm soát trước khi in",
          desc: "Xem trước danh sách tài liệu và số trang trước khi gửi lệnh in hàng loạt.",
        },
      ],
      introVideo: {
        title: "Video giới thiệu tool In QLCL hàng loạt",
        description:
          "Quy trình lọc điều kiện, chọn hồ sơ và in toàn bộ biên bản — phụ lục tự động sắp xếp.",
        youtubeId: "vHxkeXIkFQU",
      },
    },
  ],

  /** Firebase Firestore — cùng project quanlysuco-6797e */
  firebase: {
    apiKey: "AIzaSyBgLClpTtYEc-PwZSCfKFWc8HkoJbFPbj8",
    authDomain: "quanlysuco-6797e.firebaseapp.com",
    projectId: "quanlysuco-6797e",
    storageBucket: "quanlysuco-6797e.firebasestorage.app",
    messagingSenderId: "958751424697",
    appId: "1:958751424697:web:landing-quanlysuco",
  },

  /** Trang kế toán / xác nhận (tùy chọn, sau khi gửi form) */
  accountingPageUrl: "ke-toan.html",

  /** Thư mục ảnh CH Play (đã copy vào website) */
  assetsFolder: "Ho so dang CH play",
  /** Ảnh minh họa hero (không chữ) — tính năng hiển thị ở section HTML bên dưới */
  banner: "banner2.png",
  bannerFeatureGraphic: "921d2d07-8356-43ca-94cc-602a4c63dbe1.png",
  /** Logo header — false = chỉ hiện chữ thương hiệu */
  showSiteLogo: false,
  /** Favicon trình duyệt (vẫn dùng khi showSiteLogo: false) */
  siteLogo: "assets/logo-qld.png",
  /** Icon app CH Play — dùng trang chi tiết app nếu cần */
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

  /** false = ẩn hộp chuyển khoản trên trang xác nhận dùng thử */
  showPayment: false,

  bankTransfer: {
    accountName: "DUONG NGOC DAT",
    bankName: "Agribank",
    bankShortName: "Agribank",
    accountNumber: "7909205066584",
    bankId: "970405",
    branch: "Agribank - Chi nhánh H. Phù Yên - Sơn La",
    qrTemplate: "compact2",
    transferNoteHint: "Họ và tên - Loại phần mềm (không dấu, viết hoa tên)",
  },

  /** SEO — canonical, Open Graph, sitemap (đổi siteUrl khi có domain riêng) */
  seo: {
    siteUrl: "https://quanlysuco-road.vercel.app",
    title:
      "Tự động hóa hồ sơ quản lý đường bộ trên AutoCAD | Chuyển đổi số quản lý và bảo trì đường bộ",
    description:
      "Giảm 70–90% thời gian lập hồ sơ quản lý đường, bình đồ tuyến và cập nhật lý trình trên AutoCAD. Tool chuyên ngành cho hạt quản lý đường bộ, bảo trì và tư vấn giao thông.",
    keywords:
      "phần mềm quản lý sự cố đường bộ, app sự cố đường bộ, phần mềm quản lý đường bộ, tool AutoCAD đường bộ, bình đồ tuyến AutoCAD, hồ sơ quản lý đường, Excel sang AutoCAD, in hồ sơ QLCL",
    ogImage: "Ho so dang CH play/banner2.png",
    locale: "vi_VN",
    author: "Chuyển đổi số công tác quản lý và bảo trì đường bộ",
  },

  /** Nội dung landing page chính */
  landing: {
    hero: {
      title: "Tự động hóa hồ sơ quản lý đường bộ trên AutoCAD",
      subtitle:
        "Giảm tới 70–90% thời gian lập hồ sơ quản lý đường, bình đồ tuyến và cập nhật lý trình. Hạn chế sai sót, tăng năng suất và chuẩn hóa dữ liệu.",
      bullets: [
        "Tiết kiệm hàng trăm giờ công mỗi năm",
        "Tự động hóa công việc lặp lại",
        "Dễ triển khai trên AutoCAD",
      ],
      ctaVideo: "Xem video demo",
      ctaRegister: "Đăng ký tư vấn",
    },
    pains: {
      title: "Bạn đang gặp những vấn đề này?",
      items: [
        {
          icon: "⏱",
          title: "Vẽ bình đồ mất quá nhiều thời gian",
          desc: "Nhập dữ liệu thủ công và chỉnh sửa liên tục khi thay đổi lý trình.",
        },
        {
          icon: "📋",
          title: "Cập nhật hồ sơ quản lý đường phức tạp",
          desc: "Mỗi thay đổi nhỏ phải chỉnh sửa nhiều bản vẽ khác nhau.",
        },
        {
          icon: "🗂",
          title: "Dữ liệu phân tán",
          desc: "Thông tin nằm rải rác trong AutoCAD, Excel và hồ sơ giấy.",
        },
        {
          icon: "⚠",
          title: "Sai sót khi tổng hợp",
          desc: "Dễ nhầm lẫn lý trình, biển báo và công trình trên tuyến.",
        },
      ],
    },
    solutions: {
      title: "Bộ công cụ dành riêng cho ngành quản lý đường bộ",
      items: [
        {
          productId: "app-quan-ly-su-co",
          title: "App Quản Lý Sự Cố Đường Bộ",
          desc: "Ghi nhận hiện trường, GPS, lưu ảnh và quản lý sự cố tập trung — sản phẩm Hot.",
          featured: true,
        },
        {
          productId: "tool-bao-lu",
          title: "Tool Vẽ Bình Đồ Tự Động",
          desc: "Tạo bình đồ tuyến nhanh chóng từ dữ liệu đầu vào.",
        },
        {
          productId: "tool-ho-so-htgt",
          title: "Tool Hồ Sơ Quản Lý Đường",
          desc: "Tự động cập nhật lý trình, cọc H, biển báo và công trình trên tuyến.",
        },
        {
          productId: "tool-in-an-qlcl",
          title: "Tool In Ấn Hồ Sơ",
          desc: "Xuất bản vẽ và hồ sơ hàng loạt nhanh chóng, đồng bộ.",
        },
      ],
    },
    stats: {
      title: "Kết quả đạt được",
      items: [
        { value: "90%", label: "Giảm thời gian thao tác AutoCAD" },
        { value: "10x", label: "Tăng tốc độ xử lý hồ sơ" },
        { value: "100%", label: "Chuẩn hóa dữ liệu" },
        { value: "24/7", label: "Dễ dàng tra cứu và quản lý" },
      ],
    },
    demoVideo: {
      title: "Xem phần mềm hoạt động thực tế",
      subtitle:
        "Video ngắn trình bày quy trình từ dữ liệu đầu vào đến hồ sơ hoàn chỉnh.",
      youtubeId: "VIDEO_ID_DEMO",
    },
    audiences: {
      title: "Phù hợp với",
      items: [
        "Hạt quản lý đường bộ",
        "Đơn vị bảo trì đường bộ",
        "Tư vấn giao thông",
        "Ban quản lý dự án",
        "Kỹ sư hạ tầng giao thông",
        "Doanh nghiệp khảo sát thiết kế",
      ],
    },
    register: {
      title: "Nhận tư vấn và dùng thử",
      subtitle: "Điền form — chúng tôi liên hệ trong 24 giờ qua Zalo hoặc điện thoại.",
      submitLabel: "Đăng ký tư vấn",
    },
    faq: {
      title: "Câu hỏi thường gặp",
      items: [
        {
          q: "Có cần biết lập trình không?",
          a: "Không. Chỉ cần sử dụng AutoCAD như bình thường.",
        },
        {
          q: "Có hỗ trợ cài đặt không?",
          a: "Có. Hỗ trợ từ xa qua AnyDesk hoặc TeamViewer.",
        },
        {
          q: "Có dùng thử được không?",
          a: "Có. Liên hệ để nhận bản dùng thử.",
        },
        {
          q: "Có hỗ trợ cập nhật không?",
          a: "Có. Hỗ trợ nâng cấp theo phiên bản mới.",
        },
      ],
    },
    ctaFinal: {
      title: "Đừng để công việc lặp lại làm mất thời gian của kỹ sư",
      subtitle:
        "Hãy để phần mềm xử lý các thao tác thủ công để bạn tập trung vào chuyên môn.",
      button: "Đăng ký tư vấn ngay",
    },
  },
};
