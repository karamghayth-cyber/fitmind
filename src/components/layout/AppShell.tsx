import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Utensils, Dumbbell, TrendingUp, MessageCircle, User } from 'lucide-react'
import { cn } from '../../utils'
import { useAuthStore } from '../../stores/authStore'

const NAV_ITEMS = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/app/nutrition', icon: Utensils, label: 'Nutrition' },
  { to: '/app/workout', icon: Dumbbell, label: 'Workouts' },
  { to: '/app/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/app/chat', icon: MessageCircle, label: 'AI Coach' },
]

export const AppShell: React.FC = () => {
  const { role } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 flex-col z-30">
        <div className="p-6 pb-4">
          <button onClick={() => navigate('/app/dashboard')} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl green-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">FM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FitMind</span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all', isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
          {role === 'trainer' && (
            <NavLink to="/trainer/dashboard"
              className={({ isActive }) => cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all', isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}>
              <User size={18} />
              Trainer Portal
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <NavLink to="/app/profile"
            className={({ isActive }) => cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all', isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50')}>
            <User size={18} />
            Profile
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => cn('flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all', isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600')}>
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
