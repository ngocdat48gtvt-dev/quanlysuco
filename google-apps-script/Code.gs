var SPREADSHEET_ID = "1Ey7iQLwC-SwUPZsEMbZ12IDKjNjTW3yLx7eHAM9Eus8";
var SHEET_NAME = "Đăng ký";

var HEADERS = [
  "Thời gian",
  "Họ tên",
  "SĐT",
  "Gmail",
  "Địa chỉ",
  "Nguồn",
  "Trang gửi",
];

function doGet() {
  return out({ ok: true, version: "final-v6", sheet: SHEET_NAME, columns: HEADERS.length });
}

function doPost(e) {
  try {
    var p = e.parameter || {};
    if (e.postData && e.postData.contents) {
      try {
        p = JSON.parse(e.postData.contents);
      } catch (err) {}
    }

    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error("Khong tim thay tab: " + SHEET_NAME);
    }

    ensureHeaders_(sheet);

    sheet.appendRow([
      new Date(),
      String(p.fullName || "").trim(),
      String(p.phone || "").trim(),
      String(p.email || "").trim(),
      String(p.address || "").trim(),
      String(p.source || "website").trim(),
      String(p.pageUrl || "").trim(),
    ]);

    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function ensureHeaders_(sheet) {
  if (String(sheet.getRange(1, 1).getValue()).trim() !== "Thời gian") {
    return;
  }
  var g1 = String(sheet.getRange(1, 7).getValue()).trim();
  if (g1 === "Thời gian ISO") {
    sheet.getRange(1, 7).setValue("Trang gửi");
    if (sheet.getLastColumn() >= 8) {
      sheet.getRange(1, 8).clearContent();
    }
  }
  if (sheet.getLastColumn() < HEADERS.length) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
