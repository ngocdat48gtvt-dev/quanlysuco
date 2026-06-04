@echo off
chcp 65001 >nul
setlocal

set "WEBSITE_DIR=%~dp0"
set "APP_DIR=%WEBSITE_DIR%..\dieu-hanh-web"
set "OUT_DH=%WEBSITE_DIR%dieu-hanh"
set "OUT_DB=%WEBSITE_DIR%dashboard"

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

for %%D in ("%OUT_DH%" "%OUT_DB%") do (
  if exist "%%~fD" rmdir /s /q "%%~fD"
  mkdir "%%~fD"
  xcopy /e /i /y "%APP_DIR%\dist\*" "%%~fD\" >nul
)

echo.
echo Da copy vao:
echo   %OUT_DH%
echo   %OUT_DB%
echo.
echo Commit ca hai thu muc + push len Vercel.
pause
exit /b 0

:fail
popd
echo Build that bai.
pause
exit /b 1
