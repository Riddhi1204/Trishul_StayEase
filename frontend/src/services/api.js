/**
 * Trishul StayEase — API Service Layer
 *
 * All backend communication goes through this file.
 * Base URL is read from VITE_API_URL environment variable.
 *
 * Endpoints:
 *   fetchProperties()          GET  /api/properties
 *   fetchProperty(id)          GET  /api/properties/:id
 *   createProperty(data)       POST /api/properties
 *   updateProperty(id, data)   PUT  /api/properties/:id
 *   deleteProperty(id)         DELETE /api/properties/:id
 *   searchProperties(q)        GET  /api/properties/search?q=
 *   filterProperties(params)   GET  /api/properties/filter?max_price=&type=&status=
 */

import axios from 'axios'

// ── Axios instance ────────────────────────────────────────────────────────────

const defaultBaseUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://trishul-stayease.onrender.com'
const BASE_URL = import.meta.env.VITE_API_URL || defaultBaseUrl

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor — attach JWT to every request ────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trishul-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — normalise errors + handle 401 ─────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect on auth endpoint failures (bad credentials, not expired token)
      const isAuthCall = error.config?.url?.includes('/auth/')
      const onAuthPage = ['/login', '/register'].includes(window.location.pathname)

      if (!isAuthCall && !onAuthPage) {
        // Token expired or invalid — clear session and redirect
        localStorage.removeItem('trishul-token')
        localStorage.removeItem('trishul-user')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    const message =
      error.response?.data?.detail ||
      error.message ||
      'An unexpected error occurred.'
    return Promise.reject(new Error(message))
  }
)

// ── UI enrichment helpers ─────────────────────────────────────────────────────
// The backend returns a minimal model; these helpers add image, tag, features
// and other display-only fields that the Card component needs.

const TYPE_MAP = {
  mountain: {
    tag:      '🏔️ Mountain',
    image:    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    features: ['🌄 Mountain View', '🥗 Organic Meals', '🥾 Guided Treks'],
    rating:   '4.9',
    reviews:  '128',
    description:
      'Wake up to panoramic Himalayan views with organic meals, guided treks, and star-gazing nights.',
  },
  forest: {
    tag:      '🌲 Forest',
    image:    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    features: ['☕ Coffee Estate', '🦜 Bird Watching', '🌿 Nature Walks'],
    rating:   '4.8',
    reviews:  '95',
    description:
      'Nestled inside a lush forest estate. Immerse yourself in nature and sip freshly brewed estate coffee.',
  },
  riverside: {
    tag:      '🏞️ Riverside',
    image:    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    features: ['🧘 Yoga Classes', '🚣 River Rafting', '🍛 Local Cuisine'],
    rating:   '4.7',
    reviews:  '212',
    description:
      'Sleep to the sound of the river. Yoga at sunrise, river activities, and home-cooked cuisine.',
  },
  coastal: {
    tag:      '🌊 Coastal',
    image:    'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=600&q=80',
    features: ['🌊 Sea View', '💆 Ayurveda Spa', '🐬 Dolphin Watching'],
    rating:   '4.8',
    reviews:  '183',
    description:
      'An eco-villa overlooking the sea with Ayurvedic treatments, cooking classes, and water activities.',
  },
}

const DEFAULT_ENRICHMENT = {
  tag:      '🏡 Homestay',
  image:    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
  features: ['🌿 Eco Stay', '🏡 Local Hosts', '✅ Verified'],
  rating:   '4.7',
  reviews:  '60',
  description: 'A verified eco-friendly stay hosted by a local family.',
}

/**
 * Enrich a raw backend property with UI display fields.
 * @param {object} prop - Raw property from API
 * @returns {object} - Enriched property ready for the Card component
 */
export function enrichProperty(prop) {
  const ui = TYPE_MAP[prop.type?.toLowerCase()] || DEFAULT_ENRICHMENT
  return {
    ...ui,
    // Override with real database values if they exist
    image:       (prop.images && prop.images.length > 0) ? prop.images[0] : ui.image,
    description: prop.description || ui.description,
    features:    (prop.amenities && prop.amenities.length > 0) ? prop.amenities : ui.features,
    
    id:          prop.id,
    title:       prop.title,
    location:    prop.location,
    city:        prop.city || '',
    state:       prop.state || '',
    country:     prop.country || '',
    price:       prop.price.toLocaleString('en-IN'),
    category:    prop.type?.toLowerCase() || 'other',
    status:      prop.status,
    // Keep raw values for sorting/editing
    _rawPrice:   prop.price,
    _rawType:    prop.type,
    _rawImages:  prop.images || [],
    _rawAmenities: prop.amenities || [],
  }
}

// ── API functions ─────────────────────────────────────────────────────────────

/**
 * Fetch all properties and enrich them for UI display.
 * @returns {Promise<Array>} Enriched property list
 */
export async function fetchProperties() {
  const { data } = await api.get('/api/properties')
  return data.map(enrichProperty)
}

/**
 * Fetch all properties owned by the current host.
 * @returns {Promise<Array>} Enriched property list
 */
export async function fetchMyProperties() {
  const { data } = await api.get('/api/properties/me/all')
  return data.map(enrichProperty)
}

/**
 * Fetch a single property by ID.
 * @param {number} id
 * @returns {Promise<object>} Enriched property
 */
export async function fetchProperty(id) {
  const { data } = await api.get(`/api/properties/${id}`)
  return enrichProperty(data)
}

/**
 * Create a new property.
 * @param {{ title: string, location: string, price: number, type: string, status: string }} payload
 * @returns {Promise<object>} The created property (enriched)
 */
export async function createProperty(payload) {
  const { data } = await api.post('/api/properties', payload)
  return enrichProperty(data)
}

/**
 * Update an existing property (partial update — only send changed fields).
 * @param {number} id
 * @param {object} payload - Fields to update
 * @returns {Promise<object>} The updated property (enriched)
 */
export async function updateProperty(id, payload) {
  const { data } = await api.put(`/api/properties/${id}`, payload)
  return enrichProperty(data)
}

/**
 * Delete a property by ID.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteProperty(id) {
  await api.delete(`/api/properties/${id}`)
}

/**
 * Search properties by title or location keyword.
 * @param {string} q - Search term
 * @returns {Promise<Array>} Matching enriched properties
 */
export async function searchProperties(q) {
  const { data } = await api.get('/api/properties/search', { params: { q } })
  return data.map(enrichProperty)
}

/**
 * Filter properties by price, type, or status.
 * @param {{ max_price?: number, type?: string, status?: string }} params
 * @returns {Promise<Array>} Filtered enriched properties
 */
export async function filterProperties(params = {}) {
  const { data } = await api.get('/api/properties/filter', { params })
  return data.map(enrichProperty)
}

export default api
