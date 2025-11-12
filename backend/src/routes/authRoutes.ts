import { Router } from 'express'
import { supabase } from '../config/supabase'

const router = Router()

// Create user using service_role (server-side) and create profile row
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Create user via admin API using service role key
    // Use `as any` to allow passing additional dev-only flags without TypeScript errors
    const createPayload: any = { email, password, user_metadata: { username } }

    // If not in production, include a hint to attempt immediate confirmation (best-effort)
    if (process.env.NODE_ENV !== 'production') {
      // Some supabase admin APIs accept flags like `email_confirm` or `email_confirmed_at`.
      // We add both here as a best-effort to mark test users confirmed. If the runtime
      // supabase client doesn't support a particular field the subsequent try/catch
      // will safely ignore the error and registration will still succeed.
      createPayload.email_confirm = true
      createPayload.email_confirmed_at = new Date().toISOString()
    }

    const { data: userData, error: userError } = await (supabase.auth.admin as any).createUser(createPayload)

    if (userError) throw userError

    const user = userData.user

    // Best-effort: try to explicitly update the newly created user to set the
    // email confirmed timestamp if we're in a non-production environment.
    // This uses admin.updateUserById if available on the runtime client. We swallow
    // any errors here because some supabase client versions may not expose this method
    // or may expect different field names.
    if (process.env.NODE_ENV !== 'production') {
      try {
        const confirmedAt = new Date().toISOString()
        if ((supabase.auth.admin as any).updateUserById) {
          await (supabase.auth.admin as any).updateUserById(user.id, { email_confirmed_at: confirmedAt })
        }
      } catch (err: any) {
        console.warn('Auto-confirm attempt failed (non-fatal):', err?.message || err)
      }
    }

    // Try to insert profile row; if the profiles table doesn't exist, return user created but warn
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, username, email }])
        .select()
        .single()

      if (profileError) throw profileError

      res.status(201).json({ user: user, profile: profileData })
    } catch (profileErr: any) {
      console.warn('Could not insert profile row:', profileErr.message || profileErr)
      // Return created user but indicate profile not created
      res.status(201).json({ user: user, profile: null, warning: 'profiles table not found or insert failed. Run supabase_schema.sql to create profiles table.' })
    }
  } catch (error: any) {
    console.error('Auth register error:', error)
    res.status(500).json({ error: error.message || 'Registration failed' })
  }
})

export default router
