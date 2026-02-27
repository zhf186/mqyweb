# Requirements Document

## Introduction

漫骑游后台管理系统（CMS Admin System）是一个专为网站内容管理设计的后台应用。系统允许管理员通过可视化界面编辑网站页面的文字内容、上传和替换图片资源，无需直接修改代码即可更新网站内容。

系统需要支持：
1. **文字内容管理**：编辑首页、各功能页面的标题、描述、按钮文字等文本内容
2. **图片资源管理**：上传、替换、删除网站使用的图片资源
3. **多语言内容管理**：管理中英文双语内容
4. **权限管理**：支持管理员账号登录和权限控制
5. **预览功能**：修改前预览效果，确认后发布

## Glossary

- **CMS_System**: 后台内容管理系统，提供网站内容编辑功能
- **Admin_User**: 管理员用户，拥有编辑网站内容的权限
- **Content_Item**: 内容项，指网站上的一个可编辑文本单元（如标题、描述、按钮文字）
- **Asset_Manager**: 资源管理器，管理网站图片、视频等媒体资源
- **Page_Template**: 页面模板，定义页面的可编辑区域和内容结构
- **Content_Version**: 内容版本，记录内容的修改历史
- **OSS_Service**: 阿里云对象存储服务，用于存储上传的图片文件
- **Preview_Mode**: 预览模式，允许管理员在发布前查看修改效果
- **Publish_Action**: 发布操作，将修改的内容应用到正式网站

## Requirements

### Requirement 1: 管理员认证与权限管理

**User Story:** As a 系统管理员, I want 安全的登录系统并管理其他管理员账号, so that 只有授权人员能够修改网站内容。

#### Acceptance Criteria

1. THE CMS_System SHALL 提供管理员登录页面，支持用户名+密码登录
2. WHEN 管理员输入正确的凭证 THEN THE CMS_System SHALL 生成JWT令牌并跳转到管理后台
3. WHEN 管理员输入错误的凭证超过5次 THEN THE CMS_System SHALL 锁定账号15分钟
4. THE CMS_System SHALL 支持超级管理员创建、编辑、删除其他管理员账号
5. THE CMS_System SHALL 支持两种角色：超级管理员（全部权限）和内容编辑员（仅内容编辑权限）
6. WHEN 管理员30分钟无操作 THEN THE CMS_System SHALL 自动登出并清除会话
7. THE CMS_System SHALL 记录所有管理员的登录日志（时间、IP地址、操作系统）

### Requirement 2: 页面内容编辑

**User Story:** As a 内容编辑员, I want 通过可视化界面编辑网站页面的文字内容, so that 我能快速更新网站信息而无需修改代码。

#### Acceptance Criteria

1. THE CMS_System SHALL 展示所有可编辑页面的列表：首页、E-BIKE页面、路线页面、好物页面、社群页面、合作伙伴页面、关于页面
2. WHEN 管理员选择一个页面 THEN THE CMS_System SHALL 展示该页面的所有可编辑内容项
3. THE CMS_System SHALL 为每个内容项显示：字段名称、当前内容、语言标识、最后修改时间
4. WHEN 管理员点击编辑按钮 THEN THE CMS_System SHALL 打开编辑器（单行文本用输入框，多行文本用富文本编辑器）
5. THE CMS_System SHALL 支持富文本编辑功能：加粗、斜体、链接、列表
6. WHEN 管理员保存修改 THEN THE CMS_System SHALL 验证内容格式并保存到数据库
7. THE CMS_System SHALL 显示字符计数，并在超出建议长度时给出警告
8. THE CMS_System SHALL 支持批量编辑同一页面的多个内容项

### Requirement 3: 多语言内容管理

**User Story:** As a 内容编辑员, I want 同时管理中英文内容, so that 网站能够为不同语言用户提供准确的翻译。

#### Acceptance Criteria

1. THE CMS_System SHALL 为每个内容项提供中文和英文两个编辑字段
2. THE CMS_System SHALL 在内容列表中显示语言切换标签
3. WHEN 管理员切换语言标签 THEN THE CMS_System SHALL 显示对应语言的内容
4. THE CMS_System SHALL 标识缺失翻译的内容项（显示警告图标）
5. THE CMS_System SHALL 支持从中文内容一键生成英文翻译建议（调用翻译API）
6. WHEN 管理员保存内容 THEN THE CMS_System SHALL 同时保存中英文版本

### Requirement 4: 图片资源管理

**User Story:** As a 内容编辑员, I want 上传、替换和管理网站图片, so that 我能更新网站的视觉内容。

#### Acceptance Criteria

