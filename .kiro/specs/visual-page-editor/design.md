# 设计文档 - 可视化页面编辑器

## 概述

可视化页面编辑器是一个所见即所得(WYSIWYG)的内容管理工具，允许管理员在实际页面预览中直接点击和编辑内容。该系统通过iframe嵌入前端页面，使用overlay层标识可编辑元素，并通过postMessage实现跨窗口通信。

## 架构设计

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    CMS后台管理系统                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          内容管理页面 (Content Page)                   │   │
│  │  - 页面选择器                                          │   │
│  │  - 预览按钮                                            │   │
│  │  - 内容列表                                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓ 点击预览                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      可视化编辑器页面 (Visual Editor Page)             │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  工具栏 (Toolbar)                               │  │   │
│  │  │  - 编辑模式切换                                  │  │   │
│  │  │  - 设备尺寸切换                                  │  │   │
│  │  │  - 语言切换                                      │  │   │
│  │  │  - 保存/关闭按钮                                 │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  预览区域 (Preview Area)                        │  │   │
│  │  │  ┌──────────────────────────────────────────┐  │  │   │
│  │  │  │  iframe (前端页面)                        │  │  │   │
│  │  │  │  - 加载实际前端页面                        │  │  │   │
│  │  │  │  - 注入编辑脚本                            │  │  │   │
│  │  │  └──────────────────────────────────────────┘  │  │   │
│  │  │  ┌──────────────────────────────────────────┐  │  │   │
│  │  │  │  编辑覆盖层 (Edit Overlay)                │  │  │   │
│  │  │  │  - 可编辑元素高亮                          │  │  │   │
│  │  │  │  - 编辑提示标签                            │  │  │   │
│  │  │  │  - 点击事件处理                            │  │  │   │
│  │  │  └──────────────────────────────────────────┘  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  编辑弹窗 (Edit Dialog)                         │  │   │
│  │  │  - 文字编辑器                                    │  │   │
│  │  │  - 图片编辑器                                    │  │   │
│  │  │  - 保存/取消按钮                                 │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↕ postMessage
┌─────────────────────────────────────────────────────────────┐
│                      前端页面 (Frontend)                      │
│  - 正常渲染页面内容                                            │
│  - 接收编辑模式消息                                            │
│  - 添加data-editable属性                                      │
│  - 响应内容更新消息                                            │
└─────────────────────────────────────────────────────────────┘
```

### 组件结构

```
frontend/src/
├── app/
│   └── admin/
│       ├── content/
│       │   └── page.tsx                    # 内容管理页面（已存在，添加预览按钮）
│       └── visual-editor/
│           └── [pageSlug]/
│               └── page.tsx                # 可视化编辑器页面（新建）
├── components/
│   └── admin/
│       ├── visual-editor/
│       │   ├── VisualEditorToolbar.tsx    # 工具栏组件
│       │   ├── PreviewFrame.tsx           # iframe预览组件
│       │   ├── EditOverlay.tsx            # 编辑覆盖层组件
│       │   ├── EditableElement.tsx        # 可编辑元素标识组件
│       │   ├── TextEditDialog.tsx         # 文字编辑弹窗
│       │   ├── ImageEditDialog.tsx        # 图片编辑弹窗
│       │   └── DeviceSizeSelector.tsx     # 设备尺寸选择器
│       └── PreviewModal.tsx               # 现有预览模态框（保留）
├── lib/
│   ├── visual-editor/
│   │   ├── iframe-bridge.ts               # iframe通信桥接
│   │   ├── editable-detector.ts           # 可编辑元素检测
│   │   └── content-mapper.ts              # 内容映射工具
│   └── api/
│       └── admin.ts                       # API客户端（已存在，复用）
└── hooks/
    └── use-visual-editor.ts               # 可视化编辑器Hook
```

## 数据模型

### EditableElement（可编辑元素）

```typescript
interface EditableElement {
  // 元素标识
  id: string                    // 唯一ID
  fieldKey: string              // CMS字段key（如"hero.background.image"）
  
  // 元素类型
  type: 'text' | 'image'        // 元素类型
  
  // 位置信息
  rect: DOMRect                 // 元素在页面中的位置和尺寸
  selector: string              // CSS选择器
  
  // 内容信息
  contentZh: string             // 中文内容
  contentEn: string             // 英文内容
  
