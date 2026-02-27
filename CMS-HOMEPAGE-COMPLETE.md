# CMS首页内容管理 - 完整配置

## 概述

本文档记录了首页所有可通过CMS后台管理的内容项。所有这些内容都可以在CMS后台的"内容管理"→"首页"中进行编辑。

## 已配置的内容项

### 1. 品牌信息区域

#### common.brand - 品牌名称
- **中文**: 漫骑游
- **英文**: Manqiyou
- **位置**: 首页顶部大标题
- **显示顺序**: 1

#### common.slogan - 品牌口号
- **中文**: 骑遇美好人生
- **英文**: Ride into Beautiful Life
- **位置**: 首页顶部副标题
- **显示顺序**: 2

### 2. 品牌介绍区域

#### home.brand.badge - 品牌标签
- **中文**: FUTURE LUXURY CYCLING
- **英文**: FUTURE LUXURY CYCLING
- **位置**: 品牌介绍区域小标签
- **显示顺序**: 3

#### home.brand.title.part1 - 品牌标题第一部分
- **中文**: 德国血统
- **英文**: German Heritage
- **位置**: 品牌介绍区域标题左侧
- **显示顺序**: 4

#### home.brand.title.part2 - 品牌标题第二部分
- **中文**: 智能骑行
- **英文**: Smart Cycling
- **位置**: 品牌介绍区域标题右侧
- **显示顺序**: 5

#### home.brand.desc - 品牌描述
- **中文**: 高端跨界骑游生活平台
- **英文**: Premium E-Bike Tourism Platform
- **位置**: 品牌介绍区域描述文字
- **显示顺序**: 6

### 3. E-BIKE展示区域

#### home.ebike.subtitle - E-BIKE副标题
- **中文**: 途尔 E-BIKE
- **英文**: Tour E-BIKE
- **位置**: E-BIKE展示区域标题
- **显示顺序**: 7

#### home.ebike.weight - E-BIKE重量
- **中文**: 11.9
- **英文**: 11.9
- **单位**: 公斤（kg）
- **位置**: E-BIKE展示区域第一个数据
- **显示顺序**: 8

#### home.ebike.range - 续航里程
- **中文**: 100
- **英文**: 100
- **单位**: 公里（km）
- **位置**: E-BIKE展示区域第二个数据
- **显示顺序**: 9

#### home.ebike.speed - 最高时速
- **中文**: 25
- **英文**: 25
- **单位**: 公里/小时（km/h）
- **位置**: E-BIKE展示区域第三个数据
- **显示顺序**: 10

### 4. 路线展示区域

#### home.routes.subtitle - 路线副标题
- **中文**: ROUTES
- **英文**: ROUTES
- **位置**: 路线展示区域小标题
- **显示顺序**: 11

#### home.routes.title - 路线标题
- **中文**: 精选路线
- **英文**: Featured Routes
- **位置**: 路线展示区域主标题
- **显示顺序**: 12

### 5. CTA行动号召区域

#### home.cta.title - CTA标题
- **中文**: 开启骑行之旅
- **英文**: Start Your Journey
- **位置**: 页面底部CTA区域标题
- **显示顺序**: 13

#### home.cta.desc - CTA描述
- **中文**: 探索更多可能
- **英文**: Explore More
- **位置**: 页面底部CTA区域描述
- **显示顺序**: 14

## 如何使用CMS后台管理

### 登录步骤

1. 访问: http://localhost:3000/admin/login
2. 用户名: `admin`
3. 密码: `Admin@123`

### 编辑内容

1. 点击左侧菜单"内容管理"
2. 在页面选择器中选择"首页 (Home)"
3. 找到要编辑的内容项
4. 点击"编辑"按钮
5. 在弹出的对话框中：
   - 切换"中文"/"English"标签页
   - 修改对应语言的内容
   - 点击"保存"
6. 刷新前端页面（Ctrl + Shift + R）查看效果

### 内容编辑提示

#### 文本类型字段
- 适用于短文本（如标题、标签）
- 建议长度：50字符以内
- 示例：品牌名称、标签文字

#### 数字类型字段
- 适用于E-BIKE数据
- 支持整数和小数
- 不要包含单位（单位由前端自动添加）
- 示例：11.9, 100, 25

#### 双语内容
- 每个字段都有中文和英文版本
- 需要分别编辑
- 确保两种语言的内容意思一致

## 数据库结构

### 表：cms_content_items

```sql
CREATE TABLE cms_content_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  page_id BIGINT NOT NULL,
  field_key VARCHAR(100) NOT NULL,
  field_type VARCHAR(20) NOT NULL,
  content_zh TEXT,
  content_en TEXT,
  max_length INT,
  is_required TINYINT(1) DEFAULT 0,
  display_order INT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES cms_pages(id)
);
```

### 查询所有首页内容

```sql
SELECT 
  field_key, 
  content_zh, 
  content_en, 
  display_order 
FROM cms_content_items 
WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'home')
ORDER BY display_order;
```

## API端点

### 公共API（前端使用）

**获取首页内容**:
```
GET /api/public/content/pages/home
```

