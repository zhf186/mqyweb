# CMS品牌标题修复 - "德国血统 × 智能骑行"

## 问题描述

用户发现首页的"德国血统 × 智能骑行"文字（红圈标注）在CMS后台没有对应的可编辑字段，无法通过后台管理修改。

## 问题位置

**前端文件**: `frontend/src/app/page.tsx` (第115-145行)
**页面区域**: Brand Intro Section（品牌介绍区域）

## 根本原因

该文字在前端代码中是硬编码的，使用了条件渲染：

```tsx
{locale === 'zh' ? (
  <>
    <span>德国血统 ×</span>
    <span>智能骑行</span>
  </>
) : (
  <>
    <span>German Heritage ×</span>
    <span>Smart Cycling</span>
  </>
)}
```

这段代码没有使用 `getContent()` 函数从CMS获取内容，所以无法在后台管理中编辑。

## 解决方案

### 1. 添加CMS内容项

在数据库中添加两个新的内容字段：

| 键名 | 中文内容 | 英文内容 | 用途 |
|------|---------|---------|------|
| `home.brand.title.part1` | 德国血统 | German Heritage | 品牌标题第一部分 |
| `home.brand.title.part2` | 智能骑行 | Smart Cycling | 品牌标题第二部分 |

**执行的SQL命令**:
```sql
SET @home_page_id = (SELECT id FROM cms_pages WHERE slug = 'home' LIMIT 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) VALUES
(@home_page_id, 'home.brand.title.part1', 'text', '德国血统', 'German Heritage', 10, 1),
(@home_page_id, 'home.brand.title.part2', 'text', '智能骑行', 'Smart Cycling', 11, 1);
```

### 2. 更新前端代码

修改 `frontend/src/app/page.tsx`，将硬编码文字替换为CMS内容调用：

**修改前**:
```tsx
<h2 className="leading-tight flex items-baseline justify-end gap-3 sm:gap-4 md:gap-6">
  {locale === 'zh' ? (
    <>
      <span className="text-3xl font-bold text-white/70 sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap">
        德国血统 ×
      </span>
      <span className="text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl whitespace-nowrap">
        智能骑行
      </span>
    </>
  ) : (
    <>
      <span className="text-3xl font-bold text-white/70 sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap">
        German Heritage ×
      </span>
      <span className="text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl whitespace-nowrap">
        Smart Cycling
      </span>
    </>
  )}
</h2>
```

**修改后**:
```tsx
<h2 className="leading-tight flex items-baseline justify-end gap-3 sm:gap-4 md:gap-6">
  <span className="text-3xl font-bold text-white/70 sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap">
    {getContent(cmsContent, 'home.brand.title.part1', locale, locale === 'zh' ? '德国血统' : 'German Heritage')} ×
  </span>
  <span className="text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl whitespace-nowrap">
    {getContent(cmsContent, 'home.brand.title.part2', locale, locale === 'zh' ? '智能骑行' : 'Smart Cycling')}
  </span>
</h2>
```

## 测试验证

