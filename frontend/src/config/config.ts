// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Supabase Configuration (to be set by user)
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Amap Configuration (to be set by user)
export const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || ''

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  API_KEYS: 'api_keys',
}
