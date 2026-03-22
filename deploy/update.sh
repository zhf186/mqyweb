#!/bin/bash
# 漫骑游项目 - 快速更新脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="/opt/mqyweb"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend/manqiyou-app"

echo -e "${BLUE}=========================================="
echo "  漫骑游项目 - 快速更新"
echo "==========================================${NC}"
echo ""

cd "$PROJECT_ROOT"

echo -e "${GREEN}步骤 1/5: 拉取最新代码...${NC}"
git pull origin main || git pull origin master

echo ""
echo -e "${GREEN}步骤 2/5: 更新前端依赖...${NC}"
cd "$FRONTEND_DIR"
npm install

echo ""
echo -e "${GREEN}步骤 3/5: 构建前端...${NC}"
npm run build

echo ""
echo -e "${GREEN}步骤 4/5: 构建后端...${NC}"
cd "$BACKEND_DIR"
./mvnw clean package -DskipTests

BACKEND_JAR=$(ls -t "$BACKEND_DIR"/target/manqiyou-app-*.jar 2>/dev/null | grep -v '\.original$' | head -n 1 || true)
if [ -z "$BACKEND_JAR" ]; then
    echo -e "${RED}错误: 未找到后端 JAR 文件，请检查构建结果${NC}"
    exit 1
fi

sudo tee /etc/systemd/system/manqiyou-backend.service > /dev/null << EOF
[Unit]
Description=Manqiyou Backend Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$BACKEND_DIR
ExecStart=/usr/bin/java -jar $BACKEND_JAR
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload

echo ""
echo -e "${GREEN}步骤 5/5: 重启服务...${NC}"

# 重启前端
pm2 restart manqiyou-frontend

# 重启后端
sudo systemctl restart manqiyou-backend

# 等待服务启动
sleep 3

echo ""
echo -e "${GREEN}=========================================="
echo "  更新完成！"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}服务状态：${NC}"
pm2 status
echo ""
sudo systemctl status manqiyou-backend --no-pager
echo ""
