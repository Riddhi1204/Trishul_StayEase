import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/**
 * Unauthorized page — shown when an authenticated user accesses a route
 * they don't have the right role for. (403 Forbidden equivalent)
 */
export default function Unauthorized({ requiredRoles = [], userRole = '' }) {
  const navigate = useNavigate()

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '4rem 1.5rem',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff6b6b22, #ff6b6b44)',
          border: '2px solid #ff6b6b55',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
        }}>
          🚫
        </div>

        <div>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            color: 'var(--text-primary, #f0f4f8)',
            margin: '0 0 0.75rem',
          }}>
            Access Denied
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted, #8899aa)',
            maxWidth: 420,
            lineHeight: 1.6,
            margin: '0 auto',
          }}>
            {userRole
              ? `Your current role (${userRole}) doesn't have permission to view this page.`
              : "You don't have permission to view this page."}
            {requiredRoles.length > 0 && (
              <> Required: <strong style={{ color: 'var(--accent, #52b788)' }}>
                {requiredRoles.join(' or ')}
              </strong></>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline"
          >
            ← Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
