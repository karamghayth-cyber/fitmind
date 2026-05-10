import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WhoopTokens } from '../services/whoop/whoopAuth'
import type { WhoopUserProfile, WhoopRecovery, WhoopSleep, WhoopCycle, WhoopWorkout } from '../services/whoop/whoopClient'
import {
  buildAuthorizationUrl,
  refreshAccessToken,
  exchangeCodeForTokens,
} from '../services/whoop/whoopAuth'
import {
  fetchWhoopProfile,
  fetchLatestRecovery,
  fetchLatestSleep,
  fetchRecentCycles,
  fetchRecentSleep,
  fetchRecentWorkouts,
} from '../services/whoop/whoopClient'
import { mapRecoveryToMetrics, mapSleepToMetrics, mapCycleToMetrics } from '../services/whoop/whoopMapper'
import type { DailyMetrics } from '../types'

interface WhoopState {
  isConnected: boolean
  tokens: WhoopTokens | null
  profile: WhoopUserProfile | null
  latestRecovery: WhoopRecovery | null
  latestSleep: WhoopSleep | null
  recentCycles: WhoopCycle[]
  recentSleep: WhoopSleep[]
  recentWorkouts: WhoopWorkout[]
  lastSynced: string | null
  isSyncing: boolean
  error: string | null

  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  handleCallback: (code: string, state: string) => Promise<void>
  sync: () => Promise<void>
  getTodayMetrics: () => Partial<DailyMetrics> | null
  ensureFreshToken: () => Promise<string | null>
  clearError: () => void
}

export const useWhoopStore = create<WhoopState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      tokens: null,
      profile: null,
      latestRecovery: null,
      latestSleep: null,
      recentCycles: [],
      recentSleep: [],
      recentWorkouts: [],
      lastSynced: null,
      isSyncing: false,
      error: null,

      connect: async () => {
        try {
          const { url } = await buildAuthorizationUrl()
          window.location.href = url
        } catch (e) {
          set({ error: e instanceof Error ? e.message : 'Failed to initiate Whoop connection' })
        }
      },

      disconnect: () => {
        sessionStorage.removeItem('whoop_pkce_verifier')
        sessionStorage.removeItem('whoop_oauth_state')
        set({
          isConnected: false, tokens: null, profile: null,
          latestRecovery: null, latestSleep: null,
          recentCycles: [], recentSleep: [], recentWorkouts: [],
          lastSynced: null, error: null,
        })
      },

      handleCallback: async (code, state) => {
        set({ isSyncing: true, error: null })
        try {
          const tokens = await exchangeCodeForTokens(code, state)
          set({ tokens, isConnected: true })
          await get().sync()
        } catch (e) {
          set({ error: e instanceof Error ? e.message : 'Whoop connection failed', isConnected: false })
        } finally {
          set({ isSyncing: false })
        }
      },

      ensureFreshToken: async () => {
        const { tokens } = get()
        if (!tokens) return null
        // Refresh if within 5 min of expiry
        if (Date.now() > tokens.expires_at - 5 * 60 * 1000) {
          try {
            const fresh = await refreshAccessToken(tokens.refresh_token)
            set({ tokens: fresh })
            return fresh.access_token
          } catch {
            set({ isConnected: false, tokens: null, error: 'Session expired. Please reconnect Whoop.' })
            return null
          }
        }
        return tokens.access_token
      },

      sync: async () => {
        const token = await get().ensureFreshToken()
        if (!token) return
        set({ isSyncing: true, error: null })
        try {
          const [profile, latestRecovery, latestSleep, recentCycles, recentSleep, recentWorkouts] = await Promise.all([
            fetchWhoopProfile(token),
            fetchLatestRecovery(token),
            fetchLatestSleep(token),
            fetchRecentCycles(token, 30),
            fetchRecentSleep(token, 30),
            fetchRecentWorkouts(token, 30),
          ])
          set({
            profile,
            latestRecovery,
            latestSleep,
            recentCycles,
            recentSleep,
            recentWorkouts,
            lastSynced: new Date().toISOString(),
          })
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Sync failed'
          if (msg === 'WHOOP_TOKEN_EXPIRED') {
            await get().ensureFreshToken()
            await get().sync()
          } else {
            set({ error: msg })
          }
        } finally {
          set({ isSyncing: false })
        }
      },

      getTodayMetrics: () => {
        const { latestRecovery, latestSleep, recentCycles } = get()
        if (!latestRecovery && !latestSleep) return null
        const today = new Date().toISOString().split('T')[0]
        let metrics: Partial<DailyMetrics> = { userId: 'current', date: today }
        if (latestRecovery) metrics = mapRecoveryToMetrics(latestRecovery, metrics)
        if (latestSleep) metrics = mapSleepToMetrics(latestSleep, metrics)
        const todayCycle = recentCycles.find(c => c.start.startsWith(today))
        if (todayCycle) metrics = mapCycleToMetrics(todayCycle, metrics)
        return metrics
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'fitmind-whoop',
      partialize: (s) => ({
        isConnected: s.isConnected,
        tokens: s.tokens,
        profile: s.profile,
        latestRecovery: s.latestRecovery,
        latestSleep: s.latestSleep,
        recentCycles: s.recentCycles,
        recentSleep: s.recentSleep,
        recentWorkouts: s.recentWorkouts,
        lastSynced: s.lastSynced,
      }),
    }
  )
)
