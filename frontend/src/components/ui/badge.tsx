import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        // 品牌徽章
        brand:
          'border-transparent bg-brand-primary text-white',
        'brand-outline':
          'border-brand-primary text-brand-primary bg-transparent',
        'brand-soft':
          'border-transparent bg-brand-primary/10 text-brand-primary',
        // 金色徽章
        gold:
          'border-transparent bg-brand-accent text-brand-primary-900',
        'gold-outline':
          'border-brand-accent text-brand-accent bg-transparent',
        // 科技蓝徽章
        tech:
          'border-transparent bg-brand-secondary text-white',
        'tech-soft':
          'border-transparent bg-brand-secondary/10 text-brand-secondary',
        // 状态徽章
        success:
          'border-transparent bg-green-500 text-white',
        warning:
          'border-transparent bg-yellow-500 text-white',
        info:
          'border-transparent bg-blue-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