### 1. 验证API返回数据

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:8080/api/public/content/pages/home"
```

应该看到返回数据中包含：
```json
{
  "home.brand.title.part1.zh": "德国血统",
  "home.brand.title.part1.en": "German Heritage",
  "home.brand.title.part2.zh": "智能骑行",
  "home.brand.title.part2.en": "Smart Cycling"
}
```

### 2. 验证前端显示

1. 访问 http://localhost:3000
2. 强制刷新页面（Ctrl + Shift + R）
3. 滚动到品牌介绍区域
4. 查看"德国血统 × 智能骑行"文字是否正常显示

### 3. 测试CMS编辑功能

1. 登录CMS后台：http://localhost:3000/admin/login
   - 用户名: `admin`
   - 密码: `Admin@123`

2. 进入"内容管理"

3. 选择"首页 (Home)"页面

4. 找到以下字段：
   - **home.brand.title.part1** - 品牌标题第一部分
     - 中文：德国血统
     - 英文：German Heritage
   
   - **home.brand.title.part2** - 品牌标题第二部分
     - 中文：智能骑行
     - 英文：Smart Cycling

5. 修改任意字段（例如将"德国血统"改为"德国工艺"）

6. 点击"保存"

7. 刷新前端首页（Ctrl + Shift + R）

8. 查看修改是否生效

## 如何在CMS后台修改这些内容

### 登录CMS
- URL: http://localhost:3000/admin/login
- 用户名: `admin`
- 密码: `Admin@123`

### 编辑步骤

1. 点击左侧菜单"内容管理"
2. 选择页面"首页 (Home)"
3. 找到以下可编辑字段：

#### home.brand.title.part1 - 品牌标题第一部分
- **中文**: 德国血统
- **英文**: German Heritage
- **位置**: 首页品牌介绍区域，左侧较小的文字
- **样式**: 灰白色，较小字号

#### home.brand.title.part2 - 品牌标题第二部分
- **中文**: 智能骑行
- **英文**: Smart Cycling
- **位置**: 首页品牌介绍区域，右侧较大的文字
- **样式**: 纯白色，较大字号

4. 修改后点击"保存"
5. 刷新前端页面查看效果

## 技术说明

### getContent() 函数

```typescript
getContent(cmsContent, key, locale, fallback)
```

- `cmsContent`: 从API获取的CMS内容对象
- `key`: 内容键名（如 'home.brand.title.part1'）
- `locale`: 当前语言（'zh' 或 'en'）
- `fallback`: 如果CMS中没有内容时使用的默认值

### 数据流程

1. **页面加载**: `useEffect` 调用 `getPageContent('home')`
2. **API请求**: `GET /api/public/content/pages/home`
3. **数据返回**: 包含所有内容项的键值对
4. **内容渲染**: `getContent()` 根据语言和键名获取对应内容
5. **Fallback**: 如果CMS中没有该内容，使用fallback值

### 为什么分成两部分？

品牌标题"德国血统 × 智能骑行"分成两个字段的原因：

1. **样式差异**: 两部分有不同的字号和颜色
2. **灵活性**: 可以单独修改每一部分
3. **布局控制**: 保持响应式设计的灵活性

## 相关文件

- `frontend/src/app/page.tsx` - 首页组件
- `frontend/src/lib/api/public-content.ts` - CMS内容API
- `backend/manqiyou-app/src/main/java/com/manqiyou/app/cms/controller/PublicContentController.java` - 公共内容API控制器
- `CMS-CONTENT-KEYS-FIX.md` - 之前的内容键修复文档

## 注意事项

1. **强制刷新**: 修改后务必使用强制刷新（Ctrl + Shift + R）清除浏览器缓存

2. **中英文分别管理**: 每个字段都有中文和英文版本，需要分别编辑

3. **实时生效**: 保存后立即生效，无需重启服务

4. **版本控制**: 每次保存version自动+1，用于乐观锁

5. **Fallback机制**: 如果CMS内容加载失败，会自动使用fallback值，确保页面正常显示

## 问题排查

### 问题：修改后前端没有变化
**解决**：
1. 使用强制刷新（Ctrl + Shift + R）
2. 检查浏览器控制台是否有错误
3. 检查API是否返回了正确的数据

### 问题：显示为fallback值而不是CMS内容
**解决**：
1. 检查API返回的数据中是否包含对应的键
2. 检查field_key是否拼写正确
3. 检查数据库中content_zh和content_en是否有值

### 问题：中文显示乱码
**解决**：
1. 确保数据库使用utf8mb4编码
2. 检查API响应头Content-Type
3. 检查浏览器编码设置

## 总结

✅ 已完成：
1. 在数据库中添加了 `home.brand.title.part1` 和 `home.brand.title.part2` 两个内容项
2. 更新了前端代码，使用 `getContent()` 从CMS获取内容
3. 保留了fallback机制，确保内容加载失败时仍能正常显示
4. 支持中英文双语管理

现在你可以：
- ✅ 在CMS后台编辑"德国血统 × 智能骑行"文字
- ✅ 分别修改中文和英文版本
- ✅ 实时查看修改效果
- ✅ 保持页面样式和布局不变

---

**修复时间**: 2026-02-11
**状态**: ✅ 已完成
**相关任务**: TASK 6 - Fix Missing CMS Content for Brand Title
