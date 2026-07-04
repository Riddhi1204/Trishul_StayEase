import { useState, useEffect } from 'react'
import { createProperty, updateProperty } from '../services/api'
import { useToast } from './ui/Toast'

const TYPE_OPTIONS = ['mountain', 'forest', 'riverside', 'coastal', 'urban', 'desert']

export default function PropertyForm({ property, onClose, onSuccess }) {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const isEditing = !!property

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    state: '',
    country: 'India',
    price: '',
    type: 'mountain',
    status: 'available',
    amenities: '',
    images: ''
  })

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        location: property.location || '',
        city: property.city || '',
        state: property.state || '',
        country: property.country || 'India',
        price: property._rawPrice || property.price || '',
        type: property._rawType || property.type || 'mountain',
        status: property.status || 'available',
        amenities: property._rawAmenities ? property._rawAmenities.join(', ') : '',
        images: property._rawImages ? property._rawImages.join(', ') : ''
      })
    }
  }, [property])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Clean data
    const payload = {
      ...formData,
      price: parseInt(formData.price, 10),
      amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean),
      images: formData.images.split(',').map(s => s.trim()).filter(Boolean)
    }

    try {
      if (isEditing) {
        await updateProperty(property.id, payload)
        addToast('Property updated successfully!', 'success')
      } else {
        await createProperty(payload)
        addToast('Property created successfully!', 'success')
      }
      onSuccess()
    } catch (error) {
      addToast(error.message || 'Failed to save property', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: '20px'
    }}>
      <div className="modal-content" style={{
        background: 'var(--bg-secondary)', padding: '2rem',
        borderRadius: '16px', width: '100%', maxWidth: '600px',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          {isEditing ? 'Edit Property' : 'Add New Property'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" placeholder="Cozy Villa" />
            </div>
            <div style={{ flex: 1 }}>
              <label>Property Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="form-input">
                {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="form-input" placeholder="Describe your property..."></textarea>
          </div>

          <div>
            <label>Full Location (Summary)</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="form-input" placeholder="e.g. Baga Beach, Goa" />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-input" />
            </div>
            <div style={{ flex: 1 }}>
              <label>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-input" />
            </div>
            <div style={{ flex: 1 }}>
              <label>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Price per night (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min="1" className="form-input" />
            </div>
            <div style={{ flex: 1 }}>
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>

          <div>
            <label>Amenities (Comma-separated)</label>
            <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="form-input" placeholder="WiFi, Pool, AC" />
          </div>

          <div>
            <label>Image URLs (Comma-separated)</label>
            <input type="text" name="images" value={formData.images} onChange={handleChange} className="form-input" placeholder="https://unsplash.com/..., https://..." />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
              {loading ? 'Saving...' : 'Save Property'}
            </button>
          </div>
        </form>

        <style>{`
          .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            background: var(--bg-primary);
            border: 1px solid var(--border-color, #334155);
            border-radius: 8px;
            color: var(--text-primary);
            margin-top: 0.25rem;
            outline: none;
            transition: border-color 0.2s;
          }
          .form-input:focus {
            border-color: var(--primary-color, #52b788);
          }
          label {
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-weight: 500;
          }
        `}</style>
      </div>
    </div>
  )
}
