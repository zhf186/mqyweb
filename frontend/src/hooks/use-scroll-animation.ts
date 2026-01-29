'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

/**
 * Hook for triggering animations on scroll
 * @param options - IntersectionObserver options
 * @returns ref to attach to element and isVisible state
 */
export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options

  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible }
}

/**
 * Hook for staggered animations on multiple children
 * @param count - Number of children to animate
 * @param options - IntersectionObserver options
 * @returns ref and visibility states for each child
 */
export function useStaggerAnimation(
  count: number,
  options: ScrollAnimationOptions = {}
) {
  const { ref, isVisible } = useScrollAnimation(options)
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(count).fill(false)
  )

  useEffect(() => {
    if (isVisible) {
      const delays = Array.from({ length: count }, (_, i) => i * 100)
      delays.forEach((delay, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => {
            const next = [...prev]
            next[index] = true
            return next
          })
        }, delay)
      })
    }
  }, [isVisible, count])

  return { ref, visibleItems }
}

/**
 * Hook for parallax scroll effect
 * @param speed - Parallax speed multiplier (0-1)
 * @returns ref and transform style
 */
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.scrollY
      const elementTop = rect.top + scrolled
      const windowHeight = window.innerHeight
      
      if (scrolled + windowHeight > elementTop && scrolled < elementTop + rect.height) {
        const parallaxOffset = (scrolled - elementTop) * speed
        setOffset(parallaxOffset)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [speed])

  return {
    ref,
    style: {
      transform: `translateY(${offset}px)`,
    },
  }
}

/**
 * Hook for scroll progress indicator
 * @returns scroll progress (0-1)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollable = documentHeight - windowHeight
      const scrolled = scrollTop / scrollable

      setProgress(Math.min(Math.max(scrolled, 0), 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return progress
}
