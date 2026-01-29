/**
 * Code Optimization Utilities
 * 
 * Provides helpers for code splitting, lazy loading, and performance optimization
 */

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

/**
 * Dynamic import options for code splitting
 */
export const DYNAMIC_OPTIONS = {
  // Standard lazy loading with loading state
  LAZY: {
    loading: () => null,
    ssr: false,
  },
  
  // Lazy loading with SSR enabled
  LAZY_SSR: {
    loading: () => null,
    ssr: true,
  },
  
  // Lazy loading with custom loading component
  LAZY_WITH_LOADING: (LoadingComponent: ComponentType) => ({
    loading: LoadingComponent,
    ssr: false,
  }),
} as const

/**
 * Create a dynamically imported component with optimized settings
 */
export function createDynamicComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    ssr?: boolean
    loading?: ComponentType
  }
) {
  const { ssr = false, loading } = options || {}
  
  return dynamic(importFn, {
    loading: loading || (() => null),
    ssr,
  })
}

/**
 * Lazy load a component only when it enters the viewport
 */
export function createIntersectionComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: IntersectionObserverInit
) {
  return dynamic(importFn, {
    loading: () => null,
    ssr: false,
  })
}

/**
 * Preload a component for faster subsequent renders
 */
export function preloadComponent(
  importFn: () => Promise<any>
): void {
  if (typeof window !== 'undefined') {
    // Preload on idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        importFn()
      })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        importFn()
      }, 1)
    }
  }
}

/**
 * Defer execution until browser is idle
 */
export function runOnIdle(callback: () => void): void {
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback)
    } else {
      setTimeout(callback, 1)
    }
  }
}

/**
 * Check if code splitting is supported
 */
export function isCodeSplittingSupported(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    return 'import' in Function.prototype
  } catch {
    return false
  }
}

/**
 * Optimize third-party scripts loading
 */
export function loadScriptAsync(
  src: string,
  options?: {
    defer?: boolean
    async?: boolean
    onLoad?: () => void
    onError?: (error: Error) => void
  }
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.defer = options?.defer ?? true
    script.async = options?.async ?? true

    script.onload = () => {
      options?.onLoad?.()
      resolve()
    }

    script.onerror = () => {
      const error = new Error(`Failed to load script: ${src}`)
      options?.onError?.(error)
      reject(error)
    }

    document.head.appendChild(script)
  })
}

/**
 * Remove unused CSS classes (for debugging)
 */
export function analyzeUnusedCSS(): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return
  }

  const allClasses = new Set<string>()
  const usedClasses = new Set<string>()

  // Get all CSS classes from stylesheets
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      Array.from(sheet.cssRules).forEach(rule => {
        if (rule instanceof CSSStyleRule) {
          const selector = rule.selectorText
          const classes = selector.match(/\.[a-zA-Z0-9_-]+/g)
          classes?.forEach(cls => allClasses.add(cls.slice(1)))
        }
      })
    } catch (e) {
      // Skip cross-origin stylesheets
    }
  })

  // Get all used classes from DOM
  document.querySelectorAll('*').forEach(el => {
    el.classList.forEach(cls => usedClasses.add(cls))
  })

  const unusedClasses = Array.from(allClasses).filter(cls => !usedClasses.has(cls))
  
  if (unusedClasses.length > 0) {
    console.log('Potentially unused CSS classes:', unusedClasses)
  }
}

/**
 * Measure component render time
 */
export function measureRenderTime(
  componentName: string,
  callback: () => void
): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    callback()
    return
  }

  const startTime = performance.now()
  callback()
  const endTime = performance.now()
  
  console.log(`${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`)
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Memoize expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = func(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Check if browser supports modern features
 */
export function checkBrowserSupport() {
  if (typeof window === 'undefined') return {}

  return {
    webp: document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0,
    avif: false, // Would need async check
    intersectionObserver: 'IntersectionObserver' in window,
    requestIdleCallback: 'requestIdleCallback' in window,
    webGL: !!document.createElement('canvas').getContext('webgl'),
    serviceWorker: 'serviceWorker' in navigator,
  }
}
