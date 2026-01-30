'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { Button, Container } from '@/components/ui'
import { ScrollReveal } from '@/components/animation'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/brand_assets/page1_img2.jpeg"
          alt="漫骑游骑行风景"
          fill
          priority
          quality={85}
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Animated Particles Background */}
      <ParticleBackground />

      {/* Content */}
      <Container className="relative z-10 flex min-h-screen flex-col items-center justify-center py-20 text-center text-white">
        {/* Brand Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <span className="font-zh-display text-4xl font-bold text-brand-accent">
              漫
            </span>
          </div>
        </motion.div>

        {/* Main Title */}
        <ScrollReveal direction="up" delay={0.2}>
          <h1 className="font-zh-display text-5xl font-bold tracking-wider md:text-6xl lg:text-7xl">
            {t('hero.title')}
          </h1>
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal direction="up" delay={0.4}>
          <p className="mt-4 font-en-display text-xl tracking-widest text-brand-accent md:text-2xl">
            {t('hero.subtitle')}
          </p>
        </ScrollReveal>

        {/* Description */}
        <ScrollReveal direction="up" delay={0.6}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            {t('hero.description')}
          </p>
        </ScrollReveal>

        {/* CTA Button */}
        <ScrollReveal direction="up" delay={0.8}>
          <Button
            variant="gold"
            size="lg"
            className="mt-10 px-10 py-6 text-lg"
          >
            {t('hero.cta')}
          </Button>
        </ScrollReveal>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-xs tracking-wider">{t('hero.scrollDown')}</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}

// Particle background effect
function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Hexagon pattern overlay */}
      <div className="absolute inset-0 bg-pattern-hexagon opacity-10" />
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-brand-accent/30"
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
          }}
          animate={{
            y: [null, '-100%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}
