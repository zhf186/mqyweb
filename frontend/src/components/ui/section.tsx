'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'brand' | 'dark' | 'gradient' | 'pattern'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  container?: boolean
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    variant = 'default', 
    spacing = 'lg',
    container = true,
    containerSize = 'lg',
    children, 
    ...props 
  }, ref) => {
    const content = container ? (
      <div
        className={cn(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          containerSize === 'sm' && 'max-w-3xl',
          containerSize === 'md' && 'max-w-5xl',
          containerSize === 'lg' && 'max-w-7xl',
          containerSize === 'xl' && 'max-w-[1400px]',
          containerSize === 'full' && 'max-w-full'
        )}
      >
        {children}
      </div>
    ) : children

    return (
      <section
        ref={ref}
        className={cn(
          'relative',
          // Spacing
          spacing === 'sm' && 'py-8 md:py-12',
          spacing === 'md' && 'py-12 md:py-16',
          spacing === 'lg' && 'py-16 md:py-24',
          spacing === 'xl' && 'py-24 md:py-32',
          // Variants
          variant === 'default' && 'bg-background',
          variant === 'brand' && 'bg-brand-primary text-white',
          variant === 'dark' && 'bg-foreground text-background',
          variant === 'gradient' && 'bg-gradient-brand',
          variant === 'pattern' && 'bg-pattern-hexagon',
          className
        )}
        {...props}
      >
        {content}
      </section>
    )
  }
)
Section.displayName = 'Section'

export { Section }
