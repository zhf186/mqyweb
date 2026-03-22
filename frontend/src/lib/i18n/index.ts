import zhDictionary from './dictionaries/zh.json'
import { Locale, defaultLocale, locales } from './config'

type Dictionary = typeof import('./dictionaries/zh.json')

const DICTIONARY_STORAGE_PREFIX = 'mrc:i18n:'

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  zh: () =>
    import('./dictionaries/zh.json').then(
      (module) => module.default as unknown as Dictionary
    ),
  en: () =>
    import('./dictionaries/en.json').then(
      (module) => module.default as unknown as Dictionary
    ),
}

const dictionaryCache = new Map<Locale, Dictionary>([
  ['zh', zhDictionary as unknown as Dictionary],
])
const dictionaryRequestCache = new Map<Locale, Promise<Dictionary>>()

function readCachedDictionary(locale: Locale): Dictionary | null {
  const cachedDictionary = dictionaryCache.get(locale)
  if (cachedDictionary) {
    return cachedDictionary
  }

  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawValue = window.sessionStorage.getItem(`${DICTIONARY_STORAGE_PREFIX}${locale}`)
    if (!rawValue) {
      return null
    }

    const parsedValue = JSON.parse(rawValue) as Dictionary
    dictionaryCache.set(locale, parsedValue)
    return parsedValue
  } catch {
    return null
  }
}

function cacheDictionary(locale: Locale, dictionary: Dictionary): Dictionary {
  dictionaryCache.set(locale, dictionary)

  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(`${DICTIONARY_STORAGE_PREFIX}${locale}`, JSON.stringify(dictionary))
    } catch {
      // Ignore storage failures and continue using in-memory cache.
    }
  }

  return dictionary
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const cachedDictionary = readCachedDictionary(locale)
  if (cachedDictionary) {
    return cachedDictionary
  }

  const inFlightRequest = dictionaryRequestCache.get(locale)
  if (inFlightRequest) {
    return inFlightRequest
  }

  const request = (dictionaries[locale]?.() ?? dictionaries[defaultLocale]())
    .then((dictionary) => cacheDictionary(locale, dictionary))
    .finally(() => {
      dictionaryRequestCache.delete(locale)
    })

  dictionaryRequestCache.set(locale, request)
  return request
}

export function getCachedDictionary(locale: Locale): Dictionary | null {
  return readCachedDictionary(locale)
}

export function preloadDictionary(locale: Locale): void {
  void getDictionary(locale)
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getValidLocale(locale: string | undefined): Locale {
  if (locale && isValidLocale(locale)) {
    return locale
  }
  return defaultLocale
}

export { defaultLocale, locales, type Locale } from './config'
