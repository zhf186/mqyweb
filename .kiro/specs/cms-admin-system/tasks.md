# Implementation Plan: CMS Admin System

## Overview

本实现计划将后台管理系统分解为可执行的开发任务。系统采用 Next.js 14 (TypeScript) 前端和 Spring Boot 3.2 + Java 21 后端，使用 Docker 容器化部署，Git 进行版本控制。

**重要说明**：本项目已有完整的 Git 仓库和 Docker 配置，CMS 后台将作为现有项目的扩展模块开发。

实现顺序遵循：数据库扩展 → 后端 API → 前端界面 → 集成测试 → 部署配置。

## Tasks

- [ ] 1. CMS 数据库设计与初始化
  - [x] 1.1 创建 CMS 数据库迁移脚本
    - 在 `backend/sql/` 目录创建 `cms-init.sql`
    - 创建14个 CMS 相关表（admin_users, pages, content_items, content_versions, assets, 等）
    - 添加必要的索引和外键约束
    - 初始化超级管理员账号（用户名: admin, 密码: Admin@123）
    - 初始化页面数据（首页、E-BIKE页、路线页等）
    - _Requirements: 1.1, 2.1, 4.1, 20.1_

  - [x] 1.2 更新 docker-compose.yml
    - 添加 CMS 初始化脚本到 PostgreSQL 容器
    - 确保脚本在容器启动时自动执行
    - _Requirements: 20.4_

  - [x] 1.3 测试数据库初始化

    - 启动 Docker 容器验证表创建
    - 验证初始数据加载
    - _Requirements: 20.4_

- [x] 2. 后端 CMS 模块基础架构
  - [x] 2.1 创建 CMS 包结构
    - 在 `backend/manqiyou-app/src/main/java/com/manqiyou/` 下创建 `cms` 包
    - 子包：controller, service, mapper, entity, dto, config
    - _Requirements: 20.1_

  - [x] 2.2 配置 JWT 认证
    - 创建 JwtTokenProvider 工具类
    - 配置 Spring Security 过滤器
    - 添加 JWT 配置到 application.yml
    - _Requirements: 1.2, 15.1_

  - [x] 2.3 创建通用响应包装类
    - Result<T> 类用于统一 API 响应格式
    - 异常处理器 @ControllerAdvice
    - _Requirements: 15.1_

  - [x] 2.4 编写 JWT 工具类的单元测试

    - 令牌生成和验证测试
    - _Requirements: 1.2_

- [x] 3. 实现管理员认证功能
  - [x] 3.1 创建 AdminUser 实体和 Mapper
    - Entity: AdminUser.java
    - Mapper: AdminUserMapper.java (MyBatis-Plus)
    - _Requirements: 1.1_

  - [x] 3.2 实现认证 Service
    - AdminAuthService: 登录、登出、令牌刷新
    - 密码 BCrypt 加密
    - 登录日志记录
    - _Requirements: 1.2, 1.7_

  - [ ]* 3.3 编写认证服务的属性测试
    - **Property 1: 认证成功返回令牌**
    - **Property 2: 登录日志完整性**
    - **Validates: Requirements 1.1, 1.2, 1.7**

  - [x] 3.4 实现认证 Controller
    - POST /api/admin/auth/login
    - POST /api/admin/auth/logout
    - GET /api/admin/auth/me
    - _Requirements: 1.1, 1.2_

  - [x] 3.5 实现账号锁定机制
    - 使用 Redis 记录失败次数
    - 5次失败后锁定15分钟
    - _Requirements: 1.3_

  - [ ]* 3.6 编写认证 API 的集成测试
    - 测试登录成功/失败场景
    - 测试账号锁定机制
    - _Requirements: 1.1, 1.3_

- [x] 4. Checkpoint - 认证系统验证
  - 确保所有测试通过，询问用户是否有问题

- [x] 5. 实现内容管理后端 API
  - [x] 5.1 创建内容相关实体和 Mapper
    - Entity: Page, ContentItem, ContentVersion
    - Mapper: PageMapper, ContentItemMapper, ContentVersionMapper
    - _Requirements: 2.1, 2.2, 6.1_

  - [x] 5.2 实现内容管理 Service
    - ContentService: 获取页面、获取内容项、保存内容、版本管理
    - 自动创建版本记录
    - _Requirements: 2.2, 2.6, 6.1_

  - [ ]* 5.3 编写内容管理的属性测试
    - **Property 3: 内容检索完整性**
    - **Property 4: 内容保存往返一致性**
    - **Property 8: 版本自动创建**
    - **Validates: Requirements 2.2, 2.6, 3.6, 6.1**

  - [x] 5.4 实现内容管理 Controller
    - GET /api/admin/content/pages
    - GET /api/admin/content/pages/:pageId
    - PUT /api/admin/content/items/:itemId
    - GET /api/admin/content/items/:itemId/versions
    - POST /api/admin/content/items/:itemId/restore
    - _Requirements: 2.2, 2.6, 6.2, 6.6_

  - [x] 5.5 编写内容 API 的集成测试
    - 测试内容 CRUD 操作
    - 测试版本创建和恢复
    - _Requirements: 2.2, 6.1, 6.7_

  - [x] 5.6 修复内容保存 400 错误 ✅ **FIXED: Content Save Error**
    - 问题：前端发送错误的字段名（`zh`/`en` 而非 `contentZh`/`contentEn`）
    - 问题：前端未发送必需的 `version` 字段
    - 修复：更新 `contentApi.updateContentItem` 使用正确字段名
    - 修复：更新 `ContentEditor.tsx` 发送 `contentZh`, `contentEn`, `version`, `changeSummary`
    - 修复：添加 `version` 字段到 `ContentItem` 接口
    - _Requirements: 2.6, 15.6_

