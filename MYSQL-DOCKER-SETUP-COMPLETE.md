# MySQL Docker 容器配置完成

## 完成时间
2026-02-10 10:24

## 配置概述

已成功在 Docker 容器中部署 MySQL 数据库，并将项目从 H2 内存数据库迁移到 MySQL。

## 已完成的工作

### 1. Docker 容器配置

**创建文件**: `docker-compose.mysql.yml`

**容器信息**:
- **MySQL 容器**: `manqiyou-mysql`
  - 镜像: `mysql:8.0`
  - 端口: `3306:3306`
  - 数据库: `manqiyou`
  - 用户: `manqiyou` / 密码: `manqiyou123456`
  - Root 密码: `root123456`
  - 字符集: `utf8mb4_unicode_ci`
  - 状态: ✅ 运行中 (healthy)

- **Redis 容器**: `manqiyou-redis`
  - 镜像: `redis:7-alpine`
  - 端口: `6379:6379`
  - 状态: ✅ 运行中 (healthy)

- **Adminer 管理工具**: `manqiyou-adminer`
  - 镜像: `adminer`
  - 端口: `8088:8080`
  - 访问: http://localhost:8088
  - 状态: 可选（使用 `--profile dev` 启动）

### 2. 数据库初始化

Docker 容器启动时自动执行了以下初始化脚本：
- `schema-mysql.sql` - 创建所有表结构（20+ 张表）
- `data.sql` - 插入初始数据

**已创建的表**:
```
categories
cms_admin_users
cms_asset_usages
cms_assets
cms_content_items
cms_content_versions
cms_operation_logs
cms_pages
cms_partners
cms_product_images
cms_products
cms_route_highlights
cms_route_images
cms_routes
cms_system_settings
routes
users
```

**初始数据**:
- ✅ 1 个管理员账号 (admin / Admin@123)
- ✅ 6 条示例路线
- ✅ 4 个示例商品
- ✅ 4 个示例合作伙伴

### 3. 应用配置

**创建文件**:
- `backend/manqiyou-app/.env` - 环境变量配置
- `backend/manqiyou-app/run-with-mysql.bat` - MySQL 启动脚本

**修改文件**:
- `backend/manqiyou-app/src/main/resources/application.yml`
  - 修改 `spring.sql.init.mode` 从 `always` 改为 `never`
  - 避免重复初始化数据库

### 4. 后端服务启动

**进程信息**:
- 进程 ID: 7
- 启动脚本: `run-with-mysql.bat`
- 启动时间: 2.214 秒
- 状态: ✅ 运行中
- 端口: 8080
- 数据库: MySQL (manqiyou)

## Docker 命令

### 启动容器
```bash
# 启动 MySQL 和 Redis
docker-compose -f docker-compose.mysql.yml up -d mysql redis

# 启动所有服务（包括 Adminer）
docker-compose -f docker-compose.mysql.yml --profile dev up -d
```

### 停止容器
```bash
docker-compose -f docker-compose.mysql.yml down
```

### 查看容器状态
```bash
docker ps
```

### 查看容器日志
```bash
docker logs manqiyou-mysql
docker logs manqiyou-redis
```

### 进入 MySQL 容器
```bash
docker exec -it manqiyou-mysql mysql -umanqiyou -pmanqiyou123456 manqiyou
```

## 数据库连接信息

### 应用连接（Spring Boot）
```properties
DB_HOST=localhost
DB_PORT=3306
DB_NAME=manqiyou
DB_USERNAME=manqiyou
DB_PASSWORD=manqiyou123456
```

### Root 连接
```bash
mysql -h localhost -P 3306 -u root -proot123456
```

### 普通用户连接
```bash
mysql -h localhost -P 3306 -u manqiyou -pmanqiyou123456 manqiyou
```

### Adminer Web 管理
- URL: http://localhost:8088
- 系统: MySQL
- 服务器: mysql
- 用户名: manqiyou
- 密码: manqiyou123456
- 数据库: manqiyou

## 验证测试

### 1. 容器健康检查
```bash
docker ps
# 确认 STATUS 显示 "healthy"
```

### 2. 数据库连接测试
```bash
docker exec manqiyou-mysql mysql -umanqiyou -pmanqiyou123456 manqiyou -e "SHOW TABLES;"
```

### 3. 数据验证
```bash
docker exec manqiyou-mysql mysql -umanqiyou -pmanqiyou123456 manqiyou -e "
SELECT COUNT(*) as admin_count FROM cms_admin_users;
SELECT COUNT(*) as routes_count FROM cms_routes;
SELECT COUNT(*) as products_count FROM cms_products;
"
```

