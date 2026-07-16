import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    document.title = "404 Not Found | Trishul StayEase"
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '6rem', color: 'var(--primary)', margin: 0 }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '2rem' }}>
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
          Return to Home
        </Link>
      </main>
      <Footer />
    </div>
  )
}
