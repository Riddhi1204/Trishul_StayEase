import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchDashboardStats } from '../services/api'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await fetchDashboardStats()
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main container" style={{ padding: '4rem 1rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>Host Dashboard</h1>

        {loading ? (
          <p>Loading statistics...</p>
        ) : error ? (
          <div style={{ color: 'red', padding: '2rem', background: '#fee2e2', borderRadius: 8 }}>
            Error: {error}
          </div>
        ) : (
          <>
            {/* Top Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Total Properties</p>
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{stats.totalProperties}</h2>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Total Bookings</p>
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{stats.totalBookings}</h2>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Total Revenue</p>
                <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--primary)' }}>₹{stats.revenue.toLocaleString('en-IN')}</h2>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Occupancy Rate</p>
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{stats.occupancy}%</h2>
              </div>
            </div>

            {/* Recent Bookings & Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              {/* Recent Bookings */}
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Bookings</h2>
                {stats.recentBookings.length === 0 ? (
                  <div style={{ padding: '2rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>No bookings yet.</p>
                  </div>
                ) : (
                  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '500' }}>Property</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '500' }}>Dates</th>
                          <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>Amount</th>
                          <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '500' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentBookings.map((b, i) => (
                          <tr key={b.id} style={{ borderBottom: i === stats.recentBookings.length - 1 ? 'none' : '1px solid var(--border)' }}>
                            <td style={{ padding: '1rem' }}>{b.property_title}</td>
                            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{b.start_date} to {b.end_date}</td>
                            <td style={{ padding: '1rem', textAlign: 'right' }}>₹{b.total_amount.toLocaleString('en-IN')}</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <span className={`badge badge--${b.status}`}>{b.status.toUpperCase()}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Quick Actions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <a href="/my-properties" className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>Manage Properties</a>
                  <a href="/host-bookings" className="btn btn-outline" style={{ display: 'block', textAlign: 'center' }}>View All Bookings</a>
                  <a href="/messages" className="btn btn-outline" style={{ display: 'block', textAlign: 'center' }}>Messages</a>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
