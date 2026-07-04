/**
 * contexts/AuthContext.jsx
 * ─────────────────────────
 * Global authentication state for the entire app.
 *
 * Provides:
 *   user            — current user object (or null)
 *   loading         — true while an auth request is in-flight
 *   error           — last auth error message (or null)
 *   isAuthenticated — boolean shortcut
 *   role            — user.role shortcut
 *   login()         — email + password → sets user + token in state & localStorage
 *   register()      — full form data → sets user + token in state & localStorage
 *   logout()        — clears everything
 *   clearError()    — resets error state
 *
 * Usage:
 *   const { user, login, logout, isAuthenticated } = useAuth()
 */

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

import { loginUser, registerUser } from '../services/auth'

const AuthContext = createContext(null)

// ── Storage helpers ────────────────────────────────────────────────
const TOKEN_KEY = 'trishul-token'
const USER_KEY  = 'trishul-user'

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// ── Provider ───────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(loadUser)   // hydrate from localStorage
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { access_token, user: userData } = await loginUser(email, password)
      persistSession(access_token, userData)
      setUser(userData)
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const { access_token, user: userData } = await registerUser(formData)
      persistSession(access_token, userData)
      setUser(userData)
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        isAuthenticated: !!user,
        role: user?.role ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────
/**
 * Custom hook to access auth state and actions.
 * Must be called inside an <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>.')
  }
  return ctx
}
