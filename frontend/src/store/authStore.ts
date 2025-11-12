import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types/types'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            const user: User = {
              id: session.user.id,
              email: session.user.email!,
              username: session.user.user_metadata?.username,
              created_at: session.user.created_at,
            }
            set({ user, token: session.access_token })
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error)
        }
      },

      login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            username: data.user.user_metadata?.username,
            created_at: data.user.created_at,
          }
          set({ user, token: data.session?.access_token || null })
        }
      },

      register: async (email: string, password: string, username: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            username,
            created_at: data.user.created_at,
          }
          set({ user, token: data.session?.access_token || null })
        }
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, token: null })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
