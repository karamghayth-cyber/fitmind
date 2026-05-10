// Maps raw Whoop API data to FitMind DailyMetrics + BodyMetricEntry shapes

import type { DailyMetrics, BodyMetricEntry } from '../../types'
import type { WhoopRecovery, WhoopSleep, WhoopCycle, WhoopBodyMeasurement, WhoopWorkout } from './whoopClient'
import { generateId } from '../../utils'

export function mapRecoveryToMetrics(
  recovery: WhoopRecovery,
  existing: Partial<DailyMetrics> = {}
): Partial<DailyMetrics> {
  if (!recovery.score) return existing
  const date = recovery.created_at.split('T')[0]
  return {
    ...existing,
    userId: 'current',
    date,
    recoveryScore: Math.round(recovery.score.recovery_score),
    restingHeartRate: Math.round(recovery.score.resting_heart_rate),
    hrvMs: Math.round(recovery.score.hrv_rmssd_milli),
  }
}

export function mapSleepToMetrics(
  sleep: WhoopSleep,
  existing: Partial<DailyMetrics> = {}
): Partial<DailyMetrics> {
  if (!sleep.score) return existing
  const date = sleep.start.split('T')[0]
  const totalSleepMs =
    sleep.score.stage_summary.total_light_sleep_time_milli +
    sleep.score.stage_summary.total_slow_wave_sleep_time_milli +
    sleep.score.stage_summary.total_rem_sleep_time_milli
  return {
    ...existing,
    userId: 'current',
    date,
    sleepHours: Math.round((totalSleepMs / 3_600_000) * 10) / 10,
    sleepQuality: scoreToQuality(sleep.score.sleep_performance_percentage),
  }
}

export function mapCycleToMetrics(
  cycle: WhoopCycle,
  existing: Partial<DailyMetrics> = {}
): Partial<DailyMetrics> {
  if (!cycle.score) return existing
  const date = cycle.start.split('T')[0]
  const kcal = Math.round(cycle.score.kilojoule / 4.184)
  return {
    ...existing,
    userId: 'current',
    date,
    activeCalories: kcal,
  }
}

export function mapWorkoutsToMetrics(
  workouts: WhoopWorkout[],
  date: string,
  existing: Partial<DailyMetrics> = {}
): Partial<DailyMetrics> {
  const dayWorkouts = workouts.filter(w => w.start.startsWith(date))
  const totalKj = dayWorkouts.reduce((sum, w) => sum + (w.score?.kilojoule ?? 0), 0)
  return {
    ...existing,
    userId: 'current',
    date,
    activeCalories: (existing.activeCalories ?? 0) + Math.round(totalKj / 4.184),
  }
}

export function mapBodyMeasurement(measurement: WhoopBodyMeasurement): Partial<BodyMetricEntry> {
  return {
    id: generateId(),
    userId: 'current',
    date: new Date().toISOString().split('T')[0],
    weightKg: Math.round(measurement.weight_kilogram * 10) / 10,
  }
}

function scoreToQuality(pct: number): 1 | 2 | 3 | 4 | 5 {
  if (pct >= 85) return 5
  if (pct >= 70) return 4
  if (pct >= 50) return 3
  if (pct >= 30) return 2
  return 1
}

// Merge all Whoop data for a given date into one DailyMetrics object
export function mergeWhoopDay(
  date: string,
  recovery: WhoopRecovery | null,
  sleep: WhoopSleep | null,
  cycle: WhoopCycle | null,
  workouts: WhoopWorkout[],
): DailyMetrics {
  let metrics: Partial<DailyMetrics> = { userId: 'current', date }
  if (recovery) metrics = mapRecoveryToMetrics(recovery, metrics)
  if (sleep) metrics = mapSleepToMetrics(sleep, metrics)
  if (cycle) metrics = mapCycleToMetrics(cycle, metrics)
  metrics = mapWorkoutsToMetrics(workouts, date, metrics)
  return metrics as DailyMetrics
}
