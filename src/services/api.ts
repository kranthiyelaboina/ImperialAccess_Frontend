/**
 * ImperialAccess — API Service Layer
 * Handles all communication with the Flask backend.
 * Base URL defaults to localhost:5000 for development.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/* ── Helpers ── */

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('ea_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  auth = false
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (auth) Object.assign(headers, authHeaders())

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw { status: res.status, ...data }
  return data as T
}

/* ── Auth ── */

export interface LoginResponse {
  success: boolean
  token: string
  user: {
    id: number
    username: string
    full_name: string
    role: 'admin' | 'guest'
    face_registered?: boolean
    membership_type?: string
  }
}

export const loginAdmin = (username: string, password: string) =>
  request<LoginResponse>('POST', '/api/login_admin', { username, password })

export const loginGuest = (username: string, password: string) =>
  request<LoginResponse>('POST', '/api/login_guest', { username, password })

/* ── Registration ── */

export interface RegisterGuestPayload {
  username: string
  password: string
  full_name: string
  email: string
  phone: string
  boarding_pass_no?: string
  airline?: string
  flight_number?: string
  departure_time?: string
}

export interface RegisterGuestResponse {
  success: boolean
  user_id: number
  guest_id: number
  message: string
  next_step: string
  face_registered: boolean
}

export const registerGuest = (data: RegisterGuestPayload) =>
  request<RegisterGuestResponse>('POST', '/api/register_guest', data)

export interface FaceRegisterResponse {
  success: boolean
  embeddings_collected: number
  message: string
}

export const registerFace = (guest_id: number, name: string) =>
  request<FaceRegisterResponse>('POST', '/api/register_guest/face', { guest_id, name })

/* ── Lounge Registration ── */

export interface RegisterLoungeResponse {
  success: boolean
  registration_id: number
  lounge_name: string
  amount_due?: number
  currency?: string
  payment_required: boolean
  access_granted?: boolean
  message?: string
  redirect_to?: string
}

export const registerLounge = (guest_id: number, lounge_name: string, membership_type: string) =>
  request<RegisterLoungeResponse>('POST', '/api/register_lounge', { guest_id, lounge_name, membership_type }, true)

/* ── Credit Check ── */

export interface CreditCheckResponse {
  success: boolean
  eligible: boolean
  benefit_type?: string
  max_visits?: number
  visits_used?: number
  visits_remaining?: number
  message: string
  amount_due?: number
}

export const checkCredit = (guest_id: number, card_last_four: string, card_type: string, card_network: string) =>
  request<CreditCheckResponse>('POST', '/api/check_credit', { guest_id, card_last_four, card_type, card_network }, true)

/* ── Payment ── */

export interface PaymentConfirmResponse {
  success: boolean
  payment_id: number
  status: string
  access_granted: boolean
  valid_until: string
  dining_tokens_issued: number
  message: string
}

export const confirmPayment = (data: {
  registration_id: number
  guest_id: number
  amount: number
  card_last_four: string
  card_type: string
  transaction_ref: string
}) => request<PaymentConfirmResponse>('POST', '/api/payment_confirmation', data, true)

/* ── Guest Dashboard ── */

export interface GuestDashboardData {
  success: boolean
  guest: {
    full_name: string
    email: string
    membership_type: string
    face_registered: boolean
    boarding_pass_no: string
    airline: string
    flight_number: string
    departure_time: string
  }
  lounge_access: {
    active: boolean
    lounge_name: string
    registered_at: string
    valid_until: string
    payment_status: string
  }
  dining_tokens: {
    total: number
    redeemed: number
    remaining: number
    tokens: { token_code: string; redeemed: boolean; redeemed_at: string | null }[]
  }
  attendance_history: {
    event: string
    time: string
    mode?: string
    duration_minutes?: number
  }[]
}

export const getGuestDashboard = () =>
  request<GuestDashboardData>('GET', '/api/guest_dashboard', undefined, true)

/* ── Admin Dashboard ── */

export interface AdminDashboardData {
  success: boolean
  agent: {
    mode: string
    occupancy_count: number
    occupancy: { name: string; entered_at: string }[]
    registered_members: string[]
    todays_attendance_count: number
  }
  recent_events: {
    event_type: string
    name: string
    confidence: number
    timestamp: string
  }[]
  stats: {
    total_guests_today: number
    currently_inside: number
    unknown_alerts: number
    dining_tokens_issued: number
    avg_stay_minutes: number
  }
}

export const getAdminDashboard = () =>
  request<AdminDashboardData>('GET', '/api/admin_dashboard', undefined, true)

/* ── Agent ── */

export interface AgentState {
  mode: string
  occupancy_count: number
  occupancy: { name: string; entered_at: string }[]
}

export const getAgentState = () =>
  request<AgentState>('GET', '/api/agent/state', undefined, true)

export interface ChangeModeResponse {
  success: boolean
  previous_mode: string
  current_mode: string
  occupancy: { inside: { name: string; entered_at: string }[]; count: number }
  session_log: { name: string; event: string; time: string; duration_minutes?: number }[]
}

export const changeMode = (mode: string) =>
  request<ChangeModeResponse>('POST', '/api/change_modes', { mode }, true)

/* ── Analytics ── */

export interface AnalyticsData {
  success: boolean
  date: string
  attendance: { total_today: number; entries: { name: string; time: string; mode: string; event: string; duration_minutes?: number }[] }
  analytics: {
    peak_hour: string
    avg_stay_minutes: number
    busiest_day_this_week: string
    total_this_week: number
    unique_guests_this_week: number
    unknown_alerts_today: number
    repeat_visitors: number
    dining_tokens_redeemed_today: number
  }
  hourly_breakdown: { hour: string; entries: number; exits: number }[]
}

export const getAnalytics = (date?: string, range?: string) => {
  const params = new URLSearchParams()
  if (date) params.set('date', date)
  if (range) params.set('range', range)
  const qs = params.toString() ? `?${params}` : ''
  return request<AnalyticsData>('GET', `/api/analytics${qs}`, undefined, true)
}

/* ── Dining Tokens ── */

export const issueDiningToken = (guest_id: number) =>
  request<{ success: boolean; token_code: string }>('POST', '/api/dining_token/issue', { guest_id }, true)

export const redeemDiningToken = (token_code: string) =>
  request<{ success: boolean; message: string }>('POST', '/api/dining_token/redeem', { token_code }, true)

/* ── Guest Management ── */

export const getGuests = () =>
  request<{ success: boolean; guests: unknown[] }>('GET', '/api/guests', undefined, true)

export const deleteGuestFace = (guest_id: number) =>
  request<{ success: boolean; message: string }>('DELETE', `/api/guests/${guest_id}/face`, undefined, true)

/* ── Agent Events ── */

export const getAgentEvents = (since?: string) => {
  const qs = since ? `?since=${encodeURIComponent(since)}` : ''
  return request<{ events: unknown[] }>('GET', `/api/agent/events${qs}`, undefined, true)
}
