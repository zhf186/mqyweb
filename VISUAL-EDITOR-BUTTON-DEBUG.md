# 可视化编辑按钮调试

## 问题
点击"可视化编辑"按钮没有反应

## 检查清单

### 1. 按钮代码检查
位置: `frontend/src/app/admin/content/page.tsx` 第172-183行

```typescript
<Button
  variant="outline"
  onClick={() => {
    // Navigate to visual editor
    if (selectedPage) {
      router.push(`/admin/visual-editor/${selectedPage.slug}`)
    }
  }}
  className="flex-1 sm:flex-none"
>
  <Eye className="h-4 w-4 mr-2" />
  可视化编辑
</Button>
```

**问题分析**:
- 按钮有条件检查 `if (selectedPage)`
- 如果 `selectedPage` 为 null，则不会执行跳转
- 需要检查 `selectedPage` 状态是否正确设置

### 2. 状态检查
- `selectedPageId`: 从下拉框选择的页面ID
- `selectedPage`: 完整的页面对象
- 这两个状态需要同步

### 3. 可能的原因

#### 原因1: selectedPage 未正确设置
在 `loadPageContent` 函数中（第75-88行）：
```typescript
const loadPageContent = async (pageId: string) => {
  try {
    setLoadingContent(true)
    const response = await contentApi.getPageContent(pageId)
    setSelectedPage(response.data.page)  // 这里设置 selectedPage
    setContentItems(response.data.content Items)
  } catch (error) {
    // ...
  }
}
```

**检查点**:
- API响应中是否包含 `page` 对象？
- `page` 对象是否包含 `slug` 属性？

#### 原因2: 按钮渲染条件
按钮只在以下条件下显示（第167行）：
```typescript
{selectedPageId && contentItems.length > 0 && (
  // 按钮组
)}
```

如果 `contentItems.length === 0`，按钮不会显示。

### 4. 调试步骤

1. **检查API响应**
   - 打开浏览器开发者工具
   - 切换到Network标签
   - 选择一个页面
   - 查看 `/api/admin/content/pages/{pageId}` 的响应
   - 确认响应包含 `page` 对象和 `slug` 属性

2. **检查控制台错误**
   - 打开浏览器控制台
   - 点击"可视化编辑"按钮
   - 查看是否有JavaScript错误

3. **添加调试日志**
   - 在按钮onClick中添加console.log
   - 检查 `selectedPage` 的值

### 5. 修复方案

#### 方案1: 添加调试日志
在按钮onClick中添加：
```typescript
onClick={() => {
  console.log('Button clicked')
  console.log('selectedPage:', selectedPage)
  console.log('selectedPage.slug:', selectedPage?.slug)
  
  if (selectedPage) {
    console.log('Navigating to:', `/admin/visual-editor/${selectedPage.slug}`)
    router.push(`/admin/visual-editor/${selectedPage.slug}`)
  } else {
    console.error('selectedPage is null')
  }
}}
```

#### 方案2: 使用selectedPageId作为后备
如果 `selectedPage` 不可用，可以使用 `selectedPageId`：
```typescript
onClick={() => {
  if (selectedPage) {
    router.push(`/admin/visual-editor/${selectedPage.slug}`)
  } else if (selectedPageId) {
    // 使用pageId作为slug的后备
    const page = pages.find(p => p.id === selectedPageId)
    if (page) {
      router.push(`/admin/visual-editor/${page.slug}`)
    }
  }
}}
```

#### 方案3: 确保selectedPage正确设置
检查API响应格式是否正确。

## 下一步
1. 添加调试日志到按钮onClick
2. 在浏览器中测试并查看控制台输出
3. 根据输出确定具体问题
4. 应用相应的修复方案
