/**
 * services/auth.js
 * ─────────────────
 * API calls for authentication endpoints.
 * Uses the shared Axios instance from api.js so JWT interceptors apply automatically.
 */

import api from './api'

/**
 * Register a new user account.
 * @param {{ fullName, email, phone, password, confirmPassword, role }} data
 * @returns {{ access_token, token_type, user }}
 */
export async function registerUser(data) {
  const { data: response } = await api.post('/auth/register', data)
  return response
}

/**
 * Login with email + password.
 * @param {string} email
 * @param {string} password
 * @returns {{ access_token, token_type, user }}
 */
export async function loginUser(email, password) {
  const { data: response } = await api.post('/auth/login', { email, password })
  return response
}

/**
 * Fetch the current authenticated user profile.
 * JWT is attached automatically by the Axios interceptor.
 * @returns {UserResponse}
 */
export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}
