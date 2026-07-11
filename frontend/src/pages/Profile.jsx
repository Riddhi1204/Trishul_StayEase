import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile } from '../services/api'

export default function Profile() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()
  
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const updatedUser = await updateProfile(formData)
      setUser(updatedUser)
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main container" style={{ padding: '4rem 1rem', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.fullName} style={{ width: 80, height: 80, borderRadius: '50%' }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                {user.fullName[0].toUpperCase()}
              </div>
            )}
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0' }}>{user.fullName}</h1>
              <span className="badge">{user.role.toUpperCase()}</span>
              {user.authProvider === 'google' && (
                <span className="badge" style={{ marginLeft: '0.5rem', background: '#4285F4', color: 'white' }}>Google User</span>
              )}
            </div>
          </div>

          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

          {editing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone Number</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                  placeholder="Optional"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 8 }}>
                <p style={{ margin: '0 0 0.2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email</p>
                <strong>{user.email}</strong>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 8 }}>
                <p style={{ margin: '0 0 0.2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Phone</p>
                <strong>{user.phone || 'Not provided'}</strong>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 8 }}>
                <p style={{ margin: '0 0 0.2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Joined</p>
                <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn btn-primary" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
                <button className="btn btn-outline" onClick={handleLogout} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
