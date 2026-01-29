'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'

const categories = [
  { id: 'all' },
  { id: 'local' },
  { id: 'gear' },
  { id: 'apparel' },
] as const

const products = [
  { id: 1, nameKey: 'goodsPage.products.1', nameEn: 'Ningbo Rice Cake Gift Box', category: 'local', image: '/brand_assets/page10_img1.jpeg', price: 128 },
  { id: 2, nameKey: 'goodsPage.products.2', nameEn: 'Fenghua Honey Peach', category: 'local', image: '/brand_assets/page10_img2.jpeg', price: 88 },
  { id: 3, nameKey: 'goodsPage.products.3', nameEn: 'Pro Cycling Helmet', category: 'gear', image: '/brand_assets/page10_img3.jpeg', price: 299 },
  { id: 4, nameKey: 'goodsPage.products.4', nameEn: 'Breathable Cycling Jersey', category: 'apparel', image: '/brand_assets/page10_img4.jpeg', price: 198 },
  { id: 5, nameKey: 'goodsPage.products.5', nameEn: 'Portable Repair Tool Kit', category: 'gear', image: '/brand_assets/page10_img5.jpeg', price: 68 },
  { id: 6, nameKey: 'goodsPage.products.6', nameEn: 'Cixi Bayberry Wine', category: 'local', image: '/brand_assets/page10_img6.jpeg', price: 158 },
  { id: 7, nameKey: 'goodsPage.products.7', nameEn: 'Cycling Gloves', category: 'gear', image: '/brand_assets/page10_img7.jpeg', price: 58 },
  { id: 8, nameKey: 'goodsPage.products.8', nameEn: 'Sports Water Bottle', category: 'gear', image: '/brand_assets/page10_img8.jpeg', price: 45 },
]

export default function GoodsPage() {
  const { t, locale } = useTranslation()
  const [activeCategory, setActiveCategory] = React.useState('all')

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <>
      <Header transparent />
      <main className="bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[450px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/brand_assets/page10_img1.jpeg"
              alt={t('goodsPage.heroImageAlt')}
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
              <span className="text-sm tracking-[0.3em] text-brand-accent">{t('goodsPage.heroBadge')}</span>
              <h1 className="mt-4 font-zh-display text-5xl font-bold md:text-7xl">
                {t('goodsPage.heroTitle')}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
                {t('goodsPage.heroDesc')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="sticky top-16 z-30 border-b border-white/10 bg-black/90 py-3 backdrop-blur-md sm:py-4 lg:top-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 py-1.5 text-xs transition-all sm:px-6 sm:py-2 sm:text-sm ${
                    activeCategory === cat.id
                      ? 'bg-white text-black'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t(`goodsPage.categories.${cat.id}`)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-5 grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/goods/${product.id}`} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-900 sm:rounded-2xl">
                      <Image
                        src={product.image}
                        alt={locale === 'en' ? product.nameEn : t(product.nameKey)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <h3 className="text-sm font-medium text-white group-hover:text-brand-accent transition-colors sm:text-base">
                        {locale === 'en' ? product.nameEn : t(product.nameKey)}
                      </h3>
                      <p className="mt-1 text-base font-bold text-brand-accent sm:text-lg">
                        ¥{product.price}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="border-t border-white/10 py-20 sm:py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-xs tracking-[0.3em] text-brand-accent">{t('goodsPage.feature.badge')}</span>
                <h2 className="mt-3 font-zh-display text-3xl font-bold sm:mt-4 sm:text-4xl md:text-5xl">
                  {t('goodsPage.feature.title')}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-white/60 sm:mt-6 sm:text-lg">
                  {t('goodsPage.feature.desc')}
                </p>
                <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                  {([1, 2, 3] as const).map((n) => (
                    <li key={n} className="flex items-center gap-2.5 text-sm text-white/70 sm:gap-3 sm:text-base">
                      <span className="text-brand-accent">✓</span>
                      {t(`goodsPage.feature.bullets.${n}`)}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 gap-3 sm:gap-4"
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
                    <Image
                      src={`/brand_assets/page10_img${i}.jpeg`}
                      alt={`${t('goodsPage.feature.imageAlt')} ${i}`}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
