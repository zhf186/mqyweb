# E-BIKE和社区页面图片数量修复

## 问题描述

后台管理的图片管理系统中，E-BIKE页面和社区页面显示的图片数量与实际页面使用的图片不匹配。

### 问题原因

数据库中存储的图片路径是通用占位符路径（如 `/brand_assets/page9_img1.jpeg`），而前端代码实际使用的是特定路径（如 `/brand_assets/ebike/page11_img1.jpeg` 和 `/brand_assets/community/page14_img1.jpeg`）。

## 修复方案

### 1. E-BIKE页面图片修复

**实际使用的图片（9张）：**

| 序号 | 用途 | 实际路径 | 字段键 |
|------|------|----------|--------|
| 1 | Hero背景图 | `/brand_assets/ebike/page11_img1.jpeg` | `ebike.hero.background` |
| 2 | 设计区域背景 | `/brand_assets/ebike/page10_img2.jpeg` | `ebikePage.design.background` |
| 3 | 画廊图片1 | `/brand_assets/ebike/page10_img1.jpeg` | `ebike.gallery.image1` |
| 4 | 画廊图片2 | `/brand_assets/ebike/page10_img2.jpeg` | `ebike.gallery.image2` |
| 5 | 画廊图片3 | `/brand_assets/ebike/page10_img6.jpeg` | `ebike.gallery.image3` |
| 6 | 画廊图片4 | `/brand_assets/ebike/page10_img5.jpeg` | `ebike.gallery.image4` |
| 7 | 碳纤维背景 | `/brand_assets/ebike/page10_img3.jpeg` | `ebike.carbon.background` |
| 8 | Tour 1S型号 | `/brand_assets/ebike/page10_img2.jpeg` | `ebike.models.tour1s.image` |
| 9 | Tour 1型号 | `/brand_assets/ebike/page10_img6.jpeg` | `ebike.models.tour1.image` |

### 2. 社区页面图片修复

**实际使用的图片（20张）：**

| 序号 | 用途 | 实际路径 | 字段键 |
|------|------|----------|--------|
| 1 | Hero背景图 | `/brand_assets/page19_img3.jpeg` | `community.hero.background` |
| 2 | 活动图片1 | `/brand_assets/page19_img4.jpeg` | `community.activity1.image` |
| 3 | 活动图片2 | `/brand_assets/page19_img4.jpeg` | `community.activity2.image` |
| 4 | 活动图片3 | `/brand_assets/page19_img6.jpeg` | `community.activity3.image` |
| 5-13 | 画廊图片1-9 | `/brand_assets/community/page14_img1-9.jpeg` | `community.gallery.image1-9` |
| 14 | 画廊图片10 | `/brand_assets/page19_img5.jpeg` | `community.gallery.image10` |
| 15 | 画廊图片11 | `/brand_assets/page19_img3.jpeg` | `community.gallery.image11` |
| 16 | 画廊图片12 | `/brand_assets/page5_img3.jpeg` | `community.gallery.image12` |
| 17 | 画廊图片13 | `/brand_assets/page6_img1.jpeg` | `community.gallery.image13` |
| 18 | 画廊图片14 | `/brand_assets/page6_img5.jpeg` | `community.gallery.image14` |
| 19 | 画廊图片15 | `/brand_assets/page19_img1.jpeg` | `community.gallery.image15` |
| 20 | 画廊图片16 | `/brand_assets/page19_img2.jpeg` | `community.gallery.image16` |

## 执行修复

### 方法1：使用批处理文件（推荐）

```bash
cd backend/manqiyou-app
run-fix-images.bat
```

### 方法2：手动执行SQL

```bash
cd backend/manqiyou-app
mysql -h localhost -u root -p123456 manqiyou < fix-ebike-community-images.sql
```

## 验证修复

### 1. 检查数据库

```sql
-- 检查E-BIKE页面图片数量
SELECT COUNT(*) FROM cms_content_items 
WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'ebike') 
AND field_key LIKE '%.image';
-- 应该返回: 9

-- 检查社区页面图片数量
SELECT COUNT(*) FROM cms_content_items 
WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'community') 
AND field_key LIKE '%.image';
-- 应该返回: 20
```

### 2. 检查后台管理界面

1. 登录后台管理系统：http://localhost:3000/admin/login
2. 进入"图片管理"页面
3. 筛选"E-BIKE页面"，应该显示 9 张图片
4. 筛选"社区活动"，应该显示 20 张图片

### 3. 检查前端页面

1. 访问 E-BIKE 页面：http://localhost:3000/ebike
2. 访问社区页面：http://localhost:3000/community
3. 确认所有图片正常显示

## 修复前后对比

| 页面 | 修复前（数据库） | 修复后（数据库） | 实际前端使用 |
|------|-----------------|-----------------|-------------|
| E-BIKE | 15张（错误路径） | 9张（正确路径） | 9张 ✓ |
| 社区 | 14张（错误路径） | 20张（正确路径） | 20张 ✓ |

## 技术细节

### SQL脚本功能

1. **删除旧数据**：清除E-BIKE和社区页面的所有旧图片记录
2. **插入新数据**：添加与前端代码完全匹配的图片路径
3. **验证结果**：显示修复后的图片数量统计

### 字段键命名规范

- E-BIKE页面：`ebike.*` 或 `ebikePage.*`
- 社区页面：`community.*` 或 `communityPage.*`
- 图片类型：`*.image` 或 `*.background`

## 相关文件

- **SQL修复脚本**：`backend/manqiyou-app/fix-ebike-community-images.sql`
- **批处理文件**：`backend/manqiyou-app/run-fix-images.bat`
- **前端页面**：
  - `frontend/src/app/ebike/page.tsx`
  - `frontend/src/app/community/page.tsx`

## 注意事项

1. 执行SQL脚本前请确保MySQL服务正在运行
2. 确认数据库连接信息正确（主机、用户名、密码）
3. 建议先在测试环境执行，验证无误后再在生产环境执行
4. 执行后需要刷新后台管理页面才能看到更新

## 后续维护

如果需要添加新图片到这两个页面：

1. 在前端代码中添加图片引用
2. 更新SQL脚本添加对应的数据库记录
3. 确保字段键（field_key）与前端的 `data-editable` 属性匹配

## 完成状态

- [x] 分析前端代码，提取实际使用的图片路径
- [x] 创建SQL修复脚本
- [x] 创建批处理执行文件
- [x] 编写修复文档
- [ ] 执行SQL脚本（待用户执行）
- [ ] 验证修复结果（待用户验证）
