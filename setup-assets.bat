@echo off
echo ==========================================
echo   复制品牌素材到前端 public 目录
echo ==========================================
echo.

if exist "frontend\public\brand_assets" (
    echo 品牌素材目录已存在，跳过复制
) else (
    echo 正在复制品牌素材...
    xcopy /E /I /Y "brand_assets" "frontend\public\brand_assets"
    echo 复制完成！
)

echo.
pause
