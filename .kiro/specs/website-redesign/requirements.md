# 网站重新设计需求文档

## 项目概述
对漫骑游官网进行全面重新设计，打造大气时尚科技轻奢的品牌形象，优化内容分布和用户体验。

## 设计理念

### 品牌定位
**"Future Luxury Cycling"** - 未来轻奢骑行

### 核心风格关键词
- **大气 (Grand)**: 大版面、留白、呼吸感
- **时尚 (Modern)**: 简洁线条、现代排版、动态效果
- **科技 (Tech)**: 智能感、数字化、未来感
- **轻奢 (Luxury)**: 精致细节、高级质感、品质感

## 需求列表

### Requirement 1: 首页精简化

**User Story**: 作为访客，我希望首页简洁有力，快速了解品牌核心价值

#### Acceptance Criteria

1. THE 首页 SHALL 只展示核心内容：Hero、品牌介绍、E-BIKE亮点、精选路线、CTA
2. THE 首页文案 SHALL 简洁有力，每段不超过2句话
3. THE 首页 SHALL 使用大版面图片和留白设计
4. THE 首页 SHALL 移除冗余的统计数据和详细描述
5. THE 首页 SHALL 采用全屏滚动式布局，每屏一个主题

### Requirement 2: 内容合理分配

**User Story**: 作为访客，我希望在对应页面找到详细信息，而不是全部堆在首页

#### Acceptance Criteria

1. THE 合作伙伴内容 SHALL 移至 /partners 页面
2. THE 工厂制造内容 SHALL 移至 /about 页面的"制造实力"板块
3. THE 门店信息 SHALL 移至 /about 页面的"全国布局"板块
4. THE 社群活动照片 SHALL 移至 /community 页面
5. THE 首页 SHALL 只保留简短的品牌介绍和核心卖点

### Requirement 3: 文案优化

**User Story**: 作为访客，我希望看到简洁时尚的文案，而不是冗长的官方描述

#### Acceptance Criteria

1. THE 所有标题 SHALL 简短有力，不超过8个字（中文）
2. THE 描述文案 SHALL 采用短句，每句不超过20字
3. THE 文案 SHALL 避免使用"深度合作"、"全面布局"等官方套话
4. THE 文案 SHALL 使用动词开头，如"骑遇"、"探索"、"体验"
5. THE 数字 SHALL 突出显示，配以简短说明

### Requirement 4: 视觉升级

**User Story**: 作为访客，我希望看到大气时尚科技轻奢的视觉设计

#### Acceptance Criteria

1. THE 首页 SHALL 使用全屏大图背景
2. THE 排版 SHALL 采用大量留白，文字占比不超过30%
3. THE 字体 SHALL 使用现代无衬线字体，标题加粗
4. THE 配色 SHALL 以黑白灰为主，品牌色作为点缀
5. THE 动画 SHALL 流畅自然，避免过度效果

### Requirement 5: 合作伙伴页面重构

**User Story**: 作为访客，我希望在合作伙伴页面看到专业的合作展示

#### Acceptance Criteria

1. THE /partners 页面 SHALL 展示雅迪和Gazelle的详细合作信息
2. THE /partners 页面 SHALL 展示11家国家级景区合作
3. THE /partners 页面 SHALL 使用大图+简短文字的卡片式布局
4. THE /partners 页面 SHALL 包含合作优势和合作模式
5. THE /partners 页面 SHALL 有明确的CTA引导商务合作

### Requirement 6: 关于页面重构

**User Story**: 作为访客，我希望在关于页面全面了解品牌实力

#### Acceptance Criteria

1. THE /about 页面 SHALL 包含品牌故事、发展历程、制造实力、全国布局
2. THE /about 页面 SHALL 展示工厂照片和门店照片
3. THE /about 页面 SHALL 使用时间线展示发展历程
4. THE /about 页面 SHALL 突出"2006年起远销32国"、"5000㎡工厂"等关键数据
5. THE /about 页面 SHALL 采用左右分栏或卡片式布局

### Requirement 7: 社群页面增强

**User Story**: 作为访客，我希望在社群页面感受到活跃的骑行氛围

#### Acceptance Criteria

1. THE /community 页面 SHALL 展示大量真实骑行活动照片
2. THE /community 页面 SHALL 使用瀑布流或网格布局展示照片
3. THE /community 页面 SHALL 包含活动日历和报名入口
4. THE /community 页面 SHALL 展示社群数据：500+活动、10万+骑友
5. THE /community 页面 SHALL 有明确的"加入社群"CTA

### Requirement 8: E-BIKE页面优化

**User Story**: 作为访客，我希望E-BIKE页面突出产品科技感和轻奢感

#### Acceptance Criteria

