@echo off
chcp 65001 >nul
setlocal

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
set "APP_DIR=%ROOT%\backend\manqiyou-app"

echo ==========================================
echo   Manqiyou backend start script
echo ==========================================
echo.

for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":8080 .*LISTENING"') do (
    echo [WARN] Port 8080 is already in use. PID=%%A.
    echo Stop the existing backend service first, then retry.
    echo.
    pause
    endlocal
    exit /b 1
)

if /I "%SPRING_PROFILES_ACTIVE%"=="" set SPRING_PROFILES_ACTIVE=dev
if /I "%DB_HOST%"=="" set DB_HOST=localhost
if /I "%DB_PORT%"=="" set DB_PORT=3306
if /I "%DB_NAME%"=="" set DB_NAME=manqiyou
if /I "%DB_USERNAME%"=="" set DB_USERNAME=manqiyou
if /I "%DB_PASSWORD%"=="" set DB_PASSWORD=manqiyou123456
if /I "%JWT_SECRET%"=="" set JWT_SECRET=dev-only-jwt-secret-change-before-prod-32-chars-minimum

set "EMBEDDED_JDK=%ROOT%\.runlogs\jdk17\jdk-17.0.18+8"
if exist "%EMBEDDED_JDK%\bin\java.exe" (
    set "PATH=%EMBEDDED_JDK%\bin;%PATH%"
    echo Using embedded JDK17: %EMBEDDED_JDK%
) else (
    echo Embedded JDK17 not found. Using system Java from PATH.
)

echo Profile: %SPRING_PROFILES_ACTIVE%
echo Starting backend service...
echo.

pushd "%APP_DIR%"
call mvnw.cmd spring-boot:run
set "EXIT_CODE=%ERRORLEVEL%"
popd

echo.
if not "%EXIT_CODE%"=="0" (
    echo Backend exited with code %EXIT_CODE%.
)
pause
endlocal
exit /b %EXIT_CODE%
