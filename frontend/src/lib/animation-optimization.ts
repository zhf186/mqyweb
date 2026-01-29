/**
 * Animation Optimization Utilities
 * 
 * Provides helpers for GPU-accelerated animations and performance optimization
 */

/**
 * CSS properties that trigger GPU acceleration
 */
export const GPU_ACCELERATED_PROPERTIES = [
  'transform',
  'opacity',
  'filter',
] as const

/**
 * CSS properties that should be avoided in animations (cause reflow/repaint)
 */
export const EXPENSIVE_PROPERTIES = [
  'width',
  'height',
  'top',
  'left',
  'margin',
  'padding',
  'border',
] as const

/**
 * Force GPU acceleration on an element
 */
export function enableGPUAcceleration(element: HTMLElement): void {
  element.style.transform = 'translateZ(0)'
  element.style.willChange = 'transform, opacity'
  element.style.backfaceVisibility = 'hidden'
  element.style.perspective = '1000px'
}

/**
 * Remove GPU acceleration hint after animation
 */
export function disableGPUAcceleration(element: HTMLElement): void {
  element.style.willChange = 'auto'
}

/**
 * Optimized animation frame request
 */
export function requestAnimationFrameOptimized(
  callback: FrameRequestCallback
): number {
  if (typeof window === 'undefined') return 0

  // Use requestAnimationFrame with fallback
  const raf = window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame ||
    ((cb: FrameRequestCallback) => window.setTimeout(cb, 1000 / 60))

  return raf(callback)
}

/**
 * Cancel animation frame
 */
export function cancelAnimationFrameOptimized(id: number): void {
  if (typeof window === 'undefined') return

  const caf = window.cancelAnimationFrame || 
    window.webkitCancelAnimationFrame ||
    window.clearTimeout

  caf(id)
}

/**
 * Throttle animation to specific FPS
 */
