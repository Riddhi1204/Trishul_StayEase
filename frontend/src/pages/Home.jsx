import Navbar from '../components/Navbar'
import Hero   from '../components/Hero'
import Card   from '../components/Card'
import Footer from '../components/Footer'
import mountainRetreatImg from '../assets/mountain_retreat.png'
import './Home.css'

const stays = [
  {
    id: 1,
    image: mountainRetreatImg,
    tag: '🏔️ Mountain',
    title: 'Mountain Retreat',
    location: 'Munsiyari, Uttarakhand',
    description:
      'Wake up to panoramic Himalayan views. This eco-homestay offers organic meals, guided treks, and star-gazing nights at 2,800m altitude.',
    price: '3,200',
    rating: '4.9',
    reviews: '128',
    features: ['🌄 Mountain View', '🥗 Organic Meals', '🥾 Guided Treks'],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    tag: '🌲 Forest',
    title: 'Forest Cabin',
    location: 'Coorg, Karnataka',
    description:
      'Nestled inside a 50-acre coffee estate. Immerse yourself in dense forest, listen to birdsong, and sip freshly brewed estate coffee.',
    price: '2,800',
    rating: '4.8',
    reviews: '95',
    features: ['☕ Coffee Estate', '🦜 Bird Watching', '🌿 Nature Walks'],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    tag: '🏞️ Riverside',
    title: 'Riverside Homestay',
    location: 'Rishikesh, Uttarakhand',
    description:
      'Sleep to the sound of the Ganga. Yoga sessions at sunrise, river rafting adventures, and traditional Garhwali home-cooked cuisine.',
    price: '2,500',
    rating: '4.7',
    reviews: '212',
    features: ['🧘 Yoga Classes', '🚣 River Rafting', '🍛 Local Cuisine'],
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    tag: '🏕️ Valley',
    title: 'Valley Farmstay',
    location: 'Spiti Valley, Himachal',
    description:
      'A solar-powered farmstay in the cold desert valley. Help with apple harvesting, visit ancient monasteries, and enjoy starlit skies.',
    price: '4,000',
    rating: '5.0',
    reviews: '67',
    features: ['☀️ Solar Powered', '🍎 Harvest Season', '🏛️ Monastery Visits'],
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=600&q=80',
    tag: '🌊 Coastal',
    title: 'Coastal Eco Villa',
    location: 'Varkala, Kerala',
    description:
      'A cliff-top eco villa overlooking the Arabian Sea. Experience Ayurvedic treatments, Kerala cooking classes, and dolphin watching.',
    price: '3,600',
    rating: '4.8',
    reviews: '183',
    features: ['🌊 Sea View', '💆 Ayurveda Spa', '🐬 Dolphin Watching'],
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
    tag: '🎋 Bamboo',
    title: 'Bamboo Forest Retreat',
    location: 'Sikkim, Northeast India',
    description:
      'Stay in handcrafted bamboo cottages in a UNESCO biosphere. Experience rich Sikkimese culture, cardamom farms, and rhododendron forests.',
    price: '2,200',
    rating: '4.9',
    reviews: '54',
    features: ['🎋 Bamboo Cottages', '🌸 Rhododendrons', '🌱 Organic Farming'],
  },
]

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

export default function Home() {
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
              { icon: '🌿', title: 'Eco Certified',      desc: 'All stays meet sustainability standards' },
              { icon: '🏡', title: 'Authentic Homes',     desc: 'Hosted by local families'                },
              { icon: '💰', title: 'Best Price Guarantee',desc: 'No hidden fees, ever'                    },
              { icon: '🛡️', title: 'Verified & Safe',     desc: 'Every stay is inspected'                },
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

        {/* Stays Grid */}
        <section className="section stays-section">
          <div className="container">
            <span className="badge">Featured Stays</span>
            <h2 className="section-title">Handpicked Eco-Stays</h2>
            <p className="section-subtitle">
              Every stay is verified for sustainability, authenticity, and unforgettable experiences.
            </p>
            <div className="grid-3">
              {stays.map(stay => (
                <Card key={stay.id} {...stay} />
              ))}
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