- [x] 6. 实现图片资源管理后端 API
  - [x] 6.1 创建资源相关实体和 Mapper
    - Entity: Asset, AssetUsage
    - Mapper: AssetMapper, AssetUsageMapper
    - _Requirements: 4.1, 4.2_

  - [x] 6.2 集成阿里云 OSS SDK
    - 添加 aliyun-sdk-oss 依赖到 pom.xml
    - 创建 OssService 工具类
    - 配置 OSS 参数到 application.yml
    - _Requirements: 20.3_

  - [x] 6.3 实现图片处理 Service
    - ImageProcessingService: 使用 Thumbnailator 库
    - 生成5个尺寸版本（原图、1920px、1024px、640px、200px）
    - 转换为 WebP 格式
    - 上传所有版本到 OSS
    - _Requirements: 4.6, 4.7_

  - [ ]* 6.4 编写图片处理的属性测试
    - **Property 5: 图片处理完整性**
    - **Validates: Requirements 4.6, 4.7**

  - [x] 6.5 实现资源管理 Service
    - AssetService: 上传、替换、删除、查询、使用检查
    - 调用 ImageProcessingService 和 OssService
    - _Requirements: 4.1, 4.3, 4.8, 4.9_

  - [ ]* 6.6 编写资源引用完整性的属性测试
    - **Property 6: 资源引用完整性**
    - **Validates: Requirements 4.9**

  - [x] 6.7 实现资源管理 Controller
    - GET /api/admin/assets (分页、搜索、筛选)
    - POST /api/admin/assets/upload (支持批量上传)
    - PUT /api/admin/assets/:assetId (替换)
    - DELETE /api/admin/assets/:assetId (删除前检查)
    - GET /api/admin/assets/:assetId/usage
    - _Requirements: 4.1, 4.3, 4.8, 4.9_

  - [ ]* 6.8 编写资源 API 的集成测试
    - 测试图片上传和处理
    - 测试删除保护机制
    - _Requirements: 4.3, 4.6, 4.9_

- [x] 7. Checkpoint - 核心 API 验证
  - 确保所有测试通过，询问用户是否有问题

- [x] 8. 实现路线/商品/合作伙伴管理 API ✅ **FIXED: 500 Error**
  - [x] 8.1 创建路线相关实体和 Mapper
    - Entity: Route, RouteImage, RouteHighlight
    - Mapper: RouteMapper, RouteImageMapper, RouteHighlightMapper
    - _Requirements: 8.1, 8.2_

  - [x] 8.2 实现路线管理 Service 和 Controller
    - RouteService: CRUD、发布、统计
    - RouteController: 完整的 REST API
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
    - **FIX**: Added missing `version` column to `cms_routes` table

  - [ ]* 8.3 编写路线创建的属性测试
    - **Property 10: 路线创建完整性**
    - **Validates: Requirements 8.2**

  - [x] 8.4 创建商品相关实体、Service 和 Controller
    - Entity: Product, ProductImage
    - ProductService 和 ProductController
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
    - **FIX**: Added missing `version` column to `cms_products` table

  - [x] 8.5 创建合作伙伴实体、Service 和 Controller
    - Entity: Partner
    - PartnerService 和 PartnerController（支持排序）
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
    - **FIX**: Added missing `version` column to `cms_partners` table

  - [ ]* 8.6 编写扩展功能的集成测试
    - 测试路线、商品、合作伙伴 CRUD
    - _Requirements: 8.1, 9.1, 10.1_

- [x] 9. 实现系统设置和统计 API
  - [x] 9.1 创建系统设置实体和 Service
    - Entity: SystemSettings
    - SystemSettingsService: 获取、更新、验证配置
    - _Requirements: 11.1, 11.2_

  - [x] 9.2 实现统计 Service 和 Controller
    - StatisticsService: 仪表盘数据、路线统计
    - StatisticsController: 统计 API
    - _Requirements: 12.1, 12.2_

  - [x] 9.3 实现操作日志 AOP 切面
    - @OperationLog 注解
    - OperationLogAspect: 自动记录操作
    - _Requirements: 13.1, 13.2_

  - [ ]* 9.4 编写发布日志的属性测试
    - **Property 7: 发布操作日志记录**
    - **Validates: Requirements 5.6**

  - [x] 9.5 实现日志查询 Controller
    - GET /api/admin/logs (筛选、分页)
    - GET /api/admin/logs/:logId
    - _Requirements: 13.3, 13.4_

  - [ ]* 9.6 编写系统功能的单元测试
    - 测试配置验证
    - 测试日志记录
    - _Requirements: 11.2, 13.1_

