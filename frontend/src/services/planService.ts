import api from '../lib/api'
import { TravelPlan, PlanningRequest } from '../types/types'

export const planService = {
  // Generate travel plan using AI
  async generatePlan(request: PlanningRequest, apiKey: string): Promise<TravelPlan> {
    const response = await api.post('/api/plans/generate', {
      ...request,
      apiKey,
    })
    return response.data
  },

  // Save plan to database
  async savePlan(plan: TravelPlan): Promise<TravelPlan> {
    const response = await api.post('/api/plans', plan)
    return response.data
  },

  // Get user's plans
  async getPlans(): Promise<TravelPlan[]> {
    const response = await api.get('/api/plans')
    return response.data
  },

  // Get specific plan
  async getPlan(planId: string): Promise<TravelPlan> {
    const response = await api.get(`/api/plans/${planId}`)
    return response.data
  },

  // Update plan
  async updatePlan(planId: string, updates: Partial<TravelPlan>): Promise<TravelPlan> {
    const response = await api.put(`/api/plans/${planId}`, updates)
    return response.data
  },

  // Delete plan
  async deletePlan(planId: string): Promise<void> {
    await api.delete(`/api/plans/${planId}`)
  },
}
