#!/bin/bash
set -e

# 漫骑游项目 - 服务器端自动部署脚本
# 使用方法: bash server-deploy.sh

echo "=========================================="
echo "漫骑游项目 - 服务器端自动部署"
echo "=========================================="
echo ""

# 配置变量
PROJECT_DIR="/var/www/manqiyou"
GIT_REPO="git@github.com:zhf186/mqyweb.git"
EMAIL="deploy@manqiyou.cn"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# 步骤 1: 检查环境
echo "[1/8] 检查服务器环境..."
if ! command -v docker &> /dev/null; then
    error "Docker 未安装"
    exit 1
fi
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose 未安装"
    exit 1
fi
if ! command -v git &> /dev/null; then
    error "Git 未安装"
    exit 1
fi
if ! command -v nginx &> /dev/null; then
    error "Nginx 未安装"
    exit 1
fi
success "环境检查通过"
echo ""

# 步骤 2: 配置 SSH 密钥
echo "[2/8] 配置 GitHub SSH 密钥..."
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "生成 SSH 密钥..."
    ssh-keygen -t ed25519 -C "$EMAIL" -f ~/.ssh/id_ed25519 -N ""
    echo ""
    echo "=========================================="
    echo "重要: 请将以下公钥添加到 GitHub"
    echo "访问: https://github.com/settings/keys"
    echo "=========================================="
    cat ~/.ssh/id_ed25519.pub
    echo "=========================================="
    echo ""
    read -p "添加完成后按 Enter 继续..."
else
    success "SSH 密钥已存在"
fi

# 添加 GitHub 到 known_hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts 2>&1

# 测试 GitHub 连接
echo "测试 GitHub 连接..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    success "GitHub 连接成功"
else
    warning "GitHub 连接测试失败，但继续部署..."
fi
echo ""

# 步骤 3: 创建项目目录
echo "[3/8] 创建项目目录..."
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR
success "项目目录已创建: $PROJECT_DIR"
echo ""

# 步骤 4: 克隆或更新代码
echo "[4/8] 获取项目代码..."
if [ -d "$PROJECT_DIR/.git" ]; then
    echo "更新现有代码..."
    cd $PROJECT_DIR
    git fetch origin
    git reset --hard origin/main
    git pull origin main
    success "代码已更新"
else
    echo "克隆新代码..."
    rm -rf $PROJECT_DIR/*
    git clone $GIT_REPO $PROJECT_DIR
    cd $PROJECT_DIR
    success "代码已克隆"
fi
echo ""

# 步骤 5: 配置环境变量
echo "[5/8] 配置环境变量..."
cd $PROJECT_DIR
if [ ! -f .env ]; then
    if [ -f .env.production ]; then
        cp .env.production .env
        success "环境变量已配置"
    else
        error ".env.production 文件不存在"
        exit 1
    fi
else
    success "环境变量已存在"
fi
echo ""

# 步骤 6: 运行部署脚本
echo "[6/8] 构建并启动 Docker 容器..."
echo "这可能需要 10-15 分钟，请耐心等待..."
echo ""

if [ -f deploy/quick-deploy.sh ]; then
    chmod +x deploy/quick-deploy.sh
    bash deploy/quick-deploy.sh
    success "Docker 容器已启动"
else
    error "deploy/quick-deploy.sh 文件不存在"
    exit 1
fi
echo ""

# 步骤 7: 配置 Nginx
echo "[7/8] 配置 Nginx..."
if [ ! -f /etc/nginx/sites-available/manqiyou ]; then
    if [ -f deploy/nginx-manqiyou.conf ]; then
        sudo cp deploy/nginx-manqiyou.conf /etc/nginx/sites-available/manqiyou
        sudo ln -sf /etc/nginx/sites-available/manqiyou /etc/nginx/sites-enabled/
        success "Nginx 配置已创建"
    else
        error "deploy/nginx-manqiyou.conf 文件不存在"
        exit 1
    fi
else
    success "Nginx 配置已存在"
fi

# 测试并重载 Nginx
echo "测试 Nginx 配置..."
if sudo nginx -t; then
    sudo systemctl reload nginx
    success "Nginx 已重载"
else
    error "Nginx 配置测试失败"
    exit 1
fi
echo ""

# 步骤 8: 配置 SSL
echo "[8/8] 配置 SSL 证书..."
if sudo certbot certificates 2>&1 | grep -q "www.manqiyou.cn"; then
    success "SSL 证书已存在"
    echo "证书信息:"
    sudo certbot certificates | grep -A 5 "www.manqiyou.cn"
else
    echo "配置 SSL 证书..."
    if [ -f deploy/setup-ssl.sh ]; then
        sudo chmod +x deploy/setup-ssl.sh
        
        # 检查邮箱配置
        if grep -q "your-email@example.com" deploy/setup-ssl.sh; then
            warning "请先编辑 deploy/setup-ssl.sh 修改邮箱地址"
            echo "当前邮箱: your-email@example.com"
            read -p "输入您的邮箱地址: " user_email
            sed -i "s/your-email@example.com/$user_email/g" deploy/setup-ssl.sh
        fi
        
        sudo bash deploy/setup-ssl.sh
        success "SSL 证书已配置"
    else
        warning "deploy/setup-ssl.sh 文件不存在，跳过 SSL 配置"
    fi
fi
echo ""

# 验证部署
echo "=========================================="
echo "验证部署状态"
echo "=========================================="
echo ""

echo "容器状态:"
docker-compose -f docker-compose.prod.yml ps
echo ""

echo "测试 HTTP 访问:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    success "前端服务正常"
else
    warning "前端服务可能未就绪"
fi

if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health | grep -q "200"; then
    success "后端服务正常"
else
    warning "后端服务可能未就绪"
fi
echo ""

echo "测试 HTTPS 访问:"
if curl -s -I https://www.manqiyou.cn 2>&1 | head -n 1 | grep -q "200"; then
    success "HTTPS 访问正常"
else
    warning "HTTPS 访问可能未就绪（可能需要等待 DNS 生效）"
fi
echo ""

# 完成
echo "=========================================="
echo "部署完成！"
echo "=========================================="
echo ""
echo "访问地址: https://www.manqiyou.cn"
echo ""
echo "常用命令:"
echo "  查看日志: cd $PROJECT_DIR && docker-compose -f docker-compose.prod.yml logs -f"
echo "  重启服务: cd $PROJECT_DIR && docker-compose -f docker-compose.prod.yml restart"
echo "  停止服务: cd $PROJECT_DIR && docker-compose -f docker-compose.prod.yml down"
echo "  更新代码: cd $PROJECT_DIR && git pull && docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "日志位置:"
echo "  Nginx 访问日志: /var/log/nginx/manqiyou_access.log"
echo "  Nginx 错误日志: /var/log/nginx/manqiyou_error.log"
echo "  Docker 日志: docker-compose -f docker-compose.prod.yml logs"
echo ""
