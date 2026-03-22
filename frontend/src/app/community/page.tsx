'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'
import { detectEditableElements, updateElementContent, findElementBySelector, injectUpdateAnimationStyles } from '@/lib/visual-editor/editable-detector'
import type { IframeBridgeMessage } from '@/lib/visual-editor/types'

const stats = [
  { key: 'members', value: '10,000+' },
  { key: 'events', value: '500+' },
  { key: 'distance', value: '1,000,000' },
] as const

const activities = [
  {
    id: 1,
    titleKey: 'communityPage.activities.items.1.title',
    titleEn: 'Weekend Ride: Siming Mountain Challenge',
    dateKey: 'communityPage.activities.items.1.date',
    dateEn: 'Jan 20, 2024',
    locationKey: 'communityPage.activities.items.1.location',
    locationEn: 'Ningbo · Siming Mountain',
    participants: 128,
    image: '/brand_assets/page19_img4.jpeg',
    status: 'open',
  },
  {
    id: 2,
    titleKey: 'communityPage.activities.items.2.title',
    titleEn: 'New Year Lake Loop Ride',
    dateKey: 'communityPage.activities.items.2.date',
    dateEn: 'Jan 1, 2024',
    locationKey: 'communityPage.activities.items.2.location',
    locationEn: 'Ningbo · Dongqian Lake',
    participants: 256,
    image: '/brand_assets/page19_img4.jpeg',
    status: 'ended',
  },
  {
    id: 3,
    titleKey: 'communityPage.activities.items.3.title',
    titleEn: 'Cycling Photography Contest',
    dateKey: 'communityPage.activities.items.3.date',
    dateEn: 'Feb 2024',
    locationKey: 'communityPage.activities.items.3.location',
    locationEn: 'Online',
    participants: 89,
    image: '/brand_assets/page19_img6.jpeg',
    status: 'ongoing',
  },
]

// Expanded gallery with more community photos
const galleryImages = [
  '/brand_assets/community/page14_img1.jpeg',
  '/brand_assets/community/page14_img2.jpeg',
  '/brand_assets/community/page14_img3.jpeg',
  '/brand_assets/community/page14_img4.jpeg',
  '/brand_assets/community/page14_img5.jpeg',
  '/brand_assets/community/page14_img6.jpeg',
  '/brand_assets/community/page14_img7.jpeg',
  '/brand_assets/community/page14_img8.jpeg',
  '/brand_assets/community/page14_img9.jpeg',
  '/brand_assets/page19_img5.jpeg',
  '/brand_assets/page19_img3.jpeg',
  '/brand_assets/page5_img3.jpeg',
  '/brand_assets/page6_img1.jpeg',
  '/brand_assets/page6_img5.jpeg',
  '/brand_assets/page19_img1.jpeg',
  '/brand_assets/page19_img2.jpeg',
] as const

