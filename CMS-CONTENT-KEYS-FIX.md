# CMS内容键修复 - 问题解决

## 问题描述

用户在CMS后台修改了内容，但前端页面刷新后没有变化。

## 根本原因

**内容键名不匹配**：
- 数据库中的键：`hero.title`, `hero.subtitle`, `hero.cta`
- 前端代码使用的键：`common.brand`, `common.slogan`, `home.brand.badge` 等

前端代码调用 `getContent(cmsContent, 'common.slogan', locale, fallback)` 时，在CMS数据库中找不到对应的键，所以一直使用fallback（i18n翻译文件）的内容。

## 解决方案

在数据库中添加前端代码需要的内容键。

### 已添加的内容键

| 键名 | 中文内容 | 英文内容 | 前端位置 |
|------|---------|---------|---------|
| `common.brand` | 漫骑游 | Manqiyou | 首页大标题 |
| `common.slogan` | 骑遇美好人生 | Ride into Beautiful Life | 首页副标题 |
| `home.brand.badge` | FUTURE LUXURY CYCLING | FUTURE LUXURY CYCLING | 品牌标签 |
| `home.brand.desc` | 高端跨界骑游生活平台 | Premium E-Bike Tourism Platform | 品牌描述 |
| `home.ebike.subtitle` | 途尔 E-BIKE | Tour E-BIKE | E-BIKE标题 |
| `home.routes.subtitle` | ROUTES | ROUTES | 线路副标题 |
| `home.routes.title` | 精选路线 | Featured Routes | 线路标题 |
| `home.cta.title` | 开启骑行之旅 | Start Your Journey | CTA标题 |
| `home.cta.desc` | 探索更多可能 | Explore More | CTA描述 |

### 执行的SQL命令

```sql
SET @home_page_id = (SELECT id FROM cms_pages WHERE slug = 'home');

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) VALUES
(@home_page_id, 'common.brand', 'text', '漫骑游', 'Manqiyou', 1, 1),
(@home_page_id, 'common.slogan', 'text', '骑遇美好人生', 'Ride into Beautiful Life', 2, 1),
(@home_page_id, 'home.brand.badge', 'text', 'FUTURE LUXURY CYCLING', 'FUTURE LUXURY CYCLING', 3, 1),
(@home_page_id, 'home.brand.desc', 'text', '高端跨界骑游生活平台', 'Premium E-Bike Tourism Platform', 4, 1),
(@home_page_id, 'home.ebike.subtitle', 'text', '途尔 E-BIKE', 'Tour E-BIKE', 5, 1),
(@home_page_id, 'home.routes.subtitle', 'text', 'ROUTES', 'ROUTES', 6, 1),
(@home_page_id, 'home.routes.title', 'text', '精选路线', 'Featured Routes', 7, 1),
(@home_page_id, 'home.cta.title', 'text', '开启骑行之旅', 'Start Your Journey', 8, 1),
(@home_page_id, 'home.cta.desc', 'text', '探索更多可能', 'Explore More', 9, 1);
```

## 测试验证

### 1. 验证API返回
```bash
curl http://localhost:8080/api/public/content/pages/home
```

应该看到返回数据中包含：
```json
{
  "code": 200,
  "data": {
    "common.brand.zh": "漫骑游",
    "common.brand.en": "Manqiyou",
    "common.slogan.zh": "骑遇美好人生",
    "common.slogan.en": "Ride into Beautiful Life",
    ...
  }
}
```

### 2. 验证前端显示
1. 访问 http://localhost:3000
2. 强制刷新页面（Ctrl + Shift + R）
3. 查看首页标题和口号是否显示为CMS中的内容

### 3. 测试修改功能
1. 登录CMS后台：http://localhost:3000/admin/login
2. 进入"内容管理"
3. 选择"首页 (Home)"页面
4. 找到 `common.slogan` 字段
5. 修改中文内容为其他文字（如"骑遇精彩人生"）
6. 点击"保存"
7. 刷新前端首页
8. 应该看到口号已更新

## 如何在CMS后台修改这些内容

### 步骤1：登录CMS
- URL: http://localhost:3000/admin/login
- 用户名: admin
- 密码: Admin@123

