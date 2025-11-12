import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { planService } from '../services/planService'
import { TravelPlan } from '../types/types'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const [recentPlans, setRecentPlans] = useState<TravelPlan[]>([])
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    loadRecentPlans()
  }, [])

  const loadRecentPlans = async () => {
    try {
      const plans = await planService.getPlans()
      setRecentPlans(plans.slice(0, 3)) // Get latest 3 plans
    } catch (error) {
      console.error('Failed to load plans:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          欢迎回来, {user?.username || '旅行者'}! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          准备好开始您的下一次冒险了吗？使用 AI 助手创建完美的旅行计划。
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/planner"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="text-4xl mb-3">✨</div>
          <h3 className="text-xl font-bold mb-2">创建新行程</h3>
          <p className="text-blue-100">使用 AI 规划您的梦想之旅</p>
        </Link>

        <Link
          to="/trips"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-xl font-bold mb-2">查看行程</h3>
          <p className="text-purple-100">管理您的所有旅行计划</p>
        </Link>

        <Link
          to="/settings"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="text-4xl mb-3">⚙️</div>
          <h3 className="text-xl font-bold mb-2">API 设置</h3>
          <p className="text-green-100">配置您的 API 密钥</p>
        </Link>
      </div>

      {/* Recent Plans */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">最近的行程</h2>
          <Link to="/trips" className="text-blue-600 hover:text-blue-700 font-medium">
            查看全部 →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : recentPlans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">您还没有任何旅行计划</p>
            <Link
              to="/planner"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              创建您的第一个行程
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentPlans.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-lg mb-2">{plan.title}</h3>
                <p className="text-gray-600 text-sm mb-2">📍 {plan.destination}</p>
                <p className="text-gray-500 text-sm mb-2">
                  🗓️ {plan.start_date} - {plan.end_date}
                </p>
                <p className="text-blue-600 font-medium">💰 ¥{plan.budget.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Showcase */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">强大功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🎤</div>
            <h4 className="font-bold mb-2">语音输入</h4>
            <p className="text-sm text-gray-600">通过语音快速描述您的旅行需求</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h4 className="font-bold mb-2">AI 智能规划</h4>
            <p className="text-sm text-gray-600">自动生成个性化行程路线</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <h4 className="font-bold mb-2">地图导航</h4>
            <p className="text-sm text-gray-600">可视化展示行程和景点位置</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">💰</div>
            <h4 className="font-bold mb-2">预算管理</h4>
            <p className="text-sm text-gray-600">智能分析和跟踪旅行开销</p>
          </div>
        </div>
      </div>
    </div>
  )
}
