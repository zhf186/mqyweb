# 可视化编辑器 - 滚动修复测试指南

**日期**: 2026-02-14  
**状态**: 准备测试  
**修复内容**: 滚动后元素点击位置更新

## 测试前准备

### 1. 确认服务运行状态
- ✅ Frontend: http://localhost:3000 (进程 2)
- ✅ Backend: http://localhost:8080 (进程 6)
- ✅ MySQL: Docker 容器运行中

### 2. 刷新浏览器
**重要**: 必须硬刷新以加载最新代码
- Windows: `Ctrl + F5` 或 `Ctrl + Shift + R`
- 清除缓存后刷新

## 测试步骤

### 第一步：进入可视化编辑器

1. 打开浏览器访问：http://localhost:3000/admin/login
2. 登录后台管理系统
   - 用户名：`admin`
   - 密码：`Admin@123`
3. 点击左侧菜单"内容管理"
4. 在页面列表中找到"首页 (Home)"
5. 点击"可视化编辑"按钮
6. 等待页面加载完成

### 第二步：进入编辑模式

1. 点击顶部工具栏的"进入编辑模式"按钮
2. 等待提示："已进入编辑模式"
3. 等待提示："可编辑元素已加载 - 检测到 29 个可编辑元素"
4. 观察页面上应该出现可编辑元素的高亮边框

### 第三步：测试页面顶部元素（无滚动）

**目的**: 验证基本点击功能正常

1. 点击页面顶部的"漫骑游"（品牌名称）
   - ✅ 应该打开"品牌名称"的编辑对话框
   - ✅ 对话框标题显示："编辑文字 - 品牌名称"
   - ✅ 中文内容显示："漫骑游"
   - ❌ 如果打开错误的对话框 → 基本功能有问题

2. 关闭对话框（点击"取消"或 X）

3. 点击"骑遇无限美好人生"（品牌口号）
   - ✅ 应该打开"品牌口号"的编辑对话框
   - ✅ 对话框标题显示："编辑文字 - 品牌口号"
   - ❌ 如果仍然打开"品牌名称" → 基本功能有问题

4. 关闭对话框

### 第四步：测试滚动后的元素点击（关键测试）

**目的**: 验证滚动修复是否生效

#### 测试 A：E-BIKE 部分

1. **向下滚动**到"E-BIKE"部分（黑色背景，显示数字统计）
   - 滚动距离约 1-2 屏幕高度
   - 确保"E-BIKE"标题在视口中央

2. **等待 1 秒**（让滚动位置更新完成）

3. **打开浏览器 Console**（F12 → Console 标签）
   - 应该看到日志：
     ```
     [page.tsx] Scroll detected, notifying parent
     [VisualEditor] Scroll detected, refreshing element positions
     [page.tsx] Found 29 editable elements
     ```

4. **点击"智能助力，轻松骑行"**（E-BIKE副标题）
   - ✅ **成功**: 打开"E-BIKE副标题"的编辑对话框
   - ❌ **失败**: 打开"品牌名称"或其他错误的对话框
   - ❌ **失败**: 没有任何反应

5. 关闭对话框

6. **点击数字"11.9"**（E-BIKE重量）
   - ✅ **成功**: 打开"E-BIKE重量"的编辑对话框
   - ❌ **失败**: 打开错误的对话框

7. 关闭对话框

#### 测试 B：路线卡片部分

1. **继续向下滚动**到"精选路线"部分
   - 滚动距离约 2-3 屏幕高度
   - 确保路线卡片在视口中

2. **等待 1 秒**（让滚动位置更新）

3. **检查 Console 日志**
   - 应该再次看到滚动更新日志

4. **点击第一张路线卡片的标题**（例如"东钱湖环湖"）
   - ✅ **成功**: 打开"路线1名称"的编辑对话框
   - ✅ 内容显示："东钱湖环湖"
   - ❌ **失败**: 打开其他元素的对话框

5. 关闭对话框

6. **点击第一张路线卡片的距离**（例如"35km"）
   - ✅ **成功**: 打开"路线1距离"的编辑对话框
   - ✅ 内容显示："35km"
   - ❌ **失败**: 打开错误的对话框

7. 关闭对话框

#### 测试 C：CTA 部分（页面底部）

1. **滚动到页面最底部**的 CTA 部分
   - 应该看到大标题和两个按钮

2. **等待 1 秒**

3. **点击 CTA 标题**
   - ✅ **成功**: 打开"CTA标题"的编辑对话框
   - ❌ **失败**: 打开错误的对话框

4. 关闭对话框

### 第五步：测试快速滚动

**目的**: 验证防抖机制

1. **快速滚动**页面上下移动
   - 不要停留，持续滚动 2-3 秒

2. **停止滚动**，等待 1 秒

3. **点击当前视口中的任意元素**
   - ✅ **成功**: 打开正确的编辑对话框
   - ❌ **失败**: 位置不匹配

### 第六步：测试往回滚动

**目的**: 验证双向滚动都能正确更新

1. **滚动到页面底部**

2. **向上滚动回到页面顶部**

3. **等待 1 秒**

4. **再次点击"漫骑游"（品牌名称）**
   - ✅ **成功**: 打开"品牌名称"的编辑对话框
   - ❌ **失败**: 打开其他对话框

## 测试结果判定

### ✅ 测试通过标准

所有以下条件都满足：

1. **基本功能正常**
   - 页面顶部元素点击正确
   - 编辑对话框显示正确内容

2. **滚动后点击正确**
   - E-BIKE 部分元素点击正确
   - 路线卡片元素点击正确
   - CTA 部分元素点击正确

3. **Console 日志正常**
   - 滚动时看到位置更新日志
   - 没有错误信息