### 步骤2：进入内容管理
- 点击左侧菜单"内容管理"
- 选择页面"首页 (Home)"

### 步骤3：编辑内容
你会看到以下可编辑的字段：

1. **common.brand** - 品牌名称
   - 中文：漫骑游
   - 英文：Manqiyou
   - 位置：首页大标题

2. **common.slogan** - 品牌口号
   - 中文：骑遇美好人生
   - 英文：Ride into Beautiful Life
   - 位置：首页副标题

3. **home.brand.badge** - 品牌标签
   - 中文/英文：FUTURE LUXURY CYCLING
   - 位置：品牌介绍区域标签

4. **home.brand.desc** - 品牌描述
   - 中文：高端跨界骑游生活平台
   - 英文：Premium E-Bike Tourism Platform
   - 位置：品牌介绍区域描述

5. **home.ebike.subtitle** - E-BIKE副标题
   - 中文：途尔 E-BIKE
   - 英文：Tour E-BIKE
   - 位置：E-BIKE展示区域

6. **home.routes.subtitle** - 线路副标题
   - 中文/英文：ROUTES
   - 位置：线路展示区域小标题

7. **home.routes.title** - 线路标题
   - 中文：精选路线
   - 英文：Featured Routes
   - 位置：线路展示区域主标题

8. **home.cta.title** - CTA标题
   - 中文：开启骑行之旅
   - 英文：Start Your Journey
   - 位置：页面底部行动号召区域

9. **home.cta.desc** - CTA描述
   - 中文：探索更多可能
   - 英文：Explore More
   - 位置：页面底部行动号召描述

### 步骤4：保存并查看
- 修改任意字段后点击"保存"
- 打开前端页面 http://localhost:3000
- 强制刷新（Ctrl + Shift + R）
- 查看修改是否生效

## 注意事项

1. **强制刷新**：修改后一定要使用强制刷新（Ctrl + Shift + R），清除浏览器缓存

2. **版本号**：每次保存时version会自动+1，用于乐观锁控制

3. **中英文分别管理**：每个字段都有中文和英文两个版本，分别编辑

4. **实时生效**：保存后立即生效，无需重启服务

## 技术说明

### 前端代码
```typescript
// frontend/src/app/page.tsx
const [cmsContent, setCmsContent] = useState<CMSContent>({})

useEffect(() => {
  getPageContent('home').then((content) => {
    setCmsContent(content)
  })
}, [])

// 使用CMS内容，如果没有则使用fallback
{getContent(cmsContent, 'common.slogan', locale, dict.common.slogan)}
```

### API端点
```
GET /api/public/content/pages/home
```

返回格式：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "common.brand.zh": "漫骑游",
    "common.brand.en": "Manqiyou",
    "common.slogan.zh": "骑遇美好人生",
    "common.slogan.en": "Ride into Beautiful Life",
    ...
  }
}
```

### 数据库表结构
```sql
cms_content_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  page_id BIGINT,
  field_key VARCHAR(100),  -- 如 'common.slogan'
  field_type VARCHAR(20),  -- 'text', 'textarea', 'richtext'
  content_zh TEXT,         -- 中文内容
  content_en TEXT,         -- 英文内容
  display_order INT,
  version INT,             -- 乐观锁版本号
  ...
)
```

## 问题排查

### 问题：修改后前端没有变化
**解决**：
1. 检查是否使用了强制刷新（Ctrl + Shift + R）
2. 检查浏览器控制台是否有API错误
3. 检查API返回的数据是否包含修改的内容

### 问题：API返回空数据
**解决**：
1. 检查数据库中是否有对应的内容项
2. 检查field_key是否正确
3. 检查page_id是否正确关联到home页面

### 问题：显示乱码
**解决**：
1. 确保数据库使用utf8mb4编码
2. 确保API响应头包含正确的Content-Type
3. 检查浏览器是否正确识别UTF-8编码

## 总结

问题已解决！现在你可以：
1. ✅ 在CMS后台修改首页内容
2. ✅ 刷新前端页面看到更新
3. ✅ 支持中英文双语管理
4. ✅ 实时生效，无需重启

---

**修复时间**: 2026-02-11
**状态**: ✅ 已完成
