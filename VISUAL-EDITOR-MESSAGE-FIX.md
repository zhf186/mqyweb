# 可视化编辑器 - PostMessage 通信修复

**日期**: 2026-02-13  
**问题**: iframe 不响应 REQUEST_EDITABLE_ELEMENTS 消息

## 问题根源

### 发现的问题
IframeBridge 和 iframe 之间的消息类型不匹配：
- **IframeBridge 期望**: `IFRAME_READY` 消息来标记 iframe 准备就绪
- **iframe 实际发送**: `IFRAME_LOADED` 消息

### 问题流程
1. iframe 加载完成，设置 postMessage 监听器
2. iframe 发送 `IFRAME_LOADED` 消息给父窗口
3. IframeBridge 接收到 `IFRAME_LOADED`，但它在等待 `IFRAME_READY`
4. IframeBridge 的 `isReady` 标志保持为 `false`
5. 用户点击"进入编辑模式"
6. VisualEditor 调用 `previewFrameRef.current?.sendMessage()`
7. IframeBridge 检查 `isReady`，发现是 `false`
8. 所有消息被放入队列，但从未发送
9. iframe 从未收到 `REQUEST_EDITABLE_ELEMENTS` 消息
10. 结果：检测到 0 个可编辑元素

## 解决方案

### 修改 1: 发送正确的消息类型
**文件**: `frontend/src/app/page.tsx`

修改 iframe 发送 `IFRAME_READY` 消息：

```typescript
// 通知父窗口页面已加载并准备接收消息
window.parent.postMessage({
  type: 'IFRAME_READY'
}, window.location.origin)

// Also send IFRAME_LOADED for backward compatibility
window.parent.postMessage({
  type: 'IFRAME_LOADED'
}, window.location.origin)
```

### 修改 2: 添加调试日志
在以下文件中添加了详细的 console.log：

1. **frontend/src/app/page.tsx**
   - 监听器注册确认
   - 接收到的消息
   - 检测到的元素数量
   - 发送的响应

2. **frontend/src/components/admin/visual-editor/VisualEditor.tsx**
   - 发送的消息类型

3. **frontend/src/lib/visual-editor/iframe-bridge.ts**
   - 接收到 IFRAME_READY
   - 消息队列状态
   - 发送的消息
   - 队列刷新

## 测试步骤

### 1. 刷新前端
确保前端重新编译并加载新代码：
```bash
# 如果前端正在运行，它应该自动重新编译
# 如果没有，重启前端：
cd frontend
npm run dev
```

### 2. 清除浏览器缓存
- 按 `Ctrl+Shift+Delete`
- 选择"缓存的图片和文件"
- 点击"清除数据"
- 或者使用硬刷新：`Ctrl+F5`

### 3. 打开开发者工具
按 `F12` 打开 Console 标签

### 4. 测试流程
1. 访问：http://localhost:3000/admin/content
2. 选择"首页 (Home)"
3. 点击"可视化编辑"按钮
4. 观察 Console 输出，应该看到：
   ```
   [page.tsx] Edit mode enabled, setting up message listener
   [page.tsx] Message listener registered
   [page.tsx] Sent IFRAME_READY to parent
   [page.tsx] Sent IFRAME_LOADED to parent
   [IframeBridge] Received IFRAME_READY, marking bridge as ready
   ```

5. 点击"进入编辑模式"按钮
6. 观察 Console 输出，应该看到：
   ```
   [VisualEditor] Sending INIT_EDIT_MODE message
   [IframeBridge] Message sent: INIT_EDIT_MODE
   [page.tsx] Received message: {type: 'INIT_EDIT_MODE', payload: {locale: 'zh'}}
   [VisualEditor] Sending REQUEST_EDITABLE_ELEMENTS message
   [IframeBridge] Message sent: REQUEST_EDITABLE_ELEMENTS
   [page.tsx] Received message: {type: 'REQUEST_EDITABLE_ELEMENTS'}
   [page.tsx] Detecting editable elements...
   [page.tsx] Found XX editable elements
   [page.tsx] Sent EDITABLE_ELEMENTS_RESPONSE to parent
   ```

