import { useState } from 'react'
import { useApiKeysStore } from '../store/apiKeysStore'

export default function SettingsPage() {
  const { alibabaApiKey, amapKey, setAlibabaApiKey, setAmapKey } = useApiKeysStore()
  const [tempAlibabaKey, setTempAlibabaKey] = useState(alibabaApiKey)
  const [tempAmapKey, setTempAmapKey] = useState(amapKey)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setAlibabaApiKey(tempAlibabaKey)
    setAmapKey(tempAmapKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">设置</h1>

        {/* API Keys Configuration */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">API 密钥配置</h2>
            <p className="text-gray-600 mb-6">
              为了使用 AI 功能和地图服务,请配置以下 API 密钥。您的密钥会安全地存储在本地浏览器中。
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  阿里云百炼平台 API Key *
                </label>
                <input
                  type="password"
                  value={tempAlibabaKey}
                  onChange={(e) => setTempAlibabaKey(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="sk-xxxxxxxxxxxxxxxx"
                />
                <p className="mt-2 text-sm text-gray-500">
                  用于 AI 行程规划和预算分析。获取地址:{' '}
                  <a
                    href="https://bailian.console.aliyun.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    阿里云百炼平台
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  高德地图 API Key (可选)
                </label>
                <input
                  type="text"
                  value={tempAmapKey}
                  onChange={(e) => setTempAmapKey(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
                <p className="mt-2 text-sm text-gray-500">
                  用于地图显示和导航功能。获取地址:{' '}
                  <a
                    href="https://console.amap.com/dev/key/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    高德开放平台
                  </a>
                </p>
              </div>
            </div>

            {saved && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ✓ 设置已保存
              </div>
            )}

            <button
              onClick={handleSave}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              保存设置
            </button>
          </div>

          {/* Supabase Configuration Info */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">数据库配置</h2>
            <p className="text-gray-600 mb-4">
              本应用使用 Supabase 作为数据库和认证服务。如果您是开发者,请在环境变量中配置:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm space-y-2">
              <p>VITE_SUPABASE_URL=your_supabase_url</p>
              <p>VITE_SUPABASE_ANON_KEY=your_supabase_anon_key</p>
            </div>
          </div>

          {/* Features Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">功能说明</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎤</span>
                <div>
                  <h3 className="font-bold">语音输入</h3>
                  <p className="text-sm text-gray-600">
                    使用浏览器内置的 Web Speech API,无需额外配置
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-bold">AI 智能规划</h3>
                  <p className="text-sm text-gray-600">
                    基于阿里云百炼平台,支持通义千问等大语言模型
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">☁️</span>
                <div>
                  <h3 className="font-bold">云端同步</h3>
                  <p className="text-sm text-gray-600">
                    所有数据存储在 Supabase 云端,多设备无缝同步
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
