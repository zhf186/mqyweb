#!/bin/bash

# 漫骑游项目 - 阿里云自动化部署脚本
# 服务器: 47.37.21.33
# 域名: www.manqiyou.cn

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
SERVER_IP="47.37.21.33"
DOMAIN="www.manqiyou.cn"
PROJECT_DIR="/var/www/manqiyou"
GIT_REPO="git@github.com:zhf186/mqyweb.git"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  漫骑游项目 - 阿里云部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 函数：打印步骤
print_step() {
    echo -e "${YELLOW}>>> $1${NC}"
}

# 函数：打印成功
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# 函数：打印错误
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 检查是否在服务器上运行
if [ "$(hostname -I | grep -o '^[0-9.]*')" != "$SERVER_IP" ]; then
    print_error "此脚本必须在服务器 $SERVER_IP 上运行"
    exit 1
fi

print_step "步骤 1: 检查必要工具"
command -v docker >/dev/null 2>&1 || { print_error "Docker 未安装"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { print_error "Docker Compose 未安装"; exit 1; }
command -v git >/dev/null 2>&1 || { print_error "Git 未安装"; exit 1; }
command -v nginx >/dev/null 2>&1 || { print_error "Nginx 未安装"; exit 1; }
print_success "所有必要工具已安装"

print_step "步骤 2: 创建项目目录"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR
print_success "项目目录已创建: $PROJECT_DIR"

print_step "步骤 3: 克隆或更新代码"
if [ -d "$PROJECT_DIR/.git" ]; then
    cd $PROJECT_DIR
    git pull origin main
    print_success "代码已更新"
else
    git clone $GIT_REPO $PROJECT_DIR
    cd $PROJECT_DIR
    print_success "代码已克隆"
fi

print_step "步骤 4: 配置环境变量"
if [ ! -f "$PROJECT_DIR/.env.production" ]; then
    print_error ".env.production 文件不存在，请先创建"
    exit 1
fi
print_success "环境变量配置已就绪"

print_step "步骤 5: 停止旧容器（如果存在）"
docker-compose -f docker-compose.prod.yml down || true
print_success "旧容器已停止"

print_step "步骤 6: 构建并启动 Docker 容器"
docker-compose -f docker-compose.prod.yml up -d --build
print_success "Docker 容器已启动"

print_step "步骤 7: 等待服务启动"
sleep 30
print_success "服务启动等待完成"

print_step "步骤 8: 检查服务状态"
docker-compose -f docker-compose.prod.yml ps
print_success "服务状态检查完成"

print_step "步骤 9: 配置 Nginx"
# Nginx 配置将在下一步手动完成
print_success "请手动配置 Nginx（参见部署文档）"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "下一步操作："
echo "1. 配置 Nginx 反向代理"
echo "2. 配置 SSL 证书"
echo "3. 测试网站访问"
echo ""
echo "查看日志："
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
