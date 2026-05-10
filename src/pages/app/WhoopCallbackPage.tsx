import React, { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spinner } from '../../components/ui'
import { useWhoopStore } from '../../stores/whoopStore'

export const WhoopCallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { handleCallback, error } = useWhoopStore()
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const code = params.get('code')
    const state = params.get('state')
    const oauthError = params.get('error')

    if (oauthError) {
      navigate('/app/profile?whoop=error&reason=' + encodeURIComponent(params.get('error_description') || oauthError))
      return
    }

    if (!code || !state) {
      navigate('/app/profile?whoop=error&reason=missing_params')
      return
    }

    handleCallback(code, state).then(() => {
      navigate('/app/profile?whoop=connected')
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center">
        <span className="text-white text-2xl font-black">W</span>
      </div>
      {error ? (
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">Connection failed</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button onClick={() => navigate('/app/profile')} className="mt-4 text-green-600 text-sm font-semibold underline">
            Back to profile
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Spinner size={28} />
          <p className="text-gray-700 font-semibold mt-3">Connecting your Whoop…</p>
          <p className="text-gray-400 text-sm mt-1">Syncing recovery, sleep, and strain data</p>
        </div>
      )}
    </div>
  )
}
