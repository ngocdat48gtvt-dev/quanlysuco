@echo off
chcp 65001 >nul
setlocal EnableExtensions

set "TARGET_DIR=%~dp0downloads"
set "TARGET=%TARGET_DIR%\Print-Control-PRO.exe"

REM --- Sua duong dan SOURCE neu can ---
set "SOURCE=%~dp0..\Tool in hang loat theo DK\dist\Print Control PRO.exe"
if not exist "%SOURCE%" set "SOURCE=%~dp0..\Tool in hang loat theo ĐK\dist\Print Control PRO.exe"

if not exist "%SOURCE%" (
  echo [LOI] Khong tim thay file exe.
  echo Nguon: %SOURCE%
  echo.
  echo Copy thu cong: dat Print Control PRO.exe vao
  echo   website\downloads\Print-Control-PRO.exe
  pause
  exit /b 1
)

if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
copy /Y "%SOURCE%" "%TARGET%"
if errorlevel 1 (
  echo Copy that bai.
  pause
  exit /b 1
)
echo OK: %TARGET%
echo Commit + push website/downloads len Vercel.
pause
