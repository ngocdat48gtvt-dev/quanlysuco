@echo off
chcp 65001 >nul
setlocal

set "WEBSITE_DIR=%~dp0"
set "APP_DIR=%WEBSITE_DIR%..\nhat-ky-tuan-duong"
set "DIST=%APP_DIR%\dist"
set "TARGET=%WEBSITE_DIR%nhat-ky"

if not exist "%APP_DIR%\package.json" (
  echo [LOI] Khong tim thay nhat-ky-tuan-duong
  pause
  exit /b 1
)

echo Building nhat-ky-tuan-duong (base /nhat-ky/)...
pushd "%APP_DIR%"
call npm install
if errorlevel 1 goto :fail
set "VITE_DEPLOY_BASE=/nhat-ky/"
call npm run build
if errorlevel 1 goto :fail
popd

if exist "%TARGET%" rmdir /s /q "%TARGET%"
mkdir "%TARGET%"
xcopy /e /i /y "%DIST%\*" "%TARGET%\" >nul

echo.
echo Da copy vao website/nhat-ky/
echo Commit + push repo website len Vercel.
pause
exit /b 0

:fail
popd
echo Build that bai.
pause
exit /b 1
