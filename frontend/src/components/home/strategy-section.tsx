'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { Container, Section } from '@/components/ui'
import { ScrollReveal, CountUp } from '@/components/animation'

// Strategy data
const strategies = [
  {
    key: 'product',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    number: 50,
  },
  {
    key: 'platform',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    number: 6,
  },
  {
    key: 'income',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    number: 8,
  },
] as const

export function StrategySection() {
  const { t } = useTranslation()

  return (
    <Section variant="brand" spacing="xl">
      <Container>
        {/* Section Header */}
        <ScrollReveal direction="up" className="mb-16 text-center">
          <h2 className="font-zh-display text-3xl font-bold text-white md:text-4xl">
            {t('strategy.title')}
          </h2>
        </ScrollReveal>

        {/* Strategy Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {strategies.map((strategy, index) => (
            <ScrollReveal
              key={strategy.key}
              direction="up"
              delay={index * 0.15}
            >
              <div className="group relative overflow-hidden rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                {/* Decorative corner */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-accent/10" />
                
                {/* Icon */}
                <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-brand-accent text-brand-primary">
                  {strategy.icon}
                </div>

                {/* Title */}
                <h3 className="mb-2 font-zh-heading text-2xl font-bold text-white">
                  {t(`strategy.${strategy.key}.title`)}
                </h3>
                
                {/* Subtitle */}
                <p className="mb-4 font-en-body text-sm tracking-wider text-brand-accent">
                  {t(`strategy.${strategy.key}.subtitle`)}
                </p>

                {/* Description */}
                <p className="mb-6 text-white/70">
                  {t(`strategy.${strategy.key}.desc`)}
                </p>

                {/* Stats */}
                <div className="flex items-baseline gap-1">
                  <span className="font-en-display text-4xl font-bold text-brand-accent">
                    <CountUp end={strategy.number} duration={2} delay={0.5 + index * 0.2} />
                  </span>
                  <span className="text-xl text-brand-accent">{t(`strategy.stats.${strategy.key}.suffix`)}</span>
                  <span className="ml-2 text-white/60">{t(`strategy.stats.${strategy.key}.label`)}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
