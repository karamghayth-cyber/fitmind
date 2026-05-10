import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Workout, WorkoutLog, WorkoutSet } from '../types'
import { generateId, today } from '../utils'

const SAMPLE_WORKOUTS: Workout[] = [
  {
    id: 'w1',
    name: 'Upper Body Strength',
    description: 'Compound-focused upper body session for muscle growth',
    workoutType: 'strength',
    muscleGroups: ['chest', 'back', 'shoulders', 'triceps', 'biceps'],
    difficulty: 'intermediate',
    estimatedDurationMins: 55,
    exercises: [
      {
        exerciseId: 'e1',
        exercise: { id: 'e1', name: 'Bench Press', muscleGroups: ['chest', 'triceps'], equipment: ['barbell'], difficulty: 'intermediate', instructions: ['Lie flat on bench', 'Grip bar shoulder-width', 'Lower to chest', 'Press up explosively'], isCompound: true },
        sets: [
          { setNumber: 1, reps: 8, weightKg: 70, restSecs: 90, isCompleted: false },
          { setNumber: 2, reps: 8, weightKg: 70, restSecs: 90, isCompleted: false },
          { setNumber: 3, reps: 6, weightKg: 75, restSecs: 120, isCompleted: false },
        ],
        orderIndex: 0,
      },
      {
        exerciseId: 'e2',
        exercise: { id: 'e2', name: 'Bent-Over Row', muscleGroups: ['back', 'biceps'], equipment: ['barbell'], difficulty: 'intermediate', instructions: ['Hinge at hips', 'Keep back flat', 'Pull bar to lower chest', 'Control the descent'], isCompound: true },
        sets: [
          { setNumber: 1, reps: 10, weightKg: 60, restSecs: 90, isCompleted: false },
          { setNumber: 2, reps: 10, weightKg: 60, restSecs: 90, isCompleted: false },
          { setNumber: 3, reps: 8, weightKg: 65, restSecs: 90, isCompleted: false },
        ],
        orderIndex: 1,
      },
      {
        exerciseId: 'e3',
        exercise: { id: 'e3', name: 'Overhead Press', muscleGroups: ['shoulders', 'triceps'], equipment: ['barbell'], difficulty: 'intermediate', instructions: ['Stand with bar at shoulder height', 'Press overhead until arms locked', 'Lower with control'], isCompound: true },
        sets: [
          { setNumber: 1, reps: 8, weightKg: 45, restSecs: 90, isCompleted: false },
          { setNumber: 2, reps: 8, weightKg: 45, restSecs: 90, isCompleted: false },
          { setNumber: 3, reps: 6, weightKg: 50, restSecs: 90, isCompleted: false },
        ],
        orderIndex: 2,
      },
    ],
    isAIGenerated: false,
    tags: ['strength', 'upper-body', 'gym'],
    createdAt: today(),
  },
  {
    id: 'w2',
    name: 'HIIT Cardio Blast',
    description: '25-minute high-intensity session, no equipment needed — perfect for UAE home workouts',
    workoutType: 'hiit',
    muscleGroups: ['full_body'],
    difficulty: 'intermediate',
    estimatedDurationMins: 25,
    exercises: [
      {
        exerciseId: 'e4',
        exercise: { id: 'e4', name: 'Burpees', muscleGroups: ['full_body'], equipment: ['bodyweight'], difficulty: 'intermediate', instructions: ['Start standing', 'Drop to plank', 'Push-up', 'Jump feet to hands', 'Jump up with hands overhead'], isCompound: true },
        sets: [{ setNumber: 1, durationSecs: 40, restSecs: 20, isCompleted: false }, { setNumber: 2, durationSecs: 40, restSecs: 20, isCompleted: false }, { setNumber: 3, durationSecs: 40, restSecs: 20, isCompleted: false }],
        orderIndex: 0,
      },
      {
        exerciseId: 'e5',
        exercise: { id: 'e5', name: 'Jump Squats', muscleGroups: ['quads', 'glutes'], equipment: ['bodyweight'], difficulty: 'beginner', instructions: ['Squat down', 'Explode upward', 'Land softly and immediately repeat'], isCompound: false },
        sets: [{ setNumber: 1, durationSecs: 40, restSecs: 20, isCompleted: false }, { setNumber: 2, durationSecs: 40, restSecs: 20, isCompleted: false }, { setNumber: 3, durationSecs: 40, restSecs: 20, isCompleted: false }],
        orderIndex: 1,
      },
      {
        exerciseId: 'e6',
        exercise: { id: 'e6', name: 'Mountain Climbers', muscleGroups: ['abs', 'full_body'], equipment: ['bodyweight'], difficulty: 'beginner', instructions: ['Start in plank', 'Drive one knee to chest', 'Alternate rapidly'], isCompound: false },
        sets: [{ setNumber: 1, durationSecs: 40, restSecs: 20, isCompleted: false }, { setNumber: 2, durationSecs: 40, restSecs: 20, isCompleted: false }, { setNumber: 3, durationSecs: 40, restSecs: 20, isCompleted: false }],
        orderIndex: 2,
      },
    ],
    isAIGenerated: false,
    tags: ['hiit', 'cardio', 'no-equipment', 'home'],
    createdAt: today(),
  },
  {
    id: 'w3',
    name: 'Leg Day Power',
    description: 'Heavy compound leg session for strength and hypertrophy',
    workoutType: 'strength',
    muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves'],
    difficulty: 'advanced',
    estimatedDurationMins: 65,
    exercises: [
      {
        exerciseId: 'e7',
        exercise: { id: 'e7', name: 'Back Squat', muscleGroups: ['quads', 'glutes'], equipment: ['barbell'], difficulty: 'advanced', instructions: ['Bar on upper traps', 'Feet shoulder-width', 'Descend until thighs parallel', 'Drive through heels'], isCompound: true },
        sets: [
          { setNumber: 1, reps: 5, weightKg: 100, restSecs: 180, isCompleted: false },
          { setNumber: 2, reps: 5, weightKg: 100, restSecs: 180, isCompleted: false },
          { setNumber: 3, reps: 5, weightKg: 105, restSecs: 180, isCompleted: false },
          { setNumber: 4, reps: 3, weightKg: 110, restSecs: 180, isCompleted: false },
        ],
        orderIndex: 0,
      },
      {
        exerciseId: 'e8',
        exercise: { id: 'e8', name: 'Romanian Deadlift', muscleGroups: ['hamstrings', 'glutes'], equipment: ['barbell'], difficulty: 'intermediate', instructions: ['Hold bar at hip height', 'Hinge forward keeping back straight', 'Feel hamstring stretch', 'Drive hips forward to return'], isCompound: true },
        sets: [
          { setNumber: 1, reps: 10, weightKg: 70, restSecs: 120, isCompleted: false },
          { setNumber: 2, reps: 10, weightKg: 70, restSecs: 120, isCompleted: false },
          { setNumber: 3, reps: 8, weightKg: 75, restSecs: 120, isCompleted: false },
        ],
        orderIndex: 1,
      },
    ],
    isAIGenerated: false,
    tags: ['strength', 'legs', 'gym', 'advanced'],
    createdAt: today(),
  },
]

