import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '../../utils'

interface PageWrapperProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  back?: boolean
  action?: React.ReactNode
  className?: string
  noPadding?: boolean
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, title, subtitle, back, action, className, noPadding }) => {
  const navigate = useNavigate()
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {(title || back || action) && (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            {back && (
              <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex-1 min-w-0">
              {title && <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>}
              {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </header>
      )}
      <div className={cn(!noPadding && 'max-w-2xl mx-auto px-4 py-5')}>{children}</div>
    </div>
  )
}
