import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Droplets, Footprints, Moon, Flame, ChevronRight, Plus, Zap, RefreshCw } from 'lucide-react'
import { ProgressRing, Card, Modal, Button, Badge } from '../../components/ui'
import { useUserStore } from '../../stores/userStore'
import { useProgressStore } from '../../stores/progressStore'
import { useNutritionStore } from '../../stores/nutritionStore'
import { useWorkoutStore } from '../../stores/workoutStore'
import { useWhoopStore } from '../../stores/whoopStore'
import { getGreeting, getRecoveryLabel, cn } from '../../utils'

const MacroBar: React.FC<{ label: string; current: number; target: number; color: string }> = ({ label, current, target, color }) => {
  const pct = Math.min((current / target) * 100, 100)
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="font-semibold text-gray-700">{Math.round(current)}g <span className="text-gray-400">/ {target}g</span></span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { profile } = useUserStore()
  const { getTodayMetrics, logDailyMetric } = useProgressStore()
  const { todayNutrition, logWater } = useNutritionStore()
  const { getTodayWorkout } = useWorkoutStore()
  const [logModal, setLogModal] = useState(false)
  const [waterInput, setWaterInput] = useState(250)

  const metrics = getTodayMetrics()
  const todayWorkout = getTodayWorkout()
  const { isConnected: whoopConnected, isSyncing: whoopSyncing, sync: whoopSync, getTodayMetrics: getWhoopMetrics } = useWhoopStore()
  const whoopMetrics = whoopConnected ? getWhoopMetrics() : null

  // Whoop data takes priority over manual local metrics
  const recovery = whoopMetrics?.recoveryScore ?? metrics?.recoveryScore ?? 72
  const steps = metrics?.stepsCount ?? 7432
  const sleep = whoopMetrics?.sleepHours ?? metrics?.sleepHours ?? 7.2
  const hrv = whoopMetrics?.hrvMs
  const rhr = whoopMetrics?.restingHeartRate

  const caloriesEaten = todayNutrition.totalMacros.calories
  const caloriesTarget = todayNutrition.targetMacros.calories
  const waterMl = todayNutrition.waterMl
  const waterTarget = todayNutrition.targetWaterMl

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">{getGreeting()},</p>
              <h1 className="text-2xl font-extrabold text-gray-900">{profile?.displayName || 'Friend'} 👋</h1>
              <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('en-AE', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            {whoopConnected ? (
              <button onClick={() => whoopSync()} disabled={whoopSyncing} className="flex items-center gap-1.5 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-900 transition-colors disabled:opacity-60">
                <span className="font-black">W</span>
                <RefreshCw size={11} className={cn(whoopSyncing && 'animate-spin')} />
              </button>
            ) : (
              <button onClick={() => navigate('/app/whoop')} className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                <span className="font-black text-black">W</span> Connect
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* Recovery Ring — Hero Card */}
        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
          <div className="flex items-center gap-6">
            <ProgressRing value={recovery} size={100} strokeWidth={8} color="white">
              <div className="text-center">
                <p className="text-2xl font-extrabold">{recovery}</p>
                <p className="text-[10px] text-green-100 uppercase tracking-wide">Score</p>
              </div>
            </ProgressRing>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} fill="white" className="text-white" />
                <span className="text-white/80 text-sm uppercase tracking-wide font-semibold">Recovery</span>
              </div>
              <p className="text-3xl font-extrabold">{getRecoveryLabel(recovery)}</p>
              <p className="text-green-100 text-sm mt-1">
                {recovery >= 67 ? 'Your body is ready. Push hard today!' : recovery >= 34 ? 'Take it moderate — listen to your body.' : 'Rest day recommended. Prioritise sleep.'}
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Metrics Row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Flame size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Calories</p>
              <p className="text-lg font-extrabold text-gray-900">{caloriesEaten.toLocaleString()}</p>
              <p className="text-xs text-gray-400">of {caloriesTarget.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3" onClick={() => logWater(250)}>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Droplets size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Hydration</p>
              <p className="text-lg font-extrabold text-gray-900">{(waterMl / 1000).toFixed(1)}L</p>
              <p className="text-xs text-gray-400">of {(waterTarget / 1000).toFixed(1)}L</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Moon size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Sleep</p>
              <p className="text-lg font-extrabold text-gray-900">{sleep}h</p>
              <p className="text-xs text-gray-400">{sleep >= 7 ? 'Great rest' : 'Could be better'}</p>
            </div>
          </Card>

          {whoopConnected && hrv ? (
            <Card className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-sm">W</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">HRV</p>
                <p className="text-lg font-extrabold text-gray-900">{hrv} ms</p>
                {rhr && <p className="text-xs text-gray-400">RHR {rhr} bpm</p>}
              </div>
            </Card>
          ) : (
            <Card className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <Footprints size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Steps</p>
                <p className="text-lg font-extrabold text-gray-900">{steps.toLocaleString()}</p>
                <p className="text-xs text-gray-400">of 10,000</p>
              </div>
            </Card>
          )}
        </div>

        {/* Macro Progress */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Today's Nutrition</h3>
            <button onClick={() => navigate('/app/nutrition')} className="text-green-600 text-sm font-semibold flex items-center gap-1">
              Log meal <ChevronRight size={14} />
            </button>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 font-medium">Calories</span>
              <span className="font-bold text-gray-900">{caloriesEaten} <span className="text-gray-400 font-normal">/ {caloriesTarget} kcal</span></span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((caloriesEaten / caloriesTarget) * 100, 100)}%`, background: 'linear-gradient(90deg, #52a07c, #3f8464)' }} />
            </div>
          </div>
          <div className="space-y-2.5">
            <MacroBar label="Protein" current={todayNutrition.totalMacros.proteinG} target={todayNutrition.targetMacros.proteinG} color="#52a07c" />
            <MacroBar label="Carbs" current={todayNutrition.totalMacros.carbsG} target={todayNutrition.targetMacros.carbsG} color="#F59E0B" />
            <MacroBar label="Fat" current={todayNutrition.totalMacros.fatG} target={todayNutrition.targetMacros.fatG} color="#EF4444" />
          </div>
        </Card>

        {/* Today's Workout Banner */}
        {todayWorkout && (
          <Card onClick={() => navigate(`/app/workout`)} className="bg-gradient-to-r from-gray-900 to-gray-800 text-white cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💪</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs font-medium mb-0.5">TODAY'S WORKOUT</p>
                <p className="font-bold text-white">{todayWorkout.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge color="#52a07c" className="text-[10px]">{todayWorkout.estimatedDurationMins} min</Badge>
                  <Badge color="#6B7280" className="text-[10px]">{todayWorkout.difficulty}</Badge>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-500 flex-shrink-0" />
            </div>
          </Card>
        )}

        {/* Meals today */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Today's Meals</h3>
            <button onClick={() => navigate('/app/nutrition')} className="text-green-600 text-sm font-semibold flex items-center gap-1">View all <ChevronRight size={14} /></button>
          </div>
          <div className="space-y-3">
            {todayNutrition.meals.slice(0, 3).map(meal => (
              <div key={meal.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  {meal.mealType === 'breakfast' ? '🥣' : meal.mealType === 'lunch' ? '🍽️' : '🌙'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{meal.recipe?.name || meal.customDescription || 'Meal'}</p>
                  <p className="text-xs text-gray-400 capitalize">{meal.mealType}</p>
                </div>
                <span className="text-sm font-bold text-gray-700 flex-shrink-0">{meal.macros.calories} kcal</span>
              </div>
            ))}
            {todayNutrition.meals.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm">No meals logged yet</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigate('/app/nutrition')}>Log your first meal</Button>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Log */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => logWater(250)}>
            <Droplets size={16} /> +250ml Water
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setLogModal(true)}>
            <Plus size={16} /> Log Metric
          </Button>
        </div>

        {/* AI Coach tip */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl green-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-white text-base">🤖</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-green-700 mb-1">AI Coach Tip</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {recovery >= 67
                  ? "You're well recovered! Today is a great day to push intensity. Make sure to hydrate well — aim for at least 3L in this UAE heat. 💧"
                  : "Your recovery is moderate. Focus on nutrient-dense meals today and get to bed by 10pm for optimal recovery. 🌙"}
              </p>
              <button onClick={() => navigate('/app/chat')} className="text-green-600 text-xs font-semibold mt-2 flex items-center gap-1">
                Chat with AI Coach <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Log Metric Modal */}
      <Modal open={logModal} onClose={() => setLogModal(false)} title="Log Daily Metric">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Water intake</label>
            <div className="flex gap-2">
              {[250, 500, 750].map(ml => (
                <button key={ml} onClick={() => setWaterInput(ml)} className={cn('flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all', waterInput === ml ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500')}>
                  {ml}ml
                </button>
              ))}
            </div>
          </div>
          <Button fullWidth onClick={() => { logWater(waterInput); logDailyMetric({ hydrationMl: (metrics?.hydrationMl || 0) + waterInput }); setLogModal(false) }}>
            <Droplets size={16} /> Add {waterInput}ml
          </Button>
          <Button variant="ghost" fullWidth onClick={() => navigate('/app/progress')}>Log body metrics</Button>
        </div>
      </Modal>
    </div>
  )
}
