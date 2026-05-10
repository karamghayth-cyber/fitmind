import type { SubscriptionPlan, UAEGrocer } from '../types'

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    nameEn: 'Starter',
    priceAEDMonthly: 0,
    priceAEDAnnual: 0,
    features: [
      '10 AI chat messages/month',
      '1 saved meal plan',
      '20 recipes access',
      'Basic progress tracking',
      '5 progress photos',
      'Basic dashboard',
    ],
    aiCallsPerMonth: 10,
    maxSavedMealPlans: 1,
    trainerAccess: false,
    prioritySupport: false,
    badgeColor: '#6B7280',
    highlighted: false,
  },
  {
    id: 'pro',
    nameEn: 'Pro',
    priceAEDMonthly: 49,
    priceAEDAnnual: 499,
    features: [
      '100 AI chat messages/month',
      '10 saved meal plans',
      'Full recipe library',
      'AI meal plan generation (weekly)',
      'AI workout generation',
      'Unlimited progress photos',
      'Ramadan meal planning',
      'UAE ingredient sourcing',
      'Macro tracking & insights',
    ],
    aiCallsPerMonth: 100,
    maxSavedMealPlans: 10,
    trainerAccess: false,
    prioritySupport: false,
    badgeColor: '#52a07c',
    highlighted: true,
  },
  {
    id: 'elite',
    nameEn: 'Elite',
    priceAEDMonthly: 99,
    priceAEDAnnual: 999,
    features: [
      'Unlimited AI chat',
      'Unlimited meal plans',
      'AI daily meal plan generation',
      'Trainer connection & coaching',
      'AI progress analysis & insights',
      'Custom recipe creation',
      'Priority support',
      'Advanced body composition tracking',
      'Personalised supplement guidance',
    ],
    aiCallsPerMonth: 'unlimited',
    maxSavedMealPlans: 'unlimited',
    trainerAccess: true,
    prioritySupport: true,
    badgeColor: '#F59E0B',
    highlighted: false,
  },
]

export const UAE_GROCER_INFO: Record<UAEGrocer, { name: string; color: string; url: string }> = {
  carrefour: { name: 'Carrefour', color: '#0057A8', url: 'https://www.carrefouruae.com' },
  spinneys: { name: 'Spinneys', color: '#E31837', url: 'https://www.spinneys.com' },
  kibsons: { name: 'Kibsons', color: '#78B043', url: 'https://www.kibsons.com' },
  talabat: { name: 'Talabat', color: '#FF6B00', url: 'https://www.talabat.com' },
  union_coop: { name: 'Union Coop', color: '#009933', url: 'https://www.unioncoop.ae' },
  lulu: { name: 'Lulu', color: '#E4001B', url: 'https://www.luluhypermarket.com' },
}

export const RAMADAN_DATES: Array<{ year: number; start: string; end: string }> = [
  { year: 2025, start: '2025-03-01', end: '2025-03-30' },
  { year: 2026, start: '2026-02-18', end: '2026-03-19' },
  { year: 2027, start: '2027-02-08', end: '2027-03-09' },
  { year: 2028, start: '2028-01-28', end: '2028-02-26' },
]

export const FITNESS_GOAL_LABELS: Record<string, string> = {
  weight_loss: 'Lose Weight',
  muscle_gain: 'Build Muscle',
  maintenance: 'Maintain Weight',
  improve_endurance: 'Improve Endurance',
  general_health: 'General Health',
}

export const ACTIVITY_LEVEL_LABELS: Record<string, string> = {
  sedentary: 'Sedentary (desk job, little exercise)',
  lightly_active: 'Lightly Active (1-3 days/week)',
  moderately_active: 'Moderately Active (3-5 days/week)',
  very_active: 'Very Active (6-7 days/week)',
  extra_active: 'Extra Active (athlete/manual labor)',
}

export const CLAUDE_MODEL = 'claude-sonnet-4-6'

export const QUICK_CHAT_PROMPTS = [
  'Plan my meals for this week',
  'Suggest a high-protein breakfast',
  'Create a leg day workout',
  'How many calories should I eat?',
  'Plan my Ramadan meals',
  'What are the best protein sources in UAE?',
  'Help me break a weight loss plateau',
  'Suggest a 30-minute home workout',
]