- [x] 10. 实现高级功能 API
  - [x] 10.1 实现搜索功能
    - SearchService: 全局搜索（内容、路线、商品）
    - SearchController: 搜索 API
    - _Requirements: 17.1, 17.2, 17.3_

  - [x] 10.2 实现批量导入导出
    - ImportExportService: JSON/Excel 导入导出
    - 数据验证和事务处理
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [ ]* 10.3 编写导入事务的属性测试
    - **Property 12: 导入事务原子性**
    - **Validates: Requirements 16.6**

  - [x] 10.4 实现并发编辑检测
    - 在实体中添加 version 字段（乐观锁）
    - 在 Service 中检测版本冲突
    - _Requirements: 15.6_

  - [ ]* 10.5 编写并发编辑的属性测试
    - **Property 11: 并发编辑检测**
    - **Validates: Requirements 15.6**

  - [ ]* 10.6 编写高级功能的集成测试
    - 测试搜索功能
    - 测试导入导出
    - _Requirements: 17.1, 16.1_

- [x] 11. Checkpoint - 后端 API 完成验证
  - 确保所有后端测试通过，询问用户是否有问题

- [x] 12. 前端 CMS 项目初始化
  - [x] 12.1 在 frontend 中创建 CMS 路由结构
    - 创建 `src/app/admin/` 目录
    - 创建子路由：login, dashboard, content, assets, routes, products, partners, settings, logs
    - _Requirements: 14.1_

  - [x] 12.2 安装 CMS 所需依赖
    - TipTap (富文本编辑器)
    - react-dropzone (文件上传)
    - date-fns (日期处理)
    - recharts (图表)
    - _Requirements: 2.5, 4.3_

  - [x] 12.3 创建 CMS API 客户端
    - 在 `src/lib/api/` 创建 admin.ts
    - 封装所有 CMS API 调用
    - 添加 JWT 令牌拦截器
    - _Requirements: 1.2_

  - [x] 12.4 创建认证状态管理
    - 使用 Zustand 创建 auth-store.ts
    - 管理登录状态、用户信息、令牌
    - _Requirements: 1.2_

- [x] 13. 实现 CMS 登录和布局
  - [x] 13.1 创建登录页面
    - `app/admin/login/page.tsx`
    - 登录表单（用户名+密码）
    - 表单验证（React Hook Form + Zod）
    - 错误提示和加载状态
    - _Requirements: 1.1_

  - [ ]* 13.2 编写登录页面的单元测试
    - 表单验证测试
    - 登录流程测试
    - _Requirements: 1.1_

  - [x] 13.3 创建后台布局组件
    - AdminLayout: 侧边栏 + 顶部栏 + 内容区
    - Sidebar: 导航菜单
    - TopBar: 用户信息、通知、语言切换
    - _Requirements: 14.1, 14.2_

  - [x] 13.4 实现路由守卫
    - 检查登录状态
    - 未登录重定向到登录页
    - _Requirements: 1.4_

  - [ ]* 13.5 编写布局组件的单元测试
    - 导航渲染测试
    - 权限控制测试
    - _Requirements: 14.1, 1.4_

- [x] 14. 实现内容管理前端界面
  - [x] 14.1 创建内容管理页面
    - `app/admin/content/page.tsx`
    - PageSelector: 选择页面
    - ContentList: 内容项列表
    - _Requirements: 2.1, 2.2_

  - [x] 14.2 创建内容编辑器组件
    - ContentEditor: 单行/多行/富文本编辑
    - RichTextEditor: 基于 TipTap
    - 字符计数和长度警告
    - 语言切换（中英文）
    - _Requirements: 2.4, 2.5, 2.7, 3.1, 3.2_

  - [ ]* 14.3 编写内容编辑器的单元测试
    - 字符计数测试
    - 语言切换测试
    - _Requirements: 2.4, 3.2_

  - [x] 14.4 创建版本历史组件
    - VersionHistory: 版本列表
    - VersionDiff: 版本对比
    - 恢复确认对话框
    - _Requirements: 6.2, 6.4, 6.5, 6.6_

  - [x] 14.5 创建预览和发布功能
    - PreviewModal: 预览内容
    - 发布确认对话框
    - _Requirements: 5.2, 5.5, 5.6_

  - [ ]* 14.6 编写内容管理的单元测试
    - 版本历史测试
    - 预览功能测试
    - _Requirements: 6.2, 5.2_

- [x] 15. 实现图片管理前端界面
  - [x] 15.1 创建图片管理页面
    - `app/admin/assets/page.tsx`
    - AssetGrid: 网格展示图片
    - 分类筛选、搜索功能
    - _Requirements: 4.1, 4.2_

  - [x] 15.2 创建图片上传组件
    - AssetUploader: 拖拽上传
    - 支持批量上传（最多20张）
    - 上传进度显示
    - 文件验证（格式、大小）
    - _Requirements: 4.3, 4.4, 4.5_

  - [x] 15.3 创建图片详情和操作
    - AssetDetail: 显示图片信息和使用情况
    - 替换、删除功能
    - 删除前警告（如果正在使用）
    - _Requirements: 4.2, 4.8, 4.9_

  - [x] 15.4 编写图片管理的单元测试

    - 上传功能测试
    - 文件验证测试
    - _Requirements: 4.3, 4.5_

