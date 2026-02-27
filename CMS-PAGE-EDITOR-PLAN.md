# CMS页面编辑器增强 - 实施计划

## 项目概述

将现有的CMS内容管理系统扩展为完整的页面编辑器，支持管理所有7个主要页面的文字和图片内容。

## 目标页面

1. ✅ **首页** (/) - 已完成文字内容，需补充图片
2. ⏳ **E-BIKE** (/ebike) - 待实现
3. ⏳ **骑游线路** (/routes) - 待实现
4. ⏳ **在地好物** (/goods) - 待实现
5. ⏳ **社群活动** (/community) - 待实现
6. ⏳ **合作伙伴** (/partners) - 待实现
7. ⏳ **关于我们** (/about) - 待实现

## 实施阶段

### 阶段1：基础设施完善（1-2天）

#### 1.1 数据库结构增强
- [ ] 在cms_content_items表中明确支持image类型
- [ ] 为image类型字段添加asset_id存储
- [ ] 创建所有7个页面的page记录
- [ ] 添加图片字段的验证规则

**SQL脚本**:
```sql
-- 创建所有页面记录
INSERT INTO cms_pages (slug, name_zh, name_en, description, is_active) VALUES
('home', '首页', 'Home', '网站首页', 1),
('ebike', 'E-BIKE', 'E-BIKE', 'E-BIKE产品介绍页', 1),
('routes', '骑游线路', 'Routes', '骑游线路列表页', 1),
('goods', '在地好物', 'Local Goods', '在地好物商城页', 1),
('community', '社群活动', 'Community', '社群活动页', 1),
('partners', '合作伙伴', 'Partners', '合作伙伴页', 1),
('about', '关于我们', 'About Us', '关于我们页', 1);
```

#### 1.2 API增强
- [ ] PublicContentController支持返回图片URL
- [ ] ContentController支持image类型更新
- [ ] 添加图片选择API端点

#### 1.3 前端工具函数
- [ ] 创建getImageUrl()辅助函数
- [ ] 增强getContent()支持图片类型
- [ ] 添加图片加载状态处理

### 阶段2：首页图片管理（1天）

#### 2.1 识别首页所有图片
- [ ] Hero背景图
- [ ] 品牌介绍背景图
- [ ] E-BIKE展示图
- [ ] 路线卡片图（4张）
- [ ] CTA背景图

#### 2.2 创建图片内容项
```sql
-- 首页图片内容项
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order) VALUES
(@home_id, 'hero.background', 'image', '1', '1', 100),
(@home_id, 'brand.background', 'image', '2', '2', 101),
(@home_id, 'ebike.image', 'image', '3', '3', 102),
-- ... 更多图片
```

#### 2.3 前端集成
- [ ] 更新page.tsx使用CMS图片
- [ ] 添加图片加载fallback
- [ ] 测试图片替换功能

### 阶段3：图片编辑器组件（2天）

#### 3.1 ImagePicker组件
```tsx
interface ImagePickerProps {
  value: string // asset_id
  onChange: (assetId: string) => void
  label: string
  altTextZh?: string
  altTextEn?: string
}
```

功能：
- [ ] 显示当前图片预览
- [ ] 打开资源库选择图片
- [ ] 支持上传新图片
- [ ] 编辑alt文本

#### 3.2 ContentEditor增强
- [ ] 检测field_type为image时渲染ImagePicker
- [ ] 保存时处理图片asset_id
- [ ] 显示图片尺寸信息

### 阶段4：E-BIKE页面CMS化（2天）

#### 4.1 分析E-BIKE页面内容
- [ ] 列出所有文字字段
- [ ] 列出所有图片字段
- [ ] 设计content_item结构

#### 4.2 创建内容项
- [ ] 编写SQL脚本
- [ ] 执行数据初始化
- [ ] 验证数据完整性

#### 4.3 前端集成
- [ ] 更新ebike/page.tsx
- [ ] 使用getPageContent()
- [ ] 使用getContent()和getImageUrl()
- [ ] 测试功能

### 阶段5：其他页面CMS化（3-4天）

按优先级依次实现：

#### 5.1 关于我们页面
- [ ] 内容分析
- [ ] 数据初始化
- [ ] 前端集成
- [ ] 测试

#### 5.2 合作伙伴页面
- [ ] 内容分析
- [ ] 数据初始化
- [ ] 前端集成
- [ ] 测试

#### 5.3 社群活动页面
- [ ] 内容分析
- [ ] 数据初始化
- [ ] 前端集成
- [ ] 测试

#### 5.4 骑游线路页面
- [ ] 内容分析
- [ ] 数据初始化
- [ ] 前端集成
- [ ] 测试

#### 5.5 在地好物页面
- [ ] 内容分析
- [ ] 数据初始化
- [ ] 前端集成
- [ ] 测试

### 阶段6：优化和完善（1-2天）