**返回格式**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "common.brand.zh": "漫骑游",
    "common.brand.en": "Manqiyou",
    "common.slogan.zh": "骑遇美好人生",
    "common.slogan.en": "Ride into Beautiful Life",
    "home.brand.badge.zh": "FUTURE LUXURY CYCLING",
    "home.brand.badge.en": "FUTURE LUXURY CYCLING",
    "home.brand.title.part1.zh": "德国血统",
    "home.brand.title.part1.en": "German Heritage",
    "home.brand.title.part2.zh": "智能骑行",
    "home.brand.title.part2.en": "Smart Cycling",
    "home.brand.desc.zh": "高端跨界骑游生活平台",
    "home.brand.desc.en": "Premium E-Bike Tourism Platform",
    "home.ebike.subtitle.zh": "途尔 E-BIKE",
    "home.ebike.subtitle.en": "Tour E-BIKE",
    "home.ebike.weight.zh": "11.9",
    "home.ebike.weight.en": "11.9",
    "home.ebike.range.zh": "100",
    "home.ebike.range.en": "100",
    "home.ebike.speed.zh": "25",
    "home.ebike.speed.en": "25",
    "home.routes.subtitle.zh": "ROUTES",
    "home.routes.subtitle.en": "ROUTES",
    "home.routes.title.zh": "精选路线",
    "home.routes.title.en": "Featured Routes",
    "home.cta.title.zh": "开启骑行之旅",
    "home.cta.title.en": "Start Your Journey",
    "home.cta.desc.zh": "探索更多可能",
    "home.cta.desc.en": "Explore More"
  }
}
```

### 管理API（后台使用）

**获取页面内容**:
```
GET /api/admin/content/pages/1
Authorization: Bearer <token>
```

**更新内容项**:
```
PUT /api/admin/content/items/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "contentZh": "新的中文内容",
  "contentEn": "New English content",
  "version": 1,
  "changeSummary": "更新说明"
}
```

## 前端使用方式

### 获取CMS内容

```tsx
import { getPageContent, getContent } from '@/lib/api/public-content'

// 在组件中
const [cmsContent, setCmsContent] = useState<CMSContent>({})

useEffect(() => {
  getPageContent('home').then((content) => {
    setCmsContent(content)
  })
}, [])

// 使用内容
{getContent(cmsContent, 'common.brand', locale, '漫骑游')}
```

### getContent 函数说明

```typescript
getContent(
  cmsContent: CMSContent,  // CMS内容对象
  key: string,             // 内容键名
  locale: string,          // 当前语言 ('zh' 或 'en')
  fallback: string         // 默认值（CMS加载失败时使用）
): string
```

## 维护和更新

### 添加新内容项

1. **在数据库中添加**:
```sql
SET @home_page_id = (SELECT id FROM cms_pages WHERE slug = 'home' LIMIT 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'home.new.field', 'text', '中文内容', 'English content', 15, 1);
```

2. **在前端代码中使用**:
```tsx
{getContent(cmsContent, 'home.new.field', locale, '默认值')}
```

3. **测试**:
   - 刷新CMS后台，确认新字段出现
   - 编辑内容并保存
   - 刷新前端页面，确认显示正确

### 删除内容项

1. **从前端代码中移除使用**
2. **从数据库中删除**:
```sql
DELETE FROM cms_content_items WHERE field_key = 'home.old.field';
```

### 修改字段键名

1. **更新数据库**:
```sql
UPDATE cms_content_items 
SET field_key = 'home.new.key' 
WHERE field_key = 'home.old.key';
```

2. **更新前端代码**中所有使用该键的地方

## 故障排查

### 问题1：CMS后台看不到新添加的内容项

**可能原因**:
- 数据库中没有正确添加
- page_id不正确
- 前端缓存

**解决方法**:
1. 检查数据库：
```sql
SELECT * FROM cms_content_items WHERE field_key = 'your.field.key';
```
2. 清除浏览器缓存
3. 重新登录CMS后台

### 问题2：修改后前端没有变化

**可能原因**:
- 浏览器缓存
- API缓存
- 前端代码没有使用getContent()

**解决方法**:
1. 强制刷新（Ctrl + Shift + R）
2. 检查API返回：访问 http://localhost:8080/api/public/content/pages/home
3. 检查前端代码是否正确使用getContent()

### 问题3：保存时报错"版本冲突"

**原因**: 乐观锁机制，内容已被其他用户修改

**解决方法**:
1. 刷新页面重新加载最新内容
2. 重新编辑并保存

### 问题4：中文显示乱码

**原因**: 数据库编码问题

**解决方法**:
1. 确保数据库使用utf8mb4编码
2. 检查API响应头Content-Type
3. 重新插入数据

## 相关文档

- `CMS-CONTENT-KEYS-FIX.md` - 内容键修复文档
- `CMS-BRAND-TITLE-FIX.md` - 品牌标题修复文档
- `CMS-EBIKE-STATS-FIX.md` - E-BIKE数据修复文档
- `CMS-DYNAMIC-CONTENT-COMPLETE.md` - 动态内容实现文档
- `CONTENT-SAVE-FIX-COMPLETE.md` - 内容保存修复文档

## 总结

✅ 首页共有14个可编辑的内容项
✅ 涵盖品牌信息、介绍、E-BIKE数据、路线和CTA区域
✅ 支持中英文双语管理
✅ 实时生效，无需重启服务
✅ 完整的版本控制和历史记录

---

**最后更新**: 2026-02-11
**状态**: ✅ 完整配置
