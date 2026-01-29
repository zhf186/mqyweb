'use client'

import * as React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  speed?: number // Parallax speed: positive = slower, negative = faster
  scale?: number // Scale factor on scroll
}

export function ParallaxImage({
  src,
  alt,
  className,
  containerClassName,
  speed = 0.5,
  scale = 1.1,
}: ParallaxImageProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [scale, 1, scale])

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', containerClassName)}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: imageScale }}
        className={cn('h-full w-full object-cover', className)}
      />
    </div>
  )
}

// Parallax section with background
interface ParallaxSectionProps {
  children: React.ReactNode
  backgroundImage: string
  className?: string
  overlayClassName?: string
  speed?: number
}

export function ParallaxSection({
  children,
  backgroundImage,
  className,
  overlayClassName,
  speed = 0.3,
}: ParallaxSectionProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {/* Parallax Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 -top-[20%] h-[140%]"
      >
        <img
          src={backgroundImage}
          alt=""
          className="h-full w-full object-cover"
        />
      </motion.div>
      
      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-black/40',
          overlayClassName
        )}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