#### 6.1 性能优化
- [ ] 实现内容缓存
- [ ] 优化API调用
- [ ] 图片懒加载

#### 6.2 用户体验
- [ ] 添加加载状态
- [ ] 优化错误提示
- [ ] 改进编辑器界面

#### 6.3 文档和培训
- [ ] 编写使用文档
- [ ] 创建操作视频
- [ ] 准备培训材料

## 技术实现细节

### 图片内容项存储方案

**方案1：使用content_zh/content_en存储asset_id**
```sql
field_type = 'image'
content_zh = '123'  -- asset_id
content_en = '123'  -- 同一张图片
```

优点：
- 不需要修改表结构
- 支持中英文使用不同图片
- 与现有系统兼容

缺点：
- 语义不清晰（文本字段存数字）

**方案2：添加专门的image_asset_id字段**
```sql
ALTER TABLE cms_content_items ADD COLUMN image_asset_id_zh BIGINT;
ALTER TABLE cms_content_items ADD COLUMN image_asset_id_en BIGINT;
```

优点：
- 语义清晰
- 类型安全

缺点：
- 需要修改表结构
- 增加复杂度

**推荐：使用方案1**，简单且兼容现有系统。

### 前端图片渲染

```tsx
// 辅助函数
function getImageUrl(cmsContent: CMSContent, key: string, locale: string, fallback: string): string {
  const assetId = getContent(cmsContent, key, locale, '')
  if (!assetId) return fallback
  
  // 从assets API获取图片URL
  return `/api/public/assets/${assetId}/url`
}

// 使用示例
<Image
  src={getImageUrl(cmsContent, 'hero.background', locale, '/brand_assets/page1_img2.jpeg')}
  alt={getContent(cmsContent, 'hero.background.alt', locale, 'Hero background')}
  fill
/>
```

### API响应格式

```json
{
  "code": 200,
  "data": {
    "hero.title.zh": "漫骑游",
    "hero.title.en": "Manqiyou",
    "hero.background.zh": "123",  // asset_id
    "hero.background.en": "123",
    "hero.background.alt.zh": "首页背景图",
    "hero.background.alt.en": "Hero background"
  }
}
```

## 工作量估算

| 阶段 | 工作量 | 说明 |
|------|--------|------|
| 阶段1：基础设施 | 1-2天 | 数据库、API、工具函数 |
| 阶段2：首页图片 | 1天 | 首页图片管理 |
| 阶段3：图片编辑器 | 2天 | ImagePicker组件 |
| 阶段4：E-BIKE页面 | 2天 | 完整CMS化 |
| 阶段5：其他页面 | 3-4天 | 5个页面CMS化 |
| 阶段6：优化完善 | 1-2天 | 性能、体验、文档 |
| **总计** | **10-13天** | 约2周时间 |

## 里程碑

### 里程碑1：基础完成（第3天）
- ✅ 数据库结构完善
- ✅ API支持图片
- ✅ 首页图片管理
- ✅ 图片编辑器组件

### 里程碑2：核心页面完成（第7天）
- ✅ E-BIKE页面CMS化
- ✅ 关于我们页面CMS化
- ✅ 合作伙伴页面CMS化

### 里程碑3：全部完成（第13天）
- ✅ 所有7个页面CMS化
- ✅ 性能优化
- ✅ 文档完善

## 风险管理

### 风险1：图片引用复杂
**影响**: 高
**概率**: 中
**缓解措施**:
- 详细分析每个页面的图片使用
- 创建图片映射表
- 充分测试

### 风险2：前端性能下降
**影响**: 中
**概率**: 中
**缓解措施**:
- 实现内容缓存
- 使用React Query
- 图片懒加载

### 风险3：数据迁移出错
**影响**: 高
**概率**: 低
**缓解措施**:
- 在测试环境先执行
- 保留数据备份
- 可回滚的SQL脚本

## 下一步行动

### 立即开始（今天）
1. 创建所有页面的page记录
2. 分析首页所有图片位置
3. 创建首页图片内容项

### 本周完成
1. 实现ImagePicker组件
2. 完成首页图片管理
3. 开始E-BIKE页面分析

### 下周完成
1. 完成E-BIKE页面CMS化
2. 完成关于我们页面
3. 完成合作伙伴页面

## 需要的资源

### 开发资源
- 1名全栈开发工程师
- 约2周开发时间

### 设计资源
- UI设计师支持（图片编辑器界面）
- 约2天设计时间

### 测试资源
- QA测试工程师
- 约3天测试时间

## 成功标准

1. ✅ 所有7个页面在CMS后台可见并可编辑
2. ✅ 每个页面的文字和图片都可以管理
3. ✅ 修改后前端实时生效
4. ✅ 性能无明显下降（首屏加载<3秒）
5. ✅ 用户培训完成，可独立操作

---

**创建时间**: 2026-02-11
**预计完成**: 2026-02-25
**负责人**: 开发团队
