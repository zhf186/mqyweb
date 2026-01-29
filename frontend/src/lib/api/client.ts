/**
 * API 客户端配置
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * 发送 API 请求
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options

  // 构建 URL
  let url = `${API_BASE_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  // 默认请求头
  const headers = new Headers(fetchOptions.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  // 添加认证 token
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * API 响应类型
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

/**
 * 分页响应类型
 */
export interface PageResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/**
 * API 客户端
 */
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) =>
    request<ApiResponse<T>>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, data?: unknown) =>
    request<ApiResponse<T>>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    request<ApiResponse<T>>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<ApiResponse<T>>(endpoint, { method: 'DELETE' }),
}

export default api
