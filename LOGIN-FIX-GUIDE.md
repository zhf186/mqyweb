# 登录失败问题修复指南

## 问题原因

后端配置使用 MySQL 数据库，但 MySQL 服务未运行，导致登录失败。

错误信息：`Communications link failure` - 无法连接到 MySQL 数据库。

## 解决方案

### 方案 1：使用 Docker 启动 MySQL（推荐）

1. **确保 Docker Desktop 正在运行**
   - 打开 Docker Desktop 应用
   - 等待 Docker 完全启动（图标变绿）

2. **启动 MySQL 容器**
   ```bash
   docker-compose -f docker-compose.mysql.yml up -d
   ```

3. **等待 MySQL 初始化完成**（约 30 秒）
   ```bash
   docker-compose -f docker-compose.mysql.yml logs -f mysql
   ```
   看到 "ready for connections" 表示启动成功，按 Ctrl+C 退出日志查看

4. **重启后端服务**
   - 停止当前后端进程（如果正在运行）
   - 重新运行：
   ```bash
   cd backend/manqiyou-app
   .\mvnw.cmd spring-boot:run
   ```

### 方案 2：使用本地 MySQL 服务

如果你已经安装了 MySQL：

1. **启动 MySQL 服务**
   - Windows: 打开服务管理器，启动 MySQL 服务
   - 或使用命令：`net start MySQL80`（服务名可能不同）

2. **创建数据库和用户**
   ```sql
   CREATE DATABASE IF NOT EXISTS manqiyou CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER IF NOT EXISTS 'manqiyou'@'localhost' IDENTIFIED BY 'manqiyou123456';
   GRANT ALL PRIVILEGES ON manqiyou.* TO 'manqiyou'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **初始化数据库表**
   ```bash
   cd backend/manqiyou-app
   mysql -u manqiyou -pmanqiyou123456 manqiyou < src/main/resources/schema-mysql.sql
   mysql -u manqiyou -pmanqiyou123456 manqiyou < src/main/resources/data.sql
   ```

4. **更新后端配置**（如果使用不同的密码）
   编辑 `backend/manqiyou-app/src/main/resources/application.yml`：
   ```yaml
   spring:
     datasource:
       username: manqiyou
       password: manqiyou123456  # 改为你的密码
   ```

5. **重启后端服务**

## 验证 MySQL 连接

### 检查 MySQL 是否运行

**Docker 方式**:
```bash
docker ps | findstr mysql
```
应该看到 `manqiyou-mysql` 容器正在运行

**本地服务方式**:
```bash
mysql -u root -p -e "SELECT 1"
```

### 测试数据库连接

```bash
# Docker 方式
docker exec -it manqiyou-mysql mysql -u manqiyou -pmanqiyou123456 manqiyou -e "SHOW TABLES;"

# 本地方式
mysql -u manqiyou -pmanqiyou123456 manqiyou -e "SHOW TABLES;"
```

应该看到以下表：
- cms_admin_users
- cms_pages
- cms_content_items
- cms_content_versions
- 等等...

## 默认管理员账号

数据库初始化后，会自动创建默认管理员账号：

- **用户名**: `admin`
- **密码**: `Admin@123`

## 完整启动流程

1. **启动 MySQL**
   ```bash
   docker-compose -f docker-compose.mysql.yml up -d
   ```

2. **等待 30 秒让 MySQL 完全启动**

3. **启动后端**
   ```bash
   cd backend/manqiyou-app
   .\mvnw.cmd spring-boot:run
   ```

4. **启动前端**（另一个终端）
   ```bash
   cd frontend
   npm run dev
   ```

5. **访问登录页面**
   http://localhost:3000/admin/login

6. **使用默认账号登录**
   - 用户名：admin
   - 密码：Admin@123

## 常见问题

### Q: Docker Desktop 无法启动
**A**: 
- 确保 WSL 2 已安装并启用
- 重启电脑
- 重新安装 Docker Desktop

### Q: MySQL 容器启动失败
**A**:
```bash
# 查看错误日志
docker-compose -f docker-compose.mysql.yml logs mysql

# 删除旧容器和数据卷重新开始
docker-compose -f docker-compose.mysql.yml down -v
docker-compose -f docker-compose.mysql.yml up -d
```

### Q: 后端仍然无法连接 MySQL
**A**:
1. 检查 MySQL 端口是否被占用：
   ```bash
   netstat -ano | findstr :3306
   ```

2. 检查后端配置文件中的数据库连接信息

3. 查看后端日志中的详细错误信息

### Q: 登录时提示 "用户名或密码错误"
**A**:
1. 确认使用的是默认账号：admin / Admin@123
2. 检查数据库中是否有管理员用户：
   ```sql
   SELECT * FROM cms_admin_users WHERE username = 'admin';
   ```
3. 如果没有，手动插入：
   ```sql
   INSERT INTO cms_admin_users (username, password, full_name, email, role, status, created_at, updated_at)
   VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '系统管理员', 'admin@manqiyou.com', 'super_admin', 'active', NOW(), NOW());
   ```

## 下一步

MySQL 启动成功后，你就可以：
1. 登录后台管理系统
2. 测试可视化页面编辑器
3. 继续开发其他功能

---

**需要帮助？** 如果遇到其他问题，请提供：
1. 错误截图
2. 后端日志（最后 50 行）
3. Docker 日志（如果使用 Docker）
