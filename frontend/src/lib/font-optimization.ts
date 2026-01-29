/**
 * Font Optimization Utilities
 * 
 * Provides helpers for optimized font loading and display
 */

/**
 * Font display strategies
 */
export const FONT_DISPLAY = {
  // Show fallback immediately, swap when font loads (best for performance)
  SWAP: 'swap',
  
  // Wait for font, show fallback after timeout (best for avoiding layout shift)
  BLOCK: 'block',
  
  // Show fallback immediately, don't swap (best for optional fonts)
  FALLBACK: 'fallback',
  
  // Show fallback immediately, swap only if font loads quickly
  OPTIONAL: 'optional',
  
  // Show invisible text while loading (not recommended)
  AUTO: 'auto',
} as const

/**
 * Preload critical fonts
 */
export function preloadFont(
  href: string,
  options?: {
    as?: 'font'
    type?: string
    crossOrigin?: 'anonymous' | 'use-credentials'
  }
): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = options?.as || 'font'
  link.type = options?.type || 'font/woff2'
  link.crossOrigin = options?.crossOrigin || 'anonymous'
  link.href = href

  document.head.appendChild(link)
}

/**
 * Load font with Font Loading API
 */
export async function loadFontFace(
  family: string,
  source: string,
  descriptors?: FontFaceDescriptors
): Promise<FontFace | null> {
  if (typeof window === 'undefined' || !('FontFace' in window)) {
    return null
  }

  try {
    const fontFace = new FontFace(family, source, descriptors)
    const loadedFont = await fontFace.load()
    document.fonts.add(loadedFont)
    return loadedFont
  } catch (error) {
    console.error(`Failed to load font ${family}:`, error)
    return null
  }
}

/**
 * Check if a font is loaded
 */
export function isFontLoaded(family: string): boolean {
  if (typeof document === 'undefined') return false
  return document.fonts.check(`1em ${family}`)
}

/**
 * Wait for fonts to load
 */
export async function waitForFonts(
  families: string[],
  timeout = 3000
): Promise<boolean> {
  if (typeof document === 'undefined') return false

  try {
    await Promise.race([
      document.fonts.ready,
      new Promise(resolve => setTimeout(resolve, timeout)),
    ])

    return families.every(family => isFontLoaded(family))
  } catch (error) {
    console.error('Error waiting for fonts:', error)
    return false
  }
}

/**
 * Get optimal font subset for Chinese text
 */
export function getChineseSubset(text: string): string {
  // Extract unique Chinese characters
  const chineseChars = new Set(
    text.match(/[\u4e00-\u9fa5]/g) || []
  )
  
  return Array.from(chineseChars).join('')
}

/**
 * Generate font-face CSS with optimizations
 */
export function generateFontFaceCSS(options: {
  family: string
  src: string[]
  weight?: number | string
  style?: string
  display?: string
  unicodeRange?: string
}): string {
  const {
    family,
    src,
    weight = 'normal',
    style = 'normal',
    display = 'swap',
    unicodeRange,
  } = options

  const srcString = src
    .map(s => {
      if (s.endsWith('.woff2')) return `url('${s}') format('woff2')`
      if (s.endsWith('.woff')) return `url('${s}') format('woff')`
      if (s.endsWith('.ttf')) return `url('${s}') format('truetype')`
      return `url('${s}')`
    })
    .join(',\n    ')

  return `
@font-face {
  font-family: '${family}';
  src: ${srcString};
  font-weight: ${weight};
  font-style: ${style};
  font-display: ${display};
  ${unicodeRange ? `unicode-range: ${unicodeRange};` : ''}
}
  `.trim()
}

/**
 * Font loading strategies
 */
export const FONT_STRATEGIES = {
  /**
   * Critical fonts - Load immediately, block render
   */
  CRITICAL: {
    display: FONT_DISPLAY.BLOCK,
    preload: true,
    priority: 'high' as const,
  },

  /**
   * Important fonts - Load early, swap when ready
   */
  IMPORTANT: {
    display: FONT_DISPLAY.SWAP,
    preload: true,
    priority: 'high' as const,
  },

  /**
   * Standard fonts - Load normally, swap when ready
   */
  STANDARD: {
    display: FONT_DISPLAY.SWAP,
    preload: false,
    priority: 'low' as const,
  },

  /**
   * Optional fonts - Load if available quickly
   */
  OPTIONAL: {
    display: FONT_DISPLAY.OPTIONAL,
    preload: false,
    priority: 'low' as const,
  },
} as const

/**
 * System font stack for instant rendering
 */
export const SYSTEM_FONTS = {
  SANS: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ].join(', '),

  SERIF: [
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ].join(', '),

  MONO: [
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ].join(', '),

  CHINESE: [
    'PingFang SC',
    'Microsoft YaHei',
    'SimHei',
    'sans-serif',
  ].join(', '),
} as const

/**
 * Calculate font loading priority
 */
export function getFontLoadingPriority(
  isAboveFold: boolean,
  isCritical: boolean
): 'high' | 'low' {
  if (isCritical || isAboveFold) return 'high'
  return 'low'
}

/**
 * Optimize font loading performance
 */
export function optimizeFontLoading(): void {
  if (typeof document === 'undefined') return

  // Add font-display: swap to all font-face rules
  const style = document.createElement('style')
  style.textContent = `
    @font-face {
      font-display: swap;
    }
  `
  document.head.appendChild(style)

  // Preconnect to font CDNs
  const preconnect = document.createElement('link')
  preconnect.rel = 'preconnect'
  preconnect.href = 'https://fonts.googleapis.com'
  document.head.appendChild(preconnect)

  const preconnectCrossOrigin = document.createElement('link')
  preconnectCrossOrigin.rel = 'preconnect'
  preconnectCrossOrigin.href = 'https://fonts.gstatic.com'
  preconnectCrossOrigin.crossOrigin = 'anonymous'
  document.head.appendChild(preconnectCrossOrigin)
}

/**
 * Monitor font loading performance
 */
export function monitorFontLoading(): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return
  }

  document.fonts.ready.then(() => {
    const loadTime = performance.now()
    console.log(`All fonts loaded in ${loadTime.toFixed(2)}ms`)

    // Log individual font load times
    document.fonts.forEach(font => {
      console.log(`Font loaded: ${font.family} ${font.weight} ${font.style}`)
    })
  })
}
