@echo off
chcp 65001 >nul
setlocal EnableExtensions

set "TARGET_DIR=%~dp0downloads"
set "TARGET=%TARGET_DIR%\Print-QLCL.exe"

REM --- Sua duong dan SOURCE neu can ---
set "SOURCE=%TARGET_DIR%\Print QLCL.exe"
if not exist "%SOURCE%" set "SOURCE=%~dp0..\Tool in hang loat theo DK\dist\Print QLCL.exe"
if not exist "%SOURCE%" set "SOURCE=%~dp0..\Tool in hang loat theo ĐK\dist\Print QLCL.exe"
if not exist "%SOURCE%" set "SOURCE=%~dp0..\Tool in hang loat theo DK\dist\Print-Control-PRO.exe"

if not exist "%SOURCE%" (
  echo [LOI] Khong tim thay file exe.
  echo Dat Print QLCL.exe vao: %TARGET_DIR%
  pause
  exit /b 1
)

if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
copy /Y "%SOURCE%" "%TARGET%" >nul
if errorlevel 1 (
  echo Copy that bai.
  pause
  exit /b 1
)
echo OK: %TARGET%
echo Commit + push website/downloads len Vercel.
pause
