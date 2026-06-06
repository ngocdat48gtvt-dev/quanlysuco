@echo off
chcp 65001 >nul
setlocal EnableExtensions

set "TARGET_DIR=%~dp0downloads"
set "TARGET=%TARGET_DIR%\VeBinhDo-Setup.exe"

set "SOURCE=%~dp0..\VeBinhDo\BoCai\output\VeBinhDo_Setup.exe"
if not exist "%SOURCE%" set "SOURCE=%~dp0..\VeBinhDo\BoCai\output\VeBinhDo_Setup.exe"

if not exist "%SOURCE%" (
  echo [LOI] Khong tim thay file cai dat.
  echo Chay truoc: VeBinhDo\BoCai\TAO_BO_CAI.bat
  echo Output: VeBinhDo\BoCai\output\VeBinhDo_Setup.exe
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
echo Tiep theo: commit + push thu muc website (downloads/VeBinhDo-Setup.exe) len Vercel.
pause