- [x] 16. Checkpoint - 核心界面验证
  - 确保核心功能可用，询问用户是否有问题

- [x] 17. 实现路线/商品/合作伙伴管理界面
  - [x] 17.1 创建路线管理页面
    - `app/admin/routes/page.tsx`
    - RouteList: 列表、搜索、筛选
    - RouteEditor: 编辑表单
    - RoutePreview: 预览
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 17.2 创建商品管理页面
    - `app/admin/products/page.tsx`
    - ProductList 和 ProductEditor
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 17.3 创建合作伙伴管理页面
    - `app/admin/partners/page.tsx`
    - PartnerList: 支持拖拽排序
    - PartnerEditor
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 17.4 编写扩展功能的单元测试

    - 表单验证测试
    - 拖拽排序测试
    - _Requirements: 8.2, 10.4_

- [x] 18. 实现仪表盘和系统功能界面
  - [x] 18.1 创建仪表盘页面
    - `app/admin/dashboard/page.tsx` (默认首页)
    - StatCard: 统计卡片
    - RecentUpdates: 最近更新
    - TodoList: 待办事项
    - _Requirements: 12.1_

  - [x] 18.2 创建系统设置页面
    - `app/admin/settings/page.tsx`
    - GeneralSettings、SEOSettings、IntegrationSettings
    - _Requirements: 11.1, 11.2_

  - [x] 18.3 创建操作日志页面
    - `app/admin/logs/page.tsx`
    - LogList: 日志列表
    - LogFilter: 筛选器
    - LogDetail: 详情
    - _Requirements: 13.3_

  - [x] 18.4 实现搜索和通知功能
    - 全局搜索框（TopBar）
    - 通知中心
    - _Requirements: 17.1, 18.1, 18.2_

  - [ ]* 18.5 编写系统功能的单元测试
    - 仪表盘渲染测试
    - 设置表单测试
    - _Requirements: 12.1, 11.2_

- [x] 19. 响应式设计和优化
  - [x] 19.1 实现响应式布局
    - 移动端适配（<768px）
    - 平板端适配（768-1023px）
    - 桌面端（1024px+）
    - _Requirements: 14.1, 14.2, 14.3_

  - [x] 19.2 前端性能优化
    - 代码分割和懒加载
    - 图片懒加载
    - React.memo 优化
    - _Requirements: 15.5_

  - [ ]* 19.3 运行 Lighthouse 测试
    - 性能评分 > 90
    - _Requirements: 15.5_

- [x] 20. Checkpoint - 前端完成验证
  - 确保所有前端功能可用，询问用户是否有问题

- [ ] 21. 更新 Docker 配置
  - [ ] 21.1 更新后端 Dockerfile
    - 将 Java 17 改为 Java 21
    - 已有文件：`backend/manqiyou-app/Dockerfile`
    - _Requirements: 20.4_

  - [ ] 21.2 验证前端 Dockerfile
    - 确认现有配置支持 CMS 路由
    - 已有文件：`frontend/Dockerfile`
    - _Requirements: 20.4_

  - [ ] 21.3 更新 docker-compose.prod.yml
    - 添加 CMS 相关环境变量
    - 确保 CMS 数据库初始化脚本被执行
    - _Requirements: 20.4_

  - [ ]* 21.4 测试 Docker 部署
    - 本地 Docker 启动测试
    - 验证 CMS 功能可用
    - _Requirements: 20.4_

- [ ] 22. 更新部署文档
  - [ ] 22.1 更新 DEPLOYMENT.md
    - 添加 CMS 部署说明
    - 添加 CMS 初始管理员账号信息
    - 添加 CMS 访问路径说明
    - _Requirements: 19.1_

  - [ ] 22.2 更新 README.md
    - 添加 CMS 功能介绍
    - 添加 CMS 访问地址
    - _Requirements: 19.1_

  - [ ]* 22.3 创建 CMS 用户手册
    - 管理员使用指南
    - 常见问题解答
    - _Requirements: 19.1_

- [ ] 23. 安全加固
  - [ ] 23.1 实现安全措施
    - CSRF 防护（Spring Security）
    - XSS 防护（前端 DOMPurify）
    - SQL 注入防护（MyBatis 参数化）
    - _Requirements: 15.1, 15.2, 15.3_

  - [ ] 23.2 实现 API 限流
    - 使用 Redis 实现限流
    - 每分钟100次请求限制
    - _Requirements: 15.4_

  - [ ]* 23.3 安全测试
    - 依赖漏洞扫描
    - _Requirements: 15.1_

