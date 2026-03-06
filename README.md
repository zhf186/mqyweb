# 漫骑游官方网站开发项目

## 项目简介

本项目是基于漫骑游品牌手册和SKILL设计指南的官方网站开发全案，采用「未来主义奢华骑游风格」设计理念，融合科技未来感、自然有机和精致奢华三大元素。

## 🚀 生产环境部署

### 阿里云 Ubuntu 24.04 部署

本项目提供完整的自动化部署方案，支持一键部署到阿里云服务器。

**快速开始：**
```bash
# 1. 配置服务器环境
bash deploy/setup-server.sh

# 2. 部署项目
bash deploy/deploy.sh

# 3. 配置 SSL
bash deploy/ssl-setup.sh
```

**详细文档：**
- 📖 [完整部署文档](DEPLOYMENT.md) - 详细的分步部署指南
- ⚡ [快速部署指南](deploy/QUICK-START.md) - 5分钟快速上手
- 📋 [部署检查清单](deploy/CHECKLIST.md) - 确保部署无遗漏
- 🔧 [脚本使用说明](deploy/README.md) - 所有脚本的详细说明
- 📝 [部署方案总结](deploy/部署方案总结.md) - 架构和配置说明

**部署特性：**
- ✅ 自动化脚本，10-15分钟完成部署
- ✅ Nginx 反向代理 + SSL/HTTPS
- ✅ PM2 进程管理（前端）+ systemd（后端）
- ✅ 自动重启和开机自启
- ✅ 日志管理和监控

---

## 🛠️ 环境安装指南

### Windows 系统

#### 1. 安装 Node.js (前端必需)

**方式一：官网下载（推荐）**
1. 访问 https://nodejs.org/
2. 下载 LTS 版本（推荐 v20.x）
3. 运行安装程序，一路 Next 即可
4. 安装完成后打开新的命令行窗口，验证安装：
   ```cmd
   node --version
   npm --version
   ```

**方式二：使用 winget（Windows 11）**
```powershell
winget install OpenJS.NodeJS.LTS
```

**方式三：使用 Chocolatey**
```powershell
choco install nodejs-lts
```

#### 2. 安装 Java 17 (后端必需)

**方式一：官网下载（推荐）**
1. 访问 https://adoptium.net/
2. 下载 Temurin 17 (LTS)
3. 运行安装程序
4. 验证安装：
   ```cmd
   java -version
   ```

**方式二：使用 winget**
```powershell
winget install EclipseAdoptium.Temurin.17.JDK
```

**方式三：使用 Chocolatey**
```powershell
choco install temurin17
```

#### 3. 安装 MySQL 8.0+ (后端必需)

**方式一：官网下载（推荐）**
1. 访问 https://dev.mysql.com/downloads/mysql/
2. 下载 MySQL Community Server 8.0+
3. 运行安装程序，选择 "Developer Default" 配置
4. 设置 root 密码（请记住此密码）
5. 完成安装后验证：
   ```cmd
   mysql --version
   ```

**方式二：使用 Chocolatey**
```powershell
choco install mysql
```

**配置数据库：**
```cmd
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE manqiyou CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出
EXIT;
```

详细配置请查看：📖 [MySQL 配置指南](backend/manqiyou-app/MYSQL-SETUP.md)

#### 4. Maven（可选，项目已包含 Maven Wrapper）

项目已包含 Maven Wrapper (`mvnw.cmd`)，会自动下载 Maven，无需手动安装。

如需全局安装：
```powershell
winget install Apache.Maven
# 或
choco install maven
```

---

## 🚀 快速启动

### 环境要求

- **Node.js 18+**：前端开发
- **Java 17+**：后端开发
- **MySQL 8.0+**：数据库（推荐）
- Maven 3.8+（可选，项目包含 Maven Wrapper）

### 数据库配置

本项目使用 MySQL 数据库。有两种配置方式：

#### 方式一：Docker 容器（推荐）

使用 Docker 快速启动 MySQL 和 Redis：

