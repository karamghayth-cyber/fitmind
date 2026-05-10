import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { RefreshCw, Unlink, CheckCircle, ArrowLeft, Zap, Moon, Heart, Dumbbell, AlertCircle } from 'lucide-react'
import { Card, Button, Spinner } from '../../components/ui'
import { useWhoopStore } from '../../stores/whoopStore'
import { WHOOP_SPORT_NAMES } from '../../services/whoop/whoopClient'
import { cn } from '../../utils'

const WhoopLogo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div
    className="rounded-xl bg-black flex items-center justify-center flex-shrink-0"
    style={{ width: size, height: size }}
  >
    <span className="text-white font-black" style={{ fontSize: size * 0.45 }}>W</span>
  </div>
)

const MetricRow: React.FC<{ icon: React.ReactNode; label: string; value: string; sub?: string }> = ({ icon, label, value, sub }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
    {sub && <p className="text-xs text-gray-400 flex-shrink-0">{sub}</p>}
  </div>
)

export const WhoopConnectPage: React.FC = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { isConnected, profile, latestRecovery, latestSleep, recentCycles, recentWorkouts, lastSynced, isSyncing, error, connect, disconnect, sync } = useWhoopStore()

  const justConnected = params.get('whoop') === 'connected'
  const connectionError = params.get('whoop') === 'error'

  const recovery = latestRecovery?.score
  const sleep = latestSleep?.score
  const todayCycle = recentCycles[0]?.score
  const totalSleepH = sleep
    ? Math.round(((sleep.stage_summary.total_light_sleep_time_milli + sleep.stage_summary.total_slow_wave_sleep_time_milli + sleep.stage_summary.total_rem_sleep_time_milli) / 3_600_000) * 10) / 10
    : null

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <WhoopLogo size={32} />
          <div className="flex-1">
            <h1 className="font-extrabold text-gray-900">Whoop Integration</h1>
            <p className="text-xs text-gray-400">Recovery, sleep, and strain data</p>
          </div>
          {isConnected && (
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Connected
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* Status banners */}
        {justConnected && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-800">Whoop connected successfully!</p>
              <p className="text-xs text-green-600">Your recovery and sleep data is now syncing.</p>
            </div>
          </div>
        )}
        {(connectionError || error) && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-700">Connection issue</p>
              <p className="text-xs text-red-500">{params.get('reason') || error || 'Please try again.'}</p>
            </div>
          </div>
        )}

        {!isConnected ? (
          /* ── Not connected ── */
          <>
            <Card>
              <div className="flex items-center gap-4 mb-5">
                <WhoopLogo size={48} />
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">Connect your Whoop</h2>
                  <p className="text-sm text-gray-500">Import real-time recovery, sleep, and strain data into FitMind.</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  { icon: <Zap size={16} />, label: 'Recovery Score', desc: '0–100 daily recovery score synced automatically' },
                  { icon: <Heart size={16} />, label: 'HRV & Resting HR', desc: 'Heart rate variability and resting heart rate' },
                  { icon: <Moon size={16} />, label: 'Sleep Analysis', desc: 'Total sleep, REM, deep, light stages + quality score' },
                  { icon: <Dumbbell size={16} />, label: 'Strain & Workouts', desc: 'Daily strain score and logged workout activities' },
                ].map(f => (
                  <div key={f.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500 mt-0.5">{f.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{f.label}</p>
                      <p className="text-xs text-gray-400">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button fullWidth size="lg" onClick={() => connect()} loading={isSyncing}>
                <WhoopLogo size={20} /> Connect Whoop Account
              </Button>
              <p className="text-xs text-gray-400 text-center mt-3">
                You'll be redirected to Whoop to authorise. FitMind only reads your data — we never write to Whoop.
              </p>
            </Card>

            <Card className="border border-amber-100 bg-amber-50">
              <p className="text-xs font-bold text-amber-700 mb-1">Developer setup required</p>
              <p className="text-xs text-amber-600 leading-relaxed">
                Add <code className="bg-amber-100 px-1 rounded">VITE_WHOOP_CLIENT_ID</code> and <code className="bg-amber-100 px-1 rounded">VITE_WHOOP_REDIRECT_URI</code> to your <code className="bg-amber-100 px-1 rounded">.env</code> file. Register your app at <strong>developer.whoop.com</strong>.
              </p>
            </Card>
          </>
        ) : (
          /* ── Connected ── */
          <>
            {/* Profile */}
            {profile && (
              <Card>
                <div className="flex items-center gap-3">
                  <WhoopLogo size={40} />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{profile.first_name} {profile.last_name}</p>
                    <p className="text-xs text-gray-400">{profile.email}</p>
                  </div>
                  {lastSynced && (
                    <p className="text-xs text-gray-400 text-right flex-shrink-0">
                      Synced<br />{new Date(lastSynced).toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Live data */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Live Whoop Data</h3>
                <button onClick={() => sync()} disabled={isSyncing} className="flex items-center gap-1.5 text-xs text-green-600 font-semibold hover:text-green-700 disabled:opacity-50">
                  <RefreshCw size={13} className={cn(isSyncing && 'animate-spin')} /> Sync now
                </button>
              </div>

              {isSyncing ? (
                <div className="py-6 flex items-center justify-center gap-2 text-gray-400">
                  <Spinner size={18} /> <span className="text-sm">Syncing from Whoop…</span>
                </div>
              ) : (
                <>
                  {recovery && (
                    <MetricRow
                      icon={<Zap size={15} />}
                      label="Recovery Score"
                      value={`${Math.round(recovery.recovery_score)}%`}
                      sub={recovery.recovery_score >= 67 ? '🟢 Peak' : recovery.recovery_score >= 34 ? '🟡 Moderate' : '🔴 Low'}
                    />
                  )}
                  {recovery && (
                    <MetricRow icon={<Heart size={15} />} label="Resting Heart Rate" value={`${Math.round(recovery.resting_heart_rate)} bpm`} />
                  )}
                  {recovery && (
                    <MetricRow icon={<Heart size={15} />} label="HRV (RMSSD)" value={`${Math.round(recovery.hrv_rmssd_milli)} ms`} />
                  )}
                  {totalSleepH !== null && (
                    <MetricRow
                      icon={<Moon size={15} />}
                      label="Last Night's Sleep"
                      value={`${totalSleepH}h`}
                      sub={sleep ? `${Math.round(sleep.sleep_performance_percentage)}% performance` : ''}
                    />
                  )}
                  {todayCycle && (
                    <MetricRow
                      icon={<Zap size={15} />}
                      label="Today's Strain"
                      value={todayCycle.strain.toFixed(1)}
                      sub={`${Math.round(todayCycle.kilojoule / 4.184)} kcal`}
                    />
                  )}
                  {!recovery && !sleep && !todayCycle && (
                    <p className="text-sm text-gray-400 text-center py-4">No data yet — tap Sync now</p>
                  )}
                </>
              )}
            </Card>

            {/* Recent workouts */}
            {recentWorkouts.length > 0 && (
              <Card>
                <h3 className="font-bold text-gray-900 mb-3">Recent Whoop Workouts</h3>
                <div className="space-y-0.5">
                  {recentWorkouts.slice(0, 5).map(w => (
                    <div key={w.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{WHOOP_SPORT_NAMES[w.sport_id] || 'Activity'}</p>
                        <p className="text-xs text-gray-400">{new Date(w.start).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <div className="text-right">
                        {w.score && (
                          <>
                            <p className="text-sm font-bold text-gray-900">Strain {w.score.strain.toFixed(1)}</p>
                            <p className="text-xs text-gray-400">{Math.round(w.score.kilojoule / 4.184)} kcal</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Disconnect */}
            <button
              onClick={() => { if (confirm('Disconnect Whoop? Your synced data will be kept.')) disconnect() }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              <Unlink size={15} /> Disconnect Whoop
            </button>
          </>
        )}
      </div>
    </div>
  )
}
