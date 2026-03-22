import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminUser } from '@/lib/api/admin'
import {
  clearAdminAuthStorage,
  getPersistedAdminAuthState,
  getStoredAdminRefreshToken,
  getStoredAdminToken,
  updatePersistedAdminAuthState,
} from '@/lib/auth/admin-session'

interface AdminAuthState {
  user: AdminUser | null
  token: string | null
  refreshToken: string | null
  permissions: string[]
  isAuthenticated: boolean
  hasHydrated: boolean
  setUser: (user: AdminUser | null) => void
  setToken: (token: string | null) => void
  setRefreshToken: (refreshToken: string | null) => void
  setPermissions: (permissions: string[]) => void
  syncFromStorage: () => void
  login: (user: AdminUser, token: string, refreshToken?: string | null, permissions?: string[]) => void
  logout: () => void
  updateUser: (updates: Partial<AdminUser>) => void
}

function persistState(state: {
  user: AdminUser | null
  token: string | null
  refreshToken: string | null
  permissions: string[]
  isAuthenticated: boolean
}): void {
  updatePersistedAdminAuthState({
    user: state.user,
    token: state.token,
    refreshToken: state.refreshToken,
    permissions: state.permissions,
    isAuthenticated: state.isAuthenticated,
  }, { dispatchSync: false })
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      permissions: [],
      isAuthenticated: false,
      hasHydrated: false,

      setUser: (user) =>
        set((state) => {
          const nextState = {
            user,
            token: state.token,
            refreshToken: state.refreshToken,
            permissions: state.permissions,
            isAuthenticated: !!(state.token || user),
          }

          persistState(nextState)

          return {
            user,
            isAuthenticated: nextState.isAuthenticated,
          }
        }),

      setToken: (token) =>
        set((state) => {
          const nextState = {
            user: state.user,
            token,
            refreshToken: state.refreshToken,
            permissions: state.permissions,
            isAuthenticated: !!(token || state.user),
          }

          persistState(nextState)

          return {
            token,
            isAuthenticated: nextState.isAuthenticated,
          }
        }),

      setRefreshToken: (refreshToken) =>
        set((state) => {
          persistState({
            user: state.user,
            token: state.token,
            refreshToken,
            permissions: state.permissions,
            isAuthenticated: !!(state.token || state.user),
          })

          return { refreshToken }
        }),

      setPermissions: (permissions) =>
        set((state) => {
          persistState({
            user: state.user,
            token: state.token,
            refreshToken: state.refreshToken,
            permissions,
            isAuthenticated: !!(state.token || state.user),
          })

          return { permissions }
        }),

      syncFromStorage: () =>
        set(() => {
          const persistedState = getPersistedAdminAuthState()
          const token = getStoredAdminToken() ?? persistedState?.token ?? null
          const refreshToken = getStoredAdminRefreshToken() ?? persistedState?.refreshToken ?? null
          const user = (persistedState?.user as AdminUser | null | undefined) ?? null
          const permissions = Array.isArray(persistedState?.permissions) ? persistedState.permissions : []

          return {
            user,
            token,
            refreshToken,
            permissions,
            isAuthenticated: !!(token || user),
            hasHydrated: true,
          }
        }),

      login: (user, token, refreshToken = null, permissions = []) => {
        set({
          user,
          token,
          refreshToken,
          permissions,
          isAuthenticated: true,
          hasHydrated: true,
        })

        persistState({
          user,
          token,
          refreshToken,
          permissions,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          permissions: [],
          isAuthenticated: false,
          hasHydrated: true,
        })

        clearAdminAuthStorage()
      },

      updateUser: (updates) =>
        set((state) => {
          const user = state.user ? { ...state.user, ...updates } : null

          persistState({
            user,
            token: state.token,
            refreshToken: state.refreshToken,
            permissions: state.permissions,
            isAuthenticated: !!(state.token || user),
          })

          return { user }
        }),
    }),
    {
      name: 'manqiyou-admin-auth',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.syncFromStorage()
      },
    }
  )
)

export const useHasPermission = (permission: string): boolean => {
  const permissions = useAdminAuthStore((state) => state.permissions)
  const user = useAdminAuthStore((state) => state.user)

  if (user?.role === 'super_admin') {
    return true
  }

  return permissions.includes(permission)
}

export const useIsSuperAdmin = (): boolean => {
  const user = useAdminAuthStore((state) => state.user)
  return user?.role === 'super_admin'
}

export const useAdminUser = (): AdminUser | null => {
  return useAdminAuthStore((state) => state.user)
}

export const useAdminToken = (): string | null => {
  return useAdminAuthStore((state) => state.token)
}

export default useAdminAuthStore
