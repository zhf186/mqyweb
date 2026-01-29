import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text' | 'card'
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        variant === 'default' && 'rounded-md',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4 w-full rounded',
        variant === 'card' && 'h-48 w-full rounded-2xl',
        className
      )}
      {...props}
    />
  )
}

function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      <Skeleton variant="card" />
      <div className="space-y-2 px-2">
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
    </div>
  )
}

function SkeletonText({ 
  lines = 3, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          className={cn(
            i === lines - 1 && 'w-2/3'
          )} 
        />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonText }
