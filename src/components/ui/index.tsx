import React from 'react'
import { cn } from '../../utils'

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}
export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', loading, fullWidth, children, className, disabled, ...props }) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
  const variants = {
    primary: 'bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow',
    secondary: 'bg-green-50 text-green-700 hover:bg-green-100',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    outline: 'border-2 border-green-500 text-green-600 hover:bg-green-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' }
  return (
    <button className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)} disabled={disabled || loading} {...props}>
      {loading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
      {children}
    </button>
  )
}

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}
export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input className={cn('w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all', icon ? 'pl-10' : undefined, error ? 'border-red-400' : undefined, className)} {...props} />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

// Card
interface CardProps { children: React.ReactNode; className?: string; onClick?: () => void; padding?: boolean }
export const Card: React.FC<CardProps> = ({ children, className, onClick, padding = true }) => (
  <div onClick={onClick} className={cn('bg-white rounded-2xl card-shadow', padding && 'p-5', onClick && 'cursor-pointer hover:shadow-md transition-shadow', className)}>{children}</div>
)

// Badge
interface BadgeProps { children: React.ReactNode; color?: string; className?: string }
export const Badge: React.FC<BadgeProps> = ({ children, color = '#52a07c', className }) => (
  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', className)} style={{ backgroundColor: color + '20', color }}>{children}</span>
)

// Spinner
export const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#52a07c' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke={color} strokeWidth="4"/>
    <path className="opacity-75" fill={color} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
)

// Avatar
interface AvatarProps { name: string; src?: string; size?: 'sm' | 'md' | 'lg' }
export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' }
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  if (src) return <img src={src} alt={name} className={cn('rounded-full object-cover', sizes[size])} />
  return <div className={cn('rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center', sizes[size])}>{initials}</div>
}

// Toggle
interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; label?: string }
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    {label && <span className="text-sm text-gray-700">{label}</span>}
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={cn('relative w-11 h-6 rounded-full transition-colors duration-200', checked ? 'bg-green-500' : 'bg-gray-200')}>
      <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200', checked && 'translate-x-5')} />
    </button>
  </label>
)

// Progress Ring (SVG circular)
interface ProgressRingProps { value: number; max?: number; size?: number; strokeWidth?: number; color?: string; children?: React.ReactNode }
export const ProgressRing: React.FC<ProgressRingProps> = ({ value, max = 100, size = 120, strokeWidth = 10, color = '#52a07c', children }) => {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const offset = circumference - pct * circumference
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

// Skeleton
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse bg-gray-100 rounded-xl', className)} />
)

// Modal
interface ModalProps { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }
export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {title && (
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// Halal Badge
export const HalalBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
    ☽ Halal
  </span>
)

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; options: { value: string; label: string }[] }
export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <select className={cn('w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100', className)} {...props}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)
