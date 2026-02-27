'use client'

import * as React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'
import { detectEditableElements, updateElementContent, findElementBySelector, injectUpdateAnimationStyles } from '@/lib/visual-editor/editable-detector'
import type { IframeBridgeMessage } from '@/lib/visual-editor/types'

const galleryImages = [
  '/brand_assets/ebike/page10_img1.jpeg',
  '/brand_assets/ebike/page10_img2.jpeg',
  '/brand_assets/ebike/page10_img6.jpeg',
  '/brand_assets/ebike/page10_img5.jpeg',
] as const

export default function EbikePage() {
  const { t, locale } = useTranslation()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('editMode') === 'true'
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  // 编辑模式支持
  React.useEffect(() => {
    if (!isEditMode) return

    console.log('[ebike/page.tsx] Edit mode enabled')
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
              data-editable="ebike.hero.background"
              data-editable-type="image"
              data-editable-label="E-BIKE页Hero背景图"
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
              <h1 
                className="mt-4 font-zh-display text-6xl font-bold md:text-8xl"
                data-editable="ebikePage.heroTitle"
                data-editable-type="text"
                data-editable-label="E-BIKE页标题"
              >
                {t('ebikePage.heroTitle')}
              </h1>
              <p 
                className="mt-6 text-xl text-white/70 md:text-2xl"
                data-editable="ebikePage.heroSubtitle"
                data-editable-type="text"
                data-editable-label="E-BIKE页副标题"
              >
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
              <span 
                className="text-sm tracking-[0.3em] text-brand-accent"
                data-editable="ebikePage.intro.badge"
                data-editable-type="text"
                data-editable-label="E-BIKE介绍徽章"
              >
                GERMAN HERITAGE
              </span>
              <h2 
                className="mt-4 font-zh-display text-4xl font-bold md:text-5xl"
                data-editable="ebikePage.intro.title"
                data-editable-type="text"
                data-editable-label="E-BIKE介绍标题"
              >
                {t('home.brand.title')}
              </h2>
              <p 
                className="mt-6 text-xl text-white/60 md:text-2xl"
                data-editable="ebikePage.introLine1"
                data-editable-type="text"
                data-editable-label="E-BIKE介绍描述"
              >
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
                  <span 
                    className="font-en-display text-7xl font-light text-brand-accent"
                    data-editable="ebikePage.features.lightweight.weight"
                    data-editable-type="text"
                    data-editable-label="轻量化重量"
                  >
                    11.9
                  </span>
                  <span className="text-2xl text-white/60">{t('units.kg')}</span>
                </div>
                <h3 
                  className="font-zh-heading text-2xl font-bold"
                  data-editable="ebikePage.features.lightweight.title"
                  data-editable-type="text"
                  data-editable-label="轻量化标题"
                >
                  {t('ebikePage.features.lightweight.title')}
                </h3>
                <p 
                  className="mt-3 text-white/60"
                  data-editable="ebikePage.features.lightweight.desc"
                  data-editable-type="text"
                  data-editable-label="轻量化描述"
                >
                  {t('ebikePage.features.lightweight.desc')}
                </p>
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
                  <span 
                    className="font-en-display text-7xl font-light text-brand-accent"
                    data-editable="ebikePage.features.smartAssist.range"
                    data-editable-type="text"
                    data-editable-label="智能助力续航"
                  >
                    100
                  </span>
                  <span className="text-2xl text-white/60">{locale === 'en' ? t('routes.units.km') : t('routes.units.km')}</span>
                </div>
                <h3 
                  className="font-zh-heading text-2xl font-bold"
                  data-editable="ebikePage.features.smartAssist.title"
                  data-editable-type="text"
                  data-editable-label="智能助力标题"
                >
                  {t('ebikePage.features.smartAssist.title')}
                </h3>
                <p 
                  className="mt-3 text-white/60"
                  data-editable="ebikePage.features.smartAssist.desc"
                  data-editable-type="text"
                  data-editable-label="智能助力描述"
                >
                  {t('ebikePage.features.smartAssist.desc')}
                </p>
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
                  <span 
                    className="font-en-display text-7xl font-light text-brand-accent"
                    data-editable="ebikePage.features.maxSpeed"
                    data-editable-type="text"
                    data-editable-label="最高速度"
                  >
                    25
                  </span>
                  <span className="text-2xl text-white/60">KM/H</span>
                </div>
                <h3 
                  className="font-zh-heading text-2xl font-bold"
                  data-editable="ebikePage.features.smartAssist.maxAssistSpeedLabel"
                  data-editable-type="text"
                  data-editable-label="最高助力速度标签"
                >
                  {t('ebikePage.features.smartAssist.maxAssistSpeedLabel')}
                </h3>
                <p 
                  className="mt-3 text-white/60"
                  data-editable="ebikePage.smartAssistLabel"
                  data-editable-type="text"
                  data-editable-label="智能助力标签"
                >
                  {t('ebikePage.smartAssistLabel')}
                </p>
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
              data-editable="ebikePage.design.background"
              data-editable-type="image"
              data-editable-label="设计背景图"
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
                  <span 
                    className="text-sm tracking-[0.3em] text-brand-accent"
                    data-editable="ebikePage.design.badge"
                    data-editable-type="text"
                    data-editable-label="设计徽章"
                  >
                    DESIGN
                  </span>
                  <h2 
                    className="mt-4 font-zh-display text-5xl font-bold md:text-7xl"
                    data-editable="ebikePage.designTitle"
                    data-editable-type="text"
                    data-editable-label="设计标题"
                  >
                    {t('ebikePage.designTitle')}
                  </h2>
                  <p 
                    className="mt-6 text-lg leading-relaxed text-white/70 md:text-xl"
                    data-editable="ebikePage.designDesc"
                    data-editable-type="text"
                    data-editable-label="设计描述"
                  >
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
              data-editable="ebikePage.carbon.background"
              data-editable-type="image"
              data-editable-label="碳纤维背景图"
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
                  <span
                    className="text-sm tracking-[0.3em] text-brand-accent"
                    data-editable="ebikePage.carbon.badge"
                    data-editable-type="text"
                    data-editable-label="碳纤维徽章"
                  >CARBON FIBER</span>
                  <h2
                    className="mt-4 font-zh-display text-4xl font-bold md:text-5xl"
                    data-editable="ebikePage.carbonTitle"
                    data-editable-type="text"
                    data-editable-label="碳纤维标题"
                  >
                    {t('ebikePage.carbonTitle')}
                  </h2>
                  <p
                    className="mt-6 text-lg leading-relaxed text-white/70 md:text-xl"
                    data-editable="ebikePage.carbonDesc"
                    data-editable-type="text"
                    data-editable-label="碳纤维描述"
                  >
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
                <h3
                  className="font-zh-heading text-3xl font-bold"
                  data-editable="ebikePage.features.charging.title"
                  data-editable-type="text"
                  data-editable-label="充电标题"
                >{t('ebikePage.features.charging.title')}</h3>
                <p
                  className="mt-4 text-white/60"
                  data-editable="ebikePage.features.charging.chargerDesc"
                  data-editable-type="text"
                  data-editable-label="充电描述"
                >
                  {t('ebikePage.features.charging.chargerDesc')}
                </p>
                <div className="mt-8 flex items-baseline gap-2">
                  <span
                    className="font-en-display text-6xl font-light text-brand-accent"
                    data-editable="ebikePage.features.charging.hours"
                    data-editable-type="text"
                    data-editable-label="充电时间"
                  >2.5</span>
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
                <h3
                  className="font-zh-heading text-3xl font-bold"
                  data-editable="ebikePage.features.beltDrive.title"
                  data-editable-type="text"
                  data-editable-label="皮带传动标题"
                >{t('ebikePage.features.beltDrive.title')}</h3>
                <p
                  className="mt-4 text-white/60"
                  data-editable="ebikePage.features.beltDrive.desc"
                  data-editable-type="text"
                  data-editable-label="皮带传动描述"
                >
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
              <span
                className="text-sm tracking-[0.3em] text-brand-accent"
                data-editable="ebikePage.partners.badge"
                data-editable-type="text"
                data-editable-label="合作伙伴徽章"
              >PARTNERS</span>
              <h2
                className="mt-4 font-zh-display text-4xl font-bold md:text-5xl"
                data-editable="ebikePage.partners.title"
                data-editable-type="text"
                data-editable-label="合作伙伴标题"
              >
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
                  <h3
                    className="mb-3 text-center text-2xl font-bold"
                    data-editable="ebikePage.partners.yadea.title"
                    data-editable-type="text"
                    data-editable-label="雅迪标题"
                  >{t('partners.yadea.title')}</h3>
                  <p
                    className="mb-4 text-center text-lg text-white/60"
                    data-editable="ebikePage.partners.yadea.subtitle"
                    data-editable-type="text"
                    data-editable-label="雅迪副标题"
                  >{t('partners.yadea.subtitle')}</p>
                  <p
                    className="text-center text-white/50"
                    data-editable="ebikePage.partners.yadea.desc"
                    data-editable-type="text"
                    data-editable-label="雅迪描述"
                  >{t('partners.yadea.desc')}</p>
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
                  <h3
                    className="mb-3 text-center text-2xl font-bold"
                    data-editable="ebikePage.partners.gazelle.title"
                    data-editable-type="text"
                    data-editable-label="Gazelle标题"
                  >{t('partners.gazelle.title')}</h3>
                  <p
                    className="mb-4 text-center text-lg text-white/60"
                    data-editable="ebikePage.partners.gazelle.subtitle"
                    data-editable-type="text"
                    data-editable-label="Gazelle副标题"
                  >{t('partners.gazelle.subtitle')}</p>
                  <p
                    className="text-center text-white/50"
                    data-editable="ebikePage.partners.gazelle.desc"
                    data-editable-type="text"
                    data-editable-label="Gazelle描述"
                  >{t('partners.gazelle.desc')}</p>
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
              <h2
                className="font-zh-display text-4xl font-bold md:text-5xl"
                data-editable="ebikePage.models.compareTitle"
                data-editable-type="text"
                data-editable-label="车型对比标题"
              >
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
                    data-editable="ebikePage.models.tour1s.image"
                    data-editable-type="image"
                    data-editable-label="途尔1S图片"
                  />
                </div>
                <div className="mt-8">
                  <h3
                    className="font-zh-heading text-2xl font-bold"
                    data-editable="ebikePage.models.tour1s.name"
                    data-editable-type="text"
                    data-editable-label="途尔1S名称"
                  >{t('ebikePage.models.tour1s')}</h3>
                  <p
                    className="mt-2 text-white/60"
                    data-editable="ebikePage.models.tour1s.desc"
                    data-editable-type="text"
                    data-editable-label="途尔1S描述"
                  >
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
                    <span
                      className="text-3xl font-bold text-brand-accent"
                      data-editable="ebikePage.models.tour1s.price"
                      data-editable-type="text"
                      data-editable-label="途尔1S价格"
                    >¥9,999</span>
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
                    data-editable="ebikePage.models.tour1.image"
                    data-editable-type="image"
                    data-editable-label="途尔1图片"
                  />
                </div>
                <div className="mt-8">
                  <h3
                    className="font-zh-heading text-2xl font-bold"
                    data-editable="ebikePage.models.tour1.name"
                    data-editable-type="text"
                    data-editable-label="途尔1名称"
                  >{t('ebikePage.models.tour1')}</h3>
                  <p
                    className="mt-2 text-white/60"
                    data-editable="ebikePage.models.tour1.desc"
                    data-editable-type="text"
                    data-editable-label="途尔1描述"
                  >
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
                    <span
                      className="text-3xl font-bold text-brand-accent"
                      data-editable="ebikePage.models.tour1.price"
                      data-editable-type="text"
                      data-editable-label="途尔1价格"
                    >¥6,999</span>
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
              <h2 
                className="font-zh-display text-4xl font-bold md:text-5xl"
                data-editable="ebikePage.cta.title"
                data-editable-type="text"
                data-editable-label="E-BIKE CTA标题"
              >
                {t('ebikePage.cta.title')}
              </h2>
              <p 
                className="mt-6 text-xl text-white/60"
                data-editable="ebikePage.cta.desc"
                data-editable-type="text"
                data-editable-label="E-BIKE CTA描述"
              >
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
