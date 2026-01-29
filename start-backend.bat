@echo off
echo ==========================================
echo   漫骑游后端服务启动脚本
echo ==========================================
echo.

cd backend\manqiyou-app

echo 正在启动后端服务...
echo 请确保已安装 Java 17+
echo Maven Wrapper 会自动下载 Maven（首次运行需要联网）
echo.

call mvnw.cmd spring-boot:run

pause
