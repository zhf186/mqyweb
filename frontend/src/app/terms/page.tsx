'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'
import { getPageContent, getContent, type CMSContent } from '@/lib/api/public-content'
import {
  detectEditableElements,
  updateElementContent,
  findElementBySelector,
  injectUpdateAnimationStyles,
} from '@/lib/visual-editor/editable-detector'
import type { IframeBridgeMessage } from '@/lib/visual-editor/types'

export default function TermsPage() {
  const { t, locale } = useTranslation()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('editMode') === 'true'
  const [cmsContent, setCmsContent] = React.useState<CMSContent>({})
  const contentLocale: 'zh' | 'en' = locale === 'en' ? 'en' : 'zh'

  const sections = [
    { key: 'service', items: [1, 2, 3, 4] },
    { key: 'responsibility', items: [1, 2, 3, 4, 5] },
    { key: 'booking', items: [1, 2, 3, 4] },
    { key: 'ip', items: [] },
    { key: 'disclaimer', items: [1, 2, 3, 4] },
  ] as const

  const getEditableText = React.useCallback(
    (fieldKey: string, fallback: string) => getContent(cmsContent, fieldKey, contentLocale, fallback),
    [cmsContent, contentLocale]
  )

  React.useEffect(() => {
    getPageContent('terms').then((content) => {
      setCmsContent(content)
    })
  }, [])

  React.useEffect(() => {
    if (!isEditMode) return

    injectUpdateAnimationStyles()

    const handleMessage = (event: MessageEvent<IframeBridgeMessage>) => {
      if (event.origin !== window.location.origin) return

      const message = event.data
      switch (message.type) {
        case 'REQUEST_EDITABLE_ELEMENTS': {
          const elements = detectEditableElements(document)
          window.parent.postMessage({ type: 'EDITABLE_ELEMENTS_RESPONSE', payload: elements }, window.location.origin)
          break
        }
        case 'UPDATE_CONTENT': {
          const { fieldKey, content } = message.payload
          const element = findElementBySelector(`[data-editable="${fieldKey}"]`, document)
          if (element) {
            const type = element.getAttribute('data-editable-type') as 'text' | 'image'
            updateElementContent(element, content, type)
          }
          break
        }
        case 'UPDATE_IMAGE': {
          const { fieldKey, imagePath } = message.payload
          const imageElement = findElementBySelector(`[data-editable="${fieldKey}"]`, document)
          if (imageElement) {
            updateElementContent(imageElement, imagePath, 'image')
          }
          break
        }
      }
    }

    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        window.parent.postMessage({ type: 'IFRAME_SCROLLED' }, window.location.origin)
      }, 100)
    }

    window.addEventListener('message', handleMessage)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.parent.postMessage({ type: 'IFRAME_READY' }, window.location.origin)
    window.parent.postMessage({ type: 'IFRAME_LOADED' }, window.location.origin)

    return () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [isEditMode])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white">
        <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/20 to-black" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span
                className="text-sm tracking-[0.3em] text-brand-accent"
                data-editable="termsPage.heroBadge"
                data-editable-type="text"
                data-editable-label="Terms Hero Badge"
              >
                {getEditableText('termsPage.heroBadge', 'TERMS OF SERVICE')}
              </span>
              <h1
                className="mt-4 font-zh-display text-5xl font-bold md:text-7xl"
                data-editable="termsPage.heroTitle"
                data-editable-type="text"
                data-editable-label="Terms Hero Title"
              >
                {getEditableText('termsPage.heroTitle', t('termsPage.heroTitle'))}
              </h1>
              <p
                className="mt-6 text-white/60"
                data-editable="termsPage.lastUpdated"
                data-editable-type="text"
                data-editable-label="Terms Last Updated"
              >
                {getEditableText('termsPage.lastUpdated', t('termsPage.lastUpdated'))}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xl leading-relaxed text-white/70"
            >
              <span
                data-editable="termsPage.introLine1"
                data-editable-type="text"
                data-editable-label="Terms Intro Line 1"
              >
                {getEditableText('termsPage.introLine1', t('termsPage.introLine1'))}
              </span>
              <br />
              <span
                data-editable="termsPage.introLine2"
                data-editable-type="text"
                data-editable-label="Terms Intro Line 2"
              >
                {getEditableText('termsPage.introLine2', t('termsPage.introLine2'))}
              </span>
            </motion.p>
          </div>
        </section>

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
                  <h2
                    className="font-zh-heading text-2xl font-bold text-brand-accent"
                    data-editable={`termsPage.sections.${section.key}.title`}
                    data-editable-type="text"
                    data-editable-label={`Terms Section ${section.key} Title`}
                  >
                    {getEditableText(`termsPage.sections.${section.key}.title`, t(`termsPage.sections.${section.key}.title`))}
                  </h2>
                  <p
                    className="mt-4 text-white/70"
                    data-editable={`termsPage.sections.${section.key}.content`}
                    data-editable-type="text"
                    data-editable-label={`Terms Section ${section.key} Content`}
                  >
                    {getEditableText(`termsPage.sections.${section.key}.content`, t(`termsPage.sections.${section.key}.content`))}
                  </p>
                  {section.items.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {section.items.map((n) => (
                        <li key={n} className="flex items-start gap-3 text-white/60">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                          <span
                            data-editable={`termsPage.sections.${section.key}.items.${n}`}
                            data-editable-type="text"
                            data-editable-label={`Terms Section ${section.key} Item ${n}`}
                          >
                            {getEditableText(`termsPage.sections.${section.key}.items.${n}`, t(`termsPage.sections.${section.key}.items.${n}`))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl border border-brand-accent/30 bg-brand-accent/10 p-8"
              >
                <h2
                  className="font-zh-heading text-2xl font-bold text-brand-accent"
                  data-editable="termsPage.sections.safety.title"
                  data-editable-type="text"
                  data-editable-label="Terms Safety Title"
                >
                  {getEditableText('termsPage.sections.safety.title', t('termsPage.sections.safety.title'))}
                </h2>
                <p className="mt-4 text-white/70">
                  <span
                    data-editable="termsPage.sections.safety.line1"
                    data-editable-type="text"
                    data-editable-label="Terms Safety Line 1"
                  >
                    {getEditableText('termsPage.sections.safety.line1', t('termsPage.sections.safety.line1'))}
                  </span>
                  <br />
                  <span
                    data-editable="termsPage.sections.safety.line2"
                    data-editable-type="text"
                    data-editable-label="Terms Safety Line 2"
                  >
                    {getEditableText('termsPage.sections.safety.line2', t('termsPage.sections.safety.line2'))}
                  </span>
                </p>
                <ul className="mt-4 space-y-2">
                  {([1, 2, 3, 4] as const).map((n) => (
                    <li key={n} className="flex items-start gap-3 text-white/80">
                      <span className="text-brand-accent">✓</span>
                      <span
                        data-editable={`termsPage.sections.safety.items.${n}`}
                        data-editable-type="text"
                        data-editable-label={`Terms Safety Item ${n}`}
                      >
                        {getEditableText(`termsPage.sections.safety.items.${n}`, t(`termsPage.sections.safety.items.${n}`))}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border-l-2 border-white/10 pl-8"
              >
                <h2
                  className="font-zh-heading text-2xl font-bold text-brand-accent"
                  data-editable="termsPage.sections.contact.title"
                  data-editable-type="text"
                  data-editable-label="Terms Contact Title"
                >
                  {getEditableText('termsPage.sections.contact.title', t('termsPage.sections.contact.title'))}
                </h2>
                <p
                  className="mt-4 text-white/70"
                  data-editable="termsPage.sections.contact.content"
                  data-editable-type="text"
                  data-editable-label="Terms Contact Content"
                >
                  {getEditableText('termsPage.sections.contact.content', t('termsPage.sections.contact.content'))}
                </p>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="space-y-3 text-white/60">
                    <p className="flex items-center gap-3">
                      <span className="text-brand-accent">Email</span>
                      <span
                        data-editable="termsPage.contact.email"
                        data-editable-type="text"
                        data-editable-label="Terms Contact Email"
                      >
                        {getEditableText('termsPage.contact.email', 'service@manqiyou.com')}
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-brand-accent">Phone</span>
                      <span
                        data-editable="termsPage.contact.phone"
                        data-editable-type="text"
                        data-editable-label="Terms Contact Phone"
                      >
                        {getEditableText('termsPage.contact.phone', '0574-87195586')}
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-brand-accent">Address</span>
                      <span
                        data-editable="termsPage.contact.address"
                        data-editable-type="text"
                        data-editable-label="Terms Contact Address"
                      >
                        {getEditableText('termsPage.contact.address', t('termsPage.contact.address'))}
                      </span>
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
