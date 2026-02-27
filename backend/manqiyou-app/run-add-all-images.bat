@echo off
echo ============================================
echo 为所有页面添加图片数据
echo ============================================
echo.

echo 正在连接MySQL数据库...
mysql -h localhost -P 3306 -u manqiyou -pmanqiyou123456 manqiyou < add-all-pages-images.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo 图片数据添加成功！
    echo ============================================
    echo.
    echo 已为以下页面添加图片：
    echo   1. 首页 (Home)
    echo   2. 关于我们 (About)
    echo   3. E-BIKE
    echo   4. 路线 (Routes)
    echo   5. 商品 (Goods)
    echo   6. 社区 (Community)
    echo   7. 合作伙伴 (Partners)
    echo.
) else (
    echo.
    echo ============================================
    echo 错误：图片数据添加失败
    echo ============================================
    echo.
    echo 请检查：
    echo   1. MySQL服务是否运行
    echo   2. 数据库连接信息是否正确
    echo   3. SQL文件是否存在
    echo.
)

pause
