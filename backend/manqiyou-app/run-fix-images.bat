@echo off
chcp 65001 >nul
echo ========================================
echo 修复E-BIKE和社区页面图片数据
echo ========================================
echo.

cd /d "%~dp0"

echo 正在执行SQL修复脚本...
mysql -h localhost -u root -p123456 manqiyou < fix-ebike-community-images.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ 图片数据修复成功！
    echo ========================================
    echo.
    echo E-BIKE页面: 9张图片
    echo 社区页面: 20张图片
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ 修复失败，请检查错误信息
    echo ========================================
    echo.
)

pause
