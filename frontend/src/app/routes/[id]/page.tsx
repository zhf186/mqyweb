'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { api } from '@/lib/api/client'
import { useTranslation } from '@/hooks/useTranslation'
import { getPageContent, getContent, type CMSContent } from '@/lib/api/public-content'
import {
  detectEditableElements,
  updateElementContent,
  findElementBySelector,
  injectUpdateAnimationStyles,
} from '@/lib/visual-editor/editable-detector'
import type { IframeBridgeMessage } from '@/lib/visual-editor/types'

interface Route {
  id: number
  name: string
  nameEn?: string
  summary?: string
  description?: string
  coverImage?: string
  images?: string
  categoryId?: number
  difficulty?: string
  duration?: number
  distance?: number | string
  price?: number | string
}

function formatDuration(locale: string, t: (key: string, fallback?: string) => string, duration?: number) {
  if (!duration) return ''
  if (duration >= 24) {
    const days = Math.max(1, Math.round(duration / 24))
    const nights = Math.max(0, days - 1)
    const dayUnit = t(days === 1 ? 'routes.units.day_one' : 'routes.units.day_other')
    const nightUnit = t(nights === 1 ? 'routes.units.night_one' : 'routes.units.night_other')

    if (locale === 'en') {
      return nights > 0 ? `${days} ${dayUnit} ${nights} ${nightUnit}` : `${days} ${dayUnit}`
    }
    return nights > 0 ? `${days}${dayUnit}${nights}${nightUnit}` : `${days}${dayUnit}`
  }
  const hourUnit = t(duration === 1 ? 'routes.units.hour_one' : 'routes.units.hour_other')
  return locale === 'en' ? `${duration} ${hourUnit}` : `${duration}${hourUnit}`
}

function formatDistance(locale: string, t: (key: string, fallback?: string) => string, distance?: number | string) {
  if (distance === undefined || distance === null) return ''
  const n = typeof distance === 'string' ? Number(distance) : distance
  if (Number.isNaN(n)) return ''
  const kmUnit = t('routes.units.km')
  return locale === 'en' ? `${n} ${kmUnit}` : `${n}${kmUnit}`
}

function formatPrice(price?: number | string) {
  if (price === undefined || price === null) return ''
  const n = typeof price === 'string' ? Number(price) : price
  if (Number.isNaN(n)) return ''
  return `${Math.round(n)}`
}

function formatDifficultyLabel(t: (key: string, fallback?: string) => string, difficulty?: string) {
  if (!difficulty) return ''
  if (difficulty === 'easy') return t('routes.difficulty.easy')
  if (difficulty === 'medium') return t('routes.difficulty.medium')
  if (difficulty === 'hard') return t('routes.difficulty.hard')
  return difficulty
}

