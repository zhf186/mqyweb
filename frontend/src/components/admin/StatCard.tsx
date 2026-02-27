'use client'

/**
 * StatCard Component
 * 统计卡片组件
 * 
 * Performance: Memoized to prevent unnecessary re-renders
 */

import { memo } from 'react'
import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: number | string
  icon: ReactNode
  iconBgColor: string
  iconColor: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export const StatCard = memo(function StatCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  trend
}: StatCardProps) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className={`mt-1 sm:mt-2 text-xs sm:text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-gray-500 ml-1">vs 上周</span>
            </p>
          )}
        </div>
        <div className="ml-3 sm:ml-4 flex-shrink-0">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
})
