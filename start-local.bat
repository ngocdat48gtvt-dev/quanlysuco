@echo off
cd /d "%~dp0"
echo ========================================
echo   Landing Page - Quan ly su co
echo   Thu muc: %CD%
echo ========================================
echo.
echo Mo trinh duyet: http://localhost:3000
echo Giu cua so nay mo - dong la web tat.
echo.
start "" "http://localhost:3000"
npx --yes serve . -l 3000
