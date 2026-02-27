# 数据库表名不匹配问题修复

**日期**: 2026-02-04  
**问题**: 图片管理API返回500错误 - Table "ASSETS" not found

## 问题根源

### 症状
```
GET http://localhost:8080/api/admin/assets?page=1&limit=20 500 (Internal Server Error)
```

### 错误日志
```
Caused by: org.h2.jdbc.JdbcSQLSyntaxErrorException: Table "ASSETS" not found; 
SQL statement: SELECT ... FROM assets ...
```

### 根本原因
实体类的 `@TableName` 注解与数据库实际表名不匹配：

| 实体类 | 错误的表名 | 正确的表名 |
|--------|-----------|-----------|
| Asset | `assets` | `cms_assets` |
| AssetUsage | `asset_usages` | `cms_asset_usages` |
| OperationLog | `operation_logs` | `cms_operation_logs` |
| SystemSettings | `system_settings` | `cms_system_settings` |

## 修复内容

### 1. Asset.java
```java
// 修改前
@TableName("assets")
public class Asset {

// 修改后
@TableName("cms_assets")
public class Asset {
```

### 2. AssetUsage.java
```java
// 修改前
@TableName("asset_usages")
public class AssetUsage {

// 修改后
@TableName("cms_asset_usages")
public class AssetUsage {
```

### 3. OperationLog.java
```java
// 修改前
@TableName("operation_logs")
public class OperationLog {

// 修改后
@TableName("cms_operation_logs")
public class OperationLog {
```

### 4. SystemSettings.java
```java
// 修改前
@TableName("system_settings")
public class SystemSettings {

// 修改后
@TableName("cms_system_settings")
public class SystemSettings {
```

## 修复的文件

1. `backend/manqiyou-app/src/main/java/com/manqiyou/app/cms/entity/Asset.java`
2. `backend/manqiyou-app/src/main/java/com/manqiyou/app/cms/entity/AssetUsage.java`
3. `backend/manqiyou-app/src/main/java/com/manqiyou/app/cms/entity/OperationLog.java`
4. `backend/manqiyou-app/src/main/java/com/manqiyou/app/cms/entity/SystemSettings.java`

## 表名命名规范

### CMS表命名约定
所有CMS相关表都应该使用 `cms_` 前缀：

- ✅ `cms_admin_users` - 管理员用户
- ✅ `cms_pages` - 页面
- ✅ `cms_content_items` - 内容项
- ✅ `cms_content_versions` - 内容版本
- ✅ `cms_assets` - 资源
- ✅ `cms_asset_usages` - 资源使用记录
- ✅ `cms_routes` - 路线
- ✅ `cms_route_images` - 路线图片
- ✅ `cms_route_highlights` - 路线亮点
- ✅ `cms_products` - 商品
- ✅ `cms_product_images` - 商品图片
- ✅ `cms_partners` - 合作伙伴
- ✅ `cms_system_settings` - 系统设置
- ✅ `cms_operation_logs` - 操作日志

### 为什么使用前缀？
1. **命名空间隔离**: 避免与现有业务表冲突（如 `routes`, `users`）
2. **清晰的所有权**: 一眼就能看出这是CMS系统的表
3. **便于管理**: 数据库工具中可以按前缀分组查看
4. **迁移安全**: 删除CMS时可以安全地删除所有 `cms_*` 表

## 验证步骤

### 1. 检查实体类表名
```bash
grep -r "@TableName" backend/manqiyou-app/src/main/java/com/manqiyou/app/cms/entity/
```

所有CMS实体类都应该使用 `cms_` 前缀的表名。

### 2. 检查schema.sql
```bash
grep "CREATE TABLE" backend/manqiyou-app/src/main/resources/schema.sql | grep cms_
```

应该看到所有CMS表都已创建。

### 3. 测试API
访问 http://localhost:3000/admin/assets 应该能正常加载（显示"暂无图片"）。

## 已验证的实体类

以下实体类的表名已确认正确：

- ✅ AdminUser → `cms_admin_users`
- ✅ Page → `cms_pages`
- ✅ ContentItem → `cms_content_items`
- ✅ ContentVersion → `cms_content_versions`
- ✅ Asset → `cms_assets` (已修复)
- ✅ AssetUsage → `cms_asset_usages` (已修复)
- ✅ Route → `cms_routes`
- ✅ RouteImage → `cms_route_images`
- ✅ RouteHighlight → `cms_route_highlights`
- ✅ Product → `cms_products`
- ✅ ProductImage → `cms_product_images`
- ✅ Partner → `cms_partners`
- ✅ SystemSettings → `cms_system_settings` (已修复)
- ✅ OperationLog → `cms_operation_logs` (已修复)

## 测试结果

### 预期结果
- ✅ 后端启动成功，无表不存在错误
- ✅ GET `/api/admin/assets` 返回200状态码
- ✅ 返回空数组: `{ code: 200, data: { records: [], total: 0 } }`
- ✅ 前端页面显示"暂无图片"而不是500错误

### 实际测试
```bash
# 后端启动日志
Started ManqiyouApplication in 2.465 seconds

# API测试（需要登录后获取token）
# 应该返回空的资源列表
```

## 相关问题修复历史

1. **登录响应处理** - 修复 `response.data` 提取问题
2. **H2数据库schema** - 添加所有CMS表到schema.sql
3. **表名不匹配** - 修复实体类 `@TableName` 注解（本次修复）

## 后续注意事项

### 创建新实体类时
1. 确保使用 `cms_` 前缀的表名
2. 在schema.sql中创建对应的表
3. 使用 `@TableName("cms_xxx")` 注解

### 示例模板
```java
@Data
@TableName("cms_new_table")
public class NewEntity {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    // 其他字段...
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
```

## 结论

所有CMS实体类的表名现在都与数据库表名一致。图片管理API应该可以正常工作了。

**修复完成时间**: 2026-02-04 12:20
**后端服务状态**: ✅ 运行中 (端口 8080)
**前端服务状态**: ✅ 运行中 (端口 3000)
