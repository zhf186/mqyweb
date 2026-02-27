# 可视化编辑器 - 可编辑元素检测修复

**日期**: 2026-02-13  
**问题**: 点击"进入编辑模式"后提示"未检测到可编辑元素"

## 问题分析

### 根本原因
iframe 最初以 `editMode=false` 加载，导致前端页面的 postMessage 监听器没有被设置。

### 问题流程
1. 用户打开可视化编辑器
2. PreviewFrame 组件创建 iframe，URL 为：`/?editMode=false&locale=zh`
3. 前端页面（page.tsx）检查 `searchParams.get('editMode') === 'true'`
4. 因为 `editMode=false`，所以 `isEditMode` 为 `false`
5. postMessage 监听器没有被设置（第 30-96 行的 useEffect 不执行）
6. 用户点击"进入编辑模式"
7. VisualEditor 发送 `INIT_EDIT_MODE` 和 `REQUEST_EDITABLE_ELEMENTS` 消息
8. 但是 iframe 没有监听器，所以无法响应
9. 结果：检测到 0 个可编辑元素

## 解决方案

### 修改内容
修改 `frontend/src/components/admin/visual-editor/PreviewFrame.tsx` 第 206-208 行：

**修改前**:
```typescript
const pageRoute = getPageRoute(pageSlug)
const iframeUrl = `${pageRoute}?editMode=${editMode}&locale=${locale}`
```

**修改后**:
```typescript
const pageRoute = getPageRoute(pageSlug)
// Always load iframe with editMode=true so postMessage listener is set up
// The actual edit mode is controlled by messages from parent
const iframeUrl = `${pageRoute}?editMode=true&locale=${locale}`
```

### 原理
- iframe 始终以 `editMode=true` 加载
- 这样前端页面的 postMessage 监听器总是会被设置
- 实际的编辑模式状态由父窗口通过 postMessage 控制
- 这样就能正确响应 `REQUEST_EDITABLE_ELEMENTS` 消息

## 测试步骤

1. 刷新浏览器（清除缓存）
2. 访问：http://localhost:3000/admin/content
3. 选择"首页 (Home)"
4. 点击"可视化编辑"按钮
5. 点击"进入编辑模式"按钮
6. 应该看到提示："检测到 X 个可编辑元素"（X > 0）
7. 鼠标悬停在文字或图片上，应该看到蓝色边框

## 预期结果

### 成功标志
- ✅ 提示："检测到 X 个可编辑元素"（X 应该 > 20）
- ✅ 鼠标悬停时显示蓝色边框
- ✅ 点击元素打开编辑对话框
- ✅ 浏览器控制台显示：
  ```
  Edit mode initialized with locale: zh
  Received X editable elements
  ```

### 如果仍然失败
检查浏览器控制台是否有错误：
1. 按 F12 打开开发者工具
2. 切换到 Console 标签
3. 查看是否有红色错误信息
4. 检查 Network 标签，确认 iframe 加载成功

## 相关文件

- `frontend/src/components/admin/visual-editor/PreviewFrame.tsx` - iframe 组件
- `frontend/src/app/page.tsx` - 前端首页（包含 postMessage 监听器）
- `frontend/src/lib/visual-editor/editable-detector.ts` - 元素检测逻辑
- `frontend/src/components/admin/visual-editor/VisualEditor.tsx` - 主编辑器

## 技术细节

### postMessage 通信流程
1. **iframe 加载** → 发送 `IFRAME_LOADED` 消息
2. **用户点击"进入编辑模式"** → 父窗口发送 `INIT_EDIT_MODE`
3. **父窗口请求元素** → 发送 `REQUEST_EDITABLE_ELEMENTS`
4. **iframe 响应** → 发送 `EDITABLE_ELEMENTS_RESPONSE` 包含元素数组
5. **父窗口接收** → 显示提示并启用编辑功能

### 元素检测逻辑
`detectEditableElements()` 函数会：
1. 查找所有带 `data-editable` 属性的元素
2. 获取元素的位置、大小、类型
3. 生成唯一 ID
4. 返回元素信息数组

### 前端页面的 data-editable 属性
首页（page.tsx）中的可编辑元素示例：
```tsx
<h1 
  data-editable="common.brand"
  data-editable-type="text"
  data-editable-label="品牌名称"
>
  {getContent(cmsContent, 'common.brand', locale, dict.common.brand)}
</h1>
```

## 后续优化建议

### Phase 2 改进
1. 添加元素位置重新计算（滚动/调整大小时）
2. 优化 postMessage 通信性能
3. 添加元素检测失败的详细错误提示
4. 实现元素检测的重试机制

### 调试工具
可以在浏览器控制台运行以下命令来调试：
```javascript
// 检查 iframe 是否加载
document.querySelector('iframe')

// 检查 iframe 的 URL
document.querySelector('iframe').src

// 在 iframe 内部检查可编辑元素
document.querySelectorAll('[data-editable]').length
```

## 总结

这个修复确保了 iframe 始终以编辑模式加载，从而保证 postMessage 监听器被正确设置。这是一个简单但关键的修复，解决了可编辑元素检测失败的核心问题。

---

**修复时间**: 2026-02-13  
**修复人**: Kiro AI Assistant  
**状态**: ✅ 已修复，等待测试