  // 元数据
  label: string                 // 显示标签
  isRequired: boolean           // 是否必填
  maxLength?: number            // 最大长度
}
```

### EditorState（编辑器状态）

```typescript
interface EditorState {
  // 模式状态
  mode: 'preview' | 'edit'      // 预览模式或编辑模式
  
  // 页面信息
  pageSlug: string              // 页面slug
  pageName: string              // 页面名称
  
  // 语言和设备
  locale: 'zh' | 'en'           // 当前语言
  deviceSize: 'desktop' | 'tablet' | 'mobile'  // 设备尺寸
  
  // 可编辑元素
  editableElements: EditableElement[]  // 所有可编辑元素
  hoveredElementId: string | null      // 当前悬停的元素ID
  selectedElementId: string | null     // 当前选中的元素ID
  
  // 编辑状态
  isEditing: boolean            // 是否正在编辑
  editingElementId: string | null  // 正在编辑的元素ID
  hasUnsavedChanges: boolean    // 是否有未保存的修改
}
```

### IframeBridgeMessage（iframe通信消息）

```typescript
type IframeBridgeMessage =
  | { type: 'INIT_EDIT_MODE'; payload: { locale: string } }
  | { type: 'EXIT_EDIT_MODE' }
  | { type: 'UPDATE_CONTENT'; payload: { fieldKey: string; content: string; locale: string } }
  | { type: 'REQUEST_EDITABLE_ELEMENTS' }
  | { type: 'EDITABLE_ELEMENTS_RESPONSE'; payload: EditableElement[] }
  | { type: 'ELEMENT_CLICKED'; payload: { elementId: string } }
```

## 核心功能设计

### 1. 预览按钮和路由

#### 内容管理页面更新

在现有的 `frontend/src/app/admin/content/page.tsx` 中：

```typescript
// 修改预览按钮的onClick事件
<Button
  variant="outline"
  onClick={() => {
    // 跳转到可视化编辑器页面
    router.push(`/admin/visual-editor/${selectedPage.slug}`)
  }}
>
  <Eye className="h-4 w-4 mr-2" />
  预览
</Button>
```

#### 可视化编辑器路由

创建新路由：`/admin/visual-editor/[pageSlug]`

```typescript
// frontend/src/app/admin/visual-editor/[pageSlug]/page.tsx
export default function VisualEditorPage({ params }: { params: { pageSlug: string } }) {
  return <VisualEditor pageSlug={params.pageSlug} />
}
```

### 2. iframe预览实现

#### PreviewFrame组件

```typescript
// frontend/src/components/admin/visual-editor/PreviewFrame.tsx
interface PreviewFrameProps {
  pageSlug: string
  deviceSize: 'desktop' | 'tablet' | 'mobile'
  locale: 'zh' | 'en'
  onLoad: () => void
  onMessage: (message: IframeBridgeMessage) => void
}

export function PreviewFrame({ pageSlug, deviceSize, locale, onLoad, onMessage }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  // 监听iframe消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      onMessage(event.data)
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onMessage])
  
  // 发送消息到iframe
  const sendMessage = (message: IframeBridgeMessage) => {
    iframeRef.current?.contentWindow?.postMessage(message, window.location.origin)
  }
  
  // 设备尺寸样式
  const sizeStyles = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-full mx-auto',
    mobile: 'w-[375px] h-full mx-auto'
  }
  
  return (
    <iframe
      ref={iframeRef}
      src={`/${pageSlug}?editMode=true&locale=${locale}`}
      className={sizeStyles[deviceSize]}
      onLoad={onLoad}
    />
  )
}
```

### 3. 可编辑元素检测

#### 前端页面修改

在前端页面组件中添加 `data-editable` 属性：

```typescript
// frontend/src/app/page.tsx
<Image
  src={getContent(cmsContent, 'hero.background.image', locale, '/brand_assets/page1_img2.jpeg')}
  alt={dict.home.heroImageAlt}
  data-editable="hero.background.image"
  data-editable-type="image"
  data-editable-label="Hero背景图"
  ...
/>

<h1 
  data-editable="common.brand"
  data-editable-type="text"
  data-editable-label="品牌名称"
>
  {getContent(cmsContent, 'common.brand', locale, dict.common.brand)}
