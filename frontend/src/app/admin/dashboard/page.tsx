'use client'

/**
 * Dashboard Page
 * 仪表盘页面
 */

import { useAdminUser } from '@/stores/admin-auth'
import { Card } from '@/components/ui/card'
import { StatCard } from '@/components/admin/StatCard'
import { RecentUpdates } from '@/components/admin/RecentUpdates'
import { TodoList } from '@/components/admin/TodoList'
import { statisticsApi } from '@/lib/api/admin'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface DashboardTodoItem {
  id: string
  title: string
  description: string
  count: number
  priority: 'high' | 'medium' | 'low'
  link: string
}

interface DashboardUpdateItem {
  id: string
  type: 'content' | 'asset' | 'route' | 'product'
  title: string
  action: string
  user: string
  timestamp: string
}

interface DashboardData {
  totalPages: number
  totalAssets: number
  totalRoutes: number
  totalProducts: number
  recentUpdates: DashboardUpdateItem[]
  todoItems: DashboardTodoItem[]
}

const toNumber = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : Number(value) || 0

const normalizeUpdateType = (value: unknown): DashboardUpdateItem['type'] => {
  if (value === 'asset' || value === 'route' || value === 'product') {
    return value
  }
  return 'content'
}

const normalizeRecentUpdates = (value: unknown): DashboardUpdateItem[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item: any, index: number) => ({
    id: String(item?.id ?? `${item?.type ?? 'update'}-${index}`),
    type: normalizeUpdateType(item?.type),
    title: String(item?.title ?? 'Untitled'),
    action: String(item?.action ?? '更新'),
    user: String(item?.user ?? item?.updatedBy ?? 'System'),
    timestamp: String(item?.timestamp ?? item?.updatedAt ?? new Date().toISOString()),
  }))
}

const normalizeTodoItems = (value: unknown): DashboardTodoItem[] => {
  if (Array.isArray(value)) {
    return value as DashboardTodoItem[]
  }

  if (!value || typeof value !== 'object') {
    return []
  }

  const source = value as { missingTranslations?: unknown; pendingDrafts?: unknown }
  const missingTranslations = toNumber(source.missingTranslations)
  const pendingDrafts = toNumber(source.pendingDrafts)

  const items: DashboardTodoItem[] = []

  if (missingTranslations > 0) {
    items.push({
      id: 'missing-translations',
      title: '待翻译内容',
      description: '存在缺少中英文翻译的内容项',
      count: missingTranslations,
      priority: 'high',
      link: '/admin/content',
    })
  }

  if (pendingDrafts > 0) {
    items.push({
      id: 'pending-drafts',
      title: '待发布草稿',
      description: '路线或商品存在待发布草稿',
      count: pendingDrafts,
      priority: 'medium',
      link: '/admin/routes',
    })
  }

  return items
}

export default function DashboardPage() {
  const user = useAdminUser()
  const { toast } = useToast()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const response = await statisticsApi.getDashboard()
      const payload = (response as any)?.data ?? response
      setData({
        totalPages: toNumber(payload?.totalPages),
        totalAssets: toNumber(payload?.totalAssets),
        totalRoutes: toNumber(payload?.totalRoutes),
        totalProducts: toNumber(payload?.totalProducts),
        recentUpdates: normalizeRecentUpdates(payload?.recentUpdates),
        todoItems: normalizeTodoItems(payload?.todoItems),
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast({
        title: '加载失败',
        description: '无法加载仪表盘数据',
        variant: 'destructive'
      })
      // Set default data on error
      setData({
        totalPages: 7,
        totalAssets: 0,
        totalRoutes: 0,
        totalProducts: 0,
        recentUpdates: [],
        todoItems: []
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">仪表盘</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
          欢迎回来，{user?.fullName || user?.username}！
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        <StatCard
          title="总页面数"
          value={loading ? '-' : data?.totalPages || 0}
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          title="图片资源"
          value={loading ? '-' : data?.totalAssets || 0}
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          title="骑游路线"
          value={loading ? '-' : data?.totalRoutes || 0}
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          }
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatCard
          title="在地好物"
          value={loading ? '-' : data?.totalProducts || 0}
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Recent Updates and Todo List */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-6">
        <RecentUpdates updates={data?.recentUpdates || []} />
        <TodoList items={data?.todoItems || []} />
      </div>

      {/* Quick Actions */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">快速操作</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          <a
            href="/admin/content"
            className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">编辑内容</p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">管理页面内容</p>
            </div>
          </a>

          <a
            href="/admin/assets"
            className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">上传图片</p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">管理图片资源</p>
            </div>
          </a>

          <a
            href="/admin/routes"
            className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">创建路线</p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">添加新路线</p>
            </div>
          </a>

          <a
            href="/admin/products"
            className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">管理商品</p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">在地好物管理</p>
            </div>
          </a>
        </div>
      </Card>

      {/* Welcome Message */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">欢迎使用漫骑游 CMS</h2>
        <p className="text-sm sm:text-base text-gray-600">
          这是您的内容管理系统仪表盘。您可以在这里管理网站的所有内容、图片、路线和商品。
        </p>
        <p className="mt-2 text-xs sm:text-sm text-gray-500">
          提示：使用左侧导航菜单快速访问各个功能模块。
        </p>
      </Card>
    </div>
  )
}