- [ ] 24. 集成测试和 E2E 测试
  - [ ]* 24.1 运行所有单元测试
    - 前端单元测试（Vitest）
    - 后端单元测试（JUnit）
    - 覆盖率检查 (>80%)

  - [ ]* 24.2 运行所有属性测试
    - 12个正确性属性测试
    - 每个测试100次迭代

  - [ ]* 24.3 运行集成测试
    - API 集成测试
    - 数据库集成测试

  - [ ]* 24.4 运行 E2E 测试（Playwright）
    - 登录流程
    - 内容编辑流程
    - 图片上传流程
    - 发布流程
    - 版本恢复流程

- [ ] 25. 最终 Checkpoint - 系统验证
  - 确保所有功能正常
  - 确保 Docker 部署成功
  - 询问用户进行最终验收测试

## Notes

- 标记 `*` 的任务为可选任务，可以跳过以加快 MVP 开发
- 每个任务都引用了具体的需求编号，便于追溯
- Checkpoint 任务确保增量验证，及时发现问题
- 本项目已有完整的 Git 仓库和 Docker 配置，无需重新创建
- CMS 后台作为现有项目的扩展模块开发，复用现有基础设施
- 后端使用 Java 21（需更新 Dockerfile）
- 前端和后端的 Dockerfile 已存在，只需更新和验证
- docker-compose.yml 和 docker-compose.prod.yml 已存在，只需添加 CMS 配置

- [ ] 2. 实现管理员认证系统
  - [ ] 2.1 创建管理员用户数据模型和数据库表
    - Entity: AdminUser
    - Repository: AdminUserRepository
    - 初始化超级管理员账号
    - _Requirements: 1.1, 1.2_

  - [ ] 2.2 实现 JWT 认证服务
    - 生成和验证 JWT 令牌
    - 密码 BCrypt 哈希
    - 令牌刷新机制
    - _Requirements: 1.2_

  - [ ] 2.3 实现登录 API
    - POST /api/admin/auth/login
    - POST /api/admin/auth/logout
    - GET /api/admin/auth/me
    - _Requirements: 1.1, 1.2_

  - [ ]* 2.4 编写认证服务的属性测试
    - **Property 1: 认证成功返回令牌**
    - **Validates: Requirements 1.1, 1.2**

  - [ ] 2.5 实现登录日志记录
    - 记录登录时间、IP、User Agent
    - _Requirements: 1.7_

  - [ ]* 2.6 编写登录日志的属性测试
    - **Property 2: 登录日志完整性**
    - **Validates: Requirements 1.7**

  - [ ] 2.7 实现账号锁定机制
    - 5次失败后锁定15分钟
    - _Requirements: 1.3_

  - [ ] 2.8 创建登录页面组件
    - LoginPage with form validation
    - 错误提示和加载状态
    - _Requirements: 1.1_

  - [ ]* 2.9 编写登录页面的单元测试
    - 表单验证测试
    - 登录成功/失败场景
    - _Requirements: 1.1_

- [ ] 3. Checkpoint - 认证系统验证
  - 确保所有测试通过，询问用户是否有问题

- [ ] 4. 实现内容管理核心功能
  - [ ] 4.1 创建页面和内容项数据模型
    - Entity: Page, ContentItem
    - Repository: PageRepository, ContentItemRepository
    - 初始化页面数据（首页、E-BIKE页等）
    - _Requirements: 2.1, 2.2_

  - [ ] 4.2 实现内容管理 API
    - GET /api/admin/content/pages
    - GET /api/admin/content/pages/:pageId
    - PUT /api/admin/content/items/:itemId
    - _Requirements: 2.2, 2.6_

  - [ ]* 4.3 编写内容检索的属性测试
    - **Property 3: 内容检索完整性**
    - **Validates: Requirements 2.2**

  - [ ]* 4.4 编写内容保存的属性测试
    - **Property 4: 内容保存往返一致性**
    - **Validates: Requirements 2.6, 3.6**

  - [ ] 4.5 创建内容管理页面组件
    - ContentManagementPage
    - PageSelector (选择页面)
    - ContentList (内容列表)
    - _Requirements: 2.1, 2.2_

  - [ ] 4.6 实现内容编辑器组件
    - ContentEditor (单行/多行/富文本)
    - RichTextEditor (基于 TipTap)
    - 字符计数和长度警告
    - _Requirements: 2.4, 2.5, 2.7_

  - [ ]* 4.7 编写内容编辑器的单元测试
    - 字符计数测试
    - 长度警告测试
    - 保存功能测试
    - _Requirements: 2.4, 2.7_

- [ ] 5. 实现多语言内容管理
  - [ ] 5.1 扩展内容 API 支持双语
    - 同时保存中英文内容
    - 语言切换查询
    - _Requirements: 3.1, 3.6_

  - [ ] 5.2 实现语言切换 UI
    - 语言标签切换
    - 缺失翻译标识
    - _Requirements: 3.2, 3.4_

  - [ ] 5.3 集成翻译 API（可选）
    - 一键生成英文翻译建议
    - _Requirements: 3.5_

  - [ ]* 5.4 编写多语言保存的单元测试
    - 验证中英文同时保存
    - _Requirements: 3.6_

