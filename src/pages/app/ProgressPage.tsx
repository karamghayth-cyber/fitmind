import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingDown, TrendingUp, Minus, Plus } from 'lucide-react'
import { Card, Button, Modal, Input } from '../../components/ui'
import { useProgressStore } from '../../stores/progressStore'
import { cn } from '../../utils'

type Period = 7 | 30 | 90 | 180

export const ProgressPage: React.FC = () => {
  const { bodyMetrics, dailyMetrics, selectedPeriod, setPeriod, addBodyMetric } = useProgressStore()
  const [activeMetric, setActiveMetric] = useState<'weight' | 'bodyFat' | 'steps' | 'sleep' | 'calories'>('weight')
  const [logModal, setLogModal] = useState(false)
  const [weightInput, setWeightInput] = useState('')
  const [bodyFatInput, setBodyFatInput] = useState('')

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - selectedPeriod)
  const cutoffStr = cutoffDate.toISOString().split('T')[0]

  const filteredBodyMetrics = bodyMetrics.filter(m => m.date >= cutoffStr)
  const filteredDailyMetrics = dailyMetrics.filter(m => m.date >= cutoffStr)

  const weightData = filteredBodyMetrics.map(m => ({ date: m.date.slice(5), value: m.weightKg })).filter(m => m.value)
  const bodyFatData = filteredBodyMetrics.map(m => ({ date: m.date.slice(5), value: m.bodyFatPercent })).filter(m => m.value)
  const stepsData = filteredDailyMetrics.map(m => ({ date: m.date.slice(5), value: m.stepsCount })).filter(m => m.value)
  const sleepData = filteredDailyMetrics.map(m => ({ date: m.date.slice(5), value: m.sleepHours })).filter(m => m.value)
  const caloriesData = filteredDailyMetrics.map(m => ({ date: m.date.slice(5), value: m.activeCalories })).filter(m => m.value)

  const METRIC_CONFIGS = {
    weight: { label: 'Weight (kg)', data: weightData, color: '#52a07c', unit: 'kg' },
    bodyFat: { label: 'Body Fat (%)', data: bodyFatData, color: '#F59E0B', unit: '%' },
    steps: { label: 'Daily Steps', data: stepsData, color: '#3B82F6', unit: '' },
    sleep: { label: 'Sleep (hrs)', data: sleepData, color: '#8B5CF6', unit: 'h' },
    calories: { label: 'Active Calories', data: caloriesData, color: '#EF4444', unit: 'kcal' },
  }

  const current = METRIC_CONFIGS[activeMetric]
  const values = current.data.map(d => d.value as number)
  const first = values[0]
  const last = values[values.length - 1]
  const change = first && last ? last - first : 0
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0

  const latestWeight = filteredBodyMetrics[filteredBodyMetrics.length - 1]?.weightKg || bodyMetrics[bodyMetrics.length - 1]?.weightKg || 0
  const startWeight = bodyMetrics[0]?.weightKg || latestWeight
  const weightDelta = latestWeight - startWeight

  const handleLogBody = () => {
    const w = parseFloat(weightInput)
    const bf = parseFloat(bodyFatInput)
    if (w > 0) addBodyMetric({ date: new Date().toISOString().split('T')[0], weightKg: w, bodyFatPercent: bf || undefined })
    setLogModal(false)
    setWeightInput('')
    setBodyFatInput('')
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white px-5 pt-8 pb-5 border-b border-gray-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-900">Progress</h1>
          <Button size="sm" onClick={() => setLogModal(true)}>
            <Plus size={14} /> Log
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-2xl font-extrabold text-gray-900">{latestWeight}</p>
            <p className="text-xs text-gray-400">kg current</p>
            <div className={cn('flex items-center justify-center gap-0.5 text-xs font-semibold mt-1', weightDelta < 0 ? 'text-green-500' : weightDelta > 0 ? 'text-red-400' : 'text-gray-400')}>
              {weightDelta < 0 ? <TrendingDown size={12} /> : weightDelta > 0 ? <TrendingUp size={12} /> : <Minus size={12} />}
              {Math.abs(weightDelta).toFixed(1)}kg
            </div>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-extrabold text-green-600">{filteredBodyMetrics.length}</p>
            <p className="text-xs text-gray-400">check-ins</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-extrabold text-purple-600">{Math.round(filteredDailyMetrics.reduce((a, m) => a + (m.sleepHours || 0), 0) / Math.max(filteredDailyMetrics.length, 1) * 10) / 10}h</p>
            <p className="text-xs text-gray-400">avg sleep</p>
          </Card>
        </div>

        {/* Period selector */}
        <div className="flex gap-2">
          {([7, 30, 90, 180] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn('flex-1 py-2 rounded-xl text-sm font-semibold transition-all', selectedPeriod === p ? 'bg-green-500 text-white' : 'bg-white text-gray-500 border border-gray-200')}>
              {p}D
            </button>
          ))}
        </div>

        {/* Metric tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {(Object.keys(METRIC_CONFIGS) as Array<keyof typeof METRIC_CONFIGS>).map(key => (
            <button key={key} onClick={() => setActiveMetric(key)}
              className={cn('flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all', activeMetric === key ? 'text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200')}
              style={activeMetric === key ? { backgroundColor: METRIC_CONFIGS[key].color } : {}}>
              {METRIC_CONFIGS[key].label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-500">{current.label}</p>
              {last && <p className="text-2xl font-extrabold text-gray-900">{typeof last === 'number' ? last.toFixed(1) : last}{current.unit}</p>}
            </div>
            <div className="text-right">
              <p className={cn('text-sm font-bold', change < 0 ? 'text-green-500' : change > 0 ? 'text-red-400' : 'text-gray-400')}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}{current.unit}
              </p>
              <p className="text-xs text-gray-400">vs {selectedPeriod}d ago</p>
            </div>
          </div>

          {current.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={current.data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={current.color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={current.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval={Math.floor(current.data.length / 5)} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip formatter={(v: unknown) => [`${(v as number).toFixed(1)}${current.unit}`, current.label]} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="value" stroke={current.color} strokeWidth={2.5} fill="url(#chartGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-300">
              <p>No data for this period</p>
            </div>
          )}

          <div className="flex justify-between mt-2 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <span>Avg: <strong>{avg.toFixed(1)}{current.unit}</strong></span>
            <span>Entries: <strong>{current.data.length}</strong></span>
          </div>
        </Card>

        {/* Recovery trend */}
        <Card>
          <h3 className="font-bold text-gray-900 mb-3">Recovery Score Trend</h3>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={filteredDailyMetrics.slice(-14).map(m => ({ date: m.date.slice(5), score: m.recoveryScore }))} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="score" stroke="#52a07c" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Modal open={logModal} onClose={() => setLogModal(false)} title="Log Body Metrics">
        <div className="space-y-4">
          <Input label="Weight (kg)" type="number" value={weightInput} onChange={e => setWeightInput(e.target.value)} placeholder="e.g. 79.5" />
          <Input label="Body Fat % (optional)" type="number" value={bodyFatInput} onChange={e => setBodyFatInput(e.target.value)} placeholder="e.g. 20.5" />
          <Button fullWidth onClick={handleLogBody} disabled={!weightInput}>Save Metrics</Button>
        </div>
      </Modal>
    </div>
  )
}
