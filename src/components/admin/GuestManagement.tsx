import React, { useState, useEffect } from 'react'
import { getGuests, deleteGuestFace, type GuestListResponse } from '../../services/api'

type Guest = GuestListResponse['guests'][number]

const GuestManagement: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchGuests = () => {
    setLoading(true)
    getGuests(undefined, search || undefined)
      .then(d => setGuests(d.guests || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchGuests() }, [])

  const handleSearch = (val: string) => {
    setSearch(val)
    getGuests(undefined, val || undefined)
      .then(d => setGuests(d.guests || []))
      .catch(() => {})
  }

  const handleDeleteFace = async (guest_id: string, name: string) => {
    if (!confirm(`Delete face data for ${name}?`)) return
    try {
      await deleteGuestFace(guest_id)
      setGuests(prev => prev.map(g => g.guest_id === guest_id ? { ...g, face_registered: false } : g))
    } catch {}
  }

  const filtered = guests.filter(g => {
    const name = (g.full_name || '').toLowerCase()
    const email = (g.email || '').toLowerCase()
    const q = search.toLowerCase()
    return name.includes(q) || email.includes(q)
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(197,164,126,0.25)',
            background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: 14, width: 300, outline: 'none',
          }}
        />
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{filtered.length} guests</span>
      </div>

      <div className="ea-dash-card">
        <h3 className="ea-dash-card-title">Registered Guests</h3>
        <div className="ea-dash-table-wrap">
          <table className="ea-dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Airline</th>
                <th>Membership</th>
                <th>Face</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading...</td></tr>
              ) : filtered.length > 0 ? filtered.map((g, i) => (
                <tr key={g.guest_id}>
                  <td>{i + 1}</td>
                  <td className="ea-dash-table-name">{g.full_name}</td>
                  <td>{g.email || '—'}</td>
                  <td>{g.airline || '—'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{g.membership_type || '-'}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                      background: g.face_registered ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                      color: g.face_registered ? '#2ecc71' : '#e74c3c',
                      border: `1px solid ${g.face_registered ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                    }}>{g.face_registered ? 'Registered' : 'Pending'}</span>
                  </td>
                  <td>{g.created_at ? new Date(g.created_at).toLocaleDateString() : '—'}</td>
                  <td>
                    {g.face_registered && (
                      <button
                        className="ea-dash-btn ea-dash-btn-outline"
                        style={{ fontSize: 11, padding: '4px 10px' }}
                        onClick={() => handleDeleteFace(g.guest_id, g.full_name)}
                      >
                        Delete Face
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No guests found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default GuestManagement
