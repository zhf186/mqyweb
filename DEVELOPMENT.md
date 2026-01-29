# 漫骑游（mrcweb）开发文档

本文档面向后续持续开发与团队协作，描述本仓库的技术栈、目录结构、运行方式、环境变量、服务拓扑、关键约定与扩展点。

## 1. 项目概览

- **前端**：Next.js 14（App Router）+ TypeScript + TailwindCSS + shadcn/ui + Framer Motion
- **后端**：
  - **开发用单体**：`backend/manqiyou-app`（Spring Boot 3.2.x + MyBatis-Plus + H2 内存库）
  - **微服务架构**：`backend/` 下 `manqiyou-gateway + manqiyou-user/route/order/member/cms`（Spring Boot 3.2.x + Spring Cloud 2023.x，数据库 PostgreSQL，缓存 Redis）
- **基础设施**：`docker-compose.yml`（PostgreSQL 16 + Redis 7；可选 Adminer）

### 1.1 两种后端形态（重要）

- **开发/联调推荐：单体 `manqiyou-app`**
  - 目的：本地快速启动，包含最小可用 API（线路/分类/认证 mock）。
  - 数据：H2 内存库，启动时自动执行 `schema.sql` + `data.sql`。
  - 端口：默认 `8080`。

- **生产/架构演进：Spring Cloud 微服务**
  - 入口：`manqiyou-gateway`（仍使用 `8080`）。
  - 服务端口：
    - `manqiyou-user`：8081
    - `manqiyou-route`：8082
    - `manqiyou-order`：8083
    - `manqiyou-member`：8084
    - `manqiyou-cms`：8085
  - 数据：PostgreSQL（`docker-compose.yml` 提供初始化 SQL）。

## 2. 目录结构

```
.
├── frontend/                         # Next.js 前端
├── backend/                          # Java 后端（微服务 + 开发单体）
│   ├── manqiyou-app/                 # 开发用单体应用
│   ├── manqiyou-gateway/             # 网关（微服务入口）
│   ├── manqiyou-user/                # 用户服务
│   ├── manqiyou-route/               # 线路服务
│   ├── manqiyou-order/               # 订单服务
│   ├── manqiyou-member/              # 会员服务
│   ├── manqiyou-cms/                 # CMS/内容服务
│   ├── sql/                          # docker PostgreSQL 初始化脚本
│   └── .env.example                  # 后端环境变量示例
├── docker-compose.yml                # PostgreSQL + Redis + Adminer
├── start-all.bat                     # Windows 一键启动（前后端）
├── start-backend.bat                 # Windows 启动后端（单体）
├── start-frontend.bat                # Windows 启动前端
└── setup-assets.bat                  # 复制品牌素材到前端 public
```

## 3. 快速开始（Windows）

### 3.1 一键启动（推荐）

- 运行：`start-all.bat`
- 该脚本会：
  - 若 `frontend/public/brand_assets` 不存在，则从根目录 `brand_assets` 复制
  - 启动后端（`backend/manqiyou-app`）：`mvnw.cmd spring-boot:run`
  - 启动前端（`frontend`）：`npm install` + `npm run dev`

### 3.2 分别启动

- 后端（开发单体）：`start-backend.bat`
- 前端：`start-frontend.bat`

### 3.3 访问地址

- **前端**：http://localhost:3000
- **后端（开发单体）**：http://localhost:8080
- **H2 Console**：http://localhost:8080/h2-console
  - JDBC URL：`jdbc:h2:mem:manqiyou`
  - 用户名：`sa`
  - 密码：空

## 4. 环境变量与配置

### 4.1 前端环境变量

- 文件：
  - `frontend/.env.example`
  - `frontend/.env.local`

关键变量：

- `NEXT_PUBLIC_API_URL`
  - 前端 API 客户端读取：`frontend/src/lib/api/client.ts`
  - 默认：`http://localhost:8080/api`

注意：

- 已统一约定：`NEXT_PUBLIC_API_URL` **固定包含** `/api`（例如 `http://localhost:8080/api`）。
- `client.ts` 的拼接逻辑是：`API_BASE_URL + endpoint`。
  - 因此调用时应传入 `endpoint` 形如 `"/routes"`、`"/categories"`，不需要再手写 `/api` 前缀。


### 4.2 后端环境变量（微服务形态）

- 文件：`backend/.env.example`

关键变量（用于 PostgreSQL / Redis / JWT / 第三方）：

- DB：`DB_HOST` `DB_PORT` `DB_NAME` `DB_USERNAME` `DB_PASSWORD`
- Redis：`REDIS_HOST` `REDIS_PORT` `REDIS_PASSWORD`
- JWT：`JWT_SECRET`
- 短信：`ALIYUN_SMS_*`
- 支付：`ALIPAY_*`、`WECHAT_*`
- OSS：`ALIYUN_OSS_*`

### 4.3 后端配置（开发单体 `manqiyou-app`）

- 文件：`backend/manqiyou-app/src/main/resources/application.yml`

关键点：

- `server.port=8080`
- H2 内存库：`jdbc:h2:mem:manqiyou;DB_CLOSE_DELAY=-1;MODE=PostgreSQL`
- 启动自动初始化 SQL：`schema.sql` + `data.sql`
- Redis 在开发单体中默认被禁用（`spring.autoconfigure.exclude` 包含 `RedisAutoConfiguration`）
- CORS：允许 `http://localhost:3000`、`http://127.0.0.1:3000`

## 5. 数据库与容器

### 5.1 docker-compose（用于微服务形态）

根目录 `docker-compose.yml` 提供：

