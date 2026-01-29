@echo off
chcp 65001 >nul
echo ========================================
echo 漫骑游项目 - 自动部署到阿里云服务器
echo ========================================
echo.

REM 服务器配置
set SERVER_IP=47.97.21.33
set SERVER_USER=root
set PROJECT_DIR=/var/www/manqiyou
set GIT_REPO=git@github.com:zhf186/mqyweb.git

echo [步骤 1/3] 连接到服务器...
echo 服务器: %SERVER_USER%@%SERVER_IP%
echo.

REM 创建临时部署脚本
echo [步骤 2/3] 创建部署脚本...
(
echo #!/bin/bash
echo set -e
echo.
echo echo "=========================================="
echo echo "开始部署漫骑游项目"
echo echo "=========================================="
echo echo ""
echo.
echo # 检查环境
echo echo "[1/8] 检查服务器环境..."
echo docker --version ^|^| { echo "错误: Docker 未安装"; exit 1; }
echo docker-compose --version ^|^| { echo "错误: Docker Compose 未安装"; exit 1; }
echo git --version ^|^| { echo "错误: Git 未安装"; exit 1; }
echo nginx -v ^|^| { echo "错误: Nginx 未安装"; exit 1; }
echo echo "✓ 环境检查通过"
echo echo ""
echo.
echo # 配置 SSH 密钥
echo echo "[2/8] 配置 GitHub SSH 密钥..."
echo if [ ! -f ~/.ssh/id_ed25519 ]; then
echo   echo "生成 SSH 密钥..."
echo   ssh-keygen -t ed25519 -C "deploy@manqiyou.cn" -f ~/.ssh/id_ed25519 -N ""
echo   echo ""
echo   echo "=========================================="
echo   echo "重要: 请将以下公钥添加到 GitHub"
echo   echo "访问: https://github.com/settings/keys"
echo   echo "=========================================="
echo   cat ~/.ssh/id_ed25519.pub
echo   echo "=========================================="
echo   echo ""
echo   read -p "添加完成后按 Enter 继续..."
echo fi
echo.
echo # 测试 GitHub 连接
echo echo "测试 GitHub 连接..."
echo ssh-keyscan github.com ^>^> ~/.ssh/known_hosts 2^>^&1
echo if ssh -T git@github.com 2^>^&1 ^| grep -q "successfully authenticated"; then
echo   echo "✓ GitHub 连接成功"
echo else
echo   echo "警告: GitHub 连接失败，请检查 SSH 密钥配置"
echo fi
echo echo ""
echo.
echo # 创建项目目录
echo echo "[3/8] 创建项目目录..."
echo sudo mkdir -p %PROJECT_DIR%
echo sudo chown -R $USER:$USER %PROJECT_DIR%
echo echo "✓ 项目目录已创建: %PROJECT_DIR%"
echo echo ""
echo.
echo # 克隆或更新代码
echo echo "[4/8] 获取项目代码..."
echo if [ -d "%PROJECT_DIR%/.git" ]; then
echo   echo "更新现有代码..."
echo   cd %PROJECT_DIR%
echo   git pull origin main
echo else
echo   echo "克隆新代码..."
echo   git clone %GIT_REPO% %PROJECT_DIR%
echo   cd %PROJECT_DIR%
echo fi
echo echo "✓ 代码已获取"
echo echo ""
echo.
echo # 配置环境变量
echo echo "[5/8] 配置环境变量..."
echo cd %PROJECT_DIR%
echo if [ ! -f .env ]; then
echo   cp .env.production .env
echo   echo "✓ 环境变量已配置"
echo else
echo   echo "✓ 环境变量已存在"
echo fi
echo echo ""
echo.
echo # 运行部署脚本
echo echo "[6/8] 构建并启动 Docker 容器..."
echo echo "这可能需要 10-15 分钟，请耐心等待..."
echo chmod +x deploy/quick-deploy.sh
echo bash deploy/quick-deploy.sh
echo echo ""
echo.
echo # 配置 Nginx
echo echo "[7/8] 配置 Nginx..."
echo if [ ! -f /etc/nginx/sites-available/manqiyou ]; then
echo   sudo cp deploy/nginx-manqiyou.conf /etc/nginx/sites-available/manqiyou
echo   sudo ln -s /etc/nginx/sites-available/manqiyou /etc/nginx/sites-enabled/
echo   echo "✓ Nginx 配置已创建"
echo else
echo   echo "✓ Nginx 配置已存在"
echo fi
echo.
echo # 测试并重载 Nginx
echo if sudo nginx -t; then
echo   sudo systemctl reload nginx
echo   echo "✓ Nginx 已重载"
echo else
echo   echo "错误: Nginx 配置测试失败"
echo   exit 1
echo fi
echo echo ""
echo.
echo # 配置 SSL
echo echo "[8/8] 配置 SSL 证书..."
echo if sudo certbot certificates 2^>^&1 ^| grep -q "www.manqiyou.cn"; then
echo   echo "✓ SSL 证书已存在"
echo else
echo   echo "配置 SSL 证书..."
echo   sudo chmod +x deploy/setup-ssl.sh
echo   sudo bash deploy/setup-ssl.sh
echo fi
echo echo ""
echo.
echo # 验证部署
echo echo "=========================================="
echo echo "验证部署状态"
echo echo "=========================================="
echo echo ""
echo.
echo echo "容器状态:"
echo docker-compose -f docker-compose.prod.yml ps
echo echo ""
echo.
echo echo "测试 HTTPS 访问:"
echo curl -I https://www.manqiyou.cn 2^>^&1 ^| head -n 1
echo echo ""
echo.
echo echo "=========================================="
echo echo "部署完成！"
echo echo "=========================================="
echo echo ""
echo echo "访问地址: https://www.manqiyou.cn"
echo echo ""
echo echo "常用命令:"
echo echo "  查看日志: cd %PROJECT_DIR% && docker-compose -f docker-compose.prod.yml logs -f"
echo echo "  重启服务: cd %PROJECT_DIR% && docker-compose -f docker-compose.prod.yml restart"
echo echo "  停止服务: cd %PROJECT_DIR% && docker-compose -f docker-compose.prod.yml down"
echo echo ""
) > deploy-script.sh

echo ✓ 部署脚本已创建
echo.

echo [步骤 3/3] 上传并执行部署脚本...
echo.
echo 正在连接服务器并执行部署...
echo 注意: 首次部署需要配置 GitHub SSH 密钥
echo.

REM 上传脚本并执行
scp deploy-script.sh %SERVER_USER%@%SERVER_IP%:~/deploy-script.sh
ssh %SERVER_USER%@%SERVER_IP% "bash ~/deploy-script.sh && rm ~/deploy-script.sh"

REM 清理本地临时文件
del deploy-script.sh

echo.
echo ========================================
echo 部署流程已完成！
echo ========================================
echo.
echo 请在浏览器中访问: https://www.manqiyou.cn
echo.
pause
