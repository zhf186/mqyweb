'use client'

import * as React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'

const galleryImages = [
  '/brand_assets/ebike/page10_img1.jpeg',
  '/brand_assets/ebike/page10_img2.jpeg',
  '/brand_assets/ebike/page10_img6.jpeg',
  '/brand_assets/ebike/page10_img5.jpeg',
] as const

export default function EbikePage() {
  const { t, locale } = useTranslation()
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <>
      <Header transparent />
      <main className="bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          <motion.div style={{ opacity }} className="absolute inset-0 bg-black">
            <Image
              src="/brand_assets/ebike/page11_img1.jpeg"
              alt={t('ebikePage.heroImageAlt')}
              fill
              priority
              quality={85}
              className="object-cover"
              style={{ objectPosition: 'left 72%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
          </motion.div>
          
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center md:items-end md:text-right">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="md:max-w-2xl md:pr-4"
            >
              <span className="text-sm tracking-[0.3em] text-brand-accent">{t('ebikePage.heroBadge')}</span>
              <h1 className="mt-4 font-zh-display text-6xl font-bold md:text-8xl">
                {t('ebikePage.heroTitle')}
              </h1>
              <p className="mt-6 text-xl text-white/70 md:text-2xl">
                {t('ebikePage.heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Intro Text - Simplified */}
        <section className="bg-black py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm tracking-[0.3em] text-brand-accent">GERMAN HERITAGE</span>
              <h2 className="mt-4 font-zh-display text-4xl font-bold md:text-5xl">
                {t('home.brand.title')}
              </h2>
              <p className="mt-6 text-xl text-white/60 md:text-2xl">
                {t('ebikePage.introLine1')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Key Features Highlight - 3 Core Points */}
        <section className="bg-zinc-950 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 md:grid-cols-3">
              {/* Lightweight */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="mb-6 flex items-baseline justify-center gap-2">
                  <span className="font-en-display text-7xl font-light text-brand-accent">11.9</span>
                  <span className="text-2xl text-white/60">{t('units.kg')}</span>
                </div>
                <h3 className="font-zh-heading text-2xl font-bold">{t('ebikePage.features.lightweight.title')}</h3>
                <p className="mt-3 text-white/60">{t('ebikePage.features.lightweight.desc')}</p>
              </motion.div>

              {/* Smart System */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-center"
              >
                <div className="mb-6 flex items-baseline justify-center gap-2">
                  <span className="font-en-display text-7xl font-light text-brand-accent">100</span>
                  <span className="text-2xl text-white/60">{locale === 'en' ? t('routes.units.km') : t('routes.units.km')}</span>
                </div>
                <h3 className="font-zh-heading text-2xl font-bold">{t('ebikePage.features.smartAssist.title')}</h3>
                <p className="mt-3 text-white/60">{t('ebikePage.features.smartAssist.desc')}</p>
              </motion.div>

              {/* German Heritage */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <div className="mb-6 flex items-baseline justify-center gap-2">
                  <span className="font-en-display text-7xl font-light text-brand-accent">25</span>
                  <span className="text-2xl text-white/60">KM/H</span>
                </div>
                <h3 className="font-zh-heading text-2xl font-bold">{t('ebikePage.features.smartAssist.maxAssistSpeedLabel')}</h3>
                <p className="mt-3 text-white/60">{t('ebikePage.smartAssistLabel')}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Design Section - Large Image Display */}
        <section className="relative min-h-screen">
          <div className="sticky top-0 h-screen overflow-hidden">
            <Image
              src="/brand_assets/ebike/page10_img2.jpeg"
              alt={t('ebikePage.designImageAlt')}
              fill
              loading="lazy"
              quality={80}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-7xl px-6">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="max-w-xl"
                >
                  <span className="text-sm tracking-[0.3em] text-brand-accent">DESIGN</span>
                  <h2 className="mt-4 font-zh-display text-5xl font-bold md:text-7xl">
                    {t('ebikePage.designTitle')}
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-white/70 md:text-xl">
                    {t('ebikePage.designDesc')}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Gallery - Horizontal Scroll */}
        <section className="bg-black py-20">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 px-6" style={{ width: 'max-content' }}>
              {galleryImages.map((src, index) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                  className="relative h-[500px] w-[400px] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={src}
                    alt={`${t('ebikePage.galleryAlt')} ${index + 1}`}
                    fill
                    loading="lazy"
                    quality={75}
                    sizes="400px"
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Carbon Fiber Section - Simplified */}
        <section className="relative min-h-screen">
          <div className="sticky top-0 h-screen overflow-hidden">
            <Image
              src="/brand_assets/ebike/page10_img3.jpeg"
              alt={t('ebikePage.carbonImageAlt')}
              fill
              loading="lazy"
              quality={80}
              className="object-cover"
              style={{ objectPosition: 'left 50%' }}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[70%] bg-gradient-to-l from-black/90 via-black/50 to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-end">
              <div className="mx-auto w-full max-w-7xl px-6">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="ml-auto max-w-lg text-right"
                >
                  <span className="text-sm tracking-[0.3em] text-brand-accent">CARBON FIBER</span>
                  <h2 className="mt-4 font-zh-display text-4xl font-bold md:text-5xl">
                    {t('ebikePage.carbonTitle')}
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-white/70 md:text-xl">
                    {t('ebikePage.carbonDesc')}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Simplified */}
        <section className="bg-black py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Charging */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center"
              >
                <h3 className="font-zh-heading text-3xl font-bold">{t('ebikePage.features.charging.title')}</h3>
                <p className="mt-4 text-white/60">
                  {t('ebikePage.features.charging.chargerDesc')}
                </p>
                <div className="mt-8 flex items-baseline gap-2">
                  <span className="font-en-display text-6xl font-light text-brand-accent">2.5</span>
                  <div className="text-white/60">
                    <div className="text-xl">{t('ebikePage.features.charging.hoursUnit')}</div>
                    <div className="text-sm">{t('ebikePage.features.charging.fullChargeLabel')}</div>
                  </div>
                </div>
              </motion.div>

              {/* Belt Drive */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col justify-center"
              >
                <h3 className="font-zh-heading text-3xl font-bold">{t('ebikePage.features.beltDrive.title')}</h3>
                <p className="mt-4 text-white/60">
                  {t('ebikePage.features.beltDrive.desc')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partner Endorsement Section */}
        <section className="bg-black py-32">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <span className="text-sm tracking-[0.3em] text-brand-accent">PARTNERS</span>
              <h2 className="mt-4 font-zh-display text-4xl font-bold md:text-5xl">
                {t('ebikePage.partners.title')}
              </h2>
            </motion.div>

            <div className="grid gap-12 md:grid-cols-2">
              {/* Yadea */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-900/20 to-black p-12 transition-all duration-500 hover:from-red-900/30">
                  <div className="mb-8 text-center">
                    <div className="text-6xl font-bold text-red-500 transition-transform duration-500 group-hover:scale-110">
                      雅迪
                    </div>
                    <div className="mt-2 text-sm tracking-widest text-white/40">YADEA</div>
                  </div>
                  <h3 className="mb-3 text-center text-2xl font-bold">{t('partners.yadea.title')}</h3>
                  <p className="mb-4 text-center text-lg text-white/60">{t('partners.yadea.subtitle')}</p>
                  <p className="text-center text-white/50">{t('partners.yadea.desc')}</p>
                </div>
              </motion.div>

              {/* Gazelle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/20 to-black p-12 transition-all duration-500 hover:from-blue-900/30">
                  <div className="mb-8 text-center">
                    <div className="text-6xl font-bold text-blue-400 transition-transform duration-500 group-hover:scale-110" style={{ fontFamily: 'serif' }}>
                      Gazelle
                    </div>
                    <div className="mt-2 text-sm tracking-widest text-white/40">ROYAL DUTCH</div>
                  </div>
                  <h3 className="mb-3 text-center text-2xl font-bold">{t('partners.gazelle.title')}</h3>
                  <p className="mb-4 text-center text-lg text-white/60">{t('partners.gazelle.subtitle')}</p>
                  <p className="text-center text-white/50">{t('partners.gazelle.desc')}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Models Comparison */}
        <section className="bg-zinc-950 py-32">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <h2 className="font-zh-display text-4xl font-bold md:text-5xl">
                {t('ebikePage.models.compareTitle')}
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Model 1S */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <Image
                    src="/brand_assets/ebike/page10_img2.jpeg"
                    alt={t('ebikePage.models.tour1s')}
                    fill
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-8"
                  />
                </div>
                <div className="mt-8">
                  <h3 className="font-zh-heading text-2xl font-bold">{t('ebikePage.models.tour1s')}</h3>
                  <p className="mt-2 text-white/60">
                    {t('ebikePage.models.tour1sDesc')}
                  </p>
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-white/60">{t('ebikePage.models.specs.weight')}</span>
                      <span>11.9 Kg</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-white/60">{t('ebikePage.models.specs.seatpost')}</span>
                      <span>{t('ebikePage.models.materials.carbon3k')}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-white/60">{t('ebikePage.models.specs.handlebar')}</span>
                      <span>{t('ebikePage.models.materials.carbon3k')}</span>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <span className="text-3xl font-bold text-brand-accent">¥9,999</span>
                  </div>
                </div>
              </motion.div>

              {/* Model 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <Image
                    src="/brand_assets/ebike/page10_img6.jpeg"
                    alt={t('ebikePage.models.tour1')}
                    fill
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-8"
                  />
                </div>
                <div className="mt-8">
                  <h3 className="font-zh-heading text-2xl font-bold">{t('ebikePage.models.tour1')}</h3>
                  <p className="mt-2 text-white/60">
                    {t('ebikePage.models.tour1Desc')}
                  </p>
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-white/60">{t('ebikePage.models.specs.weight')}</span>
                      <span>12.5 Kg</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-white/60">{t('ebikePage.models.specs.seatpost')}</span>
                      <span>{t('ebikePage.models.materials.aluminum')}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-white/60">{t('ebikePage.models.specs.handlebar')}</span>
                      <span>{t('ebikePage.models.materials.aluminum')}</span>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <span className="text-3xl font-bold text-brand-accent">¥6,999</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Warranty Section - Simplified */}
        <section className="bg-black py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { title: t('ebikePage.warranty.strong.title'), desc: t('ebikePage.warranty.strong.desc') },
                { title: t('ebikePage.warranty.promise.title'), desc: t('ebikePage.warranty.promise.desc') },
                { title: t('ebikePage.warranty.return.title'), desc: t('ebikePage.warranty.return.desc') },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8"
                >
                  <h3 className="font-zh-heading text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-white/60">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Simplified */}
        <section className="bg-zinc-950 py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-zh-display text-4xl font-bold md:text-5xl">
                {t('ebikePage.cta.title')}
              </h2>
              <p className="mt-6 text-xl text-white/60">
                {t('ebikePage.cta.desc')}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button className="rounded-full bg-white px-8 py-4 font-medium text-black transition-transform hover:scale-105">
                  {t('ebikePage.cta.testRide')}
                </button>
                <button className="rounded-full border border-white/30 px-8 py-4 font-medium transition-colors hover:bg-white/10">
                  {t('ebikePage.cta.buyNow')}
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Help Section */}
        <section className="border-t border-white/10 bg-black py-16">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-white/60">{t('ebikePage.help.needHelp')}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-6">
              <Link href="/faq" className="text-brand-accent hover:underline">{t('footer.links.faq')}</Link>
              <Link href="/contact" className="text-brand-accent hover:underline">{t('nav.contact')}</Link>
              <span className="text-white/60">{t('footer.serviceLineLabel')} 0574-87195586</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
