'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'

const events = [
  {
    id: 1,
    title: '东钱湖春季骑行节',
    titleEn: 'Dongqian Lake Spring Cycling Festival',
    date: '2026-04-15',
    location: '东钱湖',
    locationEn: 'Dongqian Lake',
    image: '/brand_assets/community/page14_img1.jpeg',
    participants: 120,
    status: 'upcoming'
  },
  {
    id: 2,
    title: '宁波古道探索之旅',
    titleEn: 'Ningbo Ancient Trail Exploration',
    date: '2026-05-20',
    location: '四明山',
    locationEn: 'Siming Mountain',
    image: '/brand_assets/community/page14_img2.jpeg',
    participants: 80,
    status: 'upcoming'
  },
  {
    id: 3,
    title: '海岸线日落骑行',
    titleEn: 'Coastline Sunset Ride',
    date: '2026-03-10',
    location: '象山海岸',
    locationEn: 'Xiangshan Coast',
    image: '/brand_assets/community/page14_img3.jpeg',
    participants: 95,
    status: 'completed'
  },
  {
    id: 4,
    title: '城市夜骑活动',
    titleEn: 'City Night Ride',
    date: '2026-06-08',
    location: '宁波市区',
    locationEn: 'Ningbo City',
    image: '/brand_assets/routes/page12_img1.jpeg',
    participants: 150,
    status: 'upcoming'
  },
  {
    id: 5,
    title: '茶园骑行体验',
    titleEn: 'Tea Garden Cycling Experience',
    date: '2026-04-25',
    location: '余姚',
    locationEn: 'Yuyao',
    image: '/brand_assets/routes/page12_img2.jpeg',
    participants: 60,
    status: 'upcoming'
  },
  {
    id: 6,
    title: '冬季温泉骑行',
    titleEn: 'Winter Hot Spring Ride',
    date: '2026-02-15',
    location: '宁海',
    locationEn: 'Ninghai',
    image: '/brand_assets/routes/page12_img3.jpeg',
    participants: 70,
    status: 'completed'
  },
]

export default function CommunityEventsPage() {
  const { t, locale } = useTranslation()
  const [filter, setFilter] = React.useState<'all' | 'upcoming' | 'completed'>('all')

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.status === filter)

  return (
    <>
      <Header transparent />
      <main className="bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/brand_assets/community/page14_img1.jpeg"
              alt="Community Events"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
          </div>
          
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm tracking-[0.3em] text-brand-accent">
                {t('communityPage.events.badge') || 'COMMUNITY EVENTS'}
              </span>
              <h1 className="mt-4 font-zh-display text-5xl font-bold md:text-6xl">
                {t('communityPage.events.title') || '社群活动'}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
                {t('communityPage.events.desc') || '加入我们的骑行活动，结识志同道合的骑友'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="sticky top-16 z-30 border-b border-white/10 bg-black/90 py-4 backdrop-blur-md lg:top-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex justify-center gap-2">
              {(['all', 'upcoming', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-full px-6 py-2 text-sm transition-all ${
                    filter === status
                      ? 'bg-white text-black'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t(`communityPage.events.filter.${status}`) || status}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900">
                    <Image
                      src={event.image}
                      alt={locale === 'en' ? event.titleEn : event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        event.status === 'upcoming' 
                          ? 'bg-brand-accent text-black' 
                          : 'bg-white/20 text-white backdrop-blur-sm'
                      }`}>
                        {event.status === 'upcoming' ? t('common.upcoming') || '即将开始' : t('common.completed') || '已结束'}
                      </span>
                    </div>

                    {/* Event Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">
                        {locale === 'en' ? event.titleEn : event.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-4 text-sm text-white/70">
                        <span>📅 {event.date}</span>
                        <span>📍 {locale === 'en' ? event.locationEn : event.location}</span>
                      </div>
                      <div className="mt-2 text-sm text-white/70">
                        👥 {event.participants} {t('common.participants') || '参与者'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-xl text-white/60">
                  {t('communityPage.events.noEvents') || '暂无活动'}
                </p>
              </div>
            )}
          </section>
        </main>
      <Footer />
    </>
  )
}
