# 图片管理分类修复

## 修复时间
2026-02-14

## 用户需求
后台管理的图片管理，分类地方取消商品。

## 修复内容

### 文件修改
**文件**: `frontend/src/app/admin/assets/page.tsx`

**修改前**:
```typescript
const CATEGORIES = [
  { value: 'all', label: '全部分类' },
  { value: 'home', label: '首页' },
  { value: 'about', label: '关于我们' },
  { value: 'ebike', label: 'E-BIKE页面' },
  { value: 'routes', label: '骑行路线' },
  { value: 'goods', label: '在地好物' },
  { value: 'community', label: '社群活动' },
  { value: 'partners', label: '合作伙伴' },
  { value: 'products', label: '商品' },  // ← 已移除
]
```

**修改后**:
```typescript
const CATEGORIES = [
  { value: 'all', label: '全部分类' },
  { value: 'home', label: '首页' },
  { value: 'about', label: '关于我们' },
  { value: 'ebike', label: 'E-BIKE页面' },
  { value: 'routes', label: '骑行路线' },
  { value: 'goods', label: '在地好物' },
  { value: 'community', label: '社群活动' },
  { value: 'partners', label: '合作伙伴' },
]
```

## 影响范围

### 前端界面
- 图片管理页面的分类筛选下拉菜单不再显示"商品"选项
- 现有的"商品"分类图片仍然存在于数据库中，但无法通过前端筛选器查看
- 用户可以通过"全部分类"查看所有图片，包括之前上传的"商品"分类图片

### 后端数据
- 后端 API 不受影响，仍然支持 `products` 分类
- 数据库中的 `products` 分类图片保持不变
- 如需完全移除，需要额外的数据迁移

## 测试步骤

1. 启动前端开发服务器:
   ```bash
   cd frontend
   npm run dev
   ```

2. 访问图片管理页面:
   ```
   http://localhost:3000/admin/assets
   ```

3. 检查分类筛选器:
   - ✅ 应该看到 8 个分类选项（不包括"商品"）
   - ✅ 分类列表应该是：全部分类、首页、关于我们、E-BIKE页面、骑行路线、在地好物、社群活动、合作伙伴

4. 测试筛选功能:
   - ✅ 选择不同分类，确认筛选正常工作
   - ✅ 上传新图片时，分类选择器也不应显示"商品"选项

## 注意事项

### 如果需要恢复"商品"分类
只需在 `CATEGORIES` 数组中重新添加:
```typescript
{ value: 'products', label: '商品' },
```

### 如果需要清理数据库中的"商品"分类图片
需要执行以下操作:
1. 备份数据库
2. 运行 SQL 删除或更新语句
3. 清理对应的文件存储

## 修复完成
✅ 已从图片管理分类中移除"商品"选项
✅ 前端界面更新完成
✅ 不影响现有功能和数据
