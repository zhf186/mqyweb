@echo off
chcp 65001 >nul
setlocal
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

for %%P in (8080 3000) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":%%P .*LISTENING"') do (
        echo [警告] 端口 %%P 已被占用 (PID=%%A)。请先关闭旧服务，否则可能启动失败。
        goto :port_check_done
    )
)
:port_check_done

echo 正在复制品牌素材到前端...
if not exist "frontend\public\brand_assets" (
    xcopy /E /I /Y "brand_assets" "frontend\public\brand_assets" >nul
    echo 品牌素材复制完成
) else (
    echo 品牌素材已存在
)

echo.
echo 正在启动后端服务...
if /I "%SPRING_PROFILES_ACTIVE%"=="" set SPRING_PROFILES_ACTIVE=dev
if /I "%DB_HOST%"=="" set DB_HOST=localhost
if /I "%DB_PORT%"=="" set DB_PORT=3306
if /I "%DB_NAME%"=="" set DB_NAME=manqiyou
if /I "%DB_USERNAME%"=="" set DB_USERNAME=manqiyou
if /I "%DB_PASSWORD%"=="" set DB_PASSWORD=manqiyou123456
if /I "%JWT_SECRET%"=="" set JWT_SECRET=dev-only-jwt-secret-change-before-prod-32-chars-minimum
start "漫骑游后端" cmd /k ""cd /d "%~dp0backend\manqiyou-app" && set SPRING_PROFILES_ACTIVE=%SPRING_PROFILES_ACTIVE% && set DB_HOST=%DB_HOST% && set DB_PORT=%DB_PORT% && set DB_NAME=%DB_NAME% && set DB_USERNAME=%DB_USERNAME% && set DB_PASSWORD=%DB_PASSWORD% && set JWT_SECRET=%JWT_SECRET% && call .\mvnw.cmd spring-boot:run""

echo 等待后端启动...
timeout /t 10 /nobreak

echo 正在启动前端服务...
if /I "%SKIP_NPM_INSTALL%"=="1" (
    start "漫骑游前端" cmd /k ""cd /d "%~dp0frontend" && npm run dev""
) else (
    start "漫骑游前端" cmd /k ""cd /d "%~dp0frontend" && npm install && npm run dev""
)

echo.
echo ==========================================
echo   服务启动中，请稍候...
echo   前端: http://localhost:3000
echo   后端: http://localhost:8080
echo ==========================================
echo.
endlocal