1. THE Asset_Manager SHALL 展示所有网站图片资源，按分类组织：Hero图、品牌图、E-BIKE图、路线图、好物图、社群图、合作伙伴图、城市图
2. THE Asset_Manager SHALL 为每张图片显示：缩略图、文件名、尺寸、大小、上传时间、使用位置
3. WHEN 管理员点击上传按钮 THEN THE Asset_Manager SHALL 打开文件选择对话框
4. THE Asset_Manager SHALL 支持拖拽上传和批量上传（最多20张）
5. THE Asset_Manager SHALL 验证上传文件：格式（JPG、PNG、WebP）、大小（单张不超过5MB）
6. WHEN 上传成功 THEN THE Asset_Manager SHALL 自动生成多种尺寸（原图、大、中、小）并上传到OSS_Service
7. THE Asset_Manager SHALL 自动将图片转换为WebP格式以优化性能
8. WHEN 管理员点击替换按钮 THEN THE Asset_Manager SHALL 上传新图片并更新所有引用位置
9. THE Asset_Manager SHALL 在删除图片前检查使用情况，如果正在使用则显示警告
10. THE Asset_Manager SHALL 支持图片搜索和筛选功能

### Requirement 5: 内容预览与发布

**User Story:** As a 内容编辑员, I want 在发布前预览修改效果, so that 我能确保内容正确无误再上线。

#### Acceptance Criteria

1. WHEN 管理员修改内容后 THEN THE CMS_System SHALL 显示"预览"和"发布"按钮
2. WHEN 管理员点击预览按钮 THEN THE CMS_System SHALL 在新标签页打开预览页面，显示修改后的效果
3. THE Preview_Mode SHALL 使用与正式网站相同的样式和布局
4. THE Preview_Mode SHALL 在页面顶部显示预览提示条："这是预览模式，内容尚未发布"
5. WHEN 管理员点击发布按钮 THEN THE CMS_System SHALL 显示确认对话框
6. WHEN 管理员确认发布 THEN THE CMS_System SHALL 将修改应用到正式网站并记录发布日志
7. THE CMS_System SHALL 支持定时发布功能，允许设置发布时间
8. THE CMS_System SHALL 在发布后显示成功提示，并提供"查看网站"链接

### Requirement 6: 版本历史与回滚

**User Story:** As a 内容编辑员, I want 查看内容修改历史并回滚到之前的版本, so that 我能在出错时快速恢复。

#### Acceptance Criteria

1. THE CMS_System SHALL 自动保存每次内容修改为一个版本
2. THE CMS_System SHALL 为每个内容项显示"历史版本"按钮
3. WHEN 管理员点击历史版本按钮 THEN THE CMS_System SHALL 展示版本列表（版本号、修改时间、修改人、修改摘要）
4. THE CMS_System SHALL 支持对比两个版本的差异（高亮显示变化部分）
5. WHEN 管理员选择一个历史版本 THEN THE CMS_System SHALL 显示该版本的完整内容
6. THE CMS_System SHALL 提供"恢复到此版本"按钮
7. WHEN 管理员确认恢复 THEN THE CMS_System SHALL 将内容回滚到选定版本并创建新版本记录
8. THE CMS_System SHALL 保留最近100个版本，超过的自动归档

### Requirement 7: 首页内容管理

**User Story:** As a 内容编辑员, I want 编辑首页的各个区域内容, so that 我能更新首页展示的信息。

#### Acceptance Criteria

1. THE CMS_System SHALL 将首页分为以下可编辑区域：
   - Hero区域：主标题、副标题、CTA按钮文字、背景图片
   - 品牌介绍区域：标题、描述文字
   - 五大板块区域：每个板块的标题、描述、图标
   - 精选路线区域：展示的路线ID列表
   - E-BIKE亮点区域：标题、三个特性描述、图片
   - 社群数据区域：活动数量、骑友数量、描述文字
   - CTA区域：标题、按钮文字、背景图片
2. THE CMS_System SHALL 为每个区域提供独立的编辑界面
3. THE CMS_System SHALL 支持拖拽调整区域显示顺序
4. THE CMS_System SHALL 支持隐藏/显示某个区域
5. THE CMS_System SHALL 实时显示首页预览效果

### Requirement 8: 路线内容管理

**User Story:** As a 内容编辑员, I want 管理骑游路线的详细信息, so that 用户能看到最新的路线内容。

#### Acceptance Criteria

