'use client'

import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'

// Scenic areas data
const scenicAreas = [
  { id: 1, name: '四明山国家森林公园', nameEn: 'Siming Mountain National Forest Park', image: '/brand_assets/cities/page19_img1.jpeg' },
  { id: 2, name: '东钱湖旅游度假区', nameEn: 'Dongqian Lake Tourist Resort', image: '/brand_assets/cities/page19_img2.jpeg' },
  { id: 3, name: '溪口雪窦山风景区', nameEn: 'Xikou Xuedou Mountain Scenic Area', image: '/brand_assets/cities/page19_img3.jpeg' },
  { id: 4, name: '天一阁·月湖景区', nameEn: 'Tianyi Pavilion & Moon Lake', image: '/brand_assets/cities/page19_img4.jpeg' },
  { id: 5, name: '前童古镇', nameEn: 'Qiantong Ancient Town', image: '/brand_assets/cities/page19_img5.jpeg' },
  { id: 6, name: '松兰山海滨度假区', nameEn: 'Songlan Mountain Beach Resort', image: '/brand_assets/cities/page19_img6.jpeg' },
  { id: 7, name: '河姆渡遗址', nameEn: 'Hemudu Site', image: '/brand_assets/cities/page19_img7.jpeg' },
  { id: 8, name: '梁祝文化公园', nameEn: 'Liang Zhu Cultural Park', image: '/brand_assets/cities/page19_img8.jpeg' },
  { id: 9, name: '天下玉苑', nameEn: 'Tianxia Jade Garden', image: '/brand_assets/cities/page19_img9.jpeg' },
  { id: 10, name: '鸣鹤古镇', nameEn: 'Minghe Ancient Town', image: '/brand_assets/cities/page19_img10.jpeg' },
  { id: 11, name: '浙东大峡谷', nameEn: 'East Zhejiang Grand Canyon', image: '/brand_assets/cities/page19_img11.jpeg' },
]

