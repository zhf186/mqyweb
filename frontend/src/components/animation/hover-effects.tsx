'use client'

import * as React from 'react'
import { motion, type MotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

// Hover lift effect
interface HoverLiftProps extends MotionProps {
  children: React.ReactNode
  className?: string
  lift?: number
  shadow?: boolean
}

export function HoverLift({
  children,
  className,
  lift = 8,
  shadow = true,
  ...motionProps
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{
        y: -lift,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      className={cn(
        'transition-shadow duration-300',
        shadow && 'hover:shadow-brand-lg',
        className
      )}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

// Hover scale effect
interface HoverScaleProps extends MotionProps {
  children: React.ReactNode
  className?: string
  scale?: number
}

export function HoverScale({
  children,
  className,
  scale = 1.05,
  ...motionProps
}: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{
        scale,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      className={cn(className)}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

// Image zoom on hover (for cards)
interface ImageZoomProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  scale?: number
}

export function ImageZoom({
  src,
  alt,
  className,
  containerClassName,
  scale = 1.1,
}: ImageZoomProps) {
  return (
    <div className={cn('overflow-hidden', containerClassName)}>
      <motion.img
        src={src}
        alt={alt}
        whileHover={{
          scale,
          transition: { duration: 0.5, ease: 'easeOut' },
        }}
        className={cn('h-full w-full object-cover', className)}
      />
    </div>
  )
}

// Magnetic hover effect (follows cursor slightly)
interface MagneticHoverProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function MagneticHover({
  children,
  className,
  strength = 0.3,
}: MagneticHoverProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const x = (e.clientX - centerX) * strength
    const y = (e.clientY - centerY) * strength
    
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// Glow effect on hover
interface HoverGlowProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function HoverGlow({
  children,
  className,
  glowColor = 'rgba(15, 76, 58, 0.4)',
}: HoverGlowProps) {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 30px ${glowColor}`,
        transition: { duration: 0.3 },
      }}
      className={cn('rounded-xl', className)}
    >
      {children}
    </motion.div>
  )
}