</h1>
```

#### 可编辑元素检测器

```typescript
// frontend/src/lib/visual-editor/editable-detector.ts
export function detectEditableElements(document: Document): EditableElement[] {
  const elements = document.querySelectorAll('[data-editable]')
  
  return Array.from(elements).map((el, index) => {
    const rect = el.getBoundingClientRect()
    const fieldKey = el.getAttribute('data-editable')!
    const type = el.getAttribute('data-editable-type') as 'text' | 'image'
    const label = el.getAttribute('data-editable-label') || fieldKey
    
    return {
      id: `editable-${index}`,
      fieldKey,
      type,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
        bottom: rect.bottom,
        right: rect.right,
      },
      selector: generateSelector(el),
      contentZh: el.textContent || el.getAttribute('src') || '',
      contentEn: '',
      label,
      isRequired: false,
    }
  })
}

function generateSelector(element: Element): string {
  // 生成唯一的CSS选择器
  const path: string[] = []
  let current: Element | null = element
  
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()
    if (current.id) {
      selector += `#${current.id}`
      path.unshift(selector)
      break
    }
    if (current.className) {
      selector += `.${Array.from(current.classList).join('.')}`
    }
    path.unshift(selector)
    current = current.parentElement
  }
  
  return path.join(' > ')
}
```

### 4. 编辑覆盖层

#### EditOverlay组件

```typescript
// frontend/src/components/admin/visual-editor/EditOverlay.tsx
interface EditOverlayProps {
  editableElements: EditableElement[]
  hoveredElementId: string | null
  selectedElementId: string | null
  onElementHover: (id: string | null) => void
  onElementClick: (id: string) => void
}

export function EditOverlay({
  editableElements,
  hoveredElementId,
  selectedElementId,
  onElementHover,
  onElementClick,
}: EditOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {editableElements.map((element) => {
        const isHovered = element.id === hoveredElementId
        const isSelected = element.id === selectedElementId
        
        return (
          <EditableElement
            key={element.id}
            element={element}
            isHovered={isHovered}
            isSelected={isSelected}
            onHover={() => onElementHover(element.id)}
            onLeave={() => onElementHover(null)}
            onClick={() => onElementClick(element.id)}
          />
        )
      })}
    </div>
  )
}
```

#### EditableElement组件

```typescript
// frontend/src/components/admin/visual-editor/EditableElement.tsx
interface EditableElementProps {
  element: EditableElement
  isHovered: boolean
  isSelected: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}

export function EditableElement({
  element,
  isHovered,
  isSelected,
  onHover,
  onLeave,
  onClick,
}: EditableElementProps) {
  const { rect, label, type } = element
  
  return (
    <div
      className="absolute pointer-events-auto cursor-pointer transition-all"
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* 边框高亮 */}
      <div
        className={cn(
          'absolute inset-0 border-2 transition-colors',
          isSelected && 'border-blue-500 bg-blue-500/10',
          isHovered && !isSelected && 'border-blue-400 bg-blue-400/5',
          !isHovered && !isSelected && 'border-transparent'
        )}
      />
      
      {/* 标签提示 */}
      {(isHovered || isSelected) && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          {type === 'text' ? <Type className="h-3 w-3" /> : <Image className="h-3 w-3" />}
          <span>{label}</span>
        </div>
      )}
    </div>
  )
}
```

### 5. 文字编辑弹窗

```typescript
// frontend/src/components/admin/visual-editor/TextEditDialog.tsx
interface TextEditDialogProps {
  element: EditableElement
  isOpen: boolean
  onClose: () => void
  onSave: (contentZh: string, contentEn: string) => Promise<void>
}

