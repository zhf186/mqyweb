import { create } from 'zustand'
// import { persist } from 'zustand/middleware' // 暂时禁用 persist
import { Locale, defaultLocale, locales } from '@/lib/i18n/config'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

export const useLocaleStore = create<LocaleState>()((set, get) => ({
  locale: defaultLocale,
  
  setLocale: (locale) => {
    if (locales.includes(locale)) {
      set({ locale })
      // 更新 HTML lang 属性
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale
      }
    }
  },
  
  toggleLocale: () => {
    const currentLocale = get().locale
    const newLocale = currentLocale === 'zh' ? 'en' : 'zh'
    set({ locale: newLocale })
    // 更新 HTML lang 属性
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
    }
  },
}))
