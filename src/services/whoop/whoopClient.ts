// Whoop Developer API v2 client
// Docs: https://developer.whoop.com/api

const BASE_URL = 'https://api.prod.whoop.com/developer/v1'

// ─── Raw Whoop API response shapes ────────────────────────────────────────────

export interface WhoopUserProfile {
  user_id: number
  email: string
  first_name: string
  last_name: string
  avatar_url?: string
}

export interface WhoopRecovery {
  cycle_id: number
  sleep_id: number
  user_id: number
  created_at: string
  updated_at: string
  score_state: 'SCORED' | 'PENDING_SCORE' | 'UNSCORABLE'
  score: {
    user_calibrating: boolean
    recovery_score: number          // 0–100
    resting_heart_rate: number      // bpm
    hrv_rmssd_milli: number         // HRV in ms
    spo2_percentage?: number
    skin_temp_celsius?: number
  } | null
}

export interface WhoopCycle {
  id: number
  user_id: number
  created_at: string
  updated_at: string
  start: string
  end: string | null
  timezone_offset: string
  score_state: 'SCORED' | 'PENDING_SCORE' | 'UNSCORABLE'
  score: {
    strain: number                  // 0–21 Whoop strain score
    kilojoule: number               // energy expenditure
    average_heart_rate: number
    max_heart_rate: number
  } | null
}

export interface WhoopSleep {
  id: number
  user_id: number
  created_at: string
  updated_at: string
  start: string
  end: string
  nap: boolean
  score_state: 'SCORED' | 'PENDING_SCORE' | 'UNSCORABLE'
  score: {
    stage_summary: {
      total_in_bed_time_milli: number
      total_awake_time_milli: number
      total_no_data_time_milli: number
      total_light_sleep_time_milli: number
      total_slow_wave_sleep_time_milli: number
      total_rem_sleep_time_milli: number
      sleep_cycle_count: number
      disturbance_count: number
    }
    sleep_needed: {
      baseline_milli: number
      need_from_sleep_debt_milli: number
      need_from_recent_strain_milli: number
      need_from_recent_nap_milli: number
    }
    respiratory_rate?: number
    sleep_performance_percentage: number   // 0–100
    sleep_consistency_percentage: number   // 0–100
    sleep_efficiency_percentage: number    // 0–100
  } | null
}

export interface WhoopWorkout {
  id: number
  user_id: number
  created_at: string
  updated_at: string
  start: string
  end: string
  timezone_offset: string
  sport_id: number
  score_state: 'SCORED' | 'PENDING_SCORE' | 'UNSCORABLE'
  score: {
    strain: number
    average_heart_rate: number
    max_heart_rate: number
    kilojoule: number
    percent_recorded: number
    distance_meter?: number
    altitude_gain_meter?: number
    altitude_change_meter?: number
    zone_duration: {
      zone_zero_milli?: number
      zone_one_milli?: number
      zone_two_milli?: number
      zone_three_milli?: number
      zone_four_milli?: number
      zone_five_milli?: number
    }
  } | null
}

export interface WhoopBodyMeasurement {
  height_meter: number
  weight_kilogram: number
  max_heart_rate: number
}

export interface WhoopPaginatedResponse<T> {
  records: T[]
  next_token?: string
}

// ─── API client ───────────────────────────────────────────────────────────────

async function whoopFetch<T>(
  path: string,
  accessToken: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (res.status === 401) throw new Error('WHOOP_TOKEN_EXPIRED')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Whoop API error ${res.status}`)
  }

  return res.json()
}

// ─── Public API functions ─────────────────────────────────────────────────────

export async function fetchWhoopProfile(token: string): Promise<WhoopUserProfile> {
  return whoopFetch<WhoopUserProfile>('/user/profile/basic', token)
}

export async function fetchLatestRecovery(token: string): Promise<WhoopRecovery | null> {
  const data = await whoopFetch<WhoopPaginatedResponse<WhoopRecovery>>('/recovery', token, {
    limit: '1',
  })
  return data.records[0] ?? null
}

export async function fetchRecentCycles(token: string, days = 30): Promise<WhoopCycle[]> {
  const start = new Date()
  start.setDate(start.getDate() - days)
  const data = await whoopFetch<WhoopPaginatedResponse<WhoopCycle>>('/cycle', token, {
    start: start.toISOString(),
    limit: '25',
  })
  return data.records
}

export async function fetchLatestSleep(token: string): Promise<WhoopSleep | null> {
  const data = await whoopFetch<WhoopPaginatedResponse<WhoopSleep>>('/sleep', token, {
    limit: '1',
  })
  return data.records[0] ?? null
}

export async function fetchRecentSleep(token: string, days = 30): Promise<WhoopSleep[]> {
  const start = new Date()
  start.setDate(start.getDate() - days)
  const data = await whoopFetch<WhoopPaginatedResponse<WhoopSleep>>('/sleep', token, {
    start: start.toISOString(),
    limit: '25',
  })
  return data.records
}

export async function fetchRecentWorkouts(token: string, days = 30): Promise<WhoopWorkout[]> {
  const start = new Date()
  start.setDate(start.getDate() - days)
  const data = await whoopFetch<WhoopPaginatedResponse<WhoopWorkout>>('/workout', token, {
    start: start.toISOString(),
    limit: '25',
  })
  return data.records
}

export async function fetchBodyMeasurement(token: string): Promise<WhoopBodyMeasurement> {
  return whoopFetch<WhoopBodyMeasurement>('/user/measurement/body', token)
}

// Map Whoop sport IDs to readable names (partial — full list in Whoop docs)
export const WHOOP_SPORT_NAMES: Record<number, string> = {
  0: 'Running', 1: 'Cycling', 16: 'Baseball', 17: 'Basketball', 18: 'Rowing',
  19: 'Fencing', 20: 'Field Hockey', 21: 'Football', 22: 'Golf', 24: 'Ice Hockey',
  25: 'Lacrosse', 27: 'Rugby', 28: 'Soccer', 29: 'Softball', 30: 'Squash',
  31: 'Swimming', 33: 'Tennis', 34: 'Track & Field', 35: 'Volleyball', 36: 'Water Polo',
  37: 'Wrestling', 38: 'Boxing', 41: 'Yoga', 42: 'Weightlifting',
  44: 'Cross Country Skiing', 45: 'Skiing', 46: 'Snowboarding', 47: 'Gymnastics',
  48: 'Hiking / Rucking', 49: 'Horseback Riding', 52: 'Pilates', 53: 'Pickleball',
  55: 'Parkour', 56: 'Brazilian Jiu-Jitsu', 57: 'Dance', 58: 'Bouldering / Rock Climbing',
  63: 'HIIT', 64: 'Spin', 70: 'CrossFit', 71: 'Functional Fitness', 225: 'Walking',
} as Record<number, string>

// -1 (unknown activity) not a valid numeric key in strict mode — handle at callsite with ?? 'Activity'
