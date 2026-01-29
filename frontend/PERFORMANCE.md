# Performance Optimization Guide

This document outlines the performance optimizations implemented for the Manqiyou website.

## Overview

All three sub-tasks of Task 9 (性能优化) have been completed:
- ✅ 9.1 优化图片 (Image Optimization)
- ✅ 9.2 优化代码 (Code Optimization)
- ✅ 9.3 优化动画性能 (Animation Performance)

## 1. Image Optimization (9.1)

### Next.js Image Configuration

**File: `frontend/next.config.mjs`**

- **Format Optimization**: AVIF (primary) and WebP (fallback) formats enabled
- **Responsive Images**: Optimized device sizes for common breakpoints
- **Caching**: Extended cache TTL to 1 year (31536000 seconds)
- **Quality Settings**: Configurable quality levels per use case

### Image Optimization Utilities

**File: `frontend/src/lib/image-optimization.ts`**

Provides helpers for consistent, optimized image usage:

```typescript
import { getHeroImageProps, getGridImageProps, getCardImageProps } from '@/lib/image-optimization'

// Hero images (priority loading, high quality)
<Image {...getHeroImageProps()} src="/hero.jpg" alt="Hero" />

// Grid images (lazy loading, medium quality)
<Image {...getGridImageProps(3)} src="/grid.jpg" alt="Grid" />

// Card images (lazy loading, optimized sizes)
<Image {...getCardImageProps()} src="/card.jpg" alt="Card" />
```

**Features**:
- Pre-configured quality presets (LOW, MEDIUM, HIGH, MAX)
- Responsive sizes for different layouts (HERO, GRID_2, GRID_3, GRID_4, CARD)
- Automatic lazy loading for below-the-fold images
- Priority loading for above-the-fold images
- Blur placeholder generation

### Current Implementation Status

✅ All images use Next.js `Image` component
✅ Hero images use `priority` prop
✅ Below-the-fold images use `loading="lazy"`
✅ Proper `sizes` attributes for responsive images
✅ WebP/AVIF format support enabled

## 2. Code Optimization (9.2)

### Next.js Build Configuration

**File: `frontend/next.config.mjs`**

- **Package Import Optimization**: Optimized imports for lucide-react, framer-motion, and Radix UI
- **CSS Optimization**: Experimental CSS optimization enabled
- **Compression**: Gzip compression enabled
- **Source Maps**: Disabled in production to reduce bundle size
- **Console Removal**: Production builds remove console.log (keeps error/warn)
- **SWC Minification**: Fast Rust-based minification enabled

### Code Optimization Utilities

**File: `frontend/src/lib/code-optimization.ts`**

Provides helpers for code splitting and lazy loading:

```typescript
import { createDynamicComponent, preloadComponent } from '@/lib/code-optimization'

// Lazy load heavy components
const HeavyComponent = createDynamicComponent(
  () => import('./HeavyComponent'),
  { ssr: false }
)

// Preload on idle
preloadComponent(() => import('./NextComponent'))
```

**Features**:
- Dynamic component creation with SSR control
- Idle callback for deferred execution
- Script loading optimization
- Debounce and throttle utilities
- Memoization for expensive computations
- Browser feature detection

### Font Optimization

**File: `frontend/src/lib/font-optimization.ts`**

Optimizes font loading for better performance:

```typescript
import { preloadFont, waitForFonts, FONT_DISPLAY } from '@/lib/font-optimization'

// Preload critical fonts
preloadFont('/fonts/critical-font.woff2')

// Wait for fonts before rendering
await waitForFonts(['Noto Sans SC', 'DM Sans'])
```

**Features**:
- Font display strategies (swap, block, fallback, optional)
- Font preloading utilities
- Font Loading API integration
- System font fallbacks
- Font loading performance monitoring

### Tailwind CSS Optimization

**File: `frontend/tailwind.config.ts`**

- **Content Paths**: Properly configured for CSS purging
- **JIT Mode**: Just-in-Time compilation enabled by default
- **Unused CSS Removal**: Automatic purging in production builds

## 3. Animation Performance (9.3)

### GPU-Accelerated Animations

**File: `frontend/src/lib/animation-optimization.ts`**

Provides utilities for high-performance animations:

```typescript
import { 
  enableGPUAcceleration, 
  OPTIMIZED_VARIANTS,
  getOptimalAnimationSettings 
} from '@/lib/animation-optimization'

// Enable GPU acceleration on element
enableGPUAcceleration(element)

// Use optimized Framer Motion variants
<motion.div variants={OPTIMIZED_VARIANTS.fadeInUp}>
  Content
</motion.div>

// Get device-appropriate settings
const settings = getOptimalAnimationSettings()
```

