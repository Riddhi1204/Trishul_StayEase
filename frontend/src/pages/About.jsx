import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './About.css'

const team = [
  { name: 'Ananya Joshi',  role: 'Co-Founder & CEO',        emoji: '👩‍💼', bio: 'Sustainability champion with 10+ years in eco-tourism.' },
  { name: 'Rohan Kapoor',  role: 'Co-Founder & CTO',        emoji: '👨‍💻', bio: 'Full-stack engineer passionate about tech for good.' },
  { name: 'Meera Pillai',  role: 'Head of Host Relations',  emoji: '👩‍🤝‍👩', bio: 'Ensures every host community thrives and is supported.' },
  { name: 'Vikram Nair',   role: 'Sustainability Director',  emoji: '🌿', bio: 'Certified ecologist driving our green impact programs.' },
]

const milestones = [
  { year: '2019', event: 'Founded in Rishikesh with 5 homestays' },
  { year: '2020', event: 'Survived COVID by pivoting to local staycations' },
  { year: '2021', event: 'Reached 50 verified eco-stays across India' },
  { year: '2022', event: 'Planted 5,000 trees & launched carbon offset program' },
  { year: '2023', event: 'Crossed 10,000 happy guest milestone' },
  { year: '2024', event: '200+ stays, 50 destinations, nationwide' },
]

export default function About() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="page-main">
        {/* Page Hero */}
        <section className="page-hero about-hero">
          <div className="container page-hero__inner">
            <span className="badge">Our Story</span>
            <h1 className="page-hero__title">We believe travel can heal the planet</h1>
            <p className="page-hero__subtitle">
              Trishul StayEase was born from a simple idea: what if every journey you took
              left the world a little better than you found it?
            </p>
          </div>
          <div className="about-hero__wave" aria-hidden="true">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg)" />
            </svg>
          </div>
        </section>

        {/* Mission */}
        <section className="section">
          <div className="container about-mission">
            <div className="about-mission__text">
              <span className="badge">Our Mission</span>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                Connecting people, communities & nature
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                We curate eco-certified homestays run by local families who deeply care about their
                natural surroundings. By choosing Trishul StayEase, you're not just booking a bed —
                you're funding conservation, empowering rural livelihoods, and experiencing India in
                its most authentic form.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Every rupee you spend flows directly to host communities. We keep our fees minimal
                and transparent because we genuinely believe sustainable travel should be accessible
                to everyone.
              </p>
            </div>
            <div className="about-mission__stats">
              {[
                { value: '200+',  label: 'Eco-Stays',      icon: '🏡' },
                { value: '50+',   label: 'Destinations',   icon: '📍' },
                { value: '10k+',  label: 'Happy Guests',   icon: '😊' },
                { value: '15k+',  label: 'Trees Planted',  icon: '🌳' },
              ].map(s => (
                <div className="about-stat-card" key={s.label}>
                  <span className="about-stat-icon">{s.icon}</span>
                  <span className="about-stat-value">{s.value}</span>
                  <span className="about-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section about-timeline-section">
          <div className="container">
            <span className="badge">Our Journey</span>
            <h2 className="section-title">Milestones</h2>
            <p className="section-subtitle">Five years of making every journey count.</p>
            <div className="timeline">
              {milestones.map((m, i) => (
                <div className={`timeline__item${i % 2 === 0 ? '' : ' timeline__item--right'}`} key={m.year}>
                  <div className="timeline__dot" />
                  <div className="timeline__card">
                    <span className="timeline__year">{m.year}</span>
                    <p className="timeline__event">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section">
          <div className="container">
            <span className="badge">The People</span>
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">Passionate folks working to make sustainable travel mainstream.</p>
            <div className="team-grid">
              {team.map(member => (
                <div className="team-card" key={member.name}>
                  <div className="team-card__avatar">{member.emoji}</div>
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__role">{member.role}</p>
                  <p className="team-card__bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section about-values-section">
          <div className="container">
            <span className="badge">What We Stand For</span>
            <h2 className="section-title">Our Values</h2>
            <div className="values-grid">
              {[
                { icon: '🌱', title: 'Sustainability First',   desc: 'Every decision we make considers its environmental impact.' },
                { icon: '🤝', title: 'Community Empowerment', desc: 'Local hosts are equal partners, not just service providers.' },
                { icon: '🔍', title: 'Radical Transparency',  desc: 'No hidden fees. No greenwashing. Just honest eco-travel.' },
                { icon: '💡', title: 'Continuous Innovation', desc: 'We use technology to make responsible travel effortless.' },
              ].map(v => (
                <div className="value-card" key={v.title}>
                  <span className="value-card__icon">{v.icon}</span>
                  <h3 className="value-card__title">{v.title}</h3>
                  <p className="value-card__desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
