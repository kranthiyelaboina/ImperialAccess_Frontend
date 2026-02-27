import React, { useState, useEffect } from 'react'
import { getGuests, deleteGuestFace } from '../../services/api'

const mockGuests = [
  { id: 1, full_name: 'Jane Smith', username: 'jsmith', airline: 'Emirates', boarding_pass_no: 'EK502-01', face_registered: true, lounge_registered: true },
  { id: 2, full_name: 'John Doe', username: 'jdoe', airline: 'Air India', boarding_pass_no: 'AI101-14', face_registered: true, lounge_registered: true },
  { id: 3, full_name: 'Ananya Sharma', username: 'ananya', airline: 'IndiGo', boarding_pass_no: '6E202-09', face_registered: true, lounge_registered: false },
  { id: 4, full_name: 'Rohan Mehta', username: 'rohan', airline: 'Vistara', boarding_pass_no: 'UK845-06', face_registered: false, lounge_registered: false },
  { id: 5, full_name: 'Sneha Kapoor', username: 'sneha', airline: 'Emirates', boarding_pass_no: 'EK503-11', face_registered: true, lounge_registered: true },
]

const GuestManagement: React.FC = () => {
  const [guests, setGuests] = useState(mockGuests)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getGuests().then(d => {
      if (d.guests) setGuests(d.guests as typeof mockGuests)
    }).catch(() => {})
  }, [])

  const filtered = guests.filter(g => g.full_name.toLowerCase().includes(search.toLowerCase()) || g.username.toLowerCase().includes(search.toLowerCase()))

  const handleDeleteFace = async (id: number, name: string) => {
    if (!confirm(`Delete face data for ${name}?`)) return
    try { await deleteGuestFace(id) } catch {}
    setGuests(prev => prev.map(g => g.id === id ? { ...g, face_registered: false } : g))
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by name or username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
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
                <th>Username</th>
                <th>Airline</th>
                <th>Boarding Pass</th>
                <th>Face</th>
                <th>Lounge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => (
                <tr key={g.id}>
                  <td>{i + 1}</td>
                  <td className="ea-dash-table-name">{g.full_name}</td>
                  <td>{g.username}</td>
                  <td>{g.airline}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{g.boarding_pass_no}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                      background: g.face_registered ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                      color: g.face_registered ? '#2ecc71' : '#e74c3c',
                      border: `1px solid ${g.face_registered ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                    }}>{g.face_registered ? 'Registered' : 'Pending'}</span>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                      background: g.lounge_registered ? 'rgba(46,204,113,0.12)' : 'rgba(197,164,126,0.12)',
                      color: g.lounge_registered ? '#2ecc71' : '#c5a47e',
                      border: `1px solid ${g.lounge_registered ? 'rgba(46,204,113,0.3)' : 'rgba(197,164,126,0.3)'}`,
                    }}>{g.lounge_registered ? 'Yes' : 'No'}</span>
                  </td>
                  <td>
                    {g.face_registered && (
                      <button
                        className="ea-dash-btn ea-dash-btn-outline"
                        style={{ fontSize: 11, padding: '4px 10px' }}
                        onClick={() => handleDeleteFace(g.id, g.full_name)}
                      >
                        Delete Face
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default GuestManagement
