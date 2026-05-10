import React from 'react'
import { cn } from '../../utils'

interface SocialButtonProps {
  provider: 'google' | 'apple' | 'meta'
  onClick?: () => void
  className?: string
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.33.07 2.28.72 3.03.75.98-.18 1.91-.87 2.99-.93 1.44.07 2.6.68 3.28 1.82-2.97 1.76-2.42 5.73.22 6.77-.6 1.58-1.36 3.13-1.52 4.47zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
)

const MetaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="#1877F2"/>
  </svg>
)

const PROVIDERS = {
  google: {
    label: 'Continue with Google',
    icon: <GoogleIcon />,
    className: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
  },
  apple: {
    label: 'Continue with Apple',
    icon: <AppleIcon />,
    className: 'bg-black text-white hover:bg-gray-900',
  },
  meta: {
    label: 'Continue with Meta',
    icon: <MetaIcon />,
    className: 'bg-[#1877F2] text-white hover:bg-[#1565D8]',
  },
}

export const SocialButton: React.FC<SocialButtonProps> = ({ provider, onClick, className }) => {
  const config = PROVIDERS[provider]
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95',
        config.className,
        className
      )}
    >
      {config.icon}
      {config.label}
    </button>
  )
}

interface SocialAuthProps {
  onGoogle?: () => void
  onApple?: () => void
  onMeta?: () => void
}

export const SocialAuth: React.FC<SocialAuthProps> = ({ onGoogle, onApple, onMeta }) => (
  <div className="space-y-2.5">
    <SocialButton provider="google" onClick={onGoogle} />
    <SocialButton provider="apple" onClick={onApple} />
    <SocialButton provider="meta" onClick={onMeta} />
  </div>
)

export const OrDivider: React.FC = () => (
  <div className="flex items-center gap-3 my-5">
    <div className="flex-1 h-px bg-gray-100" />
    <span className="text-xs text-gray-400 font-medium">or continue with email</span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
)
