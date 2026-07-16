import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

/** Sun icon for light mode */
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

/** Moon icon for dark mode */
function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

/** Theme toggle button */
function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      className={`navbar__theme-toggle ${className}`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/login')
  }

  // Dynamic role-based links
  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { to: '/', label: 'Home' },
        { to: '/explore', label: 'Explore' }, // using /explore now
        { to: '/about', label: 'About' },
        { to: '/register', label: 'Become a Host', state: { role: 'host' } },
      ]
    }

    if (user?.role === 'guest') {
      return [
        { to: '/', label: 'Home' },
        { to: '/explore', label: 'Explore' },
        { to: '/bookings', label: 'Bookings' },
        { to: '/wishlist', label: 'Wishlist' },
      ]
    }

    if (user?.role === 'host') {
      return [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/my-properties', label: 'My Properties' },
        { to: '/host-bookings', label: 'Bookings' },
        { to: '/messages', label: 'Messages' },
      ]
    }

    if (user?.role === 'admin') {
      return [
        { to: '/admin', label: 'Admin Dashboard' },
        { to: '/admin/users', label: 'Users' },
        { to: '/admin/properties', label: 'Properties' },
        { to: '/admin/bookings', label: 'Bookings' },
        { to: '/admin/reports', label: 'Reports' },
      ]
    }

    return []
  }

  const navLinks = getNavLinks()

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.svg" alt="Trishul StayEase Logo" style={{ height: '100px', width: 'auto' }} />
        </Link>

        {/* Desktop nav */}
        <nav className="navbar__links" aria-label="Main navigation">
          {navLinks.map(({ to, label, state }) => (
            <NavLink
              key={to}
              to={to}
              state={state}
              end={to === '/'}
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' navbar__link--active' : '')
              }
            >
              {label}
            </NavLink>
          ))}
          {/* Profile link if authenticated */}
          {isAuthenticated && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' navbar__link--active' : '')
              }
            >
              Profile
            </NavLink>
          )}
        </nav>

        {/* Desktop actions */}
        <div className="navbar__actions">
          <ThemeToggle />
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-outline navbar__btn-login">Login</Link>
              <Link to="/register" className="btn btn-primary navbar__btn-book">Register</Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Hi, <strong>{user.fullName.split(' ')[0]}</strong>
              </span>
              <button onClick={handleLogout} className="btn btn-outline navbar__btn-login">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          id="nav-hamburger"
          className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}>
        {navLinks.map(({ to, label, state }) => (
          <NavLink
            key={to}
            to={to}
            state={state}
            end={to === '/'}
            className={({ isActive }) =>
              'navbar__mobile-link' + (isActive ? ' active' : '')
            }
            onClick={closeMenu}
          >
            {label}
          </NavLink>
        ))}
        {isAuthenticated && (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              'navbar__mobile-link' + (isActive ? ' active' : '')
            }
            onClick={closeMenu}
          >
            Profile
          </NavLink>
        )}
        <div className="navbar__mobile-actions">
          <ThemeToggle className="navbar__theme-toggle--mobile" />
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