export function throttleAnimation(
  callback: () => void,
  fps: number = 60
): () => void {
  let lastTime = 0
  const interval = 1000 / fps

  return () => {
    const now = performance.now()
    const delta = now - lastTime

    if (delta >= interval) {
      lastTime = now - (delta % interval)
      callback()
    }
  }
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get optimal animation duration based on user preferences
 */
export function getOptimalDuration(baseDuration: number): number {
  return prefersReducedMotion() ? 0 : baseDuration
}

/**
 * Framer Motion variants optimized for GPU
 */
export const OPTIMIZED_VARIANTS = {
  /**
   * Fade in with GPU acceleration
   */
  fadeIn: {
    initial: { 
      opacity: 0,
      transform: 'translateZ(0)',
    },
    animate: { 
      opacity: 1,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  },

  /**
   * Fade in from bottom with GPU acceleration
   */
  fadeInUp: {
    initial: { 
      opacity: 0,
      y: 30,
      transform: 'translateZ(0)',
    },
    animate: { 
      opacity: 1,
      y: 0,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  },

  /**
   * Scale in with GPU acceleration
   */
  scaleIn: {
    initial: { 
      opacity: 0,
      scale: 0.95,
      transform: 'translateZ(0)',
    },
    animate: { 
      opacity: 1,
      scale: 1,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  },

  /**
   * Slide in from left with GPU acceleration
   */
  slideInLeft: {
    initial: { 
      opacity: 0,
      x: -30,
      transform: 'translateZ(0)',
    },
    animate: { 
      opacity: 1,
      x: 0,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  },

  /**
   * Slide in from right with GPU acceleration
   */
  slideInRight: {
    initial: { 
      opacity: 0,
      x: 30,
      transform: 'translateZ(0)',
    },
    animate: { 
      opacity: 1,
      x: 0,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  },
} as const

/**
 * Optimized easing functions
 */
export const EASING = {
  // Smooth and natural
  SMOOTH: [0.25, 0.1, 0.25, 1],
  
  // Quick start, slow end
  EASE_OUT: [0, 0, 0.2, 1],
  
  // Slow start, quick end
  EASE_IN: [0.4, 0, 1, 1],
  
  // Slow start and end
  EASE_IN_OUT: [0.4, 0, 0.2, 1],
  
  // Bouncy effect
  BOUNCE: [0.68, -0.55, 0.265, 1.55],
  
  // Sharp and snappy
  SHARP: [0.4, 0, 0.6, 1],
} as const

/**
 * Create stagger animation for lists
 */
export function createStaggerAnimation(
  itemCount: number,
  baseDelay: number = 0.1
) {
  return {
    animate: {
      transition: {
        staggerChildren: baseDelay,
        delayChildren: 0,
      },
    },
  }
}

/**
 * Monitor animation performance
 */
export class AnimationPerformanceMonitor {
  private frameCount = 0
  private lastTime = performance.now()
  private fps = 60

  start(): void {
    this.measure()
  }

  private measure(): void {
    requestAnimationFrame(() => {
      const now = performance.now()
      const delta = now - this.lastTime

      if (delta >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / delta)
        
        if (process.env.NODE_ENV === 'development') {
          if (this.fps < 30) {
            console.warn(`Low FPS detected: ${this.fps}`)
          }
        }

        this.frameCount = 0
        this.lastTime = now
      }

      this.frameCount++
      this.measure()
    })
  }

  getFPS(): number {
    return this.fps
  }
}

/**
 * Optimize scroll-triggered animations
 */
export function createScrollAnimation(
  threshold: number = 0.1,
  rootMargin: string = '0px'
) {
  return {
    viewport: {
      once: true,
      amount: threshold,
      margin: rootMargin,
    },
  }
}

/**
 * Batch DOM reads and writes for better performance
 */
export class DOMBatcher {
  private readQueue: Array<() => void> = []
  private writeQueue: Array<() => void> = []
  private scheduled = false

  read(callback: () => void): void {
    this.readQueue.push(callback)
    this.schedule()
  }

  write(callback: () => void): void {
    this.writeQueue.push(callback)
    this.schedule()
  }

  private schedule(): void {
    if (this.scheduled) return

    this.scheduled = true
    requestAnimationFrame(() => {
      this.flush()
    })
  }

  private flush(): void {
    // Execute all reads first
    while (this.readQueue.length > 0) {
      const read = this.readQueue.shift()
      read?.()
    }

    // Then execute all writes
    while (this.writeQueue.length > 0) {
      const write = this.writeQueue.shift()
      write?.()
    }

    this.scheduled = false
  }
}

/**
 * Create a singleton DOM batcher
 */
export const domBatcher = new DOMBatcher()

/**
 * Optimize CSS animations with will-change
 */
export function optimizeForAnimation(
  element: HTMLElement,
  properties: string[] = ['transform', 'opacity']
): () => void {
  // Add will-change hint
  element.style.willChange = properties.join(', ')

  // Return cleanup function
  return () => {
    element.style.willChange = 'auto'
  }
}

/**
 * Check if hardware acceleration is available
 */
export function isHardwareAccelerated(): boolean {
  if (typeof window === 'undefined') return false

  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  
  return !!gl
}

/**
 * Get optimal animation settings based on device capabilities
 */
export function getOptimalAnimationSettings() {
  const isLowEnd = !isHardwareAccelerated()
  const reducedMotion = prefersReducedMotion()

  return {
    duration: reducedMotion ? 0 : isLowEnd ? 0.3 : 0.6,
    ease: EASING.SMOOTH,
    stagger: isLowEnd ? 0.05 : 0.1,
    enableParallax: !isLowEnd && !reducedMotion,
    enableBlur: !isLowEnd,
    maxFPS: isLowEnd ? 30 : 60,
  }
}

/**
 * Prefers reduced motion media query listener
 */
export function onReducedMotionChange(
  callback: (prefersReduced: boolean) => void
): () => void {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  
  const handler = (e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches)
  }

  // Initial call
  handler(mediaQuery)

  // Listen for changes
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }
}

/**
 * Create performance-optimized Framer Motion transition
 */
export function createOptimizedTransition(
  duration: number = 0.6,
  delay: number = 0
) {
  const settings = getOptimalAnimationSettings()

  return {
    duration: settings.duration || duration,
    delay,
    ease: settings.ease,
  }
}
