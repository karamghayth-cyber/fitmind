import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '../stores/userStore'

// Pages
import { LandingPage } from '../pages/public/LandingPage'
import { LoginPage } from '../pages/public/LoginPage'
import { RegisterPage } from '../pages/public/RegisterPage'
import { OnboardingPage } from '../pages/onboarding/OnboardingPage'
import { AppShell } from '../components/layout/AppShell'
import { DashboardPage } from '../pages/app/DashboardPage'
import { NutritionPage } from '../pages/app/NutritionPage'
import { RecipeDetailPage } from '../pages/app/RecipeDetailPage'
import { WorkoutPage } from '../pages/app/WorkoutPage'
import { ActiveWorkoutPage } from '../pages/app/ActiveWorkoutPage'
import { ProgressPage } from '../pages/app/ProgressPage'
import { ChatPage } from '../pages/app/ChatPage'
import { SubscriptionPage } from '../pages/app/SubscriptionPage'
import { ProfilePage } from '../pages/app/ProfilePage'
import { TrainerDashboardPage } from '../pages/trainer/TrainerDashboardPage'
import { ClientDetailPage } from '../pages/trainer/ClientDetailPage'
import { WhoopConnectPage } from '../pages/app/WhoopConnectPage'
import { WhoopCallbackPage } from '../pages/app/WhoopCallbackPage'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  const { isOnboarded } = useUserStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isOnboarded) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

const TrainerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role !== 'trainer') return <Navigate to="/app/dashboard" replace />
  return <>{children}</>
}

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  {
    path: '/app',
    element: <ProtectedRoute><AppShell /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'nutrition', element: <NutritionPage /> },
      { path: 'nutrition/recipes/:id', element: <RecipeDetailPage /> },
      { path: 'workout', element: <WorkoutPage /> },
      { path: 'workout/active/:id', element: <ActiveWorkoutPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'subscription', element: <SubscriptionPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'whoop', element: <WhoopConnectPage /> },
    ],
  },
  {
    path: '/trainer',
    element: <TrainerRoute><AppShell /></TrainerRoute>,
    children: [
      { index: true, element: <Navigate to="/trainer/dashboard" replace /> },
      { path: 'dashboard', element: <TrainerDashboardPage /> },
      { path: 'clients', element: <TrainerDashboardPage /> },
      { path: 'clients/:id', element: <ClientDetailPage /> },
      { path: 'workout-builder', element: <WorkoutPage /> },
    ],
  },
  { path: '/whoop/callback', element: <WhoopCallbackPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
