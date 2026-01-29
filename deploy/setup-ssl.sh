#!/bin/bash

# SSL 证书配置脚本 - Let's Encrypt
# 域名: www.manqiyou.cn

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DOMAIN="www.manqiyou.cn"
EMAIL="56742186@qq.com"  # 请修改为实际邮箱

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  SSL 证书配置 - Let's Encrypt${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查是否为 root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 sudo 运行此脚本${NC}"
    exit 1
fi

# 安装 Certbot
echo -e "${YELLOW}>>> 安装 Certbot${NC}"
apt update
apt install -y certbot python3-certbot-nginx

# 创建 certbot 目录
mkdir -p /var/www/certbot

# 获取证书
echo -e "${YELLOW}>>> 获取 SSL 证书${NC}"
echo "域名: $DOMAIN"
echo "邮箱: $EMAIL"
echo ""
read -p "确认信息正确？(y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}已取消${NC}"
    exit 1
fi

# 使用 webroot 方式获取证书（不会修改 Nginx 配置）
certbot certonly --webroot \
    -w /var/www/certbot \
    -d $DOMAIN \
    -d manqiyou.cn \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal

echo -e "${GREEN}✓ SSL 证书获取成功${NC}"

# 配置自动续期
echo -e "${YELLOW}>>> 配置自动续期${NC}"

# 创建续期钩子脚本
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh << 'EOF'
#!/bin/bash
systemctl reload nginx
EOF

chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

# 测试自动续期
echo -e "${YELLOW}>>> 测试自动续期${NC}"
certbot renew --dry-run

# 启用 certbot timer
systemctl enable certbot.timer
systemctl start certbot.timer

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  SSL 配置完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "证书位置:"
echo "  证书: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
echo "  私钥: /etc/letsencrypt/live/$DOMAIN/privkey.pem"
echo ""
echo "自动续期已启用，证书将在到期前自动续期"
echo ""
echo "查看续期状态:"
echo "  systemctl status certbot.timer"
echo ""
echo "手动测试续期:"
echo "  certbot renew --dry-run"
echo ""
