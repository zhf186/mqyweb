@echo off
echo ========================================
echo MySQL Schema Verification Script
echo ========================================
echo.

REM Check if MySQL is installed
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] MySQL is not installed or not in PATH
    echo Please install MySQL first: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
)

echo [OK] MySQL is installed
echo.

REM Prompt for MySQL root password
set /p MYSQL_PASSWORD="Enter MySQL root password: "
echo.

REM Check if database exists
echo Checking if 'manqiyou' database exists...
mysql -u root -p%MYSQL_PASSWORD% -e "SHOW DATABASES LIKE 'manqiyou';" 2>nul | findstr "manqiyou" >nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Database 'manqiyou' already exists
    set /p RECREATE="Do you want to recreate it? (y/n): "
    if /i "%RECREATE%"=="y" (
        echo Dropping existing database...
        mysql -u root -p%MYSQL_PASSWORD% -e "DROP DATABASE manqiyou;" 2>nul
        if %ERRORLEVEL% NEQ 0 (
            echo [ERROR] Failed to drop database
            pause
            exit /b 1
        )
        echo [OK] Database dropped
    )
)

REM Create database
echo Creating database 'manqiyou'...
mysql -u root -p%MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS manqiyou CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create database
    pause
    exit /b 1
)
echo [OK] Database created
echo.

REM Import schema
echo Importing schema from schema-mysql.sql...
mysql -u root -p%MYSQL_PASSWORD% manqiyou < src\main\resources\schema-mysql.sql 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to import schema
    pause
    exit /b 1
)
echo [OK] Schema imported
echo.

REM Import data
echo Importing initial data from data.sql...
mysql -u root -p%MYSQL_PASSWORD% manqiyou < src\main\resources\data.sql 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to import data
    pause
    exit /b 1
)
echo [OK] Data imported
echo.

REM Verify tables
echo Verifying tables...
mysql -u root -p%MYSQL_PASSWORD% manqiyou -e "SHOW TABLES;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to verify tables
    pause
    exit /b 1
)
echo.

REM Count records
echo Counting records in key tables...
echo.
echo CMS Tables:
mysql -u root -p%MYSQL_PASSWORD% manqiyou -e "SELECT 'cms_admins' as 'Table', COUNT(*) as 'Records' FROM cms_admins UNION SELECT 'cms_routes', COUNT(*) FROM cms_routes UNION SELECT 'cms_products', COUNT(*) FROM cms_products UNION SELECT 'cms_partners', COUNT(*) FROM cms_partners;" 2>nul
echo.

echo ========================================
echo Verification Complete!
echo ========================================
echo.
echo Database: manqiyou
echo Host: localhost:3306
echo Username: root
echo.
echo Next steps:
echo 1. Copy .env.example to .env
echo 2. Update .env with your MySQL password
echo 3. Run: mvnw.cmd spring-boot:run
echo.
pause
