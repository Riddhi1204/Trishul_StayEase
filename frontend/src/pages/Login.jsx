import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export default function Login() {
  const { login, loading, error, clearError, isAuthenticated } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  const [form,   setForm]   = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)

  // If already logged in, skip the login page
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, from, navigate])

  // Clear server errors when form changes
  useEffect(() => {
    if (error) clearError()
  }, [form]) // eslint-disable-line

  const validate = () => {
    const errs = {}
    if (!form.email.trim())   errs.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password)       errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Minimum 8 characters'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    try {
      await login(form.email, form.password)
      // Navigation is handled by the useEffect above (isAuthenticated changes)
    } catch {
      // error is set in AuthContext
    }
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="page-main login-page">
        {/* Background blobs */}
        <div className="login-bg-blobs" aria-hidden="true">
          <div className="login-blob login-blob--1" />
          <div className="login-blob login-blob--2" />
          <div className="login-blob login-blob--3" />
        </div>

        <div className="container login-container">
          {/* Left visual panel */}
          <div className="login-visual">
            <div className="login-visual__card">
              <div className="login-visual__img" />
              <div className="login-visual__overlay">
                <h2>Welcome back to Trishul StayEase</h2>
                <p>Your sustainable travel journey continues here.</p>
                <div className="login-visual__avatars">
                  {['👩','👨','👩‍🦱','👨‍🦳','👩‍🦰'].map((a, i) => (
                    <span key={i} className="login-avatar" style={{ zIndex: 5 - i }}>{a}</span>
                  ))}
                  <span className="login-avatar-count">+9,995</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="login-form-panel">
            {/* Mode toggle */}
            <div className="login-toggle" role="tablist">
              <button
                role="tab"
                aria-selected="true"
                className="login-toggle__btn active"
              >
                Sign In
              </button>
              <Link
                to="/register"
                className="login-toggle__btn"
                style={{ textDecoration: 'none' }}
              >
                Sign Up
              </Link>
            </div>

            <div className="login-form-header">
              <h1 className="login-form__title">Welcome back 👋</h1>
              <p className="login-form__sub">
                Sign in to access your bookings and saved stays.
              </p>
            </div>

            {/* Server error banner */}
            {error && (
              <div style={{
                background: '#ff6b6b22',
                border: '1px solid #ff6b6b55',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                color: '#ff6b6b',
                fontSize: '0.9rem',
              }}>
                {error}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className={`form-group${errors.email ? ' form-group--error' : ''}`}>
                <label htmlFor="login-email" className="form-label">Email Address</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">✉️</span>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="form-input"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className={`form-group${errors.password ? ' form-group--error' : ''}`}>
                <div className="form-label-row">
                  <label htmlFor="login-password" className="form-label">Password</label>
                  <a href="#" className="form-forgot">Forgot password?</a>
                </div>
                <div className="form-input-wrap">
                  <span className="form-input-icon">🔒</span>
                  <input
                    id="login-password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="form-input"
                    autoComplete="current-password"
                    disabled={loading}
                    style={{ paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      opacity: 0.6,
                    }}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <button
                type="submit"
                className="btn btn-primary login-submit-btn"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <p className="login-switch">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="login-switch__link" style={{ textDecoration: 'none' }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
