import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/config'

// Initialize Supabase client
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-key'
)

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return SUPABASE_URL && SUPABASE_ANON_KEY && 
         SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== ''
}
