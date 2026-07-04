/**
 * components/ProtectedRoute.jsx
 * ──────────────────────────────
 * Redirects unauthenticated users to /login.
 * Shows a loading spinner while auth state is being resolved.
 *
 * Usage:
 *   <Route path="/dashboard" element={
 *     <ProtectedRoute><Dashboard /></ProtectedRoute>
 *   } />
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary, #0a0f1e)',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #2d6a4f',
          borderTop: '3px solid #52b788',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Save intended destination so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
