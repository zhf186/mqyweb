@echo off
chcp 65001 >nul
setlocal

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
set "APP_DIR=%ROOT%\frontend"

echo ==========================================
echo   Manqiyou frontend start script
echo ==========================================
echo.

for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":3000 .*LISTENING"') do (
    echo [WARN] Port 3000 is already in use. PID=%%A.
    echo Stop the existing frontend service first, then retry.
    echo.
    pause
    endlocal
    exit /b 1
)

pushd "%APP_DIR%"

if /I "%SKIP_NPM_INSTALL%"=="1" (
    echo SKIP_NPM_INSTALL=1, skipping npm install.
) else (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        popd
        pause
        endlocal
        exit /b 1
    )
)

echo.
echo Starting frontend service...
call npm run dev
set "EXIT_CODE=%ERRORLEVEL%"
popd

echo.
if not "%EXIT_CODE%"=="0" (
    echo Frontend exited with code %EXIT_CODE%.
)
pause
endlocal
exit /b %EXIT_CODE%
