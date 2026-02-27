import React from 'react'

const LiveCamera: React.FC = () => (
  <>
    <div className="ea-dash-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
      {/* Camera Feed */}
      <div className="ea-dash-card" style={{ minHeight: 420 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="ea-dash-card-title" style={{ margin: 0 }}>Live Camera Feed</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e74c3c', boxShadow: '0 0 8px #e74c3c', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#e74c3c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>LIVE</span>
          </div>
        </div>
        <div style={{
          width: '100%', height: 340, borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(197,164,126,0.06), rgba(0,0,0,0.4))',
          border: '1px solid rgba(197,164,126,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12,
        }}>
          <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
            <rect x="6" y="14" width="52" height="36" rx="6" stroke="#c5a47e" strokeWidth="2.5" opacity=".5" />
            <circle cx="32" cy="32" r="10" stroke="#c5a47e" strokeWidth="2" />
            <circle cx="32" cy="32" r="4" fill="#c5a47e" opacity=".4" />
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Camera stream will appear here</span>
          <span style={{ color: 'rgba(197,164,126,0.5)', fontSize: 12 }}>Connect backend to enable live detection</span>
        </div>
      </div>

      {/* Detection Panel */}
      <div className="ea-dash-card">
        <h3 className="ea-dash-card-title">Detection Panel</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'Jane Smith', status: 'Recognized', confidence: 92, color: '#2ecc71' },
            { name: 'Unknown #47', status: 'Analyzing...', confidence: 45, color: '#f39c12' },
            { name: 'John Doe', status: 'Recognized', confidence: 88, color: '#2ecc71' },
          ].map((d, i) => (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#fff', fontWeight: 500, fontSize: 14 }}>{d.name}</span>
                <span style={{ color: d.color, fontSize: 12, fontWeight: 600 }}>{d.status}</span>
              </div>
              <div style={{ width: '100%', height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ width: `${d.confidence}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${d.color}60, ${d.color})` }} />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Confidence: {d.confidence}%</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Agent Overlays</h4>
          {['Face bounding boxes', 'Name labels', 'Confidence scores'].map((overlay, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#c5a47e' }} />
              {overlay}
            </label>
          ))}
        </div>
      </div>
    </div>
  </>
)

export default LiveCamera
