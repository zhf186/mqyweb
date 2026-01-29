'use client'

import * as React from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: Direction
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  threshold?: number
}

const getVariants = (direction: Direction, distance: number): Variants => {
  const hidden: Record<string, number> = { opacity: 0 }
  
  switch (direction) {
    case 'up':
      hidden.y = distance
      break
    case 'down':
      hidden.y = -distance
      break
    case 'left':
      hidden.x = distance
      break
    case 'right':
      hidden.x = -distance
      break
    case 'none':
    default:
      break
  }

  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  }
}

export function ScrollReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const variants = getVariants(direction, distance)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// Staggered children reveal
interface StaggerRevealProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  direction?: Direction
  distance?: number
  once?: boolean
}

export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.1,
  direction = 'up',
  distance = 40,
  once = true,
}: StaggerRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.1 })

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const itemVariants = getVariants(direction, distance)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={cn(className)}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={itemVariants}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Scale reveal animation
interface ScaleRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
}

export function ScaleReveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  once = true,
}: ScaleRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
