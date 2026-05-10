import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button, Card, Modal } from '../../components/ui'
import { useWorkoutStore } from '../../stores/workoutStore'
import { cn } from '../../utils'
import type { WorkoutSet } from '../../types'

interface SetRowProps {
  set: WorkoutSet
  setIdx: number
  exerciseIdx: number
  onComplete: (exIdx: number, setIdx: number, data: Partial<WorkoutSet>) => void
}

const SetRow: React.FC<SetRowProps> = ({ set, setIdx, exerciseIdx, onComplete }) => {
  const [reps, setReps] = useState(set.actualReps ?? set.reps ?? 0)
  const [weight, setWeight] = useState(set.actualWeightKg ?? set.weightKg ?? 0)
  return (
    <div className={cn('grid grid-cols-4 gap-2 items-center px-2 py-2 rounded-xl', set.isCompleted ? 'bg-green-50' : 'bg-gray-50')}>
      <span className="text-sm font-bold text-gray-700">#{set.setNumber}</span>
      <input type="number" value={reps} onChange={e => setReps(+e.target.value)} min={0}
        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center w-full focus:border-green-500 outline-none" />
      <input type="number" value={weight} onChange={e => setWeight(+e.target.value)} min={0}
        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center w-full focus:border-green-500 outline-none" />
      <button onClick={() => onComplete(exerciseIdx, setIdx, { actualReps: reps, actualWeightKg: weight })}
        className={cn('w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-all', set.isCompleted ? 'bg-green-500 text-white' : 'border-2 border-gray-300 text-gray-400 hover:border-green-400')}>
        <Check size={14} />
      </button>
    </div>
  )
}

export const ActiveWorkoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { activeWorkout, workoutLog, completeSet, finishWorkout, cancelWorkout, workoutStartTime } = useWorkoutStore()
  const [elapsed, setElapsed] = useState(0)
  const [expandedExercise, setExpandedExercise] = useState<number>(0)
  const [confirmFinish, setConfirmFinish] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (workoutStartTime) setElapsed(Math.floor((Date.now() - workoutStartTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [workoutStartTime])

  useEffect(() => {
    if (!activeWorkout) navigate('/app/workout')
  }, [activeWorkout, navigate])

  if (!activeWorkout || !workoutLog) return null

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const totalSets = workoutLog.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
  const completedSets = workoutLog.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.isCompleted).length, 0)
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0

  const handleFinish = () => {
    finishWorkout()
    navigate('/app/workout')
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top bar */}
      <div className="bg-white px-5 border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Active Workout</p>
              <h2 className="font-extrabold text-gray-900">{activeWorkout.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-green-600 tabular-nums">{formatTime(elapsed)}</p>
              <p className="text-xs text-gray-400">{completedSets}/{totalSets} sets done</p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-3">
        {workoutLog.exercises.map((ex, exerciseIdx) => {
          const isExpanded = expandedExercise === exerciseIdx
          const exCompleted = ex.sets.every(s => s.isCompleted)

          return (
            <Card key={ex.exerciseId} className={cn(exCompleted && 'opacity-70')}>
              <button className="w-full flex items-center justify-between text-left" onClick={() => setExpandedExercise(isExpanded ? -1 : exerciseIdx)}>
                <div className="flex items-center gap-3">
                  {exCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                      {exerciseIdx + 1}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{ex.exercise.name}</p>
                    <p className="text-xs text-gray-400">{ex.sets.length} sets · {ex.exercise.muscleGroups.join(', ')}</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>

              {isExpanded && (
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-4 gap-2 px-2">
                    <p className="text-xs text-gray-400 font-medium">Set</p>
                    <p className="text-xs text-gray-400 font-medium text-center">Reps</p>
                    <p className="text-xs text-gray-400 font-medium text-center">Weight (kg)</p>
                    <p className="text-xs text-gray-400 font-medium text-center">Done</p>
                  </div>
                  {ex.sets.map((set, setIdx) => (
                    <SetRow key={setIdx} set={set} setIdx={setIdx} exerciseIdx={exerciseIdx} onComplete={completeSet} />
                  ))}

                  {ex.exercise.instructions.length > 0 && (
                    <div className="mt-3 bg-blue-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-blue-700 mb-1">How to perform</p>
                      <ol className="space-y-0.5">
                        {ex.exercise.instructions.map((inst, i) => (
                          <li key={i} className="text-xs text-blue-700 flex gap-1.5">
                            <span className="font-bold flex-shrink-0">{i + 1}.</span>{inst}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}

        <div className="flex gap-3 pt-2">
          <Button variant="danger" className="flex-1" onClick={() => { cancelWorkout(); navigate('/app/workout') }}>
            <X size={16} /> Cancel
          </Button>
          <Button className="flex-1" onClick={() => setConfirmFinish(true)}>
            <Check size={16} /> Finish Workout
          </Button>
        </div>
      </div>

      <Modal open={confirmFinish} onClose={() => setConfirmFinish(false)} title="Finish Workout?">
        <div className="space-y-4">
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <p className="text-4xl mb-2">🎉</p>
            <p className="font-bold text-gray-900">Great work!</p>
            <p className="text-gray-500 text-sm">{formatTime(elapsed)} · {completedSets} sets completed</p>
          </div>
          <Button fullWidth onClick={handleFinish}>Save Workout</Button>
          <Button variant="ghost" fullWidth onClick={() => setConfirmFinish(false)}>Keep Going</Button>
        </div>
      </Modal>
    </div>
  )
}
