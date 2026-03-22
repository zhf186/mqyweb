/**
 * Public CMS content client.
 * Used by the frontend to read published content from the CMS API.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
const CACHE_TTL_MS = 5 * 60 * 1000
const PAGE_CACHE_STORAGE_PREFIX = 'mrc:cms:page:'
const MULTI_PAGE_CACHE_STORAGE_PREFIX = 'mrc:cms:pages:'

export interface CMSContent {
  [key: string]: string
}

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const pageCache = new Map<string, CacheEntry<CMSContent>>()
const pageRequestCache = new Map<string, Promise<CMSContent>>()
const multiPageCache = new Map<string, CacheEntry<Record<string, CMSContent>>>()
const multiPageRequestCache = new Map<string, Promise<Record<string, CMSContent>>>()

function isCacheEntryValid<T>(entry?: CacheEntry<T>): entry is CacheEntry<T> {
  return Boolean(entry && entry.expiresAt > Date.now())
}

function readStorageEntry<T>(key: string): CacheEntry<T> | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawValue = window.sessionStorage.getItem(key)
    if (!rawValue) {
      return null
    }

    const parsedValue = JSON.parse(rawValue) as CacheEntry<T>
    return isCacheEntryValid(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

function writeStorageEntry<T>(key: string, data: T): CacheEntry<T> {
  const entry = {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  }

  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(entry))
    } catch {
      // Ignore storage quota failures and keep using in-memory cache.
    }
  }

  return entry
}

function getCachedPageContent(slug: string): CMSContent | null {
  const cachedEntry = pageCache.get(slug)
  if (isCacheEntryValid(cachedEntry)) {
    return cachedEntry.data
  }

  const storageEntry = readStorageEntry<CMSContent>(`${PAGE_CACHE_STORAGE_PREFIX}${slug}`)
  if (storageEntry) {
    pageCache.set(slug, storageEntry)
    return storageEntry.data
  }

  return null
}

function setCachedPageContent(slug: string, data: CMSContent): CMSContent {
  const entry = writeStorageEntry(`${PAGE_CACHE_STORAGE_PREFIX}${slug}`, data)
  pageCache.set(slug, entry)
  return data
}

function getCachedMultiplePages(slugs: string[]): Record<string, CMSContent> | null {
  const cacheKey = slugs.slice().sort().join(',')
  const cachedEntry = multiPageCache.get(cacheKey)
  if (isCacheEntryValid(cachedEntry)) {
    return cachedEntry.data
  }

  const storageEntry = readStorageEntry<Record<string, CMSContent>>(
    `${MULTI_PAGE_CACHE_STORAGE_PREFIX}${cacheKey}`
  )
  if (storageEntry) {
    multiPageCache.set(cacheKey, storageEntry)
    return storageEntry.data
  }

  return null
}

function setCachedMultiplePages(
  slugs: string[],
  data: Record<string, CMSContent>
): Record<string, CMSContent> {
  const cacheKey = slugs.slice().sort().join(',')
  const entry = writeStorageEntry(`${MULTI_PAGE_CACHE_STORAGE_PREFIX}${cacheKey}`, data)
  multiPageCache.set(cacheKey, entry)
  return data
}

export async function getPageContent(slug: string): Promise<CMSContent> {
  const cachedContent = getCachedPageContent(slug)
  if (cachedContent) {
    return cachedContent
  }

  const inFlightRequest = pageRequestCache.get(slug)
  if (inFlightRequest) {
    return inFlightRequest
  }

  const request = (async () => {
    try {
      const response = await fetch(`${API_URL}/public/content/pages/${slug}`, {
        cache: 'default',
      })

      if (!response.ok) {
        console.error(`Failed to fetch content for ${slug}:`, response.statusText)
        return {}
      }

      const result = await response.json()

      if (result.code === 200 && result.data) {
        return setCachedPageContent(slug, result.data)
      }

      return {}
    } catch (error) {
      console.error(`Error fetching content for ${slug}:`, error)
      return {}
    } finally {
      pageRequestCache.delete(slug)
    }
  })()

  pageRequestCache.set(slug, request)
  return request
}

export async function getMultiplePages(slugs: string[]): Promise<Record<string, CMSContent>> {
  const normalizedSlugs = slugs.slice().sort()
  const cacheKey = normalizedSlugs.join(',')
  const cachedContent = getCachedMultiplePages(normalizedSlugs)
  if (cachedContent) {
    return cachedContent
  }

  const inFlightRequest = multiPageRequestCache.get(cacheKey)
  if (inFlightRequest) {
    return inFlightRequest
  }

  const request = (async () => {
    try {
      const response = await fetch(`${API_URL}/public/content/pages?slugs=${normalizedSlugs.join(',')}`, {
        cache: 'default',
      })

      if (!response.ok) {
        console.error('Failed to fetch multiple pages:', response.statusText)
        return {}
      }

      const result = await response.json()

      if (result.code === 200 && result.data) {
        return setCachedMultiplePages(normalizedSlugs, result.data)
      }

      return {}
    } catch (error) {
      console.error('Error fetching multiple pages:', error)
      return {}
    } finally {
      multiPageRequestCache.delete(cacheKey)
    }
  })()

  multiPageRequestCache.set(cacheKey, request)
  return request
}

export function getContent(
  cmsContent: CMSContent,
  key: string,
  lang: 'zh' | 'en',
  fallback: string = ''
): string {
  const fullKey = `${key}.${lang}`
  return cmsContent[fullKey] || fallback
}
