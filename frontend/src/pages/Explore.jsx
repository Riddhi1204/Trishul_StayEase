import { useState, useEffect, useCallback, useRef } from 'react'
import Navbar  from '../components/Navbar'
import Card    from '../components/Card'
import Footer  from '../components/Footer'
import {
  fetchProperties,
  searchProperties,
  filterProperties,
  deleteProperty,
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  createBooking,
} from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Explore.css'

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
      <div style={{ height: 220, background: 'var(--border)', borderRadius: '12px 12px 0 0' }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ height: 14, background: 'var(--border)', borderRadius: 6, width: '40%' }} />
        <div style={{ height: 20, background: 'var(--border)', borderRadius: 6, width: '75%' }} />
        <div style={{ height: 14, background: 'var(--border)', borderRadius: 6, width: '55%' }} />
        <div style={{ height: 14, background: 'var(--border)', borderRadius: 6, width: '90%' }} />
        <div style={{ height: 40, background: 'var(--border)', borderRadius: 8, marginTop: '0.5rem' }} />
      </div>
    </div>
  )
}

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const colours = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: '✅' },
    error:   { bg: '#fff5f5', border: '#fed7d7', text: '#c53030', icon: '❌' },
    info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', icon: 'ℹ️' },
  }
  const c = colours[type] || colours.info

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      borderRadius: 12, padding: '0.85rem 1.25rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      fontSize: '0.9rem', fontWeight: 500, maxWidth: 340,
      animation: 'slideInRight 0.3s ease',
    }}>
      <span>{c.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: c.text, opacity: 0.6, fontSize: '1.1rem', lineHeight: 1,
      }}>✕</button>
    </div>
  )
}

// ── Inline spinner ────────────────────────────────────────────────────────────
function Spinner({ size = 20 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: '3px solid #C8E6C9', borderTopColor: '#2E7D32',
      borderRadius: '50%', animation: 'spin 0.7s linear infinite',
    }} />
  )
}

const categories = ['all', 'mountain', 'forest', 'riverside', 'coastal']

