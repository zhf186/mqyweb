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

export default function AboutPage() {
  const { t, locale } = useTranslation()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('editMode') === 'true'

  // Get typed data from translations with fallbacks
  const stats = (t('about.stats') as unknown as any[]) || []
  const timeline = (t('about.timeline.milestones') as unknown as any[]) || []
  const manufacturingStats = (t('about.manufacturing.stats') as unknown as any[]) || []
  const storeCities = (t('about.stores.cities') as unknown as any[]) || []

  // 编辑模式支持
  React.useEffect(() => {
    if (!isEditMode) return

    console.log('[about/page.tsx] Edit mode enabled, setting up message listener')
    injectUpdateAnimationStyles()

    const handleMessage = (event: MessageEvent<IframeBridgeMessage>) => {
      if (event.origin !== window.location.origin) return
      
      console.log('[about/page.tsx] Received message:', event.data)
      const message = event.data
      
      switch (message.type) {
        case 'INIT_EDIT_MODE':
          console.log('Edit mode initialized with locale:', message.payload.locale)
          break
          
        case 'REQUEST_EDITABLE_ELEMENTS':
          console.log('[about/page.tsx] Detecting editable elements...')
          const elements = detectEditableElements(document)
          console.log('[about/page.tsx] Found', elements.length, 'editable elements')
          window.parent.postMessage({
            type: 'EDITABLE_ELEMENTS_RESPONSE',
            payload: elements
          }, window.location.origin)
          break
          
        case 'UPDATE_CONTENT':
          const { fieldKey, content } = message.payload
          const selector = `[data-editable="${fieldKey}"]`
          const element = findElementBySelector(selector, document)
          
          if (element) {
            const type = element.getAttribute('data-editable-type') as 'text' | 'image'
            updateElementContent(element, content, type)
            console.log('Content updated:', fieldKey, content)
          }
          break
          
        case 'UPDATE_IMAGE':
          const { fieldKey: imageFieldKey, imagePath } = message.payload
          const imageSelector = `[data-editable="${imageFieldKey}"]`
          const imageElement = findElementBySelector(imageSelector, document)
          
          if (imageElement) {
            updateElementContent(imageElement, imagePath, 'image')
            console.log('Image updated:', imageFieldKey, imagePath)
          }
          break
          
        case 'EXIT_EDIT_MODE':
          console.log('Exiting edit mode')
          break
      }
    }

    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        window.parent.postMessage({
          type: 'IFRAME_SCROLLED'
        }, window.location.origin)
      }, 100)
    }

    window.addEventListener('message', handleMessage)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    window.parent.postMessage({
      type: 'IFRAME_READY'
    }, window.location.origin)
    
    window.parent.postMessage({
      type: 'IFRAME_LOADED'
    }, window.location.origin)

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
          <div className="absolute inset-0">
            <Image
              src="/brand_assets/page1_img1.jpeg"
              alt="关于漫骑游"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={85}
              data-editable="about.hero.background"
              data-editable-type="image"
              data-editable-label="关于页Hero背景图"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
          </div>
          
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <h1 
                className="font-zh-display text-6xl font-bold md:text-8xl"
                data-editable="about.hero.title"
                data-editable-type="text"
                data-editable-label="关于页标题"
              >
                {t('about.hero.title')}
              </h1>
              <p 
                className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-white/80 md:text-2xl"
                data-editable="about.hero.subtitle"
                data-editable-type="text"
                data-editable-label="关于页副标题"
              >
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
                  <div 
                    className="font-en-display text-6xl font-light md:text-7xl text-brand-accent"
                    data-editable={`about.stats.${index}.value`}
                    data-editable-type="text"
                    data-editable-label={`统计数据${index + 1}数值`}
                  >
                    {stat.value}
                  </div>
                  <p 
                    className="mt-4 text-white/60"
                    data-editable={`about.stats.${index}.label`}
                    data-editable-type="text"
                    data-editable-label={`统计数据${index + 1}标签`}
                  >
                    {stat.label}
                  </p>
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
              <span 
                className="text-sm tracking-[0.3em] text-brand-accent"
                data-editable="about.story.badge"
                data-editable-type="text"
                data-editable-label="品牌故事徽章"
              >
                {t('about.story.badge')}
              </span>
              <h2 
                className="mt-4 font-zh-display text-4xl font-bold md:text-6xl"
                data-editable="about.story.title"
                data-editable-type="text"
                data-editable-label="品牌故事标题"
              >
                {t('about.story.title')}
              </h2>
              <p 
                className="mt-8 text-xl leading-relaxed text-white/80 md:text-2xl"
                data-editable="about.story.content"
                data-editable-type="text"
                data-editable-label="品牌故事内容"
              >
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
              <span 
                className="text-sm tracking-[0.3em] text-brand-accent"
                data-editable="about.timeline.badge"
                data-editable-type="text"
                data-editable-label="发展历程徽章"
              >
                {t('about.timeline.badge')}
              </span>
              <h2 
                className="mt-4 font-zh-display text-4xl font-bold md:text-6xl"
                data-editable="about.timeline.title"
                data-editable-type="text"
                data-editable-label="发展历程标题"
              >
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
                    <span 
                      className="font-en-display text-4xl font-bold text-brand-accent"
                      data-editable={`about.timeline.${index}.year`}
                      data-editable-type="text"
                      data-editable-label={`里程碑${index + 1}年份`}
                    >
                      {milestone.year}
                    </span>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-brand-accent" />
                  <div className="flex-1">
                    <p 
                      className="text-xl text-white/80"
                      data-editable={`about.timeline.${index}.event`}
                      data-editable-type="text"
                      data-editable-label={`里程碑${index + 1}事件`}
                    >
                      {milestone.event}
                    </p>
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
              <span 
                className="text-sm tracking-[0.3em] text-brand-accent"
                data-editable="about.manufacturing.badge"
                data-editable-type="text"
                data-editable-label="智造基地徽章"
              >
                {t('about.manufacturing.badge')}
              </span>
              <h2 
                className="mt-4 font-zh-display text-4xl font-bold md:text-6xl"
                data-editable="about.manufacturing.title"
                data-editable-type="text"
                data-editable-label="智造基地标题"
              >
                {t('about.manufacturing.title')}
              </h2>
              <p 
                className="mt-6 text-xl text-white/70"
                data-editable="about.manufacturing.desc"
                data-editable-type="text"
                data-editable-label="智造基地描述"
              >
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
                  <div 
                    className="font-en-display text-5xl font-light text-brand-accent md:text-6xl"
                    data-editable={`about.manufacturing.stats.${index}.value`}
                    data-editable-type="text"
                    data-editable-label={`制造统计${index + 1}数值`}
                  >
                    {stat.value}
                  </div>
                  <p 
                    className="mt-4 text-white/60"
                    data-editable={`about.manufacturing.stats.${index}.label`}
                    data-editable-type="text"
                    data-editable-label={`制造统计${index + 1}标签`}
                  >
                    {stat.label}
                  </p>
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
                    data-editable={`about.manufacturing.images.${index + 1}`}
                    data-editable-type="image"
                    data-editable-label={`Manufacturing Image ${index + 1}`}
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
              <span 
                className="text-sm tracking-[0.3em] text-brand-accent"
                data-editable="about.stores.badge"
                data-editable-type="text"
                data-editable-label="门店网络徽章"
              >
                {t('about.stores.badge')}
              </span>
              <h2 
                className="mt-4 font-zh-display text-4xl font-bold md:text-6xl"
                data-editable="about.stores.title"
                data-editable-type="text"
                data-editable-label="门店网络标题"
              >
                {t('about.stores.title')}
              </h2>
              <p 
                className="mt-6 text-xl text-white/70"
                data-editable="about.stores.desc"
                data-editable-type="text"
                data-editable-label="门店网络描述"
              >
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
                      data-editable={`about.stores.items.${index + 1}.image`}
                      data-editable-type="image"
                      data-editable-label={`Store ${index + 1} Image`}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3
                      className="font-zh-heading text-2xl font-bold mb-2"
                      data-editable={`about.stores.items.${index + 1}.name`}
                      data-editable-type="text"
                      data-editable-label={`Store ${index + 1} Name`}
                    >
                      {store.name}
                    </h3>
                    <p
                      className="text-sm text-white/70"
                      data-editable={`about.stores.items.${index + 1}.location`}
                      data-editable-type="text"
                      data-editable-label={`Store ${index + 1} Location`}
                    >
                      {store.location}
                    </p>
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
              data-editable="about.cta.background"
              data-editable-type="image"
              data-editable-label="关于页CTA背景图"
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
              <h2 
                className="font-zh-display text-4xl font-bold text-white md:text-6xl drop-shadow-lg"
                data-editable="about.cta.title"
                data-editable-type="text"
                data-editable-label="关于页CTA标题"
              >
                {t('about.cta.title')}
              </h2>
              <p 
                className="mt-6 text-xl text-white/90 drop-shadow"
                data-editable="about.cta.desc"
                data-editable-type="text"
                data-editable-label="关于页CTA描述"
              >
                {t('about.cta.desc')}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/community"
                  className="rounded-full bg-brand-accent px-8 py-4 font-medium text-black shadow-lg transition-all hover:scale-105 hover:shadow-brand-accent/50"
                  data-editable="about.cta.member"
                  data-editable-type="text"
                  data-editable-label="About CTA Member Button"
                >
                  {t('about.cta.member')}
                </Link>
                <Link
                  href="/partners"
                  className="rounded-full border-2 border-white bg-white/20 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:bg-white hover:text-brand-primary"
                  data-editable="about.cta.cooperate"
                  data-editable-type="text"
                  data-editable-label="About CTA Cooperate Button"
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
