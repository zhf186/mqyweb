import { Locale, defaultLocale, locales } from './config'

// 字典类型
type Dictionary = typeof import('./dictionaries/zh.json')

// 字典缓存
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  zh: () => import('./dictionaries/zh.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
}

/**
 * 获取指定语言的字典
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]?.() ?? dictionaries[defaultLocale]()
}

/**
 * 验证语言是否有效
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

/**
 * 获取有效的语言，如果无效则返回默认语言
 */
export function getValidLocale(locale: string | undefined): Locale {
  if (locale && isValidLocale(locale)) {
    return locale
  }
  return defaultLocale
}

export { defaultLocale, locales, type Locale } from './config'
