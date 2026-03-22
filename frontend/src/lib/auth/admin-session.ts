const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const ADMIN_ACCESS_TOKEN_STORAGE_KEY = 'admin_token'
export const ADMIN_REFRESH_TOKEN_STORAGE_KEY = 'admin_refresh_token'
export const ADMIN_AUTH_PERSISTED_STORAGE_KEY = 'manqiyou-admin-auth'
export const ADMIN_AUTH_UNAUTHORIZED_EVENT = 'manqiyou-admin-unauthorized'
export const ADMIN_AUTH_SYNC_EVENT = 'manqiyou-admin-sync'

interface PersistedAdminAuthPayload {
  token?: string | null
  refreshToken?: string | null
  user?: unknown
  permissions?: string[]
  isAuthenticated?: boolean
}

interface PersistedAdminAuthSnapshot {
  state?: PersistedAdminAuthPayload
  version?: number
}

function readPersistedAdminAuthSnapshot(): PersistedAdminAuthSnapshot | null {
  if (typeof window === 'undefined') {
    return null
  }

  const persistedAuth = localStorage.getItem(ADMIN_AUTH_PERSISTED_STORAGE_KEY)
  if (!persistedAuth) {
    return null
  }

  try {
    return JSON.parse(persistedAuth) as PersistedAdminAuthSnapshot
  } catch {
    return null
  }
}

function writePersistedAdminAuthSnapshot(snapshot: PersistedAdminAuthSnapshot): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(ADMIN_AUTH_PERSISTED_STORAGE_KEY, JSON.stringify(snapshot))
}

export function getPersistedAdminAuthState(): PersistedAdminAuthPayload | null {
  return readPersistedAdminAuthSnapshot()?.state ?? null
}

export function getStoredAdminToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const directToken = localStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)
  if (directToken) {
    return directToken
  }

  const persistedToken = getPersistedAdminAuthState()?.token
  if (typeof persistedToken === 'string' && persistedToken.trim()) {
    localStorage.setItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY, persistedToken)
    return persistedToken
  }

  const legacyToken = localStorage.getItem('token')
  if (legacyToken) {
    localStorage.setItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY, legacyToken)
    return legacyToken
  }

  return null
}

export function getStoredAdminRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const directRefreshToken = localStorage.getItem(ADMIN_REFRESH_TOKEN_STORAGE_KEY)
  if (directRefreshToken) {
    return directRefreshToken
  }

  const persistedRefreshToken = getPersistedAdminAuthState()?.refreshToken
  if (typeof persistedRefreshToken === 'string' && persistedRefreshToken.trim()) {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_STORAGE_KEY, persistedRefreshToken)
    return persistedRefreshToken
  }

  return null
}

export function dispatchAdminAuthSync(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ADMIN_AUTH_SYNC_EVENT))
  }
}

export function dispatchAdminUnauthorized(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ADMIN_AUTH_UNAUTHORIZED_EVENT))
  }
}

export function updatePersistedAdminAuthState(
  patch: PersistedAdminAuthPayload,
  options: { dispatchSync?: boolean } = {}
): void {
  if (typeof window === 'undefined') {
    return
  }

  const existingSnapshot = readPersistedAdminAuthSnapshot()
  const nextState: PersistedAdminAuthPayload = {
    ...(existingSnapshot?.state ?? {}),
    ...patch,
  }

  writePersistedAdminAuthSnapshot({
    state: nextState,
    version: existingSnapshot?.version ?? 0,
  })

  if (typeof nextState.token === 'string' && nextState.token.trim()) {
    localStorage.setItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY, nextState.token)
  } else {
    localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)
  }

  if (typeof nextState.refreshToken === 'string' && nextState.refreshToken.trim()) {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_STORAGE_KEY, nextState.refreshToken)
  } else {
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_STORAGE_KEY)
  }

  if (options.dispatchSync !== false) {
    dispatchAdminAuthSync()
  }
}

export function clearAdminAuthStorage(dispatchUnauthorized = false): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)
  localStorage.removeItem(ADMIN_REFRESH_TOKEN_STORAGE_KEY)
  localStorage.removeItem(ADMIN_AUTH_PERSISTED_STORAGE_KEY)
  localStorage.removeItem('token')

  if (dispatchUnauthorized) {
    dispatchAdminUnauthorized()
  }
}

export async function refreshAdminSession(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false
  }

  const refreshToken = getStoredAdminRefreshToken()
  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    const json = await response.json().catch(() => null)
    const nextToken = json?.data?.token
    const nextRefreshToken = json?.data?.refreshToken || refreshToken

    if (!response.ok || !json || json.code !== 200 || typeof nextToken !== 'string' || !nextToken.trim()) {
      clearAdminAuthStorage(true)
      return false
    }

    updatePersistedAdminAuthState({
      token: nextToken,
      refreshToken: nextRefreshToken,
      user: json?.data?.user,
      isAuthenticated: true,
    })

    return true
  } catch {
    clearAdminAuthStorage(true)
    return false
  }
}
