import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LogOut, ChevronRight, Bell, Globe, Moon, User, Shield, CheckCircle } from 'lucide-react'
import { Card, Toggle, Avatar, Badge } from '../../components/ui'
import { useUserStore } from '../../stores/userStore'
import { useAuthStore } from '../../stores/authStore'
import { useWhoopStore } from '../../stores/whoopStore'

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profile, toggleRamadanMode } = useUserStore()
  const { logout } = useAuthStore()
  const { isConnected: whoopConnected, profile: whoopProfile } = useWhoopStore()

  const whoopStatus = searchParams.get('whoop')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const stats = [
    { label: 'Streak', value: '12 days' },
    { label: 'Workouts', value: '34' },
    { label: 'Meals logged', value: '127' },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white px-5 pt-10 pb-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Profile</h1>
          <div className="flex items-center gap-4">
            <Avatar name={profile?.displayName || 'User'} size="lg" />
            <div>
              <p className="text-lg font-bold text-gray-900">{profile?.displayName || 'User'}</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <Badge color={profile?.subscription === 'elite' ? '#F59E0B' : profile?.subscription === 'pro' ? '#52a07c' : '#6B7280'} className="mt-1 capitalize">
                {profile?.subscription || 'free'} plan
              </Badge>
            </div>
          </div>
          <div className="flex gap-4 mt-5 pt-5 border-t border-gray-100">
            {stats.map(s => (
              <div key={s.label} className="flex-1 text-center">
                <p className="text-xl font-extrabold text-green-600">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Account */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">Account</p>
          <Card padding={false}>
            {[
              { icon: User, label: 'Edit Profile', action: () => {} },
              { icon: Shield, label: 'Health Data', action: () => navigate('/onboarding') },
              { icon: Bell, label: 'Notifications', action: () => {} },
            ].map((item, i, arr) => (
              <button key={item.label} onClick={item.action} className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                  <item.icon size={16} className="text-gray-500" />
                </div>
                <span className="flex-1 text-sm font-medium text-gray-700">{item.label}</span>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">Preferences</p>
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon size={18} className="text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Ramadan Mode</p>
                    <p className="text-xs text-gray-400">Show Suhoor & Iftar meal slots</p>
                  </div>
                </div>
                <Toggle checked={profile?.ramadanModeEnabled || false} onChange={toggleRamadanMode} />
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Language</p>
                    <p className="text-xs text-gray-400">English</p>
                  </div>
                </div>
                <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold">EN</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Whoop */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">Integrations</p>
          {whoopStatus === 'connected' && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-green-200 mb-2">
              <CheckCircle size={14} /> Whoop connected successfully!
            </div>
          )}
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/app/whoop')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black">W</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Whoop</p>
                <p className="text-sm text-gray-500">
                  {whoopConnected
                    ? `Connected · ${whoopProfile?.first_name} ${whoopProfile?.last_name}`
                    : 'Connect for live recovery & sleep data'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {whoopConnected
                  ? <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  : <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-semibold">Connect</span>}
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </div>
          </Card>
        </div>

        {/* Subscription */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">Subscription</p>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/app/subscription')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 capitalize">{profile?.subscription || 'free'} Plan</p>
                <p className="text-sm text-gray-500">
                  {profile?.subscription === 'free' ? 'Upgrade for more AI features' : 'Active subscription'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {profile?.subscription === 'free' && (
                  <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-semibold">Upgrade</span>
                )}
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </div>
          </Card>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">FitMind v1.0.0 · Made with 💚 in the UAE</p>
      </div>
    </div>
  )
}
