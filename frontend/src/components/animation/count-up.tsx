'use client'

import * as React from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  delay?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  once?: boolean
}

export function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  once = true,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, amount: 0.5 })
  const [hasAnimated, setHasAnimated] = React.useState(false)

  const springValue = useSpring(start, {
    duration: duration * 1000,
    bounce: 0,
  })

  const displayValue = useTransform(springValue, (value) => {
    return `${prefix}${value.toFixed(decimals)}${suffix}`
  })

  React.useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        springValue.set(end)
        setHasAnimated(true)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, hasAnimated, springValue, end, delay])

  return (
    <motion.span ref={ref} className={cn('tabular-nums', className)}>
      {displayValue}
    </motion.span>
  )
}

// Stats counter with label
interface StatCounterProps extends CountUpProps {
  label: string
  labelClassName?: string
}

export function StatCounter({
  label,
  labelClassName,
  className,
  ...countUpProps
}: StatCounterProps) {
  return (
    <div className="text-center">
      <div className={cn('text-4xl font-bold font-en-display', className)}>
        <CountUp {...countUpProps} />
      </div>
      <p className={cn('mt-2 text-sm text-muted-foreground', labelClassName)}>
        {label}
      </p>
    </div>
  )
}
