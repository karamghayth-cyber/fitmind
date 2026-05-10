import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Sparkles, Clock, Flame, Dumbbell } from 'lucide-react'
import { Card, Button, Badge } from '../../components/ui'
import { useWorkoutStore } from '../../stores/workoutStore'
import { cn } from '../../utils'
import type { Workout } from '../../types'

const MUSCLE_EMOJIS: Record<string, string> = { chest: '💪', back: '🏋️', shoulders: '🤷', biceps: '💪', triceps: '💪', quads: '🦵', hamstrings: '🦵', glutes: '🍑', calves: '🦵', abs: '🔥', full_body: '⚡' }
const DIFFICULTY_COLORS: Record<string, string> = { beginner: '#52a07c', intermediate: '#F59E0B', advanced: '#EF4444' }

const WorkoutCard: React.FC<{ workout: Workout; onStart: () => void }> = ({ workout, onStart }) => (
  <Card className="space-y-3">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{workout.isAIGenerated ? '🤖' : '🏋️'}</span>
          <span className="text-xs text-gray-400 font-medium">{workout.workoutType.toUpperCase()}</span>
        </div>
        <h3 className="font-bold text-gray-900 text-base">{workout.name}</h3>
        {workout.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{workout.description}</p>}
      </div>
      <Badge color={DIFFICULTY_COLORS[workout.difficulty]}>{workout.difficulty}</Badge>
    </div>

    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 text-gray-500">
        <Clock size={14} />
        <span className="text-sm">{workout.estimatedDurationMins} min</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <Dumbbell size={14} />
        <span className="text-sm">{workout.exercises.length} exercises</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <Flame size={14} />
        <span className="text-sm">~{workout.estimatedDurationMins * 5} kcal</span>
      </div>
    </div>

    <div className="flex gap-1.5 flex-wrap">
      {workout.muscleGroups.map(mg => (
        <span key={mg} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium capitalize">
          {MUSCLE_EMOJIS[mg]} {mg.replace('_', ' ')}
        </span>
      ))}
    </div>

    <div className="space-y-1.5">
      {workout.exercises.slice(0, 3).map(ex => (
        <div key={ex.exerciseId} className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          <span className="truncate">{ex.exercise.name}</span>
          <span className="text-gray-400 flex-shrink-0">×{ex.sets.length}</span>
        </div>
      ))}
      {workout.exercises.length > 3 && (
        <p className="text-xs text-gray-400 ml-3.5">+{workout.exercises.length - 3} more exercises</p>
      )}
    </div>

    <Button fullWidth onClick={onStart}>
      <Play size={16} /> Start Workout
    </Button>
  </Card>
)

export const WorkoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { workouts, startWorkout, workoutHistory, isGenerating, setGenerating } = useWorkoutStore()
  const [activeTab, setActiveTab] = useState<'today' | 'library' | 'history'>('today')

  const handleStart = (id: string) => {
    startWorkout(id)
    navigate(`/app/workout/active/${id}`)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white px-5 pt-8 pb-0 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Workouts</h1>
          <div className="flex gap-1">
            {(['today', 'library', 'history'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn('flex-1 py-3 text-sm font-semibold border-b-2 transition-all capitalize', activeTab === tab ? 'border-green-500 text-green-600' : 'border-transparent text-gray-400')}>
                {tab === 'today' ? "Today's Plan" : tab === 'library' ? 'Library' : 'History'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {activeTab === 'today' && (
          <>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center gap-3">
                <Sparkles size={24} />
                <div className="flex-1">
                  <p className="font-bold">AI Workout Generator</p>
                  <p className="text-green-100 text-xs">Tailored to your goals and recovery score</p>
                </div>
                <Button variant="secondary" size="sm" className="bg-white text-green-600 flex-shrink-0" loading={isGenerating} onClick={() => setGenerating(true)}>
                  Generate
                </Button>
              </div>
            </Card>
            <p className="text-sm font-semibold text-gray-500">RECOMMENDED FOR TODAY</p>
            {workouts.slice(0, 2).map(w => (
              <WorkoutCard key={w.id} workout={w} onStart={() => handleStart(w.id)} />
            ))}
          </>
        )}

        {activeTab === 'library' && (
          <div className="space-y-4">
            {workouts.map(w => <WorkoutCard key={w.id} workout={w} onStart={() => handleStart(w.id)} />)}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {workoutHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">🏋️</p>
                <p>No completed workouts yet</p>
                <Button variant="primary" size="sm" className="mt-3" onClick={() => setActiveTab('today')}>Start a Workout</Button>
              </div>
            ) : workoutHistory.map(log => (
              <Card key={log.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{log.workout.name}</p>
                    <p className="text-xs text-gray-400">{new Date(log.completedAt || log.startedAt).toLocaleDateString('en-AE')}</p>
                  </div>
                  <div className="text-right">
                    {log.durationMins && <p className="text-sm font-bold text-green-600">{log.durationMins} min</p>}
                    <p className="text-xs text-gray-400">{log.exercises.length} exercises</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
