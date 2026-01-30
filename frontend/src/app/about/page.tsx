'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'

export default function AboutPage() {
  const { t, locale } = useTranslation()

  // Get typed data from translations with fallbacks
  const stats = (t('about.stats') as unknown as any[]) || []
  const timeline = (t('about.timeline.milestones') as unknown as any[]) || []
  const manufacturingStats = (t('about.manufacturing.stats') as unknown as any[]) || []
  const storeCities = (t('about.stores.cities') as unknown as any[]) || []

  return (
    <>
      <Header transparent />
      <main className="bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/brand_assets/page1_img1.jpeg"
              alt="关于漫骑游"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
          </div>
          
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <h1 className="font-zh-display text-6xl font-bold md:text-8xl">
                {t('about.hero.title')}
              </h1>
              <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-white/80 md:text-2xl">
                {t('about.hero.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-32 bg-gradient-to-b from-black to-zinc-900">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 md:grid-cols-4">
              {Array.isArray(stats) && stats.map((stat: any, index: number) => (
                <motion.div
                  key={stat.label || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className="font-en-display text-6xl font-light md:text-7xl text-brand-accent">
                    {stat.value}
                  </div>
                  <p className="mt-4 text-white/60">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-32 bg-zinc-900">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <span className="text-sm tracking-[0.3em] text-brand-accent">
                {t('about.story.badge')}
              </span>
              <h2 className="mt-4 font-zh-display text-4xl font-bold md:text-6xl">
                {t('about.story.title')}
              </h2>
              <p className="mt-8 text-xl leading-relaxed text-white/80 md:text-2xl">
                {t('about.story.content')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-32 bg-black">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="text-sm tracking-[0.3em] text-brand-accent">
                {t('about.timeline.badge')}
              </span>
              <h2 className="mt-4 font-zh-display text-4xl font-bold md:text-6xl">
                {t('about.timeline.title')}
              </h2>
            </motion.div>

            <div className="space-y-12">
              {Array.isArray(timeline) && timeline.map((milestone: any, index: number) => (
                <motion.div
                  key={milestone.year || index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex items-center gap-8"
                >
                  <div className="flex-shrink-0 w-32 text-right">
                    <span className="font-en-display text-4xl font-bold text-brand-accent">
                      {milestone.year}
                    </span>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-brand-accent" />
                  <div className="flex-1">
                    <p className="text-xl text-white/80">{milestone.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Manufacturing Base */}
        <section className="py-32 bg-gradient-to-b from-black via-zinc-900 to-black">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="text-sm tracking-[0.3em] text-brand-accent">
                {t('about.manufacturing.badge')}
              </span>
              <h2 className="mt-4 font-zh-display text-4xl font-bold md:text-6xl">
                {t('about.manufacturing.title')}
              </h2>
              <p className="mt-6 text-xl text-white/70">
                {t('about.manufacturing.desc')}
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid gap-8 md:grid-cols-3 mb-16">
              {Array.isArray(manufacturingStats) && manufacturingStats.map((stat: any, index: number) => (
                <motion.div
                  key={stat.label || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className="font-en-display text-5xl font-light text-brand-accent md:text-6xl">
                    {stat.value}
                  </div>
                  <p className="mt-4 text-white/60">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Factory Images */}
            <div className="grid gap-6 md:grid-cols-2">
              {[
                '/pics/工厂/日本展会三折页NEW-03.jpg',
                '/pics/工厂/日本展会三折页NEW-04.jpg',
                '/pics/工厂/日本展会三折页NEW-05.jpg',
                '/pics/工厂/日本展会三折页NEW-06.jpg',
              ].map((img, index) => (
                <motion.div
                  key={img}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
                >
                  <Image
                    src={img}
                    alt="智造基地"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Store Gallery - New */}
        <section className="py-32 bg-zinc-900">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="text-sm tracking-[0.3em] text-brand-accent">
                {t('about.stores.badge')}
              </span>
              <h2 className="mt-4 font-zh-display text-4xl font-bold md:text-6xl">
                {t('about.stores.title')}
              </h2>
              <p className="mt-6 text-xl text-white/70">
                {t('about.stores.desc')}
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { 
                  img: '/pics/慈城店/DSC09413.JPG', 
                  name: storeCities[0]?.name || (locale === 'en' ? 'Ningbo Dongqian Lake Store' : '宁波东钱湖店'),
                  location: storeCities[0]?.location || (locale === 'en' ? 'Zhejiang · Ningbo' : '浙江·宁波')
                },
                { 
                  img: '/pics/慈城店/DSC09441.JPG', 
                  name: storeCities[1]?.name || (locale === 'en' ? 'Ningbo Cicheng Store' : '宁波慈城店'),
                  location: storeCities[1]?.location || (locale === 'en' ? 'Zhejiang · Ningbo' : '浙江·宁波')
                },
                { 
                  img: '/pics/漫骑游姚江店/微信图片_20260106145203_918_.png', 
                  name: storeCities[2]?.name || (locale === 'en' ? 'Ningbo Yaojiang Store' : '宁波姚江店'),
                  location: storeCities[2]?.location || (locale === 'en' ? 'Zhejiang · Ningbo' : '浙江·宁波')
                },
                { 
                  img: '/pics/海南儋州/微信图片_20260105163320_59_2525.jpg', 
                  name: storeCities[3]?.name || (locale === 'en' ? 'Hainan Danzhou Store' : '海南儋州店'),
                  location: storeCities[3]?.location || (locale === 'en' ? 'Hainan · Danzhou' : '海南·儋州')
                },
                { 
                  img: '/pics/贵州兴义市/未标题-4-23.jpg', 
                  name: storeCities[4]?.name || (locale === 'en' ? 'Guizhou Xingyi Store' : '贵州兴义店'),
                  location: storeCities[4]?.location || (locale === 'en' ? 'Guizhou · Xingyi' : '贵州·兴义')
                },
                { 
                  img: '/brand_assets/page1_img2.jpeg', 
                  name: storeCities[5]?.name || (locale === 'en' ? 'More Stores' : '更多门店'),
                  location: storeCities[5]?.location || (locale === 'en' ? 'Coming Soon' : '持续拓展中')
                },
              ].map((store, index) => (
                <motion.div
                  key={store.img}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <Image
                      src={store.img}
                      alt={store.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-zh-heading text-2xl font-bold mb-2">{store.name}</h3>
                    <p className="text-sm text-white/70">{store.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/brand_assets/page11_img3.jpeg"
              alt="加入漫骑游"
              fill
              className="object-cover"
              sizes="100vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/40 to-transparent" />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-zh-display text-4xl font-bold text-white md:text-6xl drop-shadow-lg">
                {t('about.cta.title')}
              </h2>
              <p className="mt-6 text-xl text-white/90 drop-shadow">
                {t('about.cta.desc')}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/community"
                  className="rounded-full bg-brand-accent px-8 py-4 font-medium text-black shadow-lg transition-all hover:scale-105 hover:shadow-brand-accent/50"
                >
                  {t('about.cta.member')}
                </Link>
                <Link
                  href="/partners"
                  className="rounded-full border-2 border-white bg-white/20 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:bg-white hover:text-brand-primary"
                >
                  {t('about.cta.cooperate')}
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
