# CORS 重复头修复方案

## 问题描述

浏览器控制台报错：
```
The 'Access-Control-Allow-Origin' header contains multiple values 'https://manqiyou.cn, *', but only one is allowed.
```

这表明 CORS 头被添加了两次，导致值变成了 `'https://manqiyou.cn, *'`。

## 问题原因

CORS 头可能在以下位置被重复添加：
1. Spring Boot 后端（CorsConfig.java）
2. Nginx 配置文件

## 解决方案

### 方案 1: 自动修复脚本（推荐）

在服务器上运行：

```bash
cd /opt/mqyweb
chmod +x fix-cors-duplicate.sh
./fix-cors-duplicate.sh
```

这个脚本会：
1. 停止并删除旧的后端容器
2. 删除旧的后端镜像
3. 重新构建后端镜像（不使用缓存）
4. 启动新的后端容器
5. 测试 API 端点的 CORS 头

### 方案 2: 手动修复步骤

#### 步骤 1: 验证当前配置

```bash
cd /opt/mqyweb
chmod +x verify-cors-config.sh
./verify-cors-config.sh
```

#### 步骤 2: 检查 Nginx 配置

确保 Nginx 配置文件中**没有**添加 CORS 头：

```bash
# 检查配置文件
grep -n "Access-Control" /etc/nginx/sites-available/manqiyou
```

如果找到任何 `add_header Access-Control-*` 行，需要删除它们。

当前正确的 Nginx 配置应该是：
- `/api/` 位置块中**没有** CORS 相关的 `add_header` 指令
- CORS 完全由后端处理

#### 步骤 3: 重新构建后端

```bash
cd /opt/mqyweb

# 停止后端
docker-compose -f docker-compose.prod.yml stop backend

# 删除旧容器和镜像
docker-compose -f docker-compose.prod.yml rm -f backend
docker rmi mqyweb-backend:latest

# 重新构建（不使用缓存）
docker-compose -f docker-compose.prod.yml build --no-cache backend

# 启动后端
docker-compose -f docker-compose.prod.yml up -d backend

# 等待启动
sleep 30

# 查看日志
docker-compose -f docker-compose.prod.yml logs --tail=50 backend
```

#### 步骤 4: 测试 CORS 头

```bash
# 测试后端直接响应（应该只有一个 Access-Control-Allow-Origin 头）
curl -I -H "Origin: https://manqiyou.cn" http://127.0.0.1:8081/api/categories

# 测试通过 Nginx 的响应（应该只有一个 Access-Control-Allow-Origin 头）
curl -I -H "Origin: https://manqiyou.cn" https://www.manqiyou.cn/api/categories
```

预期结果：
```
access-control-allow-origin: https://manqiyou.cn
access-control-allow-credentials: true
access-control-max-age: 3600
```

**不应该**看到：
- `access-control-allow-origin: https://manqiyou.cn, *`
- 多个 `access-control-allow-origin` 头

## 验证修复

1. 打开浏览器访问 https://www.manqiyou.cn/routes
2. 打开开发者工具（F12）
3. 刷新页面
4. 检查控制台是否还有 CORS 错误
5. 检查网络标签中 API 请求的响应头

## 当前配置说明

### 后端 CORS 配置（正确）

文件：`backend/manqiyou-app/src/main/java/com/manqiyou/app/config/CorsConfig.java`

```java
config.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://www.manqiyou.cn",
    "https://manqiyou.cn",
    "http://www.manqiyou.cn",
    "http://manqiyou.cn"
));
```

### Nginx 配置（正确）

文件：`deploy/nginx-manqiyou.conf`

```nginx
# 后端 API 代理
location /api/ {
    proxy_pass http://manqiyou_backend/api/;
    # ... 其他 proxy 设置 ...
    
    # CORS 由后端处理，不在 Nginx 添加
}
```

## 常见问题

### Q: 为什么要删除镜像重新构建？

A: 使用 `--no-cache` 确保 Docker 不使用缓存的层，这样可以保证使用最新的代码。

### Q: 如果还是有问题怎么办？

A: 检查以下几点：
1. 确认后端容器确实重启了：`docker-compose -f docker-compose.prod.yml ps`
2. 查看后端日志：`docker-compose -f docker-compose.prod.yml logs backend`
3. 确认 Nginx 配置已重新加载：`sudo nginx -t && sudo systemctl reload nginx`
4. 清除浏览器缓存并硬刷新（Ctrl+Shift+R）

### Q: 如何确认是哪里添加的重复头？

A: 使用 curl 测试：
```bash
# 测试后端直接响应
curl -v -H "Origin: https://manqiyou.cn" http://127.0.0.1:8081/api/categories 2>&1 | grep -i "access-control"

# 测试通过 Nginx
curl -v -H "Origin: https://manqiyou.cn" https://www.manqiyou.cn/api/categories 2>&1 | grep -i "access-control"
```

如果后端直接响应正常，但通过 Nginx 有问题，说明是 Nginx 添加了额外的头。

## 修复状态

✅ **问题已完全解决！** (2026-01-30 10:14 UTC+8)

### 验证结果

#### CORS 头测试
```bash
# 测试 www.manqiyou.cn
curl -I -H 'Origin: https://www.manqiyou.cn' https://www.manqiyou.cn/api/routes
# 结果：access-control-allow-origin: https://www.manqiyou.cn ✅

# 测试 manqiyou.cn
curl -I -H 'Origin: https://manqiyou.cn' https://www.manqiyou.cn/api/routes
# 结果：access-control-allow-origin: https://manqiyou.cn ✅
```

#### API 数据测试
```bash
curl -s -H 'Origin: https://www.manqiyou.cn' https://www.manqiyou.cn/api/routes
# 结果：返回完整的路线数据，HTTP 200 ✅
```

### 执行的修复步骤

1. ✅ 更新后端 CorsConfig.java（添加 @Order 和使用 singletonList）
2. ✅ 添加生产域名到允许列表
3. ✅ 从 application.yml 移除 CORS 配置
4. ✅ 提交代码到 GitHub
5. ✅ 服务器拉取最新代码
6. ✅ 重新构建后端 Docker 镜像（--no-cache）
7. ✅ 删除旧容器并启动新容器
8. ✅ 验证 CORS 头正确（单一值，无重复）
9. ✅ 验证 API 正常返回数据

## 更新记录

- 2026-01-30 02:14: **问题已解决** ✅
  - CORS 头重复问题已修复
  - API 正常返回数据
  - 两个域名（www.manqiyou.cn 和 manqiyou.cn）都工作正常
- 2026-01-30 00:00: 创建修复方案文档
  - 问题：CORS 头重复（`'https://manqiyou.cn, *'`）
  - 解决方案：确保只有后端添加 CORS 头，Nginx 不添加
