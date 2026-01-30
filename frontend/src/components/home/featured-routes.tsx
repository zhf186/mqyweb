'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { Button, Container, Section, Badge, ImageCard } from '@/components/ui'
import { ScrollReveal, HoverLift } from '@/components/animation'

// Sample featured routes data
const featuredRoutes = [
  {
    id: 1,
    image: '/brand_assets/page6_img1.jpeg',
    title: '奉化三湖双海',
    titleEn: 'Fenghua Three Lakes & Two Seas',
    days: 2,
    nights: 1,
    distanceKm: 80,
    badge: 'hot',
    difficulty: 'medium',
    price: 1280,
  },
  {
    id: 2,
    image: '/brand_assets/page19_img4.jpeg',
    title: '三江古韵骑行',
    titleEn: 'Three Rivers Heritage Ride',
    days: 1,
    nights: 0,
    distanceKm: 45,
    badge: 'new',
    difficulty: 'easy',
    price: 680,
  },
  {
    id: 3,
    image: '/brand_assets/page12_img3.jpeg',
    title: '东钱湖环湖',
    titleEn: 'Dongqian Lake Loop',
    days: 1,
    nights: 0,
    distanceKm: 35,
    badge: null,
    difficulty: 'easy',
    price: 580,
  },
  {
    id: 4,
    image: '/brand_assets/page19_img3.jpeg',
    title: '横溪古镇探秘',
    titleEn: 'Hengxi Ancient Town Discovery',
    days: 2,
    nights: 1,
    distanceKm: 65,
    badge: 'limited',
    difficulty: 'medium',
    price: 980,
  },
] as const

function formatDuration(locale: string, t: (key: string, fallback?: string) => string, days: number, nights: number) {
  const dayUnit = t(days === 1 ? 'routes.units.day_one' : 'routes.units.day_other')
  const nightUnit = t(nights === 1 ? 'routes.units.night_one' : 'routes.units.night_other')

  if (locale === 'en') {
    return nights > 0 ? `${days} ${dayUnit} ${nights} ${nightUnit}` : `${days} ${dayUnit}`
  }

  return nights > 0 ? `${days}${dayUnit}${nights}${nightUnit}` : `${days}${dayUnit}`
}

function formatSubtitle(locale: string, t: (key: string, fallback?: string) => string, days: number, nights: number, distanceKm: number) {
  const duration = formatDuration(locale, t, days, nights)
  const kmUnit = t('routes.units.km')
  const distance = locale === 'en' ? `${distanceKm} ${kmUnit}` : `${distanceKm}${kmUnit}`
  return `${duration} · ${distance}`
}

export function FeaturedRoutes() {
  const { t, locale } = useTranslation()

  return (
    <Section variant="default" spacing="xl" className="bg-gray-50">
      <Container>
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <ScrollReveal direction="left">
            <div>
              <Badge variant="brand-soft" className="mb-3">
                {t('routes.featured')}
              </Badge>
              <h2 className="font-zh-display text-3xl font-bold text-foreground md:text-4xl">
                {t('routes.title')}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {t('routes.subtitle')}
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="right">
            <Button variant="brand-outline" asChild>
              <Link href="/routes">{t('common.viewAll')}</Link>
            </Button>
          </ScrollReveal>
        </div>

        {/* Routes Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredRoutes.map((route, index) => (
            <ScrollReveal
              key={route.id}
              direction="up"
              delay={index * 0.1}
            >
              <HoverLift>
                <Link href={`/routes/${route.id}`} className="block">
                  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-brand-sm">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={route.image}
                        alt={locale === 'en' ? route.titleEn : route.title}
                        fill
                        loading="lazy"
                        quality={75}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Badge */}
                      {route.badge && (
                        <Badge
                          variant="gold"
                          className="absolute left-3 top-3"
                        >
                          {t(`routes.badges.${route.badge}`)}
                        </Badge>
                      )}

                      {/* Difficulty Badge */}
                      <Badge
                        variant={
                          route.difficulty === 'easy'
                            ? 'success'
                            : route.difficulty === 'medium'
                            ? 'warning'
                            : 'destructive'
                        }
                        className="absolute right-3 top-3"
                      >
                        {t(`routes.difficulty.${route.difficulty}`)}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-zh-heading text-lg font-semibold text-foreground">
                        {locale === 'en' ? route.titleEn : route.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatSubtitle(locale, t, route.days, route.nights, route.distanceKm)}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-en-display text-xl font-bold text-brand-primary">
                          ¥{route.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t('routes.perPerson')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </HoverLift>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
