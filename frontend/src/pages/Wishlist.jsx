import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import { fetchWishlist, removeFromWishlist } from '../services/api'

export default function Wishlist() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    try {
      const data = await fetchWishlist()
      setProperties(data.properties || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id)
      setProperties(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main container" style={{ padding: '4rem 1rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>My Wishlist</h1>
        
        {loading ? (
          <p>Loading wishlist...</p>
        ) : error ? (
          <div style={{ color: 'red', padding: '2rem', background: '#fee2e2', borderRadius: 8 }}>
            Error: {error}
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--card-bg)', borderRadius: 16 }}>
            <span style={{ fontSize: '3rem' }}>❤️</span>
            <h3>Your Wishlist is Empty</h3>
            <p style={{ color: 'var(--text-muted)' }}>Explore properties and click the heart icon to save them here.</p>
          </div>
        ) : (
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {properties.map(stay => (
              <div key={stay.id} style={{ position: 'relative' }}>
                <Card {...stay} />
                <button 
                  onClick={() => handleRemove(stay.id)}
                  style={{
                    position: 'absolute', top: 10, left: 10, zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.9)', border: 'none',
                    borderRadius: '50%', width: 36, height: 36, cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  title="Remove from wishlist"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
