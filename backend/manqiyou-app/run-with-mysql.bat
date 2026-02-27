@echo off
echo Starting Manqiyou Backend with MySQL...
echo.

if "%SPRING_PROFILES_ACTIVE%"=="" set SPRING_PROFILES_ACTIVE=dev
if "%DB_HOST%"=="" set DB_HOST=localhost
if "%DB_PORT%"=="" set DB_PORT=3306
if "%DB_NAME%"=="" set DB_NAME=manqiyou
if "%DB_USERNAME%"=="" set DB_USERNAME=manqiyou
if "%DB_PASSWORD%"=="" set DB_PASSWORD=manqiyou123456
if "%REDIS_HOST%"=="" set REDIS_HOST=localhost
if "%REDIS_PORT%"=="" set REDIS_PORT=6379
if "%REDIS_PASSWORD%"=="" set REDIS_PASSWORD=
if "%JWT_SECRET%"=="" set JWT_SECRET=dev-only-jwt-secret-change-before-prod-32-chars-minimum

echo Profile: %SPRING_PROFILES_ACTIVE%
echo DB: %DB_HOST%:%DB_PORT%/%DB_NAME%

mvnw.cmd spring-boot:run