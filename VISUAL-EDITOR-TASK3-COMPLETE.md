# Task 3 Complete: 可编辑元素检测

## 完成时间
2026-02-11

## 任务概述
实现了可视化编辑器的可编辑元素检测功能，包括在前端页面添加data-editable属性、创建元素检测器、以及实现编辑模式支持。

## 完成的子任务

### 3.1 在前端页面添加data-editable属性 ✅

为 `frontend/src/app/page.tsx` 中的所有文字和图片元素添加了data-editable属性：

**添加的属性：**
- `data-editable`: 字段key（如 "hero.background.image"）
- `data-editable-type`: 元素类型（"text" 或 "image"）
- `data-editable-label`: 显示标签（如 "Hero背景图"）

**标记的元素包括：**

1. **Hero Section**
   - Hero背景图 (`hero.background.image`)
   - 品牌名称 (`common.brand`)
   - 品牌口号 (`common.slogan`)

2. **Brand Intro Section**
   - 品牌介绍背景图 (`brand.background.image`)
   - 品牌徽章文字 (`home.brand.badge`)
   - 品牌标题第一部分 (`home.brand.title.part1`)
   - 品牌标题第二部分 (`home.brand.title.part2`)
   - 品牌描述 (`home.brand.desc`)

3. **E-BIKE Section**
   - E-BIKE副标题 (`home.ebike.subtitle`)
   - E-BIKE重量 (`home.ebike.weight`)
   - E-BIKE续航 (`home.ebike.range`)
   - E-BIKE速度 (`home.ebike.speed`)

4. **Routes Section**
   - 路线副标题 (`home.routes.subtitle`)
   - 路线标题 (`home.routes.title`)
   - 4个路线卡片的图片、名称、距离（共12个元素）

5. **CTA Section**
   - CTA背景图 (`cta.background.image`)
   - CTA标题 (`home.cta.title`)
   - CTA描述 (`home.cta.desc`)

**总计：** 约25个可编辑元素

### 3.2 创建可编辑元素检测器 ✅

创建了 `frontend/src/lib/visual-editor/editable-detector.ts` 文件，实现了以下功能：

**核心函数：**

1. **`detectEditableElements(document: Document)`**
   - 检测页面中所有带有 `[data-editable]` 属性的元素
   - 提取元素的位置、类型、内容等信息
   - 返回 `EditableElement[]` 数组

2. **`generateSelector(element: Element)`**
   - 生成元素的唯一CSS选择器
   - 优先使用ID或data-editable属性
   - 使用类名和nth-child确保唯一性
   - 避免选择器过长

3. **`findElementBySelector(selector: string, document: Document)`**
   - 根据CSS选择器查找元素
   - 包含错误处理

4. **`getElementRect(element: Element)`**
   - 计算元素相对于视口的位置
   - 返回DOMRect对象

5. **`updateElementContent(element: Element, content: string, type: 'text' | 'image')`**
   - 更新元素内容
   - 支持文字和图片两种类型

**特点：**
- 完整的TypeScript类型定义
- 健壮的错误处理
- 高效的选择器生成算法
- 支持文字和图片两种元素类型

### 3.3 实现前端页面编辑模式支持 ✅

在 `frontend/src/app/page.tsx` 中添加了编辑模式支持：

**实现的功能：**

1. **editMode查询参数检测**
   ```typescript
   const searchParams = useSearchParams()
   const isEditMode = searchParams.get('editMode') === 'true'
   ```

2. **消息监听器**
   - 监听来自父窗口（可视化编辑器）的postMessage
   - 只接受同源消息（安全性）
   - 支持多种消息类型

3. **支持的消息类型：**

   - **`INIT_EDIT_MODE`**: 初始化编辑模式
     - 接收语言参数
     - 记录日志
   
   - **`REQUEST_EDITABLE_ELEMENTS`**: 请求可编辑元素
     - 调用 `detectEditableElements()` 检测元素
     - 通过postMessage发送元素列表给父窗口
   
   - **`UPDATE_CONTENT`**: 更新内容
     - 接收字段key、新内容、语言
     - 查找对应元素
     - 更新元素内容（文字或图片）
   
   - **`EXIT_EDIT_MODE`**: 退出编辑模式
     - 记录日志
     - 可选：刷新页面

4. **页面加载通知**
   - 页面加载完成后通知父窗口
   - 发送 `IFRAME_LOADED` 消息

**安全特性：**
- 同源策略检查
- 消息类型验证
- 元素存在性检查
- 错误日志记录

## 技术实现

### 数据流

```
可视化编辑器 (父窗口)
    ↓ postMessage
前端页面 (iframe)
    ↓ detectEditableElements()
可编辑元素列表
    ↓ postMessage
可视化编辑器
    ↓ 用户编辑
    ↓ postMessage (UPDATE_CONTENT)
前端页面
    ↓ updateElementContent()
DOM更新
```

### 消息格式

```typescript
// 请求可编辑元素
{ type: 'REQUEST_EDITABLE_ELEMENTS' }

// 响应可编辑元素
{ 
  type: 'EDITABLE_ELEMENTS_RESPONSE',
  payload: EditableElement[]
}

// 更新内容
{
  type: 'UPDATE_CONTENT',
  payload: {
    fieldKey: string,
    content: string,
    locale: string
  }
}
```

## 测试验证

### TypeScript检查
- ✅ `frontend/src/app/page.tsx` - 无错误
- ✅ `frontend/src/lib/visual-editor/editable-detector.ts` - 无错误

### 功能验证点

1. **元素检测**
   - [ ] 访问 `/?editMode=true` 时能检测到所有可编辑元素
   - [ ] 元素位置计算正确
   - [ ] CSS选择器生成唯一且有效

2. **消息通信**
   - [ ] 能接收父窗口的消息
   - [ ] 能发送元素列表给父窗口
   - [ ] 同源策略正常工作

3. **内容更新**
   - [ ] 文字内容能正确更新
   - [ ] 图片src能正确更新
   - [ ] 更新后DOM立即反映变化

## 文件清单

### 新建文件
- `frontend/src/lib/visual-editor/editable-detector.ts` - 可编辑元素检测器

### 修改文件
- `frontend/src/app/page.tsx` - 添加data-editable属性和编辑模式支持

## 下一步

Task 3已完成，可以继续执行Task 4：实现编辑覆盖层

**Task 4包括：**
- 4.1 创建EditOverlay组件
- 4.2 创建EditableElement组件
- 4.3 实现元素交互逻辑

## 注意事项

1. **性能考虑**
   - 当前实现会检测所有可编辑元素
   - 如果元素数量很大，可能需要虚拟滚动优化

2. **浏览器兼容性**
   - 使用了 `getBoundingClientRect()` - 现代浏览器都支持
   - 使用了 `postMessage` - 现代浏览器都支持
   - 使用了 `URLSearchParams` - 现代浏览器都支持

3. **安全性**
   - 已实现同源策略检查
   - 建议在生产环境添加更多验证

4. **扩展性**
   - 选择器生成算法可以根据需要调整
   - 可以添加更多元素类型支持（如视频、音频等）
   - 可以添加元素验证规则

## 总结

Task 3成功实现了可编辑元素检测的完整功能：
- ✅ 前端页面标记了所有可编辑元素
- ✅ 创建了功能完整的元素检测器
- ✅ 实现了编辑模式的消息通信机制

这为后续的编辑覆盖层和编辑弹窗功能奠定了坚实的基础。
