import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Upload } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, Button, Avatar, Badge } from '../../components/ui'
import { cn } from '../../utils'

const MOCK_WEIGHT_DATA = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 1}`,
  weight: 72 - i * 0.4 + (Math.random() - 0.5) * 0.3,
}))

export const ClientDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'nutrition' | 'workouts' | 'progress'>('overview')

  const client = { name: 'Fatima Al Rashidi', goal: 'Weight Loss', streak: 12, progress: 78, email: 'fatima@example.com' }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white px-5 pt-safe-top border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <Avatar name={client.name} size="md" />
            <div className="flex-1">
              <h2 className="font-extrabold text-gray-900">{client.name}</h2>
              <p className="text-xs text-gray-400">{client.goal} · 🔥 {client.streak}d streak</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost"><MessageCircle size={16} /></Button>
              <Button size="sm"><Upload size={14} /> Assign</Button>
            </div>
          </div>
          <div className="flex gap-1">
            {(['overview', 'nutrition', 'workouts', 'progress'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn('flex-1 py-2.5 text-xs font-semibold border-b-2 transition-all capitalize', activeTab === tab ? 'border-green-500 text-green-600' : 'border-transparent text-gray-400')}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Progress', value: `${client.progress}%`, color: '#52a07c' },
                { label: 'Workouts', value: '22', color: '#3B82F6' },
                { label: 'Adherence', value: '87%', color: '#F59E0B' },
              ].map(s => (
                <Card key={s.label} className="text-center">
                  <p className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </Card>
              ))}
            </div>

            <Card>
              <h3 className="font-bold text-gray-900 mb-3">Weight Progress</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={MOCK_WEIGHT_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip formatter={(v: unknown) => [`${(v as number).toFixed(1)} kg`, 'Weight']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="weight" stroke="#52a07c" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="font-bold text-gray-900 mb-3">Trainer Notes</h3>
              <textarea rows={4} placeholder="Add notes about this client's progress, form, or lifestyle..." className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm resize-none focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none" defaultValue="Fatima is responding well to the caloric deficit. Hunger is manageable. Consider adding 1 more cardio session per week." />
              <Button size="sm" className="mt-3">Save Notes</Button>
            </Card>
          </>
        )}

        {activeTab === 'workouts' && (
          <div className="space-y-3">
            <Button variant="outline" fullWidth><Upload size={16} /> Upload New Workout</Button>
            {['Upper Body Strength', 'HIIT Cardio Blast', 'Leg Day Power'].map((w, i) => (
              <Card key={w}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{w}</p>
                    <p className="text-xs text-gray-400">Assigned {3 - i} weeks ago</p>
                  </div>
                  <Badge color="#52a07c">Active</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-3">
            <Card>
              <h3 className="font-bold text-gray-900 mb-3">This Week's Averages</h3>
              <div className="space-y-2">
                {[
                  { label: 'Calories', current: 1720, target: 1800, color: '#52a07c' },
                  { label: 'Protein', current: 132, target: 140, color: '#3B82F6' },
                  { label: 'Adherence', current: 87, target: 100, color: '#F59E0B' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{m.label}</span>
                      <span className="font-bold text-gray-800">{m.current} / {m.target}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min((m.current / m.target) * 100, 100)}%`, backgroundColor: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-3">
            <Card>
              <h3 className="font-bold text-gray-900 mb-2">Body Composition</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[{ label: 'Weight', value: '71.2 kg', sub: '-2.8kg' }, { label: 'Body Fat', value: '28%', sub: '-3%' }, { label: 'Muscle', value: '51 kg', sub: '+1.2kg' }].map(m => (
                  <div key={m.label} className="bg-gray-50 rounded-2xl p-3">
                    <p className="text-base font-extrabold text-gray-900">{m.value}</p>
                    <p className="text-xs text-green-600 font-semibold">{m.sub}</p>
                    <p className="text-xs text-gray-400">{m.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