```bash
# 启动 MySQL 和 Redis 容器
docker-compose -f docker-compose.mysql.yml up -d mysql redis

# 查看容器状态
docker ps

# 启动后端（会自动连接到 Docker 中的 MySQL）
cd backend/manqiyou-app
run-with-mysql.bat
```

**Docker 配置信息**：
- MySQL 端口: 3306
- 数据库: manqiyou
- 用户名: manqiyou
- 密码: 通过环境变量 `DB_PASSWORD` 配置（开发默认值仅用于本地）
- Adminer 管理工具: http://localhost:8088 (可选)

详细文档：📖 [Docker MySQL 配置完成报告](MYSQL-DOCKER-SETUP-COMPLETE.md)

#### 方式二：本地安装 MySQL

**快速配置：**
```bash
# 1. 安装 MySQL（如未安装）
# 参考上方"环境安装指南"或查看 backend/manqiyou-app/MYSQL-SETUP.md

# 2. 创建数据库
mysql -u root -p
CREATE DATABASE manqiyou CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 3. 配置环境变量
cd backend/manqiyou-app
copy .env.example .env    # Windows
# 编辑 .env 文件，填入数据库密码
```

**详细文档：** 📖 [MySQL 配置指南](backend/manqiyou-app/MYSQL-SETUP.md)

### 一键启动（Windows）

```bash
# 同时启动前后端服务
start-all.bat
```

或者分别启动：

```bash
# 启动后端服务
start-backend.bat

# 启动前端服务（新终端）
start-frontend.bat
```

### 手动启动

#### 启动后端服务

```bash
cd backend/manqiyou-app

# 使用 Maven Wrapper（推荐，无需安装 Maven）
mvnw.cmd spring-boot:run

# 或使用全局 Maven
mvn spring-boot:run
```

后端服务将在 http://localhost:8080 启动

#### 启动前端服务

```bash
cd frontend
npm install
npm run dev
```

前端服务将在 http://localhost:3000 启动

### 仅启动前端（无后端）

前端可以独立运行，使用静态数据展示页面：

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000 即可看到网站首页。

---

## 📍 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端网站 | http://localhost:3000 | Next.js 开发服务器 |
| 后端 API | http://localhost:8080 | Spring Boot 服务 |
| 管理后台 | http://localhost:3000/admin | CMS 管理系统 |

### 管理后台登录信息
- 用户名: `admin`
- 密码: `Admin@123`（仅开发环境默认；生产环境请在初始化后立即修改）
- 登录页是否显示该提示由 `frontend/.env` 中 `NEXT_PUBLIC_SHOW_DEV_CREDENTIALS` 控制

### MySQL 数据库连接
- 主机: `localhost:3306`
- 数据库: `manqiyou`
- 用户名: 配置在 `.env` 文件中
- 密码: 配置在 `.env` 文件中

---

## 📁 项目结构

```
├── frontend/                 # Next.js 前端项目
│   ├── src/
│   │   ├── app/             # 页面路由
│   │   ├── components/      # 组件
│   │   │   ├── ui/          # 基础 UI 组件
│   │   │   ├── layout/      # 布局组件
│   │   │   ├── home/        # 首页组件
│   │   │   └── animation/   # 动画组件
│   │   ├── lib/             # 工具库
│   │   │   ├── api/         # API 客户端
│   │   │   └── i18n/        # 国际化
│   │   ├── hooks/           # 自定义 Hooks
│   │   └── stores/          # 状态管理
│   └── public/
│       └── brand_assets/    # 品牌素材（已复制）
│
├── backend/                  # Java 后端项目
│   ├── manqiyou-app/        # 单体应用（开发用）
│   │   ├── mvnw.cmd         # Maven Wrapper (Windows)
│   │   └── mvnw             # Maven Wrapper (Unix)
│   ├── manqiyou-gateway/    # API 网关
│   ├── manqiyou-user/       # 用户服务
│   ├── manqiyou-route/      # 线路服务
│   ├── manqiyou-order/      # 订单服务
│   ├── manqiyou-member/     # 会员服务
│   ├── manqiyou-cms/        # 内容管理服务
│   └── manqiyou-common/     # 公共模块
│
├── brand_assets/            # 品牌素材源文件
├── start-all.bat            # 一键启动脚本
├── start-backend.bat        # 后端启动脚本
├── start-frontend.bat       # 前端启动脚本
└── .kiro/specs/             # 项目规格文档
```

