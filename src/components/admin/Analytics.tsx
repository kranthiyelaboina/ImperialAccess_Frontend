import React, { useState, useEffect } from 'react'
import { getAnalytics, type AnalyticsData } from '../../services/api'

const Analytics: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
    getAnalytics(date).then(d => setData(d)).catch(() => setError('Failed to load analytics'))
  }, [date])

  const hourly = data?.hourly_breakdown ?? []
  const maxEntries = Math.max(...hourly.map(h => h.entries), 1)
  const peakHour = hourly.reduce((best, h) => h.entries > (best?.entries ?? 0) ? h : best, hourly[0])

  return (
    <>
      {/* Date picker */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(197,164,126,0.25)',
            background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: 14, outline: 'none',
          }}
        />
      </div>

      {error && (
        <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="ea-dash-stats">
        {[
          { label: 'Total Entries', value: data?.summary?.total_entries ?? 0 },
          { label: 'Total Exits', value: data?.summary?.total_exits ?? 0 },
          { label: 'Unique Guests', value: data?.summary?.unique_guests ?? 0 },
          { label: 'Peak Occupancy', value: data?.summary?.peak_occupancy ?? 0 },
        ].map((kpi, i) => (
          <div className="ea-dash-stat-card" key={i}>
            <div>
              <div className="ea-dash-stat-value">{kpi.value}</div>
              <div className="ea-dash-stat-label">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Breakdown (Bar Chart) */}
      <div className="ea-dash-card" style={{ marginTop: 20 }}>
        <h3 className="ea-dash-card-title">Hourly Entry Breakdown</h3>
        {hourly.length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, paddingTop: 20 }}>
          {hourly.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{h.entries}</span>
              <div style={{
                width: '100%', maxWidth: 40, borderRadius: '6px 6px 0 0',
                height: `${(h.entries / maxEntries) * 140}px`,
                background: peakHour && h.hour === peakHour.hour
                  ? 'linear-gradient(to top, rgba(197,164,126,0.8), rgba(197,164,126,0.4))'
                  : 'linear-gradient(to top, rgba(197,164,126,0.35), rgba(197,164,126,0.15))',
                transition: 'height 0.3s ease',
              }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{String(h.hour).slice(0, 5)}</span>
            </div>
          ))}
        </div>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No hourly data available for this date</p>
        )}
      </div>

      {/* Period Info */}
      {data?.period && (
      <div className="ea-dash-card" style={{ marginTop: 20 }}>
        <h3 className="ea-dash-card-title">Analysis Period</h3>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
          From <span style={{ color: '#c5a47e' }}>{new Date(data.period.start).toLocaleString()}</span> to{' '}
          <span style={{ color: '#c5a47e' }}>{new Date(data.period.end).toLocaleString()}</span>
        </div>
      </div>
      )}
    </>
  )
}

export default Analytics