- [ ] 6. Checkpoint - 内容管理验证
  - 确保所有测试通过，询问用户是否有问题

- [ ] 7. 实现图片资源管理
  - [ ] 7.1 创建资源数据模型
    - Entity: Asset, AssetUsage
    - Repository: AssetRepository, AssetUsageRepository
    - 支持多尺寸URL字段
    - _Requirements: 4.1, 4.2_

  - [ ] 7.2 集成阿里云 OSS SDK
    - 配置 OSS 客户端
    - 实现上传、删除、查询方法
    - _Requirements: 20.3_

  - [ ] 7.3 实现图片自动处理服务
    - 使用 ImageMagick 或 Sharp 库
    - 生成5个尺寸版本（原图、大、中、小、缩略图）
    - 自动转换为 WebP 格式
    - 智能裁剪和压缩
    - _Requirements: 4.6, 4.7_

  - [ ]* 7.4 编写图片处理的属性测试
    - **Property 5: 图片处理完整性**
    - **Validates: Requirements 4.6, 4.7**

  - [ ] 7.5 实现资源管理 API
    - GET /api/admin/assets (列表、搜索、筛选)
    - POST /api/admin/assets/upload (上传并自动处理)
    - PUT /api/admin/assets/:assetId (替换)
    - DELETE /api/admin/assets/:assetId (删除前检查使用)
    - GET /api/admin/assets/:assetId/usage
    - _Requirements: 4.1, 4.3, 4.8, 4.9_

  - [ ]* 7.6 编写资源引用完整性的属性测试
    - **Property 6: 资源引用完整性**
    - **Validates: Requirements 4.9**

  - [ ] 7.7 创建资源管理页面组件
    - AssetManagementPage
    - AssetGrid (网格展示)
    - AssetUploader (拖拽上传)
    - AssetDetail (详情和使用情况)
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 7.8 编写资源管理组件的单元测试
    - 上传功能测试
    - 文件验证测试
    - 删除警告测试
    - _Requirements: 4.3, 4.4, 4.5, 4.9_

- [ ] 8. Checkpoint - 图片管理验证
  - 确保所有测试通过，询问用户是否有问题

- [ ] 9. 实现版本控制系统
  - [ ] 9.1 创建内容版本数据模型
    - Entity: ContentVersion
    - Repository: ContentVersionRepository
    - _Requirements: 6.1, 6.2_

  - [ ] 9.2 实现版本自动创建
    - 在内容保存时自动创建版本
    - 记录修改人和修改摘要
    - _Requirements: 6.1_

  - [ ]* 9.3 编写版本自动创建的属性测试
    - **Property 8: 版本自动创建**
    - **Validates: Requirements 6.1**

  - [ ] 9.4 实现版本历史 API
    - GET /api/admin/content/items/:itemId/versions
    - POST /api/admin/content/items/:itemId/restore
    - _Requirements: 6.2, 6.6_

  - [ ]* 9.5 编写版本恢复的属性测试
    - **Property 9: 版本恢复一致性**
    - **Validates: Requirements 6.7**

  - [ ] 9.6 创建版本历史组件
    - VersionHistory (版本列表)
    - VersionDiff (版本对比)
    - 恢复确认对话框
    - _Requirements: 6.2, 6.4, 6.5, 6.6_

  - [ ]* 9.7 编写版本历史组件的单元测试
    - 版本列表渲染测试
    - 恢复功能测试
    - _Requirements: 6.2, 6.6_

- [ ] 10. 实现预览与发布功能
  - [ ] 10.1 实现预览模式 API
    - 返回未发布的内容
    - 预览令牌生成
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ] 10.2 创建预览页面
    - PreviewModal 或独立预览页
    - 使用真实样式渲染
    - 预览提示条
    - _Requirements: 5.2, 5.3, 5.4_

  - [ ] 10.3 实现发布功能
    - 发布确认对话框
    - 发布操作日志记录
    - 定时发布（可选）
    - _Requirements: 5.5, 5.6, 5.7, 5.8_

  - [ ]* 10.4 编写发布日志的属性测试
    - **Property 7: 发布操作日志记录**
    - **Validates: Requirements 5.6**

  - [ ]* 10.5 编写预览和发布的单元测试
    - 预览渲染测试
    - 发布确认测试
    - _Requirements: 5.2, 5.5_

- [ ] 11. Checkpoint - 版本控制和发布验证
  - 确保所有测试通过，询问用户是否有问题

- [ ] 12. 实现路线管理功能
  - [ ] 12.1 创建路线数据模型
    - Entity: Route, RouteImage, RouteHighlight
    - Repository: RouteRepository, RouteImageRepository, RouteHighlightRepository
    - _Requirements: 8.1, 8.2_

  - [ ] 12.2 实现路线管理 API
    - GET /api/admin/routes (列表、搜索、筛选)
    - POST /api/admin/routes (创建)
    - PUT /api/admin/routes/:routeId (编辑)
    - DELETE /api/admin/routes/:routeId (删除)
    - POST /api/admin/routes/:routeId/publish (发布)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 12.3 编写路线创建的属性测试
    - **Property 10: 路线创建完整性**
    - **Validates: Requirements 8.2**

  - [ ] 12.4 创建路线管理页面组件
    - RouteManagementPage
    - RouteList (列表和筛选)
    - RouteEditor (编辑表单)
    - RoutePreview (预览)
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 12.5 编写路线管理组件的单元测试
    - 表单验证测试
    - 批量操作测试
    - _Requirements: 8.2, 8.4_

