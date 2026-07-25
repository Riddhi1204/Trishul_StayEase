import { useState, useEffect } from 'react'
import { createBooking } from '../services/api'
import { useToast } from './ui/Toast'

export default function BookingModal({ property, onClose, onSuccess }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)

  const { showToast } = useToast()

  // Calculate total amount whenever dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (end > start) {
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        setTotalAmount(diffDays * property.price)
      } else {
        setTotalAmount(0)
      }
    } else {
      setTotalAmount(0)
    }
  }, [startDate, endDate, property.price])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (new Date(endDate) <= new Date(startDate)) {
      showToast('End date must be after start date.', 'error')
      return
    }

    setLoading(true)
    try {
      await createBooking({
        property_id: property.id,
        start_date: startDate,
        end_date: endDate,
        guests: parseInt(guests),
        total_amount: totalAmount
      })
      showToast('Booking successful! View it in your Bookings tab.', 'success')
      onSuccess()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Get tomorrow's date for minimum valid start date
  const today = new Date()
  today.setDate(today.getDate() + 1)
  const minDate = today.toISOString().split('T')[0]

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--bg)', width: '100%', maxWidth: 450,
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Book {property.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Check-in Date</label>
            <input 
              type="date" 
              required
              min={minDate}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Check-out Date</label>
            <input 
              type="date" 
              required
              min={startDate || minDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Guests</label>
            <input 
              type="number" 
              min="1" 
              max="20"
              required
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border)' }}
            />
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--card-bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Price per night</span>
              <span>₹{property.price.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <span>Total Price</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
            disabled={loading || totalAmount === 0}
          >
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}
