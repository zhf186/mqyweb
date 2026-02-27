# 可视化编辑器 - IframeBridge 重复创建修复

**日期**: 2026-02-13  
**问题**: IframeBridge 被反复创建和销毁，导致消息无法发送

## 问题根源

### 发现的问题
PreviewFrame 组件的 `useEffect` 依赖数组包含 `onMessage`，导致每次父组件重新渲染时都会重新创建 IframeBridge。

### 问题流程
1. PreviewFrame 组件挂载，创建 IframeBridge
2. iframe 加载完成，发送 `IFRAME_READY`
3. IframeBridge 接收到 `IFRAME_READY`，标记为 ready
4. VisualEditor 组件重新渲染（状态变化）
5. `onMessage` 函数引用改变（每次渲染都是新函数）
6. PreviewFrame 的 `useEffect` 检测到依赖变化
7. 执行 cleanup 函数：销毁旧的 IframeBridge
8. 创建新的 IframeBridge（状态重置为 NOT ready）
9. 用户点击"进入编辑模式"
10. VisualEditor 尝试发送消息
11. 新的 IframeBridge 还没收到 `IFRAME_READY`，所以 `isReady = false`
12. 消息被放入队列，永远不会发送
13. 结果：检测到 0 个可编辑元素

### Console 日志证据
```
[page.tsx] Message listener registered
[page.tsx] Sent IFRAME_READY to parent
[page.tsx] Removing message listener  ← 监听器被移除！
[page.tsx] Message listener registered  ← 重新注册
[page.tsx] Sent IFRAME_READY to parent
[IframeBridge] Received IFRAME_READY, marking bridge as ready
[IframeBridge] Message queued (iframe not ready)  ← 新的 bridge 还没准备好！
```

## 解决方案

### 修改：使用 useRef 稳定 onMessage 回调
**文件**: `frontend/src/components/admin/visual-editor/PreviewFrame.tsx`

**问题代码**:
```typescript
useEffect(() => {
  if (iframeRef.current && !bridgeRef.current) {
    bridgeRef.current = new IframeBridge(iframeRef.current)
    
    if (onMessage) {
      bridgeRef.current.on('EDITABLE_ELEMENTS_RESPONSE', (payload) => {
        onMessage({ type: 'EDITABLE_ELEMENTS_RESPONSE', payload })
      })
      // ...
    }
  }

  return () => {
    if (bridgeRef.current) {
      bridgeRef.current.destroy()
      bridgeRef.current = null
    }
  }
}, [onMessage])  // ← 问题：onMessage 每次渲染都变化
```

**修复代码**:
```typescript
// 使用 ref 存储 onMessage，避免依赖变化
const onMessageRef = useRef(onMessage)
useEffect(() => {
  onMessageRef.current = onMessage
}, [onMessage])

useEffect(() => {
  if (iframeRef.current && !bridgeRef.current) {
    console.log('[PreviewFrame] Creating IframeBridge')
    bridgeRef.current = new IframeBridge(iframeRef.current)
    
    // 使用 ref 而不是直接使用 onMessage
    bridgeRef.current.on('EDITABLE_ELEMENTS_RESPONSE', (payload) => {
      onMessageRef.current?.({ type: 'EDITABLE_ELEMENTS_RESPONSE', payload })
    })
    // ...
  }

  return () => {
    if (bridgeRef.current) {
      console.log('[PreviewFrame] Destroying IframeBridge')
      bridgeRef.current.destroy()
      bridgeRef.current = null
    }
  }
}, [])  // ← 修复：空依赖数组，只在挂载时创建一次
```

### 原理说明

#### React useEffect 依赖问题
- 函数在 JavaScript 中是引用类型
- 每次组件渲染，函数都会重新创建（新的引用）
- `useEffect` 检测到依赖变化，执行 cleanup 和重新运行
- 这导致 IframeBridge 被反复创建和销毁

#### useRef 解决方案
- `useRef` 在组件生命周期内保持稳定
- 更新 ref.current 不会触发重新渲染
- 回调函数通过 ref 访问最新的 onMessage
- IframeBridge 只创建一次，保持状态稳定

## 测试步骤

### 1. 刷新浏览器
按 `Ctrl+F5` 硬刷新

### 2. 打开开发者工具
按 `F12`，切换到 Console 标签

### 3. 测试流程
1. 访问：http://localhost:3000/admin/content
2. 选择"首页 (Home)"
3. 点击"可视化编辑"按钮
4. 观察 Console，应该看到：
   ```
   [PreviewFrame] Creating IframeBridge
   [page.tsx] Edit mode enabled, setting up message listener
   [page.tsx] Message listener registered
   [page.tsx] Sent IFRAME_READY to parent
   [IframeBridge] Received IFRAME_READY, marking bridge as ready
   [PreviewFrame] iframe loaded successfully
   [PreviewFrame] Marking bridge as ready
   ```

