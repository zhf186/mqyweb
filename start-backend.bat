@echo off
echo ==========================================
echo   Manqiyou backend start script
echo ==========================================
echo.

cd backend\manqiyou-app

echo Starting backend service...
echo Ensure Java 17+ is installed.
echo.

if "%SPRING_PROFILES_ACTIVE%"=="" set SPRING_PROFILES_ACTIVE=dev
if "%DB_HOST%"=="" set DB_HOST=localhost
if "%DB_PORT%"=="" set DB_PORT=3306
if "%DB_NAME%"=="" set DB_NAME=manqiyou
if "%DB_USERNAME%"=="" set DB_USERNAME=manqiyou
if "%DB_PASSWORD%"=="" set DB_PASSWORD=manqiyou123456
if "%JWT_SECRET%"=="" set JWT_SECRET=dev-only-jwt-secret-change-before-prod-32-chars-minimum

echo Profile: %SPRING_PROFILES_ACTIVE%
call mvnw.cmd spring-boot:run

pause