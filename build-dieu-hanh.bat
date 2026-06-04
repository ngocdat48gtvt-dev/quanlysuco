@echo off
chcp 65001 >nul
setlocal

set "WEBSITE_DIR=%~dp0"
set "APP_DIR=%WEBSITE_DIR%..\dieu-hanh-web"
set "DIST=%APP_DIR%\dist"

if not exist "%APP_DIR%\package.json" (
  echo [LOI] Khong tim thay dieu-hanh-web
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

call :deploy_folder "%WEBSITE_DIR%dashboard" "/dashboard"
call :deploy_folder "%WEBSITE_DIR%dieu-hanh" "/dieu-hanh"

echo.
echo Da copy vao dashboard va dieu-hanh (duong dan tuyet doi /assets).
echo Commit + push repo website len Vercel.
pause
exit /b 0

:deploy_folder
set "TARGET=%~1"
set "BASE=%~2"
if exist "%TARGET%" rmdir /s /q "%TARGET%"
mkdir "%TARGET%"
xcopy /e /i /y "%DIST%\*" "%TARGET%\" >nul
powershell -NoProfile -Command ^
  "$p='%TARGET%\index.html'; $b='%BASE%'; $h=[IO.File]::ReadAllText($p); " ^
  "$h=$h.Replace('./firebase-config.js',$b+'/firebase-config.js'); " ^
  "$h=$h.Replace('./assets/',$b+'/assets/'); " ^
  "$h=$h -replace '(?s)<script>\\s*\\(function \\(\\)[^<]*</script>\\s*',''; " ^
  "[IO.File]::WriteAllText($p,$h)"
exit /b 0

:fail
popd
echo Build that bai.
pause
exit /b 1