export default function Explore() {
  const [allStays,       setAllStays]       = useState([])
  const [displayStays,   setDisplayStays]   = useState([])
  const [loading,        setLoading]        = useState(true)
  const [searching,      setSearching]      = useState(false)
  const [error,          setError]          = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [sortBy,         setSortBy]         = useState('featured')
  const [maxPrice,       setMaxPrice]       = useState('')
  const [toast,          setToast]          = useState(null)
  const [wishlistedIds,  setWishlistedIds]  = useState(new Set())
  const { user } = useAuth()

  const debounceRef = useRef(null)

  // ── Show toast ──────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  // ── Load all properties ─────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSearchQuery('')
    setActiveCategory('all')
    try {
      const data = await fetchProperties()
      setAllStays(data)
      setDisplayStays(data)
      
      if (user?.role === 'guest') {
        const wl = await fetchWishlist()
        setWishlistedIds(new Set((wl.properties || []).map(p => p.id)))
      }
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Client-side category filter + sort (instant, no API call) ──
  useEffect(() => {
    if (searchQuery.trim()) return  // search handles display separately

    let results = [...allStays]

    if (activeCategory !== 'all') {
      results = results.filter(s => s.category === activeCategory)
    }

    results = results.sort((a, b) => {
      if (sortBy === 'price-low')  return a._rawPrice - b._rawPrice
      if (sortBy === 'price-high') return b._rawPrice - a._rawPrice
      if (sortBy === 'rating')     return parseFloat(b.rating) - parseFloat(a.rating)
      return 0
    })

    setDisplayStays(results)
  }, [activeCategory, sortBy, allStays, searchQuery])

  // ── Debounced search via API ────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!searchQuery.trim()) {
      // Revert to full list when search cleared
      setDisplayStays(allStays)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const results = await searchProperties(searchQuery.trim())
        setDisplayStays(results)
      } catch (err) {
        showToast(err.message, 'error')
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [searchQuery, allStays, showToast])

  // ── Price filter via API ────────────────────────────────────────
  const applyPriceFilter = async () => {
    if (!maxPrice || isNaN(Number(maxPrice))) {
      showToast('Enter a valid price to filter.', 'info')
      return
    }
    setSearching(true)
    try {
      const results = await filterProperties({
        max_price: Number(maxPrice),
        ...(activeCategory !== 'all' ? { type: activeCategory } : {}),
      })
      setDisplayStays(results)
      showToast(`Showing ${results.length} stays under ₹${Number(maxPrice).toLocaleString('en-IN')}`, 'info')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSearching(false)
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setActiveCategory('all')
    setSortBy('featured')
    setMaxPrice('')
    setDisplayStays(allStays)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return
    try {
      await deleteProperty(id)
      const updated = allStays.filter(s => s.id !== id)
      setAllStays(updated)
      setDisplayStays(prev => prev.filter(s => s.id !== id))
      showToast('Property deleted successfully.', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleWishlistClick = async (id) => {
    if (user?.role !== 'guest') {
      showToast('Only guests can wishlist properties.', 'info')
      return
    }
    try {
      if (wishlistedIds.has(id)) {
        await removeFromWishlist(id)
        setWishlistedIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        showToast('Removed from wishlist')
      } else {
        await addToWishlist(id)
        setWishlistedIds(prev => new Set(prev).add(id))
        showToast('Added to wishlist')
      }
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleBookClick = async (id) => {
    if (!user) {
      showToast('Please login to book.', 'info')
      return
    }
    if (user.role !== 'guest') {
      showToast('Only guests can book properties.', 'info')
      return
    }
    
    // Create a mock booking for 3 days starting tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const end = new Date()
    end.setDate(end.getDate() + 4)
    
    try {
      await createBooking({
        property_id: id,
        start_date: tomorrow.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
        guests: 2,
        total_amount: 15000 // mock price
      })
      showToast('Booking successful! View it in your Bookings tab.', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const isFiltered = searchQuery || activeCategory !== 'all' || maxPrice

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="page-main">
        {/* Dashboard hero */}
        <section className="dashboard-hero">
          <div className="container dashboard-hero__inner">
            <div>
              <span className="badge">Explore Stays</span>
              <h1 className="dashboard-hero__title">Find Your Perfect Eco-Stay</h1>
              <p className="dashboard-hero__sub">
                Browse all our verified sustainable homestays across India.
              </p>
              {/* API status badge */}
              {!loading && !error && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.78rem', color: '#fff', opacity: 0.85,
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 20, padding: '0.3rem 0.9rem', marginTop: '0.75rem',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  {allStays.length} properties loaded from API
                </div>
              )}
            </div>

            {/* Search + sort */}
            <div className="dashboard-controls">
              <div className="dashboard-search">
                <span>{searching ? <Spinner size={16} /> : '🔍'}</span>
                <input
                  id="dashboard-search"
                  type="text"
                  placeholder="Search by name or location…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="dashboard-search__input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}
                    aria-label="Clear search"
                  >✕</button>
                )}
              </div>
              <select
                id="dashboard-sort"
                className="dashboard-sort"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>
          <div className="dashboard-hero__wave" aria-hidden="true">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg)" />
            </svg>
          </div>
        </section>

        {/* Filters + Grid */}
        <section className="section">
          <div className="container">

            {/* Category filters */}
            <div className="category-filters" role="tablist" aria-label="Category filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  id={`filter-${cat}`}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`filter-btn${activeCategory === cat ? ' filter-btn--active' : ''}`}
                  onClick={() => { setActiveCategory(cat); setSearchQuery('') }}
                >
                  {cat === 'all'       && '🌍 All Stays'}
                  {cat === 'mountain'  && '🏔️ Mountain'}
                  {cat === 'forest'    && '🌲 Forest'}
                  {cat === 'riverside' && '🏞️ Riverside'}
                  {cat === 'coastal'   && '🌊 Coastal'}
                </button>
              ))}
            </div>

            {/* Price filter row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '1.25rem', flexWrap: 'wrap',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--card-bg)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '0.5rem 0.9rem',
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Max ₹</span>
                <input
                  id="price-filter"
                  type="number"
                  placeholder="e.g. 3000"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyPriceFilter()}
                  style={{
                    border: 'none', outline: 'none', background: 'transparent',
                    width: 90, fontSize: '0.9rem', color: 'var(--text)',
                  }}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                onClick={applyPriceFilter}
                disabled={searching}
              >
                {searching ? <Spinner size={14} /> : 'Apply'}
              </button>
              {isFiltered && (
                <button
                  className="btn"
                  style={{
                    padding: '0.5rem 1rem', fontSize: '0.85rem',
                    background: 'var(--card-bg)', border: '1px solid var(--border)',
                    color: 'var(--text-muted)', borderRadius: 8,
                  }}
                  onClick={clearFilters}
                >
                  ✕ Clear Filters
                </button>
              )}
            </div>

            {/* Result count */}
            <p className="result-count">
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Spinner size={14} /> Loading stays from API…
                </span>
              ) : (
                <>
                  Showing <strong>{displayStays.length}</strong> stays
                  {activeCategory !== 'all' && ` in ${activeCategory}`}
                  {searchQuery && ` for "${searchQuery}"`}
                  {maxPrice && ` under ₹${Number(maxPrice).toLocaleString('en-IN')}`}
                </>
              )}
            </p>

            {/* API error full-page */}
            {error && !loading && (
              <div style={{
                textAlign: 'center', padding: '3rem 2rem',
                background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 16,
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
                <h3 style={{ color: '#c53030', marginBottom: '0.5rem' }}>Backend not reachable</h3>
                <p style={{ color: '#744210', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                  {error}. Make sure the FastAPI server is running at{' '}
                  <code style={{ background: '#fed7d7', padding: '0 4px', borderRadius: 4 }}>
                    http://localhost:8000
                  </code>
                </p>
                <button className="btn btn-primary" onClick={loadAll}>Retry</button>
              </div>
            )}

            {/* Grid */}
            {!error && (
              <>
                {loading ? (
                  <div className="grid-3">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : displayStays.length > 0 ? (
                  <div className="grid-3">
                    {displayStays.map(stay => (
                      <div key={stay.id} style={{ position: 'relative' }}>
                        <Card 
                          {...stay} 
                          isWishlisted={wishlistedIds.has(stay.id)}
                          onWishlistClick={handleWishlistClick}
                          onBookClick={handleBookClick}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <span>🌿</span>
                    <h3>No stays found</h3>
                    <p>Try adjusting your filters or search query.</p>
                    <button className="btn btn-primary" onClick={clearFilters}>
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Stats banner */}
        <section className="dashboard-stats-banner">
          <div className="container dashboard-stats-inner">
            {[
              { icon: '🏡', value: '200+',    label: 'Verified Eco-Stays'      },
              { icon: '📍', value: '50+',     label: 'Destinations Covered'    },
              { icon: '✅', value: '100%',    label: 'Eco Certified'           },
              { icon: '⚡', value: 'Instant', label: 'Booking Confirmation'    },
            ].map(s => (
              <div className="dash-stat" key={s.label}>
                <span className="dash-stat__icon">{s.icon}</span>
                <span className="dash-stat__value">{s.value}</span>
                <span className="dash-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
