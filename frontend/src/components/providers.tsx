'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState, type ReactNode } from 'react'
import {
  ADMIN_AUTH_SYNC_EVENT,
  ADMIN_AUTH_UNAUTHORIZED_EVENT,
} from '@/lib/auth/admin-session'
import { useAdminAuthStore } from '@/stores/admin-auth'
import { useLocaleStore } from '@/stores/locale'
import { useStyleStore } from '@/stores/style'
import { Toaster } from '@/components/ui/toaster'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  const locale = useLocaleStore((state) => state.locale)
  const style = useStyleStore((state) => state.style)
  const syncAdminAuth = useAdminAuthStore((state) => state.syncFromStorage)
  const logoutAdmin = useAdminAuthStore((state) => state.logout)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    document.documentElement.dataset.style = style
  }, [style])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleUnauthorized = () => {
      logoutAdmin()
    }

    const handleSync = () => {
      syncAdminAuth()
    }

    window.addEventListener(ADMIN_AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    window.addEventListener(ADMIN_AUTH_SYNC_EVENT, handleSync)

    return () => {
      window.removeEventListener(ADMIN_AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
      window.removeEventListener(ADMIN_AUTH_SYNC_EVENT, handleSync)
    }
  }, [logoutAdmin, syncAdminAuth])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  )
}
