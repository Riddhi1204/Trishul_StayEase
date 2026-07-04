/**
 * components/RoleRoute.jsx
 * ─────────────────────────
 * Restricts access to authenticated users with specific roles.
 * Renders <Unauthorized /> for authenticated users with the wrong role.
 * Redirects to /login for unauthenticated users.
 *
 * Usage:
 *   <Route path="/admin" element={
 *     <RoleRoute roles={["admin"]}><AdminPanel /></RoleRoute>
 *   } />
 *
 *   <Route path="/my-properties" element={
 *     <RoleRoute roles={["host", "admin"]}><MyProperties /></RoleRoute>
 *   } />
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Unauthorized from '../pages/Unauthorized'

export default function RoleRoute({ roles = [], children }) {
  const { user, isAuthenticated, loading } = useAuth()
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
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!roles.includes(user?.role)) {
    return <Unauthorized requiredRoles={roles} userRole={user?.role} />
  }

  return children
}
