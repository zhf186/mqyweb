# CMS E-BIKE数据修复 - "11.9公斤、100km、25km/h"

## 问题描述

用户发现首页E-BIKE展示区域的三个关键数据（11.9公斤、100km、25km/h）在CMS后台管理的内容管理页面没有对应的可编辑字段。

## 问题位置

**前端文件**: `frontend/src/app/page.tsx` (第150-180行左右)
**页面区域**: E-BIKE Highlight Section（E-BIKE亮点展示区域）

## 根本原因

这三个数据在前端代码中是硬编码的数字：

```tsx
<span className="text-7xl font-light sm:text-8xl md:text-9xl">11.9</span>
<span className="text-7xl font-light sm:text-8xl md:text-9xl">100</span>
<span className="text-7xl font-light sm:text-8xl md:text-9xl">25</span>
```

这些数字没有使用 `getContent()` 函数从CMS获取，所以无法在后台管理中编辑。

## 解决方案

### 1. 添加CMS内容项

在数据库中添加三个新的内容字段：

| 键名 | 中文内容 | 英文内容 | 用途 |
|------|---------|---------|------|
| `home.ebike.weight` | 11.9 | 11.9 | E-BIKE重量（公斤） |
| `home.ebike.range` | 100 | 100 | 续航里程（公里） |
| `home.ebike.speed` | 25 | 25 | 最高时速（公里/小时） |

**执行的SQL命令**:
```sql
SET @home_page_id = (SELECT id FROM cms_pages WHERE slug = 'home' LIMIT 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) VALUES
(@home_page_id, 'home.ebike.weight', 'text', '11.9', '11.9', 20, 1),
(@home_page_id, 'home.ebike.range', 'text', '100', '100', 21, 1),
(@home_page_id, 'home.ebike.speed', 'text', '25', '25', 22, 1);
```

### 2. 更新前端代码

修改 `frontend/src/app/page.tsx`，将硬编码数字替换为CMS内容调用：

**修改前**:
```tsx
<div className="text-center">
  <div className="flex items-baseline justify-center gap-1.5 sm:gap-2">
    <span className="text-7xl font-light sm:text-8xl md:text-9xl">11.9</span>
    <span className="text-xl text-white/50 sm:text-2xl">{dict.units.kg}</span>
  </div>
  <p className="mt-4 text-base text-white/60 sm:mt-6 sm:text-lg">{dict.home.statsWeight}</p>
</div>
```

**修改后**:
```tsx
<div className="text-center">
  <div className="flex items-baseline justify-center gap-1.5 sm:gap-2">
    <span className="text-7xl font-light sm:text-8xl md:text-9xl">
      {getContent(cmsContent, 'home.ebike.weight', locale, '11.9')}
    </span>
    <span className="text-xl text-white/50 sm:text-2xl">{dict.units.kg}</span>
  </div>
  <p className="mt-4 text-base text-white/60 sm:mt-6 sm:text-lg">{dict.home.statsWeight}</p>
</div>
```

同样的修改应用到另外两个数据（100km和25km/h）。

## 测试验证

### 1. 验证数据库

```bash
docker exec -i manqiyou-mysql mysql -umanqiyou -pmanqiyou123456 manqiyou -e "SELECT field_key, content_zh, content_en FROM cms_content_items WHERE field_key LIKE 'home.ebike.%' ORDER BY display_order;"
```

应该看到：
```
field_key           | content_zh    | content_en
home.ebike.subtitle | 途尔 E-BIKE   | Tour E-BIKE
home.ebike.weight   | 11.9          | 11.9
home.ebike.range    | 100           | 100
home.ebike.speed    | 25            | 25
```

### 2. 验证前端显示

1. 访问 http://localhost:3000
2. 强制刷新页面（Ctrl + Shift + R）
3. 滚动到E-BIKE展示区域
4. 查看三个数据是否正常显示

### 3. 测试CMS编辑功能

1. 登录CMS后台：http://localhost:3000/admin/login
   - 用户名: `admin`
   - 密码: `Admin@123`

2. 进入"内容管理"

3. 选择"首页 (Home)"页面

4. 找到以下字段：
   - **home.ebike.weight** - E-BIKE重量
     - 中文：11.9
     - 英文：11.9
     - 说明：显示为"11.9 公斤"
   
   - **home.ebike.range** - 续航里程
     - 中文：100
     - 英文：100
     - 说明：显示为"100 km"
   
   - **home.ebike.speed** - 最高时速
     - 中文：25
     - 英文：25
     - 说明：显示为"25 km/h"

5. 修改任意字段（例如将重量改为"12.5"）

6. 点击"保存"

7. 刷新前端首页（Ctrl + Shift + R）

8. 查看修改是否生效

## 如何在CMS后台修改这些数据

### 登录CMS
- URL: http://localhost:3000/admin/login
- 用户名: `admin`
- 密码: `Admin@123`

### 编辑步骤

1. 点击左侧菜单"内容管理"
2. 选择页面"首页 (Home)"
3. 找到以下可编辑字段：

