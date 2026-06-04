@echo off
chcp 65001 >nul
setlocal

set "WEBSITE_DIR=%~dp0"
set "APP_DIR=%WEBSITE_DIR%..\dieu-hanh-web"
set "OUT_DIR=%WEBSITE_DIR%dieu-hanh"

if not exist "%APP_DIR%\package.json" (
  echo [LOI] Khong tim thay dieu-hanh-web tai:
  echo   %APP_DIR%
  pause
  exit /b 1
)

if not exist "%APP_DIR%\.env" (
  echo [LOI] Thieu file %APP_DIR%\.env
  echo Copy tu license-admin\.env hoac dieu-hanh-web\.env.example
  pause
  exit /b 1
)

echo Building dieu-hanh-web...
pushd "%APP_DIR%"
call npm install
if errorlevel 1 goto :fail
call npm run build
if errorlevel 1 goto :fail
popd

if exist "%OUT_DIR%" rmdir /s /q "%OUT_DIR%"
mkdir "%OUT_DIR%"
xcopy /e /i /y "%APP_DIR%\dist\*" "%OUT_DIR%\" >nul

echo.
echo Da copy build vao: %OUT_DIR%
echo Commit thu muc dieu-hanh va push len Git / Vercel.
echo.
pause
exit /b 0

:fail
popd
echo Build that bai.
pause
exit /b 1
