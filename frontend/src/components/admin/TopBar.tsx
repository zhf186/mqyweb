'use client'

/**
 * TopBar Component
 * 顶部工具栏
 * 
 * Features:
 * - Global search
 * - Notifications
 * - User info and menu
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuthStore, useAdminUser } from '@/stores/admin-auth'
import { authApi } from '@/lib/api/admin'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { User, LogOut, Settings, Search, Bell } from 'lucide-react'

export function TopBar() {
  const router = useRouter()
  const { toast } = useToast()
  const user = useAdminUser()
  const logout = useAdminAuthStore((state) => state.logout)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications] = useState([
    // Mock notifications - will be replaced with real data
    { id: '1', title: '新的待审核内容', message: '有3个内容项等待审核', time: '5分钟前', unread: true },
    { id: '2', title: '图片上传完成', message: '10张图片已成功上传', time: '1小时前', unread: true },
  ])

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Ignore logout API errors
      console.error('Logout error:', error)
    } finally {
      // Always clear local state and redirect
      logout()
      toast({
        title: '已登出',
        description: '您已成功登出系统',
      })
      router.push('/admin/login')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results page or show search modal
      toast({
        title: '搜索功能',
        description: `搜索: ${searchQuery}`,
      })
      // TODO: Implement actual search
    }
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left side - Global Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="搜索内容、路线、商品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </form>
      </div>

      {/* Mobile: Show search icon button */}
      <div className="sm:hidden flex-1">
        <Button variant="ghost" size="icon" onClick={() => {
          // TODO: Open mobile search modal
          toast({
            title: '搜索功能',
            description: '移动端搜索功能开发中',
          })
        }}>
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Right side - Notifications and User menu */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
            <DropdownMenuLabel>通知</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                暂无通知
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-sm text-blue-600">
                  查看全部通知
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-2 sm:px-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                {user?.fullName?.[0] || user?.username?.[0] || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                  {user?.fullName || user?.username || '管理员'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'super_admin' ? '超级管理员' : '内容编辑员'}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium truncate">{user?.fullName || user?.username}</p>
                <p className="text-xs text-gray-500 font-normal truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              系统设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
