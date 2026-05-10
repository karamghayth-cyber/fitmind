import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '../types'

interface AuthState {
  isAuthenticated: boolean
  userId: string | null
  email: string | null
  role: UserRole | null
  isLoading: boolean
  error: string | null
  login: (email: string, _password: string, role?: UserRole) => Promise<void>
  register: (email: string, _password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      email: null,
      role: null,
      isLoading: false,
      error: null,

      login: async (email, _password, role = 'user') => {
        set({ isLoading: true, error: null })
        await new Promise(r => setTimeout(r, 800))
        set({
          isAuthenticated: true,
          userId: 'user_' + Math.random().toString(36).substring(2),
          email,
          role,
          isLoading: false,
        })
      },

      register: async (email, _password, _name, role) => {
        set({ isLoading: true, error: null })
        await new Promise(r => setTimeout(r, 1000))
        set({
          isAuthenticated: true,
          userId: 'user_' + Math.random().toString(36).substring(2),
          email,
          role,
          isLoading: false,
        })
      },

      logout: () => set({ isAuthenticated: false, userId: null, email: null, role: null }),

      clearError: () => set({ error: null }),
    }),
    { name: 'fitmind-auth', partialize: (s) => ({ isAuthenticated: s.isAuthenticated, userId: s.userId, email: s.email, role: s.role }) }
  )
)