1. THE CMS_System SHALL 展示所有路线的列表，支持搜索和筛选
2. THE CMS_System SHALL 支持创建新路线，包含以下字段：
   - 基本信息：路线名称、简短描述、详细描述
   - 路线参数：距离、难度等级、预计时间、价格
   - 分类标签：城市休闲、山地挑战、文化探索等
   - 图片：封面图、详情图（最多10张）
   - 地图：起点、终点、途经点坐标
   - 亮点：路线特色（最多5个）
   - 状态：草稿、已发布、已下架
3. THE CMS_System SHALL 支持编辑和删除路线
4. THE CMS_System SHALL 支持批量操作：批量发布、批量下架、批量删除
5. THE CMS_System SHALL 在路线列表中显示：缩略图、名称、难度、价格、状态、最后修改时间
6. THE CMS_System SHALL 支持设置路线为"精选"，在首页展示

### Requirement 9: 好物商品管理

**User Story:** As a 内容编辑员, I want 管理在地好物商品信息, so that 用户能浏览和购买商品。

#### Acceptance Criteria

1. THE CMS_System SHALL 展示所有商品的列表，支持搜索和筛选
2. THE CMS_System SHALL 支持创建新商品，包含以下字段：
   - 基本信息：商品名称、简短描述、详细描述
   - 价格信息：原价、现价、库存数量
   - 分类：衣、食、住、行、乐
   - 图片：主图、详情图（最多8张）
   - 商家信息：商家名称、地址、联系方式
   - 状态：上架、下架
3. THE CMS_System SHALL 支持编辑和删除商品
4. THE CMS_System SHALL 在商品列表中显示：缩略图、名称、价格、库存、状态
5. THE CMS_System SHALL 支持批量操作：批量上架、批量下架

### Requirement 10: 合作伙伴管理

**User Story:** As a 内容编辑员, I want 管理合作伙伴信息, so that 网站能展示最新的合作关系。

#### Acceptance Criteria

1. THE CMS_System SHALL 展示所有合作伙伴的列表
2. THE CMS_System SHALL 支持创建新合作伙伴，包含以下字段：
   - 基本信息：合作伙伴名称、类型（品牌合作、景区合作）
   - 描述：合作内容、合作亮点
   - Logo图片
   - 链接：合作伙伴官网
   - 显示顺序
3. THE CMS_System SHALL 支持编辑和删除合作伙伴
4. THE CMS_System SHALL 支持拖拽调整合作伙伴显示顺序

### Requirement 11: 系统设置管理

**User Story:** As a 超级管理员, I want 配置系统全局设置, so that 系统能按需运行。

#### Acceptance Criteria

1. THE CMS_System SHALL 提供系统设置页面，包含以下配置项：
   - 网站基本信息：网站名称、Logo、Favicon、联系方式
   - SEO设置：默认标题、描述、关键词
   - 社交媒体：微信公众号、微博、抖音链接
   - 第三方服务：阿里云OSS配置、翻译API配置
   - 邮件设置：SMTP服务器配置
2. THE CMS_System SHALL 验证配置项的格式和有效性
3. WHEN 管理员保存设置 THEN THE CMS_System SHALL 测试配置是否可用
4. THE CMS_System SHALL 支持导出和导入配置

### Requirement 12: 数据统计与分析

**User Story:** As a 管理员, I want 查看网站内容的统计数据, so that 我能了解内容表现并优化。

#### Acceptance Criteria

1. THE CMS_System SHALL 提供仪表盘页面，展示关键指标：
   - 内容统计：总页面数、总图片数、总路线数、总商品数
   - 最近更新：最近7天修改的内容列表
   - 待办事项：缺失翻译的内容数、待发布的草稿数
2. THE CMS_System SHALL 为每个路线显示浏览量和预订量
3. THE CMS_System SHALL 为每个商品显示浏览量和销售量
4. THE CMS_System SHALL 支持导出统计报表（CSV格式）

### Requirement 13: 操作日志与审计

**User Story:** As a 超级管理员, I want 查看所有管理员的操作记录, so that 我能追踪内容变更和排查问题。

#### Acceptance Criteria

1. THE CMS_System SHALL 记录所有管理员操作：登录、内容编辑、图片上传、发布、删除
2. THE CMS_System SHALL 为每条日志记录：操作时间、操作人、操作类型、操作对象、操作前后内容
3. THE CMS_System SHALL 提供日志查询页面，支持按时间、操作人、操作类型筛选
4. THE CMS_System SHALL 支持导出日志（CSV格式）
5. THE CMS_System SHALL 保留日志至少90天

### Requirement 14: 响应式后台界面

**User Story:** As a 管理员, I want 在不同设备上使用后台系统, so that 我能随时随地管理内容。

#### Acceptance Criteria