#### home.ebike.weight - E-BIKE重量
- **当前值**: 11.9
- **单位**: 公斤（kg）
- **位置**: 首页E-BIKE展示区域，第一个数据
- **说明**: 显示E-BIKE的重量，单位会自动添加

#### home.ebike.range - 续航里程
- **当前值**: 100
- **单位**: 公里（km）
- **位置**: 首页E-BIKE展示区域，第二个数据
- **说明**: 显示E-BIKE的续航里程

#### home.ebike.speed - 最高时速
- **当前值**: 25
- **单位**: 公里/小时（km/h）
- **位置**: 首页E-BIKE展示区域，第三个数据
- **说明**: 显示E-BIKE的最高时速

4. 修改后点击"保存"
5. 刷新前端页面查看效果

## 数据格式说明

### 支持的格式

这些字段支持以下格式：
- **整数**: 100, 25
- **小数**: 11.9, 12.5
- **带单位**: 系统会自动添加单位，无需在内容中包含

### 建议值范围

- **重量**: 10-15公斤（合理的E-BIKE重量范围）
- **续航**: 50-150公里（常见的E-BIKE续航范围）
- **速度**: 20-30公里/小时（符合法规的电动自行车速度）

## 技术说明

### 为什么使用文本类型存储数字？

虽然这些是数字数据，但我们使用 `field_type='text'` 的原因：

1. **灵活性**: 可以输入小数（如11.9）
2. **简单性**: 不需要复杂的数字验证
3. **显示控制**: 前端可以完全控制格式化和显示
4. **国际化**: 不同地区可能有不同的数字格式偏好

### 数据流程

1. **CMS编辑**: 用户在后台输入数字（如"11.9"）
2. **数据存储**: 存储为文本到 `content_zh` 和 `content_en`
3. **API返回**: 通过 `/api/public/content/pages/home` 返回
4. **前端显示**: 使用 `getContent()` 获取并显示
5. **单位添加**: 前端代码自动添加单位（kg, km, km/h）

### 中英文内容

由于这些是纯数字，中英文内容是相同的：
- `content_zh`: "11.9"
- `content_en`: "11.9"

如果将来需要不同的数字格式（如英文使用英制单位），可以分别设置不同的值。

## 相关文件

- `frontend/src/app/page.tsx` - 首页组件
- `frontend/src/lib/api/public-content.ts` - CMS内容API
- `backend/manqiyou-app/src/main/java/com/manqiyou/app/cms/controller/PublicContentController.java` - 公共内容API控制器
- `CMS-BRAND-TITLE-FIX.md` - 品牌标题修复文档
- `CMS-CONTENT-KEYS-FIX.md` - 内容键修复文档

## 注意事项

1. **数字格式**: 输入时只需要数字，不要包含单位
2. **小数点**: 使用英文句点（.）作为小数点
3. **强制刷新**: 修改后务必使用强制刷新（Ctrl + Shift + R）
4. **合理范围**: 建议输入符合实际的数值
5. **实时生效**: 保存后立即生效，无需重启服务

## 问题排查

### 问题：修改后前端没有变化
**解决**：
1. 使用强制刷新（Ctrl + Shift + R）
2. 检查浏览器控制台是否有错误
3. 检查API返回的数据

### 问题：显示为NaN或undefined
**解决**：
1. 确保输入的是有效数字
2. 检查数据库中的值是否正确
3. 检查前端代码是否正确使用getContent()

### 问题：单位显示不正确
**解决**：
1. 单位是在前端代码中硬编码的
2. 不要在CMS内容中包含单位
3. 如需修改单位，需要修改前端代码

## 扩展功能建议

### 未来可以添加的字段

1. **home.ebike.battery** - 电池容量（如"500Wh"）
2. **home.ebike.motor** - 电机功率（如"250W"）
3. **home.ebike.charging** - 充电时间（如"3小时"）
4. **home.ebike.warranty** - 保修期限（如"2年"）

### 添加方法

```sql
SET @home_page_id = (SELECT id FROM cms_pages WHERE slug = 'home' LIMIT 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) VALUES
(@home_page_id, 'home.ebike.battery', 'text', '500Wh', '500Wh', 23, 1),
(@home_page_id, 'home.ebike.motor', 'text', '250W', '250W', 24, 1);
```

然后在前端代码中添加相应的显示逻辑。

## 总结

✅ 已完成：
1. 在数据库中添加了 `home.ebike.weight`、`home.ebike.range`、`home.ebike.speed` 三个内容项
2. 更新了前端代码，使用 `getContent()` 从CMS获取数据
3. 保留了fallback机制，确保数据加载失败时仍能正常显示
4. 支持中英文双语管理（虽然当前值相同）

现在你可以：
- ✅ 在CMS后台编辑E-BIKE的重量、续航和速度数据
- ✅ 实时查看修改效果
- ✅ 保持页面样式和布局不变
- ✅ 灵活调整数据以适应不同的E-BIKE型号

---

**修复时间**: 2026-02-11
**状态**: ✅ 已完成
**相关任务**: 添加E-BIKE数据到CMS管理