export default function RouteDetailPage() {
  const { t, locale } = useTranslation()
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('editMode') === 'true'
  const id = params?.id
  const [cmsContent, setCmsContent] = React.useState<CMSContent>({})
  const contentLocale: 'zh' | 'en' = locale === 'en' ? 'en' : 'zh'

  const getEditableText = React.useCallback(
    (fieldKey: string, fallback: string) => getContent(cmsContent, fieldKey, contentLocale, fallback),
    [cmsContent, contentLocale]
  )

  const routeQuery = useQuery({
    queryKey: ['route', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await api.get<Route>(`/routes/${id}`)
      return res.data
    },
  })

  React.useEffect(() => {
    getPageContent('routes').then((content) => {
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
      <Header transparent />
      <main className="bg-black text-white">
        <section className="theme-preserve-dark relative h-[60vh] min-h-[420px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={getEditableText('routesDetail.hero.image', routeQuery.data?.coverImage || '/brand_assets/page12_img1.jpeg')}
              alt={
                routeQuery.data
                  ? locale === 'en'
                    ? routeQuery.data.nameEn || routeQuery.data.name
                    : routeQuery.data.name
                  : t('routesDetail.heroImageAlt')
              }
              fill
              priority
              sizes="100vw"
              quality={85}
              className="object-cover"
              data-editable="routesDetail.hero.image"
              data-editable-type="image"
              data-editable-label="Route Detail Hero Image"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
          </div>

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-14">
            <Link
              href={getEditableText('routesDetail.backToRoutes.href', '/routes')}
              className="inline-flex w-fit items-center text-sm text-white/70 hover:text-white"
              data-editable="routesDetail.backToRoutes"
              data-editable-type="text"
              data-editable-label="Route Detail Back To Routes"
            >
              {'< '}{getEditableText('routesDetail.backToRoutes', t('routesDetail.backToRoutes'))}
            </Link>

            {routeQuery.isLoading ? (
              <div
                className="mt-8 text-white/70"
                data-editable="routesDetail.states.loading"
                data-editable-type="text"
                data-editable-label="Route Detail Loading"
              >
                {getEditableText('routesDetail.states.loading', t('common.loading'))}
              </div>
            ) : routeQuery.isError ? (
              <div
                className="mt-8 text-white/70"
                data-editable="routesDetail.states.loadFailed"
                data-editable-type="text"
                data-editable-label="Route Detail Load Failed"
              >
                {getEditableText('routesDetail.states.loadFailed', t('routesDetail.states.loadFailed'))}
              </div>
            ) : !routeQuery.data ? (
              <div
                className="mt-8 text-white/70"
                data-editable="routesDetail.states.notFound"
                data-editable-type="text"
                data-editable-label="Route Detail Not Found"
              >
                {getEditableText('routesDetail.states.notFound', t('routesDetail.states.notFound'))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="mt-8"
              >
                <span
                  className="text-sm tracking-[0.3em] text-brand-accent"
                  data-editable="routesDetail.badge"
                  data-editable-type="text"
                  data-editable-label="Route Detail Badge"
                >
                  {getEditableText('routesDetail.badge', t('routesDetail.badge'))}
                </span>
                <h1
                  className="mt-4 font-zh-display text-4xl font-bold md:text-6xl"
                  data-editable="routesDetail.route.name"
                  data-editable-type="text"
                  data-editable-label="Route Detail Name"
                >
                  {getEditableText(
                    'routesDetail.route.name',
                    locale === 'en' ? routeQuery.data.nameEn || routeQuery.data.name : routeQuery.data.name
                  )}
                </h1>
                {getEditableText(
                  'routesDetail.route.secondaryName',
                  locale === 'en' ? routeQuery.data.name : routeQuery.data.nameEn || ''
                ) ? (
                  <p
                    className="mt-3 text-sm tracking-widest text-white/60"
                    data-editable="routesDetail.route.secondaryName"
                    data-editable-type="text"
                    data-editable-label="Route Detail Secondary Name"
                  >
                    {getEditableText(
                      'routesDetail.route.secondaryName',
                      locale === 'en' ? routeQuery.data.name : routeQuery.data.nameEn || ''
                    )}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/60">
                  {routeQuery.data.difficulty ? (
                    <span
                      className="rounded-full bg-brand-accent/90 px-3 py-1 text-xs font-medium text-black"
                      data-editable="routesDetail.route.difficulty"
                      data-editable-type="text"
                      data-editable-label="Route Detail Difficulty"
                    >
                      {getEditableText(
                        'routesDetail.route.difficulty',
                        formatDifficultyLabel(t, routeQuery.data.difficulty)
                      )}
                    </span>
                  ) : null}
                  {routeQuery.data.duration ? (
                    <span
                      data-editable="routesDetail.route.duration"
                      data-editable-type="text"
                      data-editable-label="Route Detail Duration"
                    >
                      {getEditableText('routesDetail.route.duration', formatDuration(locale, t, routeQuery.data.duration))}
                    </span>
                  ) : null}
                  {routeQuery.data.distance ? (
                    <span
                      data-editable="routesDetail.route.distance"
                      data-editable-type="text"
                      data-editable-label="Route Detail Distance"
                    >
                      {getEditableText('routesDetail.route.distance', formatDistance(locale, t, routeQuery.data.distance))}
                    </span>
                  ) : null}
                </div>

                {routeQuery.data.price !== undefined ? (
                  <div className="mt-6">
                    <span
                      className="text-3xl font-bold text-brand-accent"
                      data-editable="routesDetail.route.price"
                      data-editable-type="text"
                      data-editable-label="Route Detail Price"
                    >
                      {getEditableText('routesDetail.route.price', `CNY ${formatPrice(routeQuery.data.price)}`)}
                    </span>
                    <span
                      className="ml-2 text-sm text-white/50"
                      data-editable="routesDetail.perPersonFrom"
                      data-editable-type="text"
                      data-editable-label="Route Detail Per Person"
                    >
                      {getEditableText('routesDetail.perPersonFrom', t('routesDetail.perPersonFrom'))}
                    </span>
                  </div>
                ) : null}
              </motion.div>
            )}
          </div>
        </section>

        {!routeQuery.isLoading && routeQuery.data ? (
          <section className="mx-auto max-w-6xl px-6 py-16">
            {getEditableText('routesDetail.route.summary', routeQuery.data.summary || '') ? (
              <p
                className="text-xl leading-relaxed text-white/80 md:text-2xl"
                data-editable="routesDetail.route.summary"
                data-editable-type="text"
                data-editable-label="Route Detail Summary"
              >
                {getEditableText('routesDetail.route.summary', routeQuery.data.summary || '')}
              </p>
            ) : null}

            {routeQuery.data.description ? (
              <div className="mt-10 space-y-4 text-base leading-relaxed text-white/70">
                {routeQuery.data.description.split('\n').map((paragraph, idx) => (
                  <p
                    key={idx}
                    data-editable={`routesDetail.route.description.${idx + 1}`}
                    data-editable-type="text"
                    data-editable-label={`Route Detail Description ${idx + 1}`}
                  >
                    {getEditableText(`routesDetail.route.description.${idx + 1}`, paragraph)}
                  </p>
                ))}
              </div>
            ) : null}

            <div className="mt-14 flex flex-wrap gap-3">
              <Link
                href={getEditableText('routesDetail.actions.backToList.href', '/routes')}
                className="rounded-full border border-white/15 px-7 py-3 text-sm text-white/80 transition-all hover:border-white/30"
                data-editable="routesDetail.actions.backToList"
                data-editable-type="text"
                data-editable-label="Route Detail Back To List"
              >
                {getEditableText('routesDetail.actions.backToList', t('routesDetail.actions.backToList'))}
              </Link>
              <Link
                href={getEditableText('routesDetail.actions.consultNow.href', '/contact')}
                className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
                data-editable="routesDetail.actions.consultNow"
                data-editable-type="text"
                data-editable-label="Route Detail Consult Now"
              >
                {getEditableText('routesDetail.actions.consultNow', t('routesDetail.actions.consultNow'))}
              </Link>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  )
}
