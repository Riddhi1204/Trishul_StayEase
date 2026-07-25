import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchHostBookings, updateBookingStatus } from '../services/api'
import { useToast } from '../components/ui/Toast'

export default function HostBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, upcoming, completed, cancelled
  
  const { showToast } = useToast()

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const data = await fetchHostBookings()
      setBookings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      const updated = await updateBookingStatus(id, status)
      setBookings(prev => prev.map(b => b.id === id ? updated : b))
      showToast(`Booking marked as ${status}`, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (filter === 'all') return true
      if (filter === 'cancelled' && (b.status === 'cancelled' || b.status === 'rejected')) return true
      return b.status === filter
    })
  }, [bookings, filter])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main container" style={{ padding: '4rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Manage Bookings</h1>
            <p style={{ color: 'var(--text-muted)' }}>Review and manage reservations for your properties.</p>
          </div>
          
          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--card-bg)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn ${filter === f ? 'btn-primary' : ''}`}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  background: filter === f ? 'var(--primary)' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--text)',
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
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
            <p style={{ color: 'var(--text-muted)' }}>You haven't received any bookings for your properties yet.</p>
          </div>
        ) : filteredBookings.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
             No bookings match the selected filter.
           </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredBookings.map(b => (
              <div key={b.id} style={{ display: 'flex', background: 'var(--card-bg)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {b.property?.images?.[0] ? (
                  <img src={b.property.images[0]} alt={b.property.title} style={{ width: 250, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 250, background: '#e2e8f0' }} />
                )}
                
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0' }}>{b.property?.title || 'Unknown Property'}</h3>
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                        Guest ID: {b.guest_id.substring(0, 8)}...
                      </p>
                    </div>
                    <span className={`badge badge--${b.status}`}>{b.status.toUpperCase()}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '3rem', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    <div>
                      <p style={{ margin: '0 0 0.2rem 0', color: 'var(--text-muted)' }}>Dates</p>
                      <strong>{b.start_date} to {b.end_date}</strong>
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
                  
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    {b.status === 'upcoming' && (
                      <>
                        <button onClick={() => handleUpdateStatus(b.id, 'completed')} className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }}>
                          Mark Completed
                        </button>
                        <button onClick={() => handleUpdateStatus(b.id, 'rejected')} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                          Reject
                        </button>
                      </>
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