- [ ] 13. 实现商品管理功能
  - [ ] 13.1 创建商品数据模型
    - Entity: Product, ProductImage
    - Repository: ProductRepository, ProductImageRepository
    - _Requirements: 9.1, 9.2_

  - [ ] 13.2 实现商品管理 API
    - GET /api/admin/products
    - POST /api/admin/products
    - PUT /api/admin/products/:productId
    - DELETE /api/admin/products/:productId
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 13.3 创建商品管理页面组件
    - ProductManagementPage
    - ProductList
    - ProductEditor
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 13.4 编写商品管理组件的单元测试
    - 表单验证测试
    - 批量操作测试
    - _Requirements: 9.2, 9.5_

- [ ] 14. 实现合作伙伴管理
  - [ ] 14.1 创建合作伙伴数据模型
    - Entity: Partner
    - Repository: PartnerRepository
    - _Requirements: 10.1, 10.2_

  - [ ] 14.2 实现合作伙伴管理 API
    - GET /api/admin/partners
    - POST /api/admin/partners
    - PUT /api/admin/partners/:partnerId
    - DELETE /api/admin/partners/:partnerId
    - PUT /api/admin/partners/reorder (拖拽排序)
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 14.3 创建合作伙伴管理页面
    - PartnerManagementPage
    - PartnerList (支持拖拽排序)
    - PartnerEditor
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ]* 14.4 编写合作伙伴管理的单元测试
    - 排序功能测试
    - _Requirements: 10.4_

- [ ] 15. Checkpoint - 内容类型管理验证
  - 确保所有测试通过，询问用户是否有问题

- [ ] 16. 实现系统设置和统计
  - [ ] 16.1 创建系统设置数据模型
    - Entity: SystemSettings
    - Repository: SystemSettingsRepository
    - _Requirements: 11.1, 11.2_

  - [ ] 16.2 实现系统设置 API
    - GET /api/admin/settings
    - PUT /api/admin/settings
    - 配置验证和测试
    - _Requirements: 11.1, 11.2, 11.3_

  - [ ] 16.3 实现统计 API
    - GET /api/admin/statistics/dashboard
    - GET /api/admin/statistics/routes/:routeId
    - _Requirements: 12.1, 12.2_

  - [ ] 16.4 创建仪表盘页面
    - DashboardPage
    - StatCard (统计卡片)
    - RecentUpdates (最近更新)
    - TodoList (待办事项)
    - _Requirements: 12.1_

  - [ ] 16.5 创建系统设置页面
    - SettingsPage
    - GeneralSettings
    - SEOSettings
    - IntegrationSettings
    - _Requirements: 11.1, 11.2_

  - [ ]* 16.6 编写设置和统计的单元测试
    - 配置验证测试
    - 统计数据计算测试
    - _Requirements: 11.2, 12.1_

- [ ] 17. 实现操作日志和审计
  - [ ] 17.1 创建操作日志数据模型
    - Entity: OperationLog
    - Repository: OperationLogRepository
    - _Requirements: 13.1, 13.2_

  - [ ] 17.2 实现日志记录 AOP 切面
    - 自动记录所有管理员操作
    - 记录操作前后的数据
    - _Requirements: 13.1, 13.2_

  - [ ] 17.3 实现日志查询 API
    - GET /api/admin/logs (筛选、分页)
    - GET /api/admin/logs/:logId
    - _Requirements: 13.3, 13.4_

  - [ ] 17.4 创建日志查看页面
    - LogsPage
    - LogList (列表和筛选)
    - LogFilter (高级筛选)
    - LogDetail (详情)
    - _Requirements: 13.3_

  - [ ]* 17.5 编写日志记录的单元测试
    - AOP切面测试
    - 日志查询测试
    - _Requirements: 13.1, 13.2_

- [ ] 18. 实现高级功能
  - [ ] 18.1 实现搜索功能
    - 全局搜索 API
    - 搜索结果高亮
    - _Requirements: 17.1, 17.2, 17.3_

  - [ ] 18.2 实现批量导入导出
    - 导出为 JSON/Excel
    - 从 Excel 导入
    - 数据验证和错误处理
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [ ]* 18.3 编写导入事务的属性测试
    - **Property 12: 导入事务原子性**
    - **Validates: Requirements 16.6**

  - [ ] 18.4 实现并发编辑检测
    - 乐观锁机制（版本号）
    - 冲突检测和提示
    - _Requirements: 15.6_

  - [ ]* 18.5 编写并发编辑的属性测试
    - **Property 11: 并发编辑检测**
    - **Validates: Requirements 15.6**

  - [ ] 18.6 实现通知系统
    - 通知数据模型
    - 通知 API
    - 通知中心 UI
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

  - [ ]* 18.7 编写高级功能的单元测试
    - 搜索功能测试
    - 导入导出测试
    - 通知系统测试
    - _Requirements: 17.1, 16.1, 18.1_