interface WorkoutState {
  workouts: Workout[]
  activeWorkout: Workout | null
  workoutLog: WorkoutLog | null
  workoutHistory: WorkoutLog[]
  isGenerating: boolean
  workoutStartTime: number | null

  startWorkout: (workoutId: string) => void
  completeSet: (exerciseIdx: number, setIdx: number, data: Partial<WorkoutSet>) => void
  finishWorkout: () => void
  cancelWorkout: () => void
  addWorkout: (w: Workout) => void
  setGenerating: (v: boolean) => void
  getTodayWorkout: () => Workout | null
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: SAMPLE_WORKOUTS,
      activeWorkout: null,
      workoutLog: null,
      workoutHistory: [],
      isGenerating: false,
      workoutStartTime: null,

      startWorkout: (workoutId) => {
        const workout = get().workouts.find(w => w.id === workoutId)
        if (!workout) return
        const log: WorkoutLog = {
          id: generateId(), userId: 'current', workoutId, workout,
          startedAt: new Date().toISOString(),
          exercises: workout.exercises.map(ex => ({ ...ex, sets: ex.sets.map(s => ({ ...s })) })),
        }
        set({ activeWorkout: workout, workoutLog: log, workoutStartTime: Date.now() })
      },

      completeSet: (exerciseIdx, setIdx, data) => {
        set(s => {
          if (!s.workoutLog) return s
          const exercises = s.workoutLog.exercises.map((ex, ei) => {
            if (ei !== exerciseIdx) return ex
            return {
              ...ex,
              sets: ex.sets.map((st, si) => si === setIdx ? { ...st, ...data, isCompleted: true } : st),
            }
          })
          return { workoutLog: { ...s.workoutLog, exercises } }
        })
      },

      finishWorkout: () => {
        const { workoutLog, workoutStartTime } = get()
        if (!workoutLog) return
        const durationMins = workoutStartTime ? Math.round((Date.now() - workoutStartTime) / 60000) : undefined
        const finished: WorkoutLog = { ...workoutLog, completedAt: new Date().toISOString(), durationMins }
        set(s => ({
          workoutHistory: [finished, ...s.workoutHistory],
          activeWorkout: null,
          workoutLog: null,
          workoutStartTime: null,
        }))
      },

      cancelWorkout: () => set({ activeWorkout: null, workoutLog: null, workoutStartTime: null }),

      addWorkout: (w) => set(s => ({ workouts: [w, ...s.workouts] })),

      setGenerating: (v) => set({ isGenerating: v }),

      getTodayWorkout: () => get().workouts[0] || null,
    }),
    { name: 'fitmind-workout' }
  )
)
