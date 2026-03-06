'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { getPageContent, getContent, type CMSContent } from '@/lib/api/public-content'
import {
  detectEditableElements,
  updateElementContent,
  findElementBySelector,
  injectUpdateAnimationStyles,
} from '@/lib/visual-editor/editable-detector'
import type { IframeBridgeMessage } from '@/lib/visual-editor/types'

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
  const searchParams = useSearchParams()
  const { t, locale } = useTranslation()
  const isEditMode = searchParams.get('editMode') === 'true'
  const productId = parseInt(params.id as string, 10)
  const [cmsContent, setCmsContent] = React.useState<CMSContent>({})
  const contentLocale: 'zh' | 'en' = locale === 'en' ? 'en' : 'zh'

  const product = products.find((p) => p.id === productId)

  const getEditableText = React.useCallback(
    (fieldKey: string, fallback: string) => getContent(cmsContent, fieldKey, contentLocale, fallback),
    [cmsContent, contentLocale]
  )

  React.useEffect(() => {
    getPageContent('goods').then((content) => {
      setCmsContent(content)
    })
  }, [])

  React.useEffect(() => {
    if (!isEditMode) return

    injectUpdateAnimationStyles()

    const handleMessage = (event: MessageEvent<IframeBridgeMessage>) => {
      if (event.origin !== window.location.origin) return

      const message = event.data
      switch (message.type) {
        case 'REQUEST_EDITABLE_ELEMENTS': {
          const elements = detectEditableElements(document)
          window.parent.postMessage({ type: 'EDITABLE_ELEMENTS_RESPONSE', payload: elements }, window.location.origin)
          break
        }
        case 'UPDATE_CONTENT': {
          const { fieldKey, content } = message.payload
          const element = findElementBySelector(`[data-editable="${fieldKey}"]`, document)
          if (element) {
            const type = element.getAttribute('data-editable-type') as 'text' | 'image'
            updateElementContent(element, content, type)
          }
          break
        }
        case 'UPDATE_IMAGE': {
          const { fieldKey, imagePath } = message.payload
          const imageElement = findElementBySelector(`[data-editable="${fieldKey}"]`, document)
          if (imageElement) {
            updateElementContent(imageElement, imagePath, 'image')
          }
          break
        }
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

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-black pb-20 pt-32 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
            <h1
              className="mb-4 text-4xl font-bold"
              data-editable="goodsDetail.notFound.title"
              data-editable-type="text"
              data-editable-label="Goods Detail Not Found Title"
            >
              {getEditableText('goodsDetail.notFound.title', 'Product Not Found')}
            </h1>
            <p
              className="mb-8 text-white/60"
              data-editable="goodsDetail.notFound.desc"
              data-editable-type="text"
              data-editable-label="Goods Detail Not Found Description"
            >
              {getEditableText('goodsDetail.notFound.desc', "The product you're looking for doesn't exist.")}
            </p>
            <Button
              onClick={() => router.push('/goods')}
              data-editable="goodsDetail.notFound.back"
              data-editable-type="text"
              data-editable-label="Goods Detail Not Found Back"
            >
              {getEditableText('goodsDetail.notFound.back', 'Back to Goods')}
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
      <main className="bg-black pb-20 pt-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-8 lg:grid-cols-2 lg:gap-12"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900">
              <Image
                src={getEditableText(`goodsDetail.product.${product.id}.image`, product.image)}
                alt={locale === 'en' ? product.nameEn : t(product.nameKey)}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                data-editable={`goodsDetail.product.${product.id}.image`}
                data-editable-type="image"
                data-editable-label="Goods Detail Product Image"
              />
            </div>

            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span
                  className="text-sm tracking-[0.3em] text-brand-accent uppercase"
                  data-editable={`goodsDetail.product.${product.id}.category`}
                  data-editable-type="text"
                  data-editable-label="Goods Detail Product Category"
                >
                  {getEditableText(`goodsDetail.product.${product.id}.category`, t(`goodsPage.categories.${product.category}`))}
                </span>
                <h1
                  className="mt-4 font-zh-display text-4xl font-bold md:text-5xl"
                  data-editable={`goodsDetail.product.${product.id}.name`}
                  data-editable-type="text"
                  data-editable-label="Goods Detail Product Name"
                >
                  {getEditableText(`goodsDetail.product.${product.id}.name`, locale === 'en' ? product.nameEn : t(product.nameKey))}
                </h1>
                <p
                  className="mt-6 text-2xl font-bold text-brand-accent"
                  data-editable={`goodsDetail.product.${product.id}.price`}
                  data-editable-type="text"
                  data-editable-label="Goods Detail Product Price"
                >
                  {getEditableText(`goodsDetail.product.${product.id}.price`, `CNY ${product.price}`)}
                </p>
                <p
                  className="mt-6 text-lg leading-relaxed text-white/70"
                  data-editable={`goodsDetail.product.${product.id}.description`}
                  data-editable-type="text"
                  data-editable-label="Goods Detail Product Description"
                >
                  {getEditableText(`goodsDetail.product.${product.id}.description`, product.description)}
                </p>

                <div className="mt-8 flex gap-4">
                  <Button
                    size="lg"
                    className="bg-brand-accent font-medium text-black hover:bg-brand-accent/90"
                    data-editable="goodsDetail.actions.addToCart"
                    data-editable-type="text"
                    data-editable-label="Goods Detail Add To Cart"
                  >
                    {getEditableText('goodsDetail.actions.addToCart', t('common.addToCart') || 'Add to Cart')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push('/goods')}
                    className="border-white/20 text-white hover:bg-white/10"
                    data-editable="goodsDetail.actions.back"
                    data-editable-type="text"
                    data-editable-label="Goods Detail Back"
                  >
                    {getEditableText('goodsDetail.actions.back', t('common.back') || 'Back')}
                  </Button>
                </div>

                <div className="mt-12 space-y-4 border-t border-white/10 pt-8">
                  <h3
                    className="text-lg font-semibold"
                    data-editable="goodsDetail.features.title"
                    data-editable-type="text"
                    data-editable-label="Goods Detail Features Title"
                  >
                    {getEditableText('goodsDetail.features.title', t('goodsPage.features') || 'Features')}
                  </h3>
                  <ul className="space-y-3">
                    <li
                      className="flex items-center gap-3 text-white/70"
                      data-editable="goodsDetail.features.item1"
                      data-editable-type="text"
                      data-editable-label="Goods Detail Feature 1"
                    >
                      <span className="text-brand-accent">+</span>
                      {getEditableText('goodsDetail.features.item1', t('goodsPage.feature1') || 'Premium Quality')}
                    </li>
                    <li
                      className="flex items-center gap-3 text-white/70"
                      data-editable="goodsDetail.features.item2"
                      data-editable-type="text"
                      data-editable-label="Goods Detail Feature 2"
                    >
                      <span className="text-brand-accent">+</span>
                      {getEditableText('goodsDetail.features.item2', t('goodsPage.feature2') || 'Fast Delivery')}
                    </li>
                    <li
                      className="flex items-center gap-3 text-white/70"
                      data-editable="goodsDetail.features.item3"
                      data-editable-type="text"
                      data-editable-label="Goods Detail Feature 3"
                    >
                      <span className="text-brand-accent">+</span>
                      {getEditableText('goodsDetail.features.item3', t('goodsPage.feature3') || 'Satisfaction Guaranteed')}
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <section className="mt-20 border-t border-white/10 pt-20">
            <h2
              className="mb-8 text-3xl font-bold"
              data-editable="goodsDetail.related.title"
              data-editable-type="text"
              data-editable-label="Goods Detail Related Title"
            >
              {getEditableText('goodsDetail.related.title', t('goodsPage.relatedProducts') || 'Related Products')}
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {products
                .filter((p) => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    onClick={() => router.push(`/goods/${relatedProduct.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-900">
                      <Image
                        src={getEditableText(`goodsDetail.related.${relatedProduct.id}.image`, relatedProduct.image)}
                        alt={locale === 'en' ? relatedProduct.nameEn : t(relatedProduct.nameKey)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        data-editable={`goodsDetail.related.${relatedProduct.id}.image`}
                        data-editable-type="image"
                        data-editable-label={`Goods Detail Related ${relatedProduct.id} Image`}
                      />
                    </div>
                    <div className="mt-3">
                      <h3
                        className="text-sm font-medium text-white transition-colors group-hover:text-brand-accent"
                        data-editable={`goodsDetail.related.${relatedProduct.id}.name`}
                        data-editable-type="text"
                        data-editable-label={`Goods Detail Related ${relatedProduct.id} Name`}
                      >
                        {getEditableText(
                          `goodsDetail.related.${relatedProduct.id}.name`,
                          locale === 'en' ? relatedProduct.nameEn : t(relatedProduct.nameKey)
                        )}
                      </h3>
                      <p
                        className="mt-1 text-base font-bold text-brand-accent"
                        data-editable={`goodsDetail.related.${relatedProduct.id}.price`}
                        data-editable-type="text"
                        data-editable-label={`Goods Detail Related ${relatedProduct.id} Price`}
                      >
                        {getEditableText(`goodsDetail.related.${relatedProduct.id}.price`, `CNY ${relatedProduct.price}`)}
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
