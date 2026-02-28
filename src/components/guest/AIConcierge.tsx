import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  streamConcierge,
  getConciergeProfile,
  playDeepgramTTS,
  ConciergeProfileResponse,
} from '../../services/api'

/* ── Sentence-boundary TTS: speaks each sentence via Deepgram as it streams in ── */
class StreamingTTS {
  private queue: string[] = []
  private speaking = false
  private buffer = ''
  private _onStateChange: (() => void) | null = null
  private _cancelled = false

  onStateChange(cb: () => void) { this._onStateChange = cb }

  /** Feed a new token from the stream. Queues sentence for Deepgram TTS when boundary hit. */
  feedToken(token: string) {
    if (this._cancelled) return
    this.buffer += token
    // Check for sentence boundaries
    const sentenceEnd = /[.!?]\s*$/
    if (sentenceEnd.test(this.buffer)) {
      const sentence = this.buffer.trim()
      this.buffer = ''
      if (sentence) {
        this.queue.push(sentence)
        this._processQueue()
      }
    }
  }

  /** Flush any remaining text in the buffer (call when stream ends). */
  flush() {
    if (this._cancelled) return
    if (this.buffer.trim()) {
      this.queue.push(this.buffer.trim())
      this.buffer = ''
      this._processQueue()
    }
  }

  private async _processQueue() {
    if (this.speaking || this.queue.length === 0 || this._cancelled) return
    this.speaking = true
    this._onStateChange?.()

    while (this.queue.length > 0 && !this._cancelled) {
      const sentence = this.queue.shift()!
      try {
        await playDeepgramTTS(sentence)
      } catch (e) {
        console.warn('Deepgram TTS error for sentence:', e)
      }
    }

    this.speaking = false
    this._onStateChange?.()
  }

  cancel() {
    this._cancelled = true
    this.queue = []
    this.buffer = ''
    this.speaking = false
    this._onStateChange?.()
    // Reset cancelled flag after a tick so next usage works
    setTimeout(() => { this._cancelled = false }, 50)
  }

  get isSpeaking() { return this.speaking }
}

/* ── Chat Message Type ── */
interface ChatMessage {
  id: string
  role: 'concierge' | 'guest'
  text: string
  timestamp: Date
  isTTS?: boolean
}

