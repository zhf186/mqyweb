import {
  clearAdminAuthStorage,
  getStoredAdminToken,
  refreshAdminSession,
} from '@/lib/auth/admin-session'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export class ApiError extends Error {
  status: number
  code?: number

  constructor(message: string, status: number, code?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  let url = `${API_BASE_URL}${endpoint}`

  if (!params) {
    return url
  }

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

  return url
}

function withAuthorization(headers?: HeadersInit): Headers {
  const nextHeaders = new Headers(headers)
  const token = getStoredAdminToken()

  if (token) {
    nextHeaders.set('Authorization', `Bearer ${token}`)
  }

  return nextHeaders
}

async function fetchWithAdminAuth(input: string, init: RequestInit = {}, retryUnauthorized = true): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    headers: withAuthorization(init.headers),
  })

  if (response.status === 401 && retryUnauthorized) {
    const refreshed = await refreshAdminSession()
    if (refreshed) {
      return fetchWithAdminAuth(input, init, false)
    }

    clearAdminAuthStorage(true)
  }

  return response
}

export async function authorizedFetch(input: string, init: RequestInit = {}): Promise<Response> {
  return fetchWithAdminAuth(input, init)
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options
  const url = buildUrl(endpoint, params)

  const headers = new Headers(fetchOptions.headers)
  if (fetchOptions.body !== undefined && !(fetchOptions.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetchWithAdminAuth(url, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new ApiError(error?.message || `HTTP error! status: ${response.status}`, response.status, error?.code)
  }

  const json = await response.json().catch(() => null)
  if (!json) {
    throw new ApiError('Request failed', response.status)
  }

  if (typeof json.code === 'number' && json.code !== 200) {
    throw new ApiError(json.message || 'Request failed', response.status, json.code)
  }

  return json
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PageResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

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
