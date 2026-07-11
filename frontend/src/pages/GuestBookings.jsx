import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchGuestBookings, updateBookingStatus } from '../services/api'

export default function GuestBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const data = await fetchGuestBookings()
      setBookings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return
    try {
      const updated = await updateBookingStatus(id, 'cancelled')
      setBookings(prev => prev.map(b => b.id === id ? updated : b))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main container" style={{ padding: '4rem 1rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>My Bookings</h1>
        
        {loading ? (
          <p>Loading bookings...</p>
        ) : error ? (
          <div style={{ color: 'red', padding: '2rem', background: '#fee2e2', borderRadius: 8 }}>
            Error: {error}
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--card-bg)', borderRadius: 16 }}>
            <span style={{ fontSize: '3rem' }}>📅</span>
            <h3>No Bookings Yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="bookings-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {bookings.map(b => (
              <div key={b.id} style={{ display: 'flex', background: 'var(--card-bg)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {b.property?.images?.[0] ? (
                  <img src={b.property.images[0]} alt={b.property.title} style={{ width: 250, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 250, background: '#e2e8f0' }} />
                )}
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{b.property?.title || 'Unknown Property'}</h3>
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                        {b.property?.location}
                      </p>
                    </div>
                    <span className={`badge badge--${b.status}`}>{b.status.toUpperCase()}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    <div>
                      <p style={{ margin: '0 0 0.2rem 0', color: 'var(--text-muted)' }}>Dates</p>
                      <strong>{b.start_date} - {b.end_date}</strong>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 0.2rem 0', color: 'var(--text-muted)' }}>Guests</p>
                      <strong>{b.guests}</strong>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 0.2rem 0', color: 'var(--text-muted)' }}>Total Amount</p>
                      <strong>₹{b.total_amount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    {b.status === 'upcoming' && (
                      <button onClick={() => handleCancel(b.id)} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
