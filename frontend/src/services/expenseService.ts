import api from '../lib/api'
import { Expense } from '../types/types'

export const expenseService = {
  // Add expense
  async addExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
    const response = await api.post('/api/expenses', expense)
    return response.data
  },

  // Get expenses for a plan
  async getExpenses(planId: string): Promise<Expense[]> {
    const response = await api.get(`/api/expenses/plan/${planId}`)
    return response.data
  },

  // Update expense
  async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<Expense> {
    const response = await api.put(`/api/expenses/${expenseId}`, updates)
    return response.data
  },

  // Delete expense
  async deleteExpense(expenseId: string): Promise<void> {
    await api.delete(`/api/expenses/${expenseId}`)
  },

  // Get expense summary
  async getExpenseSummary(planId: string): Promise<{
    total: number
    byCategory: Record<string, number>
  }> {
    const response = await api.get(`/api/expenses/plan/${planId}/summary`)
    return response.data
  },
}
