#!/bin/bash
# 漫骑游项目 - 服务器环境自动配置脚本
# 适用于 Ubuntu 24.04

set -e  # 遇到错误立即退出

echo "=========================================="
echo "  漫骑游项目 - 服务器环境配置"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}请不要使用 root 用户运行此脚本${NC}"
    echo "使用普通用户运行: bash setup-server.sh"
    exit 1
fi

echo -e "${GREEN}步骤 1/7: 更新系统...${NC}"
sudo apt update
sudo apt upgrade -y

echo ""
echo -e "${GREEN}步骤 2/7: 安装 Node.js 20.x...${NC}"
if command -v node &> /dev/null; then
    echo "Node.js 已安装: $(node --version)"
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    echo "Node.js 安装完成: $(node --version)"
fi

echo ""
echo -e "${GREEN}步骤 3/7: 安装 Java 17...${NC}"
if command -v java &> /dev/null; then
    echo "Java 已安装: $(java -version 2>&1 | head -n 1)"
else
    sudo apt install -y openjdk-17-jdk
    echo "Java 安装完成: $(java -version 2>&1 | head -n 1)"
fi

echo ""
echo -e "${GREEN}步骤 4/7: 安装 PM2...${NC}"
if command -v pm2 &> /dev/null; then
    echo "PM2 已安装: $(pm2 --version)"
else
    sudo npm install -g pm2
    pm2 startup
    echo "PM2 安装完成"
fi

echo ""
echo -e "${GREEN}步骤 5/7: 安装 Nginx...${NC}"
if command -v nginx &> /dev/null; then
    echo "Nginx 已安装: $(nginx -v 2>&1)"
else
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo "Nginx 安装完成"
fi

echo ""
echo -e "${GREEN}步骤 6/7: 安装 Certbot (SSL 证书)...${NC}"
if command -v certbot &> /dev/null; then
    echo "Certbot 已安装: $(certbot --version 2>&1 | head -n 1)"
else
    sudo apt install -y certbot python3-certbot-nginx
    echo "Certbot 安装完成"
fi

echo ""
echo -e "${GREEN}步骤 7/7: 配置防火墙...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
echo "y" | sudo ufw enable || true
sudo ufw status

echo ""
echo -e "${GREEN}=========================================="
echo "  环境配置完成！"
echo "==========================================${NC}"
echo ""
echo "已安装的软件版本："
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - Java: $(java -version 2>&1 | head -n 1)"
echo "  - PM2: $(pm2 --version)"
echo "  - Nginx: $(nginx -v 2>&1)"
echo ""
echo -e "${YELLOW}下一步：${NC}"
echo "  1. 创建项目目录: sudo mkdir -p /var/www/manqiyou && sudo chown -R \$USER:\$USER /var/www/manqiyou"
echo "  2. 上传项目代码到 /var/www/manqiyou"
echo "  3. 运行部署脚本: bash deploy/deploy.sh"
echo ""
