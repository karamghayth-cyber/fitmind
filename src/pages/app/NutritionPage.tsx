import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Droplets, Plus, Sparkles } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, Button, HalalBadge } from '../../components/ui'
import { useNutritionStore } from '../../stores/nutritionStore'
import { UAE_GROCER_INFO } from '../../constants'
import type { UAEGrocer } from '../../types'
import { cn } from '../../utils'

const MEAL_EMOJIS: Record<string, string> = { breakfast: '🥣', lunch: '🍽️', dinner: '🌙', snack: '🍎', suhoor: '🌙', iftar: '🌅' }

export const NutritionPage: React.FC = () => {
  const navigate = useNavigate()
  const { todayNutrition, logWater } = useNutritionStore()
  const [activeTab, setActiveTab] = useState<'today' | 'plan' | 'recipes'>('today')

  const { totalMacros, targetMacros, waterMl, targetWaterMl } = todayNutrition
  const macroData = [
    { name: 'Protein', value: totalMacros.proteinG * 4, color: '#52a07c' },
    { name: 'Carbs', value: totalMacros.carbsG * 4, color: '#F59E0B' },
    { name: 'Fat', value: totalMacros.fatG * 9, color: '#EF4444' },
  ]
  const remainingCal = Math.max(targetMacros.calories - totalMacros.calories, 0)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white px-5 pt-8 pb-0 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Nutrition</h1>
          <div className="flex gap-1">
            {(['today', 'plan', 'recipes'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn('flex-1 py-3 text-sm font-semibold border-b-2 transition-all capitalize', activeTab === tab ? 'border-green-500 text-green-600' : 'border-transparent text-gray-400')}>
                {tab === 'plan' ? 'Meal Plan' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {activeTab === 'today' && (
          <>
            {/* Calorie donut */}
            <Card>
              <div className="flex items-center gap-4">
                <div style={{ width: 110, height: 110 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={macroData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} dataKey="value" strokeWidth={0}>
                        {macroData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: unknown) => `${Math.round((v as number) / 4)} g`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-extrabold text-gray-900">{totalMacros.calories.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">of {targetMacros.calories.toLocaleString()} kcal</p>
                  <p className="text-green-600 text-sm font-semibold mt-1">{remainingCal} kcal remaining</p>
                  <div className="flex gap-3 mt-2">
                    {macroData.map(m => (
                      <div key={m.name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="text-xs text-gray-500">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Macro bars */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-3">Macros</h3>
              <div className="space-y-3">
                {[
                  { label: 'Protein', current: totalMacros.proteinG, target: targetMacros.proteinG, color: '#52a07c' },
                  { label: 'Carbohydrates', current: totalMacros.carbsG, target: targetMacros.carbsG, color: '#F59E0B' },
                  { label: 'Fat', current: totalMacros.fatG, target: targetMacros.fatG, color: '#EF4444' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">{m.label}</span>
                      <span className="font-bold text-gray-900">{Math.round(m.current)}g <span className="text-gray-400 font-normal">/ {m.target}g</span></span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((m.current / m.target) * 100, 100)}%`, backgroundColor: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Water */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets size={18} className="text-blue-500" />
                  <span className="font-bold text-gray-900">Hydration</span>
                </div>
                <span className="text-sm font-bold text-blue-600">{(waterMl / 1000).toFixed(1)}L / {(targetWaterMl / 1000).toFixed(1)}L</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full bg-blue-400 transition-all duration-500" style={{ width: `${Math.min((waterMl / targetWaterMl) * 100, 100)}%` }} />
              </div>
              <div className="flex gap-2">
                {[150, 250, 500].map(ml => (
                  <button key={ml} onClick={() => logWater(ml)} className="flex-1 py-2.5 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors">
                    +{ml}ml
                  </button>
                ))}
              </div>
            </Card>

            {/* Today's meals */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Today's Meals</h3>
                <button onClick={() => navigate('/app/nutrition/recipes')} className="text-green-600 text-sm font-semibold flex items-center gap-1">
                  <Plus size={14} /> Add Meal
                </button>
              </div>
              <div className="space-y-3">
                {todayNutrition.meals.map(meal => (
                  <Card key={meal.id} padding={false} className="overflow-hidden">
                    <div className="flex">
                      {meal.recipe?.imageUrl && (
                        <img src={meal.recipe.imageUrl} alt={meal.recipe.name} className="w-20 h-20 object-cover flex-shrink-0" />
                      )}
                      {!meal.recipe?.imageUrl && (
                        <div className="w-20 h-20 bg-green-50 flex items-center justify-center flex-shrink-0 text-3xl">
                          {MEAL_EMOJIS[meal.mealType] || '🍽️'}
                        </div>
                      )}
                      <div className="p-3 flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{meal.recipe?.name || meal.customDescription}</p>
                        <p className="text-xs text-gray-400 capitalize mb-1">{meal.mealType}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-green-600">{meal.macros.calories} kcal</span>
                          <span className="text-xs text-gray-400">P: {Math.round(meal.macros.proteinG)}g</span>
                          <span className="text-xs text-gray-400">C: {Math.round(meal.macros.carbsG)}g</span>
                          <span className="text-xs text-gray-400">F: {Math.round(meal.macros.fatG)}g</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {todayNutrition.meals.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-4xl mb-2">🍽️</p>
                    <p>No meals logged yet today</p>
                    <Button variant="primary" size="sm" className="mt-3" onClick={() => navigate('/app/nutrition/recipes')}>Browse Recipes</Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'plan' && <MealPlanTab />}
        {activeTab === 'recipes' && <RecipesTab navigate={navigate} />}
      </div>
    </div>
  )
}

const MealPlanTab: React.FC = () => {
  const { isGeneratingPlan, setGenerating } = useNutritionStore()
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const SAMPLE_PLAN: Record<string, string[]> = {
    Monday: ['🥣 Overnight Oats', '🐟 Grilled Hammour + Quinoa', '🍲 Chicken Kabsa'],
    Tuesday: ['🥚 Egg White Omelette', '🫔 Chicken Wrap', '🍜 Lentil Soup + Bread'],
    Wednesday: ['🥛 Greek Yogurt Bowl', '🥗 Mediterranean Grain Bowl', '🍗 Grilled Chicken + Veg'],
    Thursday: ['🫐 Protein Smoothie', '🍱 Tuna Salad', '🍛 Prawn Biryani'],
    Friday: ['🥞 Protein Pancakes', '🥙 Falafel Wrap', '🥩 Grilled Kofta + Salad'],
    Saturday: ['🫘 Full Emirati Breakfast', '🍔 Chicken Burger (healthy)', '🐠 Baked Salmon'],
    Sunday: ['🧆 Labneh Toast', '🥗 Quinoa Salad', '🍲 Vegetable Tagine'],
  }
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="flex items-center gap-3">
          <Sparkles size={24} />
          <div className="flex-1">
            <p className="font-bold">AI Meal Plan Generator</p>
            <p className="text-green-100 text-xs">Personalised to your goals, allergies, and UAE taste</p>
          </div>
          <Button variant="secondary" size="sm" className="bg-white text-green-600 hover:bg-green-50 flex-shrink-0" loading={isGeneratingPlan} onClick={() => setGenerating(true)}>
            Generate
          </Button>
        </div>
      </Card>
      <div className="space-y-3">
        {DAYS.map(day => (
          <Card key={day}>
            <p className="font-bold text-gray-900 mb-2">{day}</p>
            <div className="space-y-1">
              {SAMPLE_PLAN[day].map((meal, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{meal}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const RecipesTab: React.FC<{ navigate: ReturnType<typeof useNavigate> }> = ({ navigate }) => {
  const { recipes } = useNutritionStore()
  const [filter, setFilter] = useState('all')
  const FILTERS = ['all', 'breakfast', 'lunch', 'dinner', 'snack']
  const filtered = filter === 'all' ? recipes : recipes.filter(r => r.mealType === filter)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize', filter === f ? 'bg-green-500 text-white' : 'bg-white text-gray-500 border border-gray-200')}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(recipe => (
          <Card key={recipe.id} padding={false} className="overflow-hidden" onClick={() => navigate(`/app/nutrition/recipes/${recipe.id}`)}>
            <div className="flex">
              {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.name} className="w-24 h-24 object-cover flex-shrink-0" />}
              <div className="p-4 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-bold text-gray-900 text-sm leading-tight">{recipe.name}</p>
                  {recipe.isHalal && <HalalBadge />}
                </div>
                {recipe.nameAr && <p className="text-xs text-gray-400 mb-1" dir="rtl">{recipe.nameAr}</p>}
                <p className="text-xs text-gray-500 mb-2 line-clamp-1">{recipe.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-green-600">{recipe.macrosPerServing.calories} kcal</span>
                  <span className="text-xs text-gray-400">P: {recipe.macrosPerServing.proteinG}g</span>
                  <span className="text-xs text-gray-400">⏱ {recipe.prepTimeMins + recipe.cookTimeMins}min</span>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {recipe.ingredients.flatMap(i => i.availableAt).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3).map(store => (
                    <span key={store} className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-semibold" style={{ backgroundColor: UAE_GROCER_INFO[store as UAEGrocer]?.color || '#6B7280' }}>
                      {UAE_GROCER_INFO[store as UAEGrocer]?.name || store}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
