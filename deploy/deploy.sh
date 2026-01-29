#!/bin/bash
# 漫骑游项目 - 自动部署脚本

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_ROOT="/var/www/manqiyou"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend/manqiyou-app"

echo -e "${BLUE}=========================================="
echo "  漫骑游项目 - 自动部署脚本"
echo "==========================================${NC}"
echo ""

# 检查项目目录
if [ ! -d "$PROJECT_ROOT" ]; then
    echo -e "${RED}错误: 项目目录不存在: $PROJECT_ROOT${NC}"
    echo "请先创建目录并上传代码"
    exit 1
fi

cd "$PROJECT_ROOT"

# 询问域名
echo -e "${YELLOW}请输入你的域名 (例如: manqiyou.com):${NC}"
read -r DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}错误: 域名不能为空${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}步骤 1/6: 配置前端环境变量...${NC}"
cd "$FRONTEND_DIR"

# 创建生产环境配置
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
EOF

echo "前端环境变量已配置"

echo ""
echo -e "${GREEN}步骤 2/6: 构建前端...${NC}"
echo "安装依赖..."
npm install --production=false

echo "构建生产版本..."
npm run build

echo "前端构建完成"

echo ""
echo -e "${GREEN}步骤 3/6: 构建后端...${NC}"
cd "$BACKEND_DIR"

# 给 mvnw 添加执行权限
chmod +x mvnw

echo "构建 Spring Boot 应用..."
./mvnw clean package -DskipTests

echo "后端构建完成"

echo ""
echo -e "${GREEN}步骤 4/6: 配置 PM2 (前端进程管理)...${NC}"
cd "$FRONTEND_DIR"

# 创建 PM2 配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'manqiyou-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/manqiyou/frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# 停止旧进程（如果存在）
pm2 delete manqiyou-frontend 2>/dev/null || true

# 启动前端
pm2 start ecosystem.config.js
pm2 save

echo "前端进程已启动"

echo ""
echo -e "${GREEN}步骤 5/6: 配置 systemd (后端进程管理)...${NC}"

# 创建 systemd 服务文件
sudo tee /etc/systemd/system/manqiyou-backend.service > /dev/null << EOF
[Unit]
Description=Manqiyou Backend Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$BACKEND_DIR
ExecStart=/usr/bin/java -jar $BACKEND_DIR/target/manqiyou-app-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# 重载 systemd 配置
sudo systemctl daemon-reload

# 停止旧服务（如果存在）
sudo systemctl stop manqiyou-backend 2>/dev/null || true

# 启动后端服务
sudo systemctl start manqiyou-backend
sudo systemctl enable manqiyou-backend

echo "后端服务已启动"

echo ""
echo -e "${GREEN}步骤 6/6: 配置 Nginx...${NC}"

# 创建 Nginx 配置文件
sudo tee /etc/nginx/sites-available/manqiyou > /dev/null << EOF
# 漫骑游项目 Nginx 配置

# 后端 API 上游
upstream manqiyou_backend {
    server 127.0.0.1:8080;
    keepalive 64;
}

# 前端 Next.js 上游
upstream manqiyou_frontend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP 服务器
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # 临时允许 HTTP 访问（SSL 配置前）
    location / {
        proxy_pass http://manqiyou_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://manqiyou_backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态资源 (品牌素材)
    location /brand_assets/ {
        alias $FRONTEND_DIR/public/brand_assets/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Next.js 静态资源
    location /_next/static/ {
        proxy_pass http://manqiyou_frontend/_next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # 日志
    access_log /var/log/nginx/manqiyou_access.log;
    error_log /var/log/nginx/manqiyou_error.log;

    # 客户端上传大小限制
    client_max_body_size 20M;
}
EOF

# 启用站点配置
sudo ln -sf /etc/nginx/sites-available/manqiyou /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx

echo "Nginx 配置完成"

echo ""
echo -e "${GREEN}=========================================="
echo "  部署完成！"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}服务状态：${NC}"
echo "  - 前端: $(pm2 list | grep manqiyou-frontend | awk '{print $10}')"
echo "  - 后端: $(sudo systemctl is-active manqiyou-backend)"
echo "  - Nginx: $(sudo systemctl is-active nginx)"
echo ""
echo -e "${BLUE}访问地址：${NC}"
echo "  - HTTP: http://$DOMAIN"
echo ""
echo -e "${YELLOW}下一步（配置 SSL）：${NC}"
echo "  运行以下命令获取 SSL 证书："
echo "  ${GREEN}sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}查看日志：${NC}"
echo "  - 前端: pm2 logs manqiyou-frontend"
echo "  - 后端: sudo journalctl -u manqiyou-backend -f"
echo "  - Nginx: sudo tail -f /var/log/nginx/manqiyou_error.log"
echo ""
