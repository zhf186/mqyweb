'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

const footerLinks = {
  products: [
    { key: 'ebike', href: '/ebike' },
    { key: 'routes', href: '/routes' },
    { key: 'goods', href: '/goods' },
  ],
  community: [
    { key: 'community', href: '/community' },
    { key: 'events', href: '/community#events' },
    { key: 'stories', href: '/community#stories' },
  ],
  company: [
    { key: 'about', href: '/about' },
    { key: 'partners', href: '/partners' },
    { key: 'careers', href: '/careers' },
  ],
  support: [
    { key: 'faq', href: '/faq' },
    { key: 'contact', href: '/contact' },
    { key: 'terms', href: '/terms' },
    { key: 'privacy', href: '/privacy' },
  ],
}

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-zh-display text-2xl font-bold">{t('common.brand')}</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/50 sm:mt-4">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-medium tracking-wider text-white/80">{t('footer.productsTitle')}</h3>
            <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-medium tracking-wider text-white/80">{t('footer.communityTitle')}</h3>
            <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.key === 'community' ? t('nav.community') : t(`footer.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-medium tracking-wider text-white/80">{t('footer.companyTitle')}</h3>
            <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.key === 'careers' ? t('footer.links.careers') : t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-medium tracking-wider text-white/80">{t('footer.supportTitle')}</h3>
            <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.key === 'contact'
                      ? t('nav.contact')
                      : link.key === 'terms'
                      ? t('footer.terms')
                      : link.key === 'privacy'
                      ? t('footer.privacy')
                      : t(`footer.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 sm:mt-6">
              <p className="text-sm text-white/50">{t('footer.serviceLineLabel')}</p>
              <p className="mt-1 text-lg font-medium">0574-87195586</p>
              <p className="mt-1 text-xs text-white/40">{t('footer.serviceHours')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <p className="text-xs text-center text-white/40 sm:text-left">
                {t('footer.copyright')}
              </p>
              <a 
                href="https://beian.miit.gov.cn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                浙ICP备2022028532号-1
              </a>
            </div>
            <div className="flex items-center gap-5 sm:gap-6">
              {/* Social Links */}
              <a href="#" className="text-white/40 transition-colors hover:text-white" aria-label="WeChat">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/>
                </svg>
              </a>
              <a href="#" className="text-white/40 transition-colors hover:text-white" aria-label="Weibo">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443z"/>
                </svg>
              </a>
              <a href="#" className="text-white/40 transition-colors hover:text-white" aria-label="Instagram">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
