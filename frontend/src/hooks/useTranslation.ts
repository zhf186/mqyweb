'use client'

import { useEffect, useState } from 'react'
import { useLocaleStore } from '@/stores/locale'
import { getCachedDictionary, getDictionary, preloadDictionary, Locale } from '@/lib/i18n'

type Dictionary = Awaited<ReturnType<typeof getDictionary>>

/**
 * 翻译钩子 - 用于获取当前语言的翻译文本
 */
export function useTranslation() {
  const { locale, setLocale, toggleLocale } = useLocaleStore()
  const [dictionary, setDictionary] = useState<Dictionary | null>(() => getCachedDictionary(locale))
  const [isLoading, setIsLoading] = useState(() => !getCachedDictionary(locale))

  useEffect(() => {
    let isMounted = true
    const cachedDictionary = getCachedDictionary(locale)

    if (cachedDictionary) {
      setDictionary(cachedDictionary)
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }

    getDictionary(locale)
      .then((dict) => {
        if (!isMounted) return

        setDictionary(dict)
        setIsLoading(false)
        preloadDictionary(locale === 'zh' ? 'en' : 'zh')
      })
      .catch((error) => {
        if (!isMounted) return

        console.error('Failed to load dictionary:', error)
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [locale])

  /**
   * 获取翻译文本
   * @param key 翻译键，支持点号分隔的嵌套键，如 'common.brand'
   * @param fallback 默认值
   */
  const t = (key: string, fallback?: string): string => {
    if (!dictionary) return fallback || key

    const keys = key.split('.')
    let value: unknown = dictionary

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return fallback || key
      }
    }

    return typeof value === 'string' ? value : fallback || key
  }

  return {
    t,
    locale,
    setLocale,
    toggleLocale,
    isLoading,
    dictionary,
  }
}

/**
 * 语言切换组件的 props 类型
 */
export interface LanguageSwitchProps {
  className?: string
  showLabel?: boolean
  showFlag?: boolean
}
