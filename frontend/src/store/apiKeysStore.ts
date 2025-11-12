import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ApiKeysState {
  alibabaApiKey: string
  amapKey: string
  setAlibabaApiKey: (key: string) => void
  setAmapKey: (key: string) => void
  clearKeys: () => void
}

export const useApiKeysStore = create<ApiKeysState>()(
  persist(
    (set) => ({
      alibabaApiKey: '',
      amapKey: '',
      
      setAlibabaApiKey: (key: string) => set({ alibabaApiKey: key }),
      setAmapKey: (key: string) => set({ amapKey: key }),
      clearKeys: () => set({ alibabaApiKey: '', amapKey: '' }),
    }),
    {
      name: 'api-keys-storage',
    }
  )
)
