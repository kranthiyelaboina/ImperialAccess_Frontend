/**
 * ImperialAccess — API Service Layer
 * Handles all communication with the Flask backend.
 * Uses Vite proxy in dev (/api → localhost:5000).
 */

const API_BASE = import.meta.env.VITE_API_URL || ''

/**
 * Direct backend URL for MJPEG video streams.
 * MJPEG (multipart/x-mixed-replace) does NOT work reliably through
 * Vite's dev proxy because the proxy may buffer or timeout the
 * continuous streaming response. <img> tags are CORS-exempt, so
 * pointing directly at the backend is safe.
 */
const STREAM_BASE = import.meta.env.VITE_STREAM_URL || 'http://localhost:5000'

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

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (networkErr: any) {
    throw { status: 0, error: 'Network error — is the backend server running?', message: networkErr?.message }
  }

  // Safely parse JSON — guards against empty / HTML responses
  let data: any
  const text = await res.text()
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw { status: res.status, error: `Server returned non-JSON response (${res.status})`, body: text.slice(0, 200) }
  }

  if (!res.ok) throw { status: res.status, ...data }
  return data as T
}

/* ── Auth ── */

export interface LoginResponse {
  success: boolean
  token: string
  user: {
    id: string
    username: string
    full_name: string
    role: 'admin' | 'guest'
    face_registered?: boolean
    membership_type?: string
    guest_id?: string
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
  user_id: string
  guest_id: string
  message: string
  next_step?: string
  face_registered: boolean
}

export const registerGuest = (data: RegisterGuestPayload) =>
  request<RegisterGuestResponse>('POST', '/api/register_guest', data)

export interface FaceRegisterResponse {
  success: boolean
  embeddings_collected: number
  message: string
}

export const registerFace = (guest_id: string, name: string) =>
  request<FaceRegisterResponse>('POST', '/api/register_guest/face', { guest_id, name }, true)

/* ── Lounge Registration ── */

export interface RegisterLoungeResponse {
  success: boolean
  registration_id: string
  lounge_name: string
  amount_due?: number
  currency?: string
  payment_required: boolean
  access_granted?: boolean
  message?: string
}

export const registerLounge = (guest_id: string, lounge_name: string) =>
  request<RegisterLoungeResponse>('POST', '/api/register_lounge', { guest_id, lounge_name }, true)

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

export const checkCredit = (guest_id: string, card_last_four: string, card_type: string, card_network: string) =>
  request<CreditCheckResponse>('POST', '/api/check_credit', { guest_id, card_last_four, card_type, card_network }, true)

/* ── Payment ── */

export interface PaymentConfirmResponse {
  success: boolean
  payment_id: string
  status: string
  access_granted: boolean
  valid_until: string
  dining_tokens_issued: number
  message: string
}

export const confirmPayment = (data: {
  registration_id: string
  guest_id: string
  amount: number
  card_last_four: string
  card_type: string
  transaction_ref?: string
}) => request<PaymentConfirmResponse>('POST', '/api/payment_confirmation', data, true)

/* ── Guest Dashboard ── */

export interface GuestDashboardData {
  success: boolean
  guest: {
    full_name: string
    email: string | null
    membership_type: string
    face_registered: boolean
    boarding_pass_no: string | null
    airline: string | null
    flight_number: string | null
    departure_time: string | null
  }
  lounge_access: {
    active: boolean
    lounge_name: string | null
    registered_at: string | null
    valid_until: string | null
    payment_status: string | null
  } | null
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
  agent_state: {
    running: boolean
    mode: string | null
    occupancy: number
    faces_detected: number
    recognized_faces: string[]
  }
  recent_events: {
    id: string
    event_type: string
    face_name: string | null
    confidence: number | null
    timestamp: string | null
    mode: string | null
  }[]
  stats: {
    today_entries: number
    today_exits: number
    current_occupancy: number
    today_registrations: number
    total_guests: number
  }
}

export const getAdminDashboard = () =>
  request<AdminDashboardData>('GET', '/api/admin_dashboard', undefined, true)

/* ── Agent ── */

export interface AgentState {
  success: boolean
  state: {
    running: boolean
    mode: string | null
    occupancy: number
    occupancy_count?: number
    occupancy_map?: Record<string, unknown>
    faces_detected: number
    recognized_names: string[]
    [key: string]: unknown
  }
}

export const getAgentState = () =>
  request<AgentState>('GET', '/api/agent/state', undefined, true)

export interface ChangeModeResponse {
  success: boolean
  current_mode: string
  occupancy: number
  message: string
}

export const changeMode = (mode: string) =>
  request<ChangeModeResponse>('POST', '/api/change_modes', { mode }, true)

/* ── Analytics ── */

export interface AnalyticsData {
  success: boolean
  period: { start: string; end: string }
  summary: {
    total_entries: number
    total_exits: number
    unique_guests: number
    peak_occupancy: number
  }
  hourly_breakdown: { hour: string; entries: number; exits: number }[]
}

export const getAnalytics = (date?: string, range?: string, mode?: string) => {
  const params = new URLSearchParams()
  if (date) params.set('date', date)
  if (range) params.set('range', range)
  if (mode) params.set('mode', mode)
  const qs = params.toString() ? `?${params}` : ''
  return request<AnalyticsData>('GET', `/api/analytics${qs}`, undefined, true)
}

/* ── Dining Tokens ── */

export const issueDiningToken = (guest_id: string) =>
  request<{ success: boolean; token_code: string; message: string }>('POST', '/api/dining_token/issue', { guest_id }, true)

export const redeemDiningToken = (token_code: string) =>
  request<{ success: boolean; message: string }>('POST', '/api/dining_token/redeem', { token_code }, true)

/* ── Guest Management ── */

export interface GuestListResponse {
  success: boolean
  guests: {
    guest_id: string
    user_id?: string
    full_name: string
    email: string | null
    membership_type: string
    face_registered: boolean
    boarding_pass_no?: string
    airline?: string
    created_at: string | null
  }[]
  total: number
  page: number
  per_page: number
}

export const getGuests = (page?: number, search?: string) => {
  const params = new URLSearchParams()
  if (page) params.set('page', String(page))
  if (search) params.set('search', search)
  const qs = params.toString() ? `?${params}` : ''
  return request<GuestListResponse>('GET', `/api/guests${qs}`, undefined, true)
}

export const deleteGuestFace = (guest_id: string) =>
  request<{ success: boolean; message: string }>('DELETE', `/api/guests/${guest_id}/face`, undefined, true)

/* ── Agent Events ── */

export interface AgentEvent {
  id: string
  event_type: string
  face_name: string | null
  confidence: number | null
  timestamp: string | null
  mode: string | null
  details?: Record<string, unknown>
}

export const getAgentEvents = (since?: string) => {
  const qs = since ? `?since=${encodeURIComponent(since)}` : ''
  return request<{ success: boolean; events: AgentEvent[]; count: number }>('GET', `/api/agent/events${qs}`, undefined, true)
}

/* ── Video Feed URLs ── */
/**
 * Returns a direct URL to the backend MJPEG stream.
 * Uses STREAM_BASE (bypasses Vite proxy) so the <img> tag
 * receives the raw multipart/x-mixed-replace response.
 */
export const getVideoFeedUrl = () => `${STREAM_BASE}/api/agent/video_feed`

/**
 * Returns a direct URL to the face-registration MJPEG stream.
 * Shows camera with registration-specific overlays: bounding box,
 * progress bar, embedding count, and "move head" instructions —
 * exactly like register_face.py does locally.
 */
export const getRegisterFeedUrl = () => `${STREAM_BASE}/api/agent/register_feed`

/* ── Concierge (GenAI Voice — Groq Streaming) ── */

export interface ConciergeGreetingResponse {
  success: boolean
  greeting: string
  guest_name: string
  flight_info?: string | null
  token_info?: string | null
  fallback?: boolean
}

export const getConciergeGreeting = (guest_id: string, guest_name: string, prompt?: string) =>
  request<ConciergeGreetingResponse>('POST', '/api/concierge/greeting', { guest_id, guest_name, prompt }, true)

export interface ConciergeChatResponse {
  success: boolean
  reply: string
  fallback?: boolean
}

export const conciergeChat = (message: string, guest_id: string, guest_name: string) =>
  request<ConciergeChatResponse>('POST', '/api/concierge/chat', { message, guest_id, guest_name }, true)

export interface ConciergeProfileResponse {
  success: boolean
  profile: {
    full_name: string
    membership_type: string
    flight_number: string | null
    airline: string | null
    departure_time: string | null
    gate: string | null
    face_registered: boolean
    dining_tokens_remaining: number
  }
}

export const getConciergeProfile = (guest_id: string) =>
  request<ConciergeProfileResponse>('GET', `/api/concierge/profile?guest_id=${encodeURIComponent(guest_id)}`, undefined, true)

/**
 * Stream concierge response from Groq via SSE.
 * Calls the provided callback with each token as it arrives.
 * Returns the full accumulated text when done.
 */
export async function streamConcierge(
  payload: {
    message?: string
    guest_id?: string
    guest_name?: string
    is_greeting?: boolean
  },
  onToken: (token: string, fullText: string) => void,
): Promise<string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('ea_token')
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/api/concierge/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Stream failed (${res.status}): ${errText.slice(0, 200)}`)
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let accumulated = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // Parse SSE lines
    const lines = buffer.split('\n')
    buffer = lines.pop() || '' // Keep incomplete line in buffer

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data: ')) continue

      const data = trimmed.slice(6) // Remove "data: "
      if (data === '[DONE]') continue

      try {
        const parsed = JSON.parse(data)
        if (parsed.token) {
          accumulated += parsed.token
          onToken(parsed.token, accumulated)
        }
      } catch {
        // skip malformed JSON
      }
    }
  }

  return accumulated
}

/**
 * Request Deepgram TTS audio from backend and return as ArrayBuffer (WAV).
 * Uses male voice (aura-2-orpheus-en) via backend proxy.
 */
export async function conciergeTTS(text: string): Promise<ArrayBuffer> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('ea_token')
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/api/concierge/tts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`TTS failed (${res.status}): ${errText.slice(0, 200)}`)
  }

  return res.arrayBuffer()
}

/**
 * Play Deepgram TTS audio in the browser.
 * Fetches WAV from backend, decodes, and plays via AudioContext or HTML5 Audio.
 * Returns a promise that resolves when playback finishes.
 */
export async function playDeepgramTTS(text: string): Promise<void> {
  const audioBuf = await conciergeTTS(text)
  const blob = new Blob([audioBuf], { type: 'audio/wav' })
  const url = URL.createObjectURL(blob)

  return new Promise<void>((resolve) => {
    const audio = new Audio(url)
    audio.onended = () => { URL.revokeObjectURL(url); resolve() }
    audio.onerror = () => { URL.revokeObjectURL(url); resolve() }
    audio.play().catch(() => { URL.revokeObjectURL(url); resolve() })
  })
}