export default function PartnersPage() {
  const { t, locale, isLoading } = useTranslation()

  if (isLoading) {
    return (
      <>
        <Header transparent />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl">{locale === 'en' ? 'Loading...' : '加载中...'}</div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header transparent />
      <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <Image
          src="/brand_assets/page12_img6.jpeg"
          alt={t('partnersPage.heroImageAlt')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="inline-block px-4 py-2 mb-6 text-sm font-medium tracking-widest border border-white/30 rounded-full backdrop-blur-sm">
            {t('partnersPage.heroBadge')}
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            {t('partnersPage.heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            {t('partnersPage.heroDesc')}
          </p>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-black via-zinc-900 to-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-light mb-6 text-orange-500">{t('partnersPage.advantages.traffic.number')}</div>
              <h3 className="text-xl font-semibold mb-3">{t('partnersPage.advantages.traffic.title')}</h3>
              <p className="text-white/60">{t('partnersPage.advantages.traffic.desc')}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-light mb-6 text-orange-500">{t('partnersPage.advantages.marketing.number')}</div>
              <h3 className="text-xl font-semibold mb-3">{t('partnersPage.advantages.marketing.title')}</h3>
              <p className="text-white/60">{t('partnersPage.advantages.marketing.desc')}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-light mb-6 text-orange-500">{t('partnersPage.advantages.brand.number')}</div>
              <h3 className="text-xl font-semibold mb-3">{t('partnersPage.advantages.brand.title')}</h3>
              <p className="text-white/60">{t('partnersPage.advantages.brand.desc')}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-light mb-6 text-orange-500">{t('partnersPage.advantages.resource.number')}</div>
              <h3 className="text-xl font-semibold mb-3">{t('partnersPage.advantages.resource.title')}</h3>
              <p className="text-white/60">{t('partnersPage.advantages.resource.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Major Partners Section - Yadea & Gazelle */}
      <section className="py-24 md:py-32 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 mb-4 text-sm font-medium tracking-widest text-orange-500 border border-orange-500/30 rounded-full">
              {t('partnersPage.heroBadge')}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">{t('partners.hero.subtitle')}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Yadea Card */}
            <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 group">
              <div className="relative h-80 bg-gradient-to-br from-red-900/20 via-zinc-900 to-zinc-900 flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="text-8xl font-bold text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    雅迪
                  </div>
                  <div className="text-sm text-white/40 tracking-widest">YADEA</div>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-3xl font-bold mb-3">{t('partners.yadea.title')}</h3>
                <p className="text-lg text-white/70 mb-6 font-medium">{t('partners.yadea.subtitle')}</p>
                <p className="text-white/60 leading-relaxed">{t('partners.yadea.desc')}</p>
              </div>
            </div>

            {/* Gazelle Card */}
            <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 group">
              <div className="relative h-80 bg-gradient-to-br from-blue-900/20 via-zinc-900 to-zinc-900 flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="text-7xl font-bold text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: 'serif' }}>
                    Gazelle
                  </div>
                  <div className="text-sm text-white/40 tracking-widest">ROYAL DUTCH</div>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-3xl font-bold mb-3">{t('partners.gazelle.title')}</h3>
                <p className="text-lg text-white/70 mb-6 font-medium">{t('partners.gazelle.subtitle')}</p>
                <p className="text-white/60 leading-relaxed">{t('partners.gazelle.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scenic Areas Section */}
      <section className="py-24 md:py-32 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 mb-4 text-sm font-medium tracking-widest text-orange-500 border border-orange-500/30 rounded-full">
              {t('partnersPage.types.badge')}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{t('partners.scenic.title')}</h2>
            <p className="text-xl text-white/70">{t('partners.scenic.desc')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {scenicAreas.map((area) => (
              <div key={area.id} className="group cursor-pointer">
                <div className="aspect-square bg-zinc-900 rounded-xl overflow-hidden relative border border-white/10 hover:border-orange-500/50 transition-all duration-300">
                  <Image
                    src={area.image}
                    alt={locale === 'en' ? area.nameEn : area.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-sm md:text-base">{locale === 'en' ? area.nameEn : area.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cooperation Types Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-black via-zinc-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 mb-4 text-sm font-medium tracking-widest text-orange-500 border border-orange-500/30 rounded-full">
              {t('partnersPage.types.badge')}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">{t('partnersPage.types.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Scenic Area Cooperation */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 group">
              <div className="absolute inset-0">
                <Image
                  src="/brand_assets/cities/page19_img1.jpeg"
                  alt={t('partnersPage.types.scenic.title')}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
              </div>
              <div className="relative z-10 p-8">
                <h3 className="text-2xl font-bold mb-3">{t('partnersPage.types.scenic.title')}</h3>
                <p className="text-white/80 mb-6">{t('partnersPage.types.scenic.desc')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span className="text-white/80">{t('partnersPage.types.scenic.benefits.1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span className="text-white/80">{t('partnersPage.types.scenic.benefits.2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span className="text-white/80">{t('partnersPage.types.scenic.benefits.3')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Hotel Cooperation */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 group">
              <div className="absolute inset-0">
                <Image
                  src="/brand_assets/page10_img3.jpeg"
                  alt={t('partnersPage.types.hotel.title')}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
              </div>
              <div className="relative z-10 p-8">
                <h3 className="text-2xl font-bold mb-3">{t('partnersPage.types.hotel.title')}</h3>
                <p className="text-white/80 mb-6">{t('partnersPage.types.hotel.desc')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span className="text-white/80">{t('partnersPage.types.hotel.benefits.1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span className="text-white/80">{t('partnersPage.types.hotel.benefits.2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span className="text-white/80">{t('partnersPage.types.hotel.benefits.3')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Brand Sponsorship */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 group">
              <div className="absolute inset-0">
                <Image
                  src="/brand_assets/page12_img3.jpeg"
                  alt={t('partnersPage.types.sponsor.title')}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
              </div>
              <div className="relative z-10 p-8">
                <h3 className="text-2xl font-bold mb-3">{t('partnersPage.types.sponsor.title')}</h3>
                <p className="text-white/80 mb-6">{t('partnersPage.types.sponsor.desc')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span className="text-white/80">{t('partnersPage.types.sponsor.benefits.1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span className="text-white/80">{t('partnersPage.types.sponsor.benefits.2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span className="text-white/80">{t('partnersPage.types.sponsor.benefits.3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/brand_assets/page11_img3.jpeg"
            alt={t('partnersPage.cta.title')}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
            {t('partnersPage.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow">
            {t('partnersPage.cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="rounded-full bg-orange-500 px-8 py-4 text-base font-medium text-black hover:bg-orange-600 transition-all hover:scale-105 shadow-lg">
              {t('partnersPage.cta.consult')}
            </button>
            <button className="rounded-full border-2 border-white bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur-sm hover:bg-white hover:text-black transition-all">
              {t('partnersPage.cta.download')}
            </button>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  )
}
