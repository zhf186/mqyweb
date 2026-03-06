/**
 * CMS Admin Authentication Store
 * 管理 CMS 后台管理员的登录状态、用户信息和令牌
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminUser } from '@/lib/api/admin'

interface AdminAuthState {
  // State
  user: AdminUser | null
  token: string | null
  permissions: string[]
  isAuthenticated: boolean
  hasHydrated: boolean
  
  // Actions
  setUser: (user: AdminUser | null) => void
  setToken: (token: string | null) => void
  setPermissions: (permissions: string[]) => void
  syncFromStorage: () => void
  login: (user: AdminUser, token: string, permissions?: string[]) => void
  logout: () => void
  updateUser: (updates: Partial<AdminUser>) => void
}

/**
 * Admin Authentication Store
 * 
 * 使用 Zustand 管理 CMS 管理员认证状态
 * 使用 persist 中间件将 token 和 user 持久化到 localStorage
 */
export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
      hasHydrated: false,

      /**
       * 设置用户信息
       */
      setUser: (user) => 
        set((state) => ({
          user, 
          isAuthenticated: !!(user || state.token),
        })),
      
      /**
       * 设置认证令牌
       */
      setToken: (token) => {
        set((state) => ({
          token,
          isAuthenticated: !!(token || state.user),
        }))
        
        // 同步到 localStorage (用于 API 客户端)
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('admin_token', token)
          } else {
            localStorage.removeItem('admin_token')
          }
        }
      },
      
      /**
       * 设置权限列表
       */
      setPermissions: (permissions) => 
        set({ permissions }),

      /**
       * 从持久化状态恢复认证标记
       */
      syncFromStorage: () =>
        set((state) => ({
          isAuthenticated: !!(state.token || state.user),
          hasHydrated: true,
        })),
      
      /**
       * 登录
       */
      login: (user, token, permissions = []) => {
        set({
          user,
          token,
          permissions,
          isAuthenticated: true,
          hasHydrated: true,
        })
        
        // 同步到 localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', token)
        }
      },
      
      /**
       * 登出
       */
      logout: () => {
        set({
          user: null,
          token: null,
          permissions: [],
          isAuthenticated: false,
          hasHydrated: true,
        })
        
        // 清除 localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token')
        }
      },
      
      /**
       * 更新用户信息
       */
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'manqiyou-admin-auth', // localStorage key
      partialize: (state) => ({
        token: state.token,
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

/**
 * 辅助函数：检查是否有特定权限
 */
export const useHasPermission = (permission: string): boolean => {
  const permissions = useAdminAuthStore((state) => state.permissions)
  const user = useAdminAuthStore((state) => state.user)
  
  // 超级管理员拥有所有权限
  if (user?.role === 'super_admin') {
    return true
  }
  
  return permissions.includes(permission)
}

/**
 * 辅助函数：检查是否是超级管理员
 */
export const useIsSuperAdmin = (): boolean => {
  const user = useAdminAuthStore((state) => state.user)
  return user?.role === 'super_admin'
}

/**
 * 辅助函数：获取当前管理员用户
 */
export const useAdminUser = (): AdminUser | null => {
  return useAdminAuthStore((state) => state.user)
}

/**
 * 辅助函数：获取认证令牌
 */
export const useAdminToken = (): string | null => {
  return useAdminAuthStore((state) => state.token)
}

export default useAdminAuthStore
