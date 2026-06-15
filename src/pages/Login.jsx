import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Login.css'

export default function Login() {
  const [mode,   setMode]   = useState('login')   // 'login' | 'signup'
  const [form,   setForm]   = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const errs = {}
    if (mode === 'signup' && !form.name.trim()) errs.name = 'Full name is required'
    if (!form.email.trim())    errs.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password)        errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters'
    return errs
  }

  const handleSubmit = e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitted(true)
  }

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  if (submitted) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="page-main login-page">
          <div className="login-bg-blobs">
            <div className="login-blob login-blob--1" />
            <div className="login-blob login-blob--2" />
          </div>
          <div className="login-success">
            <div className="login-success__icon">🎉</div>
            <h2>Welcome to Trishul StayEase!</h2>
            <p>You've successfully {mode === 'login' ? 'logged in' : 'created your account'}.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Explore Eco-Stays →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="page-main login-page">
        {/* Background */}
        <div className="login-bg-blobs" aria-hidden="true">
          <div className="login-blob login-blob--1" />
          <div className="login-blob login-blob--2" />
          <div className="login-blob login-blob--3" />
        </div>

        <div className="container login-container">
          {/* Left panel */}
          <div className="login-visual">
            <div className="login-visual__card">
              <div className="login-visual__img" />
              <div className="login-visual__overlay">
                <h2>Join 10,000+ eco-travellers</h2>
                <p>Discover authentic homestays. Support local communities. Travel responsibly.</p>
                <div className="login-visual__avatars">
                  {['👩','👨','👩‍🦱','👨‍🦳','👩‍🦰'].map((a,i) => (
                    <span key={i} className="login-avatar" style={{ zIndex: 5-i }}>{a}</span>
                  ))}
                  <span className="login-avatar-count">+9,995</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Form */}
          <div className="login-form-panel">
            {/* Toggle */}
            <div className="login-toggle" role="tablist">
              <button
                id="tab-login"
                role="tab"
                aria-selected={mode === 'login'}
                className={`login-toggle__btn${mode === 'login' ? ' active' : ''}`}
                onClick={() => { setMode('login'); setErrors({}); setForm({ name:'', email:'', password:'' }) }}
              >
                Sign In
              </button>
              <button
                id="tab-signup"
                role="tab"
                aria-selected={mode === 'signup'}
                className={`login-toggle__btn${mode === 'signup' ? ' active' : ''}`}
                onClick={() => { setMode('signup'); setErrors({}); setForm({ name:'', email:'', password:'' }) }}
              >
                Sign Up
              </button>
            </div>

            <div className="login-form-header">
              <h1 className="login-form__title">
                {mode === 'login' ? 'Welcome back 👋' : 'Create your account 🌿'}
              </h1>
              <p className="login-form__sub">
                {mode === 'login'
                  ? 'Sign in to access your bookings and saved stays.'
                  : 'Join us and start your sustainable travel journey.'}
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {mode === 'signup' && (
                <div className={`form-group${errors.name ? ' form-group--error' : ''}`}>
                  <label htmlFor="login-name" className="form-label">Full Name</label>
                  <div className="form-input-wrap">
                    <span className="form-input-icon">👤</span>
                    <input
                      id="login-name"
                      name="name"
                      type="text"
                      placeholder="Ananya Joshi"
                      value={form.name}
                      onChange={handleChange}
                      className="form-input"
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
              )}

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
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className={`form-group${errors.password ? ' form-group--error' : ''}`}>
                <div className="form-label-row">
                  <label htmlFor="login-password" className="form-label">Password</label>
                  {mode === 'login' && (
                    <a href="#" className="form-forgot">Forgot password?</a>
                  )}
                </div>
                <div className="form-input-wrap">
                  <span className="form-input-icon">🔒</span>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="form-input"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <button type="submit" className="btn btn-primary login-submit-btn">
                {mode === 'login' ? 'Sign In →' : 'Create Account →'}
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider"><span>or continue with</span></div>

            {/* Social login */}
            <div className="login-socials">
              {['🔵 Google', '⬛ Apple', '🔷 Facebook'].map(s => (
                <button key={s} className="login-social-btn">{s}</button>
              ))}
            </div>

            <p className="login-switch">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                className="login-switch__link"
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrors({}); }}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
