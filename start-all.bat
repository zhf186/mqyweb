@echo off
chcp 65001 >nul
setlocal

echo ==========================================
echo   Manqiyou full stack start script
echo ==========================================
echo.
echo Frontend: http://localhost:3000
echo Backend : http://localhost:8080
echo H2      : http://localhost:8080/h2-console
echo.

for %%P in (8080 3000) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":%%P .*LISTENING"') do (
        echo [WARN] Port %%P is already in use. PID=%%A. Please stop old services first.
        goto :port_check_done
    )
)
:port_check_done

if not exist "frontend\public\brand_assets" (
    echo Copying brand assets to frontend...
    xcopy /E /I /Y "brand_assets" "frontend\public\brand_assets" >nul
) else (
    echo Brand assets already exist.
)

if /I "%SPRING_PROFILES_ACTIVE%"=="" set SPRING_PROFILES_ACTIVE=dev
if /I "%DB_HOST%"=="" set DB_HOST=localhost
if /I "%DB_PORT%"=="" set DB_PORT=3306
if /I "%DB_NAME%"=="" set DB_NAME=manqiyou
if /I "%DB_USERNAME%"=="" set DB_USERNAME=manqiyou
if /I "%DB_PASSWORD%"=="" set DB_PASSWORD=manqiyou123456
if /I "%JWT_SECRET%"=="" set JWT_SECRET=dev-only-jwt-secret-change-before-prod-32-chars-minimum

set "EMBEDDED_JDK=%~dp0.runlogs\jdk17\jdk-17.0.18+8"
if exist "%EMBEDDED_JDK%\bin\java.exe" (
    set "BACKEND_PATH=%EMBEDDED_JDK%\bin;%PATH%"
    echo Using embedded JDK17: %EMBEDDED_JDK%
) else (
    set "BACKEND_PATH=%PATH%"
    echo Embedded JDK17 not found. Using system Java from PATH.
)

echo.
echo Starting backend service...
start "Manqiyou Backend" /d "%~dp0backend\manqiyou-app" cmd /k "set PATH=%BACKEND_PATH%&& set SPRING_PROFILES_ACTIVE=%SPRING_PROFILES_ACTIVE%&& set DB_HOST=%DB_HOST%&& set DB_PORT=%DB_PORT%&& set DB_NAME=%DB_NAME%&& set DB_USERNAME=%DB_USERNAME%&& set DB_PASSWORD=%DB_PASSWORD%&& set JWT_SECRET=%JWT_SECRET%&& call mvnw.cmd spring-boot:run"

echo Waiting backend warmup...
timeout /t 10 /nobreak >nul

echo Starting frontend service...
if /I "%SKIP_NPM_INSTALL%"=="1" (
    start "Manqiyou Frontend" /d "%~dp0frontend" cmd /k "npm run dev"
) else (
    start "Manqiyou Frontend" /d "%~dp0frontend" cmd /k "npm install && npm run dev"
)

echo.
echo ==========================================
echo Services are starting.
echo Frontend: http://localhost:3000
echo Backend : http://localhost:8080
echo ==========================================
echo.

endlocal
