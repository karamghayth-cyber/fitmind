// Whoop OAuth 2.0 — Authorization Code + PKCE flow
// Token exchange MUST go through a backend proxy in production.
// The VITE_WHOOP_CLIENT_SECRET must never be exposed in browser bundles.

const WHOOP_AUTH_URL = 'https://api.prod.whoop.com/oauth/oauth2/auth'
const WHOOP_TOKEN_URL = 'https://api.prod.whoop.com/oauth/oauth2/token'

const SCOPES = [
  'read:recovery',
  'read:cycles',
  'read:sleep',
  'read:workout',
  'read:profile',
  'read:body_measurement',
  'offline',
].join(' ')

// PKCE helpers
async function generateCodeVerifier(): Promise<string> {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array)).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' }[c] || ''))
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' }[c] || ''))
}

export async function buildAuthorizationUrl(): Promise<{ url: string; codeVerifier: string }> {
  const clientId = import.meta.env.VITE_WHOOP_CLIENT_ID
  const redirectUri = import.meta.env.VITE_WHOOP_REDIRECT_URI || `${window.location.origin}/whoop/callback`

  if (!clientId) throw new Error('VITE_WHOOP_CLIENT_ID is not set')

  const codeVerifier = await generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = crypto.randomUUID()

  sessionStorage.setItem('whoop_pkce_verifier', codeVerifier)
  sessionStorage.setItem('whoop_oauth_state', state)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  return { url: `${WHOOP_AUTH_URL}?${params}`, codeVerifier }
}

export interface WhoopTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  scope: string
  expires_at: number // unix ms
}

export async function exchangeCodeForTokens(code: string, state: string): Promise<WhoopTokens> {
  const savedState = sessionStorage.getItem('whoop_oauth_state')
  if (state !== savedState) throw new Error('OAuth state mismatch — possible CSRF attack')

  const codeVerifier = sessionStorage.getItem('whoop_pkce_verifier')
  if (!codeVerifier) throw new Error('Missing PKCE code verifier')

  const clientId = import.meta.env.VITE_WHOOP_CLIENT_ID
  const clientSecret = import.meta.env.VITE_WHOOP_CLIENT_SECRET
  const redirectUri = import.meta.env.VITE_WHOOP_REDIRECT_URI || `${window.location.origin}/whoop/callback`

  // ⚠️  In production: POST to your own backend endpoint which holds the secret
  //    e.g. POST /api/whoop/token { code, code_verifier }
  //    The backend calls Whoop and returns tokens.
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    ...(clientSecret ? { client_secret: clientSecret } : {}),
    code_verifier: codeVerifier,
  })

  const res = await fetch(WHOOP_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error_description || 'Failed to exchange Whoop authorization code')
  }

  const tokens = await res.json()
  return { ...tokens, expires_at: Date.now() + tokens.expires_in * 1000 }
}

export async function refreshAccessToken(refreshToken: string): Promise<WhoopTokens> {
  const clientId = import.meta.env.VITE_WHOOP_CLIENT_ID
  const clientSecret = import.meta.env.VITE_WHOOP_CLIENT_SECRET

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    ...(clientSecret ? { client_secret: clientSecret } : {}),
    scope: SCOPES,
  })

  const res = await fetch(WHOOP_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) throw new Error('Failed to refresh Whoop access token')
  const tokens = await res.json()
  return { ...tokens, expires_at: Date.now() + tokens.expires_in * 1000 }
}
