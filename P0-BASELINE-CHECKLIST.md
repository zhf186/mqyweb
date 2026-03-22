# P0 开发基线检查清单

## 1. 环境基线

- Java：`JDK 17`
- Node.js：`18+`
- 数据库：`MySQL 8.0+`
- 缓存：`Redis 7+`

> 说明：项目运行基线仍建议保持在 `JDK 17`；当前仓库已验证可在本机 `JDK 25` 下完成编译与测试。

## 2. 本地依赖启动

在项目根目录执行：

```bash
docker-compose -f docker-compose.mysql.yml up -d mysql redis
```

确认容器正常：

```bash
docker ps
```

## 3. 后端基线检查

进入目录：

```bash
cd backend/manqiyou-app
```

建议顺序：

```bash
java -version
./mvnw clean compile
./mvnw test
./mvnw spring-boot:run
```

Windows：

```bash
cd backend/manqiyou-app
mvnw.cmd clean compile
mvnw.cmd test
mvnw.cmd spring-boot:run
```

预期结果：

- 后端启动在 `http://localhost:8080`
- 健康检查可访问：`/api/health`
- CMS 登录接口可访问：`/api/admin/auth/login`

## 4. 前端基线检查

进入目录：

```bash
cd frontend
```

建议顺序：

```bash
npm install
npm run test:run
npm run lint
npm run build
npm run dev
```

预期结果：

- 测试通过
- 构建通过
- 开发服务启动在 `http://localhost:3000`
- 后台页面可访问：`/admin`

## 5. 当前开发约束

- 新需求优先落到 `backend/manqiyou-app`
- 不在 `gateway / user / route / member / order / cms` 子模块中并行实现同一功能
- 本地开发优先使用 `MySQL + Redis`，不要在同一个任务中混用 `H2 / PostgreSQL`

## 6. 通过标准

- 前端 `test + build` 通过
- 后端在 `JDK 17` 下可以编译、测试、启动
- 部署脚本不再依赖固定版本号的 JAR 名称
- 工作区没有新增的本地产物噪音文件
