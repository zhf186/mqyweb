'use client'

import * as React from 'react'
import Link from 'next/link'
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

  const showBackground = !transparent || isScrolled || isMobileMenuOpen

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
          showBackground
            ? style === 'bright'
              ? 'bg-white/90 backdrop-blur-md'
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
                style === 'bright' ? 'text-black' : 'text-white'
              )}
            >
              {t('common.brand')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm transition-colors',
                  style === 'bright'
                    ? 'text-black/70 hover:text-black'
                    : 'text-white/70 hover:text-white'
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
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
                  ? 'text-black/70 hover:text-black'
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
                  ? 'text-black/70 hover:text-black'
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
                  ? 'bg-brand-primary text-white'
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
            className="fixed inset-0 z-40 bg-black lg:hidden"
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
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-zh-display text-3xl font-bold text-white transition-colors hover:text-brand-accent"
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
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
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {locale === 'zh' ? (style === 'default' ? '明亮风格' : '默认风格') : (style === 'default' ? 'Bright Style' : 'Default Style')}
                </button>
                <button
                  onClick={toggleLanguage}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {locale === 'zh' ? localeNames.en : localeNames.zh}
                </button>
                <Link
                  href="/routes"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full bg-white px-8 py-3 font-medium text-black"
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
