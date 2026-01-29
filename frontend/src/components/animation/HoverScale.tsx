'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface HoverScaleProps {
  children: ReactNode
  scale?: number
  duration?: number
  className?: string
}

/**
 * Hover scale animation component
 */
export function HoverScale({
  children,
  scale = 1.05,
  duration = 0.3,
  className,
}: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{
        scale,
        transition: { duration, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
