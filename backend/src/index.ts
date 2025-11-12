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
import authRoutes from './routes/authRoutes'
import { AIService } from './services/aiService'

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

// Development-only AI test endpoint (uses server-side env key). Only enabled when not in production.
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/dev/ai-test', async (req, res) => {
    try {
      const apiKey = process.env.BAILIAN_API_KEY || process.env.ALIYUN_API_KEY
      if (!apiKey) return res.status(400).json({ error: 'BAILIAN_API_KEY / ALIYUN_API_KEY is not set in environment' })

      const { destination = '北京', startDate, endDate, budget = 1000, travelers = 1, preferences = [] } = req.body || {}

      // Provide sensible defaults for dates if not provided
      const now = new Date()
      const defaultStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString().split('T')[0]
      const defaultEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 9).toISOString().split('T')[0]

      const planRequest = {
        destination,
        startDate: startDate || defaultStart,
        endDate: endDate || defaultEnd,
        budget,
        travelers,
        preferences,
      }

      const ai = new AIService(apiKey)
      const result = await ai.generateTravelPlan(planRequest)
      res.json({ ok: true, result })
    } catch (err: any) {
      console.error('Dev AI test error:', err)
      res.status(500).json({ ok: false, error: err.message || err })
    }
  })
  // Dev-only raw AI call endpoint that returns full remote response/error
  app.post('/api/dev/ai-test-raw', async (req, res) => {
    try {
      const apiKey = process.env.BAILIAN_API_KEY || process.env.ALIYUN_API_KEY
      if (!apiKey) return res.status(400).json({ error: 'BAILIAN_API_KEY / ALIYUN_API_KEY is not set in environment' })

      const { destination = '北京', startDate, endDate, budget = 1000, travelers = 1, preferences = [] } = req.body || {}
      const now = new Date()
      const defaultStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString().split('T')[0]
      const defaultEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 9).toISOString().split('T')[0]

      const planRequest = {
        destination,
        startDate: startDate || defaultStart,
        endDate: endDate || defaultEnd,
        budget,
        travelers,
        preferences,
      }

      const baseUrl = process.env.BAILIAN_API_BASE_URL || process.env.ALIYUN_BASE_URL || 'https://dashscope.aliyuncs.com'
      const normalizedBase = baseUrl.replace(/\/$/, '')

      const axios = require('axios')
      // If compatible-mode base, use OpenAI-compatible chat/completions
      if (normalizedBase.includes('compatible-mode') || normalizedBase.includes('dashscope')) {
        const endpoint = `${normalizedBase}/chat/completions`
        const payload = {
          model: 'qwen3-max',
          messages: [
            { role: 'system', content: '你是一个专业的旅行规划助手，返回 JSON 格式计划。' },
            { role: 'user', content: (function(){
              const duration = Math.ceil((new Date(planRequest.endDate).getTime() - new Date(planRequest.startDate).getTime())/(1000*60*60*24))+1
              return `目的地：${planRequest.destination}\n日期：${planRequest.startDate} 至 ${planRequest.endDate}（共${duration}天）\n预算：${planRequest.budget}元\n人数：${planRequest.travelers}人\n偏好：${planRequest.preferences.join('、')}`
            })() }
          ]
        }

        try {
          const headers = { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
          console.log('Dev raw -> POST', endpoint, { headers, payloadPreview: payload.messages ? payload.messages.slice?.(0,2) : null })
          const r = await axios.post(endpoint, payload, { headers, timeout: 60000 })
          return res.json({ ok: true, status: r.status, data: r.data })
        } catch (err: any) {
          return res.status(502).json({ ok: false, status: err.response?.status, data: err.response?.data, message: err.message })
        }
      }

      // Fallback to legacy endpoint
      const endpoint = `${normalizedBase}/api/v1/services/aigc/text-generation/generation`

      const payload = {
        model: 'qwen-max',
        input: {
          messages: [
            { role: 'system', content: '你是一个专业的旅行规划助手，返回 JSON 格式计划。' },
            { role: 'user', content: (function(){
              const duration = Math.ceil((new Date(planRequest.endDate).getTime() - new Date(planRequest.startDate).getTime())/(1000*60*60*24))+1
              return `目的地：${planRequest.destination}\n日期：${planRequest.startDate} 至 ${planRequest.endDate}（共${duration}天）\n预算：${planRequest.budget}元\n人数：${planRequest.travelers}人\n偏好：${planRequest.preferences.join('、')}`
            })() }
          ]
        },
        parameters: { result_format: 'message' }
      }

      try {
        const headers = { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
        console.log('Dev raw -> POST (legacy)', endpoint, { headers, payloadPreview: payload.input?.messages?.map(m=>({role:m.role, content: m.content?.slice?.(0,100)})) })
        const r = await axios.post(endpoint, payload, { headers, timeout: 60000 })
        return res.json({ ok: true, status: r.status, data: r.data })
      } catch (err: any) {
        return res.status(502).json({ ok: false, status: err.response?.status, data: err.response?.data, message: err.message })
      }
    } catch (err: any) {
      console.error('Dev AI test raw error:', err)
      res.status(500).json({ ok: false, error: err.message || err })
    }
  })
}

// Routes
app.use('/api/auth', authRoutes)
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
