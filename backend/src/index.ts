import dotenv from 'dotenv'
// Load environment variables as early as possible so other modules can read them
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import planRoutes from './routes/planRoutes'
import expenseRoutes from './routes/expenseRoutes'
import { supabase } from './config/supabase'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Development-only DB connectivity test
app.get('/api/db-test', async (req, res) => {
  try {
    // Try a simple select to verify connection and permissions
    const { data, error } = await supabase.from('travel_plans').select('id').limit(1)
    if (error) throw error
    res.json({ ok: true, sample: data })
  } catch (err: any) {
    console.error('DB test error:', err)
    res.status(500).json({ ok: false, error: err.message || err })
  }
})

// (DB test route defined above)

// Routes
app.use('/api/plans', planRoutes)
app.use('/api/expenses', expenseRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