/* ── Component ── */
const AIConcierge: React.FC = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingText, setStreamingText] = useState<string>('')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [autoTTS, setAutoTTS] = useState(true)
  const [profile, setProfile] = useState<ConciergeProfileResponse['profile'] | null>(null)
  const [greetingDone, setGreetingDone] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const ttsRef = useRef<StreamingTTS>(new StreamingTTS())

  // Sync speaking state
  useEffect(() => {
    ttsRef.current.onStateChange(() => setSpeaking(ttsRef.current.isSpeaking))
  }, [])

  // Scroll chat to bottom
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])
  useEffect(() => { scrollToBottom() }, [messages, streamingText, scrollToBottom])

  // Load profile & generate streaming greeting on mount
  useEffect(() => {
    if (!user?.guest_id || greetingDone) return

    const init = async () => {
      // Load profile
      try {
        const res = await getConciergeProfile(user.guest_id!)
        if (res.success) setProfile(res.profile)
      } catch { /* ignore */ }

      // Stream personalized greeting
      setLoading(true)
      setStreamingText('')
      try {
        const fullText = await streamConcierge(
          {
            guest_id: user.guest_id!,
            guest_name: user.full_name || 'Guest',
            is_greeting: true,
          },
          (token, _accumulated) => {
            setStreamingText(prev => prev + token)
            if (autoTTS) ttsRef.current.feedToken(token)
          },
        )
        if (autoTTS) ttsRef.current.flush()

        // Move streamed text into messages
        const msg: ChatMessage = {
          id: `greeting-${Date.now()}`,
          role: 'concierge',
          text: fullText || `Welcome to Imperial Access Lounge, ${user.full_name || 'Guest'}.`,
          timestamp: new Date(),
          isTTS: true,
        }
        setMessages([msg])
        setStreamingText('')
        setGreetingDone(true)
      } catch (e) {
        console.warn('Greeting stream failed:', e)
        const fallback: ChatMessage = {
          id: `fallback-${Date.now()}`,
          role: 'concierge',
          text: `Welcome to Imperial Access Lounge, ${user.full_name || 'Guest'}. How may I assist you today?`,
          timestamp: new Date(),
          isTTS: true,
        }
        setMessages([fallback])
        setStreamingText('')
        setGreetingDone(true)
        if (autoTTS) {
          try { await playDeepgramTTS(fallback.text) } catch { /* ignore */ }
        }
      }
      setLoading(false)
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.guest_id])

  // Send message with streaming response
  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    ttsRef.current.cancel() // Stop any ongoing speech

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'guest',
      text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setStreamingText('')

    try {
      const fullText = await streamConcierge(
        {
          message: text,
          guest_id: user?.guest_id || '',
          guest_name: user?.full_name || 'Guest',
          is_greeting: false,
        },
        (token) => {
          setStreamingText(prev => prev + token)
          if (autoTTS) ttsRef.current.feedToken(token)
        },
      )
      if (autoTTS) ttsRef.current.flush()

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'concierge',
        text: fullText,
        timestamp: new Date(),
        isTTS: true,
      }
      setMessages(prev => [...prev, aiMsg])
      setStreamingText('')
    } catch (e) {
      console.warn('Stream error:', e)
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'concierge',
        text: 'I apologize, I encountered a brief interruption. Please try again.',
        timestamp: new Date(),
        isTTS: true,
      }
      setMessages(prev => [...prev, errMsg])
      setStreamingText('')
    }
    setLoading(false)
    inputRef.current?.focus()
  }

  // Play individual message TTS via Deepgram
  const handlePlayTTS = async (text: string) => {
    if (speaking) return
    setSpeaking(true)
    try {
      await playDeepgramTTS(text)
    } catch { /* ignore */ }
    setSpeaking(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="ea-dash-grid" style={{ gridTemplateColumns: '1fr', gap: 0 }}>
      <div className="ea-concierge-container">
        {/* Header */}
        <div className="ea-concierge-header">
          <div className="ea-concierge-header-left">
            <div className="ea-concierge-avatar">
              <SvgConciergeIcon />
              {speaking && <div className="ea-concierge-speaking-ring" />}
            </div>
            <div>
              <h3 className="ea-concierge-title">AI Concierge</h3>
              <p className="ea-concierge-status">
                {speaking ? (
                  <><span className="ea-concierge-dot ea-concierge-dot-speaking" /> Speaking...</>
                ) : loading ? (
                  <><span className="ea-concierge-dot ea-concierge-dot-thinking" /> Thinking...</>
                ) : (
                  <><span className="ea-concierge-dot ea-concierge-dot-online" /> Online</>
                )}
              </p>
            </div>
          </div>
          <div className="ea-concierge-header-right">
            <label className="ea-concierge-tts-toggle" title="Auto-play voice responses">
              <SvgSpeakerIcon on={autoTTS} />
              <input
                type="checkbox"
                checked={autoTTS}
                onChange={(e) => setAutoTTS(e.target.checked)}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: 11, color: autoTTS ? '#c5a47e' : 'rgba(255,255,255,0.3)' }}>
                {autoTTS ? 'Voice On' : 'Voice Off'}
              </span>
            </label>
          </div>
        </div>

        {/* Profile Card (if loaded) */}
        {profile && (
          <div className="ea-concierge-profile-card">
            <div className="ea-concierge-profile-item">
              <SvgUserMini />
              <span>{profile.full_name}</span>
            </div>
            {profile.flight_number && (
              <div className="ea-concierge-profile-item">
                <SvgPlaneMini />
                <span>{profile.airline ? `${profile.airline} ` : ''}{profile.flight_number}
                  {profile.departure_time ? ` · ${profile.departure_time}` : ''}
                  {profile.gate ? ` · Gate ${profile.gate}` : ''}
                </span>
              </div>
            )}
            {profile.dining_tokens_remaining > 0 && (
              <div className="ea-concierge-profile-item">
                <SvgTokenMini />
                <span>{profile.dining_tokens_remaining} dining token{profile.dining_tokens_remaining > 1 ? 's' : ''} available</span>
              </div>
            )}
            <div className="ea-concierge-profile-item">
              <SvgShieldMini />
              <span style={{ textTransform: 'capitalize' }}>{profile.membership_type} Member</span>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="ea-concierge-chat">
          {messages.map((msg) => (
            <div key={msg.id} className={`ea-concierge-msg ea-concierge-msg-${msg.role}`}>
              {msg.role === 'concierge' && (
                <div className="ea-concierge-msg-avatar">
                  <SvgConciergeSmall />
                </div>
              )}
              <div className="ea-concierge-msg-bubble">
                <p>{msg.text}</p>
                <div className="ea-concierge-msg-meta">
                  <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.role === 'concierge' && msg.isTTS && (
                    <button
                      className="ea-concierge-play-btn"
                      onClick={() => handlePlayTTS(msg.text)}
                      disabled={speaking}
                      title="Play voice"
                    >
                      {speaking ? <SvgWaveIcon /> : <SvgPlayIcon />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="ea-concierge-msg ea-concierge-msg-concierge">
              <div className="ea-concierge-msg-avatar">
                <SvgConciergeSmall />
              </div>
              <div className="ea-concierge-msg-bubble ea-concierge-typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="ea-concierge-input-bar">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the concierge anything..."
            className="ea-concierge-input"
            disabled={loading}
          />
          <button
            className="ea-concierge-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            <SvgSendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── SVG Icons ── */

function SvgConciergeIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="12" stroke="#c5a47e" strokeWidth="1.5" />
      <path d="M14 6c-3.5 0-6 2-6 4.5 0 1.5.8 2.8 2 3.5v2l2.5-1.5c.5.1 1 .1 1.5.1 3.5 0 6-2 6-4.5S17.5 6 14 6z" stroke="#c5a47e" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="1" fill="#c5a47e" />
      <circle cx="14" cy="11" r="1" fill="#c5a47e" />
      <circle cx="17" cy="11" r="1" fill="#c5a47e" />
      <path d="M8 20c1.5 2 3.5 3 6 3s4.5-1 6-3" stroke="#c5a47e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SvgConciergeSmall() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="rgba(197,164,126,0.15)" stroke="#c5a47e" strokeWidth="1" />
      <circle cx="6" cy="7" r="0.8" fill="#c5a47e" />
      <circle cx="8" cy="7" r="0.8" fill="#c5a47e" />
      <circle cx="10" cy="7" r="0.8" fill="#c5a47e" />
    </svg>
  )
}

function SvgSpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
      <path d="M2 6v4h3l4 3V3L5 6H2z" fill={on ? '#c5a47e' : 'rgba(255,255,255,0.2)'} />
      {on && (
        <>
          <path d="M11 5.5c.8.7 1.2 1.5 1.2 2.5s-.4 1.8-1.2 2.5" stroke="#c5a47e" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M12.5 3.5c1.3 1.2 2 2.7 2 4.5s-.7 3.3-2 4.5" stroke="#c5a47e" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
      {!on && <path d="M11 5l4 6M15 5l-4 6" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" />}
    </svg>
  )
}

function SvgPlayIcon() {
  return (
    <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
      <path d="M3 2l7 4-7 4V2z" fill="#c5a47e" />
    </svg>
  )
}

function SvgWaveIcon() {
  return (
    <svg width="12" height="12" fill="none" viewBox="0 0 12 12" className="ea-wave-anim">
      <rect x="1" y="4" width="1.5" height="4" rx="0.75" fill="#c5a47e" />
      <rect x="3.5" y="2" width="1.5" height="8" rx="0.75" fill="#c5a47e" />
      <rect x="6" y="3" width="1.5" height="6" rx="0.75" fill="#c5a47e" />
      <rect x="8.5" y="4" width="1.5" height="4" rx="0.75" fill="#c5a47e" />
    </svg>
  )
}

function SvgSendIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <path d="M2 9l14-7-4 7 4 7L2 9z" fill="#c5a47e" />
    </svg>
  )
}

function SvgUserMini() {
  return <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><circle cx="6" cy="4" r="2.5" stroke="#c5a47e" strokeWidth="1"/><path d="M1.5 11c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="#c5a47e" strokeWidth="1" strokeLinecap="round"/></svg>
}
function SvgPlaneMini() {
  return <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M6 1l2 4h3l-1 1.5H7.5L6 11 4.5 6.5H2L1 5h3l2-4z" fill="#c5a47e"/></svg>
}
function SvgTokenMini() {
  return <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" stroke="#c5a47e" strokeWidth="1"/><path d="M6 3v3l2 1.5" stroke="#c5a47e" strokeWidth="1" strokeLinecap="round"/></svg>
}
function SvgShieldMini() {
  return <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M6 1L2 3v3c0 2.5 1.7 4.5 4 5 2.3-.5 4-2.5 4-5V3L6 1z" stroke="#c5a47e" strokeWidth="1" strokeLinejoin="round"/><path d="M4.5 6l1 1 2-2" stroke="#c5a47e" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

export default AIConcierge
