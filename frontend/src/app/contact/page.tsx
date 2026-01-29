'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <>
      <Header />
      <main className="bg-black text-white">
        <section className="mx-auto max-w-4xl px-6 py-24">
          <h1 className="font-zh-display text-4xl font-bold md:text-5xl">{t('nav.contact', '联系我们')}</h1>
          <p className="mt-6 text-white/70">{t('common.comingSoon', '页面建设中，敬请期待。')}</p>
          <div className="mt-10">
            <Link href="/" className="text-brand-accent hover:text-white">
              {t('common.backHome', '返回首页')}
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
