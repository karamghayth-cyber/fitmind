import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BodyMetricEntry, DailyMetrics, ProgressPhoto } from '../types'
import { generateId, today } from '../utils'

// Seed realistic mock data for UAE user
function seedMetrics(): BodyMetricEntry[] {
  const entries: BodyMetricEntry[] = []
  const now = new Date()
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    if (i % 3 === 0) {
      entries.push({
        id: generateId(),
        userId: 'current',
        date: d.toISOString().split('T')[0],
        weightKg: parseFloat((82 - (89 - i) * 0.04 + (Math.random() - 0.5) * 0.4).toFixed(1)),
        bodyFatPercent: parseFloat((22 - (89 - i) * 0.02 + (Math.random() - 0.5) * 0.2).toFixed(1)),
        muscleMassKg: parseFloat((63 + (89 - i) * 0.02).toFixed(1)),
        bmi: parseFloat((26.5 - (89 - i) * 0.01).toFixed(1)),
      })
    }
  }
  return entries
}

function seedDailyMetrics(): DailyMetrics[] {
  const metrics: DailyMetrics[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    metrics.push({
      userId: 'current',
      date: d.toISOString().split('T')[0],
      stepsCount: Math.floor(6000 + Math.random() * 6000),
      activeCalories: Math.floor(300 + Math.random() * 400),
      sleepHours: parseFloat((6 + Math.random() * 2.5).toFixed(1)),
      sleepQuality: (Math.floor(Math.random() * 3) + 3) as 3 | 4 | 5,
      restingHeartRate: Math.floor(58 + Math.random() * 15),
      recoveryScore: Math.floor(45 + Math.random() * 50),
      hydrationMl: Math.floor(1500 + Math.random() * 1500),
      stressLevel: (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3,
    })
  }
  return metrics
}

interface ProgressState {
  bodyMetrics: BodyMetricEntry[]
  dailyMetrics: DailyMetrics[]
  progressPhotos: ProgressPhoto[]
  selectedPeriod: 7 | 30 | 90 | 180

  addBodyMetric: (entry: Omit<BodyMetricEntry, 'id' | 'userId'>) => void
  logDailyMetric: (metrics: Partial<DailyMetrics>) => void
  addPhoto: (photo: Omit<ProgressPhoto, 'id' | 'userId'>) => void
  setPeriod: (p: ProgressState['selectedPeriod']) => void
  getTodayMetrics: () => DailyMetrics | undefined
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      bodyMetrics: seedMetrics(),
      dailyMetrics: seedDailyMetrics(),
      progressPhotos: [],
      selectedPeriod: 30,

      addBodyMetric: (entry) => {
        const metric: BodyMetricEntry = { ...entry, id: generateId(), userId: 'current' }
        set(s => ({ bodyMetrics: [...s.bodyMetrics, metric].sort((a, b) => a.date.localeCompare(b.date)) }))
      },

      logDailyMetric: (metrics) => {
        const date = today()
        set(s => {
          const existing = s.dailyMetrics.find(m => m.date === date)
          if (existing) {
            return { dailyMetrics: s.dailyMetrics.map(m => m.date === date ? { ...m, ...metrics } : m) }
          }
          return { dailyMetrics: [...s.dailyMetrics, { userId: 'current', date, ...metrics }] }
        })
      },

      addPhoto: (photo) => set(s => ({
        progressPhotos: [...s.progressPhotos, { ...photo, id: generateId(), userId: 'current' }],
      })),

      setPeriod: (p) => set({ selectedPeriod: p }),

      getTodayMetrics: () => get().dailyMetrics.find(m => m.date === today()),
    }),
    { name: 'fitmind-progress' }
  )
)
