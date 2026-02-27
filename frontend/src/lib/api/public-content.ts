/**
 * 公开内容API客户端
 * 用于前端页面从CMS读取内容
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export interface CMSContent {
  [key: string]: string
}

/**
 * 根据页面slug获取内容
 */
export async function getPageContent(slug: string): Promise<CMSContent> {
  try {
    const response = await fetch(`${API_URL}/public/content/pages/${slug}`, {
      cache: 'no-store', // 不缓存，确保获取最新内容
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch content for ${slug}:`, response.statusText)
      return {}
    }
    
    const result = await response.json()
    
    if (result.code === 200 && result.data) {
      return result.data
    }
    
    return {}
  } catch (error) {
    console.error(`Error fetching content for ${slug}:`, error)
    return {}
  }
}

/**
 * 批量获取多个页面的内容
 */
export async function getMultiplePages(slugs: string[]): Promise<Record<string, CMSContent>> {
  try {
    const response = await fetch(`${API_URL}/public/content/pages?slugs=${slugs.join(',')}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      console.error('Failed to fetch multiple pages:', response.statusText)
      return {}
    }
    
    const result = await response.json()
    
    if (result.code === 200 && result.data) {
      return result.data
    }
    
    return {}
  } catch (error) {
    console.error('Error fetching multiple pages:', error)
    return {}
  }
}

/**
 * 获取内容的辅助函数
 * 优先使用CMS内容，如果不存在则使用fallback
 */
export function getContent(
  cmsContent: CMSContent,
  key: string,
  lang: 'zh' | 'en',
  fallback: string = ''
): string {
  const fullKey = `${key}.${lang}`
  return cmsContent[fullKey] || fallback
}