- PostgreSQL：
  - 端口：`5432`
  - 数据库：`manqiyou`
  - 用户/密码：`postgres/postgres`
  - 初始化脚本：
    - `backend/sql/init.sql`
    - `backend/sql/sample-data.sql`
- Redis：
  - 端口：`6379`
- Adminer（可选，profile=dev）：
  - 端口：`8088`

## 6. 后端（开发单体 manqiyou-app）结构与数据流

### 6.1 分层

- `controller/`：HTTP API
- `service/`：业务服务（MyBatis-Plus `ServiceImpl`）
- `mapper/`：MyBatis Mapper（`BaseMapper`）
- `entity/`：实体
- `config/`：CORS / Security 配置
- `common/Result`：统一响应结构 `{ code, message, data, timestamp }`

### 6.2 已实现 API（开发单体）

- 健康检查：
  - `GET /api/health`
  - `GET /api/info`
- 线路：
  - `GET /api/routes`
  - `GET /api/routes/featured`
  - `GET /api/routes/{id}`
- 分类：
  - `GET /api/categories`
  - `GET /api/categories/{id}`
- 认证（mock）：
  - `POST /api/auth/send-code`
  - `POST /api/auth/login`
  - `POST /api/auth/wechat`
  - `GET /api/auth/me`

### 6.3 认证/安全现状（开发单体）

- `SecurityConfig` 中对 `PUBLIC_PATHS` 放行了上述 API 路径。
- 当前并未集成 JWT 校验过滤器；`AuthController` 是**开发用模拟实现**：
  - `send-code` 会生成验证码并返回（开发环境直接返回 `code` 字段）
  - `login` 支持万能验证码 `123456`
  - `token` 为 mock 字符串，不具备真实校验能力

## 7. 微服务架构（Spring Cloud）说明

### 7.1 网关路由

- 配置：`backend/manqiyou-gateway/src/main/resources/application.yml`
- 网关端口：`8080`
- 路由规则：
  - `/api/auth/**, /api/users/**` -> `manqiyou-user`
  - `/api/routes/**, /api/categories/**` -> `manqiyou-route`
  - `/api/orders/**` -> `manqiyou-order`
  - `/api/membership/**` -> `manqiyou-member`
  - `/api/content/**, /api/admin/**, /api/goods/**, /api/activities/**` -> `manqiyou-cms`

### 7.2 端口与依赖

- `manqiyou-user`：8081（PostgreSQL + Redis + JWT 配置）
- `manqiyou-route`：8082（PostgreSQL + Redis）
- `manqiyou-order`：8083（PostgreSQL + Redis）
- `manqiyou-member`：8084（PostgreSQL + Redis）
- `manqiyou-cms`：8085（PostgreSQL + Redis + JWT 配置）

注意：

- 网关配置使用了 `lb://` 形式的 service uri（`lb://manqiyou-user` 等）。这通常意味着需要服务发现/负载均衡组件配合（例如 Spring Cloud 的某种注册中心配置）。当前仓库中未在本文档中展开注册中心配置，后续若启用微服务联调，需要明确“服务发现方案”。

## 8. 前端现状与 API 接入点

### 8.1 路由结构（Next.js App Router）

- `frontend/src/app/page.tsx`：首页（当前为静态内容 + 动效）
- `frontend/src/app/routes/page.tsx`：线路列表（已接入后端 API，支持分类/难度筛选与分页）
- `frontend/src/app/routes/[id]/page.tsx`：线路详情（已接入后端 API）
- 其他：`about/ community/ ebike/ goods/ partners/ privacy/ terms/` 等

### 8.2 API 客户端

- 文件：`frontend/src/lib/api/client.ts`
- 特性：
  - `fetch` 封装（支持 query params）
  - 自动从 `localStorage` 加 `Authorization: Bearer <token>`
  - 统一响应类型：`ApiResponse<T> { code, message, data, timestamp }`

## 9. 常见开发任务

### 9.1 仅做页面/动效开发（无需后端）

- 直接运行前端：
  - `cd frontend`
  - `npm install`
  - `npm run dev`

### 9.2 前后端联调（开发单体后端）

- 启动后端：`backend/manqiyou-app`（端口 `8080`）
- 前端 `NEXT_PUBLIC_API_URL` 指向后端（见 4.1 的拼接规则）
- 在页面中用 `api.get`/`api.post` 替换静态数据

### 9.3 运行微服务（高级）

- 先启动 PostgreSQL + Redis（docker-compose）
- 启动 `manqiyou-gateway` + 各业务服务
- 确认服务发现/负载均衡配置可用（否则 `lb://` 路由无法解析）

## 10. 建议的后续迭代（帮助进一步开发）

- **统一前端 API Base URL 约定**：确定 `NEXT_PUBLIC_API_URL` 是否包含 `/api`，并保持所有调用一致。
- **把线路页从静态数据切换到后端 API**：优先替换 `routes/page.tsx`：
  - `GET /api/routes/featured`（首页/推荐位）
  - `GET /api/routes`（列表分页/筛选）
  - `GET /api/routes/{id}`（详情页）
- **补齐真实认证链路**：开发单体当前是 mock，微服务侧已出现 JWT 配置；建议统一 token 生成与校验机制。
- **微服务可运行化**：明确注册中心/服务发现方案，或将网关路由从 `lb://` 临时替换为固定 `http://localhost:port` 以便本地联调。

---

## 维护说明

- 本文档默认以 Windows 开发环境为主。
- 若后续新增/修改端口、环境变量或启动方式，请同步更新本文件。