1. THE CMS_System SHALL 支持桌面端（1024px+）、平板端（768-1023px）、移动端（<768px）
2. WHEN 在移动端访问 THEN THE CMS_System SHALL 使用简化的导航和布局
3. THE CMS_System SHALL 在所有设备上保持核心功能可用
4. THE CMS_System SHALL 在移动端优化图片上传体验（支持拍照上传）

### Requirement 15: 性能与安全

**User Story:** As a 系统管理员, I want 系统安全稳定运行, so that 内容管理不受干扰。

#### Acceptance Criteria

1. THE CMS_System SHALL 对所有API请求进行JWT令牌验证
2. THE CMS_System SHALL 对所有用户输入进行XSS和SQL注入防护
3. THE CMS_System SHALL 使用HTTPS加密传输
4. THE CMS_System SHALL 限制API请求频率（每分钟最多100次）
5. THE CMS_System SHALL 在2秒内完成页面加载
6. THE CMS_System SHALL 支持并发编辑冲突检测（如果两个管理员同时编辑同一内容，后保存的会收到警告）
7. THE CMS_System SHALL 定期备份数据库（每天凌晨3点）

### Requirement 16: 批量导入导出

**User Story:** As a 内容编辑员, I want 批量导入导出内容, so that 我能高效地迁移和备份数据。

#### Acceptance Criteria

1. THE CMS_System SHALL 支持导出所有内容为JSON格式
2. THE CMS_System SHALL 支持导出所有内容为Excel格式（用于翻译）
3. THE CMS_System SHALL 支持从Excel导入翻译后的内容
4. THE CMS_System SHALL 在导入前验证数据格式和完整性
5. THE CMS_System SHALL 在导入时显示进度条
6. IF 导入失败 THEN THE CMS_System SHALL 显示详细错误信息并回滚

### Requirement 17: 搜索与筛选

**User Story:** As a 内容编辑员, I want 快速搜索和筛选内容, so that 我能高效地找到需要编辑的内容。

#### Acceptance Criteria

1. THE CMS_System SHALL 在顶部提供全局搜索框
2. THE CMS_System SHALL 支持搜索内容项、路线、商品、图片
3. THE CMS_System SHALL 在搜索结果中高亮显示匹配的关键词
4. THE CMS_System SHALL 支持高级筛选：按页面、按语言、按修改时间、按修改人
5. THE CMS_System SHALL 记住用户的筛选偏好

### Requirement 18: 通知与提醒

**User Story:** As a 管理员, I want 收到重要事件的通知, so that 我能及时处理。

#### Acceptance Criteria

1. THE CMS_System SHALL 在以下情况发送通知：
   - 有新的待审核内容
   - 有内容被其他管理员修改
   - 系统配置被更改
   - 图片上传失败
2. THE CMS_System SHALL 在后台界面右上角显示通知图标和未读数量
3. WHEN 管理员点击通知图标 THEN THE CMS_System SHALL 展开通知列表
4. THE CMS_System SHALL 支持标记通知为已读
5. THE CMS_System SHALL 支持通过邮件发送重要通知

### Requirement 19: 帮助文档与引导

**User Story:** As a 新管理员, I want 查看帮助文档和操作引导, so that 我能快速学会使用系统。

#### Acceptance Criteria

1. THE CMS_System SHALL 提供帮助中心页面，包含常见问题和操作指南
2. THE CMS_System SHALL 在首次登录时显示新手引导
3. THE CMS_System SHALL 在关键功能处提供工具提示
4. THE CMS_System SHALL 提供视频教程链接
5. THE CMS_System SHALL 提供在线客服入口

### Requirement 20: 技术架构

**User Story:** As a 开发者, I want 使用现代化技术栈构建后台系统, so that 系统易于维护和扩展。

#### Acceptance Criteria

1. THE CMS_System SHALL 使用以下前端技术栈：
   - Next.js 14 (App Router) - React框架
   - TypeScript - 类型安全
   - Tailwind CSS + shadcn/ui - UI组件库
   - React Query - 数据获取和缓存
   - Zustand - 状态管理
   - React Hook Form + Zod - 表单验证
2. THE CMS_System SHALL 使用以下后端技术栈：
   - Spring Boot 3.2.x + Java 21 - 后端框架（最新LTS版本）
   - PostgreSQL 16 - 数据库
   - Redis 7 - 缓存和会话
   - MyBatis-Plus - ORM
   - JWT - 认证
   - 阿里云OSS - 图片存储
3. THE CMS_System SHALL 提供RESTful API，遵循统一的响应格式
4. THE CMS_System SHALL 使用Docker容器化部署
5. THE CMS_System SHALL 与现有的漫骑游网站共享数据库和API
