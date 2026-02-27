/**
 * CMS Admin API Client
 * 封装所有 CMS 后台管理 API 调用
 */

import { api, ApiResponse, PageResponse } from './client'

// ==================== Types ====================

export interface AdminUser {
  id: string
  username: string
  email: string
  fullName: string
  role: 'super_admin' | 'content_editor'
  isActive: boolean
  lastLoginAt: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AdminUser
  expiresIn: number
}

export interface Page {
  id: string
  slug: string
  nameZh: string
  nameEn: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ContentItem {
  id: string
  pageId: string
  fieldKey: string
  fieldType: 'text' | 'textarea' | 'richtext'
  contentZh: string
  contentEn: string
  maxLength?: number
  isRequired: boolean
  displayOrder: number
  version: number
  createdAt: string
  updatedAt: string
}

export interface ContentVersion {
  id: string
  contentItemId: string
  versionNumber: number
  contentZh: string
  contentEn: string
  changedBy: string
  changeSummary: string
  createdAt: string
}

export interface Asset {
  id: string
  category: string
  originalFilename: string
  fileKey: string
  fileUrl: string
  largeUrl: string
  mediumUrl: string
  smallUrl: string
  thumbnailUrl: string
  fileSize: number
  width: number
  height: number
  mimeType: string
  isProcessed: boolean
  webpConverted: boolean
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed'
  altTextZh: string
  altTextEn: string
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

export interface AssetUsage {
  id: string
  assetId: string
  usageType: string
  usageId: string
  fieldName: string
  createdAt: string
}

export interface Route {
  id: string
  nameZh: string
  nameEn: string
  slug: string
  shortDescZh: string
  shortDescEn: string
  fullDescZh: string
  fullDescEn: string
  distance: number
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  price: number
  coverImageId: string
  status: 'draft' | 'published' | 'archived'
  isFeatured: boolean
  viewCount: number
  bookingCount: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  nameZh: string
  nameEn: string
  slug: string
  shortDescZh: string
  shortDescEn: string
  fullDescZh: string
  fullDescEn: string
  category: string
  originalPrice: number
  currentPrice: number
  stockQuantity: number
  coverImageId: string
  merchantName: string
  merchantAddress: string
  merchantContact: string
  status: 'draft' | 'active' | 'inactive'
  viewCount: number
  saleCount: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Partner {
  id: string
  name: string
  type: 'brand' | 'scenic_area'
  descriptionZh: string
  descriptionEn: string
  logoId: string
  websiteUrl: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SystemSettings {
  siteName: string
  siteLogoId: string
  siteFaviconId: string
  contactEmail: string
  contactPhone: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  wechatQrCodeId: string
  weiboUrl: string
  douyinUrl: string
  ossAccessKeyId: string
  ossAccessKeySecret: string
  ossBucket: string
  ossRegion: string
  translationApiKey: string
  smtpHost: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
}

export interface OperationLog {
  id: string
  userId: string
  action: string
  resourceType: string
  resourceId: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: string
}

export interface DashboardStats {
  totalPages: number
  totalAssets: number
  totalRoutes: number
  totalProducts: number
  recentUpdates: any[]
  todoItems: any[]
}

// ==================== API Client ====================

/**
 * 认证 API
 */
export const authApi = {
  /**
   * 登录
   */
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/admin/auth/login', data),

  /**
   * 登出
   */
  logout: () =>
    api.post<void>('/admin/auth/logout'),

  /**
   * 获取当前用户信息
   */
  me: () =>
    api.get<{ user: AdminUser; permissions: string[] }>('/admin/auth/me'),
}

/**
 * 内容管理 API
 */
export const contentApi = {
  /**
   * 获取所有页面
   */
  getPages: () =>
    api.get<Page[]>('/admin/content/pages'),

  /**
   * 获取页面详情和内容项
   */
  getPageContent: (pageId: string) =>
    api.get<{ page: Page; contentItems: ContentItem[] }>(`/admin/content/pages/${pageId}`),

  /**
   * 更新内容项
   */
  updateContentItem: (itemId: string, data: { contentZh: string; contentEn: string; version: number; changeSummary?: string }) =>
    api.put<{ contentItem: ContentItem; version: ContentVersion }>(`/admin/content/items/${itemId}`, data),

  /**
   * 获取内容项版本历史
   */
  getVersions: (itemId: string) =>
    api.get<ContentVersion[]>(`/admin/content/items/${itemId}/versions`),

  /**
   * 恢复到指定版本
   */
  restoreVersion: (itemId: string, versionId: string) =>
    api.post<ContentItem>(`/admin/content/items/${itemId}/restore?versionId=${encodeURIComponent(versionId)}`),
}

/**
 * 资源管理 API
 */
export const assetApi = {
  /**
   * 获取资源列表
   */
  getAssets: (params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
  }) =>
    api.get<PageResponse<Asset>>('/admin/assets', params),

  /**
   * 获取资源详情
   */
  getAsset: (assetId: string) =>
    api.get<Asset>(`/admin/assets/${assetId}`),

  /**
   * 上传资源
   */
  uploadAssets: async (files: File[], category: string) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    formData.append('category', category)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/assets/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('admin_token') : ''}`,
      },
      body: formData,
    })

    const json = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error((json && json.message) ? json.message : 'Upload failed')
    }
    if (!json || json.code !== 200) {
      throw new Error((json && json.message) ? json.message : 'Upload failed')
    }
    if (!Array.isArray(json.data) || json.data.length === 0) {
      throw new Error('上传未产生任何可用图片，请检查文件格式/大小或后端存储配置')
    }
    return json
  },

  /**
   * 替换资源
   */
  replaceAsset: async (assetId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/assets/${assetId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('admin_token') : ''}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Replace failed')
    }

    return response.json()
  },

  /**
   * 删除资源
   */
  deleteAsset: (assetId: string) =>
    api.delete<void>(`/admin/assets/${assetId}`),

  /**
   * 获取资源使用情况
   */
  getAssetUsage: (assetId: string) =>
    api.get<AssetUsage[]>(`/admin/assets/${assetId}/usage`),
}

/**
 * 路线管理 API
 */
export const routeApi = {
  /**
   * 获取路线列表
   */
  getRoutes: (params?: {
    status?: 'draft' | 'published' | 'archived'
    search?: string
    page?: number
    limit?: number
  }) =>
    api.get<PageResponse<Route>>('/admin/routes', params),

  /**
   * 创建路线
   */
  createRoute: (data: Partial<Route>) =>
    api.post<Route>('/admin/routes', data),

  /**
   * 更新路线
   */
  updateRoute: (routeId: string, data: Partial<Route>) =>
    api.put<Route>(`/admin/routes/${routeId}`, data),

  /**
   * 删除路线
   */
  deleteRoute: (routeId: string) =>
    api.delete<void>(`/admin/routes/${routeId}`),

  /**
   * 发布路线
   */
  publishRoute: (routeId: string) =>
    api.post<Route>(`/admin/routes/${routeId}/publish`),
}

/**
 * 商品管理 API
 */
export const productApi = {
  /**
   * 获取商品列表
   */
  getProducts: (params?: {
    status?: 'draft' | 'active' | 'inactive'
    search?: string
    page?: number
    limit?: number
  }) =>
    api.get<PageResponse<Product>>('/admin/products', params),

  /**
   * 创建商品
   */
  createProduct: (data: Partial<Product>) =>
    api.post<Product>('/admin/products', data),

  /**
   * 更新商品
   */
  updateProduct: (productId: string, data: Partial<Product>) =>
    api.put<Product>(`/admin/products/${productId}`, data),

  /**
   * 删除商品
   */
  deleteProduct: (productId: string) =>
    api.delete<void>(`/admin/products/${productId}`),
}

/**
 * 合作伙伴管理 API
 */
export const partnerApi = {
  /**
   * 获取合作伙伴列表
   */
  getPartners: () =>
    api.get<Partner[]>('/admin/partners'),

  /**
   * 创建合作伙伴
   */
  createPartner: (data: Partial<Partner>) =>
    api.post<Partner>('/admin/partners', data),

  /**
   * 更新合作伙伴
   */
  updatePartner: (partnerId: string, data: Partial<Partner>) =>
    api.put<Partner>(`/admin/partners/${partnerId}`, data),

  /**
   * 删除合作伙伴
   */
  deletePartner: (partnerId: string) =>
    api.delete<void>(`/admin/partners/${partnerId}`),

  /**
   * 重新排序
   */
  reorderPartners: (partnerIds: string[]) =>
    api.put<void>('/admin/partners/reorder', { partnerIds }),
}

/**
 * 系统设置 API
 */
export const settingsApi = {
  /**
   * 获取系统设置
   */
  getSettings: () =>
    api.get<SystemSettings>('/admin/settings'),

  /**
   * 更新系统设置
   */
  updateSettings: (data: Partial<SystemSettings>) =>
    api.put<SystemSettings>('/admin/settings', data),
}

/**
 * 统计 API
 */
export const statisticsApi = {
  /**
   * 获取仪表盘统计
   */
  getDashboard: () =>
    api.get<DashboardStats>('/admin/statistics/dashboard'),

  /**
   * 获取路线统计
   */
  getRouteStats: (routeId: string) =>
    api.get<{ views: number; bookings: number; revenue: number }>(`/admin/statistics/routes/${routeId}`),
}

/**
 * 日志 API
 */
export const logApi = {
  /**
   * 获取日志列表
   */
  getLogs: (params?: {
    startDate?: string
    endDate?: string
    userId?: string
    action?: string
    page?: number
    limit?: number
  }) =>
    api.get<PageResponse<OperationLog>>('/admin/logs', params),

  /**
   * 获取日志详情
   */
  getLog: (logId: string) =>
    api.get<OperationLog>(`/admin/logs/${logId}`),
}

/**
 * 导出所有 API
 */
export const adminApi = {
  auth: authApi,
  content: contentApi,
  asset: assetApi,
  route: routeApi,
  product: productApi,
  partner: partnerApi,
  settings: settingsApi,
  statistics: statisticsApi,
  log: logApi,
}

export default adminApi