4. **性能流畅**
   - 滚动流畅，无卡顿
   - 点击响应及时

### ❌ 测试失败情况

#### 情况 1：滚动后仍然打开错误的对话框

**症状**: 滚动后点击元素，总是打开首次点击的那个元素

**可能原因**:
- 滚动监听器没有正确设置
- 消息通信失败
- 位置没有更新

**调试步骤**:
1. 检查 Console 是否有滚动日志
2. 如果没有日志 → 滚动监听器问题
3. 如果有日志但位置不更新 → 消息通信问题

**解决方法**:
```bash
# 重启 frontend
cd frontend
npm run dev
```

#### 情况 2：点击没有反应

**症状**: 点击元素后没有任何对话框打开

**可能原因**:
- 元素检测失败
- 点击事件没有触发
- 元素位置计算错误

**调试步骤**:
1. 检查 Console 是否显示"检测到 29 个可编辑元素"
2. 如果没有 → 元素检测失败
3. 如果有 → 点击事件或位置计算问题

**解决方法**:
- 刷新页面（Ctrl+F5）
- 重新进入编辑模式

#### 情况 3：Console 没有滚动日志

**症状**: 滚动时 Console 没有任何输出

**可能原因**:
- 滚动监听器没有注册
- 代码没有正确加载

**解决方法**:
1. 硬刷新浏览器（Ctrl+F5）
2. 清除浏览器缓存
3. 重启 frontend 服务

#### 情况 4：性能卡顿

**症状**: 滚动时页面卡顿或延迟

**可能原因**:
- 防抖时间太短
- 元素检测太频繁

**解决方法**:
- 这是已知限制，可以接受
- Phase 2 会优化性能

## Console 日志参考

### 正常的日志流程

#### 进入编辑模式时：
```
[VisualEditor] Sending INIT_EDIT_MODE message
[VisualEditor] Sending REQUEST_EDITABLE_ELEMENTS message
[page.tsx] Received message: {type: 'INIT_EDIT_MODE'}
[page.tsx] Received message: {type: 'REQUEST_EDITABLE_ELEMENTS'}
[page.tsx] Detecting editable elements...
[page.tsx] Found 29 editable elements
[page.tsx] Sent EDITABLE_ELEMENTS_RESPONSE to parent
```

#### 滚动时：
```
[page.tsx] Scroll detected, notifying parent
[VisualEditor] Scroll detected, refreshing element positions
[VisualEditor] Sending REQUEST_EDITABLE_ELEMENTS message
[page.tsx] Received message: {type: 'REQUEST_EDITABLE_ELEMENTS'}
[page.tsx] Detecting editable elements...
[page.tsx] Found 29 editable elements
[page.tsx] Sent EDITABLE_ELEMENTS_RESPONSE to parent
```

#### 点击元素时：
```
Element clicked: {id: "...", type: "text", label: "...", ...}
打开文字编辑器
```

### 异常日志

#### 错误 1：元素检测失败
```
[page.tsx] Found 0 editable elements
```
→ 元素检测逻辑有问题

#### 错误 2：消息通信失败
```
[IframeBridge] Cannot send message: iframe contentWindow not available
```
→ iframe 没有正确加载

#### 错误 3：位置计算错误
```
EditableElement: Invalid position {top: NaN, left: NaN}
```
→ getBoundingClientRect() 返回异常

## 测试完成后

### 如果测试通过 ✅

1. 在 Console 中截图保存日志
2. 记录测试结果
3. 继续进行 Checkpoint 9 的其他测试：
   - 文字编辑功能
   - 图片编辑功能
   - 实时预览更新
   - 设备尺寸切换
   - 语言切换

### 如果测试失败 ❌

1. 截图保存错误信息
2. 复制 Console 完整日志
3. 描述具体失败场景
4. 提供给开发人员调试

## 技术说明

### 滚动更新机制

```
用户滚动
  ↓
iframe 滚动事件 (防抖 100ms)
  ↓
发送 IFRAME_SCROLLED 消息
  ↓
VisualEditor 接收 (防抖 150ms)
  ↓
发送 REQUEST_EDITABLE_ELEMENTS
  ↓
iframe 重新检测元素位置
  ↓
发送 EDITABLE_ELEMENTS_RESPONSE
  ↓
更新 editableElements 状态
  ↓
EditOverlay 重新渲染
  ↓
点击位置正确匹配 ✅
```

### 防抖时间说明

- **iframe 防抖 (100ms)**: 避免频繁发送消息
- **父窗口防抖 (150ms)**: 避免频繁检测元素
- **总延迟**: 约 250ms（用户感知不明显）

### 性能考虑

- `getBoundingClientRect()` 会触发浏览器重排
- 不应该实时更新，只在滚动停止后更新
- 29 个元素的检测时间约 10-20ms
- 整体性能影响可接受

## 相关文档

- `VISUAL-EDITOR-SCROLL-FIX.md` - 修复详细说明
- `VISUAL-EDITOR-BRIDGE-RECREATION-FIX.md` - IframeBridge 修复
- `VISUAL-EDITOR-MESSAGE-FIX.md` - 消息类型修复
- `.kiro/specs/visual-page-editor/tasks.md` - Task 9 要求

## 下一步

测试通过后，继续完成 Checkpoint 9 的其他测试项：

1. ✅ 元素检测和高亮
2. ✅ 滚动后点击正确（本次测试）
3. ⏳ 文字编辑功能
4. ⏳ 图片编辑功能
5. ⏳ 实时预览更新
6. ⏳ 设备尺寸切换
7. ⏳ 语言切换
8. ⏳ 保存和发布

---

**创建时间**: 2026-02-14  
**创建人**: Kiro AI Assistant  
**状态**: 📋 准备测试
