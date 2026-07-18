import { useState, useEffect } from 'react'
import { generateTravelPlan } from '../services/api'
import { useToast } from '../components/ui/Toast'
import './AITravelPlanner.css'

export default function AITravelPlanner() {
  const { showToast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    budget: '₹15,000',
    travel_style: 'Adventure',
    guests: 2,
    special_requests: ''
  })

  useEffect(() => {
    document.title = 'AI Travel Planner | Trishul StayEase'
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setPlan(null)
    
    try {
      const data = {
        ...formData,
        days: parseInt(formData.days),
        guests: parseInt(formData.guests)
      }
      
      const response = await generateTravelPlan(data)
      setPlan(response)
      showToast('Travel plan generated successfully!', 'success')
      
      // Scroll to response
      setTimeout(() => {
        document.getElementById('ai-response')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      if (!navigator.onLine) {
        showToast('No internet connection. Please check your network.', 'error')
      } else if (error.response?.status === 429) {
        showToast('You are generating plans too quickly. Please wait a minute.', 'error')
      } else if (error.response?.status === 503) {
        showToast('AI service is temporarily unavailable. Try again later.', 'error')
      } else {
        showToast(error.response?.data?.detail || error.message || 'Failed to generate travel plan.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-planner-page page-wrapper">
      {/* Hero Section */}
      <section className="ai-planner-hero">
        <div className="container">
          <h1 className="section-title" style={{ color: 'white' }}>Plan Your Eco Adventure ✨</h1>
          <p className="section-subtitle" style={{ color: '#E8F5E9' }}>
            Generate a personalized sustainable travel itinerary using Google Gemini AI.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="page-main container" style={{ padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Input Form */}
        <section className="ai-form-container">
          <form onSubmit={handleSubmit} className="ai-form">
            
            <div className="form-group">
              <label>Destination</label>
              <input 
                type="text" 
                name="destination" 
                value={formData.destination} 
                onChange={handleChange} 
                required 
                placeholder="e.g. Rishikesh, Manali, Wayanad"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Days</label>
                <input 
                  type="number" 
                  name="days" 
                  min="1" 
                  max="14"
                  value={formData.days} 
                  onChange={handleChange} 
                  required 
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Guests</label>
                <input 
                  type="number" 
                  name="guests" 
                  min="1" 
                  max="20"
                  value={formData.guests} 
                  onChange={handleChange} 
                  required 
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Budget</label>
                <input 
                  type="text" 
                  name="budget" 
                  value={formData.budget} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. ₹10,000"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Travel Style</label>
                <select name="travel_style" value={formData.travel_style} onChange={handleChange} className="form-input">
                  <option value="Adventure">Adventure</option>
                  <option value="Relaxation">Relaxation</option>
                  <option value="Family">Family</option>
                  <option value="Couple">Couple</option>
                  <option value="Backpacking">Backpacking</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Spiritual">Spiritual</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Special Requests (Optional)</label>
              <textarea 
                name="special_requests" 
                value={formData.special_requests} 
                onChange={handleChange} 
                placeholder="e.g. Vegetarian food only, pet-friendly, mountain trekking..."
                className="form-input"
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-primary generate-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Gemini is planning your trip...
                </>
              ) : (
                'Generate Travel Plan ✨'
              )}
            </button>

          </form>
        </section>

        {/* Response UI */}
        {plan && (
          <section id="ai-response" className="ai-results">
            <div className="result-header">
              <h2>{plan.title}</h2>
              <p>{plan.summary}</p>
            </div>

            <div className="result-grid">
              
              {/* Daily Itinerary */}
              <div className="result-card itinerary-card">
                <h3>📅 Daily Itinerary</h3>
                <div className="itinerary-timeline">
                  {plan.itinerary.map((day, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-day">Day {day.day}</div>
                      <div className="timeline-content">
                        <h4>{day.title}</h4>
                        <ul>
                          {day.activities.map((act, i) => <li key={i}>{act}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="side-cards">
                {/* Budget */}
                <div className="result-card">
                  <h3>💰 Budget Breakdown</h3>
                  <p>{plan.estimated_budget}</p>
                </div>

                {/* Recommended Stays */}
                <div className="result-card">
                  <h3>🏡 Recommended Stay Type</h3>
                  <ul>
                    {plan.recommended_stays.map((stay, i) => <li key={i}>{stay}</li>)}
                  </ul>
                </div>

                {/* Packing Checklist */}
                <div className="result-card">
                  <h3>🎒 Packing Checklist</h3>
                  <ul className="checklist">
                    {plan.packing_list.map((item, i) => (
                      <li key={i}>
                        <input type="checkbox" id={`item-${i}`} />
                        <label htmlFor={`item-${i}`}>{item}</label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eco Tips */}
                <div className="result-card eco-card">
                  <h3>🌿 Sustainable Travel Tips</h3>
                  <ul>
                    {plan.eco_tips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
              </div>
              
            </div>
          </section>
        )}

      </main>
    </div>
  )
}
