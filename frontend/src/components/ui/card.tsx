import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: boolean
    glass?: boolean
  }
>(({ className, hover = false, glass = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border bg-card text-card-foreground',
      hover && 'card-hover cursor-pointer',
      glass ? 'glass' : 'shadow-brand-sm',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight font-zh-heading',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// 特色卡片 - 用于展示五大板块等
const FeatureCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode
    title: string
    description?: string
  }
>(({ className, icon, title, description, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group relative overflow-hidden rounded-2xl bg-white p-6 shadow-brand-sm',
      'transition-all duration-300 ease-out',
      'hover:-translate-y-2 hover:shadow-brand-lg',
      'border border-transparent hover:border-brand-primary/20',
      className
    )}
    {...props}
  >
    {/* 背景装饰 */}
    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    
    {/* 内容 */}
    <div className="relative z-10">
      {icon && (
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-foreground font-zh-heading">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  </div>
))
FeatureCard.displayName = 'FeatureCard'

// 图片卡片 - 用于线路展示等
const ImageCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    image: string
    title: string
    subtitle?: string
    badge?: string
    aspectRatio?: 'square' | 'video' | 'wide'
  }
>(({ className, image, title, subtitle, badge, aspectRatio = 'video', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group relative overflow-hidden rounded-2xl bg-white shadow-brand-sm',
      'transition-all duration-300 ease-out',
      'hover:-translate-y-2 hover:shadow-brand-lg',
      className
    )}
    {...props}
  >
    {/* 图片容器 */}
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatio === 'square' && 'aspect-square',
        aspectRatio === 'video' && 'aspect-video',
        aspectRatio === 'wide' && 'aspect-[2/1]'
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        loading="lazy"
        quality={75}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* 徽章 */}
      {badge && (
        <div className="absolute left-4 top-4 rounded-full bg-brand-accent px-3 py-1 text-xs font-medium text-brand-primary-900">
          {badge}
        </div>
      )}
    </div>
    
    {/* 文字内容 */}
    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
      <h3 className="text-lg font-semibold font-zh-heading">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-white/80">{subtitle}</p>
      )}
    </div>
  </div>
))
ImageCard.displayName = 'ImageCard'

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  FeatureCard,
  ImageCard,
}
