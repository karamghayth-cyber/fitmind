import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Dumbbell, TrendingUp, ChevronRight, Plus, Upload, Bot } from 'lucide-react'
import { Card, Button, Avatar } from '../../components/ui'
import { useUserStore } from '../../stores/userStore'

const MOCK_CLIENTS = [
  { id: 'c1', name: 'Fatima Al Rashidi', goal: 'Weight Loss', lastActive: '2h ago', progress: 78, avatar: '', streak: 12 },
  { id: 'c2', name: 'Ahmed Khalil', goal: 'Muscle Gain', lastActive: '1d ago', progress: 65, avatar: '', streak: 8 },
  { id: 'c3', name: 'Priya Nair', goal: 'General Health', lastActive: '3h ago', progress: 90, avatar: '', streak: 21 },
  { id: 'c4', name: 'Omar Al Mansoori', goal: 'Endurance', lastActive: '5h ago', progress: 55, avatar: '', streak: 5 },
]

export const TrainerDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { profile } = useUserStore()
  const [showUpload, setShowUpload] = useState(false)

  const stats = [
    { label: 'Active Clients', value: '4', icon: Users, color: '#52a07c' },
    { label: 'Workouts This Week', value: '12', icon: Dumbbell, color: '#F59E0B' },
    { label: 'Avg Progress', value: '72%', icon: TrendingUp, color: '#3B82F6' },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white px-5 pt-8 pb-5 border-b border-gray-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Trainer Portal</p>
            <h1 className="text-2xl font-extrabold text-gray-900">{profile?.displayName || 'Coach'}</h1>
          </div>
          <Button size="sm" onClick={() => setShowUpload(true)}>
            <Upload size={14} /> Upload Workout
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <Card key={s.label} className="text-center">
              <div className="w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: s.color + '20', color: s.color }}>
                <s.icon size={16} />
              </div>
              <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* AI insights card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl green-gradient flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-green-700 mb-1">AI Trainer Insight</p>
              <p className="text-sm text-gray-700 leading-relaxed">Fatima has been consistently hitting her protein targets. Consider increasing her training load by 10% this week. Ahmed's recovery scores suggest he needs an extra rest day.</p>
            </div>
          </div>
        </Card>

        {/* Client list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">My Clients</h3>
            <button onClick={() => navigate('/trainer/clients')} className="text-green-600 text-sm font-semibold flex items-center gap-1">View all <ChevronRight size={14} /></button>
          </div>
          <div className="space-y-3">
            {MOCK_CLIENTS.map(client => (
              <Card key={client.id} onClick={() => navigate(`/trainer/clients/${client.id}`)} className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <Avatar name={client.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900 text-sm truncate">{client.name}</p>
                      <span className="text-xs text-gray-400 flex-shrink-0">{client.lastActive}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1.5">{client.goal} · 🔥 {client.streak}d streak</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${client.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-green-600 flex-shrink-0">{client.progress}%</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" fullWidth onClick={() => navigate('/trainer/workout-builder')}>
            <Plus size={16} /> New Workout
          </Button>
          <Button variant="outline" fullWidth onClick={() => navigate('/trainer/clients')}>
            <Users size={16} /> Manage Clients
          </Button>
        </div>

        {/* Recent activity */}
        <Card>
          <h3 className="font-bold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { text: 'Fatima completed Leg Day Power', time: '2h ago', emoji: '💪' },
              { text: 'Ahmed logged 8.5h sleep', time: '5h ago', emoji: '😴' },
              { text: 'Priya hit protein target for 7 days', time: '1d ago', emoji: '🎯' },
              { text: 'Omar started Upper Body Strength', time: '1d ago', emoji: '🏋️' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{a.emoji}</span>
                <p className="flex-1 text-sm text-gray-700">{a.text}</p>
                <span className="text-xs text-gray-400">{a.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowUpload(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Workout for Client</h3>
            <div className="space-y-3">
              <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-500">
                {MOCK_CLIENTS.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
              <input type="text" placeholder="Workout name" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-500" />
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                <Upload size={24} className="mx-auto mb-2" />
                <p className="text-sm">Drop workout file or click to upload</p>
                <p className="text-xs mt-1">PDF, CSV, or create from template</p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" fullWidth onClick={() => setShowUpload(false)}>Cancel</Button>
                <Button fullWidth onClick={() => { setShowUpload(false) }}>Upload Workout</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
