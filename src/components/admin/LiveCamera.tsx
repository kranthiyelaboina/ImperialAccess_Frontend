import React, { useEffect, useState } from 'react'
import { getAgentState, getAgentEvents, getVideoFeedUrl, type AgentState, type AgentEvent } from '../../services/api'

const LiveCamera: React.FC = () => {
  const [agentState, setAgentState] = useState<AgentState['state'] | null>(null)
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [streamError, setStreamError] = useState(false)
  const [streamKey, setStreamKey] = useState(0) // increment to force <img> reload

  useEffect(() => {
    getAgentState().then(d => setAgentState(d.state)).catch(() => {})
    getAgentEvents().then(d => setEvents((d.events || []).slice(0, 5))).catch(() => {})

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      getAgentState().then(d => setAgentState(d.state)).catch(() => {})
      getAgentEvents().then(d => setEvents((d.events || []).slice(0, 5))).catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const retryStream = () => {
    setStreamError(false)
    setStreamKey(k => k + 1) // remount <img> with fresh URL to restart the MJPEG connection
  }

  return (
  <>
    <div className="ea-dash-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
      {/* Camera Feed */}
      <div className="ea-dash-card" style={{ minHeight: 600 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="ea-dash-card-title" style={{ margin: 0 }}>Live Camera Feed</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: agentState?.running ? '#e74c3c' : '#999', boxShadow: agentState?.running ? '0 0 8px #e74c3c' : 'none', animation: agentState?.running ? 'pulse 2s infinite' : 'none' }} />
            <span style={{ color: agentState?.running ? '#e74c3c' : '#999', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
              {agentState?.running ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
        {!streamError ? (
          <img
            key={streamKey}
            src={`${getVideoFeedUrl()}${streamKey ? `?t=${streamKey}` : ''}`}
            alt="Live Camera Feed"
            style={{ width: '100%', height: 520, borderRadius: 12, objectFit: 'cover', background: '#000' }}
            onError={() => setStreamError(true)}
          />
        ) : (
        <div style={{
          width: '100%', height: 520, borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(197,164,126,0.06), rgba(0,0,0,0.4))',
          border: '1px solid rgba(197,164,126,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12,
        }}>
          <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
            <rect x="6" y="14" width="52" height="36" rx="6" stroke="#c5a47e" strokeWidth="2.5" opacity=".5" />
            <circle cx="32" cy="32" r="10" stroke="#c5a47e" strokeWidth="2" />
            <circle cx="32" cy="32" r="4" fill="#c5a47e" opacity=".4" />
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16, fontWeight: 500 }}>Camera stream unavailable</span>
          <span style={{ color: 'rgba(197,164,126,0.5)', fontSize: 12 }}>Ensure the backend camera agent is running</span>
          <button
            style={{
              marginTop: 10, background: 'rgba(197,164,126,0.15)', border: '1px solid rgba(197,164,126,0.4)',
              color: '#c5a47e', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}
            onClick={retryStream}
          >
            Retry Connection
          </button>
        </div>
        )}
      </div>

      {/* Detection Panel */}
      <div className="ea-dash-card">
        <h3 className="ea-dash-card-title">Detection Panel</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {events.length > 0 ? events.map((ev, i) => {
            const isGranted = ev.event_type === 'access_granted'
            const color = isGranted ? '#2ecc71' : ev.event_type === 'access_denied' ? '#e74c3c' : '#f39c12'
            const status = isGranted ? 'Recognized' : ev.event_type === 'access_denied' ? 'Denied' : 'Analyzing...'
            return (
              <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#fff', fontWeight: 500, fontSize: 14 }}>{ev.face_name || 'Unknown'}</span>
                <span style={{ color, fontSize: 12, fontWeight: 600 }}>{status}</span>
              </div>
              <div style={{ width: '100%', height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ width: `${ev.confidence ?? 0}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${color}60, ${color})` }} />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Confidence: {ev.confidence ?? 0}%</div>
            </div>
          )}) : (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>No detections yet</p>
          )}
        </div>

        {agentState && (
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Agent Info</h4>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Mode: <span style={{ textTransform: 'capitalize', color: '#c5a47e' }}>{agentState.mode}</span></div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Occupancy: {agentState.occupancy}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Faces Detected: {agentState.faces_detected}</div>
        </div>
        )}
      </div>
    </div>
  </>
  )
}

export default LiveCamera
