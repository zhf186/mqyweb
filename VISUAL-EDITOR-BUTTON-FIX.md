# 可视化编辑按钮修复

## 修复内容

### 问题
点击"可视化编辑"按钮没有反应

### 根本原因
按钮的onClick处理器中只检查了 `selectedPage` 对象，但该对象可能未正确设置或为null。

### 修复方案
在 `frontend/src/app/admin/content/page.tsx` 中添加了：

1. **详细的调试日志** - 帮助诊断问题
2. **后备逻辑** - 如果 `selectedPage` 不可用，通过 `selectedPageId` 从 `pages` 数组中查找页面
3. **错误处理** - 记录所有可能的错误情况

### 修改的代码

```typescript
<Button
  variant="outline"
  onClick={() => {
    console.log('可视化编辑按钮被点击')
    console.log('selectedPage:', selectedPage)
    console.log('selectedPageId:', selectedPageId)
    console.log('pages:', pages)
    
    // Navigate to visual editor
    if (selectedPage && selectedPage.slug) {
      console.log('使用selectedPage.slug:', selectedPage.slug)
      router.push(`/admin/visual-editor/${selectedPage.slug}`)
    } else if (selectedPageId) {
      // Fallback: find page by ID
      const page = pages.find(p => p.id === selectedPageId)
      console.log('通过ID查找页面:', page)
      if (page && page.slug) {
        console.log('使用page.slug:', page.slug)
        router.push(`/admin/visual-editor/${page.slug}`)
      } else {
        console.error('未找到页面或页面缺少slug属性')
      }
    } else {
      console.error('selectedPage和selectedPageId都不可用')
    }
  }}
  className="flex-1 sm:flex-none"
>
  <Eye className="h-4 w-4 mr-2" />
  可视化编辑
</Button>
```

## 测试步骤

### 1. 刷新浏览器
由于修改了前端代码，Next.js会自动重新编译。等待编译完成。

### 2. 打开浏览器开发者工具
- 按 F12 打开开发者工具
- 切换到 "Console" (控制台) 标签

### 3. 测试按钮
1. 访问 http://localhost:3000/admin/content
2. 从下拉框选择一个页面（例如"首页"）
3. 点击"可视化编辑"按钮
4. 查看控制台输出

### 4. 预期结果

#### 成功情况
控制台应该显示：
```
可视化编辑按钮被点击
selectedPage: {id: "...", slug: "home", nameZh: "首页", ...}
selectedPageId: "..."
pages: [...]
使用selectedPage.slug: home
```
然后浏览器应该跳转到 `/admin/visual-editor/home`

#### 后备情况（如果selectedPage为null）
控制台应该显示：
```
可视化编辑按钮被点击
selectedPage: null
selectedPageId: "..."
pages: [...]
通过ID查找页面: {id: "...", slug: "home", nameZh: "首页", ...}
使用page.slug: home
```
然后浏览器应该跳转到 `/admin/visual-editor/home`

#### 错误情况
如果看到错误消息：
```
未找到页面或页面缺少slug属性
```
或
```
selectedPage和selectedPageId都不可用
```
这说明数据加载有问题，需要进一步调查API响应。

## 如果仍然不工作

### 检查API响应
1. 在开发者工具中切换到 "Network" (网络) 标签
2. 选择一个页面
3. 查找 `/api/admin/content/pages/{pageId}` 请求
4. 点击该请求，查看 "Response" (响应) 标签
5. 确认响应格式是否正确：
   ```json
   {
     "code": 200,
     "message": "success",
     "data": {
       "page": {
         "id": "...",
         "slug": "home",
         "nameZh": "首页",
         "nameEn": "Home",
         ...
       },
       "contentItems": [...]
     }
   }
   ```

### 检查页面数据
如果API响应正确但按钮仍不工作，检查 `pages` 数组：
1. 在控制台输入: `console.log(pages)`
2. 确认数组中的每个页面对象都有 `slug` 属性

## 后续步骤

修复完成后，可以：
1. 移除调试日志（如果不需要）
2. 继续测试可视化编辑器的其他功能
3. 按照 `VISUAL-EDITOR-MVP-MANUAL-TEST-GUIDE.md` 进行完整测试

## 文件修改
- ✅ `frontend/src/app/admin/content/page.tsx` - 添加调试日志和后备逻辑

## 状态
- 修复已应用
- 等待用户测试确认
