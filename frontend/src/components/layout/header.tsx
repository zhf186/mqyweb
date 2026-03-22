'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocaleStore } from '@/stores/locale'
import { useStyleStore } from '@/stores/style'
import { localeNames } from '@/lib/i18n/config'

const navItems = [
  { key: 'home', href: '/' },
  { key: 'ebike', href: '/ebike' },
  { key: 'routes', href: '/routes' },
  { key: 'goods', href: '/goods' },
  { key: 'community', href: '/community' },
  { key: 'partners', href: '/partners' },
  { key: 'about', href: '/about' },
] as const

interface HeaderProps {
  transparent?: boolean
}

export function Header({ transparent = false }: HeaderProps) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { locale, setLocale } = useLocaleStore()
  const { style, toggleStyle } = useStyleStore()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLanguage = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh')
  }

  const isNavItemActive = React.useCallback(
    (href: string) => {
      if (!pathname) return false
      if (href === '/') {
        return pathname === '/'
      }
      return pathname === href || pathname.startsWith(`${href}/`)
    },
    [pathname]
  )

  const showBackground = style === 'bright' || !transparent || isScrolled || isMobileMenuOpen
  const brightHeaderStyle = showBackground && style === 'bright'
    ? {
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.82)',
        boxShadow: '0 10px 32px rgba(15, 23, 42, 0.10)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }
    : undefined

  return (
    <>
      <header
        style={brightHeaderStyle}
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
          showBackground
            ? style === 'bright'
              ? ''
              : 'bg-black/90 backdrop-blur-md'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span
              className={cn(
                'font-zh-display text-2xl font-bold',
                style === 'bright' ? 'text-slate-950' : 'text-white'
              )}
            >
              {t('common.brand')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              (() => {
                const isActive = isNavItemActive(item.href)

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                      isActive
                        ? style === 'bright'
                          ? 'theme-preserve-dark bg-brand-primary text-white shadow-[0_8px_20px_rgba(15,76,58,0.18)]'
                          : 'bg-white text-black shadow-sm'
                        : style === 'bright'
                          ? 'text-slate-700 hover:bg-slate-900/[0.06] hover:text-slate-950'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                )
              })()
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Style Toggle */}
            <button
              onClick={toggleStyle}
              className={cn(
                'hidden text-sm transition-colors sm:block',
                style === 'bright'
                  ? 'text-slate-700 hover:text-slate-950'
                  : 'text-white/70 hover:text-white'
              )}
            >
              {locale === 'zh' ? (style === 'default' ? '明亮' : '默认') : (style === 'default' ? 'Bright' : 'Default')}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={cn(
                'hidden text-sm transition-colors sm:block',
                style === 'bright'
                  ? 'text-slate-700 hover:text-slate-950'
                  : 'text-white/70 hover:text-white'
              )}
            >
              {locale === 'zh' ? localeNames.en : localeNames.zh}
            </button>

            {/* CTA Button */}
            <Link
              href="/routes"
              className={cn(
                'hidden rounded-full px-5 py-2 text-sm font-medium transition-transform hover:scale-105 sm:block',
                style === 'bright'
                  ? 'theme-preserve-dark bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] hover:bg-slate-800'
                  : 'bg-white text-black'
              )}
            >
              {t('common.startRiding')}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'flex h-10 w-10 items-center justify-center lg:hidden',
                style === 'bright' ? 'text-black' : 'text-white'
              )}
              aria-label="Toggle menu"
            >
              <div className="relative h-5 w-6">
                <span
                  className={cn(
                    'absolute left-0 h-0.5 w-full transition-all duration-300',
                    style === 'bright' ? 'bg-black' : 'bg-white',
                    isMobileMenuOpen ? 'top-2 rotate-45' : 'top-0'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-2 h-0.5 w-full transition-all duration-300',
                    style === 'bright' ? 'bg-black' : 'bg-white',
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 h-0.5 w-full transition-all duration-300',
                    style === 'bright' ? 'bg-black' : 'bg-white',
                    isMobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'fixed inset-0 z-40 lg:hidden',
              style === 'bright' ? 'bg-white/[0.96] backdrop-blur-xl' : 'bg-black'
            )}
          >
            <div className="flex h-full flex-col items-center justify-center">
              <nav className="flex flex-col items-center gap-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {(() => {
                      const isActive = isNavItemActive(item.href)

                      return (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'font-zh-display text-3xl font-bold transition-colors',
                        isActive
                          ? 'text-brand-accent underline underline-offset-8'
                          : style === 'bright'
                            ? 'text-slate-800 hover:text-brand-primary'
                            : 'text-white hover:text-brand-accent'
                      )}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                      )
                    })()}
                  </motion.div>
                ))}
              </nav>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-12 flex flex-col items-center gap-4"
              >
                <button
                  onClick={toggleStyle}
                  className={cn(
                    'transition-colors',
                    style === 'bright' ? 'text-slate-500 hover:text-slate-900' : 'text-white/60 hover:text-white'
                  )}
                >
                  {locale === 'zh' ? (style === 'default' ? '明亮风格' : '默认风格') : (style === 'default' ? 'Bright Style' : 'Default Style')}
                </button>
                <button
                  onClick={toggleLanguage}
                  className={cn(
                    'transition-colors',
                    style === 'bright' ? 'text-slate-500 hover:text-slate-900' : 'text-white/60 hover:text-white'
                  )}
                >
                  {locale === 'zh' ? localeNames.en : localeNames.zh}
                </button>
                <Link
                  href="/routes"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'rounded-full px-8 py-3 font-medium',
                    style === 'bright' ? 'theme-preserve-dark bg-slate-900 text-white' : 'bg-white text-black'
                  )}
                >
                  {t('common.startRiding')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
