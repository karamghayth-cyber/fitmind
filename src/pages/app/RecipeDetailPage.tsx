import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Users, CheckCircle, ShoppingCart } from 'lucide-react'
import { Button, Badge, HalalBadge } from '../../components/ui'
import { useNutritionStore } from '../../stores/nutritionStore'
import { UAE_GROCER_INFO } from '../../constants'
import type { UAEGrocer } from '../../types'

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, logMeal } = useNutritionStore()
  const recipe = recipes.find(r => r.id === id)

  if (!recipe) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center"><p className="text-gray-400">Recipe not found</p><Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button></div>
    </div>
  )

  const handleLogMeal = () => {
    logMeal({ userId: 'current', date: new Date().toISOString().split('T')[0], mealType: recipe.mealType, recipe, macros: recipe.macrosPerServing })
    navigate('/app/nutrition')
  }

  const storeSet = [...new Set(recipe.ingredients.flatMap(i => i.availableAt))] as UAEGrocer[]

  return (
    <div className="bg-white min-h-screen">
      {/* Header image */}
      <div className="relative">
        {recipe.imageUrl
          ? <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-56 object-cover" />
          : <div className="w-full h-56 bg-green-100 flex items-center justify-center text-8xl">🍽️</div>
        }
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="px-5 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Title */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight flex-1">{recipe.name}</h1>
            {recipe.isHalal && <HalalBadge />}
          </div>
          {recipe.nameAr && <p className="text-gray-500 text-sm" dir="rtl">{recipe.nameAr}</p>}
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">{recipe.description}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {recipe.tags.map(tag => <Badge key={tag} color="#52a07c" className="text-xs">{tag}</Badge>)}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <Clock size={16} className="text-gray-400 mx-auto mb-1" />
            <p className="text-sm font-bold text-gray-900">{recipe.prepTimeMins + recipe.cookTimeMins}min</p>
            <p className="text-xs text-gray-400">Total time</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <Users size={16} className="text-gray-400 mx-auto mb-1" />
            <p className="text-sm font-bold text-gray-900">{recipe.servings}</p>
            <p className="text-xs text-gray-400">Servings</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-3 text-center">
            <p className="text-lg font-extrabold text-green-600">{recipe.macrosPerServing.calories}</p>
            <p className="text-xs text-gray-400">kcal/serving</p>
          </div>
        </div>

        {/* Macros */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-bold text-gray-900 mb-3">Nutrition per serving</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Calories', value: recipe.macrosPerServing.calories, unit: 'kcal', color: '#52a07c' },
              { label: 'Protein', value: recipe.macrosPerServing.proteinG, unit: 'g', color: '#52a07c' },
              { label: 'Carbs', value: recipe.macrosPerServing.carbsG, unit: 'g', color: '#F59E0B' },
              { label: 'Fat', value: recipe.macrosPerServing.fatG, unit: 'g', color: '#EF4444' },
            ].map(m => (
              <div key={m.label} className="text-center">
                <p className="text-lg font-extrabold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-xs text-gray-400">{m.unit}</p>
                <p className="text-xs text-gray-500">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Ingredients</h3>
          <div className="space-y-2">
            {recipe.ingredients.map(ing => (
              <div key={ing.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{ing.name}</span>
                    {ing.nameAr && <span className="text-xs text-gray-400" dir="rtl">{ing.nameAr}</span>}
                  </div>
                  <p className="text-xs text-gray-400">{ing.quantityG}{ing.unit}</p>
                </div>
                {ing.estimatedCostAED && <span className="text-xs font-semibold text-green-600">AED {ing.estimatedCostAED}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Where to buy in UAE */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart size={18} className="text-gray-600" />
            <h3 className="font-bold text-gray-900">Where to buy in UAE</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {storeSet.map(store => {
              const info = UAE_GROCER_INFO[store]
              return (
                <a key={store} href={info.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: info.color }}>
                  🛒 {info.name}
                </a>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2">Estimated total cost: AED {recipe.ingredients.reduce((sum, i) => sum + (i.estimatedCostAED || 0), 0)}</p>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Instructions</h3>
          <div className="space-y-3">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-green-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-8">
          <Button fullWidth size="lg" onClick={handleLogMeal}>Log this meal → +{recipe.macrosPerServing.calories} kcal</Button>
        </div>
      </div>
    </div>
  )
}
