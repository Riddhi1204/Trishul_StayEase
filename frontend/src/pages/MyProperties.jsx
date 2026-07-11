import { useState, useEffect } from 'react'
import { fetchMyProperties, deleteProperty, updateProperty, fetchHostBookings } from '../services/api'
import { useToast } from '../components/ui/Toast'
import PropertyForm from '../components/PropertyForm'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function MyProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  
  // Search, stats
  const [searchQuery, setSearchQuery] = useState('')
  const [bookingsCountMap, setBookingsCountMap] = useState({})
  
  const { showToast } = useToast()

  const loadProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      const [data, hostBookings] = await Promise.all([
        fetchMyProperties(),
        fetchHostBookings()
      ])
      setProperties(data)
      
      const countMap = {}
      hostBookings.forEach(b => {
        countMap[b.property_id] = (countMap[b.property_id] || 0) + 1
      })
      setBookingsCountMap(countMap)
    } catch (err) {
      setError('Failed to load your properties.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const handleAddNew = () => {
    setEditingProperty(null)
    setIsFormOpen(true)
  }

  const handleEdit = (prop) => {
    setEditingProperty(prop)
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return
    
    try {
      await deleteProperty(id)
      showToast('Property deleted successfully.', 'success')
      setProperties(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      showToast(err.message || 'Failed to delete property.', 'error')
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    loadProperties() // Refresh the list
  }
  
  const togglePublish = async (prop) => {
    const newStatus = prop.status === 'available' ? 'inactive' : 'available'
    try {
      await updateProperty(prop.id, { status: newStatus })
      showToast(`Property marked as ${newStatus}`, 'success')
      setProperties(prev => prev.map(p => p.id === prop.id ? {...p, status: newStatus} : p))
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main container" style={{ padding: '4rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Properties</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your homestay listings here.</p>
          </div>
          {!loading && (
            <button className="btn btn-primary" onClick={handleAddNew}>
              + Add Property
            </button>
          )}
        </div>

        {/* Search */}
        {!loading && properties.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <input 
              type="text"
              placeholder="Search your properties..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', maxWidth: '400px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            />
          </div>
        )}

        {loading && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading your properties...
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ff6b6b', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏡</div>
            <h3>No properties yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
              You haven't listed any properties yet. Click the button above to add your first listing!
            </p>
            <button className="btn btn-primary" onClick={handleAddNew}>Add Property</button>
          </div>
        )}

        {!loading && properties.length > 0 && filteredProperties.length === 0 && (
          <p>No properties match your search.</p>
        )}

        {!loading && filteredProperties.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filteredProperties.map(prop => (
              <div key={prop.id} style={{ 
                background: 'var(--bg-card)', 
                borderRadius: '12px', 
                overflow: 'hidden',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ position: 'relative', height: '180px' }}>
                  <img 
                    src={prop.image} 
                    alt={prop.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ 
                    position: 'absolute', top: '10px', right: '10px', 
                    background: 'rgba(0,0,0,0.7)', padding: '4px 10px', 
                    borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                    color: prop.status === 'available' ? '#52b788' : '#fca311' 
                  }}>
                    {prop.status.toUpperCase()}
                  </div>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{prop.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    📍 {prop.location}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <div>
                      <strong>{bookingsCountMap[prop.id] || 0}</strong> Bookings
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary)' }}>
                      ₹{prop.price}<span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/night</span>
                    </span>
                    <button 
                      onClick={() => togglePublish(prop)}
                      className="btn"
                      style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--border)', color: 'var(--text)', borderRadius: '4px' }}
                    >
                      {prop.status === 'available' ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }} onClick={() => handleEdit(prop)}>
                      Edit
                    </button>
                    <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', background: 'rgba(255, 107, 107, 0.1)', color: '#c53030', borderColor: 'transparent' }} onClick={() => handleDelete(prop.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isFormOpen && (
          <PropertyForm 
            property={editingProperty} 
            onClose={() => setIsFormOpen(false)}
            onSuccess={handleFormSuccess}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