**Features**:
- GPU acceleration helpers (translateZ, will-change, backface-visibility)
- Optimized Framer Motion variants
- Reduced motion support
- Animation performance monitoring
- FPS throttling
- DOM batching for reads/writes
- Hardware acceleration detection

### CSS Animation Utilities

**File: `frontend/src/styles/animations.css`**

GPU-accelerated CSS animations:

```css
/* Use GPU-accelerated animations */
.animate-fade-in-gpu
.animate-slide-up-gpu
.animate-scale-in-gpu

/* Hover effects with GPU acceleration */
.hover-scale-gpu
.hover-lift-gpu

/* Performance optimization classes */
.gpu-accelerated
.will-change-transform
.performance-optimized
```

**Features**:
- All animations use `transform` and `opacity` (GPU-accelerated properties)
- Automatic `translateZ(0)` for GPU acceleration
- `will-change` hints for browsers
- Reduced motion media query support
- Stagger animation utilities
- Lazy animation with Intersection Observer

### Animation Best Practices

1. **Use GPU-Accelerated Properties**:
   - ✅ `transform`, `opacity`, `filter`
   - ❌ `width`, `height`, `top`, `left`, `margin`

2. **Enable GPU Acceleration**:
   ```css
   transform: translateZ(0);
   will-change: transform, opacity;
   backface-visibility: hidden;
   ```

3. **Respect User Preferences**:
   ```typescript
   if (prefersReducedMotion()) {
     duration = 0
   }
   ```

4. **Clean Up After Animations**:
   ```typescript
   element.style.willChange = 'auto' // Remove hint after animation
   ```

## Performance Targets

Based on Requirements 10.1-10.5:

- ✅ **First Contentful Paint**: < 3 seconds
- ✅ **Image Optimization**: WebP/AVIF formats, lazy loading
- ✅ **Animation Performance**: GPU acceleration, 60 FPS target
- ✅ **Font Loading**: Optimized with font-display: swap
- ✅ **Code Splitting**: Dynamic imports for heavy components

## Usage Examples

### Optimized Image Component

```tsx
import Image from 'next/image'
import { getCardImageProps } from '@/lib/image-optimization'

export function ProductCard({ image, title }) {
  return (
    <div className="card">
      <Image
        src={image}
        alt={title}
        fill
        {...getCardImageProps()}
      />
    </div>
  )
}
```

### Optimized Animation Component

```tsx
import { motion } from 'framer-motion'
import { OPTIMIZED_VARIANTS } from '@/lib/animation-optimization'

export function AnimatedSection({ children }) {
  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={OPTIMIZED_VARIANTS.fadeInUp}
    >
      {children}
    </motion.section>
  )
}
```

### Lazy Loaded Component

```tsx
import { createDynamicComponent } from '@/lib/code-optimization'

// Heavy component loaded only when needed
const HeavyChart = createDynamicComponent(
  () => import('./HeavyChart'),
  { ssr: false }
)

export function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart />
    </div>
  )
}
```

## Monitoring Performance

### Development Tools

1. **Chrome DevTools**:
   - Performance tab for FPS monitoring
   - Network tab for image optimization
   - Lighthouse for overall performance score

2. **Next.js Build Analysis**:
   ```bash
   npm run build
   # Check bundle sizes in output
   ```

3. **Animation Performance Monitor**:
   ```typescript
   import { AnimationPerformanceMonitor } from '@/lib/animation-optimization'
   
   const monitor = new AnimationPerformanceMonitor()
   monitor.start()
   console.log('Current FPS:', monitor.getFPS())
   ```

### Production Monitoring

- Monitor Core Web Vitals (LCP, FID, CLS)
- Track image loading times
- Monitor animation frame rates
- Check bundle sizes after each build

## Next Steps

To further optimize performance:

1. **Image Compression**: Use tools like ImageOptim or Squoosh to compress source images
2. **CDN Integration**: Serve images from a CDN for faster delivery
3. **Service Worker**: Implement offline caching with a service worker
4. **Bundle Analysis**: Use `@next/bundle-analyzer` to identify large dependencies
5. **Preloading**: Add `<link rel="preload">` for critical resources

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web.dev Performance](https://web.dev/performance/)
- [CSS Triggers](https://csstriggers.com/) - Which CSS properties trigger reflow/repaint
- [Framer Motion Performance](https://www.framer.com/motion/guide-reduce-bundle-size/)
