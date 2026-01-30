#!/bin/bash
# 验证 CORS 配置
# 检查 Nginx 和后端的 CORS 设置

echo "=== 验证 CORS 配置 ==="
echo ""

# 1. 检查 Nginx 配置中是否有 CORS 头
echo "1. 检查 Nginx 配置中的 CORS 相关设置..."
echo "在 /etc/nginx/sites-available/manqiyou 中搜索 'Access-Control':"
grep -n "Access-Control" /etc/nginx/sites-available/manqiyou || echo "✓ Nginx 配置中没有 Access-Control 头"

echo ""
echo "在 /etc/nginx/sites-enabled/manqiyou 中搜索 'Access-Control':"
grep -n "Access-Control" /etc/nginx/sites-enabled/manqiyou || echo "✓ Nginx 配置中没有 Access-Control 头"

# 2. 测试后端直接响应
echo ""
echo "2. 测试后端直接响应（绕过 Nginx）..."
echo "测试 http://127.0.0.1:8081/api/categories:"
curl -I -H "Origin: https://manqiyou.cn" http://127.0.0.1:8081/api/categories 2>&1 | grep -i "access-control"

# 3. 测试通过 Nginx 的响应
echo ""
echo "3. 测试通过 Nginx 的响应..."
echo "测试 https://www.manqiyou.cn/api/categories:"
curl -I -H "Origin: https://manqiyou.cn" https://www.manqiyou.cn/api/categories 2>&1 | grep -i "access-control"

# 4. 检查后端容器日志
echo ""
echo "4. 检查后端容器最近的日志..."
cd /opt/mqyweb
docker-compose -f docker-compose.prod.yml logs --tail=50 backend | grep -i "cors\|origin" || echo "日志中没有 CORS 相关信息"

echo ""
echo "=== 验证完成 ==="
