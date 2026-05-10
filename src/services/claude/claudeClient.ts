import Anthropic from '@anthropic-ai/sdk'
import { CLAUDE_MODEL } from '../../constants'
import type { UserProfile, HealthData, DailyNutrition, ChatMessage } from '../../types'

const getClient = () => new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
  dangerouslyAllowBrowser: true,
})

function buildSystemPrompt(profile: UserProfile | null, health: HealthData | null, nutrition: DailyNutrition | null): string {
  const allergies = health?.allergies?.filter(a => a !== 'none').join(', ') || 'none'
  const conditions = health?.healthConditions?.filter(c => c !== 'none').join(', ') || 'none'
  const goals = health?.goals?.join(', ') || 'general health'

  return `You are FitMind, an expert AI dietitian and fitness coach specialised for the UAE market.

USER CONTEXT:
- Name: ${profile?.displayName || 'User'}
- Goals: ${goals}
- Allergies: ${allergies}
- Health conditions: ${conditions}
- Dietary preference: ${health?.dietaryPreferences?.join(', ') || 'omnivore'}
- Activity level: ${health?.activityLevel || 'moderately_active'}
- Current weight: ${health?.weightKg || '?'}kg | Height: ${health?.heightCm || '?'}cm
- Today's calories logged: ${nutrition?.totalMacros.calories || 0} / ${nutrition?.targetMacros.calories || 2000} kcal
- Today's water: ${nutrition?.waterMl || 0}ml / ${nutrition?.targetWaterMl || 3000}ml

GUIDELINES:
- Always recommend halal food options
- Reference UAE grocery stores (Carrefour, Spinneys, Kibsons, Talabat) when suggesting ingredients
- Use AED for any pricing
- Be warm, encouraging, and culturally sensitive to UAE/Gulf norms
- For Ramadan queries, adjust meal timing to Suhoor/Iftar windows
- NEVER diagnose medical conditions — always recommend consulting a healthcare professional for medical matters
- Keep answers concise and actionable
- When suggesting workouts, consider UAE's hot climate (indoor alternatives in summer)
- Understand local cuisine: kabsa, hammour, luqaimat, harees, etc.`
}

export async function sendChatMessage(
  messages: ChatMessage[],
  profile: UserProfile | null,
  health: HealthData | null,
  nutrition: DailyNutrition | null,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (err: string) => void,
): Promise<void> {
  const client = getClient()
  const systemPrompt = buildSystemPrompt(profile, health, nutrition)

  const apiMessages = messages.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  })).filter(m => m.role === 'user' || m.role === 'assistant')

  try {
    const stream = await client.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: apiMessages,
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        onChunk(chunk.delta.text)
      }
    }
    onComplete()
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to connect to AI'
    onError(msg)
  }
}

export async function generateMealPlan(
  health: HealthData,
  profile: UserProfile,
  isRamadan: boolean,
): Promise<string> {
  const client = getClient()
  const prompt = `Generate a detailed 7-day meal plan for ${profile.displayName} with these requirements:
- Goals: ${health.goals.join(', ')}
- Calories target: ~${health.weightKg * 28}kcal/day
- Dietary preference: ${health.dietaryPreferences.join(', ')}
- Allergies: ${health.allergies.filter(a => a !== 'none').join(', ') || 'none'}
- Health conditions: ${health.healthConditions.filter(c => c !== 'none').join(', ') || 'none'}
- Ramadan plan: ${isRamadan}
- UAE market: use ingredients available at Carrefour, Spinneys, Kibsons
- All meals must be halal
- Include Arabic cuisine variety (kabsa, machboos, harees, etc.)
- Format as structured day-by-day plan with macros for each meal`

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

export async function generateWorkoutPlan(health: HealthData, profile: UserProfile): Promise<string> {
  const client = getClient()
  const prompt = `Create a personalised weekly workout plan for ${profile.displayName}:
- Fitness goals: ${health.goals.join(', ')}
- Activity level: ${health.activityLevel}
- Health conditions: ${health.healthConditions.filter(c => c !== 'none').join(', ') || 'none'}
- Equipment: gym available
- UAE climate consideration: prefer indoor workouts during summer (June-September)
- Format: day-by-day with exercises, sets, reps, rest periods
- Include warm-up and cool-down for each session`

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

export async function analyzeProgress(data: {
  weightHistory: number[]
  avgCalories: number
  workoutsCompleted: number
  avgSleep: number
}): Promise<string> {
  const client = getClient()
  const prompt = `Analyze this user's 30-day health progress and provide insights:
- Weight trend: ${data.weightHistory.join(', ')} kg
- Average daily calories: ${data.avgCalories}kcal
- Workouts completed: ${data.workoutsCompleted}
- Average sleep: ${data.avgSleep} hours
Provide 3-4 specific, actionable insights and recommendations. Keep it encouraging and data-driven.`

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}
