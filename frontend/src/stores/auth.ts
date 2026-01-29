import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  phone: string
  nickname: string
  avatar: string | null
  memberLevelId: string | null
  points: number
}

export interface MemberLevel {
  id: string
  name: string
  minPoints: number
  benefits: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  memberLevel: MemberLevel | null
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setMemberLevel: (level: MemberLevel | null) => void
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      memberLevel: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => set({ token }),
      
      setMemberLevel: (memberLevel) => set({ memberLevel }),
      
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      
      logout: () =>
        set({
          user: null,
          token: null,
          memberLevel: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'manqiyou-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
)
