'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  variant?: 'default' | 'brand' | 'gradient'
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { 
      className, 
      orientation = 'horizontal', 
      decorative = true,
      variant = 'default',
      ...props 
    },
    ref
  ) => (
    <div
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        'shrink-0',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        variant === 'default' && 'bg-border',
        variant === 'brand' && 'bg-brand-primary',
        variant === 'gradient' && 'bg-gradient-to-r from-transparent via-brand-primary to-transparent',
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = 'Separator'

export { Separator }
