@echo off
chcp 65001 >nul
setlocal

set "WEBSITE_DIR=%~dp0"
set "APP_DIR=%WEBSITE_DIR%..\web-user"
set "DIST=%APP_DIR%\dist"
set "TARGET=%WEBSITE_DIR%user"

if not exist "%APP_DIR%\package.json" (
  echo [LOI] Khong tim thay web-user
  pause
  exit /b 1
)

echo Building web-user...
pushd "%APP_DIR%"
call npm install
if errorlevel 1 goto :fail
call npm run build
if errorlevel 1 goto :fail
popd

if exist "%TARGET%" rmdir /s /q "%TARGET%"
mkdir "%TARGET%"
xcopy /e /i /y "%DIST%\*" "%TARGET%\" >nul

powershell -NoProfile -Command ^
  "$p='%TARGET%\index.html'; $b='/user'; $h=[IO.File]::ReadAllText($p); " ^
  "$h=$h.Replace('./firebase-config.js',$b+'/firebase-config.js'); " ^
  "$h=$h.Replace('./pwa-192.png',$b+'/pwa-192.png'); " ^
  "$h=$h.Replace('./assets/',$b+'/assets/'); " ^
  "[IO.File]::WriteAllText($p,$h)"

echo.
echo Da copy vao website/user/
echo Commit + push repo website len Vercel.
pause
exit /b 0

:fail
popd
echo Build that bai.
pause
exit /b 1
