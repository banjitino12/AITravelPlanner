import dotenv from 'dotenv'
// Ensure environment variables are loaded even if this module is imported early
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

if (!supabaseUrl) {
	throw new Error('SUPABASE_URL is required. Please set SUPABASE_URL in backend/.env or environment.')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)
