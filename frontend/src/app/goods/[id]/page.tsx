'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'

// Mock product data (same as in goods/page.tsx)
const products = [
  { id: 1, nameKey: 'goodsPage.products.1', nameEn: 'Ningbo Rice Cake Gift Box', category: 'local', image: '/brand_assets/page10_img1.jpeg', price: 128, description: 'Traditional Ningbo rice cakes, handcrafted with premium ingredients.' },
  { id: 2, nameKey: 'goodsPage.products.2', nameEn: 'Fenghua Honey Peach', category: 'local', image: '/brand_assets/page10_img2.jpeg', price: 88, description: 'Sweet and juicy peaches from Fenghua orchards.' },
  { id: 3, nameKey: 'goodsPage.products.3', nameEn: 'Pro Cycling Helmet', category: 'gear', image: '/brand_assets/page10_img3.jpeg', price: 299, description: 'Professional-grade cycling helmet with advanced safety features.' },
  { id: 4, nameKey: 'goodsPage.products.4', nameEn: 'Breathable Cycling Jersey', category: 'apparel', image: '/brand_assets/page10_img4.jpeg', price: 198, description: 'Moisture-wicking cycling jersey for maximum comfort.' },
  { id: 5, nameKey: 'goodsPage.products.5', nameEn: 'Portable Repair Tool Kit', category: 'gear', image: '/brand_assets/page10_img5.jpeg', price: 68, description: 'Complete tool kit for on-the-go bike repairs.' },
  { id: 6, nameKey: 'goodsPage.products.6', nameEn: 'Cixi Bayberry Wine', category: 'local', image: '/brand_assets/page10_img6.jpeg', price: 158, description: 'Premium bayberry wine from Cixi region.' },
  { id: 7, nameKey: 'goodsPage.products.7', nameEn: 'Cycling Gloves', category: 'gear', image: '/brand_assets/page10_img7.jpeg', price: 58, description: 'Padded cycling gloves for enhanced grip and comfort.' },
  { id: 8, nameKey: 'goodsPage.products.8', nameEn: 'Sports Water Bottle', category: 'gear', image: '/brand_assets/page10_img8.jpeg', price: 45, description: 'Insulated water bottle keeps drinks cold for hours.' },
]

export default function GoodsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t, locale } = useTranslation()
  const productId = parseInt(params.id as string)
  
  const product = products.find(p => p.id === productId)

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <p className="text-white/60 mb-8">The product you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/goods')}>
              Back to Goods
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-black text-white pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-8 lg:grid-cols-2 lg:gap-12"
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900">
              <Image
                src={product.image}
                alt={locale === 'en' ? product.nameEn : t(product.nameKey)}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="text-sm tracking-[0.3em] text-brand-accent uppercase">
                  {t(`goodsPage.categories.${product.category}`)}
                </span>
                <h1 className="mt-4 font-zh-display text-4xl font-bold md:text-5xl">
                  {locale === 'en' ? product.nameEn : t(product.nameKey)}
                </h1>
                <p className="mt-6 text-2xl font-bold text-brand-accent">
                  ¥{product.price}
                </p>
                <p className="mt-6 text-lg leading-relaxed text-white/70">
                  {product.description}
                </p>

                <div className="mt-8 flex gap-4">
                  <Button 
                    size="lg"
                    className="bg-brand-accent hover:bg-brand-accent/90 text-black font-medium"
                  >
                    {t('common.addToCart') || 'Add to Cart'}
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => router.push('/goods')}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {t('common.back') || 'Back'}
                  </Button>
                </div>

                {/* Product Features */}
                <div className="mt-12 space-y-4 border-t border-white/10 pt-8">
                  <h3 className="text-lg font-semibold">{t('goodsPage.features') || 'Features'}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-white/70">
                      <span className="text-brand-accent">✓</span>
                      {t('goodsPage.feature1') || 'Premium Quality'}
                    </li>
                    <li className="flex items-center gap-3 text-white/70">
                      <span className="text-brand-accent">✓</span>
                      {t('goodsPage.feature2') || 'Fast Delivery'}
                    </li>
                    <li className="flex items-center gap-3 text-white/70">
                      <span className="text-brand-accent">✓</span>
                      {t('goodsPage.feature3') || 'Satisfaction Guaranteed'}
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Related Products */}
          <section className="mt-20 border-t border-white/10 pt-20">
            <h2 className="mb-8 text-3xl font-bold">
              {t('goodsPage.relatedProducts') || 'Related Products'}
            </h2>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {products
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    onClick={() => router.push(`/goods/${relatedProduct.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-900">
                      <Image
                        src={relatedProduct.image}
                        alt={locale === 'en' ? relatedProduct.nameEn : t(relatedProduct.nameKey)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-white group-hover:text-brand-accent transition-colors">
                        {locale === 'en' ? relatedProduct.nameEn : t(relatedProduct.nameKey)}
                      </h3>
                      <p className="mt-1 text-base font-bold text-brand-accent">
                        ¥{relatedProduct.price}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
