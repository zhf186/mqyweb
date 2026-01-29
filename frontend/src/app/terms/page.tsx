'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'

export default function TermsPage() {
  const { t } = useTranslation()

  const sections = [
    { key: 'service', items: [1, 2, 3, 4] },
    { key: 'responsibility', items: [1, 2, 3, 4, 5] },
    { key: 'booking', items: [1, 2, 3, 4] },
    { key: 'ip', items: [] },
    { key: 'disclaimer', items: [1, 2, 3, 4] },
  ] as const

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/20 to-black" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm tracking-[0.3em] text-brand-accent">TERMS OF SERVICE</span>
              <h1 className="mt-4 font-zh-display text-5xl font-bold md:text-7xl">
                {t('termsPage.heroTitle')}
              </h1>
              <p className="mt-6 text-white/60">{t('termsPage.lastUpdated')}</p>
            </motion.div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xl leading-relaxed text-white/70"
            >
              {t('termsPage.introLine1')}
              <br />
              {t('termsPage.introLine2')}
            </motion.p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="pb-32">
          <div className="mx-auto max-w-3xl px-6">
            <div className="space-y-16">
              {sections.map((section, index) => (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="border-l-2 border-white/10 pl-8"
                >
                  <h2 className="font-zh-heading text-2xl font-bold text-brand-accent">
                    {t(`termsPage.sections.${section.key}.title`)}
                  </h2>
                  <p className="mt-4 text-white/70">{t(`termsPage.sections.${section.key}.content`)}</p>
                  {section.items.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {section.items.map((n) => (
                        <li key={n} className="flex items-start gap-3 text-white/60">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                          {t(`termsPage.sections.${section.key}.items.${n}`)}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}

              {/* Safety Notice - Special Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl border border-brand-accent/30 bg-brand-accent/10 p-8"
              >
                <h2 className="font-zh-heading text-2xl font-bold text-brand-accent">
                  {t('termsPage.sections.safety.title')}
                </h2>
                <p className="mt-4 text-white/70">
                  {t('termsPage.sections.safety.line1')}
                  <br />
                  {t('termsPage.sections.safety.line2')}
                </p>
                <ul className="mt-4 space-y-2">
                  {([1, 2, 3, 4] as const).map((n) => (
                    <li key={n} className="flex items-start gap-3 text-white/80">
                      <span className="text-brand-accent">✓</span>
                      {t(`termsPage.sections.safety.items.${n}`)}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border-l-2 border-white/10 pl-8"
              >
                <h2 className="font-zh-heading text-2xl font-bold text-brand-accent">
                  {t('termsPage.sections.contact.title')}
                </h2>
                <p className="mt-4 text-white/70">
                  {t('termsPage.sections.contact.content')}
                </p>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="space-y-3 text-white/60">
                    <p className="flex items-center gap-3">
                      <span className="text-brand-accent">📧</span>
                      service@manqiyou.com
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-brand-accent">📞</span>
                      0574-87195586
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-brand-accent">📍</span>
                      {t('termsPage.contact.address')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
