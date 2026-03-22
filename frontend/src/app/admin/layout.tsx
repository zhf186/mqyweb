'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/admin'
import { ApiError } from '@/lib/api/client'
import { refreshAdminSession } from '@/lib/auth/admin-session'
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
  const setUser = useAdminAuthStore((state) => state.setUser)
  const syncFromStorage = useAdminAuthStore((state) => state.syncFromStorage)
  const logout = useAdminAuthStore((state) => state.logout)
  const [isCheckingSession, setIsCheckingSession] = useState(false)
  const lastValidatedTokenRef = useRef<string | null>(null)

  useEffect(() => {
    if (pathname === '/admin/login' || !hasHydrated) {
      return
    }

    if (!token) {
      lastValidatedTokenRef.current = null
      router.replace('/admin/login')
    }
  }, [hasHydrated, pathname, router, token])

  useEffect(() => {
    if (pathname === '/admin/login' || !hasHydrated || !token) {
      return
    }

    if (lastValidatedTokenRef.current === token) {
      return
    }

    let cancelled = false

    const validateSession = async () => {
      setIsCheckingSession(true)

      try {
        const response = await authApi.me()
        if (cancelled) {
          return
        }

        syncFromStorage()
        setUser(response.data)
        lastValidatedTokenRef.current = useAdminAuthStore.getState().token ?? token
        return
      } catch (error) {
        const isAuthFailure = error instanceof ApiError && (error.status === 401 || error.status === 403)

        if (isAuthFailure) {
          const refreshed = await refreshAdminSession()
          if (refreshed) {
            try {
              const retryResponse = await authApi.me()
              if (cancelled) {
                return
              }

              syncFromStorage()
              setUser(retryResponse.data)
              lastValidatedTokenRef.current = useAdminAuthStore.getState().token ?? token
              return
            } catch {
              // Fall through to logout below.
            }
          }

          if (!cancelled) {
            lastValidatedTokenRef.current = null
            logout()
            router.replace('/admin/login')
          }
          return
        }

        if (!cancelled) {
          console.error('Failed to validate admin session:', error)
          lastValidatedTokenRef.current = token
        }
      } finally {
        if (!cancelled) {
          setIsCheckingSession(false)
        }
      }
    }

    validateSession()

    return () => {
      cancelled = true
    }
  }, [hasHydrated, logout, pathname, router, setUser, syncFromStorage, token])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!hasHydrated || isCheckingSession) {
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

  return <AdminLayout>{children}</AdminLayout>
}
