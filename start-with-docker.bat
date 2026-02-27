@echo off
echo ========================================
echo 漫骑游项目启动脚本（Docker 版本）
echo ========================================
echo.

REM 检查 Docker 是否运行
docker ps >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker 未运行，请先启动 Docker Desktop
    pause
    exit /b 1
)

echo [OK] Docker 正在运行
echo.

REM 检查 MySQL 容器是否运行
docker ps | findstr "manqiyou-mysql" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] MySQL 容器未运行，正在启动...
    docker-compose -f docker-compose.mysql.yml up -d mysql redis
    echo [INFO] 等待 MySQL 容器启动（15秒）...
    timeout /t 15 /nobreak >nul
) else (
    echo [OK] MySQL 容器已运行
)

echo.
echo [INFO] 启动后端服务...
start "漫骑游后端" cmd /k "cd backend\manqiyou-app && run-with-mysql.bat"

echo.
echo [INFO] 等待后端启动（5秒）...
timeout /t 5 /nobreak >nul

echo.
echo [INFO] 启动前端服务...
start "漫骑游前端" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo 启动完成！
echo ========================================
echo.
echo 服务地址：
echo   前端: http://localhost:3000
echo   后端: http://localhost:8080
echo   管理后台: http://localhost:3000/admin
echo   Adminer: http://localhost:8088
echo.
echo 管理员账号：
echo   用户名: admin
echo   密码: Admin@123
echo.
echo Docker 容器：
echo   MySQL: manqiyou-mysql (端口 3306)
echo   Redis: manqiyou-redis (端口 6379)
echo.
pause
