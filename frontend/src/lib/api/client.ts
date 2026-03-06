/**
 * API client configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const adminToken = localStorage.getItem('admin_token')
  if (adminToken) {
    return adminToken
  }

  const persistedAuth = localStorage.getItem('manqiyou-admin-auth')
  if (persistedAuth) {
    try {
      const parsed = JSON.parse(persistedAuth)
      const token = parsed?.state?.token
      if (typeof token === 'string' && token.trim()) {
        localStorage.setItem('admin_token', token)
        return token
      }
    } catch {
      // Ignore malformed persisted data.
    }
  }

  return localStorage.getItem('token')
}

/**
 * Send API request
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

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

  const headers = new Headers(fetchOptions.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getStoredToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  const json = await response.json().catch(() => null)
  if (!json) {
    throw new Error('Request failed')
  }

  if (typeof json.code === 'number' && json.code !== 200) {
    throw new Error(json.message || 'Request failed')
  }

  return json
}

/**
 * API response type
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

/**
 * Page response type
 */
export interface PageResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/**
 * API client
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

  delete: <T>(endpoint: string) => request<ApiResponse<T>>(endpoint, { method: 'DELETE' }),
}

export default api
