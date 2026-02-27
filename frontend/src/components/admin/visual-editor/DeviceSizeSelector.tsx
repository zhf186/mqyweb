'use client'

/**
 * DeviceSizeSelector Component
 * 设备尺寸选择器组件
 * 
 * Features:
 * - Desktop/Tablet/Mobile size options
 * - Visual icons for each device type
 * - Active state indication
 * - Smooth transitions
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import { Monitor, Tablet, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DeviceSize } from './PreviewFrame'

interface DeviceSizeSelectorProps {
  value: DeviceSize
  onChange: (size: DeviceSize) => void
  className?: string
}

const deviceOptions = [
  {
    value: 'desktop' as DeviceSize,
    label: '桌面',
    icon: Monitor,
    width: '100%',
    description: '全宽显示',
  },
  {
    value: 'tablet' as DeviceSize,
    label: '平板',
    icon: Tablet,
    width: '768px',
    description: '768px 宽度',
  },
  {
    value: 'mobile' as DeviceSize,
    label: '手机',
    icon: Smartphone,
    width: '375px',
    description: '375px 宽度',
  },
]

export function DeviceSizeSelector({
  value,
  onChange,
  className,
}: DeviceSizeSelectorProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {deviceOptions.map((option) => {
        const Icon = option.icon
        const isActive = value === option.value

        return (
          <Button
            key={option.value}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(option.value)}
            className={cn(
              'gap-2 transition-all',
              isActive && 'shadow-sm'
            )}
            title={`${option.label} - ${option.description}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{option.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
