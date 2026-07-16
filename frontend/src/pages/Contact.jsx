import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { submitContactForm } from '../services/api'
import { useToast } from '../components/ui/Toast'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    document.title = "Contact Us | Trishul StayEase"
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Client-side validation
    if (!formData.name || !formData.email || !formData.subject || formData.message.length < 10) {
      showToast("Please fill all fields correctly. Message must be at least 10 characters.", "error")
      return
    }

    setLoading(true)
    try {
      await submitContactForm(formData)
      showToast("Your message has been sent successfully!", "success")
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      showToast(err.response?.data?.detail || err.message || "Failed to send message.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ background: 'var(--card-bg)', padding: '4rem 1rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>Get in Touch</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Have a question about a booking, want to become a host, or just want to say hi? We'd love to hear from you.
        </p>
      </section>

      <main className="page-main container" style={{ padding: '4rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        
        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Company Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
              <div>
                <strong style={{ color: 'var(--text)' }}>Address:</strong><br />
                Eco Village Road, Phase 1<br />
                Himalayan Heights, Uttarakhand 263139
              </div>
              <div>
                <strong style={{ color: 'var(--text)' }}>Email:</strong><br />
                support@trishulstayease.com
              </div>
              <div>
                <strong style={{ color: 'var(--text)' }}>Business Hours:</strong><br />
                Monday - Friday: 9:00 AM - 6:00 PM (IST)<br />
                Weekend Support: Email Only
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ marginBottom: '1rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <strong>How do I cancel my booking?</strong>
                <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0' }}>You can cancel your booking from the "My Bookings" page. Refunds depend on the host's cancellation policy.</p>
              </div>
              <div>
                <strong>How do I become a host?</strong>
                <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0' }}>Register an account, go to your profile, and select "Become a Host" or use the direct link in the footer.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Send us a Message</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required 
                minLength={2}
                className="input-field"
              />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required 
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                required 
                minLength={3}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                required 
                minLength={10}
                rows="5"
                className="input-field"
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '1rem' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                  Sending...
                </span>
              ) : 'Send Message'}
            </button>
          </form>
        </div>

      </main>
      
      {/* Map Placeholder */}
      <div style={{ width: '100%', height: '300px', background: 'var(--card-bg)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        [ Google Maps Integration Placeholder ]
      </div>

      <Footer />
    </div>
  )
}
