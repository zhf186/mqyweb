# 可视化编辑器 iframe 加载修复

## 问题
可视化编辑器页面打开后,iframe尝试加载 `/home` 页面,返回404错误。

## 根本原因
PreviewFrame组件直接使用 `pageSlug` 构建URL,但CMS中的页面slug与前端路由不匹配:
- CMS中首页的slug是 `"home"`
- 前端首页的路由是 `/`

## 修复方案
在 `PreviewFrame.tsx` 中添加了页面slug到前端路由的映射:

```typescript
const getPageRoute = (slug: string): string => {
  // Map CMS page slugs to frontend routes
  const routeMap: Record<string, string> = {
    'home': '/',
    'about': '/about',
    'routes': '/routes',
    'ebike': '/ebike',
    'goods': '/goods',
    'community': '/community',
    'partners': '/partners',
  }
  
  return routeMap[slug] || `/${slug}`
}

const pageRoute = getPageRoute(pageSlug)
const iframeUrl = `${pageRoute}?editMode=${editMode}&locale=${locale}`
```

## 修改的文件
- ✅ `frontend/src/components/admin/visual-editor/PreviewFrame.tsx`

## 测试步骤

1. **刷新浏览器** - 等待Next.js重新编译
2. **返回内容管理页面** - http://localhost:3000/admin/content
3. **选择首页** - 从下拉框选择"首页"
4. **点击"可视化编辑"按钮**
5. **验证iframe加载** - 应该看到首页内容正确加载

## 预期结果

### 成功情况
- iframe应该加载 `/?editMode=false&locale=zh`
- 首页内容应该正确显示在iframe中
- 不应该有404错误

### 控制台输出
应该看到:
```
可视化编辑按钮被点击
selectedPage: undefined
selectedPageId: 1
pages: (7) [{…}, {…}, ...]
通过ID查找页面: {id: 1, slug: 'home', ...}
使用page.slug: home
```

然后iframe应该成功加载,不应该有404错误。

## 其他页面映射

修复方案包含了所有主要页面的映射:
- `home` → `/` (首页)
- `about` → `/about` (关于页面)
- `routes` → `/routes` (路线页面)
- `ebike` → `/ebike` (电动车页面)
- `goods` → `/goods` (商品页面)
- `community` → `/community` (社区页面)
- `partners` → `/partners` (合作伙伴页面)

如果有新页面,会使用默认映射 `/${slug}`。

## 下一步

修复完成后,可以继续测试可视化编辑器的其他功能:
1. 切换编辑模式
2. 检测可编辑元素
3. 编辑文字内容
4. 编辑图片
5. 实时预览更新

## 状态
- ✅ 按钮点击问题已修复
- ✅ iframe URL映射已修复
- ⏳ 等待用户测试确认
