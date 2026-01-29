/**
 * 线路 API
 */
import api, { type ApiResponse, type PageResponse } from './client'

export interface Route {
  id: number
  name: string
  nameEn?: string
  summary?: string
  description?: string
  coverImage?: string
  images?: string
  categoryId?: number
  difficulty: 'easy' | 'medium' | 'hard'
  duration?: number
  distance?: number
  price: number
  maxParticipants?: number
  status: number
  featured: boolean
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: number
  name: string
  nameEn?: string
  icon?: string
  sortOrder: number
}

/**
 * 获取热门线路
 */
export async function getFeaturedRoutes(limit = 4): Promise<Route[]> {
  const response = await api.get<Route[]>('/api/routes/featured', { limit })
  return response.data
}

/**
 * 获取线路列表
 */
export async function getRoutes(params?: {
  page?: number
  size?: number
  categoryId?: number
  difficulty?: string
}): Promise<PageResponse<Route>> {
  const response = await api.get<PageResponse<Route>>('/api/routes', params)
  return response.data
}

/**
 * 获取线路详情
 */
export async function getRouteDetail(id: number): Promise<Route> {
  const response = await api.get<Route>(`/api/routes/${id}`)
  return response.data
}

/**
 * 获取所有分类
 */
export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>('/api/categories')
  return response.data
}
