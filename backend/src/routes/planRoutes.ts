import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { AIService } from '../services/aiService'
import { supabase } from '../config/supabase'
import Joi from 'joi'

const router = Router()

// Validation schema
const planRequestSchema = Joi.object({
  destination: Joi.string().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  budget: Joi.number().positive().required(),
  travelers: Joi.number().integer().positive().required(),
  preferences: Joi.array().items(Joi.string()),
  specialRequirements: Joi.string().allow(''),
  apiKey: Joi.string().required(),
})

// Generate travel plan using AI
router.post('/generate', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { error, value } = planRequestSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { apiKey, ...planRequest } = value

    const aiService = new AIService(apiKey)
    const plan = await aiService.generateTravelPlan(planRequest)

    res.json(plan)
  } catch (error: any) {
    console.error('Generate plan error:', error)
    res.status(500).json({ error: error.message || 'Failed to generate plan' })
  }
})

// Save plan to database
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const planData = {
      ...req.body,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('travel_plans')
      .insert([planData])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Save plan error:', error)
    res.status(500).json({ error: 'Failed to save plan' })
  }
})

// Get all plans for user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data || [])
  } catch (error: any) {
    console.error('Get plans error:', error)
    res.status(500).json({ error: 'Failed to fetch plans' })
  }
})

// Get specific plan
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const planId = req.params.id

    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('id', planId)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ error: 'Plan not found' })
    }

    res.json(data)
  } catch (error: any) {
    console.error('Get plan error:', error)
    res.status(500).json({ error: 'Failed to fetch plan' })
  }
})

// Update plan
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const planId = req.params.id

    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('travel_plans')
      .update(updateData)
      .eq('id', planId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Update plan error:', error)
    res.status(500).json({ error: 'Failed to update plan' })
  }
})

// Delete plan
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const planId = req.params.id

    const { error } = await supabase
      .from('travel_plans')
      .delete()
      .eq('id', planId)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ message: 'Plan deleted successfully' })
  } catch (error: any) {
    console.error('Delete plan error:', error)
    res.status(500).json({ error: 'Failed to delete plan' })
  }
})

export default router
