import { Link } from 'react-router-dom'
import './Footer.css'

const footerLinks = {
  Explore: [
    { label: 'Mountain Stays', to: '/dashboard' },
    { label: 'Forest Cabins',  to: '/dashboard' },
    { label: 'Riverside Stays',to: '/dashboard' },
    { label: 'All Listings',   to: '/dashboard' },
  ],
  Company: [
    { label: 'About Us',    to: '/about'     },
    { label: 'How It Works',to: '/about'     },
    { label: 'Blog',        to: '/about'     },
    { label: 'Careers',     to: '/about'     },
  ],
  Support: [
    { label: 'Contact',     to: '/contact' },
    { label: 'FAQs',        to: '/contact' },
    { label: 'Help Center', to: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy',   to: '/privacy' },
    { label: 'Terms of Service', to: '/terms'   },
  ],
}

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/logo.svg" alt="Trishul StayEase Logo" style={{ height: '32px', width: 'auto' }} />
            </Link>
            <p className="footer__tagline">
              Connecting travellers with authentic eco-homestays across India's most
              stunning natural landscapes.
            </p>
            <div className="footer__socials">
              {['🐦', '📸', '💼', '▶️'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="footer__social-btn"
                  aria-label={`Social link ${i + 1}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div className="footer__col" key={heading}>
              <h4 className="footer__col-heading">{heading}</h4>
              <ul className="footer__col-links">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="footer__link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="footer__newsletter">
            <h4 className="footer__col-heading">Stay Updated</h4>
            <p className="footer__newsletter-text">
              Get the best eco-stay deals and travel tips in your inbox.
            </p>
            <form className="footer__form" onSubmit={e => e.preventDefault()}>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email address"
                className="footer__input"
                aria-label="Email for newsletter"
              />
              <button type="submit" className="btn btn-primary footer__subscribe-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} Trishul StayEase. Built with ❤️ for sustainable travel.</p>
          <div className="footer__bottom-links">
            <Link to="/privacy" className="footer__bottom-link">Privacy Policy</Link>
            <Link to="/terms" className="footer__bottom-link">Terms of Service</Link>
            <Link to="/contact" className="footer__bottom-link">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
