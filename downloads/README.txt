Tool In QLCL — file tai & build
================================

ICON (hinh 3 - may in xanh):
  printer-icon.png
  Print-Control-PRO.ico

BUILD EXE (output: dist\Print-Control-PRO.exe):
  1. Copy vao THU MUC GOC project tool:
     - build-print-control-pro.bat
     - Print-Control-PRO.ico
  2. Chay: build-print-control-pro.bat
     (hoac: build-print-control-pro.bat ten_file.py)
  3. Ket qua: dist\Print-Control-PRO.exe

QUAN TRONG:
  - KHONG chay apply-exe-icon.bat / rcedit — se hong file PyInstaller!
  - Icon phai gan luc build (--icon), khong sua sau.

DUA LEN WEB:
  1. Chay: website\copy-in-qlcl-exe.bat
  2. Push: website\downloads\Print-Control-PRO.exe
  3. Kiem tra: .../downloads/Print-QLCL.exe

VeBinhDo — Bình đồ điểm sự cố bão lũ
=====================================
BUILD:
  1. Dong AutoCAD
  2. Chay: VeBinhDo\BoCai\TAO_BO_CAI.bat
  3. Output: VeBinhDo\BoCai\output\VeBinhDo_Setup.exe

ICON:
  - Nguon: VeBinhDo\BoCai\VeBinhDo-icon.png
  - Tao .ico: python VeBinhDo\BoCai\make-icon-from-png.py
  - TAO_BO_CAI.bat tu dong tao icon truoc khi dong goi

DUA LEN WEB:
  1. Chay: website\copy-vebinhdo-setup.bat
  2. Push: website\downloads\VeBinhDo-Setup.exe
  3. Kiem tra nut "Tai xuong" tai trang binh-do-bao-lu
