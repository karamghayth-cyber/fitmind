import { RAMADAN_DATES } from '../constants'
import type { HealthData, Macros } from '../types'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatAED(amount: number): string {
  return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function isRamadan(date = new Date()): boolean {
  const dateStr = date.toISOString().split('T')[0]
  return RAMADAN_DATES.some(r => dateStr >= r.start && dateStr <= r.end)
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export function calculateTDEE(health: HealthData): number {
  const age = new Date().getFullYear() - new Date(health.dateOfBirth).getFullYear()
  let bmr: number
  if (health.gender === 'male') {
    bmr = 10 * health.weightKg + 6.25 * health.heightCm - 5 * age + 5
  } else {
    bmr = 10 * health.weightKg + 6.25 * health.heightCm - 5 * age - 161
  }
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  }
  return Math.round(bmr * (multipliers[health.activityLevel] || 1.55))
}

export function calculateMacroTargets(tdee: number, goals: string[]): Omit<Macros, 'fiberG'> {
  let calories = tdee
  if (goals.includes('weight_loss')) calories = tdee - 500
  if (goals.includes('muscle_gain')) calories = tdee + 300

  const proteinG = Math.round(calories * 0.3 / 4)
  const fatG = Math.round(calories * 0.25 / 9)
  const carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4)

  return { calories, proteinG, carbsG, fatG }
}

export function getRecoveryColor(score: number): string {
  if (score >= 67) return '#52a07c'
  if (score >= 34) return '#F59E0B'
  return '#EF4444'
}

export function getRecoveryLabel(score: number): string {
  if (score >= 67) return 'Peak'
  if (score >= 34) return 'Moderate'
  return 'Low'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
