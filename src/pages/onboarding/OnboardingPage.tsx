import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui'
import { useUserStore } from '../../stores/userStore'
import { useNutritionStore } from '../../stores/nutritionStore'
import type { HealthData, FitnessGoal, FoodAllergy, DietaryPreference, HealthCondition, ActivityLevel } from '../../types'
import { calculateTDEE, calculateMacroTargets, today } from '../../utils'
import { cn } from '../../utils'

const STEPS = ['Your Goal', 'About You', 'Allergies', 'Diet & Food', 'Health', 'All Set!']

const GOALS: { id: FitnessGoal; label: string; emoji: string; desc: string }[] = [
  { id: 'weight_loss', label: 'Lose Weight', emoji: '🔥', desc: 'Burn fat and feel lighter' },
  { id: 'muscle_gain', label: 'Build Muscle', emoji: '💪', desc: 'Gain strength and size' },
  { id: 'maintenance', label: 'Stay in Shape', emoji: '⚖️', desc: 'Maintain current physique' },
  { id: 'improve_endurance', label: 'Improve Endurance', emoji: '🏃', desc: 'Run farther, last longer' },
  { id: 'general_health', label: 'General Health', emoji: '🌿', desc: 'Feel better overall' },
]

const ALLERGIES: { id: FoodAllergy; label: string; emoji: string }[] = [
  { id: 'none', label: 'No allergies', emoji: '✅' },
  { id: 'nuts', label: 'Tree Nuts', emoji: '🥜' },
  { id: 'dairy', label: 'Dairy', emoji: '🥛' },
  { id: 'gluten', label: 'Gluten', emoji: '🌾' },
  { id: 'eggs', label: 'Eggs', emoji: '🥚' },
  { id: 'shellfish', label: 'Shellfish', emoji: '🦐' },
  { id: 'soy', label: 'Soy', emoji: '🫘' },
  { id: 'sesame', label: 'Sesame', emoji: '🌱' },
]

