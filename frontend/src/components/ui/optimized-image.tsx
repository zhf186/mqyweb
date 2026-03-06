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
  alt,
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const resolvedSizes = props.sizes ?? (props.fill ? '100vw' : undefined)

  return (
    <div className="relative overflow-hidden">
      {lowQualitySrc && isLoading && (
        <Image
          {...props}
          src={lowQualitySrc}
          alt=""
          className={`${className} absolute inset-0 blur-sm scale-110`}
          quality={10}
          sizes={resolvedSizes}
          priority={false}
          aria-hidden="true"
        />
      )}
      <Image
        {...props}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        loading={props.priority ? undefined : 'lazy'}
        sizes={resolvedSizes}
        quality={props.quality || 85}
      />
    </div>
  )
}
