'use client'

import { useEffect, useState } from 'react'
import { useLocaleStore } from '@/stores/locale'
import { getDictionary, Locale } from '@/lib/i18n'

type Dictionary = Awaited<ReturnType<typeof getDictionary>>

/**
 * 翻译钩子 - 用于获取当前语言的翻译文本
 */
export function useTranslation() {
  const { locale, setLocale, toggleLocale } = useLocaleStore()
  const [dictionary, setDictionary] = useState<Dictionary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getDictionary(locale)
      .then((dict) => {
        setDictionary(dict)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load dictionary:', error)
        setIsLoading(false)
      })
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
