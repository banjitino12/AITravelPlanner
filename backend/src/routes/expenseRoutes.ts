import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { supabase } from '../config/supabase'

const router = Router()

// Add expense
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const expenseData = {
      ...req.body,
      user_id: userId,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseData])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Add expense error:', error)
    res.status(500).json({ error: 'Failed to add expense' })
  }
})

// Get expenses for a plan
router.get('/plan/:planId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const planId = req.params.planId

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('plan_id', planId)
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) throw error

    res.json(data || [])
  } catch (error: any) {
    console.error('Get expenses error:', error)
    res.status(500).json({ error: 'Failed to fetch expenses' })
  }
})

// Get expense summary
router.get('/plan/:planId/summary', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const planId = req.params.planId

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('plan_id', planId)
      .eq('user_id', userId)

    if (error) throw error

    const expenses = data || []
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {} as Record<string, number>)

    res.json({ total, byCategory })
  } catch (error: any) {
    console.error('Get expense summary error:', error)
    res.status(500).json({ error: 'Failed to fetch expense summary' })
  }
})

// Update expense
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const expenseId = req.params.id

    const { data, error } = await supabase
      .from('expenses')
      .update(req.body)
      .eq('id', expenseId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Update expense error:', error)
    res.status(500).json({ error: 'Failed to update expense' })
  }
})

// Delete expense
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const expenseId = req.params.id

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ message: 'Expense deleted successfully' })
  } catch (error: any) {
    console.error('Delete expense error:', error)
    res.status(500).json({ error: 'Failed to delete expense' })
  }
})

export default router
