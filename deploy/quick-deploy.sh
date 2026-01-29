#!/bin/bash

# 漫骑游项目 - 一键部署脚本
# 使用方法: bash quick-deploy.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  漫骑游项目 - 一键部署${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 配置变量
PROJECT_DIR="/var/www/manqiyou"
GIT_REPO="git@github.com:zhf186/mqyweb.git"
DOMAIN="www.manqiyou.cn"

# 步骤 1: 检查环境
echo -e "${YELLOW}>>> 步骤 1/8: 检查环境${NC}"
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker 未安装${NC}"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}Docker Compose 未安装${NC}"; exit 1; }
command -v git >/dev/null 2>&1 || { echo -e "${RED}Git 未安装${NC}"; exit 1; }
echo -e "${GREEN}✓ 环境检查通过${NC}"

# 步骤 2: 创建项目目录
echo -e "${YELLOW}>>> 步骤 2/8: 创建项目目录${NC}"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR
echo -e "${GREEN}✓ 项目目录已创建${NC}"

# 步骤 3: 克隆或更新代码
echo -e "${YELLOW}>>> 步骤 3/8: 获取代码${NC}"
if [ -d "$PROJECT_DIR/.git" ]; then
    cd $PROJECT_DIR
    git pull origin main
    echo -e "${GREEN}✓ 代码已更新${NC}"
else
    git clone $GIT_REPO $PROJECT_DIR
    cd $PROJECT_DIR
    echo -e "${GREEN}✓ 代码已克隆${NC}"
fi

# 步骤 4: 配置环境变量
echo -e "${YELLOW}>>> 步骤 4/8: 配置环境变量${NC}"
if [ ! -f "$PROJECT_DIR/.env" ]; then
    if [ -f "$PROJECT_DIR/.env.production" ]; then
        cp $PROJECT_DIR/.env.production $PROJECT_DIR/.env
        echo -e "${YELLOW}请编辑 .env 文件设置密码${NC}"
        echo -e "${YELLOW}nano $PROJECT_DIR/.env${NC}"
        read -p "按 Enter 继续..."
    else
        echo -e "${RED}.env.production 文件不存在${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ 环境变量已配置${NC}"

# 步骤 5: 停止旧容器
echo -e "${YELLOW}>>> 步骤 5/8: 停止旧容器${NC}"
docker-compose -f docker-compose.prod.yml down || true
echo -e "${GREEN}✓ 旧容器已停止${NC}"

# 步骤 6: 构建并启动容器
echo -e "${YELLOW}>>> 步骤 6/8: 构建并启动容器（需要 10-15 分钟）${NC}"
docker-compose -f docker-compose.prod.yml up -d --build
echo -e "${GREEN}✓ 容器已启动${NC}"

# 步骤 7: 等待服务启动
echo -e "${YELLOW}>>> 步骤 7/8: 等待服务启动${NC}"
sleep 30
echo -e "${GREEN}✓ 服务启动完成${NC}"

# 步骤 8: 检查服务状态
echo -e "${YELLOW}>>> 步骤 8/8: 检查服务状态${NC}"
docker-compose -f docker-compose.prod.yml ps
echo ""

# 测试服务
echo -e "${YELLOW}>>> 测试服务${NC}"
echo "测试后端 API..."
curl -s http://localhost:8080/api/health && echo -e "${GREEN}✓ 后端正常${NC}" || echo -e "${RED}✗ 后端异常${NC}"
echo "测试前端..."
curl -s http://localhost:3000 > /dev/null && echo -e "${GREEN}✓ 前端正常${NC}" || echo -e "${RED}✗ 前端异常${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "下一步操作："
echo "1. 配置 Nginx: sudo cp $PROJECT_DIR/deploy/nginx-manqiyou.conf /etc/nginx/sites-available/manqiyou"
echo "2. 启用站点: sudo ln -s /etc/nginx/sites-available/manqiyou /etc/nginx/sites-enabled/"
echo "3. 测试配置: sudo nginx -t"
echo "4. 重载 Nginx: sudo systemctl reload nginx"
echo "5. 配置 SSL: sudo bash $PROJECT_DIR/deploy/setup-ssl.sh"
echo ""
echo "查看日志: docker-compose -f docker-compose.prod.yml logs -f"
echo "重启服务: docker-compose -f docker-compose.prod.yml restart"
echo ""