- [ ] 19. Checkpoint - 高级功能验证
  - 确保所有测试通过，询问用户是否有问题

- [ ] 20. 实现布局和导航
  - [ ] 20.1 创建后台布局组件
    - AdminLayout
    - Sidebar (侧边栏导航)
    - TopBar (顶部栏)
    - _Requirements: 14.1, 14.2_

  - [ ] 20.2 实现权限控制
    - 路由守卫
    - 按钮级权限控制
    - _Requirements: 1.4, 1.5_

  - [ ] 20.3 实现响应式设计
    - 移动端适配
    - 平板端适配
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ]* 20.4 编写布局组件的单元测试
    - 导航渲染测试
    - 权限控制测试
    - _Requirements: 14.1, 1.4_

- [ ] 21. Docker 容器化配置
  - [ ] 21.1 创建 Frontend Dockerfile
    - 多阶段构建
    - 优化镜像大小
    - _Requirements: 20.4_

  - [ ] 21.2 创建 Backend Dockerfile
    - Maven 构建
    - JRE 运行时
    - _Requirements: 20.4_

  - [ ] 21.3 创建 docker-compose.yml
    - PostgreSQL 容器
    - Redis 容器
    - Backend 容器
    - Frontend 容器
    - Nginx 容器
    - 网络和卷配置
    - _Requirements: 20.4_

  - [ ] 21.4 创建 Nginx 配置
    - 反向代理配置
    - SSL 配置
    - _Requirements: 20.4_

  - [ ] 21.5 创建生产环境配置
    - docker-compose.prod.yml
    - 环境变量配置
    - _Requirements: 20.4_

  - [ ]* 21.6 测试 Docker 部署
    - 本地 Docker 启动测试
    - 健康检查验证
    - _Requirements: 20.4_

- [ ] 22. CI/CD 配置
  - [ ] 22.1 创建 GitHub Actions 工作流
    - 测试工作流
    - 构建工作流
    - 部署工作流
    - _Requirements: 20.4_

  - [ ] 22.2 创建部署脚本
    - deploy.sh (自动化部署)
    - 健康检查
    - 回滚机制
    - _Requirements: 20.4_

  - [ ]* 22.3 测试 CI/CD 流程
    - 提交代码触发测试
    - 标签触发部署
    - _Requirements: 20.4_

- [ ] 23. Checkpoint - 部署配置验证
  - 确保 Docker 和 CI/CD 配置正常工作

- [ ] 24. 性能优化
  - [ ] 24.1 前端性能优化
    - 代码分割和懒加载
    - 图片懒加载
    - 缓存策略
    - _Requirements: 15.5_

  - [ ] 24.2 后端性能优化
    - 数据库索引优化
    - Redis 缓存
    - API 响应时间优化
    - _Requirements: 15.5_

  - [ ]* 24.3 运行性能测试
    - Lighthouse 测试
    - 负载测试
    - _Requirements: 15.5_

- [ ] 25. 安全加固
  - [ ] 25.1 实现安全措施
    - HTTPS 强制
    - CSRF 防护
    - XSS 防护
    - SQL 注入防护
    - _Requirements: 15.1, 15.2, 15.3_

  - [ ] 25.2 实现 API 限流
    - 每分钟100次请求限制
    - _Requirements: 15.4_

  - [ ]* 25.3 安全测试
    - 渗透测试
    - 依赖漏洞扫描
    - _Requirements: 15.1, 15.2_

- [ ] 26. 文档和帮助
  - [ ] 26.1 创建帮助中心页面
    - 常见问题
    - 操作指南
    - _Requirements: 19.1, 19.2_

  - [ ] 26.2 实现新手引导
    - 首次登录引导
    - 功能工具提示
    - _Requirements: 19.2, 19.3_

  - [ ]* 26.3 编写用户文档
    - 管理员使用手册
    - API 文档
    - _Requirements: 19.1_

- [ ] 27. 最终集成测试
  - [ ]* 27.1 运行所有单元测试
    - 前端单元测试
    - 后端单元测试
    - 覆盖率检查 (>80%)

  - [ ]* 27.2 运行所有属性测试
    - 12个正确性属性测试
    - 每个测试100次迭代

  - [ ]* 27.3 运行集成测试
    - API 集成测试
    - 数据库集成测试

  - [ ]* 27.4 运行 E2E 测试
    - 登录流程
    - 内容编辑流程
    - 图片上传流程
    - 发布流程
    - 版本恢复流程

- [ ] 28. 最终 Checkpoint - 系统验证
  - 确保所有测试通过
  - 确保 Docker 部署成功
  - 询问用户进行最终验收测试

## Notes

- 标记 `*` 的任务为可选任务，可以跳过以加快 MVP 开发
- 每个任务都引用了具体的需求编号，便于追溯
- Checkpoint 任务确保增量验证，及时发现问题
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边界情况
- 集成测试和 E2E 测试验证端到端流程
