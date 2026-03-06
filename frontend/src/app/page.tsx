'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useLocaleStore } from '@/stores/locale'
import { useEffect, useState } from 'react'
import { getPageContent, getContent, type CMSContent } from '@/lib/api/public-content'
import { useSearchParams } from 'next/navigation'
import { detectEditableElements, updateElementContent, findElementBySelector, injectUpdateAnimationStyles } from '@/lib/visual-editor/editable-detector'
import type { IframeBridgeMessage } from '@/lib/visual-editor/types'

export default function Home() {
  const locale = useLocaleStore((state) => state.locale)
  const [dict, setDict] = useState<any>(null)
  const [cmsContent, setCmsContent] = useState<CMSContent>({})
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('editMode') === 'true'

  useEffect(() => {
    import(`@/lib/i18n/dictionaries/${locale}.json`).then((module) => {
      setDict(module.default)
    })
  }, [locale])

  useEffect(() => {
    // 从CMS获取首页内容
    getPageContent('home').then((content) => {
      setCmsContent(content)
    })
  }, [])

  // 编辑模式支持
  useEffect(() => {
    if (!isEditMode) return

    console.log('[page.tsx] Edit mode enabled, setting up message listener')

    // 注入动画样式
    injectUpdateAnimationStyles()

    const handleMessage = (event: MessageEvent<IframeBridgeMessage>) => {
      // 只接受同源消息
      if (event.origin !== window.location.origin) return
      
      console.log('[page.tsx] Received message:', event.data)
      const message = event.data
      
      switch (message.type) {
        case 'INIT_EDIT_MODE':
          // 初始化编辑模式
          console.log('Edit mode initialized with locale:', message.payload.locale)
          break
          
        case 'REQUEST_EDITABLE_ELEMENTS':
          // 发送可编辑元素信息
          console.log('[page.tsx] Detecting editable elements...')
          const elements = detectEditableElements(document)
          console.log('[page.tsx] Found', elements.length, 'editable elements')
          window.parent.postMessage({
            type: 'EDITABLE_ELEMENTS_RESPONSE',
            payload: elements
          }, window.location.origin)
          console.log('[page.tsx] Sent EDITABLE_ELEMENTS_RESPONSE to parent')
          break
          
        case 'UPDATE_CONTENT':
          // 更新内容
          const { fieldKey, content, locale: updateLocale } = message.payload
          const selector = `[data-editable="${fieldKey}"]`
          const element = findElementBySelector(selector, document)
          
          if (element) {
            const type = element.getAttribute('data-editable-type') as 'text' | 'image'
            updateElementContent(element, content, type)
            console.log('Content updated:', fieldKey, content)
          } else {
            console.warn('Element not found for fieldKey:', fieldKey)
          }
          break
          
        case 'UPDATE_IMAGE':
          // 更新图片
          const { fieldKey: imageFieldKey, imagePath } = message.payload
          const imageSelector = `[data-editable="${imageFieldKey}"]`
          const imageElement = findElementBySelector(imageSelector, document)
          
          if (imageElement) {
            updateElementContent(imageElement, imagePath, 'image')
            console.log('Image updated:', imageFieldKey, imagePath)
          } else {
            console.warn('Image element not found for fieldKey:', imageFieldKey)
          }
          break
          
        case 'EXIT_EDIT_MODE':
          // 退出编辑模式（可选：刷新页面）
          console.log('Exiting edit mode')
          break
      }
    }

    // 监听滚动事件，通知父窗口更新元素位置
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        console.log('[page.tsx] Scroll detected, notifying parent')
        window.parent.postMessage({
          type: 'IFRAME_SCROLLED'
        }, window.location.origin)
      }, 100) // Debounce scroll events
    }

    window.addEventListener('message', handleMessage)
    window.addEventListener('scroll', handleScroll, { passive: true })
    console.log('[page.tsx] Message listener and scroll listener registered')
    
    // 通知父窗口页面已加载并准备接收消息
    window.parent.postMessage({
      type: 'IFRAME_READY'
    }, window.location.origin)
    console.log('[page.tsx] Sent IFRAME_READY to parent')
    
    // Also send IFRAME_LOADED for backward compatibility
    window.parent.postMessage({
      type: 'IFRAME_LOADED'
    }, window.location.origin)
    console.log('[page.tsx] Sent IFRAME_LOADED to parent')

    return () => {
      console.log('[page.tsx] Removing message listener and scroll listener')
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [isEditMode])

  if (!dict) return null

  return (
    <>
      <Header transparent />
      <main className="bg-black text-white">
        {/* Hero Section - Full Screen Minimal */}
        <section className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={getContent(cmsContent, 'hero.background.image', locale, '/brand_assets/page1_img2.jpeg')}
              alt={dict.home.heroImageAlt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              data-editable="hero.background.image"
              data-editable-type="image"
              data-editable-label="Hero背景图"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            {/* 底部额外渐变，为过渡做准备 */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
          
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center sm:px-6">
            <div className="animate-fade-in">
              <h1 
                className="text-6xl font-bold tracking-wider sm:text-7xl md:text-9xl lg:text-[12rem]"
                data-editable="common.brand"
                data-editable-type="text"
                data-editable-label="品牌名称"
              >
                {getContent(cmsContent, 'common.brand', locale, dict.common.brand)}
              </h1>
              <p 
                className="mt-6 text-xl tracking-[0.3em] text-white/90 sm:mt-8 sm:text-2xl md:text-3xl"
                data-editable="common.slogan"
                data-editable-type="text"
                data-editable-label="品牌口号"
              >
                {getContent(cmsContent, 'common.slogan', locale, dict.common.slogan)}
              </p>
            </div>
            
            <div className="absolute bottom-16">
              <div className="flex flex-col items-center gap-2 text-white/50 sm:gap-3 animate-bounce">
                <span className="text-xs tracking-[0.2em] uppercase sm:tracking-[0.3em]">{dict.hero.scrollDown}</span>
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Transition Spacer - 图片间隔过渡 */}
        <div className="relative h-32 sm:h-40 md:h-48 bg-black overflow-hidden">
          {/* 上方图片的延伸渐变 */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black to-transparent" />
          {/* 下方图片的预热渐变 */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
          {/* 中间装饰线 */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
            <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>

        {/* Brand Intro - Text on Right */}
        <section className="relative min-h-screen flex items-center">
          <div className="absolute inset-0">
            <Image
              src={getContent(cmsContent, 'brand.background.image', locale, '/brand_assets/page3_img4.jpeg')}
              alt={dict.home.brand.title}
              fill
              className="object-cover"
              sizes="100vw"
              data-editable="brand.background.image"
              data-editable-type="image"
              data-editable-label="品牌介绍背景图"
            />
            {/* 渐变遮罩 - 右侧更暗以突出文字 */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/50 to-black/30" />
            {/* 顶部渐变，与上方过渡自然衔接 */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
            {/* 底部渐变 */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
          </div>
          
          <div className="relative z-10 w-full py-24 sm:py-32 md:py-40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              {/* 文字放在右侧 */}
              <div className="ml-auto max-w-2xl text-right">
                <span 
                  className="inline-block text-xs tracking-[0.3em] text-orange-500 uppercase sm:tracking-[0.4em] mb-6 sm:mb-8"
                  data-editable="home.brand.badge"
                  data-editable-type="text"
                  data-editable-label="品牌徽章文字"
                >
                  {getContent(cmsContent, 'home.brand.badge', locale, dict.home.brand.badge)}
                </span>
                <h2 className="leading-tight flex items-baseline justify-end gap-3 sm:gap-4 md:gap-6">
                  <span 
                    className="text-3xl font-bold text-white/70 sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap"
                    data-editable="home.brand.title.part1"
                    data-editable-type="text"
                    data-editable-label="品牌标题第一部分"
                  >
                    {getContent(cmsContent, 'home.brand.title.part1', locale, locale === 'zh' ? '德国血统' : 'German Heritage')} ×
                  </span>
                  <span 
                    className="text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl whitespace-nowrap"
                    data-editable="home.brand.title.part2"
                    data-editable-type="text"
                    data-editable-label="品牌标题第二部分"
                  >
                    {getContent(cmsContent, 'home.brand.title.part2', locale, locale === 'zh' ? '智能骑行' : 'Smart Cycling')}
                  </span>
                </h2>
                <p 
                  className="mt-8 text-xl text-white/90 sm:mt-10 sm:text-2xl md:text-3xl"
                  data-editable="home.brand.desc"
                  data-editable-type="text"
                  data-editable-label="品牌描述"
                >
                  {getContent(cmsContent, 'home.brand.desc', locale, dict.home.brand.desc)}
                </p>
                <div className="mt-10 sm:mt-12 flex justify-end">
                  <Link
                    href="/ebike"
                    className="inline-flex items-center gap-3 text-lg text-orange-500 transition-colors hover:text-white group"
                  >
                    <span>{dict.common.learnMore}</span>
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* E-BIKE Highlight - 3 Features */}
        <section className="relative py-20 bg-gradient-to-b from-black via-zinc-900 to-black sm:py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <span className="text-xs tracking-[0.3em] text-orange-500 uppercase sm:tracking-[0.4em]">
                E-BIKE
              </span>
              <h2 
                className="mt-4 text-4xl font-bold sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl"
                data-editable="home.ebike.subtitle"
                data-editable-type="text"
                data-editable-label="E-BIKE副标题"
              >
                {getContent(cmsContent, 'home.ebike.subtitle', locale, dict.home.ebike.subtitle)}
              </h2>
            </div>

            <div className="grid gap-12 sm:gap-14 md:grid-cols-3 md:gap-16">
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1.5 sm:gap-2">
                  <span 
                    className="text-7xl font-light sm:text-8xl md:text-9xl"
                    data-editable="home.ebike.weight"
                    data-editable-type="text"
                    data-editable-label="E-BIKE重量"
                  >
                    {getContent(cmsContent, 'home.ebike.weight', locale, '11.9')}
                  </span>
                  <span className="text-xl text-white/50 sm:text-2xl">{dict.units.kg}</span>
                </div>
                <p className="mt-4 text-base text-white/60 sm:mt-6 sm:text-lg">{dict.home.statsWeight}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1.5 sm:gap-2">
                  <span 
                    className="text-7xl font-light sm:text-8xl md:text-9xl"
                    data-editable="home.ebike.range"
                    data-editable-type="text"
                    data-editable-label="E-BIKE续航"
                  >
                    {getContent(cmsContent, 'home.ebike.range', locale, '100')}
                  </span>
                  <span className="text-xl text-white/50 sm:text-2xl">km</span>
                </div>
                <p className="mt-4 text-base text-white/60 sm:mt-6 sm:text-lg">{dict.home.statsRange}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1.5 sm:gap-2">
                  <span 
                    className="text-7xl font-light sm:text-8xl md:text-9xl"
                    data-editable="home.ebike.speed"
                    data-editable-type="text"
                    data-editable-label="E-BIKE速度"
                  >
                    {getContent(cmsContent, 'home.ebike.speed', locale, '25')}
                  </span>
                  <span className="text-xl text-white/50 sm:text-2xl">km/h</span>
                </div>
                <p className="mt-4 text-base text-white/60 sm:mt-6 sm:text-lg">{dict.home.statsSpeed}</p>
              </div>
            </div>

            <div className="text-center mt-12 sm:mt-16 md:mt-20">
              <Link 
                href="/ebike"
                className="inline-flex items-center gap-2 text-base text-orange-500 transition-colors hover:text-white sm:gap-3 sm:text-lg"
              >
                <span>{dict.common.learnEbike}</span>
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Routes - 4 Routes */}
        <section className="relative py-20 sm:py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <span 
                className="text-xs tracking-[0.3em] text-orange-500 uppercase sm:tracking-[0.4em]"
                data-editable="home.routes.subtitle"
                data-editable-type="text"
                data-editable-label="路线副标题"
              >
                {getContent(cmsContent, 'home.routes.subtitle', locale, dict.home.routes.subtitle)}
              </span>
              <h2 
                className="mt-4 text-4xl font-bold sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl"
                data-editable="home.routes.title"
                data-editable-type="text"
                data-editable-label="路线标题"
              >
                {getContent(cmsContent, 'home.routes.title', locale, dict.home.routes.title)}
              </h2>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {[
                { 
                  img: getContent(cmsContent, 'routes.card1.image', locale, '/brand_assets/page12_img1.jpeg'),
                  name: getContent(cmsContent, 'routes.card1.name', locale, locale === 'zh' ? '东钱湖环湖' : 'Dongqian Lake Loop'),
                  distance: getContent(cmsContent, 'routes.card1.distance', locale, '35km'),
                  imgKey: 'routes.card1.image',
                  nameKey: 'routes.card1.name',
                  distanceKey: 'routes.card1.distance'
                },
                { 
                  img: getContent(cmsContent, 'routes.card2.image', locale, '/brand_assets/page12_img2.jpeg'),
                  name: getContent(cmsContent, 'routes.card2.name', locale, locale === 'zh' ? '四明山挑战' : 'Siming Mountain Challenge'),
                  distance: getContent(cmsContent, 'routes.card2.distance', locale, '68km'),
                  imgKey: 'routes.card2.image',
                  nameKey: 'routes.card2.name',
                  distanceKey: 'routes.card2.distance'
                },
                { 
                  img: getContent(cmsContent, 'routes.card3.image', locale, '/brand_assets/page12_img3.jpeg'),
                  name: getContent(cmsContent, 'routes.card3.name', locale, locale === 'zh' ? '海岸线骑行' : 'Coastal Ride'),
                  distance: getContent(cmsContent, 'routes.card3.distance', locale, '42km'),
                  imgKey: 'routes.card3.image',
                  nameKey: 'routes.card3.name',
                  distanceKey: 'routes.card3.distance'
                },
                { 
                  img: getContent(cmsContent, 'routes.card4.image', locale, '/brand_assets/page12_img4.jpeg'),
                  name: getContent(cmsContent, 'routes.card4.name', locale, locale === 'zh' ? '古镇探索' : 'Ancient Town Exploration'),
                  distance: getContent(cmsContent, 'routes.card4.distance', locale, '28km'),
                  imgKey: 'routes.card4.image',
                  nameKey: 'routes.card4.name',
                  distanceKey: 'routes.card4.distance'
                },
              ].map((route, index) => (
                <div
                  key={`route-${index}`}
                  className="group relative overflow-hidden rounded-xl aspect-[4/3] sm:rounded-2xl"
                >
                  <Image
                    src={route.img}
                    alt={route.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-editable={route.imgKey}
                    data-editable-type="image"
                    data-editable-label={`路线${index + 1}图片`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8">
                    <h3 
                      className="text-2xl font-bold mb-1.5 sm:text-3xl sm:mb-2"
                      data-editable={route.nameKey}
                      data-editable-type="text"
                      data-editable-label={`路线${index + 1}名称`}
                    >
                      {route.name}
                    </h3>
                    <p 
                      className="text-base text-white/70 sm:text-lg"
                      data-editable={route.distanceKey}
                      data-editable-type="text"
                      data-editable-label={`路线${index + 1}距离`}
                    >
                      {route.distance}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 sm:mt-14 md:mt-16">
              <Link 
                href="/routes"
                className="inline-flex items-center gap-2 text-base text-orange-500 transition-colors hover:text-white sm:gap-3 sm:text-lg"
              >
                <span>{dict.common.exploreRoutes}</span>
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden sm:py-32 md:py-40">
          <div className="absolute inset-0">
            <Image
              src={getContent(cmsContent, 'cta.background.image', locale, '/brand_assets/page11_img3.jpeg')}
              alt={dict.home.cta.title}
              fill
              className="object-cover"
              sizes="100vw"
              data-editable="cta.background.image"
              data-editable-type="image"
              data-editable-label="CTA背景图"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 
              className="text-4xl font-bold text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl"
              data-editable="home.cta.title"
              data-editable-type="text"
              data-editable-label="CTA标题"
            >
              {getContent(cmsContent, 'home.cta.title', locale, dict.home.cta.title)}
            </h2>
            <p 
              className="mt-6 text-lg text-white/90 drop-shadow sm:mt-8 sm:text-xl md:text-2xl"
              data-editable="home.cta.desc"
              data-editable-type="text"
              data-editable-label="CTA描述"
            >
              {getContent(cmsContent, 'home.cta.desc', locale, dict.home.cta.desc)}
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-6">
              <Link
                href="/routes"
                className="rounded-full bg-orange-500 px-8 py-4 text-base font-medium text-black shadow-2xl transition-all hover:scale-105 hover:bg-orange-600 sm:px-10 sm:py-5 sm:text-lg"
              >
                {dict.common.exploreRoutes}
              </Link>
              <Link
                href="/ebike"
                className="rounded-full border-2 border-white bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black sm:px-10 sm:py-5 sm:text-lg"
              >
                {dict.common.learnEbike}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
