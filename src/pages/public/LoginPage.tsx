import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { Button, Input } from '../../components/ui'
import { SocialAuth, OrDivider } from '../../components/ui/SocialAuth'
import { useAuthStore } from '../../stores/authStore'
import { useUserStore } from '../../stores/userStore'
import { cn } from '../../utils'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()
  const { isOnboarded } = useUserStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'trainer'>('user')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password, role)
    if (isOnboarded) navigate('/app/dashboard')
    else navigate('/onboarding')
  }

  const handleSocialLogin = async (provider: string) => {
    await login(`demo_${provider}@fitmind.ae`, 'social', role)
    if (isOnboarded) navigate('/app/dashboard')
    else navigate('/onboarding')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl green-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">FM</span>
          </div>
          <span className="text-xl font-bold text-gray-900">FitMind</span>
        </button>

        <div className="bg-white rounded-3xl p-8 card-shadow">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-6">Sign in to continue your health journey</p>

          {/* Role selector */}
          <div className="flex gap-3 mb-5">
            {(['user', 'trainer'] as const).map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={cn('flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all', role === r ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300')}>
                {r === 'user' ? '🏃 User' : '💪 Trainer'}
              </button>
            ))}
          </div>

          {/* Social sign-in */}
          <SocialAuth
            onGoogle={() => handleSocialLogin('google')}
            onApple={() => handleSocialLogin('apple')}
            onMeta={() => handleSocialLogin('meta')}
          />

          <OrDivider />

          {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 border border-red-100">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" icon={<Mail size={16} />} required />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" icon={<Lock size={16} />} required />
            <Button type="submit" fullWidth loading={isLoading} size="lg">Sign In</Button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">Forgot password?</Link>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">Sign up free</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
