import React, { useState } from 'react'
import { CheckCircle, Zap, Crown, Leaf } from 'lucide-react'
import { Button, Badge } from '../../components/ui'
import { SUBSCRIPTION_PLANS } from '../../constants'
import { formatAED, cn } from '../../utils'
import type { BillingCycle } from '../../types'

const PLAN_ICONS: Record<string, React.ReactNode> = {
  free: <Leaf size={24} />,
  pro: <Zap size={24} />,
  elite: <Crown size={24} />,
}

export const SubscriptionPage: React.FC = () => {
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white px-5 pt-8 pb-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Choose Your Plan</h1>
          <p className="text-gray-500 text-sm">All prices in AED. Cancel anytime. No hidden fees.</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className={cn('text-sm font-medium', billing === 'monthly' ? 'text-gray-900' : 'text-gray-400')}>Monthly</span>
            <button onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
              className={cn('relative w-12 h-6 rounded-full transition-colors duration-200', billing === 'annual' ? 'bg-green-500' : 'bg-gray-200')}>
              <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200', billing === 'annual' && 'translate-x-6')} />
            </button>
            <span className={cn('text-sm font-medium', billing === 'annual' ? 'text-gray-900' : 'text-gray-400')}>
              Annual <span className="text-green-600 text-xs font-bold">Save 15%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {SUBSCRIPTION_PLANS.map(plan => {
          const price = billing === 'monthly' ? plan.priceAEDMonthly : Math.round(plan.priceAEDAnnual / 12)
          const annualTotal = plan.priceAEDAnnual

          return (
            <div key={plan.id} className={cn('rounded-3xl p-6 border-2 transition-all', plan.highlighted ? 'surface-shimmer-tinted border-green-500 pop-shadow shimmer-edge' : 'bg-white border-gray-100', selectedPlan === plan.id && 'ring-2 ring-green-400')}>
              {plan.highlighted && (
                <div className="mb-3">
                  <Badge color="#52a07c" className="text-xs font-bold">⭐ Most Popular</Badge>
                </div>
              )}

              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: plan.badgeColor + '20', color: plan.badgeColor }}>
                    {PLAN_ICONS[plan.id]}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">{plan.nameEn}</h3>
                    {plan.trainerAccess && <span className="text-xs text-green-600 font-semibold">Includes Trainer Access</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-gray-900">
                    {price === 0 ? 'Free' : `AED ${price}`}
                  </p>
                  {price > 0 && (
                    <p className="text-xs text-gray-400">
                      {billing === 'monthly' ? '/month' : `/month · ${formatAED(annualTotal)}/year`}
                    </p>
                  )}
                </div>
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                fullWidth
                variant={plan.highlighted ? 'primary' : 'outline'}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(plan.id === 'elite' && 'border-amber-400 text-amber-600 hover:bg-amber-50')}
              >
                {plan.id === 'free' ? 'Current Plan' : `Upgrade to ${plan.nameEn}`}
              </Button>
            </div>
          )
        })}

        {/* Feature comparison */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <h3 className="font-extrabold text-gray-900 mb-4">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-gray-400 font-medium pb-3">Feature</th>
                  <th className="text-center text-gray-400 font-medium pb-3 px-2">Free</th>
                  <th className="text-center text-green-600 font-bold pb-3 px-2">Pro</th>
                  <th className="text-center text-amber-500 font-bold pb-3 px-2">Elite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  ['AI Chat Messages', '10/mo', '100/mo', 'Unlimited'],
                  ['AI Meal Plans', '✗', 'Weekly', 'Daily'],
                  ['AI Workout Gen.', '✗', '✓', '✓'],
                  ['Recipe Library', '20 recipes', 'Full', 'Full + Custom'],
                  ['Trainer Access', '✗', '✗', '✓'],
                  ['Progress Insights', '✗', '✗', 'AI-powered'],
                  ['Ramadan Plans', '✗', '✓', '✓'],
                  ['UAE Sourcing', '✓', '✓', '✓'],
                ].map(([feature, free, pro, elite]) => (
                  <tr key={feature}>
                    <td className="py-2.5 text-gray-700">{feature}</td>
                    <td className="py-2.5 text-center text-gray-400 px-2">{free}</td>
                    <td className="py-2.5 text-center text-green-600 font-semibold px-2">{pro}</td>
                    <td className="py-2.5 text-center text-amber-500 font-semibold px-2">{elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 border border-green-100 text-center">
          <p className="text-sm text-green-700 font-medium">🔒 Secure payment via Telr · UAE-licensed payment gateway</p>
          <p className="text-xs text-green-600 mt-1">AED pricing · No hidden fees · Cancel anytime</p>
        </div>
      </div>
    </div>
  )
}
