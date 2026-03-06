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

export default function PrivacyPage() {
  const { t, locale } = useTranslation()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('editMode') === 'true'
  const [cmsContent, setCmsContent] = React.useState<CMSContent>({})
  const contentLocale: 'zh' | 'en' = locale === 'en' ? 'en' : 'zh'

  const sections = [
    { key: 'collect', items: [1, 2, 3, 4, 5] },
    { key: 'use', items: [1, 2, 3, 4, 5] },
    { key: 'protect', items: [1, 2, 3, 4] },
    { key: 'share', items: [1, 2, 3, 4] },
    { key: 'rights', items: [] },
  ] as const

  const getEditableText = React.useCallback(
    (fieldKey: string, fallback: string) => getContent(cmsContent, fieldKey, contentLocale, fallback),
    [cmsContent, contentLocale]
  )

  React.useEffect(() => {
    getPageContent('privacy').then((content) => {
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
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/20 to-black" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span
                className="text-sm tracking-[0.3em] text-brand-accent"
                data-editable="privacyPage.heroBadge"
                data-editable-type="text"
                data-editable-label="Privacy Hero Badge"
              >
                {getEditableText('privacyPage.heroBadge', 'PRIVACY POLICY')}
              </span>
              <h1
                className="mt-4 font-zh-display text-5xl font-bold md:text-7xl"
                data-editable="privacyPage.heroTitle"
                data-editable-type="text"
                data-editable-label="Privacy Hero Title"
              >
                {getEditableText('privacyPage.heroTitle', t('privacyPage.heroTitle'))}
              </h1>
              <p
                className="mt-6 text-white/60"
                data-editable="privacyPage.lastUpdated"
                data-editable-type="text"
                data-editable-label="Privacy Last Updated"
              >
                {getEditableText('privacyPage.lastUpdated', t('privacyPage.lastUpdated'))}
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
                data-editable="privacyPage.introLine1"
                data-editable-type="text"
                data-editable-label="Privacy Intro Line 1"
              >
                {getEditableText('privacyPage.introLine1', t('privacyPage.introLine1'))}
              </span>
              <br />
              <span
                data-editable="privacyPage.introLine2"
                data-editable-type="text"
                data-editable-label="Privacy Intro Line 2"
              >
                {getEditableText('privacyPage.introLine2', t('privacyPage.introLine2'))}
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
                    data-editable={`privacyPage.sections.${section.key}.title`}
                    data-editable-type="text"
                    data-editable-label={`Privacy Section ${section.key} Title`}
                  >
                    {getEditableText(`privacyPage.sections.${section.key}.title`, t(`privacyPage.sections.${section.key}.title`))}
                  </h2>
                  <p
                    className="mt-4 text-white/70"
                    data-editable={`privacyPage.sections.${section.key}.content`}
                    data-editable-type="text"
                    data-editable-label={`Privacy Section ${section.key} Content`}
                  >
                    {getEditableText(`privacyPage.sections.${section.key}.content`, t(`privacyPage.sections.${section.key}.content`))}
                  </p>
                  {section.items.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {section.items.map((n) => (
                        <li key={n} className="flex items-start gap-3 text-white/60">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                          <span
                            data-editable={`privacyPage.sections.${section.key}.items.${n}`}
                            data-editable-type="text"
                            data-editable-label={`Privacy Section ${section.key} Item ${n}`}
                          >
                            {getEditableText(`privacyPage.sections.${section.key}.items.${n}`, t(`privacyPage.sections.${section.key}.items.${n}`))}
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
                className="border-l-2 border-white/10 pl-8"
              >
                <h2
                  className="font-zh-heading text-2xl font-bold text-brand-accent"
                  data-editable="privacyPage.sections.contact.title"
                  data-editable-type="text"
                  data-editable-label="Privacy Contact Title"
                >
                  {getEditableText('privacyPage.sections.contact.title', t('privacyPage.sections.contact.title'))}
                </h2>
                <p
                  className="mt-4 text-white/70"
                  data-editable="privacyPage.sections.contact.content"
                  data-editable-type="text"
                  data-editable-label="Privacy Contact Content"
                >
                  {getEditableText('privacyPage.sections.contact.content', t('privacyPage.sections.contact.content'))}
                </p>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="space-y-3 text-white/60">
                    <p className="flex items-center gap-3">
                      <span className="text-brand-accent">Email</span>
                      <span
                        data-editable="privacyPage.contact.email"
                        data-editable-type="text"
                        data-editable-label="Privacy Contact Email"
                      >
                        {getEditableText('privacyPage.contact.email', 'privacy@manqiyou.com')}
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-brand-accent">Phone</span>
                      <span
                        data-editable="privacyPage.contact.phone"
                        data-editable-type="text"
                        data-editable-label="Privacy Contact Phone"
                      >
                        {getEditableText('privacyPage.contact.phone', '0574-87195586')}
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-brand-accent">Address</span>
                      <span
                        data-editable="privacyPage.contact.address"
                        data-editable-type="text"
                        data-editable-label="Privacy Contact Address"
                      >
                        {getEditableText('privacyPage.contact.address', t('privacyPage.contact.address'))}
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
