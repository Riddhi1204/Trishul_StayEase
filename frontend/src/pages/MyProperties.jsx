import { useState, useEffect } from 'react'
import { fetchMyProperties, deleteProperty } from '../services/api'
import { useToast } from '../components/ui/Toast'
import PropertyForm from '../components/PropertyForm'

export default function MyProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  
  const { addToast } = useToast()

  const loadProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMyProperties()
      setProperties(data)
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
      addToast('Property deleted successfully.', 'success')
      setProperties(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      addToast(err.message || 'Failed to delete property.', 'error')
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    loadProperties() // Refresh the list
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Properties</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your homestay listings here.</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add Property
        </button>
      </div>

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading your properties...
        </div>
      )}

      {error && !loading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ff6b6b', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {!loading && !error && properties.length === 0 && (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏡</div>
          <h3>No properties yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
            You haven't listed any properties yet. Click the button above to add your first listing!
          </p>
          <button className="btn btn-primary" onClick={handleAddNew}>Add Property</button>
        </div>
      )}

      {!loading && properties.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {properties.map(prop => (
            <div key={prop.id} style={{ 
              background: 'var(--bg-secondary)', 
              borderRadius: '12px', 
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
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
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  📍 {prop.location}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                    ₹{prop.price}<span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/night</span>
                  </span>
                  <span style={{ fontSize: '0.875rem', padding: '4px 8px', background: 'var(--bg-primary)', borderRadius: '4px', textTransform: 'capitalize' }}>
                    {prop.category}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => handleEdit(prop)}>
                    Edit
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', background: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b', borderColor: 'transparent' }} onClick={() => handleDelete(prop.id)}>
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
    </div>
  )
}
