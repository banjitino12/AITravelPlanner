import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : ''
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-xl font-bold hover:text-blue-200 transition-colors">
            🗺️ AI Travel Planner
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${isActive('/dashboard')}`}
            >
              首页
            </Link>
            <Link
              to="/planner"
              className={`px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${isActive('/planner')}`}
            >
              创建行程
            </Link>
            <Link
              to="/trips"
              className={`px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${isActive('/trips')}`}
            >
              我的行程
            </Link>
            <Link
              to="/settings"
              className={`px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${isActive('/settings')}`}
            >
              设置
            </Link>

            <div className="flex items-center space-x-3 ml-6 border-l border-blue-500 pl-6">
              <span className="text-sm">{user?.username || user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
