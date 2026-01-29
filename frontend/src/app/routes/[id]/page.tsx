'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { api } from '@/lib/api/client'
import { useTranslation } from '@/hooks/useTranslation'

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
  const id = params?.id

  const routeQuery = useQuery({
    queryKey: ['route', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await api.get<Route>(`/routes/${id}`)
      return res.data
    },
  })

  return (
    <>
      <Header transparent />
      <main className="bg-black text-white">
        <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={routeQuery.data?.coverImage || '/brand_assets/page12_img1.jpeg'}
              alt={routeQuery.data ? (locale === 'en' ? routeQuery.data.nameEn || routeQuery.data.name : routeQuery.data.name) : t('routesDetail.heroImageAlt')}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
          </div>

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-14">
            <Link href="/routes" className="inline-flex w-fit items-center text-sm text-white/70 hover:text-white">
              ← {t('routesDetail.backToRoutes')}
            </Link>

            {routeQuery.isLoading ? (
              <div className="mt-8 text-white/70">{t('common.loading')}</div>
            ) : routeQuery.isError ? (
              <div className="mt-8 text-white/70">{t('routesDetail.states.loadFailed')}</div>
            ) : !routeQuery.data ? (
              <div className="mt-8 text-white/70">{t('routesDetail.states.notFound')}</div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="mt-8"
              >
                <span className="text-sm tracking-[0.3em] text-brand-accent">{t('routesDetail.badge')}</span>
                <h1 className="mt-4 font-zh-display text-4xl font-bold md:text-6xl">
                  {locale === 'en' ? routeQuery.data.nameEn || routeQuery.data.name : routeQuery.data.name}
                </h1>
                {routeQuery.data.nameEn ? (
                  <p className="mt-3 text-sm tracking-widest text-white/60">{locale === 'en' ? routeQuery.data.name : routeQuery.data.nameEn}</p>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/60">
                  {routeQuery.data.difficulty ? (
                    <span className="rounded-full bg-brand-accent/90 px-3 py-1 text-xs font-medium text-black">
                      {formatDifficultyLabel(t, routeQuery.data.difficulty)}
                    </span>
                  ) : null}
                  {routeQuery.data.duration ? <span>{formatDuration(locale, t, routeQuery.data.duration)}</span> : null}
                  {routeQuery.data.distance ? <span>{formatDistance(locale, t, routeQuery.data.distance)}</span> : null}
                </div>

                {routeQuery.data.price !== undefined ? (
                  <div className="mt-6">
                    <span className="text-3xl font-bold text-brand-accent">¥{formatPrice(routeQuery.data.price)}</span>
                    <span className="ml-2 text-sm text-white/50">{t('routesDetail.perPersonFrom')}</span>
                  </div>
                ) : null}
              </motion.div>
            )}
          </div>
        </section>

        {!routeQuery.isLoading && routeQuery.data ? (
          <section className="mx-auto max-w-6xl px-6 py-16">
            {routeQuery.data.summary ? (
              <p className="text-xl leading-relaxed text-white/80 md:text-2xl">{routeQuery.data.summary}</p>
            ) : null}

            {routeQuery.data.description ? (
              <div className="mt-10 space-y-4 text-base leading-relaxed text-white/70">
                {routeQuery.data.description.split('\n').map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            ) : null}

            <div className="mt-14 flex flex-wrap gap-3">
              <Link
                href="/routes"
                className="rounded-full border border-white/15 px-7 py-3 text-sm text-white/80 transition-all hover:border-white/30"
              >
                {t('routesDetail.actions.backToList')}
              </Link>
              <button className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-transform hover:scale-105">
                {t('routesDetail.actions.consultNow')}
              </button>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  )
}
