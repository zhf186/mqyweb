/**
 * Image Optimization Utilities
 * 
 * Provides helpers for optimized image loading with Next.js Image component
 */

/**
 * Image quality presets for different use cases
 */
export const IMAGE_QUALITY = {
  LOW: 50,      // Thumbnails, previews
  MEDIUM: 75,   // Standard content images
  HIGH: 90,     // Hero images, featured content
  MAX: 95,      // Critical brand images
} as const

/**
 * Common image sizes configurations
 */
export const IMAGE_SIZES = {
  // Full width images
  FULL: '100vw',
  
  // Hero sections
  HERO: '100vw',
  
  // Grid layouts
  GRID_2: '(max-width: 768px) 100vw, 50vw',
  GRID_3: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  GRID_4: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw',
  
  // Card images
  CARD: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  
  // Thumbnails
  THUMBNAIL: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  
  // Icons and small images
  ICON: '128px',
  LOGO: '256px',
} as const

/**
 * Image loading strategies
 */
export const IMAGE_LOADING = {
  EAGER: 'eager' as const,  // Load immediately (above-the-fold)
  LAZY: 'lazy' as const,    // Load when near viewport (below-the-fold)
}

/**
 * Get optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(options: {
  priority?: boolean
  quality?: number
  sizes?: string
  loading?: 'eager' | 'lazy'
}) {
  const {
    priority = false,
    quality = IMAGE_QUALITY.MEDIUM,
    sizes = IMAGE_SIZES.FULL,
    loading = IMAGE_LOADING.LAZY,
  } = options

  return {
    quality,
    sizes,
    loading: priority ? IMAGE_LOADING.EAGER : loading,
    ...(priority && { priority: true }),
  }
}

/**
 * Get image props for hero sections
 */
export function getHeroImageProps() {
  return getOptimizedImageProps({
    priority: true,
    quality: IMAGE_QUALITY.HIGH,
    sizes: IMAGE_SIZES.HERO,
  })
}

/**
 * Get image props for grid layouts
 */
export function getGridImageProps(columns: 2 | 3 | 4 = 3) {
  const sizesMap = {
    2: IMAGE_SIZES.GRID_2,
    3: IMAGE_SIZES.GRID_3,
    4: IMAGE_SIZES.GRID_4,
  }

  return getOptimizedImageProps({
    quality: IMAGE_QUALITY.MEDIUM,
    sizes: sizesMap[columns],
  })
}

/**
 * Get image props for card components
 */
export function getCardImageProps() {
  return getOptimizedImageProps({
    quality: IMAGE_QUALITY.MEDIUM,
    sizes: IMAGE_SIZES.CARD,
  })
}

/**
 * Get image props for thumbnails
 */
export function getThumbnailImageProps() {
  return getOptimizedImageProps({
    quality: IMAGE_QUALITY.LOW,
    sizes: IMAGE_SIZES.THUMBNAIL,
  })
}

/**
 * Get image props for logos and icons
 */
export function getLogoImageProps() {
  return getOptimizedImageProps({
    quality: IMAGE_QUALITY.MAX,
    sizes: IMAGE_SIZES.LOGO,
  })
}

/**
 * Preload critical images
 * Use this for images that should be loaded as soon as possible
 */
export function preloadImage(src: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  }
}

/**
 * Get blur data URL for placeholder
 * This creates a tiny base64 encoded image for blur-up effect
 */
export function getBlurDataURL(width = 10, height = 10): string {
  const canvas = typeof document !== 'undefined' 
    ? document.createElement('canvas') 
    : null
  
  if (!canvas) {
    // Return a simple gray placeholder for SSR
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMjAyMDIwIi8+PC9zdmc+'
  }

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    // Create a gradient for a more natural blur effect
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#1a1a1a')
    gradient.addColorStop(1, '#2a2a2a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  return canvas.toDataURL()
}
