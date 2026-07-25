import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero   from '../components/Hero'
import Card   from '../components/Card'
import Footer from '../components/Footer'
import { fetchProperties } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import './Home.css'

// ── Static enrichment data for stays that come from the API ───────────────────
// (The backend returns minimal fields; we add visuals here per-type)

const testimonials = [
  {
    name: 'Priya Sharma',
    avatar: '👩',
    location: 'Delhi',
    text: 'The Mountain Retreat was absolutely breathtaking. Waking up to Himalayan views with organic breakfast — pure magic!',
    rating: 5,
  },
  {
    name: 'Arjun Mehta',
    avatar: '👨',
    location: 'Bangalore',
    text: 'Forest Cabin in Coorg exceeded every expectation. The hosts were wonderful and the coffee estate tour was unforgettable.',
    rating: 5,
  },
  {
    name: 'Sneha Patel',
    avatar: '👩‍🦱',
    location: 'Mumbai',
    text: 'Riverside Homestay in Rishikesh gave me the digital detox I desperately needed. Yoga at sunrise by the Ganga = life-changing.',
    rating: 5,
  },
]

// ── Skeleton loader card ───────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
      <div style={{ height: 220, background: 'var(--border)', borderRadius: '12px 12px 0 0' }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ height: 14, background: 'var(--border)', borderRadius: 6, width: '40%' }} />
        <div style={{ height: 20, background: 'var(--border)', borderRadius: 6, width: '75%' }} />
        <div style={{ height: 14, background: 'var(--border)', borderRadius: 6, width: '55%' }} />
        <div style={{ height: 14, background: 'var(--border)', borderRadius: 6, width: '90%' }} />
        <div style={{ height: 14, background: 'var(--border)', borderRadius: 6, width: '80%' }} />
        <div style={{ height: 40, background: 'var(--border)', borderRadius: 8, marginTop: '0.5rem' }} />
      </div>
    </div>
  )
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
  return (
    <div style={{
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '3rem 2rem',
      background: '#fff5f5',
      border: '1px solid #fed7d7',
      borderRadius: 16,
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
      <h3 style={{ color: '#c53030', marginBottom: '0.5rem' }}>Could not load stays</h3>
      <p style={{ color: '#744210', marginBottom: '1.25rem', fontSize: '0.9rem' }}>{message}</p>
      <button className="btn btn-primary" onClick={onRetry}>Try Again</button>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [stays,   setStays]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    document.title = "Trishul StayEase | Eco-Friendly Homestays"
  }, [])

  const loadStays = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProperties()
      // Show only first 6 on the home page (featured)
      setStays(data.slice(0, 6))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStays()
  }, [])

  const handleBookClick = (id) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/explore' } } })
    } else {
      navigate('/explore')
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="page-main">
        {/* Hero */}
        <Hero />

        {/* Features strip */}
        <section className="features-strip">
          <div className="container features-strip__inner">
            {[
              { icon: '🌿', title: 'Eco Certified',       desc: 'All stays meet sustainability standards' },
              { icon: '🏡', title: 'Authentic Homes',      desc: 'Hosted by local families'                },
              { icon: '💰', title: 'Best Price Guarantee', desc: 'No hidden fees, ever'                    },
              { icon: '🛡️', title: 'Verified & Safe',      desc: 'Every stay is inspected'                },
            ].map(f => (
              <div className="feature-item" key={f.title}>
                <span className="feature-item__icon">{f.icon}</span>
                <div>
                  <h3 className="feature-item__title">{f.title}</h3>
                  <p className="feature-item__desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stays Grid — API-driven */}
        <section className="section stays-section">
          <div className="container">
            <span className="badge">Featured Stays</span>
            <h2 className="section-title">Handpicked Eco-Stays</h2>
            <p className="section-subtitle">
              Every stay is verified for sustainability, authenticity, and unforgettable experiences.
            </p>

            {/* API status indicator */}
            {!loading && !error && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: '#2E7D32',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 20,
                padding: '0.3rem 0.8rem',
                marginBottom: '1.5rem',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                Live data from backend API
              </div>
            )}

            <div className="grid-3">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : error
                  ? <ErrorBanner message={error} onRetry={loadStays} />
                  : stays.map(stay => <Card key={stay.id} {...stay} onBookClick={handleBookClick} />)
              }
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="why-section section">
          <div className="container why-inner">
            <div className="why-content">
              <span className="badge">Why Choose Us</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                Travel that heals the planet
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.75 }}>
                At Trishul StayEase, every booking directly supports local families and conservation
                efforts. We plant a tree for every stay booked and partner with communities to protect
                natural ecosystems.
              </p>
              <ul className="why-list">
                {[
                  '✅ 100% carbon-offset bookings',
                  '✅ Local community revenue sharing',
                  '✅ Plastic-free certified properties',
                  '✅ Curated by sustainability experts',
                ].map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="why-visual">
              <div className="why-img" />
              <div className="why-stat-card">
                <span className="why-stat-value">15,000+</span>
                <span className="why-stat-label">Trees Planted 🌳</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section testimonials-section">
          <div className="container">
            <span className="badge">Guest Reviews</span>
            <h2 className="section-title">What Our Guests Say</h2>
            <p className="section-subtitle">Real experiences from real travellers</p>
            <div className="testimonials-grid">
              {testimonials.map(t => (
                <div className="testimonial-card" key={t.name}>
                  <div className="testimonial-stars">
                    {'⭐'.repeat(t.rating)}
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <span className="testimonial-avatar">{t.avatar}</span>
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="cta-banner">
          <div className="container cta-inner">
            <div className="cta-content">
              <h2>Ready for your eco-adventure?</h2>
              <p>Join 10,000+ travellers who've discovered sustainable travel with us.</p>
            </div>
            <div className="cta-actions">
              <a href="/dashboard" className="btn btn-white">Explore All Stays</a>
              <a href="/about" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                Learn More
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
