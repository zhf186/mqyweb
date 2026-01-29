'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { Container, Section } from '@/components/ui'
import { ScrollReveal, StaggerReveal, HoverLift } from '@/components/animation'

// Section data with icons
const sections = [
  {
    key: 'rental',
    icon: '🚲',
    image: '/brand_assets/page8_img4.jpeg',
    color: 'from-brand-primary to-brand-primary-700',
  },
  {
    key: 'routes',
    icon: '🗺️',
    image: '/brand_assets/page12_img1.jpeg',
    color: 'from-brand-secondary to-blue-700',
  },
  {
    key: 'community',
    icon: '👥',
    image: '/brand_assets/page5_img3.jpeg',
    color: 'from-brand-accent to-yellow-600',
  },
  {
    key: 'goods',
    icon: '🎁',
    image: '/brand_assets/page13_img2.jpeg',
    color: 'from-brand-earth to-orange-700',
  },
  {
    key: 'alliance',
    icon: '🤝',
    image: '/brand_assets/page19_img5.jpeg',
    color: 'from-brand-energy to-red-700',
  },
] as const

export function SectionsShowcase() {
  const { t } = useTranslation()

  return (
    <Section variant="default" spacing="xl">
      <Container>
        {/* Section Header */}
        <ScrollReveal direction="up" className="mb-12 text-center">
          <h2 className="font-zh-display text-3xl font-bold text-foreground md:text-4xl">
            {t('home.featuresTitle')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('home.featuresDesc')}
          </p>
        </ScrollReveal>

        {/* Section Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {sections.map((section, index) => (
            <ScrollReveal
              key={section.key}
              direction="up"
              delay={index * 0.1}
            >
              <HoverLift>
                <div className="group relative overflow-hidden rounded-2xl bg-white shadow-brand-sm">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={section.image}
                      alt={t(`sections.${section.key}`)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 bg-gradient-to-t opacity-60 transition-opacity duration-300 group-hover:opacity-80',
                        section.color
                      )}
                    />
                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                        {section.icon}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 text-center">
                    <h3 className="font-zh-heading text-lg font-semibold text-foreground">
                      {t(`sections.${section.key}`)}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(`sections.${section.key}Desc`)}
                    </p>
                  </div>
                </div>
              </HoverLift>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
