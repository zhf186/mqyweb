@echo off
echo ========================================
echo 启动 MySQL 数据库
echo ========================================
echo.

echo 正在检查 Docker 是否运行...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [错误] Docker Desktop 未运行！
    echo.
    echo 请先启动 Docker Desktop，然后重新运行此脚本。
    echo.
    pause
    exit /b 1
)

echo [成功] Docker 正在运行
echo.

echo 正在启动 MySQL 容器...
docker-compose -f docker-compose.mysql.yml up -d

if errorlevel 1 (
    echo [错误] MySQL 容器启动失败！
    echo.
    echo 请查看错误信息并修复问题。
    echo.
    pause
    exit /b 1
)

echo.
echo [成功] MySQL 容器已启动！
echo.
echo 等待 MySQL 初始化完成（约 30 秒）...
timeout /t 30 /nobreak >nul

echo.
echo 检查 MySQL 状态...
docker exec manqiyou-mysql mysqladmin ping -h localhost -u root -proot123456 >nul 2>&1

if errorlevel 1 (
    echo [警告] MySQL 可能还在初始化中...
    echo 请等待几秒钟后再启动后端服务。
) else (
    echo [成功] MySQL 已就绪！
)

echo.
echo ========================================
echo MySQL 数据库信息
echo ========================================
echo 主机: localhost
echo 端口: 3306
echo 数据库: manqiyou
echo 用户名: manqiyou
echo 密码: manqiyou123456
echo.
echo Root 密码: root123456
echo ========================================
echo.
echo 下一步：
echo 1. 启动后端服务：cd backend\manqiyou-app ^&^& mvnw.cmd spring-boot:run
echo 2. 启动前端服务：cd frontend ^&^& npm run dev
echo 3. 访问登录页面：http://localhost:3000/admin/login
echo 4. 使用默认账号登录：admin / Admin@123
echo.
echo 查看 MySQL 日志：docker-compose -f docker-compose.mysql.yml logs -f mysql
echo 停止 MySQL：docker-compose -f docker-compose.mysql.yml down
echo.
pause
