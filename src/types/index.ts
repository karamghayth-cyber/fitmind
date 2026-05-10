export type UserRole = 'user' | 'trainer'
export type SubscriptionTier = 'free' | 'pro' | 'elite'
export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'improve_endurance' | 'general_health'
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active'
export type DietaryPreference = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'mediterranean'
export type HealthCondition = 'diabetes_type1' | 'diabetes_type2' | 'hypertension' | 'pcos' | 'hypothyroidism' | 'celiac' | 'ibs' | 'heart_disease' | 'none'
export type FoodAllergy = 'nuts' | 'dairy' | 'gluten' | 'eggs' | 'shellfish' | 'soy' | 'sesame' | 'none'
export type UAEGrocer = 'carrefour' | 'spinneys' | 'kibsons' | 'talabat' | 'union_coop' | 'lulu'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'suhoor' | 'iftar'
export type CuisineType = 'emirati' | 'arabic' | 'mediterranean' | 'indian' | 'asian' | 'western' | 'international'
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'abs' | 'full_body'
export type WorkoutType = 'strength' | 'cardio' | 'hiit' | 'yoga' | 'mobility' | 'sports'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type EquipmentType = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'resistance_band' | 'kettlebell'
export type BillingCycle = 'monthly' | 'annual'
export type ChatRole = 'user' | 'assistant' | 'system'
export type ChatContext = 'general' | 'nutrition' | 'workout' | 'progress' | 'ramadan'

export interface UserProfile {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  role: UserRole
  subscription: SubscriptionTier
  isOnboarded: boolean
  createdAt: string
  updatedAt: string
  locale: 'en' | 'ar'
  timezone: string
  ramadanModeEnabled: boolean
}

export interface HealthData {
  userId: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'prefer_not_to_say'
  heightCm: number
  weightKg: number
  bodyFatPercent?: number
  muscleMassKg?: number
  activityLevel: ActivityLevel
  goals: FitnessGoal[]
  targetWeightKg?: number
  allergies: FoodAllergy[]
  dietaryPreferences: DietaryPreference[]
  healthConditions: HealthCondition[]
  updatedAt: string
}

export interface Macros {
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  fiberG?: number
}

export interface Ingredient {
  id: string
  name: string
  nameAr?: string
  quantityG: number
  unit: string
  macros: Macros
  isHalal: boolean
  availableAt: UAEGrocer[]
  estimatedCostAED?: number
}

export interface Recipe {
  id: string
  name: string
  nameAr?: string
  description: string
  mealType: MealType
  cuisineType: CuisineType
  ingredients: Ingredient[]
  instructions: string[]
  prepTimeMins: number
  cookTimeMins: number
  servings: number
  macrosPerServing: Macros
  tags: string[]
  imageUrl?: string
  isHalal: boolean
  isAIGenerated: boolean
  createdAt: string
}

export interface Meal {
  id: string
  userId: string
  date: string
  mealType: MealType
  recipe?: Recipe
  customDescription?: string
  macros: Macros
  loggedAt: string
}

export interface DailyNutrition {
  userId: string
  date: string
  meals: Meal[]
  totalMacros: Macros
  targetMacros: Macros
  waterMl: number
  targetWaterMl: number
}

export interface MacroTargets {
  userId: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export interface Exercise {
  id: string
  name: string
  muscleGroups: MuscleGroup[]
  equipment: EquipmentType[]
  difficulty: DifficultyLevel
  instructions: string[]
  videoUrl?: string
  imageUrl?: string
  isCompound: boolean
}

export interface WorkoutSet {
  setNumber: number
  reps?: number
  weightKg?: number
  durationSecs?: number
  restSecs: number
  isCompleted: boolean
  actualReps?: number
  actualWeightKg?: number
}

export interface WorkoutExercise {
  exerciseId: string
  exercise: Exercise
  sets: WorkoutSet[]
  notes?: string
  orderIndex: number
}

export interface Workout {
  id: string
  name: string
  description?: string
  workoutType: WorkoutType
  muscleGroups: MuscleGroup[]
  difficulty: DifficultyLevel
  estimatedDurationMins: number
  exercises: WorkoutExercise[]
  isAIGenerated: boolean
  trainerId?: string
  tags: string[]
  createdAt: string
}

export interface WorkoutLog {
  id: string
  userId: string
  workoutId: string
  workout: Workout
  startedAt: string
  completedAt?: string
  durationMins?: number
  exercises: WorkoutExercise[]
  caloriesBurned?: number
  notes?: string
  rating?: 1 | 2 | 3 | 4 | 5
}

export interface BodyMetricEntry {
  id: string
  userId: string
  date: string
  weightKg?: number
  bodyFatPercent?: number
  muscleMassKg?: number
  bmi?: number
  waistCm?: number
  notes?: string
}

export interface DailyMetrics {
  userId: string
  date: string
  stepsCount?: number
  activeCalories?: number
  sleepHours?: number
  sleepQuality?: 1 | 2 | 3 | 4 | 5
  restingHeartRate?: number
  hrvMs?: number
  recoveryScore?: number
  hydrationMl?: number
  stressLevel?: 1 | 2 | 3 | 4 | 5
  // Whoop-specific
  whoopStrain?: number
  whoopSleepPerformance?: number
}

export interface ProgressPhoto {
  id: string
  userId: string
  date: string
  imageUrl: string
  angle: 'front' | 'side' | 'back'
  weightKg?: number
}

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  isStreaming?: boolean
  timestamp: string
  context?: ChatContext
}

export interface ChatSession {
  id: string
  userId: string
  title: string
  messages: ChatMessage[]
  context: ChatContext
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPlan {
  id: SubscriptionTier
  nameEn: string
  priceAEDMonthly: number
  priceAEDAnnual: number
  features: string[]
  aiCallsPerMonth: number | 'unlimited'
  maxSavedMealPlans: number | 'unlimited'
  trainerAccess: boolean
  prioritySupport: boolean
  badgeColor: string
  highlighted: boolean
}

export interface UserSubscription {
  userId: string
  plan: SubscriptionTier
  billingCycle: BillingCycle
  startDate: string
  endDate: string
  isActive: boolean
  autoRenew: boolean
}

export interface TrainerClient {
  clientId: string
  trainerId: string
  clientProfile: UserProfile
  clientHealth?: HealthData
  startDate: string
  isActive: boolean
  notes?: string
  lastActivity?: string
}