---

## 🔧 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件库**: shadcn/ui
- **动画**: Framer Motion
- **状态管理**: Zustand
- **数据请求**: React Query
- **国际化**: 中英双语支持

### 后端
- **框架**: Spring Boot 3.2
- **语言**: Java 17
- **ORM**: MyBatis-Plus
- **数据库**: MySQL 8.0+ (推荐) / PostgreSQL (可选)
- **缓存**: Redis

---

## 📡 API 接口

### 公开接口（无需认证）

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/health | 健康检查 |
| GET | /api/routes | 获取线路列表 |
| GET | /api/routes/featured | 获取热门线路 |
| GET | /api/routes/{id} | 获取线路详情 |
| GET | /api/categories | 获取分类列表 |
| POST | /api/auth/send-code | 发送验证码 |
| POST | /api/auth/login | 手机验证码登录 |

### 开发模式说明

- **验证码登录**：万能验证码 `123456` 仅在 `dev` profile 生效，生产环境禁用 `/api/auth/**` 模拟接口
- **数据库**：使用 MySQL 数据库，数据持久化保存
- **示例数据**：首次启动时自动创建表结构并加载示例数据
- **管理后台**：访问 `/admin` 使用 CMS 管理系统

---

## 🎨 品牌色彩

| 颜色 | 色值 | 用途 |
|------|------|------|
| 深林绿 | #0F4C3A | 主色调，体现自然与环保 |
| 科技蓝 | #2A5FAD | 辅助色，体现科技感 |
| 奢华金 | #D4AF37 | 强调色，体现高端品质 |

---

## ❓ 常见问题

### Q: 启动后端时提示 "mvn 不是内部命令"
A: 使用项目自带的 Maven Wrapper：
```cmd
cd backend/manqiyou-app
mvnw.cmd spring-boot:run
```

### Q: 前端启动时提示 "node 不是内部命令"
A: 需要先安装 Node.js，参考上方安装指南。

### Q: 启动后端时报错 "Access denied for user"
A: 检查 `backend/manqiyou-app/.env` 文件中的数据库用户名和密码是否正确。

### Q: 启动后端时报错 "Unknown database 'manqiyou'"
A: 需要先创建数据库：
```sql
mysql -u root -p
CREATE DATABASE manqiyou CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Q: 图片无法显示
A: 确保 `frontend/public/brand_assets/` 目录存在且包含图片文件。如果没有，运行：
```cmd
setup-assets.bat
```

### Q: 端口被占用
A: 修改配置文件中的端口：
- 前端：`frontend/package.json` 中修改 dev 脚本添加 `-p 3001`
- 后端：`backend/manqiyou-app/src/main/resources/application.yml` 中修改 `server.port`

### Q: 如何重置数据库？
A: 删除并重新创建数据库，然后重启应用：
```sql
DROP DATABASE manqiyou;
CREATE DATABASE manqiyou CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Startup Scripts Update (2026-03)

Recommended script entry points on Windows:

```bash
# Full stack with Docker MySQL/Redis (recommended)
start-all-with-mysql.bat

# Only MySQL/Redis in Docker
start-mysql.bat

# Full stack with existing local DB
start-all.bat
```

Split startup:

```bash
start-backend.bat
start-frontend.bat
```

Notes:

- `start-backend.bat`, `start-all.bat`, and `start-all-with-mysql.bat` prefer the embedded JDK17 in `.runlogs/jdk17/...`.
- Startup scripts check `3000/8080` usage and print PID before launch.
- Skip frontend dependency install when needed:
`set SKIP_NPM_INSTALL=1 && start-all.bat`
`set SKIP_NPM_INSTALL=1 && start-frontend.bat`

Port conflict quick fix:

```cmd
netstat -ano | findstr :3000
netstat -ano | findstr :8080
taskkill /PID <PID> /F /T
```

更多数据库相关问题，请查看 [MySQL 配置指南](backend/manqiyou-app/MYSQL-SETUP.md)
