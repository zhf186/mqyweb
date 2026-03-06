'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
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

export default function CommunityEventsPage() {
  const { locale } = useTranslation()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('editMode') === 'true'
  const [cmsContent, setCmsContent] = React.useState<CMSContent>({})
  const contentLocale: 'zh' | 'en' = locale === 'en' ? 'en' : 'zh'

  const getEditableText = React.useCallback(
    (fieldKey: string, fallback: string) => getContent(cmsContent, fieldKey, contentLocale, fallback),
    [cmsContent, contentLocale]
  )

  React.useEffect(() => {
    getPageContent('community-events').then((content) => {
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
    <div>
      <Header transparent />
      <main className="min-h-screen bg-black pb-20 pt-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1
            className="mb-8 text-4xl font-bold"
            data-editable="communityEventsPage.title"
            data-editable-type="text"
            data-editable-label="Community Events Title"
          >
            {getEditableText('communityEventsPage.title', '社区活动')}
          </h1>
          <p
            className="text-white/70"
            data-editable="communityEventsPage.desc"
            data-editable-type="text"
            data-editable-label="Community Events Description"
          >
            {getEditableText('communityEventsPage.desc', '活动页面正在建设中...')}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
