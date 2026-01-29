'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'

import { api, type PageResponse } from '@/lib/api/client'

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard'

type ApiDifficulty = 'easy' | 'medium' | 'hard'

interface Category {
  id: number
  name: string
  nameEn?: string
  icon?: string
  sortOrder?: number
}

interface Route {
  id: number
  name: string
  nameEn?: string
  summary?: string
  description?: string
  coverImage?: string
  images?: string
  categoryId?: number
  difficulty?: ApiDifficulty | string
  duration?: number
  distance?: number | string
  price?: number | string
  maxParticipants?: number
  status?: number
  featured?: boolean
  sortOrder?: number
}

const DIFFICULTY_TO_API: Record<Exclude<DifficultyFilter, 'all'>, ApiDifficulty> = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
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

export default function RoutesPage() {
  const { t, locale } = useTranslation()
  const [filter, setFilter] = React.useState<DifficultyFilter>('all')
  const [categoryId, setCategoryId] = React.useState<number | null>(null)
  const [page, setPage] = React.useState(1)
  const size = 9

  const difficultyParam = filter === 'all' ? undefined : DIFFICULTY_TO_API[filter]

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<Category[]>('/categories')
      return res.data
    },
  })

  const routesQuery = useQuery({
    queryKey: ['routes', page, size, categoryId, difficultyParam],
    queryFn: async () => {
      const res = await api.get<PageResponse<Route>>('/routes', {
        page,
        size,
        categoryId: categoryId ?? undefined,
        difficulty: difficultyParam,
      })
      return res.data
    },
  })

  const routeRecords = routesQuery.data?.records ?? []
  const totalPages = routesQuery.data?.pages ?? 1

  return (
    <>
      <Header transparent />
      <main className="bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/brand_assets/page12_img1.jpeg"
              alt={t('routesPage.heroImageAlt')}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />
          </div>
          
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="text-sm tracking-[0.3em] text-brand-accent">{t('routesPage.heroBadge')}</span>
              <h1 className="mt-4 font-zh-display text-5xl font-bold md:text-7xl">
                {t('routesPage.heroTitle')}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
                {t('routesPage.heroDesc')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Route Features Section */}
        <section className="border-b border-white/10 py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-xs tracking-[0.3em] text-orange-500 uppercase">{t('routesPage.features.badge')}</span>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                {t('routesPage.features.title')}
              </h2>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/brand_assets/routes/page12_img3.jpeg"
                    alt={t('routesPage.features.culture.title')}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className="text-xl font-bold mb-3">{t('routesPage.features.culture.title')}</h3>
                  <p className="text-white/80 leading-relaxed text-sm">
                    {t('routesPage.features.culture.desc')}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/brand_assets/ebike/page10_img1.jpeg"
                    alt={t('routesPage.features.ebike.title')}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className="text-xl font-bold mb-3">{t('routesPage.features.ebike.title')}</h3>
                  <p className="text-white/80 leading-relaxed text-sm">
                    {t('routesPage.features.ebike.desc')}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/brand_assets/community/page14_img1.jpeg"
                    alt={t('routesPage.features.experience.title')}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className="text-xl font-bold mb-3">{t('routesPage.features.experience.title')}</h3>
                  <p className="text-white/80 leading-relaxed text-sm">
                    {t('routesPage.features.experience.desc')}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filter */}
        <section className="sticky top-16 z-30 border-b border-white/10 bg-black/90 py-3 backdrop-blur-md sm:py-4 lg:top-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col items-center gap-2.5 sm:gap-3">
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setFilter(d)
                      setPage(1)
                    }}
                    className={`rounded-full px-4 py-1.5 text-xs transition-all sm:px-6 sm:py-2 sm:text-sm ${
                      filter === d
                        ? 'bg-white text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {d === 'all' ? t('routesPage.filters.allDifficulty') : t(`routes.difficulty.${d}`)}
                  </button>
                ))}
              </div>

              {categoriesQuery.data && categoriesQuery.data.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => {
                      setCategoryId(null)
                      setPage(1)
                    }}
                    className={`rounded-full px-4 py-1.5 text-xs transition-all sm:px-5 sm:py-2 ${
                      categoryId === null
                        ? 'bg-white text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {t('routesPage.filters.allCategories')}
                  </button>
                  {categoriesQuery.data.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCategoryId(c.id)
                        setPage(1)
                      }}
                      className={`rounded-full px-4 py-1.5 text-xs transition-all sm:px-5 sm:py-2 ${
                        categoryId === c.id
                          ? 'bg-white text-black'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {locale === 'en' ? c.nameEn || c.name : c.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Routes Grid */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {routesQuery.isLoading ? (
              <div className="py-16 text-center text-white/60 sm:py-20">{t('common.loading')}</div>
            ) : routesQuery.isError ? (
              <div className="py-16 text-center text-white/60 sm:py-20">{t('routesPage.states.loadFailed')}</div>
            ) : routeRecords.length === 0 ? (
              <div className="py-16 text-center text-white/60 sm:py-20">{t('routesPage.states.empty')}</div>
            ) : (
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {routeRecords.map((route, index) => (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/routes/${route.id}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl">
                        <Image
                          src={route.coverImage || '/brand_assets/page12_img1.jpeg'}
                          alt={route.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                          <span className="inline-block rounded-full bg-brand-accent/90 px-2.5 py-1 text-xs font-medium text-black sm:px-3">
                            {formatDifficultyLabel(t, route.difficulty)}
                          </span>
                          <h3 className="mt-2 font-zh-heading text-xl font-bold sm:mt-3 sm:text-2xl">
                            {locale === 'en' ? route.nameEn || route.name : route.name}
                          </h3>
                          <p className="mt-1 text-xs text-white/60 sm:text-sm">{locale === 'en' ? route.name : route.nameEn}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between sm:mt-4">
                        <div className="flex gap-3 text-xs text-white/50 sm:gap-4 sm:text-sm">
                          <span>{formatDuration(locale, t, route.duration)}</span>
                          <span>{formatDistance(locale, t, route.distance)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-brand-accent sm:text-xl">¥{formatPrice(route.price)}</span>
                          <span className="ml-1 text-xs text-white/50 sm:text-sm">{t('routesPage.perPersonFrom')}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-10 flex items-center justify-center gap-2.5 sm:mt-14 sm:gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-full border border-white/15 px-5 py-2 text-xs text-white/80 transition-all hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6 sm:text-sm"
              >
                {t('routesPage.pagination.prev')}
              </button>
              <span className="text-xs text-white/50 sm:text-sm">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-full border border-white/15 px-5 py-2 text-xs text-white/80 transition-all hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6 sm:text-sm"
              >
                {t('routesPage.pagination.next')}
              </button>
            </div>
          </div>
        </section>

        {/* Showcase Gallery */}
        <section className="border-t border-white/10 py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-xs tracking-[0.3em] text-orange-500 uppercase">{t('routesPage.gallery.badge')}</span>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                {t('routesPage.gallery.title')}
              </h2>
              <p className="mt-4 text-white/60">{t('routesPage.gallery.desc')}</p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[2, 3, 4, 5, 6, 7, 8].map((num, index) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={`/brand_assets/page12_img${num}.jpeg`}
                    alt={`骑行瞬间 ${num}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Route CTA */}
        <section className="border-t border-white/10 py-20 sm:py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-zh-display text-3xl font-bold sm:text-4xl md:text-5xl">
                {t('routesPage.customCta.title')}
              </h2>
              <p className="mt-5 text-lg text-white/60 sm:mt-6 sm:text-xl">
                {t('routesPage.customCta.desc')}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:mt-10 sm:flex-row sm:gap-6">
                <Link
                  href="/contact"
                  className="rounded-full bg-orange-500 px-8 py-4 font-medium text-black transition-all hover:scale-105 hover:bg-orange-600"
                >
                  {t('routesPage.customCta.button')}
                </Link>
                <Link
                  href="/routes"
                  className="rounded-full border-2 border-white bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white hover:text-black"
                >
                  {t('routesPage.browseMore')}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
