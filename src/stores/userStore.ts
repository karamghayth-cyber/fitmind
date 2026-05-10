import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, HealthData } from '../types'
import { generateId, today } from '../utils'

interface UserState {
  profile: UserProfile | null
  healthData: HealthData | null
  isOnboarded: boolean
  setProfile: (p: UserProfile) => void
  setHealthData: (h: HealthData) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  completeOnboarding: () => void
  createProfile: (email: string, name: string, role: 'user' | 'trainer') => void
  toggleRamadanMode: () => void
  reset: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      healthData: null,
      isOnboarded: false,

      createProfile: (email, name, role) => {
        const profile: UserProfile = {
          id: generateId(),
          email,
          displayName: name,
          role,
          subscription: 'free',
          isOnboarded: false,
          createdAt: today(),
          updatedAt: today(),
          locale: 'en',
          timezone: 'Asia/Dubai',
          ramadanModeEnabled: false,
        }
        set({ profile })
      },

      setProfile: (p) => set({ profile: p }),

      setHealthData: (h) => set({ healthData: h }),

      updateProfile: (updates) => {
        const current = get().profile
        if (current) set({ profile: { ...current, ...updates, updatedAt: today() } })
      },

      completeOnboarding: () => {
        set({ isOnboarded: true })
        const current = get().profile
        if (current) set({ profile: { ...current, isOnboarded: true } })
      },

      toggleRamadanMode: () => {
        const current = get().profile
        if (current) set({ profile: { ...current, ramadanModeEnabled: !current.ramadanModeEnabled } })
      },

      reset: () => set({ profile: null, healthData: null, isOnboarded: false }),
    }),
    { name: 'fitmind-user' }
  )
)
