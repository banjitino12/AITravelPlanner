import { useEffect, useState } from 'react'
import { planService } from '../services/planService'
import { TravelPlan } from '../types/types'
import { Link } from 'react-router-dom'

export default function TripsPage() {
  const [plans, setPlans] = useState<TravelPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const data = await planService.getPlans()
      setPlans(data)
    } catch (err: any) {
      setError('加载行程失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (planId: string) => {
    if (!confirm('确定要删除这个行程吗?')) return

    try {
      await planService.deletePlan(planId)
      setPlans((prev) => prev.filter((p) => p.id !== planId))
    } catch (err) {
      alert('删除失败')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">我的旅行计划</h1>
        <Link
          to="/planner"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ 创建新行程
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {plans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">还没有旅行计划</h2>
          <p className="text-gray-600 mb-6">开始创建您的第一个AI智能旅行计划吧！</p>
          <Link
            to="/planner"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            创建行程
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-5xl">
                🗺️
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{plan.title}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>📍 {plan.destination}</p>
                  <p>🗓️ {plan.start_date} 至 {plan.end_date}</p>
                  <p>👥 {plan.travelers} 人</p>
                  <p className="text-blue-600 font-medium">💰 预算: ¥{plan.budget.toLocaleString()}</p>
                  {plan.total_cost && (
                    <p className="text-green-600 font-medium">
                      💳 预估花费: ¥{plan.total_cost.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {/* Navigate to detail view */}}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    查看详情
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
