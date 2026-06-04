# Web điều hành trên cùng site bán sản phẩm

Trang marketing (`san-pham.html`, `app-quan-ly-su-co.html`…) và **cổng điều hành** dùng chung domain Vercel, ví dụ:

- `https://quanlysuco-road.vercel.app/san-pham` — giới thiệu & quảng cáo sản phẩm
- `https://quanlysuco-road.vercel.app/dashboard/` — **chính** (bookmark cũ)
- `https://quanlysuco-road.vercel.app/dieu-hanh/` — cùng app (bản copy)

Sau khi load, URL có dạng `.../dashboard/#/login`.

`license-admin` vẫn riêng — chỉ bạn quản lý license.

## Build & deploy

1. Cấu hình `dieu-hanh-web/.env` (cùng Firebase project với `js/config.js`).
2. Chạy `build-dieu-hanh.bat` trong thư mục `website`.
3. Commit thư mục `website/dieu-hanh/` (file build).
4. Push repo `website` → Vercel deploy.

Menu **Điều hành** và nút **Điều hành web** trên trang App sự cố lấy URL từ `SITE_CONFIG.dispatchPortal` trong `js/config.js`.

## Sửa đường dẫn

Trong `js/config.js`:

```js
dispatchPortal: {
  path: "/dieu-hanh/",
  navLabel: "Điều hành",
  loginLabel: "Đăng nhập điều hành",
},
```

Sau khi đổi path, build lại `dieu-hanh-web` với `base` tương ứng trong `vite.config.ts`.
