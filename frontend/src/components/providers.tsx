'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect, type ReactNode } from 'react'
import { useLocaleStore } from '@/stores/locale'
import { useStyleStore } from '@/stores/style'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  // 初始化语言设置
  const locale = useLocaleStore((state) => state.locale)
  const style = useStyleStore((state) => state.style)
  
  useEffect(() => {
    // 设置 HTML lang 属性
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    document.documentElement.dataset.style = style
  }, [style])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
