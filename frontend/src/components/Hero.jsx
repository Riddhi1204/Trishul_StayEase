import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" aria-label="Hero section">
      {/* Decorative blobs */}
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />
      <div className="hero__blob hero__blob--3" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="badge animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            🌱 Sustainable Travel
          </span>

          <h1 className="hero__title animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Book Authentic <br />
            <span className="hero__title-highlight">Eco-Stays</span>
          </h1>

          <p className="hero__desc animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
            Escape to hand-picked eco-homestays nestled in pristine mountains,
            ancient forests, and serene riversides. Experience nature, support local
            communities.
          </p>

          {/* Search bar */}
          <div className="hero__search animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <div className="hero__search-field">
              <span className="hero__search-icon">📍</span>
              <input
                id="hero-destination"
                type="text"
                placeholder="Where do you want to stay?"
                className="hero__search-input"
              />
            </div>
            <div className="hero__search-divider" />
            <div className="hero__search-field">
              <span className="hero__search-icon">📅</span>
              <input
                id="hero-dates"
                type="text"
                placeholder="Check-in – Check-out"
                className="hero__search-input"
              />
            </div>
            <Link to="/dashboard" className="btn btn-primary hero__search-btn">
              Search
            </Link>
          </div>

          {/* Stats */}
          <div className="hero__stats animate-fadeInUp" style={{ animationDelay: '0.65s' }}>
            {[
              { value: '200+', label: 'Eco-Stays' },
              { value: '50+',  label: 'Destinations' },
              { value: '10k+', label: 'Happy Guests' },
            ].map(stat => (
              <div className="hero__stat" key={stat.label}>
                <span className="hero__stat-value">{stat.value}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual column */}
        <div className="hero__visual animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <div className="hero__card-stack">
            <div className="hero__img-card hero__img-card--back animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="hero__img hero__img--forest" />
            </div>
            <div className="hero__img-card hero__img-card--front animate-float">
              <div className="hero__img hero__img--mountain" />
              <div className="hero__img-badge">
                <span>🏔️</span>
                <div>
                  <strong>Mountain Retreat</strong>
                  <p>Uttarakhand</p>
                </div>
              </div>
            </div>
            {/* Floating chip */}
            <div className="hero__chip hero__chip--rating animate-float" style={{ animationDelay: '1s' }}>
              ⭐ 4.9 &nbsp;·&nbsp; Top Rated
            </div>
            <div className="hero__chip hero__chip--eco animate-float" style={{ animationDelay: '1.5s' }}>
              🌿 Eco Certified
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg)" />
        </svg>
      </div>
    </section>
  )
}
