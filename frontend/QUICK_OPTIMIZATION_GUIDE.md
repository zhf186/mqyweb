# 快速优化指南 / Quick Optimization Guide

## 🚀 立即可用的优化

### 1. 使用优化的 Image 组件

#### ❌ 不推荐
```tsx
<img src="/brand_assets/hero.jpg" alt="Hero" />
```

#### ✅ 推荐
```tsx
import Image from 'next/image'

// 首屏关键图片
<Image
  src="/brand_assets/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority
  quality={85}
/>

// 非首屏图片 (自动懒加载)
<Image
  src="/brand_assets/content.jpg"
  alt="Content"
  width={800}
  height={600}
/>

// 背景图片
<Image
  src="/brand_assets/bg.jpg"
  alt="Background"
  fill
  className="object-cover"
/>
```

### 2. 动态导入重型组件

#### ❌ 不推荐
```tsx
import HeavyChart from './HeavyChart'

export default function Page() {
  return <HeavyChart data={data} />
}
```

#### ✅ 推荐
```tsx
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <div>加载中...</div>,
  ssr: false, // 仅客户端渲染
})

export default function Page() {
  return <HeavyChart data={data} />
}
```

### 3. 优化数据获取

#### ❌ 不推荐
```tsx
'use client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData)
  }, [])
  
  return <div>{data?.title}</div>
}
```

#### ✅ 推荐
```tsx
import { useQuery } from '@tanstack/react-query'

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: () => fetch('/api/data').then(res => res.json()),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  })
  
  if (isLoading) return <div>加载中...</div>
  return <div>{data?.title}</div>
}
```

### 4. 避免不必要的重渲染

#### ❌ 不推荐
```tsx
export default function Parent() {
  const [count, setCount] = useState(0)
  
  return (
    <>
      <button onClick={() => setCount(count + 1)}>+</button>
      <ExpensiveChild data={someData} />
    </>
  )
}
```

#### ✅ 推荐
```tsx
import { memo } from 'react'

const ExpensiveChild = memo(function ExpensiveChild({ data }) {
  // 只在 data 改变时重渲染
  return <div>{/* 复杂渲染 */}</div>
})

export default function Parent() {
  const [count, setCount] = useState(0)
  
  return (
    <>
      <button onClick={() => setCount(count + 1)}>+</button>
      <ExpensiveChild data={someData} />
    </>
  )
}
```

## 📊 性能检查清单

### 开发时
- [ ] 使用 Next.js Image 组件
- [ ] 首屏图片添加 `priority`
- [ ] 重型组件使用动态导入
- [ ] 使用 React Query 缓存数据
- [ ] 避免在渲染中创建新对象/数组

### 提交前
- [ ] 运行 `npm run lint`
- [ ] 检查 console 无错误
- [ ] 测试移动端响应式
- [ ] 验证图片正常加载

### 部署前
- [ ] 运行 `npm run build`
- [ ] 检查构建大小
- [ ] 运行 Lighthouse 测试
- [ ] 验证所有页面正常

## 🎯 性能目标

| 指标 | 目标值 | 当前值 |
|------|--------|--------|
| LCP | < 2.5s | 待测试 |
| FID | < 100ms | 待测试 |
| CLS | < 0.1 | 待测试 |
| FCP | < 1.8s | 待测试 |
| Lighthouse | > 90 | 待测试 |

## 🔧 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 生产环境运行
npm run start

# 分析包大小
npm run analyze

# Lighthouse 测试
npm run lighthouse

# 运行测试
npm run test
```

## 📚 更多资源

- [完整优化文档](./PERFORMANCE_OPTIMIZATION.md)
- [优化总结](./OPTIMIZATION_SUMMARY.md)
- [Next.js 文档](https://nextjs.org/docs)

## ⚡ 快速修复常见问题

### 图片加载慢
1. 确保使用 Next.js Image 组件
2. 检查图片尺寸是否过大
3. 为首屏图片添加 `priority`

### 页面加载慢
1. 检查是否有大型未优化的库
2. 使用动态导入拆分代码
3. 启用数据缓存

### 布局偏移 (CLS)
1. 为图片提供明确的 width/height
2. 为动态内容预留空间
3. 避免在已渲染内容上方插入内容

### JavaScript 包过大
1. 运行 `npm run analyze` 查看
2. 使用动态导入拆分代码
3. 检查是否导入了不必要的库

---

**提示**: 遇到问题先查看 [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)