const DIETS: { id: DietaryPreference; label: string; emoji: string }[] = [
  { id: 'omnivore', label: 'Everything', emoji: '🍽️' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
  { id: 'keto', label: 'Keto', emoji: '🥑' },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
]

const CONDITIONS: { id: HealthCondition; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'diabetes_type2', label: 'Type 2 Diabetes' },
  { id: 'diabetes_type1', label: 'Type 1 Diabetes' },
  { id: 'hypertension', label: 'High Blood Pressure' },
  { id: 'pcos', label: 'PCOS' },
  { id: 'hypothyroidism', label: 'Hypothyroidism' },
  { id: 'celiac', label: 'Celiac Disease' },
  { id: 'ibs', label: 'IBS' },
  { id: 'heart_disease', label: 'Heart Disease' },
]

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate()
  const { profile, setHealthData, completeOnboarding } = useUserStore()
  const { setMacroTargets } = useNutritionStore()
  const [step, setStep] = useState(0)

  const [goals, setGoals] = useState<FitnessGoal[]>(['general_health'])
  const [dob, setDob] = useState('1992-01-01')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [heightCm, setHeightCm] = useState(175)
  const [weightKg, setWeightKg] = useState(80)
  const [targetWeightKg, setTargetWeightKg] = useState(75)
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active')
  const [allergies, setAllergies] = useState<FoodAllergy[]>(['none'])
  const [dietPrefs, setDietPrefs] = useState<DietaryPreference[]>(['omnivore'])
  const [conditions, setConditions] = useState<HealthCondition[]>(['none'])

  const toggleItem = <T extends string>(arr: T[], item: T, setArr: (a: T[]) => void, none: T) => {
    if (item === none) { setArr([none]); return }
    const filtered = arr.filter(a => a !== none)
    if (filtered.includes(item)) setArr(filtered.filter(a => a !== item) || [none])
    else setArr([...filtered, item])
  }

  const finish = () => {
    const health: HealthData = {
      userId: profile?.id || 'current',
      dateOfBirth: dob,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      goals,
      targetWeightKg,
      allergies,
      dietaryPreferences: dietPrefs,
      healthConditions: conditions,
      updatedAt: today(),
    }
    setHealthData(health)
    const tdee = calculateTDEE(health)
    const macros = calculateMacroTargets(tdee, goals)
    setMacroTargets({ userId: profile?.id || 'current', ...macros })
    completeOnboarding()
    navigate('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl green-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">FM</span>
          </div>
          <span className="text-xl font-bold text-gray-900">FitMind</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={cn('flex items-center gap-1.5', i < step ? 'text-green-600' : i === step ? 'text-gray-900' : 'text-gray-300')}>
                {i < step ? <CheckCircle size={18} className="text-green-500" /> : <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold', i === step ? 'border-green-500 text-green-600' : 'border-gray-200 text-gray-300')}>{i + 1}</div>}
              </div>
              {i < STEPS.length - 1 && <div className={cn('flex-1 h-0.5 rounded', i < step ? 'bg-green-400' : 'bg-gray-200')} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 card-shadow">
          {/* Step 0: Goals */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">What's your main goal?</h2>
              <p className="text-gray-500 text-sm mb-6">Select all that apply</p>
              <div className="grid grid-cols-1 gap-3">
                {GOALS.map(g => (
                  <button key={g.id} onClick={() => toggleItem(goals, g.id, setGoals, 'general_health')}
                    className={cn('flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all', goals.includes(g.id) ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300')}>
                    <span className="text-2xl">{g.emoji}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{g.label}</p>
                      <p className="text-xs text-gray-500">{g.desc}</p>
                    </div>
                    {goals.includes(g.id) && <CheckCircle size={18} className="text-green-500 ml-auto flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Health Data */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">About you</h2>
              <p className="text-gray-500 text-sm mb-6">This helps us calculate your personalised nutrition</p>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Gender</label>
                  <div className="flex gap-3">
                    {(['male', 'female'] as const).map(g => (
                      <button key={g} onClick={() => setGender(g)} className={cn('flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all', gender === g ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500')}>
                        {g === 'male' ? '👨 Male' : '👩 Female'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Date of Birth</label>
                  <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Height: <span className="text-green-600 font-bold">{heightCm} cm</span></label>
                  <input type="range" min={140} max={220} value={heightCm} onChange={e => setHeightCm(+e.target.value)} className="w-full accent-green-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Current Weight: <span className="text-green-600 font-bold">{weightKg} kg</span></label>
                  <input type="range" min={40} max={200} value={weightKg} onChange={e => setWeightKg(+e.target.value)} className="w-full accent-green-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Target Weight: <span className="text-green-600 font-bold">{targetWeightKg} kg</span></label>
                  <input type="range" min={40} max={200} value={targetWeightKg} onChange={e => setTargetWeightKg(+e.target.value)} className="w-full accent-green-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Activity Level</label>
                  <div className="space-y-2">
                    {[
                      { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, little exercise' },
                      { id: 'lightly_active', label: 'Lightly Active', desc: '1-3 days/week' },
                      { id: 'moderately_active', label: 'Moderately Active', desc: '3-5 days/week' },
                      { id: 'very_active', label: 'Very Active', desc: '6-7 days/week' },
                      { id: 'extra_active', label: 'Extra Active', desc: 'Athlete or physical job' },
                    ].map(a => (
                      <button key={a.id} onClick={() => setActivityLevel(a.id as ActivityLevel)} className={cn('w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 text-sm transition-all', activityLevel === a.id ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-600 hover:border-gray-200')}>
                        <span className="font-medium">{a.label}</span>
                        <span className="text-xs text-gray-400">{a.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Allergies */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Any food allergies?</h2>
              <p className="text-gray-500 text-sm mb-6">We'll make sure your meal plans are 100% safe for you</p>
              <div className="grid grid-cols-2 gap-3">
                {ALLERGIES.map(a => (
                  <button key={a.id} onClick={() => toggleItem(allergies, a.id, setAllergies, 'none')}
                    className={cn('flex items-center gap-3 p-4 rounded-2xl border-2 transition-all', allergies.includes(a.id) ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300')}>
                    <span className="text-xl">{a.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Diet preferences */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Dietary preferences</h2>
              <p className="text-gray-500 text-sm mb-6">All recommendations are halal by default 🌙</p>
              <div className="grid grid-cols-2 gap-3">
                {DIETS.map(d => (
                  <button key={d.id} onClick={() => setDietPrefs([d.id])}
                    className={cn('flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all', dietPrefs.includes(d.id) ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300')}>
                    <span className="text-2xl">{d.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Health conditions */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Any health conditions?</h2>
              <p className="text-gray-500 text-sm mb-2">We'll tailor your plans accordingly. Always consult your doctor for medical advice.</p>
              <div className="bg-amber-50 text-amber-700 text-xs rounded-xl px-4 py-2.5 mb-5 border border-amber-100">
                ⚕️ FitMind is not a medical service. Always consult a healthcare professional for medical guidance.
              </div>
              <div className="space-y-2">
                {CONDITIONS.map(c => (
                  <button key={c.id} onClick={() => toggleItem(conditions, c.id, setConditions, 'none')}
                    className={cn('w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all', conditions.includes(c.id) ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-700 hover:border-gray-200')}>
                    <span className="font-medium">{c.label}</span>
                    {conditions.includes(c.id) && <CheckCircle size={16} className="text-green-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Done */}
          {step === 5 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full green-gradient flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">You're all set!</h2>
              <p className="text-gray-500 text-sm mb-6">FitMind has built your personalised profile. Your AI dietitian and coach are ready.</p>
              <div className="bg-green-50 rounded-2xl p-4 text-left space-y-2 mb-6">
                {[
                  '✅ Personalised nutrition targets calculated',
                  '✅ AI meal plans ready to generate',
                  '✅ Smart workout programme available',
                  '✅ UAE grocery sourcing enabled',
                  '✅ AI Coach activated',
                ].map(item => <p key={item} className="text-sm text-green-700">{item}</p>)}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 0 && step < 5 && (
              <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="flex-1">Back</Button>
            )}
            {step < 4 && (
              <Button variant="primary" onClick={() => setStep(s => s + 1)} className="flex-1">Continue</Button>
            )}
            {step === 4 && (
              <Button variant="primary" onClick={() => setStep(5)} className="flex-1">Review & Finish</Button>
            )}
            {step === 5 && (
              <Button variant="primary" onClick={finish} fullWidth size="lg">Go to My Dashboard →</Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">Step {step + 1} of {STEPS.length}</p>
      </div>
    </div>
  )
}
