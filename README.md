# Website bán hàng — Quản lý sự cố đường bộ

Trang landing giới thiệu app, gallery ảnh CH Play, **4 video hướng dẫn**, form đăng ký (họ tên, SĐT, Gmail, địa chỉ) và chuyển sang **trang kế toán** sau khi gửi.

## Chạy thử trên máy

Mở file `index.html` bằng trình duyệt, hoặc:

```bash
cd website
npx --yes serve .
```

Truy cập `http://localhost:3000`

## Cấu hình bắt buộc

1. **`js/config.js`**
   - `zalo.phone` — SĐT Zalo (vd: `0912345678`) để hiện nút chat & link `zalo.me`
   - `googleScriptUrl` — URL Web App (Google Apps Script)
   - `videos[].youtubeId` — 4 ID video YouTube
   - `supportEmail`, `bankTransfer` — thông tin liên hệ / chuyển khoản

2. **Ảnh CH Play** — copy vào `assets/screenshots/` (xem README trong thư mục đó)

3. **Google Sheet** — làm theo `google-apps-script/README.md`

## Ảnh CH Play

Thư mục `Ho so dang CH play/` (đã copy vào website):

| File | Dùng trên web |
|------|----------------|
| `921d2d07-….png` | Banner đầu trang (feature graphic) |
| `banner2.png` | Minh họa cạnh icon |
| `ic_launcher_play_store_512.png` | Logo / favicon |
| `1.jpg` … `4.jpg` | Gallery ảnh app |

Cấu hình trong `js/config.js` → `assetsFolder`, `banner`, `screenshots`.

## Đăng lên Vercel (khuyên dùng)

Trang này **không cần build** — chỉ cần host file tĩnh.

### Cách 1: GitHub + Vercel (ổn định, tự cập nhật khi push code)

1. Tạo repo trên [github.com](https://github.com) (repo riêng chỉ chứa `website/`, hoặc cả project Android).
2. Đẩy code lên GitHub (đảm bảo có cả thư mục `Ho so dang CH play/` và ảnh).
3. Vào [vercel.com](https://vercel.com) → đăng nhập bằng GitHub → **Add New… → Project**.
4. Chọn repo → **Import**.
5. Cấu hình:
   - **Root Directory:** `website` (nếu repo là cả `QuanLySuCo`; bỏ trống nếu repo chỉ có nội dung trong `website`)
   - **Framework Preset:** Other
   - **Build Command:** để trống
   - **Output Directory:** để trống (hoặc `.`)
6. **Deploy** → vài phút sau có link dạng `https://ten-project.vercel.app`.

Mỗi lần `git push`, Vercel tự deploy lại.

### Cách 2: Lệnh Vercel CLI (không cần GitHub)

```bash
cd website
npx vercel login
npx vercel
```

Lần đầu hỏi project name → Enter. Link preview xong, chạy:

```bash
npx vercel --prod
```

để lên domain chính thức.

### Sau khi lên Vercel

- Form đăng ký cần chạy qua **HTTPS** (Vercel có sẵn) — `googleScriptUrl` trong `js/config.js` vẫn dùng như localhost.
- Nếu form lỗi sau khi deploy: Google Apps Script → **Deploy** lại Web App (quyền *Anyone*).
- Có thể gắn tên miền riêng: Vercel → Project → **Settings → Domains**.

Dùng URL trang này làm **Privacy Policy** trên Play Console nếu cần.

## Luồng form

```
Khách điền form → POST Google Sheet → sessionStorage → ke-toan.html
```

Nếu chưa cấu hình `googleScriptUrl`, form vẫn chuyển sang trang kế toán (chế độ demo, không ghi Sheet).
