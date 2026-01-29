'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { Container } from '@/components/ui'

// Route to translation key mapping
const routeTranslations: Record<string, string> = {
  '': 'nav.home',
  'routes': 'nav.routes',
  'ebike': 'nav.ebike',
  'goods': 'nav.goods',
  'community': 'nav.community',
  'partners': 'nav.partners',
  'about': 'nav.about',
  'contact': 'nav.contact',
  'login': 'common.login',
  'register': 'common.register',
  'account': 'common.myAccount',
  'membership': 'membership.title',
  'booking': 'booking.title',
}

interface BreadcrumbItem {
  label: string
  href: string
  isLast: boolean
}

interface BreadcrumbProps {
  className?: string
  customItems?: { label: string; href: string }[]
}

export function Breadcrumb({ className, customItems }: BreadcrumbProps) {
  const pathname = usePathname()
  const { t } = useTranslation()

  // Generate breadcrumb items from pathname
  const items = React.useMemo<BreadcrumbItem[]>(() => {
    if (customItems) {
      return customItems.map((item, index) => ({
        ...item,
        isLast: index === customItems.length - 1,
      }))
    }

    const segments = pathname.split('/').filter(Boolean)
    
    // Always start with home
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('nav.home'), href: '/', isLast: segments.length === 0 },
    ]

    // Build path progressively
    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const translationKey = routeTranslations[segment]
      const label = translationKey ? t(translationKey) : segment
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isLast: index === segments.length - 1,
      })
    })

    return breadcrumbs
  }, [pathname, customItems, t])

  // Don't show breadcrumb on home page
  if (pathname === '/') {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('bg-gray-50 py-3', className)}
    >
      <Container>
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronIcon className="h-4 w-4 text-muted-foreground" />
              )}
              {item.isLast ? (
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-brand-primary"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  )
}
