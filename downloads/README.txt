File cai dat tool In QLCL — dat tai day truoc khi push len Vercel:

  Print-Control-PRO.exe   (~57 MB)

Cach copy tu may build:
  1. Chay: website\copy-in-qlcl-exe.bat
     (sua duong dan SOURCE trong file .bat neu can)
  2. Hoac copy tay tu:
     Tool in hang loat theo DK\dist\Print Control PRO.exe
     -> website\downloads\Print-Control-PRO.exe

Sau do: git add website/downloads/Print-Control-PRO.exe && git push

Kiem tra: https://quanlysuco-road.vercel.app/downloads/Print-Control-PRO.exe
(phai tai duoc, khong 404)

Icon may in cho file .exe:
  - Print-Control-PRO.ico / Print-Control-PRO-icon.png
  - Chay: apply-exe-icon.bat (gan icon vao exe)
  - Tao lai icon: python generate-printer-icon.py