5. 点击"进入编辑模式"按钮
6. 观察 Console，应该看到：
   ```
   [VisualEditor] Sending INIT_EDIT_MODE message
   [IframeBridge] Message sent: INIT_EDIT_MODE  ← 直接发送，不再队列化！
   [page.tsx] Received message: {type: 'INIT_EDIT_MODE', ...}
   [VisualEditor] Sending REQUEST_EDITABLE_ELEMENTS message
   [IframeBridge] Message sent: REQUEST_EDITABLE_ELEMENTS
   [page.tsx] Received message: {type: 'REQUEST_EDITABLE_ELEMENTS'}
   [page.tsx] Detecting editable elements...
   [page.tsx] Found XX editable elements
   ```

7. 应该看到 Toast 提示："检测到 XX 个可编辑元素"

### 关键检查点
- ✅ 不应该看到 `[page.tsx] Removing message listener`（除非真的退出编辑模式）
- ✅ 不应该看到 `[PreviewFrame] Destroying IframeBridge`（除非关闭编辑器）
- ✅ 不应该看到 `Message queued (iframe not ready)`
- ✅ 应该看到 `Message sent` 而不是 `Message queued`

## 预期结果

### 成功标志
- ✅ IframeBridge 只创建一次
- ✅ 消息直接发送，不被队列化
- ✅ Toast 提示："检测到 XX 个可编辑元素"（XX > 20）
- ✅ 鼠标悬停时显示蓝色边框
- ✅ 点击元素打开编辑对话框

### 如果仍然失败

#### 检查 1: Bridge 是否被重复创建
在 Console 中搜索：`Creating IframeBridge`
- 应该只出现 1 次
- 如果出现多次：说明还有其他原因导致组件重新挂载

#### 检查 2: 消息是否被队列化
在 Console 中搜索：`Message queued`
- 不应该出现
- 如果出现：说明 bridge 的 isReady 状态有问题

#### 检查 3: 监听器是否被移除
在 Console 中搜索：`Removing message listener`
- 只应该在关闭编辑器时出现
- 如果频繁出现：说明 page.tsx 的 useEffect 也有类似问题

## 技术细节

### React useEffect 依赖最佳实践

#### 问题模式（避免）
```typescript
useEffect(() => {
  // 使用 props 或 state 中的函数
  someFunction()
}, [someFunction])  // ❌ 函数每次渲染都变化
```

#### 解决方案 1：使用 useRef
```typescript
const functionRef = useRef(someFunction)
useEffect(() => {
  functionRef.current = someFunction
}, [someFunction])

useEffect(() => {
  functionRef.current()
}, [])  // ✅ 空依赖，只运行一次
```

#### 解决方案 2：使用 useCallback
```typescript
const stableFunction = useCallback(() => {
  // 函数体
}, [])  // 空依赖，函数引用稳定

useEffect(() => {
  stableFunction()
}, [stableFunction])  // ✅ 函数引用稳定
```

### IframeBridge 生命周期

正确的生命周期：
```
1. PreviewFrame 挂载
   ↓
2. 创建 IframeBridge（一次）
   ↓
3. iframe 加载
   ↓
4. 接收 IFRAME_READY
   ↓
5. 标记为 ready
   ↓
6. 发送/接收消息（多次）
   ↓
7. PreviewFrame 卸载
   ↓
8. 销毁 IframeBridge（一次）
```

错误的生命周期（修复前）：
```
1. PreviewFrame 挂载
   ↓
2. 创建 IframeBridge
   ↓
3. 接收 IFRAME_READY，标记为 ready
   ↓
4. 父组件重新渲染
   ↓
5. 销毁 IframeBridge  ← 问题！
   ↓
6. 创建新的 IframeBridge（未 ready）
   ↓
7. 尝试发送消息 → 被队列化
   ↓
8. 消息永远不会发送
```

## 相关文件

- `frontend/src/components/admin/visual-editor/PreviewFrame.tsx` - 修复的主要文件
- `frontend/src/lib/visual-editor/iframe-bridge.ts` - IframeBridge 实现
- `frontend/src/app/page.tsx` - iframe 页面
- `frontend/src/components/admin/visual-editor/VisualEditor.tsx` - 父组件

## 学到的教训

### 1. useEffect 依赖管理
- 函数作为依赖时要特别小心
- 考虑使用 useRef 或 useCallback 稳定引用
- 空依赖数组 `[]` 表示只在挂载时运行一次

### 2. 调试技巧
- 添加 console.log 追踪组件生命周期
- 特别关注 cleanup 函数的执行时机
- 使用 React DevTools 查看组件重新渲染

### 3. 状态管理
- 跨组件通信的状态要保持稳定
- 避免在每次渲染时重置关键状态
- 使用 ref 存储不需要触发渲染的值

## 总结

这个修复解决了 IframeBridge 被反复创建和销毁的问题。通过使用 useRef 稳定 onMessage 回调，并将 useEffect 的依赖数组设为空，确保 IframeBridge 在组件生命周期内只创建一次，保持状态稳定，使得 postMessage 通信能够正常工作。

这是一个典型的 React hooks 依赖管理问题，也是开发中容易忽视的细节。

---

**修复时间**: 2026-02-13  
**修复人**: Kiro AI Assistant  
**状态**: ✅ 已修复，等待测试