### 4. API 测试
```bash
# 健康检查
curl http://localhost:8080/api/health

# 管理后台（需要登录）
curl http://localhost:8080/api/admin/routes
# 应返回 403（正常，需要认证）
```

### 5. 前端测试
- 访问: http://localhost:3000/admin/login
- 用户名: `admin`
- 密码: `Admin@123`
- 检查路线管理、商品管理、合作伙伴页面是否显示数据

## 启动顺序

### 完整启动流程
```bash
# 1. 启动 Docker 容器
docker-compose -f docker-compose.mysql.yml up -d mysql redis

# 2. 等待容器健康（约 10 秒）
docker ps

# 3. 启动后端（使用 MySQL）
cd backend/manqiyou-app
run-with-mysql.bat

# 4. 启动前端（如未运行）
cd frontend
npm run dev
```

### 快速启动（容器已运行）
```bash
# 后端
cd backend/manqiyou-app
run-with-mysql.bat

# 前端
cd frontend
npm run dev
```

## 数据持久化

### 数据卷
- `mrcweb1_mysql_data` - MySQL 数据持久化
- `mrcweb1_redis_data` - Redis 数据持久化

### 备份数据
```bash
# 导出数据库
docker exec manqiyou-mysql mysqldump -umanqiyou -pmanqiyou123456 manqiyou > backup.sql

# 导入数据库
docker exec -i manqiyou-mysql mysql -umanqiyou -pmanqiyou123456 manqiyou < backup.sql
```

### 清空数据库
```bash
# 停止容器
docker-compose -f docker-compose.mysql.yml down

# 删除数据卷
docker volume rm mrcweb1_mysql_data

# 重新启动（会重新初始化）
docker-compose -f docker-compose.mysql.yml up -d mysql redis
```

## 性能配置

### MySQL 配置
```yaml
command:
  - --character-set-server=utf8mb4
  - --collation-server=utf8mb4_unicode_ci
  - --default-authentication-plugin=mysql_native_password
```

### HikariCP 连接池
```yaml
spring:
  datasource:
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      idle-timeout: 600000
      max-lifetime: 1800000
      connection-timeout: 30000
```

## 故障排查

### 问题 1: 容器无法启动
```bash
# 查看日志
docker logs manqiyou-mysql

# 检查端口占用
netstat -ano | findstr :3306

# 重新创建容器
docker-compose -f docker-compose.mysql.yml down
docker-compose -f docker-compose.mysql.yml up -d mysql redis
```

### 问题 2: 应用无法连接数据库
```bash
# 检查容器状态
docker ps

# 测试连接
docker exec manqiyou-mysql mysql -umanqiyou -pmanqiyou123456 -e "SELECT 1;"

# 检查环境变量
echo %DB_HOST%
echo %DB_USERNAME%
echo %DB_PASSWORD%
```

### 问题 3: 数据重复错误
- 原因: `spring.sql.init.mode=always` 导致重复初始化
- 解决: 已修改为 `mode: never`

### 问题 4: 字符编码问题
- 确认数据库字符集: `utf8mb4_unicode_ci`
- 确认连接字符串包含: `characterEncoding=utf8`

## 与 H2 的对比

| 特性 | H2 内存数据库 | MySQL Docker |
|------|--------------|--------------|
| 数据持久化 | ❌ 重启丢失 | ✅ 持久保存 |
| 启动速度 | 快（1-2秒） | 中等（需等待容器） |
| 内存占用 | 低 | 中等 |
| 生产就绪 | ❌ 仅开发用 | ✅ 可用于生产 |
| 管理工具 | H2 Console | Adminer/MySQL Workbench |
| 备份恢复 | ❌ 不支持 | ✅ mysqldump |
| 性能 | 中等 | 优秀 |

## 下一步建议

### 开发环境
- ✅ 使用 Docker MySQL（已完成）
- ✅ 配置 Adminer 管理工具
- ⏳ 配置数据库备份脚本

### 生产环境
- 使用云数据库服务（阿里云 RDS）
- 配置主从复制
- 配置自动备份
- 配置监控告警

## 相关文档

- [MySQL 配置指南](backend/manqiyou-app/MYSQL-SETUP.md)
- [迁移详细指南](backend/manqiyou-app/H2-TO-MYSQL-MIGRATION.md)
- [迁移完成报告](MYSQL-MIGRATION-COMPLETE.md)
- [Docker Compose 配置](docker-compose.mysql.yml)

## 总结

✅ MySQL Docker 容器配置完成  
✅ 数据库初始化完成  
✅ 应用成功连接 MySQL  
✅ 数据持久化正常工作  
✅ API 服务正常运行  

项目已成功从 H2 内存数据库迁移到 MySQL Docker 容器，数据持久化功能正常，可以继续开发和测试。
