# 性能优化文档 / Performance Optimization Guide

本文档记录了漫骑游网站的性能优化措施和最佳实践。

## 已实施的优化措施

### 1. 图片优化 (Image Optimization)

#### Next.js Image 组件配置
- **格式优化**: 自动转换为 AVIF/WebP 格式，减小文件大小 60-80%
- **响应式图片**: 根据设备尺寸自动提供合适大小的图片
- **懒加载**: 非首屏图片延迟加载，减少初始加载时间
- **质量设置**: 默认质量 75，在视觉质量和文件大小间取得平衡
- **缓存策略**: 图片缓存 1 年，减少重复请求

#### 使用建议
```tsx
import Image from 'next/image'

// 首屏关键图片 - 使用 priority
<Image
  src="/brand_assets/hero.jpg"
  alt="Hero"
  fill
  priority
  quality={85}
/>

// 非首屏图片 - 自动懒加载
<Image
  src="/brand_assets/content.jpg"
  alt="Content"
  width={800}
  height={600}
  loading="lazy"
/>
```

### 2. 代码分割与打包优化

#### 自动优化
- **SWC 编译器**: 使用 Rust 编写的超快编译器
- **Tree Shaking**: 自动移除未使用的代码
- **代码压缩**: 生产环境自动压缩 JS/CSS
- **包导入优化**: 优化 lucide-react, framer-motion 等大型库的导入

#### 动态导入
```tsx
import dynamic from 'next/dynamic'

// 延迟加载非关键组件
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // 仅客户端渲染
})
```

### 3. 字体优化

- **字体预加载**: 关键字体文件预加载
- **字体显示策略**: 使用 `display: swap` 避免 FOIT
- **字体子集**: 仅加载需要的字符集
- **回退字体**: 配置系统字体作为回退

### 4. 缓存策略

#### 静态资源缓存
```
/brand_assets/* → Cache-Control: public, max-age=31536000, immutable
```

#### 页面缓存
- 静态页面: 构建时生成，CDN 缓存
- 动态页面: ISR (Incremental Static Regeneration)

### 5. 网络优化

#### DNS 预解析
```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
```

#### 资源预连接
```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

#### HTTP/2 推送
- 利用 HTTP/2 多路复用
- 并行加载多个资源

### 6. 渲染优化

#### 服务端渲染 (SSR)
- 首屏快速渲染
- SEO 友好

#### 客户端渲染 (CSR)
- 交互组件使用 `'use client'`
- 减少 JavaScript 包大小

#### 静态生成 (SSG)
- 营销页面静态生成
- 构建时预渲染

### 7. JavaScript 优化

#### 生产环境优化
- 移除 console.log (保留 error/warn)
- 移除 React 开发工具属性
- 禁用 Source Maps

#### 包大小优化
```bash
# 分析包大小
npm run build
npx @next/bundle-analyzer
```

## 性能指标目标

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 其他指标
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.8s
- **Speed Index**: < 3.4s

## 性能监控

### 开发环境
```bash
# Lighthouse 审计
npm run build
npm start
# 在 Chrome DevTools 中运行 Lighthouse
```

### 生产环境
- 使用 Google Analytics 4
- 配置 Web Vitals 监控
- 设置性能预算警报

## 最佳实践

### 图片使用
1. ✅ 使用 Next.js Image 组件
2. ✅ 为首屏图片添加 `priority`
3. ✅ 提供合适的 width/height 避免 CLS
4. ✅ 使用 `fill` 属性处理响应式背景图
5. ❌ 避免使用原生 `<img>` 标签

### 组件优化
1. ✅ 使用 React.memo() 避免不必要的重渲染
2. ✅ 使用 useMemo/useCallback 缓存计算结果
3. ✅ 延迟加载非关键组件
4. ❌ 避免在渲染函数中创建新对象/数组

### 数据获取
1. ✅ 使用 React Query 缓存 API 响应
2. ✅ 实现分页/虚拟滚动处理大列表
3. ✅ 使用 SWR 实现乐观更新
4. ❌ 避免在客户端获取大量数据

### CSS 优化
1. ✅ 使用 Tailwind CSS 的 JIT 模式
2. ✅ 移除未使用的 CSS
3. ✅ 使用 CSS 变量实现主题
4. ❌ 避免内联样式

## 持续优化

### 定期检查
- [ ] 每月运行 Lighthouse 审计
- [ ] 监控 Core Web Vitals 指标
- [ ] 检查包大小变化
- [ ] 审查第三方脚本影响

### 优化机会
- [ ] 实施 Service Worker 离线缓存
- [ ] 使用 CDN 加速静态资源
- [ ] 实现关键 CSS 内联
- [ ] 优化第三方脚本加载

## 工具推荐

### 性能分析
- Chrome DevTools Performance
- Lighthouse
- WebPageTest
- GTmetrix

### 包分析
- @next/bundle-analyzer
- webpack-bundle-analyzer
- source-map-explorer

### 监控服务
- Vercel Analytics
- Google Analytics 4
- Sentry Performance Monitoring

## 参考资源

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