1. THE /ebike 页面 SHALL 使用产品大图和3D展示效果
2. THE /ebike 页面 SHALL 突出"德国血统"、"智能系统"、"11.9kg轻量"
3. THE /ebike 页面 SHALL 展示雅迪和Gazelle合作背书
4. THE /ebike 页面 SHALL 包含产品参数、特性、购买/试骑CTA
5. THE /ebike 页面 SHALL 使用科技感的UI元素和动画

### Requirement 9: 响应式优化

**User Story**: 作为移动端用户，我希望获得流畅的浏览体验

#### Acceptance Criteria

1. THE 所有页面 SHALL 在移动端完美适配
2. THE 移动端 SHALL 优先显示核心内容
3. THE 移动端 SHALL 使用单列布局
4. THE 移动端 SHALL 优化图片加载速度
5. THE 移动端导航 SHALL 简洁易用

### Requirement 10: 性能优化

**User Story**: 作为访客，我希望网站加载快速流畅

#### Acceptance Criteria

1. THE 首页 SHALL 在3秒内完成首屏加载
2. THE 图片 SHALL 使用WebP格式和懒加载
3. THE 动画 SHALL 使用GPU加速
4. THE 字体 SHALL 使用系统字体或快速加载的Web字体
5. THE 代码 SHALL 进行压缩和优化

## 内容分配方案

### 首页 (/)
- Hero大图 + 品牌Slogan
- 品牌介绍（1-2句话）
- E-BIKE核心卖点（3个关键特性）
- 精选路线（3-4条）
- CTA：开始骑行

### E-BIKE页面 (/ebike)
- 产品Hero图
- 德国血统介绍
- 智能系统特性
- 产品参数
- 合作品牌背书
- 试骑/购买CTA

### 路线页面 (/routes)
- 保持现有设计
- 优化文案简洁度

### 在地好物 (/goods)
- 保持现有设计
- 优化产品展示

### 社群活动 (/community)
- 社群介绍
- 活动照片墙（大量真实照片）
- 活动日历
- 社群数据
- 加入社群CTA

### 合作伙伴 (/partners)
- 合作优势
- 雅迪合作详情
- Gazelle合作详情
- 11家景区合作展示
- 合作模式
- 商务合作CTA

### 关于我们 (/about)
- 品牌故事
- 发展历程时间线
- 制造实力（工厂照片）
- 全国布局（门店照片）
- 核心数据
- 加入我们CTA

## 文案风格指南

### 标题风格
❌ 与全球最大电动车品牌雅迪深度合作
✅ 雅迪 × 漫骑游

❌ 宁波宏途智能科技有限公司制造基地
✅ 智造基地

❌ 组织多样化骑游活动，从城市休闲骑行到山地挑战赛
✅ 500+ 场骑行活动

### 描述风格
❌ 漫骑游MRC，集租车、骑游团建、销售展厅、咖啡轻食为一体。聚焦文旅出行体验升级...
✅ 骑游生活，一站式体验

❌ 与全球最大电动车品牌雅迪、全球最大电动力自行车品牌Gazelle深度合作，打造德国血统E-BIKE
✅ 德国血统，智能骑行

### 数字展示
❌ 占地面积5,000平方米，拥有现代化生产车间
✅ 5000㎡ 智造工厂

❌ 累计组织骑游活动超过500场，服务骑友超过10万人次
✅ 500+ 活动 | 10万+ 骑友

## 视觉设计规范

### 布局原则
- 大版面：每屏一个主题
- 留白：文字占比≤30%
- 对齐：严格网格系统
- 层次：清晰的信息层级

### 色彩方案
- 主色：黑色 #000000
- 辅色：白色 #FFFFFF
- 灰色：#F5F5F5, #E0E0E0
- 品牌色：橙色 #FF6B35（点缀使用）

### 字体规范
- 中文标题：思源黑体 Bold
- 中文正文：思源黑体 Regular
- 英文/数字：DM Sans
- 标题大小：48px-96px
- 正文大小：16px-20px

### 图片使用
- 优先使用全屏大图
- 保持高质量和统一风格
- 使用渐变蒙版增强可读性
- 避免过多小图拼贴

### 动画效果
- 页面滚动：平滑过渡
- 元素进入：淡入+位移
- 悬停效果：缩放+阴影
- 避免：旋转、闪烁、弹跳

## 优先级

### P0 (必须完成)
- 首页精简化
- 内容重新分配
- 文案全面优化

### P1 (重要)
- 视觉风格升级
- 合作伙伴页面
- 关于页面重构

### P2 (可选)
- 社群页面增强
- E-BIKE页面优化
- 性能优化

## 成功标准

1. 首页加载时间 < 3秒
2. 首页文字总量减少50%
3. 视觉留白增加40%
4. 移动端完美适配
5. 用户停留时间增加30%