7. 应该看到 Toast 提示："检测到 XX 个可编辑元素"

## 预期结果

### 成功标志
- ✅ Console 显示完整的消息流
- ✅ Toast 提示："检测到 XX 个可编辑元素"（XX > 20）
- ✅ 鼠标悬停时显示蓝色边框
- ✅ 点击元素打开编辑对话框

### 如果仍然失败

#### 检查 1: IframeBridge 是否收到 IFRAME_READY
在 Console 中搜索：`IFRAME_READY`
- 如果没有：iframe 没有发送消息（检查 page.tsx 是否正确加载）
- 如果有：继续下一步

#### 检查 2: 消息是否被队列化
在 Console 中搜索：`Message queued`
- 如果看到：IframeBridge 仍然认为 iframe 未准备好
- 检查 `isReady` 标志是否被正确设置

#### 检查 3: iframe 是否收到消息
在 Console 中搜索：`[page.tsx] Received message`
- 如果没有：消息没有到达 iframe
- 检查 postMessage 的 origin 是否正确

#### 检查 4: 元素检测是否工作
在 Console 中搜索：`Found XX editable elements`
- 如果是 0：page.tsx 中的 data-editable 属性可能丢失
- 运行：`document.querySelectorAll('[data-editable]').length`

## 技术细节

### IframeBridge 消息队列机制
```typescript
// 当 iframe 未准备好时，消息被队列化
if (!this.isReady) {
  this.messageQueue.push(message)
  return
}

// 当收到 IFRAME_READY 时，刷新队列
if (message.type === 'IFRAME_READY') {
  this.isReady = true
  this.flushMessageQueue()  // 发送所有队列中的消息
}
```

### 消息流程图
```
Parent Window (VisualEditor)
    |
    | 1. Create iframe
    v
IframeBridge
    |
    | 2. Wait for IFRAME_READY
    v
Iframe (page.tsx)
    |
    | 3. Setup listener
    | 4. Send IFRAME_READY
    v
IframeBridge
    |
    | 5. Mark as ready
    | 6. Flush queued messages
    v
Iframe (page.tsx)
    |
    | 7. Receive REQUEST_EDITABLE_ELEMENTS
    | 8. Detect elements
    | 9. Send EDITABLE_ELEMENTS_RESPONSE
    v
VisualEditor
    |
    | 10. Display elements
    v
User can edit!
```

## 相关文件

- `frontend/src/app/page.tsx` - iframe 页面，发送 IFRAME_READY
- `frontend/src/lib/visual-editor/iframe-bridge.ts` - 消息桥接，等待 IFRAME_READY
- `frontend/src/components/admin/visual-editor/VisualEditor.tsx` - 主编辑器
- `frontend/src/components/admin/visual-editor/PreviewFrame.tsx` - iframe 容器

## 后续优化

### Phase 2 改进
1. 添加超时机制：如果 IFRAME_READY 在 5 秒内未收到，显示错误
2. 添加重试机制：自动重试消息发送
3. 添加健康检查：定期 ping iframe 确保连接正常
4. 改进错误提示：更详细的错误信息和恢复建议

## 总结

这个修复解决了 IframeBridge 和 iframe 之间的消息类型不匹配问题。通过发送正确的 `IFRAME_READY` 消息，IframeBridge 现在能够正确地标记 iframe 为准备就绪，并刷新消息队列，使得所有后续的 postMessage 通信都能正常工作。

添加的调试日志将帮助我们快速诊断任何未来的通信问题。

---

**修复时间**: 2026-02-13  
**修复人**: Kiro AI Assistant  
**状态**: ✅ 已修复，等待测试
