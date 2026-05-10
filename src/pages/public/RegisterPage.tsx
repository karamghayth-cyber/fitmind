import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import { Button, Input } from '../../components/ui'
import { SocialAuth, OrDivider } from '../../components/ui/SocialAuth'
import { useAuthStore } from '../../stores/authStore'
import { useUserStore } from '../../stores/userStore'
import { cn } from '../../utils'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading, error } = useAuthStore()
  const { createProfile } = useUserStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'trainer'>('user')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    await register(email, password, name, role)
    createProfile(email, name, role)
    navigate('/onboarding')
  }

  const handleSocialRegister = async (provider: string) => {
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1)
    const mockEmail = `${provider}_user@fitmind.ae`
    const mockName = `${providerName} User`
    await register(mockEmail, 'social', mockName, role)
    createProfile(mockEmail, mockName, role)
    navigate('/onboarding')
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
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-5">Join 10,000+ UAE residents on FitMind</p>

          {/* Role selector */}
          <div className="flex gap-3 mb-5">
            {(['user', 'trainer'] as const).map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={cn('flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all flex flex-col items-center gap-1', role === r ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300')}>
                <span className="text-lg">{r === 'user' ? '🏃' : '💪'}</span>
                <span>{r === 'user' ? "I'm a User" : "I'm a Trainer"}</span>
              </button>
            ))}
          </div>

          {/* Social sign-in */}
          <SocialAuth
            onGoogle={() => handleSocialRegister('google')}
            onApple={() => handleSocialRegister('apple')}
            onMeta={() => handleSocialRegister('meta')}
          />

          <OrDivider />

          {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 border border-red-100">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ahmed Al Mansouri" icon={<User size={16} />} required />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" icon={<Mail size={16} />} required />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" icon={<Lock size={16} />} required minLength={8} />
            <Button type="submit" fullWidth loading={isLoading} size="lg">Create Account</Button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
