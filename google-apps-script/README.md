# Kết nối form website → Google Sheet

1. Tạo [Google Sheet](https://sheets.google.com) mới.
2. Đổi tên tab đầu tiên thành **Đăng ký**.
3. Dòng 1 (tiêu đề): `Thời gian` | `Họ tên` | `SĐT` | `Gmail` | `Địa chỉ` | `Nguồn`
4. Copy **ID** từ URL sheet (`https://docs.google.com/spreadsheets/d/XXXXX/edit` → `XXXXX`).
5. Mở **Extensions → Apps Script**, dán nội dung `Code.gs`, sửa `SPREADSHEET_ID`.
6. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy URL deployment vào `website/js/config.js` → `googleScriptUrl`.

Sau khi khách gửi form trên web, một dòng mới xuất hiện trên Sheet và trình duyệt chuyển sang **ke-toan.html**.
