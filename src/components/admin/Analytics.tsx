import React, { useState, useEffect } from 'react'
import { getAnalytics } from '../../services/api'

interface LocalAnalytics {
  date: string
  total_entries: number
  avg_stay_minutes: number
  peak_hour: string
  hourly_breakdown: { hour: string; entries: number }[]
  dining_stats: { total_issued: number; redeemed: number }
}

const mockAnalytics: LocalAnalytics = {
  date: new Date().toISOString().slice(0, 10),
  total_entries: 42,
  avg_stay_minutes: 87.5,
  peak_hour: '10:00',
  hourly_breakdown: [
    { hour: '07:00', entries: 3 }, { hour: '08:00', entries: 5 }, { hour: '09:00', entries: 8 },
    { hour: '10:00', entries: 12 }, { hour: '11:00', entries: 6 }, { hour: '12:00', entries: 4 },
    { hour: '13:00', entries: 2 }, { hour: '14:00', entries: 2 },
  ],
  dining_stats: { total_issued: 32, redeemed: 19 },
}

const Analytics: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [data, setData] = useState<LocalAnalytics>(mockAnalytics)

  useEffect(() => {
    getAnalytics(date).then(d => {
      setData({
        date: d.date,
        total_entries: d.attendance?.total_today ?? 0,
        avg_stay_minutes: d.analytics?.avg_stay_minutes ?? 0,
        peak_hour: d.analytics?.peak_hour ?? '-',
        hourly_breakdown: (d.hourly_breakdown ?? []).map(h => ({ hour: h.hour, entries: h.entries })),
        dining_stats: { total_issued: 0, redeemed: d.analytics?.dining_tokens_redeemed_today ?? 0 },
      })
    }).catch(() => setData(mockAnalytics))
  }, [date])

  const maxEntries = Math.max(...data.hourly_breakdown.map(h => h.entries), 1)

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

      {/* KPI Cards */}
      <div className="ea-dash-stats">
        {[
          { label: 'Total Entries', value: data.total_entries },
          { label: 'Avg Stay', value: `${data.avg_stay_minutes} min` },
          { label: 'Peak Hour', value: data.peak_hour },
          { label: 'Dining Tokens', value: `${data.dining_stats.redeemed}/${data.dining_stats.total_issued}` },
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
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, paddingTop: 20 }}>
          {data.hourly_breakdown.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{h.entries}</span>
              <div style={{
                width: '100%', maxWidth: 40, borderRadius: '6px 6px 0 0',
                height: `${(h.entries / maxEntries) * 140}px`,
                background: h.hour === data.peak_hour
                  ? 'linear-gradient(to top, rgba(197,164,126,0.8), rgba(197,164,126,0.4))'
                  : 'linear-gradient(to top, rgba(197,164,126,0.35), rgba(197,164,126,0.15))',
                transition: 'height 0.3s ease',
              }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{h.hour.slice(0, 5)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dining Stats */}
      <div className="ea-dash-card" style={{ marginTop: 20 }}>
        <h3 className="ea-dash-card-title">Dining Token Usage</h3>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ flex: 1, height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }}>
            <div style={{
              width: `${(data.dining_stats.redeemed / (data.dining_stats.total_issued || 1)) * 100}%`,
              height: '100%', borderRadius: 8,
              background: 'linear-gradient(90deg, rgba(197,164,126,0.4), #c5a47e)',
            }} />
          </div>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
            {data.dining_stats.redeemed} redeemed / {data.dining_stats.total_issued} issued
          </span>
        </div>
      </div>
    </>
  )
}

export default Analytics
