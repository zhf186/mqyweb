import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ColorStyle = 'default' | 'bright'

interface StyleState {
  style: ColorStyle
  setStyle: (style: ColorStyle) => void
  toggleStyle: () => void
}

export const useStyleStore = create<StyleState>()(
  persist(
    (set, get) => ({
      style: 'default',

      setStyle: (style) => {
        set({ style })
      },

      toggleStyle: () => {
        set({ style: get().style === 'default' ? 'bright' : 'default' })
      },
    }),
    {
      name: 'manqiyou-style',
    }
  )
)
