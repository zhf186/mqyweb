import { beforeEach, describe, expect, it } from 'vitest'
import { useAdminAuthStore } from './admin-auth'

const mockUser = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  fullName: 'Admin User',
  role: 'super_admin' as const,
  isActive: true,
  lastLoginAt: '2026-03-11T10:00:00Z',
  createdAt: '2026-03-11T10:00:00Z',
  updatedAt: '2026-03-11T10:00:00Z',
}

function resetAdminAuthStore() {
  localStorage.clear()
  useAdminAuthStore.setState({
    user: null,
    token: null,
    refreshToken: null,
    permissions: [],
    isAuthenticated: false,
    hasHydrated: false,
  })
}

describe('useAdminAuthStore', () => {
  beforeEach(() => {
    resetAdminAuthStore()
  })

  it('persists access token and refresh token on login', () => {
    useAdminAuthStore.getState().login(mockUser, 'access-token-1', 'refresh-token-1', ['content:write'])

    const state = useAdminAuthStore.getState()

    expect(state.token).toBe('access-token-1')
    expect(state.refreshToken).toBe('refresh-token-1')
    expect(state.isAuthenticated).toBe(true)
    expect(localStorage.getItem('admin_token')).toBe('access-token-1')
    expect(localStorage.getItem('admin_refresh_token')).toBe('refresh-token-1')
  })

  it('syncs latest auth state from persisted storage', () => {
    localStorage.setItem('manqiyou-admin-auth', JSON.stringify({
      state: {
        token: 'persisted-access',
        refreshToken: 'persisted-refresh',
        user: mockUser,
        permissions: ['settings:read'],
        isAuthenticated: true,
      },
      version: 0,
    }))

    useAdminAuthStore.getState().syncFromStorage()

    const state = useAdminAuthStore.getState()

    expect(state.token).toBe('persisted-access')
    expect(state.refreshToken).toBe('persisted-refresh')
    expect(state.user?.username).toBe('admin')
    expect(state.permissions).toEqual(['settings:read'])
    expect(state.hasHydrated).toBe(true)
  })

  it('clears access token and refresh token on logout', () => {
    useAdminAuthStore.getState().login(mockUser, 'access-token-2', 'refresh-token-2')

    useAdminAuthStore.getState().logout()

    const state = useAdminAuthStore.getState()

    expect(state.token).toBeNull()
    expect(state.refreshToken).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(localStorage.getItem('admin_token')).toBeNull()
    expect(localStorage.getItem('admin_refresh_token')).toBeNull()
    expect(localStorage.getItem('manqiyou-admin-auth')).toBeNull()
  })
})
