import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Card   from '../components/Card'
import Footer from '../components/Footer'
import mountainRetreatImg from '../assets/mountain_retreat.png'
import './Dashboard.css'

const allStays = [
  {
    id: 1,
    image: mountainRetreatImg,
    tag: '🏔️ Mountain',
    title: 'Mountain Retreat',
    location: 'Munsiyari, Uttarakhand',
    description: 'Panoramic Himalayan views, organic meals, and guided treks at 2,800m altitude.',
    price: '3,200',
    rating: '4.9',
    reviews: '128',
    features: ['🌄 Mountain View', '🥗 Organic Meals', '🥾 Guided Treks'],
    category: 'mountain',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    tag: '🌲 Forest',
    title: 'Forest Cabin',
    location: 'Coorg, Karnataka',
    description: 'Nestled in a 50-acre coffee estate with birdsong and freshly brewed estate coffee.',
    price: '2,800',
    rating: '4.8',
    reviews: '95',
    features: ['☕ Coffee Estate', '🦜 Bird Watching', '🌿 Nature Walks'],
    category: 'forest',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    tag: '🏞️ Riverside',
    title: 'Riverside Homestay',
    location: 'Rishikesh, Uttarakhand',
    description: 'Sleep to the Ganga, yoga at sunrise, river rafting, and Garhwali home cooking.',
    price: '2,500',
    rating: '4.7',
    reviews: '212',
    features: ['🧘 Yoga Classes', '🚣 River Rafting', '🍛 Local Cuisine'],
    category: 'riverside',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    tag: '🏕️ Valley',
    title: 'Valley Farmstay',
    location: 'Spiti Valley, Himachal',
    description: 'Solar-powered farmstay in cold desert valley, apple harvesting and monasteries.',
    price: '4,000',
    rating: '5.0',
    reviews: '67',
    features: ['☀️ Solar Powered', '🍎 Harvest Season', '🏛️ Monastery Visits'],
    category: 'mountain',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=600&q=80',
    tag: '🌊 Coastal',
    title: 'Coastal Eco Villa',
    location: 'Varkala, Kerala',
    description: 'Cliff-top villa with Ayurvedic treatments, Kerala cooking classes, and dolphin watching.',
    price: '3,600',
    rating: '4.8',
    reviews: '183',
    features: ['🌊 Sea View', '💆 Ayurveda Spa', '🐬 Dolphin Watching'],
    category: 'coastal',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
    tag: '🎋 Bamboo',
    title: 'Bamboo Forest Retreat',
    location: 'Sikkim, Northeast India',
    description: 'Handcrafted bamboo cottages in a UNESCO biosphere with cardamom farms.',
    price: '2,200',
    rating: '4.9',
    reviews: '54',
    features: ['🎋 Bamboo Cottages', '🌸 Rhododendrons', '🌱 Organic Farming'],
    category: 'forest',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',
    tag: '🏔️ Mountain',
    title: 'Himalayan Bungalow',
    location: 'Manali, Himachal Pradesh',
    description: 'Cosy apple orchard bungalow with valley views, bonfire nights, and local trout fishing.',
    price: '3,800',
    rating: '4.7',
    reviews: '89',
    features: ['🍏 Apple Orchard', '🔥 Bonfire Nights', '🎣 Trout Fishing'],
    category: 'mountain',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80',
    tag: '🌊 Coastal',
    title: 'Backwater Houseboat',
    location: 'Alleppey, Kerala',
    description: 'Traditional kettuvallam houseboat gliding through emerald backwaters.',
    price: '5,500',
    rating: '4.9',
    reviews: '140',
    features: ['🚤 Houseboat Stay', '🦢 Backwaters', '🦞 Seafood Meals'],
    category: 'coastal',
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?w=600&q=80',
    tag: '🌲 Forest',
    title: 'Jungle Treehouse',
    location: 'Wayanad, Kerala',
    description: 'Stay in the treetops of the Western Ghats with wildlife safaris and tribal culture.',
    price: '4,200',
    rating: '4.8',
    reviews: '76',
    features: ['🌳 Treehouse', '🐘 Wildlife Safari', '🏹 Tribal Culture'],
    category: 'forest',
  },
]

const categories = ['all', 'mountain', 'forest', 'riverside', 'coastal']

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [sortBy,         setSortBy]         = useState('featured')

  const filtered = allStays
    .filter(s =>
      (activeCategory === 'all' || s.category === activeCategory) &&
      (s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       s.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'price-low')  return parseInt(a.price.replace(',','')) - parseInt(b.price.replace(',',''))
      if (sortBy === 'price-high') return parseInt(b.price.replace(',','')) - parseInt(a.price.replace(',',''))
      if (sortBy === 'rating')     return parseFloat(b.rating) - parseFloat(a.rating)
      return 0
    })

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
              <p className="dashboard-hero__sub">Browse all our verified sustainable homestays across India.</p>
            </div>

            {/* Search + sort */}
            <div className="dashboard-controls">
              <div className="dashboard-search">
                <span>🔍</span>
                <input
                  id="dashboard-search"
                  type="text"
                  placeholder="Search by name or location…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="dashboard-search__input"
                />
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
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'all'      && '🌍 All Stays'}
                  {cat === 'mountain' && '🏔️ Mountain'}
                  {cat === 'forest'   && '🌲 Forest'}
                  {cat === 'riverside'&& '🏞️ Riverside'}
                  {cat === 'coastal'  && '🌊 Coastal'}
                </button>
              ))}
            </div>

            {/* Result count */}
            <p className="result-count">
              Showing <strong>{filtered.length}</strong> stays
              {activeCategory !== 'all' && ` in ${activeCategory}`}
              {searchQuery && ` for "${searchQuery}"`}
            </p>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid-3">
                {filtered.map(stay => (
                  <Card key={stay.id} {...stay} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <span>🌿</span>
                <h3>No stays found</h3>
                <p>Try adjusting your filters or search query.</p>
                <button className="btn btn-primary" onClick={() => { setSearchQuery(''); setActiveCategory('all') }}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Booking stats banner */}
        <section className="dashboard-stats-banner">
          <div className="container dashboard-stats-inner">
            {[
              { icon: '🏡', value: '200+',  label: 'Verified Eco-Stays' },
              { icon: '📍', value: '50+',   label: 'Destinations Covered' },
              { icon: '✅', value: '100%',  label: 'Eco Certified' },
              { icon: '⚡', value: 'Instant',label: 'Booking Confirmation' },
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
    </div>
  )
}
