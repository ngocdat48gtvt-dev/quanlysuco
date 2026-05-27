# Form không ghi Sheet — kiểm tra từng bước

## 1. Sheet (ảnh của bạn — ĐÚNG)

- Tab: **Đăng ký**
- Hàng 1: Thời gian | Họ tên | SĐT | Gmail | Địa chỉ | Nguồn
- ID Sheet: `1Ey7iQLwC-SwUPZsEMbZ12IDKjNjTW3yLx7eHAM9Eus8`

## 2. Apps Script — phải giống file Code.gs trên máy

Mở https://script.google.com → project **QuanLySuCoForm**

Dòng 11–12 phải là:

```javascript
var SPREADSHEET_ID = "1Ey7iQLwC-SwUPZsEMbZ12IDKjNjTW3yLx7eHAM9Eus8";
var SHEET_NAME = "Đăng ký";
```

**KHÔNG** được còn: `DÁN_ID_GOOGLE_SHEET_VÀO_ĐÂY` hoặc cả link `https://docs.google.com/...`

## 3. Bắt buộc: Deploy phiên bản MỚI

Sửa code trên web **chưa đủ** — phải:

1. **Triển khai** → **Quản lý triển khai**
2. Bút **Chỉnh sửa** (Web app)
3. **Phiên bản** → chọn **Mới**
4. **Triển khai**

## 4. Test URL trong trình duyệt

Dán URL `/exec` vào Chrome. Phải thấy:

```json
{"ok":true,"message":"QuanLySuCo form OK","sheet":"Đăng ký"}
```

Nếu thấy trang đăng nhập / HTML → deploy sai quyền (phải **Bất kỳ ai**).

## 5. Chạy web đúng cách

```powershell
cd C:\Users\PC\AndroidStudioProjects\QuanLySuCo\website
npx --yes serve .
```

Mở **http://localhost:3000** — không double-click file HTML.

## 6. config.js

`googleScriptUrl` phải trùng URL deploy mới nhất (kết thúc `/exec`).
