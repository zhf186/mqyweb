@echo off
chcp 65001 >nul
setlocal

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
set "COMPOSE_FILE=%ROOT%\docker-compose.mysql.yml"

echo ========================================
echo Start MySQL and Redis (Docker)
echo ========================================
echo.

echo [1/3] Checking Docker...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop is not running.
    echo Please start Docker Desktop first and retry.
    echo.
    pause
    exit /b 1
)
echo [OK] Docker is running.
echo.

echo [2/3] Starting MySQL and Redis containers...
docker-compose -f "%COMPOSE_FILE%" up -d mysql redis
if errorlevel 1 (
    echo [ERROR] Failed to start MySQL/Redis containers.
    echo.
    pause
    exit /b 1
)
echo [OK] Containers started.
echo.

echo [3/3] Waiting for MySQL readiness...
ping -n 11 127.0.0.1 >nul
docker exec manqiyou-mysql mysqladmin ping -h localhost -u root -proot123456 >nul 2>&1
if errorlevel 1 (
    echo [WARN] MySQL is still initializing. Wait a bit and try again.
) else (
    echo [OK] MySQL is ready.
)
echo.

echo ========================================
echo MySQL connection info
echo ========================================
echo Host: localhost
echo Port: 3306
echo Database: manqiyou
echo Username: manqiyou
echo Password: manqiyou123456
echo Root password: root123456
echo ========================================
echo.
echo Next:
echo 1. Start backend: start-backend.bat
echo 2. Start frontend: start-frontend.bat
echo 3. Admin login: http://localhost:3000/admin/login
echo.
echo View logs: docker-compose -f docker-compose.mysql.yml logs -f mysql
echo Stop services: docker-compose -f docker-compose.mysql.yml down
echo.

pause
endlocal
