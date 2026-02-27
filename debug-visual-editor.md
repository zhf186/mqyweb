# 可视化编辑器调试指南

## 调试步骤

### 1. 打开浏览器开发者工具
按 `F12` 或 `Ctrl+Shift+I`

### 2. 检查 iframe 是否加载
在 Console 标签中运行：
```javascript
// 检查 iframe 是否存在
const iframe = document.querySelector('iframe')
console.log('Iframe found:', !!iframe)

// 检查 iframe 的 URL
if (iframe) {
  console.log('Iframe URL:', iframe.src)
}
```

### 3. 检查 iframe 内部的可编辑元素
在 Console 标签中运行：
```javascript
// 获取 iframe 的 document
const iframe = document.querySelector('iframe')
if (iframe && iframe.contentDocument) {
  const editableElements = iframe.contentDocument.querySelectorAll('[data-editable]')
  console.log('Editable elements in iframe:', editableElements.length)
  console.log('Elements:', editableElements)
} else {
  console.log('Cannot access iframe content (may be cross-origin)')
}
```

### 4. 检查 postMessage 监听器
在可视化编辑器页面的 Console 中运行：
```javascript
// 手动发送消息测试
const iframe = document.querySelector('iframe')
if (iframe && iframe.contentWindow) {
  iframe.contentWindow.postMessage({
    type: 'REQUEST_EDITABLE_ELEMENTS'
  }, window.location.origin)
  console.log('Message sent to iframe')
}
```

### 5. 在 iframe 内部检查
右键点击 iframe 内容 → 选择"检查元素" → 切换到 Console 标签

运行：
```javascript
// 检查 editMode 参数
const params = new URLSearchParams(window.location.search)
console.log('editMode:', params.get('editMode'))
console.log('locale:', params.get('locale'))

// 检查可编辑元素
const elements = document.querySelectorAll('[data-editable]')
console.log('Editable elements:', elements.length)

// 检查是否有 message 监听器
console.log('Message listeners:', window.getEventListeners ? window.getEventListeners(window) : 'Use Chrome DevTools')
```

### 6. 监听 postMessage 事件
在可视化编辑器页面的 Console 中运行：
```javascript
// 监听所有 postMessage 事件
window.addEventListener('message', (event) => {
  console.log('Received message:', event.data)
})
```

## 常见问题排查

### 问题 1: iframe URL 不正确
**检查**: iframe.src 应该是 `http://localhost:3000/?editMode=true&locale=zh`
**如果不是**: PreviewFrame 组件的 URL 构建有问题

### 问题 2: iframe 内部没有可编辑元素
**检查**: `iframe.contentDocument.querySelectorAll('[data-editable]').length`
**如果是 0**: page.tsx 没有正确添加 data-editable 属性

### 问题 3: postMessage 没有被接收
**检查**: 在 iframe 内部的 Console 中看是否有 "Edit mode initialized" 消息
**如果没有**: postMessage 监听器没有被设置

### 问题 4: 跨域问题
**检查**: Console 中是否有 CORS 错误
**解决**: 确保 iframe 和父页面在同一域名

## 预期的正常流程

1. **iframe 加载**
   - Console: "Edit mode initialized with locale: zh"
   
2. **点击"进入编辑模式"**
   - 父窗口发送: `{type: 'INIT_EDIT_MODE', payload: {locale: 'zh'}}`
   - 父窗口发送: `{type: 'REQUEST_EDITABLE_ELEMENTS'}`
   
3. **iframe 响应**
   - iframe 发送: `{type: 'EDITABLE_ELEMENTS_RESPONSE', payload: [...]}`
   - Console: "Received X editable elements"
   
4. **父窗口接收**
   - Console: "检测到 X 个可编辑元素"
   - Toast 提示显示

## 如果所有检查都通过但仍然失败

请提供以下信息：
1. 浏览器类型和版本
2. Console 中的所有消息（包括错误）
3. Network 标签中 iframe 的加载状态
4. 上述调试脚本的输出结果
