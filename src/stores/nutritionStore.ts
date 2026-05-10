import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DailyNutrition, Meal, MacroTargets, Recipe } from '../types'
import { generateId, today } from '../utils'

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'High-Protein Overnight Oats',
    nameAr: 'شوفان بالليل عالي البروتين',
    description: 'Creamy overnight oats with Greek yogurt, perfect for a quick UAE morning.',
    mealType: 'breakfast',
    cuisineType: 'western',
    ingredients: [
      { id: 'i1', name: 'Rolled Oats', quantityG: 80, unit: 'g', macros: { calories: 303, proteinG: 11, carbsG: 54, fatG: 5 }, isHalal: true, availableAt: ['carrefour', 'spinneys', 'lulu'], estimatedCostAED: 3 },
      { id: 'i2', name: 'Greek Yogurt', quantityG: 150, unit: 'g', macros: { calories: 100, proteinG: 17, carbsG: 6, fatG: 0.7 }, isHalal: true, availableAt: ['carrefour', 'spinneys', 'kibsons'], estimatedCostAED: 8 },
      { id: 'i3', name: 'Banana', quantityG: 120, unit: '1 medium', macros: { calories: 107, proteinG: 1, carbsG: 27, fatG: 0.4 }, isHalal: true, availableAt: ['carrefour', 'lulu', 'kibsons'], estimatedCostAED: 2 },
      { id: 'i4', name: 'Honey', quantityG: 15, unit: '1 tbsp', macros: { calories: 46, proteinG: 0, carbsG: 12, fatG: 0 }, isHalal: true, availableAt: ['carrefour', 'spinneys', 'union_coop'], estimatedCostAED: 4 },
    ],
    instructions: ['Mix oats and yogurt in a jar', 'Add honey and mix well', 'Top with sliced banana', 'Refrigerate overnight', 'Enjoy cold in the morning'],
    prepTimeMins: 5,
    cookTimeMins: 0,
    servings: 1,
    macrosPerServing: { calories: 556, proteinG: 29, carbsG: 99, fatG: 6 },
    tags: ['high-protein', 'quick', 'meal-prep'],
    imageUrl: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&q=80',
    isHalal: true,
    isAIGenerated: false,
    createdAt: today(),
  },
  {
    id: 'r2',
    name: 'Grilled Hammour with Quinoa',
    nameAr: 'الحمور المشوي مع الكينوا',
    description: 'UAE-favorite Hammour fish grilled with herbs, served with fluffy quinoa.',
    mealType: 'lunch',
    cuisineType: 'emirati',
    ingredients: [
      { id: 'i5', name: 'Hammour Fillet', quantityG: 200, unit: 'g', macros: { calories: 188, proteinG: 42, carbsG: 0, fatG: 2 }, isHalal: true, availableAt: ['carrefour', 'spinneys', 'lulu'], estimatedCostAED: 35 },
      { id: 'i6', name: 'Quinoa', quantityG: 85, unit: 'g dry', macros: { calories: 313, proteinG: 12, carbsG: 55, fatG: 5 }, isHalal: true, availableAt: ['spinneys', 'kibsons', 'carrefour'], estimatedCostAED: 12 },
      { id: 'i7', name: 'Olive Oil', quantityG: 15, unit: '1 tbsp', macros: { calories: 119, proteinG: 0, carbsG: 0, fatG: 14 }, isHalal: true, availableAt: ['carrefour', 'spinneys', 'lulu'], estimatedCostAED: 5 },
      { id: 'i8', name: 'Lemon', quantityG: 50, unit: '½ lemon', macros: { calories: 15, proteinG: 0, carbsG: 5, fatG: 0 }, isHalal: true, availableAt: ['carrefour', 'lulu', 'kibsons'], estimatedCostAED: 1 },
    ],
    instructions: ['Season hammour with herbs, salt, and olive oil', 'Grill on high heat 4-5 min each side', 'Cook quinoa as per packet instructions', 'Serve fish on quinoa bed with lemon wedge'],
    prepTimeMins: 10,
    cookTimeMins: 20,
    servings: 1,
    macrosPerServing: { calories: 635, proteinG: 54, carbsG: 60, fatG: 21 },
    tags: ['high-protein', 'emirati', 'seafood', 'halal'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
    isHalal: true,
    isAIGenerated: false,
    createdAt: today(),
  },
  {
    id: 'r3',
    name: 'Arabic Lentil Soup',
    nameAr: 'شوربة العدس العربية',
    description: 'Warm, hearty lentil soup spiced with cumin and turmeric — a Ramadan staple.',
    mealType: 'dinner',
    cuisineType: 'arabic',
    ingredients: [
      { id: 'i9', name: 'Red Lentils', quantityG: 100, unit: 'g', macros: { calories: 353, proteinG: 24, carbsG: 60, fatG: 1 }, isHalal: true, availableAt: ['carrefour', 'lulu', 'union_coop'], estimatedCostAED: 5 },
      { id: 'i10', name: 'Onion', quantityG: 80, unit: '1 medium', macros: { calories: 32, proteinG: 1, carbsG: 7, fatG: 0 }, isHalal: true, availableAt: ['carrefour', 'lulu', 'kibsons'], estimatedCostAED: 1 },
      { id: 'i11', name: 'Cumin', quantityG: 5, unit: '1 tsp', macros: { calories: 16, proteinG: 1, carbsG: 2, fatG: 1 }, isHalal: true, availableAt: ['carrefour', 'spinneys', 'union_coop'], estimatedCostAED: 3 },
    ],
    instructions: ['Sauté onion in olive oil until golden', 'Add lentils and cumin, stir 2 min', 'Add 4 cups water, simmer 20 minutes', 'Blend until smooth, season with salt and lemon'],
    prepTimeMins: 5,
    cookTimeMins: 25,
    servings: 2,
    macrosPerServing: { calories: 200, proteinG: 13, carbsG: 35, fatG: 1 },
    tags: ['vegan', 'ramadan-friendly', 'high-fiber', 'iftar'],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
    isHalal: true,
    isAIGenerated: false,
    createdAt: today(),
  },
  {
    id: 'r4',
    name: 'Chicken Kabsa',
    nameAr: 'كبسة دجاج',
    description: 'Fragrant spiced rice with tender chicken — the Gulf region\'s most beloved dish.',
    mealType: 'lunch',
    cuisineType: 'arabic',
    ingredients: [
      { id: 'i12', name: 'Chicken Breast', quantityG: 200, unit: 'g', macros: { calories: 220, proteinG: 46, carbsG: 0, fatG: 3 }, isHalal: true, availableAt: ['carrefour', 'lulu', 'union_coop'], estimatedCostAED: 20 },
      { id: 'i13', name: 'Basmati Rice', quantityG: 100, unit: 'g dry', macros: { calories: 350, proteinG: 7, carbsG: 77, fatG: 1 }, isHalal: true, availableAt: ['carrefour', 'lulu', 'union_coop'], estimatedCostAED: 4 },
      { id: 'i14', name: 'Tomatoes', quantityG: 150, unit: '2 medium', macros: { calories: 27, proteinG: 1, carbsG: 6, fatG: 0 }, isHalal: true, availableAt: ['carrefour', 'lulu', 'kibsons'], estimatedCostAED: 3 },
    ],
    instructions: ['Brown chicken with kabsa spice mix', 'Add tomatoes and sauté 5 min', 'Add rice and 2 cups water', 'Cover and cook 20 min on low heat', 'Garnish with raisins and almonds'],
    prepTimeMins: 15,
    cookTimeMins: 35,
    servings: 2,
    macrosPerServing: { calories: 399, proteinG: 27, carbsG: 42, fatG: 2 },
    tags: ['emirati', 'halal', 'meal-prep', 'high-protein'],
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
    isHalal: true,
    isAIGenerated: false,
    createdAt: today(),
  },
  {
    id: 'r5',
    name: 'Date & Almond Energy Balls',
    nameAr: 'كرات التمر واللوز',
    description: 'Natural energy bites using UAE Medjool dates — perfect pre-workout snack.',
    mealType: 'snack',
    cuisineType: 'emirati',
    ingredients: [
      { id: 'i15', name: 'Medjool Dates', quantityG: 100, unit: '5-6 dates', macros: { calories: 277, proteinG: 2, carbsG: 75, fatG: 0 }, isHalal: true, availableAt: ['carrefour', 'lulu', 'kibsons', 'union_coop'], estimatedCostAED: 15 },
      { id: 'i16', name: 'Almonds', quantityG: 50, unit: '½ cup', macros: { calories: 290, proteinG: 11, carbsG: 11, fatG: 25 }, isHalal: true, availableAt: ['carrefour', 'spinneys', 'lulu'], estimatedCostAED: 12 },
      { id: 'i17', name: 'Coconut Shreds', quantityG: 20, unit: '¼ cup', macros: { calories: 71, proteinG: 1, carbsG: 3, fatG: 7 }, isHalal: true, availableAt: ['spinneys', 'kibsons', 'carrefour'], estimatedCostAED: 5 },
    ],
    instructions: ['Blend dates and almonds in food processor', 'Roll into golf ball-sized portions', 'Coat in coconut shreds', 'Refrigerate for 30 minutes'],
    prepTimeMins: 10,
    cookTimeMins: 0,
    servings: 8,
    macrosPerServing: { calories: 80, proteinG: 2, carbsG: 11, fatG: 4 },
    tags: ['snack', 'pre-workout', 'dates', 'emirati', 'no-cook'],
    imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80',
    isHalal: true,
    isAIGenerated: false,
    createdAt: today(),
  },
  {
    id: 'r6',
    name: 'Mediterranean Grain Bowl',
    nameAr: 'وعاء الحبوب المتوسطية',
    description: 'Falafel and hummus grain bowl — filling, nutritious, fully plant-based.',
    mealType: 'lunch',
    cuisineType: 'mediterranean',
    ingredients: [
      { id: 'i18', name: 'Falafel (4 pieces)', quantityG: 120, unit: '4 pieces', macros: { calories: 333, proteinG: 13, carbsG: 31, fatG: 18 }, isHalal: true, availableAt: ['carrefour', 'spinneys', 'talabat'], estimatedCostAED: 12 },
      { id: 'i19', name: 'Hummus', quantityG: 80, unit: '⅓ cup', macros: { calories: 188, proteinG: 8, carbsG: 20, fatG: 9 }, isHalal: true, availableAt: ['carrefour', 'spinneys', 'lulu'], estimatedCostAED: 8 },
      { id: 'i20', name: 'Bulgur Wheat', quantityG: 80, unit: 'g dry', macros: { calories: 283, proteinG: 10, carbsG: 63, fatG: 1 }, isHalal: true, availableAt: ['carrefour', 'spinneys', 'union_coop'], estimatedCostAED: 4 },
    ],
    instructions: ['Cook bulgur per package instructions', 'Arrange in bowl with falafel', 'Add hummus and fresh vegetables', 'Drizzle with lemon-tahini dressing'],
    prepTimeMins: 10,
    cookTimeMins: 15,
    servings: 1,
    macrosPerServing: { calories: 804, proteinG: 31, carbsG: 114, fatG: 28 },
    tags: ['vegetarian', 'mediterranean', 'high-fiber'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    isHalal: true,
    isAIGenerated: false,
    createdAt: today(),
  },
]

function seedTodayNutrition(): DailyNutrition {
  return {
    userId: 'current',
    date: today(),
    meals: [
      {
        id: generateId(), userId: 'current', date: today(), mealType: 'breakfast',
        recipe: SAMPLE_RECIPES[0],
        macros: SAMPLE_RECIPES[0].macrosPerServing,
        loggedAt: new Date().toISOString(),
      },
    ],
    totalMacros: { calories: 556, proteinG: 29, carbsG: 99, fatG: 6 },
    targetMacros: { calories: 2200, proteinG: 165, carbsG: 220, fatG: 73 },
    waterMl: 1200,
    targetWaterMl: 3000,
  }
}

interface NutritionState {
  todayNutrition: DailyNutrition
  recipes: Recipe[]
  macroTargets: MacroTargets | null
  isGeneratingPlan: boolean

  logMeal: (meal: Omit<Meal, 'id' | 'loggedAt'>) => void
  logWater: (ml: number) => void
  setMacroTargets: (t: MacroTargets) => void
  setGenerating: (v: boolean) => void
  getAllRecipes: () => Recipe[]
  addRecipe: (r: Recipe) => void
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      todayNutrition: seedTodayNutrition(),
      recipes: SAMPLE_RECIPES,
      macroTargets: { userId: 'current', calories: 2200, proteinG: 165, carbsG: 220, fatG: 73 },
      isGeneratingPlan: false,

      logMeal: (meal) => {
        const newMeal: Meal = { ...meal, id: generateId(), loggedAt: new Date().toISOString() }
        set(s => {
          const meals = [...s.todayNutrition.meals, newMeal]
          const total = meals.reduce((acc, m) => ({
            calories: acc.calories + m.macros.calories,
            proteinG: acc.proteinG + m.macros.proteinG,
            carbsG: acc.carbsG + m.macros.carbsG,
            fatG: acc.fatG + m.macros.fatG,
          }), { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 })
          return { todayNutrition: { ...s.todayNutrition, meals, totalMacros: total } }
        })
      },

      logWater: (ml) => set(s => ({
        todayNutrition: { ...s.todayNutrition, waterMl: Math.min(s.todayNutrition.waterMl + ml, s.todayNutrition.targetWaterMl) }
      })),

      setMacroTargets: (t) => set({ macroTargets: t }),

      setGenerating: (v) => set({ isGeneratingPlan: v }),

      getAllRecipes: () => get().recipes,

      addRecipe: (r) => set(s => ({ recipes: [r, ...s.recipes] })),
    }),
    { name: 'fitmind-nutrition' }
  )
)
