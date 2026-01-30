#!/bin/bash
# 修复 CORS 重复头问题
# 确保后端使用最新代码并且 Nginx 不添加 CORS 头

set -e

echo "=== 修复 CORS 重复头问题 ==="
echo ""

# 1. 停止后端容器
echo "1. 停止后端容器..."
cd /opt/mqyweb
docker-compose -f docker-compose.prod.yml stop backend

# 2. 删除旧容器和镜像
echo "2. 删除旧容器和镜像..."
docker-compose -f docker-compose.prod.yml rm -f backend
docker rmi mqyweb-backend:latest || true

# 3. 重新构建后端镜像（不使用缓存）
echo "3. 重新构建后端镜像..."
docker-compose -f docker-compose.prod.yml build --no-cache backend

# 4. 启动后端容器
echo "4. 启动后端容器..."
docker-compose -f docker-compose.prod.yml up -d backend

# 5. 等待后端启动
echo "5. 等待后端启动（30秒）..."
sleep 30

# 6. 检查后端状态
echo "6. 检查后端状态..."
docker-compose -f docker-compose.prod.yml ps backend

# 7. 检查后端日志
echo "7. 检查后端日志（最后20行）..."
docker-compose -f docker-compose.prod.yml logs --tail=20 backend

# 8. 测试 API 端点
echo ""
echo "8. 测试 API 端点..."
echo "测试 /api/categories:"
curl -I http://127.0.0.1:8081/api/categories 2>&1 | grep -i "access-control" || echo "未找到 CORS 头"

echo ""
echo "测试 /api/routes:"
curl -I http://127.0.0.1:8081/api/routes 2>&1 | grep -i "access-control" || echo "未找到 CORS 头"

echo ""
echo "=== 修复完成 ==="
echo ""
echo "请访问 https://www.manqiyou.cn/routes 测试"
echo "检查浏览器控制台是否还有 CORS 错误"
