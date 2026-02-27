# MySQL 数据库配置指南

本项目已从 H2 内存数据库迁移到 MySQL，提供更稳定的数据持久化方案。

## 快速开始

### 1. 安装 MySQL

#### Windows 系统

**方式一：官方安装包（推荐）**
1. 访问 https://dev.mysql.com/downloads/mysql/
2. 下载 MySQL Community Server 8.0+
3. 运行安装程序，选择 "Developer Default" 配置
4. 设置 root 密码（请记住此密码）
5. 完成安装

**方式二：使用 Chocolatey**
```powershell
choco install mysql
```

#### Linux 系统

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**CentOS/RHEL:**
```bash
sudo yum install mysql-server
sudo systemctl start mysqld
sudo mysql_secure_installation
```

#### macOS 系统

**使用 Homebrew:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

### 2. 创建数据库

登录 MySQL：
```bash
mysql -u root -p
```

创建数据库和用户：
```sql
-- 创建数据库
CREATE DATABASE manqiyou CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建专用用户（推荐）
CREATE USER 'manqiyou'@'localhost' IDENTIFIED BY 'your_secure_password';

-- 授予权限
GRANT ALL PRIVILEGES ON manqiyou.* TO 'manqiyou'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

### 3. 配置环境变量

复制环境变量模板：
```bash
cd backend/manqiyou-app
copy .env.example .env    # Windows
# 或
cp .env.example .env      # Linux/macOS
```

编辑 `.env` 文件，填入你的数据库信息：
```properties
DB_HOST=localhost
DB_PORT=3306
DB_NAME=manqiyou
DB_USERNAME=manqiyou
DB_PASSWORD=your_secure_password

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 4. 启动应用

应用启动时会自动执行以下操作：
1. 读取 `schema-mysql.sql` 创建所有表结构
2. 读取 `data.sql` 插入初始数据（包括管理员账号和示例数据）

```bash
# Windows
cd backend/manqiyou-app
mvnw.cmd spring-boot:run

# Linux/macOS
cd backend/manqiyou-app
./mvnw spring-boot:run
```

### 5. 验证安装

访问以下地址验证：
- 后端 API: http://localhost:8080/api/health
- 管理后台: http://localhost:3000/admin/login
  - 用户名: `admin`
  - 密码: `Admin@123`（仅开发环境默认，生产环境请立即更改）

## 数据库结构

应用会自动创建以下表：

### CMS 管理系统
- `cms_admins` - 管理员账号
- `cms_routes` - 骑行路线
- `cms_products` - 商品信息
- `cms_partners` - 合作伙伴
- `cms_assets` - 媒体资源
- `cms_contents` - 内容管理
- `cms_operation_logs` - 操作日志
- `cms_system_settings` - 系统设置

### 用户系统
- `users` - 用户信息
- `user_profiles` - 用户资料

### 业务数据
- `routes` - 路线信息（前端展示）
- `categories` - 分类信息
- `orders` - 订单信息
- `order_items` - 订单明细
- `members` - 会员信息
- `member_benefits` - 会员权益

## 常见问题

### Q: 启动时报错 "Access denied for user"
A: 检查 `.env` 文件中的用户名和密码是否正确。

### Q: 启动时报错 "Unknown database 'manqiyou'"
A: 确保已创建数据库：
```sql
CREATE DATABASE manqiyou CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Q: 如何重置数据库？
A: 删除并重新创建数据库：
```sql
DROP DATABASE manqiyou;
CREATE DATABASE manqiyou CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
然后重启应用，数据会自动重新初始化。

### Q: 如何查看数据库内容？
A: 使用 MySQL 客户端工具：
- **命令行**: `mysql -u manqiyou -p manqiyou`
- **图形界面**: MySQL Workbench, DBeaver, phpMyAdmin 等

### Q: 如何备份数据？
A: 使用 mysqldump：
```bash
mysqldump -u manqiyou -p manqiyou > backup.sql
```

### Q: 如何恢复数据？
A: 使用 mysql 命令：
```bash
mysql -u manqiyou -p manqiyou < backup.sql
```

## 性能优化建议

### 1. 连接池配置

已在 `application.yml` 中配置 HikariCP 连接池：
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

### 2. 索引优化

数据库表已包含必要的索引：
- 主键索引（自动）
- 外键索引
- 常用查询字段索引（如 `status`, `created_at`）

### 3. 查询优化

- 使用 MyBatis-Plus 的分页查询
- 避免 `SELECT *`，只查询需要的字段
- 使用批量操作代替循环单条操作

## 从 H2 迁移到 MySQL

如果你之前使用 H2 数据库，迁移步骤：

1. **备份 H2 数据**（如果需要）
   - H2 数据在应用重启后会丢失，无需备份

2. **安装 MySQL**
   - 按照上述步骤安装 MySQL

3. **配置环境变量**
   - 创建 `.env` 文件并配置数据库连接

4. **重启应用**
   - 应用会自动使用 MySQL 并初始化数据

5. **验证迁移**
   - 登录管理后台检查数据是否正常

## 生产环境部署

### 安全建议

1. **使用强密码**
   ```sql
   -- 生成随机密码
   openssl rand -base64 32
   ```

2. **限制远程访问**
   ```sql
   -- 只允许本地访问
   CREATE USER 'manqiyou'@'localhost' IDENTIFIED BY 'password';
   
   -- 允许特定 IP 访问
   CREATE USER 'manqiyou'@'192.168.1.100' IDENTIFIED BY 'password';
   ```

3. **定期备份**
   ```bash
   # 设置定时任务（crontab）
   0 2 * * * mysqldump -u manqiyou -p'password' manqiyou > /backup/manqiyou_$(date +\%Y\%m\%d).sql
   ```

4. **监控性能**
   ```sql
   -- 查看慢查询
   SHOW VARIABLES LIKE 'slow_query_log';
   SET GLOBAL slow_query_log = 'ON';
   SET GLOBAL long_query_time = 2;
   ```

### 高可用配置

对于生产环境，建议：
- 使用主从复制（Master-Slave Replication）
- 配置读写分离
- 使用云数据库服务（如阿里云 RDS）

## 技术支持

如遇到问题，请检查：
1. MySQL 服务是否正在运行
2. 防火墙是否允许 3306 端口
3. `.env` 文件配置是否正确
4. 应用日志中的错误信息

更多信息请参考：
- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [Spring Boot 数据库配置](https://docs.spring.io/spring-boot/docs/current/reference/html/data.html)
- [MyBatis-Plus 文档](https://baomidou.com/)
