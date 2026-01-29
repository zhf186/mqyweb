'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  lowQualitySrc?: string
}

/**
 * Optimized Image Component with:
 * - Lazy loading
 * - Blur placeholder
 * - Progressive loading
 * - Automatic format optimization (AVIF/WebP)
 */
export function OptimizedImage({ 
  lowQualitySrc, 
  className = '',
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative overflow-hidden">
      {lowQualitySrc && isLoading && (
        <Image
          {...props}
          src={lowQualitySrc}
          className={`${className} absolute inset-0 blur-sm scale-110`}
          quality={10}
          priority={false}
          aria-hidden="true"
        />
      )}
      <Image
        {...props}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        loading={props.priority ? undefined : 'lazy'}
        quality={props.quality || 85}
      />
    </div>
  )
}
