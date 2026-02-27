# CMS首页图片管理 - 测试指南

## 测试准备

### 确认服务运行
1. 前端：http://localhost:3000
2. 后端：http://localhost:8080
3. CMS后台：http://localhost:3000/admin/login

### 登录信息
- 用户名：`admin`
- 密码：`Admin@123`

## 测试步骤

### 测试1：查看首页图片显示

1. 打开浏览器访问：http://localhost:3000

2. 使用 **强制刷新** 清除缓存：
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. 检查以下图片是否正常显示：
   - ✅ Hero区域背景图（大图）
   - ✅ 品牌介绍区域背景图
   - ✅ 4张路线卡片图片
   - ✅ CTA区域背景图

### 测试2：在CMS后台查看内容

1. 访问：http://localhost:3000/admin/login

2. 登录后台（admin / Admin@123）

3. 点击左侧菜单"内容管理"

4. 选择"首页"

5. 查看以下内容项是否存在：
   ```
   hero.background.image
   brand.background.image
   routes.card1.image
   routes.card1.name
   routes.card1.distance
   routes.card2.image
   routes.card2.name
   routes.card2.distance
   routes.card3.image
   routes.card3.name
   routes.card3.distance
   routes.card4.image
   routes.card4.name
   routes.card4.distance
   cta.background.image
   ```

### 测试3：编辑图片路径

1. 在CMS后台"内容管理"页面

2. 找到 `hero.background.image` 字段

3. 点击"编辑"按钮

4. 修改图片路径（测试用）：
   - 原路径：`/brand_assets/page1_img2.jpeg`
   - 改为：`/brand_assets/page3_img4.jpeg`（使用另一张图片测试）

5. 点击"保存"

6. 回到首页：http://localhost:3000

7. 使用 **强制刷新**（Ctrl + Shift + R）

8. 检查Hero区域背景图是否已更换

9. 如果成功，再改回原路径：`/brand_assets/page1_img2.jpeg`

### 测试4：编辑路线卡片内容

1. 在CMS后台找到 `routes.card1.name` 字段

2. 点击"编辑"

3. 修改中文内容：
   - 原内容：`东钱湖环湖`
   - 改为：`测试路线名称`

4. 点击"保存"

5. 回到首页并强制刷新

6. 检查第一张路线卡片的名称是否已更新

7. 如果成功，改回原内容：`东钱湖环湖`

### 测试5：中英文切换

1. 在首页右上角切换语言（中文/English）

2. 检查路线卡片的名称是否正确切换：
   - 中文：东钱湖环湖、四明山挑战、海岸线骑行、古镇探索
   - English: Dongqian Lake Loop, Siming Mountain Challenge, Coastal Ride, Ancient Town Exploration

3. 检查所有图片是否正常显示（不受语言切换影响）

## 预期结果

### 成功标准
- ✅ 所有图片正常显示
- ✅ CMS后台可以看到所有内容项
- ✅ 可以编辑图片路径
- ✅ 可以编辑路线卡片文字
- ✅ 修改后前端实时生效（强制刷新后）
- ✅ 中英文切换正常
- ✅ 无控制台错误

### 如果遇到问题

#### 图片不显示
1. 检查图片路径是否正确
2. 检查图片文件是否存在于 `frontend/public/` 目录
3. 使用强制刷新清除缓存
4. 检查浏览器控制台是否有错误

#### 修改不生效
1. 确认已点击"保存"按钮
2. 使用强制刷新（Ctrl + Shift + R）
3. 检查后端是否正常运行
4. 检查数据库中的数据是否已更新

#### CMS后台看不到内容项
1. 确认已选择"首页"
2. 检查数据库中是否有数据：
   ```bash
   docker exec -i manqiyou-mysql mysql -umanqiyou -pmanqiyou123456 manqiyou -e "SELECT field_key, content_zh FROM cms_content_items WHERE page_id = 1 ORDER BY display_order;"
   ```

## 数据库查询命令

### 查看所有首页内容项
```bash
docker exec -i manqiyou-mysql mysql -umanqiyou -pmanqiyou123456 manqiyou -e "SELECT field_key, content_zh, content_en FROM cms_content_items WHERE page_id = 1 ORDER BY display_order;"
```

### 查看所有图片内容项
```bash
docker exec -i manqiyou-mysql mysql -umanqiyou -pmanqiyou123456 manqiyou -e "SELECT field_key, content_zh FROM cms_content_items WHERE page_id = 1 AND field_key LIKE '%image%' ORDER BY display_order;"
```

### 查看路线卡片内容项
```bash
docker exec -i manqiyou-mysql mysql -umanqiyou -pmanqiyou123456 manqiyou -e "SELECT field_key, content_zh, content_en FROM cms_content_items WHERE page_id = 1 AND field_key LIKE 'routes.card%' ORDER BY display_order;"
```

## 测试完成后

### 如果测试成功
1. 确认所有功能正常
2. 可以开始准备第二批实施（E-BIKE页面）
3. 记录任何需要改进的地方

### 如果发现问题
1. 记录问题详情
2. 截图或复制错误信息
3. 告知开发人员进行修复

---

**测试人员**: ___________
**测试日期**: 2026-02-11
**测试结果**: [ ] 通过 / [ ] 失败
**备注**: ___________
