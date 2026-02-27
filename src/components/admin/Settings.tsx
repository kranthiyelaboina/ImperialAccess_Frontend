import React, { useState } from 'react'

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    cameraUrl: 'rtsp://192.168.1.100:554/stream1',
    detectionThreshold: 75,
    defaultMode: 'gate',
    autoSwitchModes: true,
    notifyUnknown: true,
    maxOccupancy: 50,
    tokenLimitPerGuest: 3,
  })
  const [saved, setSaved] = useState(false)

  const update = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(197,164,126,0.25)',
    background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: 14, outline: 'none', width: '100%',
  }

  return (
    <>
      <div className="ea-dash-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Camera Config */}
        <div className="ea-dash-card">
          <h3 className="ea-dash-card-title">Camera Configuration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              Camera Stream URL
              <input
                type="text"
                value={settings.cameraUrl}
                onChange={e => update('cameraUrl', e.target.value)}
                style={{ ...inputStyle, marginTop: 6 }}
              />
            </label>
            <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              Detection Confidence Threshold: {settings.detectionThreshold}%
              <input
                type="range"
                min={30}
                max={99}
                value={settings.detectionThreshold}
                onChange={e => update('detectionThreshold', Number(e.target.value))}
                style={{ width: '100%', marginTop: 8, accentColor: '#c5a47e' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                <span>30% (Lenient)</span><span>99% (Strict)</span>
              </div>
            </label>
          </div>
        </div>

        {/* Agent Settings */}
        <div className="ea-dash-card">
          <h3 className="ea-dash-card-title">Agent Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              Default Mode
              <select
                value={settings.defaultMode}
                onChange={e => update('defaultMode', e.target.value)}
                style={{ ...inputStyle, marginTop: 6, background: 'rgba(15,12,8,0.9)' }}
              >
                <option value="gate">Gate</option>
                <option value="reception">Reception</option>
                <option value="entry">Entry</option>
                <option value="exit">Exit</option>
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.autoSwitchModes} onChange={e => update('autoSwitchModes', e.target.checked)} style={{ accentColor: '#c5a47e' }} />
              Auto-switch modes based on schedule
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.notifyUnknown} onChange={e => update('notifyUnknown', e.target.checked)} style={{ accentColor: '#c5a47e' }} />
              Alert on unknown face detection
            </label>
          </div>
        </div>

        {/* Capacity */}
        <div className="ea-dash-card">
          <h3 className="ea-dash-card-title">Capacity & Limits</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              Max Lounge Occupancy
              <input
                type="number"
                value={settings.maxOccupancy}
                onChange={e => update('maxOccupancy', Number(e.target.value))}
                style={{ ...inputStyle, marginTop: 6 }}
              />
            </label>
            <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              Dining Tokens per Guest
              <input
                type="number"
                value={settings.tokenLimitPerGuest}
                onChange={e => update('tokenLimitPerGuest', Number(e.target.value))}
                style={{ ...inputStyle, marginTop: 6 }}
              />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="ea-dash-card" style={{ borderColor: 'rgba(231,76,60,0.2)' }}>
          <h3 className="ea-dash-card-title" style={{ color: '#e74c3c' }}>Danger Zone</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="ea-dash-btn ea-dash-btn-outline" style={{ borderColor: 'rgba(231,76,60,0.3)', color: '#e74c3c' }} onClick={() => alert('Coming soon')}>
              Reset All Face Data
            </button>
            <button className="ea-dash-btn ea-dash-btn-outline" style={{ borderColor: 'rgba(231,76,60,0.3)', color: '#e74c3c' }} onClick={() => alert('Coming soon')}>
              Clear Event Log
            </button>
          </div>
        </div>
      </div>

      {/* Save */}
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        {saved && <span style={{ color: '#2ecc71', fontSize: 14, alignSelf: 'center' }}>Settings saved!</span>}
        <button className="ea-dash-btn ea-dash-btn-gold" onClick={save} style={{ padding: '10px 32px' }}>
          Save Settings
        </button>
      </div>
    </>
  )
}

export default Settings
