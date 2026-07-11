import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import './Login.css' // Reusing Login's excellent styling

export default function Register() {
  const { register, loginWithGoogle, loading, error, clearError, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const googleButtonRef = useRef(null)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'guest'
  })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [strength, setStrength] = useState(0)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, from, navigate])

  // Calculate password strength
  useEffect(() => {
    const pw = form.password
    if (!pw) {
      setStrength(0)
      return
    }
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[a-z]/.test(pw) && /\d/.test(pw)) s++
    if (/[@$!%*?&#^]/.test(pw)) s++
    setStrength(s)
  }, [form.password])

  // Clear server errors when form changes
  useEffect(() => {
    if (error) clearError()
  }, [form]) // eslint-disable-line

  // Keep track of latest role for Google button callback
  const roleRef = useRef(form.role)
  useEffect(() => {
    roleRef.current = form.role
  }, [form.role])

  // Initialize Google Sign-In button
  useEffect(() => {
    const initGoogle = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '506642311597-ln1liscp1tij57ass4r27hi2ttabtmc3.apps.googleusercontent.com',
          callback: async (response) => {
            try {
              await loginWithGoogle(response.credential, roleRef.current)
            } catch (err) {
              console.error("Google login failed", err)
            }
          },
        })
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
          shape: 'rectangular',
        })
      } else {
        setTimeout(initGoogle, 100)
      }
    }
    initGoogle()
  }, [loginWithGoogle])

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    else if (!/^\+?[\d\s\-()]{10,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number'
    
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Minimum 8 characters'
    
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    try {
      await register(form)
      // Navigation is handled by the useEffect above
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
        <div className="login-bg-blobs" aria-hidden="true">
          <div className="login-blob login-blob--1" />
          <div className="login-blob login-blob--2" />
          <div className="login-blob login-blob--3" />
        </div>

        <div className="container login-container">
          <div className="login-visual">
            <div className="login-visual__card">
              <div className="login-visual__img" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")' }} />
              <div className="login-visual__overlay">
                <h2>Join 10,000+ eco-travellers</h2>
                <p>Discover authentic homestays. Support local communities. Travel responsibly.</p>
                <div className="login-visual__avatars">
                  {['👩','👨','👩‍🦱','👨‍🦳','👩‍🦰'].map((a, i) => (
                    <span key={i} className="login-avatar" style={{ zIndex: 5 - i }}>{a}</span>
                  ))}
                  <span className="login-avatar-count">+9,995</span>
                </div>
              </div>
            </div>
          </div>

          <div className="login-form-panel" style={{ position: 'relative' }}>
            {loading && (
              <div className="auth-loading-overlay">
                <div style={{
                  width: 40, height: 40,
                  border: '3px solid #2d6a4f', borderTop: '3px solid #52b788',
                  borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                }} />
              </div>
            )}
            <div className="login-toggle" role="tablist">
              <Link to="/login" className="login-toggle__btn" style={{ textDecoration: 'none' }}>
                Sign In
              </Link>
              <button role="tab" aria-selected="true" className="login-toggle__btn active">
                Sign Up
              </button>
            </div>

            <div className="login-form-header">
              <h1 className="login-form__title">Create Account 🌿</h1>
              <p className="login-form__sub">
                Join us and start your sustainable travel journey.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', minHeight: '44px' }}>
              <div ref={googleButtonRef}></div>
            </div>

            <div className="login-divider">
              <span>or sign up with email</span>
            </div>

            {error && (
              <div style={{
                background: '#ff6b6b22', border: '1px solid #ff6b6b55', borderRadius: '0.5rem',
                padding: '0.75rem 1rem', marginBottom: '1rem', color: '#ff6b6b', fontSize: '0.9rem',
              }}>
                {error}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className={`form-group${errors.fullName ? ' form-group--error' : ''}`}>
                <label htmlFor="reg-name" className="form-label">Full Name</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">👤</span>
                  <input
                    id="reg-name" name="fullName" type="text" placeholder="Ananya Joshi"
                    value={form.fullName} onChange={handleChange} className="form-input"
                    autoComplete="name" disabled={loading}
                  />
                </div>
                {errors.fullName && <p className="form-error">{errors.fullName}</p>}
              </div>

              <div className={`form-group${errors.email ? ' form-group--error' : ''}`}>
                <label htmlFor="reg-email" className="form-label">Email Address</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">✉️</span>
                  <input
                    id="reg-email" name="email" type="email" placeholder="you@example.com"
                    value={form.email} onChange={handleChange} className="form-input"
                    autoComplete="email" disabled={loading}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className={`form-group${errors.phone ? ' form-group--error' : ''}`}>
                <label htmlFor="reg-phone" className="form-label">Phone Number</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">📱</span>
                  <input
                    id="reg-phone" name="phone" type="tel" placeholder="+91 98765 43210"
                    value={form.phone} onChange={handleChange} className="form-input"
                    autoComplete="tel" disabled={loading}
                  />
                </div>
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>

              <div className={`form-group${errors.password ? ' form-group--error' : ''}`}>
                <label htmlFor="reg-password" className="form-label">Password</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">🔒</span>
                  <input
                    id="reg-password" name="password" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                    value={form.password} onChange={handleChange} className="form-input"
                    autoComplete="new-password" disabled={loading} style={{ paddingRight: '3rem' }}
                  />
                  <button
                    type="button" onClick={() => setShowPw(v => !v)} aria-label="Toggle password visibility"
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.6,
                    }}
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
                {form.password && (
                  <div className="password-strength">
                    <div className="password-strength-bars">
                      <div className={`strength-bar ${strength >= 1 ? 'active-weak' : ''}`} />
                      <div className={`strength-bar ${strength >= 2 ? 'active-fair' : ''}`} />
                      <div className={`strength-bar ${strength >= 3 ? 'active-good' : ''}`} />
                      <div className={`strength-bar ${strength >= 4 ? 'active-strong' : ''}`} />
                    </div>
                    <ul className="password-requirements">
                      <li className={form.password.length >= 8 ? 'met' : ''}>
                        {form.password.length >= 8 ? '✓' : '○'} At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(form.password) ? 'met' : ''}>
                        {/[A-Z]/.test(form.password) ? '✓' : '○'} One uppercase letter
                      </li>
                      <li className={/[a-z]/.test(form.password) && /\d/.test(form.password) ? 'met' : ''}>
                        {/[a-z]/.test(form.password) && /\d/.test(form.password) ? '✓' : '○'} Letters & numbers
                      </li>
                      <li className={/[@$!%*?&#^]/.test(form.password) ? 'met' : ''}>
                        {/[@$!%*?&#^]/.test(form.password) ? '✓' : '○'} One special character
                      </li>
                    </ul>
                  </div>
                )}
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div className={`form-group${errors.confirmPassword ? ' form-group--error' : ''}`}>
                <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">🔐</span>
                  <input
                    id="reg-confirm" name="confirmPassword" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                    value={form.confirmPassword} onChange={handleChange} className="form-input"
                    autoComplete="new-password" disabled={loading}
                  />
                </div>
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">I want to...</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="role" value="guest" checked={form.role === 'guest'} onChange={handleChange} disabled={loading} />
                    <span>Travel (Guest)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="role" value="host" checked={form.role === 'host'} onChange={handleChange} disabled={loading} />
                    <span>Host properties (Host)</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>

            <p className="login-switch">
              Already have an account?{' '}
              <Link to="/login" className="login-switch__link" style={{ textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
