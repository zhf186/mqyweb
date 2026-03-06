'use client'

/**
 * Admin Layout with Route Guard
 * 后台管理系统布局和路由守卫
 * 
 * Features:
 * - Check authentication status
 * - Redirect to login if not authenticated
 * - Apply admin layout to all admin pages (except login)
 */

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAdminAuthStore } from '@/stores/admin-auth'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const hasHydrated = useAdminAuthStore((state) => state.hasHydrated)
  const token = useAdminAuthStore((state) => state.token)

  // Route guard
  useEffect(() => {
    // Skip guard for login page
    if (pathname === '/admin/login') {
      return
    }

    // Wait persist state hydration
    if (!hasHydrated) {
      return
    }

    // Check authentication
    if (!token) {
      // Redirect to login
      router.replace('/admin/login')
    }
  }, [hasHydrated, token, pathname, router])

  // If on login page, render without layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // If not authenticated, show loading or nothing while redirecting
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在恢复登录状态...</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在验证身份...</p>
        </div>
      </div>
    )
  }

  // Render with admin layout
  return <AdminLayout>{children}</AdminLayout>
}
