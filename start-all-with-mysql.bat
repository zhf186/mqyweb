@echo off
chcp 65001 >nul
setlocal

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

echo ========================================
echo Manqiyou full stack start (MySQL)
echo ========================================
echo.

for %%P in (8080 3000) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":%%P .*LISTENING"') do (
        echo [WARN] Port %%P is already in use. PID=%%A. Please stop old services first.
        goto :port_check_done
    )
)
:port_check_done
echo.

echo [1/4] Checking Docker...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop is not running.
    pause
    exit /b 1
)
echo [OK] Docker is running.
echo.

echo [2/4] Starting MySQL and Redis...
docker-compose -f "%ROOT%\docker-compose.mysql.yml" up -d mysql redis
if errorlevel 1 (
    echo [ERROR] Failed to start MySQL/Redis.
    pause
    exit /b 1
)
ping -n 21 127.0.0.1 >nul
echo.

if /I "%SPRING_PROFILES_ACTIVE%"=="" set SPRING_PROFILES_ACTIVE=dev
if /I "%DB_HOST%"=="" set DB_HOST=localhost
if /I "%DB_PORT%"=="" set DB_PORT=3306
if /I "%DB_NAME%"=="" set DB_NAME=manqiyou
if /I "%DB_USERNAME%"=="" set DB_USERNAME=manqiyou
if /I "%DB_PASSWORD%"=="" set DB_PASSWORD=manqiyou123456
if /I "%JWT_SECRET%"=="" set JWT_SECRET=dev-only-jwt-secret-change-before-prod-32-chars-minimum

set "EMBEDDED_JDK=%ROOT%\.runlogs\jdk17\jdk-17.0.18+8"
if exist "%EMBEDDED_JDK%\bin\java.exe" (
    set "BACKEND_PATH=%EMBEDDED_JDK%\bin;%PATH%"
    echo [3/4] Starting backend with embedded JDK17...
) else (
    set "BACKEND_PATH=%PATH%"
    echo [3/4] Starting backend with system Java...
)

start "Manqiyou Backend" /d "%ROOT%\backend\manqiyou-app" cmd /k "set PATH=%BACKEND_PATH%&& set SPRING_PROFILES_ACTIVE=%SPRING_PROFILES_ACTIVE%&& set DB_HOST=%DB_HOST%&& set DB_PORT=%DB_PORT%&& set DB_NAME=%DB_NAME%&& set DB_USERNAME=%DB_USERNAME%&& set DB_PASSWORD=%DB_PASSWORD%&& set JWT_SECRET=%JWT_SECRET%&& call mvnw.cmd spring-boot:run"
ping -n 13 127.0.0.1 >nul
echo.

echo [4/4] Starting frontend...
start "Manqiyou Frontend" /d "%ROOT%\frontend" cmd /k "npm run dev"
echo.

echo ========================================
echo Started
echo ========================================
echo Frontend: http://localhost:3000
echo Backend : http://localhost:8080
echo Admin   : http://localhost:3000/admin/login
echo.
echo Dev credentials are controlled by:
echo frontend/.env.example -^> NEXT_PUBLIC_SHOW_DEV_CREDENTIALS
echo.

pause
endlocal
