# 图片上传功能调试指南

**日期**: 2026-02-04  
**问题**: 图片选择或拖拽后，框内没有显示，上传按钮一直灰色

## 已添加的调试功能

### 1. Console日志
在AssetUploader组件中添加了以下console.log：
- `Accepted files:` - 显示被接受的文件
- `Rejected files:` - 显示被拒绝的文件
- `Rejected files:` (dropzone) - 显示dropzone拒绝的文件详情

### 2. 错误提示
- 文件格式错误会弹出alert
- 文件大小超限会弹出alert
- Dropzone拒绝文件会显示具体原因

## 调试步骤

### 1. 打开浏览器开发者工具
1. 按 F12 打开开发者工具
2. 切换到 "Console" 标签
3. 清空之前的日志

### 2. 尝试上传图片
1. 点击"上传图片"按钮
2. 选择一张图片（JPG、PNG或WebP格式）
3. 观察Console中的输出

### 3. 检查Console输出

#### 正常情况
```javascript
Accepted files: [File]
  0: File {name: "test.jpg", size: 123456, type: "image/jpeg", ...}
```

#### 文件被拒绝
```javascript
Accepted files: []
Rejected files: [{file: File, errors: [...]}]
```

## 可能的问题和解决方案

### 问题1: 文件格式不支持
**症状**: Console显示 "Rejected files" 包含格式错误

**原因**: 
- 文件扩展名与MIME类型不匹配
- 浏览器识别的MIME类型不在允许列表中

**解决方案**:
检查文件的实际MIME类型，可能需要调整accept配置。

### 问题2: 文件大小超限
**症状**: Console显示文件大小超过5MB

**解决方案**:
- 压缩图片
- 或者增加MAX_FILE_SIZE限制（需要同时修改后端）

### 问题3: React Hook依赖问题
**症状**: onDrop回调没有被触发

**解决方案**:
已在useCallback中添加所有必要的依赖项：`[files.length, maxFiles, maxSize]`

### 问题4: 文件预览URL创建失败
**症状**: 图片框显示但是空白

**解决方案**:
检查`URL.createObjectURL(file)`是否成功创建预览URL。

## 测试用例

### 测试1: 单个JPG文件
1. 准备一个小于5MB的JPG图片
2. 拖拽到上传区域
3. 预期: 显示预览，上传按钮变为可用

### 测试2: 多个PNG文件
1. 准备2-3个PNG图片
2. 同时选择多个文件
3. 预期: 显示所有预览，上传按钮可用

### 测试3: WebP文件
1. 准备一个WebP格式图片
2. 上传
3. 预期: 正常显示预览

### 测试4: 超大文件
1. 准备一个大于5MB的图片
2. 尝试上传
3. 预期: 弹出错误提示，文件被拒绝

### 测试5: 不支持的格式
1. 准备一个GIF或BMP文件
2. 尝试上传
3. 预期: 弹出错误提示，文件被拒绝

## 代码改进

### 改进1: 添加调试日志
```typescript
const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
  console.log('Accepted files:', acceptedFiles)
  console.log('Rejected files:', rejectedFiles)
  // ...
}, [files.length, maxFiles, maxSize])
```

### 改进2: 添加拒绝文件处理
```typescript
onDropRejected: (fileRejections) => {
  console.log('Rejected files:', fileRejections)
  const errors = fileRejections.map(rejection => {
    const errors = rejection.errors.map(e => e.message).join(', ')
    return `${rejection.file.name}: ${errors}`
  })
  if (errors.length > 0) {
    alert('文件被拒绝:\n' + errors.join('\n'))
  }
}
```

### 改进3: 更详细的错误信息
```typescript
acceptedFiles.forEach(file => {
  if (!ACCEPTED_FORMATS.includes(file.type)) {
    errors.push(`${file.name}: 不支持的文件格式`)
    return
  }
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`${file.name}: 文件大小超过 ${maxSize}MB`)
    return
  }
  // ...
})
```

## 常见问题排查

### Q1: 为什么选择文件后没有任何反应？
**检查项**:
1. 打开Console，看是否有JavaScript错误
2. 检查是否有"Accepted files"或"Rejected files"日志
3. 确认文件格式是JPG/PNG/WebP
4. 确认文件大小小于5MB

### Q2: 为什么上传按钮一直是灰色的？
**原因**:
上传按钮的启用条件是 `files.length > 0 && !isUploading`

**检查项**:
1. Console中是否显示"Accepted files"有内容
2. 检查`files`状态是否被正确更新
3. 在React DevTools中查看AssetUploader组件的state

### Q3: 如何在React DevTools中检查？
1. 安装React Developer Tools浏览器扩展
2. 打开DevTools，切换到"Components"标签
3. 找到AssetUploader组件
4. 查看其state中的`files`数组

## 临时解决方案

如果问题持续，可以尝试：

### 方案1: 简化文件验证
临时移除所有验证，看是否是验证逻辑的问题：
```typescript
const onDrop = useCallback((acceptedFiles: File[]) => {
  console.log('Files dropped:', acceptedFiles)
  const newFiles: UploadFile[] = acceptedFiles.map(file => ({
    file,
    preview: URL.createObjectURL(file),
    status: 'pending',
    progress: 0,
  }))
  setFiles(prev => [...prev, ...newFiles])
}, [])
```

### 方案2: 使用原生input
如果dropzone有问题，可以临时使用原生file input：
```tsx
<input
  type="file"
  accept="image/jpeg,image/png,image/webp"
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files || [])
    onDrop(files, [])
  }}
/>
```

## 下一步行动

1. **立即**: 打开浏览器Console，尝试上传文件，查看日志输出
2. **如果有日志**: 根据日志内容判断问题
3. **如果没有日志**: 可能是组件没有正确渲染或事件没有绑定
4. **如果文件被拒绝**: 检查文件格式和大小
5. **如果文件被接受但不显示**: 检查React state更新

## 联系信息

如果问题仍然存在，请提供：
1. Console中的完整日志
2. 尝试上传的文件信息（格式、大小）
3. 浏览器版本
4. 是否有任何JavaScript错误

这将帮助我们更快地定位和解决问题。
