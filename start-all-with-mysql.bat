@echo off
chcp 65001 >nul
echo ========================================
echo Manqiyou full stack start (MySQL)
echo ========================================
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
docker-compose -f docker-compose.mysql.yml up -d mysql redis
if errorlevel 1 (
    echo [ERROR] Failed to start MySQL/Redis.
    pause
    exit /b 1
)
timeout /t 20 /nobreak >nul
echo.

if "%SPRING_PROFILES_ACTIVE%"=="" set SPRING_PROFILES_ACTIVE=dev
if "%DB_HOST%"=="" set DB_HOST=localhost
if "%DB_PORT%"=="" set DB_PORT=3306
if "%DB_NAME%"=="" set DB_NAME=manqiyou
if "%DB_USERNAME%"=="" set DB_USERNAME=manqiyou
if "%DB_PASSWORD%"=="" set DB_PASSWORD=manqiyou123456
if "%JWT_SECRET%"=="" set JWT_SECRET=dev-only-jwt-secret-change-before-prod-32-chars-minimum

echo [3/4] Starting backend...
cd backend\manqiyou-app
start "Manqiyou Backend" cmd /k "set SPRING_PROFILES_ACTIVE=%SPRING_PROFILES_ACTIVE% && set DB_HOST=%DB_HOST% && set DB_PORT=%DB_PORT% && set DB_NAME=%DB_NAME% && set DB_USERNAME=%DB_USERNAME% && set DB_PASSWORD=%DB_PASSWORD% && set JWT_SECRET=%JWT_SECRET% && .\mvnw.cmd spring-boot:run"
cd ..\..
timeout /t 12 /nobreak >nul
echo.

echo [4/4] Starting frontend...
cd frontend
start "Manqiyou Frontend" cmd /k "npm run dev"
cd ..
echo.

echo ========================================
echo Started
echo ========================================
echo Frontend: http://localhost:3000
echo Backend : http://localhost:8080
echo Admin   : http://localhost:3000/admin/login
echo.
echo Dev credentials are controlled by:
echo frontend/.env.example -> NEXT_PUBLIC_SHOW_DEV_CREDENTIALS
echo.
pause