export default function CommunityPage() {
  const { t, locale } = useTranslation()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('editMode') === 'true'

  // 编辑模式支持
  React.useEffect(() => {
    if (!isEditMode) return

    console.log('[community/page.tsx] Edit mode enabled')
    injectUpdateAnimationStyles()

    const handleMessage = (event: MessageEvent<IframeBridgeMessage>) => {
      if (event.origin !== window.location.origin) return
      
      const message = event.data
      
      switch (message.type) {
        case 'INIT_EDIT_MODE':
          break
          
        case 'REQUEST_EDITABLE_ELEMENTS':
          const elements = detectEditableElements(document)
          window.parent.postMessage({
            type: 'EDITABLE_ELEMENTS_RESPONSE',
            payload: elements
          }, window.location.origin)
          break
          
        case 'UPDATE_CONTENT':
          const { fieldKey, content } = message.payload
          const element = findElementBySelector(`[data-editable="${fieldKey}"]`, document)
          if (element) {
            const type = element.getAttribute('data-editable-type') as 'text' | 'image'
            updateElementContent(element, content, type)
          }
          break
          
        case 'UPDATE_IMAGE':
          const { fieldKey: imageFieldKey, imagePath } = message.payload
          const imageElement = findElementBySelector(`[data-editable="${imageFieldKey}"]`, document)
          if (imageElement) {
            updateElementContent(imageElement, imagePath, 'image')
          }
          break
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
        {/* Hero Section */}
        <section className="theme-preserve-dark relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/brand_assets/page19_img3.jpeg"
              alt={t('communityPage.heroImageAlt')}
              fill
              priority
              sizes="100vw"
              quality={85}
              className="object-cover"
              data-editable="community.hero.background"
              data-editable-type="image"
              data-editable-label="社区页Hero背景图"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />
          </div>
          
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span
                className="text-sm tracking-[0.3em] text-brand-accent"
                data-editable="communityPage.heroBadge"
                data-editable-type="text"
                data-editable-label="Community Hero Badge"
              >
                {t('communityPage.heroBadge')}
              </span>
              <h1 
                className="mt-4 font-zh-display text-5xl font-bold md:text-7xl"
                data-editable="communityPage.heroTitle"
                data-editable-type="text"
                data-editable-label="社区页标题"
              >
                {t('communityPage.heroTitle')}
              </h1>
              <p 
                className="mx-auto mt-6 max-w-xl text-lg text-white/70"
                data-editable="communityPage.heroDesc"
                data-editable-type="text"
                data-editable-label="社区页描述"
              >
                {t('communityPage.heroDesc')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Community Intro - Task 5.1 */}
        <section className="border-t border-white/10 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <span
                className="text-sm tracking-[0.3em] text-brand-accent"
                data-editable="communityPage.intro.badge"
                data-editable-type="text"
                data-editable-label="社区介绍徽章"
              >{t('communityPage.intro.badge')}</span>
              <h2
                className="mt-4 font-zh-display text-3xl font-bold md:text-5xl"
                data-editable="communityPage.intro.title"
                data-editable-type="text"
                data-editable-label="社区介绍标题"
              >
                {t('communityPage.intro.title')}
              </h2>
              <p
                className="mx-auto mt-6 max-w-2xl text-lg text-white/70 md:text-xl"
                data-editable="communityPage.intro.desc"
                data-editable-type="text"
                data-editable-label="社区介绍描述"
              >
                {t('communityPage.intro.desc')}
              </p>
            </motion.div>

            {/* Stats */}
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="text-center"
                >
                  <div
                    className="font-en-display text-6xl font-light md:text-7xl"
                    data-editable={`communityPage.stats.${stat.key}.value`}
                    data-editable-type="text"
                    data-editable-label={`Community Stat ${stat.key} Value`}
                  >
                    {stat.key === 'distance' && locale === 'zh' ? t('communityPage.stats.distanceZh') : stat.value}
                  </div>
                  <p
                    className="mt-2 text-white/50"
                    data-editable={`communityPage.stats.${stat.key}.label`}
                    data-editable-type="text"
                    data-editable-label={`Community Stat ${stat.key} Label`}
                  >
                    {t(`communityPage.stats.${stat.key}`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className="border-t border-white/10 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12 flex items-end justify-between"
            >
              <div>
                <span
                  className="text-sm tracking-[0.3em] text-brand-accent"
                  data-editable="communityPage.activities.badge"
                  data-editable-type="text"
                  data-editable-label="活动徽章"
                >{t('communityPage.activities.badge')}</span>
                <h2
                  className="mt-2 font-zh-display text-3xl font-bold md:text-4xl"
                  data-editable="communityPage.activities.title"
                  data-editable-type="text"
                  data-editable-label="活动标题"
                >
                  {t('communityPage.activities.title')}
                </h2>
              </div>
              <Link
                href={t('communityPage.activities.viewAll.href', '/community/events')}
                className="text-brand-accent hover:underline"
                data-editable="communityPage.activities.viewAll"
                data-editable-type="text"
                data-editable-label="Community Activities View All"
              >
                {t('common.viewAll')}
              </Link>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-3">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group"
                >
                  <div className="theme-preserve-dark relative aspect-[16/10] overflow-hidden rounded-2xl">
                    <Image
                      src={activity.image}
                      alt={locale === 'en' ? activity.titleEn : t(activity.titleKey)}
                      fill
                      loading="lazy"
                      quality={75}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      data-editable={`communityPage.activities.items.${activity.id}.image`}
                      data-editable-type="image"
                      data-editable-label={`Community Activity ${activity.id} Image`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
                    <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
                      activity.status === 'open'
                        ? 'bg-brand-accent text-black'
                        : activity.status === 'ongoing'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/60'
                    }`}
                    data-editable={`communityPage.activities.items.${activity.id}.status`}
                    data-editable-type="text"
                    data-editable-label={`Community Activity ${activity.id} Status`}>
                      {t(`communityPage.activities.status.${activity.status}`)}
                    </span>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3
                        className="font-zh-heading text-xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.72)]"
                        data-editable={`communityPage.activities.items.${activity.id}.title`}
                        data-editable-type="text"
                        data-editable-label={`Community Activity ${activity.id} Title`}
                      >
                        {locale === 'en' ? activity.titleEn : t(activity.titleKey)}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-white/50">
                    <div className="flex gap-4">
                      <span
                        data-editable={`communityPage.activities.items.${activity.id}.date`}
                        data-editable-type="text"
                        data-editable-label={`Community Activity ${activity.id} Date`}
                      >
                        {locale === 'en' ? activity.dateEn : t(activity.dateKey)}
                      </span>
                      <span
                        data-editable={`communityPage.activities.items.${activity.id}.location`}
                        data-editable-type="text"
                        data-editable-label={`Community Activity ${activity.id} Location`}
                      >
                        {locale === 'en' ? activity.locationEn : t(activity.locationKey)}
                      </span>
                    </div>
                    <span
                      data-editable={`communityPage.activities.items.${activity.id}.participants`}
                      data-editable-type="text"
                      data-editable-label={`Community Activity ${activity.id} Participants`}
                    >
                      {locale === 'en'
                        ? `${activity.participants} ${t('communityPage.activities.participantsUnit')}`
                        : `${activity.participants}${t('communityPage.activities.participantsUnit')}`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Photo Gallery - Task 5.2 */}
        <section className="border-t border-white/10 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12 text-center"
            >
              <span
                className="text-sm tracking-[0.3em] text-brand-accent"
                data-editable="communityPage.gallery.badge"
                data-editable-type="text"
                data-editable-label="相册徽章"
              >{t('communityPage.gallery.badge')}</span>
              <h2
                className="mt-2 font-zh-display text-3xl font-bold md:text-4xl"
                data-editable="communityPage.gallery.title"
                data-editable-type="text"
                data-editable-label="相册标题"
              >
                {t('communityPage.gallery.title')}
              </h2>
              <p
                className="mx-auto mt-4 max-w-2xl text-white/60"
                data-editable="communityPage.gallery.desc"
                data-editable-type="text"
                data-editable-label="相册描述"
              >
                {t('communityPage.gallery.desc')}
              </p>
            </motion.div>

            {/* Grid layout with hover effects */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {galleryImages.map((src, index) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="theme-preserve-dark group relative aspect-square cursor-pointer overflow-hidden rounded-2xl"
                >
                  <Image
                    src={src}
                    alt={`${t('communityPage.gallery.imageAlt')} ${index + 1}`}
                    fill
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                    data-editable={`communityPage.gallery.images.${index + 1}`}
                    data-editable-type="image"
                    data-editable-label={`Community Gallery Image ${index + 1}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Join CTA - Task 5.3 */}
        <section className="border-t border-white/10 py-32">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="font-zh-display text-4xl font-bold md:text-6xl"
                data-editable="communityPage.cta.title"
                data-editable-type="text"
                data-editable-label="社区CTA标题"
              >
                {t('communityPage.cta.title')}
              </h2>
              <p
                className="mt-6 text-xl text-white/60 md:text-2xl"
                data-editable="communityPage.cta.desc"
                data-editable-type="text"
                data-editable-label="社区CTA描述"
              >
                {t('communityPage.cta.desc')}
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <Link
                  href={t('communityPage.cta.joinNow.href', '/community/events')}
                  className="group relative overflow-hidden rounded-full bg-white px-10 py-5 text-lg font-semibold text-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
                  data-editable="communityPage.cta.joinNow"
                  data-editable-type="text"
                  data-editable-label="Community CTA Join Button"
                >
                  <span className="relative z-10">{t('communityPage.cta.joinNow')}</span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-brand-accent to-white opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
                <Link
                  href={t('communityPage.cta.learnMore.href', '/about')}
                  className="rounded-full border-2 border-white/30 px-10 py-5 text-lg font-semibold transition-all hover:border-white/60 hover:bg-white/10"
                  data-editable="communityPage.cta.learnMore"
                  data-editable-type="text"
                  data-editable-label="Community CTA Learn More Button"
                >
                  {t('common.learnMore')}
                </Link>
              </div>
              
              {/* Additional CTA info */}
              <div className="mt-16 grid gap-8 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                    <svg className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3
                    className="font-semibold"
                    data-editable="communityPage.cta.benefits.community"
                    data-editable-type="text"
                    data-editable-label="Community CTA Benefit 1 Title"
                  >
                    {t('communityPage.cta.benefits.community')}
                  </h3>
                  <p
                    className="mt-2 text-sm text-white/50"
                    data-editable="communityPage.cta.benefits.communityDesc"
                    data-editable-type="text"
                    data-editable-label="Community CTA Benefit 1 Desc"
                  >
                    {t('communityPage.cta.benefits.communityDesc')}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                    <svg className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3
                    className="font-semibold"
                    data-editable="communityPage.cta.benefits.events"
                    data-editable-type="text"
                    data-editable-label="Community CTA Benefit 2 Title"
                  >
                    {t('communityPage.cta.benefits.events')}
                  </h3>
                  <p
                    className="mt-2 text-sm text-white/50"
                    data-editable="communityPage.cta.benefits.eventsDesc"
                    data-editable-type="text"
                    data-editable-label="Community CTA Benefit 2 Desc"
                  >
                    {t('communityPage.cta.benefits.eventsDesc')}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                    <svg className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <h3
                    className="font-semibold"
                    data-editable="communityPage.cta.benefits.rewards"
                    data-editable-type="text"
                    data-editable-label="Community CTA Benefit 3 Title"
                  >
                    {t('communityPage.cta.benefits.rewards')}
                  </h3>
                  <p
                    className="mt-2 text-sm text-white/50"
                    data-editable="communityPage.cta.benefits.rewardsDesc"
                    data-editable-type="text"
                    data-editable-label="Community CTA Benefit 3 Desc"
                  >
                    {t('communityPage.cta.benefits.rewardsDesc')}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
