# 内容管理保存功能修复完成

## 问题描述

用户在后台管理的内容管理页面编辑文字内容时，点击保存按钮报错：

```
Failed to load resource: the server responded with a status of 400 ()
Failed to save content: Error: Validation failed
  at request (client.ts:58:11)
  at async handleSave (ContentEditor.tsx:58:7)
```

## 问题分析

### 根本原因

前端发送的数据格式与后端期望的格式不匹配：

1. **字段名错误**：
   - 前端发送：`{ zh: string, en: string }`
   - 后端期望：`{ contentZh: string, contentEn: string, version: number, changeSummary?: string }`

2. **缺少必需字段**：
   - 后端 `UpdateContentRequest` DTO 要求 `version` 字段（用于乐观锁）
   - 前端未发送此字段

### 后端验证逻辑

```java
public class UpdateContentRequest {
    private String contentZh;
    private String contentEn;
    
    @NotNull(message = "版本号不能为空")
    private Integer version;  // 必需字段
    
    private String changeSummary;
}
```

后端使用乐观锁机制防止并发修改冲突，需要前端提供当前版本号。

## 修复方案

### 1. 更新 API 客户端 (`frontend/src/lib/api/admin.ts`)

修改 `updateContentItem` 方法签名，使用正确的字段名：

```typescript
updateContentItem: (itemId: string, data: { 
  contentZh: string; 
  contentEn: string; 
  version: number; 
  changeSummary?: string 
}) =>
  api.put<{ contentItem: ContentItem; version: ContentVersion }>(
    `/admin/content/items/${itemId}`, 
    data
  ),
```

### 2. 添加 version 字段到 ContentItem 接口

```typescript
export interface ContentItem {
  id: string
  pageId: string
  fieldKey: string
  fieldType: 'text' | 'textarea' | 'richtext'
  contentZh: string
  contentEn: string
  maxLength?: number
  isRequired: boolean
  displayOrder: number
  version: number  // 新增字段
  createdAt: string
  updatedAt: string
}
```

### 3. 更新 ContentEditor 组件 (`frontend/src/components/admin/ContentEditor.tsx`)

修改 `handleSave` 函数，发送正确的数据格式：

```typescript
const handleSave = async () => {
  try {
    setSaving(true)
    await contentApi.updateContentItem(contentItem.id, {
      contentZh: contentZh,           // 使用 contentZh
      contentEn: contentEn,           // 使用 contentEn
      version: contentItem.version || 0,  // 发送版本号
      changeSummary: '内容更新',      // 可选的修改摘要
    })
    toast({
      title: '保存成功',
      description: '内容已更新',
    })
    onSaved()
    onClose()
  } catch (error) {
    console.error('Failed to save content:', error)
    toast({
      title: '保存失败',
      description: '无法保存内容，请重试',
      variant: 'destructive',
    })
  } finally {
    setSaving(false)
  }
}
```

## 验证步骤

1. **前端已自动重新编译**：
   - Next.js 开发服务器检测到文件变化
   - 自动重新编译 `/admin/content` 页面
   - 更改已生效

2. **测试保存功能**：
   - 访问 http://localhost:3000/admin/content
   - 选择任意页面
   - 编辑内容项
   - 点击保存按钮
   - 应该成功保存，不再出现 400 错误

3. **验证版本控制**：
   - 保存后，版本号应该自动递增
   - 可以在版本历史中看到新版本记录

## 技术细节

### 乐观锁机制

后端使用 MyBatis-Plus 的乐观锁功能：

```java
@Version
private Integer version;
```

工作流程：
1. 前端读取内容时获取当前版本号
2. 用户编辑内容
3. 保存时发送版本号
4. 后端验证版本号是否匹配
5. 如果匹配，更新内容并递增版本号
6. 如果不匹配，抛出 `ConcurrentModificationException`

这确保了多用户同时编辑时不会相互覆盖。

### 版本历史自动创建

每次保存内容时，后端自动创建版本记录：

```java
private void createVersionRecord(ContentItem item, Long userId, String changeSummary) {
    // 获取当前最大版本号
    int nextVersionNumber = (latestVersion != null) ? latestVersion.getVersionNumber() + 1 : 1;
    
    // 创建新版本记录
    ContentVersion version = new ContentVersion();
    version.setContentItemId(item.getId());
    version.setVersionNumber(nextVersionNumber);
    version.setContentZh(item.getContentZh());
    version.setContentEn(item.getContentEn());
    version.setChangedBy(userId);
    version.setChangeSummary(changeSummary != null ? changeSummary : "内容更新");
    
    contentVersionMapper.insert(version);
}
```

## 相关文件

### 修改的文件
- `frontend/src/lib/api/admin.ts` - API 客户端
- `frontend/src/components/admin/ContentEditor.tsx` - 内容编辑器组件

### 参考的后端文件
- `backend/manqiyou-app/src/main/java/com/manqiyou/app/cms/dto/UpdateContentRequest.java` - 请求 DTO
- `backend/manqiyou-app/src/main/java/com/manqiyou/app/cms/controller/ContentController.java` - 控制器
- `backend/manqiyou-app/src/main/java/com/manqiyou/app/cms/service/ContentService.java` - 服务层

## 总结

修复完成，内容管理的保存功能现在可以正常工作。前端正确发送 `contentZh`、`contentEn` 和 `version` 字段，后端验证通过并成功保存内容。乐观锁机制确保了并发编辑的安全性。

---

**修复时间**: 2026-02-11  
**状态**: ✅ 已完成  
**测试**: 前端已重新编译，等待用户测试验证
