@echo off
echo ==========================================
echo   漫骑游全栈启动脚本
echo ==========================================
echo.
echo 此脚本将同时启动前端和后端服务
echo.
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:8080
echo H2控制台: http://localhost:8080/h2-console
echo.
echo ==========================================
echo.

echo 正在复制品牌素材到前端...
if not exist "frontend\public\brand_assets" (
    xcopy /E /I /Y "brand_assets" "frontend\public\brand_assets" >nul
    echo 品牌素材复制完成
) else (
    echo 品牌素材已存在
)

echo.
echo 正在启动后端服务...
start "漫骑游后端" cmd /k "cd backend\manqiyou-app && mvnw.cmd spring-boot:run"

echo 等待后端启动...
timeout /t 10 /nobreak

echo 正在启动前端服务...
start "漫骑游前端" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ==========================================
echo   服务启动中，请稍候...
echo   前端: http://localhost:3000
echo   后端: http://localhost:8080
echo ==========================================
echo.

pause
