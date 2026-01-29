#!/bin/bash
# 漫骑游项目 - SSL 证书配置脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "  SSL 证书配置 (Let's Encrypt)"
echo "==========================================${NC}"
echo ""

# 询问域名
echo -e "${YELLOW}请输入你的域名 (例如: manqiyou.com):${NC}"
read -r DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}错误: 域名不能为空${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}请输入你的邮箱 (用于证书到期提醒):${NC}"
read -r EMAIL

if [ -z "$EMAIL" ]; then
    echo -e "${RED}错误: 邮箱不能为空${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}正在获取 SSL 证书...${NC}"
echo "域名: $DOMAIN, www.$DOMAIN"
echo "邮箱: $EMAIL"
echo ""

# 创建 certbot 目录
sudo mkdir -p /var/www/certbot

# 获取证书
sudo certbot --nginx \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --redirect

echo ""
echo -e "${GREEN}=========================================="
echo "  SSL 证书配置完成！"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}证书信息：${NC}"
sudo certbot certificates
echo ""
echo -e "${BLUE}访问地址：${NC}"
echo "  - HTTPS: https://$DOMAIN"
echo ""
echo -e "${YELLOW}证书自动续期已配置${NC}"
echo "测试续期: sudo certbot renew --dry-run"
echo ""
