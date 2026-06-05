@echo off
chcp 65001 >nul
setlocal EnableExtensions

set "DIR=%~dp0"
set "EXE=%DIR%Print-Control-PRO.exe"
set "ICO=%DIR%Print-Control-PRO.ico"

if not exist "%ICO%" (
  echo Tao icon truoc...
  python "%DIR%generate-printer-icon.py"
  if errorlevel 1 goto :fail
)

if not exist "%EXE%" (
  echo [LOI] Khong tim thay %EXE%
  pause
  exit /b 1
)

echo Dang gan icon vao exe...
pushd "%DIR%"
if not exist "node_modules\rcedit\bin\rcedit-x64.exe" (
  call npm install --no-save rcedit@4.0.1
  if errorlevel 1 goto :fail
)
call "node_modules\rcedit\bin\rcedit-x64.exe" "%EXE%" --set-icon "Print-Control-PRO.ico"
popd
if errorlevel 1 goto :fail

echo OK - icon da gan vao Print-Control-PRO.exe
echo Commit lai file exe neu can, roi push len Vercel.
pause
exit /b 0

:fail
echo That bai. Can Node.js + npm de chay rcedit.
pause
exit /b 1