export function TextEditDialog({ element, isOpen, onClose, onSave }: TextEditDialogProps) {
  const [contentZh, setContentZh] = useState(element.contentZh)
  const [contentEn, setContentEn] = useState(element.contentEn)
  const [saving, setSaving] = useState(false)
  
  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(contentZh, contentEn)
      onClose()
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑文字内容</DialogTitle>
          <DialogDescription>{element.label}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">中文内容</label>
            <Textarea
              value={contentZh}
              onChange={(e) => setContentZh(e.target.value)}
              rows={4}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">English Content</label>
            <Textarea
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### 6. 图片编辑弹窗（增强版）

```typescript
// frontend/src/components/admin/visual-editor/ImageEditDialog.tsx
interface ImageEditDialogProps {
  element: EditableElement
  pageSlug: string  // 新增：用于筛选该页面的图片
  isOpen: boolean
  onClose: () => void
  onSave: (imagePath: string) => Promise<void>
}

export function ImageEditDialog({ element, pageSlug, isOpen, onClose, onSave }: ImageEditDialogProps) {
  const [imagePath, setImagePath] = useState(element.contentZh)
  const [saving, setSaving] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null)
  
  // 获取该页面的所有图片
  const { data: assetsResponse, isLoading } = useQuery({
    queryKey: ['assets', pageSlug],
    queryFn: () => assetApi.getAssets({ category: pageSlug }),
    enabled: isOpen,
  })
  
  const assets = assetsResponse?.data?.records || []
  
  // 选择图片
  const handleSelectImage = (asset: Asset) => {
    setSelectedImage(asset)
    setImagePath(asset.fileUrl)
  }
  
  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(imagePath)
      onClose()
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑图片</DialogTitle>
          <DialogDescription>{element.label}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 当前图片预览 */}
          <div>
            <label className="text-sm font-medium">当前图片</label>
            <div className="mt-2 border rounded-lg overflow-hidden bg-gray-50">
              <img 
                src={element.contentZh} 
                alt="Current" 
                className="w-full h-auto max-h-[300px] object-contain" 
              />
            </div>
          </div>
          
          {/* 图片选择器 */}
          <div>
            <label className="text-sm font-medium">选择图片</label>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : assets.length > 0 ? (
              <div className="mt-2 grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto border rounded-lg p-3">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className={cn(
                      'relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:border-blue-400',
                      selectedImage?.id === asset.id && 'border-blue-500 ring-2 ring-blue-200'
                    )}
                    onClick={() => handleSelectImage(asset)}
                  >
                    <img
                      src={asset.thumbnailUrl || asset.fileUrl}
                      alt={asset.originalFilename}
                      className="w-full h-24 object-cover"
                    />
                    {selectedImage?.id === asset.id && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-blue-500" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                      {asset.originalFilename}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 border rounded-lg p-8 text-center text-gray-400">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">该页面暂无可用图片</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => window.open('/admin/assets', '_blank')}
                >
                  前往图片管理上传
                </Button>
              </div>
            )}
          </div>
          
          {/* 图片路径输入（手动输入） */}
          <div>
            <label className="text-sm font-medium">图片路径（或手动输入）</label>
            <Input
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              placeholder="/brand_assets/image.jpeg"
            />
          </div>
          
          {/* 新图片预览 */}
          {imagePath !== element.contentZh && (
            <div>
              <label className="text-sm font-medium">新图片预览</label>
              <div className="mt-2 border rounded-lg overflow-hidden bg-gray-50">
                <img 
                  src={imagePath} 
                  alt="Preview" 
                  className="w-full h-auto max-h-[300px] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden flex items-center justify-center h-[200px] text-red-400">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">图片加载失败</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 图片信息 */}
          {selectedImage && (
            <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded text-xs text-gray-600">
              <p><strong>文件名:</strong> {selectedImage.originalFilename}</p>
              <p><strong>尺寸:</strong> {selectedImage.width} × {selectedImage.height}px</p>
              <p><strong>大小:</strong> {(selectedImage.fileSize / 1024).toFixed(2)} KB</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### 图片自动适配

图片自动适配通过CSS实现，在前端页面中使用响应式图片类：

```typescript
// 前端页面中的图片元素
<Image
  src={imagePath}
  alt={alt}
  className="w-full h-auto object-cover"  // 自动适配容器大小
  data-editable="hero.background.image"
  ...
/>
```

当图片路径更新后，浏览器会自动根据容器大小和CSS规则调整图片显示。
```

### 7. iframe通信桥接

```typescript
// frontend/src/lib/visual-editor/iframe-bridge.ts
export class IframeBridge {
  private iframe: HTMLIFrameElement
  private messageHandlers: Map<string, (payload: any) => void> = new Map()
  
  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe
    this.setupMessageListener()
  }
  
  private setupMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return
      if (!event.data.type) return
      
      const handler = this.messageHandlers.get(event.data.type)
      if (handler) {
        handler(event.data.payload)
      }
    })
  }
  
  on(type: string, handler: (payload: any) => void) {
    this.messageHandlers.set(type, handler)
  }
  
  send(message: IframeBridgeMessage) {
    this.iframe.contentWindow?.postMessage(message, window.location.origin)
  }
  
  // 初始化编辑模式
  initEditMode(locale: string) {
    this.send({ type: 'INIT_EDIT_MODE', payload: { locale } })
  }
  
  // 退出编辑模式
  exitEditMode() {
    this.send({ type: 'EXIT_EDIT_MODE' })
  }
  
  // 更新内容
  updateContent(fieldKey: string, content: string, locale: string) {
    this.send({ type: 'UPDATE_CONTENT', payload: { fieldKey, content, locale } })
  }
  
  // 请求可编辑元素
  requestEditableElements() {
    this.send({ type: 'REQUEST_EDITABLE_ELEMENTS' })
  }
}
```

### 8. 前端页面编辑模式支持

在前端页面中添加编辑模式支持：

```typescript
// frontend/src/app/page.tsx
export default function Home() {
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('editMode') === 'true'
  
  useEffect(() => {
    if (!isEditMode) return
    
    // 监听编辑器消息
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      
      switch (event.data.type) {
        case 'INIT_EDIT_MODE':
          // 初始化编辑模式
          break
        case 'REQUEST_EDITABLE_ELEMENTS':
          // 发送可编辑元素信息
          const elements = detectEditableElements(document)
          window.parent.postMessage({
            type: 'EDITABLE_ELEMENTS_RESPONSE',
            payload: elements
          }, window.location.origin)
          break
        case 'UPDATE_CONTENT':
          // 更新内容
          const { fieldKey, content, locale } = event.data.payload
          // 触发内容更新
          break
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isEditMode])
  
  // ... 其余代码
}
```

## 错误处理

### 错误类型

```typescript
enum VisualEditorError {
  IFRAME_LOAD_FAILED = 'IFRAME_LOAD_FAILED',
  ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND',
  SAVE_FAILED = 'SAVE_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
}
```

### 错误处理策略

1. **iframe加载失败**：显示错误提示，提供重试按钮
2. **元素未找到**：显示警告，跳过该元素
3. **保存失败**：显示错误提示，保留用户输入
4. **权限拒绝**：跳转到登录页面
5. **网络错误**：显示错误提示，提供重试按钮

## 测试策略

### 单元测试

- `editable-detector.ts` - 可编辑元素检测逻辑
- `iframe-bridge.ts` - iframe通信逻辑
- `content-mapper.ts` - 内容映射逻辑

### 集成测试

- 预览按钮点击 → 跳转到可视化编辑器
- 进入编辑模式 → 显示可编辑元素
- 点击元素 → 打开编辑弹窗
- 保存修改 → 更新数据库和预览

### E2E测试

- 完整的编辑流程：选择页面 → 预览 → 编辑 → 保存 → 验证
- 多语言切换测试
- 设备尺寸切换测试
- 权限验证测试

## 性能优化

### 优化策略

1. **iframe预加载**：在内容管理页面预加载iframe
2. **虚拟滚动**：大量可编辑元素时使用虚拟滚动
3. **防抖处理**：鼠标悬停事件使用防抖
4. **懒加载**：编辑弹窗组件懒加载
5. **缓存策略**：缓存可编辑元素信息

### 性能指标

- iframe加载时间 < 2秒
- 编辑模式切换 < 300ms
- 元素高亮响应 < 100ms
- 保存操作 < 1秒

## 安全考虑

### 安全措施

1. **同源策略**：只接受同源的postMessage
2. **JWT验证**：所有保存操作验证JWT token
3. **XSS防护**：对用户输入进行转义
4. **CSRF防护**：使用CSRF token
5. **权限验证**：验证用户是否有编辑权限

## 部署计划

### 第一阶段（MVP）- 2周

- 创建可视化编辑器页面路由
- 实现iframe预览功能
- 实现可编辑元素检测
- 实现编辑覆盖层
- 实现文字和图片编辑弹窗
- 实现保存功能

### 第二阶段（增强）- 1周

- 实现设备尺寸切换
- 实现语言切换
- 实现编辑状态同步
- 优化性能和用户体验

### 第三阶段（高级）- 1周

- 实现编辑历史
- 实现批量编辑
- 添加快捷键支持
- 完善错误处理

---

**创建时间**: 2026-02-11
**状态**: 待审核
**预计工作量**: 4周
