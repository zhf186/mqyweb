@echo off
echo ==========================================
echo   漫骑游前端服务启动脚本
echo ==========================================
echo.

cd frontend

echo 正在安装依赖...
call npm install

echo.
echo 正在启动前端服务...
call npm run dev

pause
