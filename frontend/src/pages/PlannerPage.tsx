import { useState } from 'react'
import { voiceService } from '../services/voiceService'
import { planService } from '../services/planService'
import { useApiKeysStore } from '../store/apiKeysStore'
import { PlanningRequest, TravelPlan } from '../types/types'
import { useNavigate } from 'react-router-dom'

export default function PlannerPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [travelers, setTravelers] = useState('1')
  const [preferences, setPreferences] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { alibabaApiKey } = useApiKeysStore()
  const navigate = useNavigate()

  const handleVoiceInput = () => {
    if (!voiceService.isSupported()) {
      setError('您的浏览器不支持语音识别')
      return
    }

    if (isListening) {
      voiceService.stopListening()
      setIsListening(false)
      return
    }

    setIsListening(true)
    voiceService.startListening(
      (text) => {
        setTranscript(text)
        setIsListening(false)
        // Parse voice input to fill form fields
        parseVoiceInput(text)
      },
      (err) => {
        setError(err.message)
        setIsListening(false)
      }
    )
  }

  const parseVoiceInput = (text: string) => {
    // Simple parsing logic - can be improved with NLP
    setTranscript(text)
    
    // Extract destination
    const destMatch = text.match(/去([^，,。、]+?)(?:[，,。、]|$)/)
    if (destMatch) setDestination(destMatch[1].trim())
    
    // Extract budget
    const budgetMatch = text.match(/预算[：:]?(\d+)[万千百]?[元块]/)
    if (budgetMatch) {
      let amount = parseInt(budgetMatch[1])
      if (text.includes('万')) amount *= 10000
      else if (text.includes('千')) amount *= 1000
      else if (text.includes('百')) amount *= 100
      setBudget(amount.toString())
    }
    
    // Extract travelers
    const travelersMatch = text.match(/(\d+)[人个]/)
    if (travelersMatch) setTravelers(travelersMatch[1])
    
    // Extract preferences
    const prefs: string[] = []
    if (text.includes('美食')) prefs.push('美食')
    if (text.includes('历史') || text.includes('文化')) prefs.push('历史文化')
    if (text.includes('自然') || text.includes('风景')) prefs.push('自然风光')
    if (text.includes('购物')) prefs.push('购物')
    if (text.includes('动漫') || text.includes('二次元')) prefs.push('动漫')
    if (text.includes('孩子') || text.includes('亲子')) prefs.push('亲子')
    if (prefs.length > 0) setPreferences(prefs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!alibabaApiKey) {
      setError('请先在设置页面配置阿里云 API Key')
      return
    }

    if (!destination || !startDate || !endDate || !budget) {
      setError('请填写所有必填字段')
      return
    }

    const request: PlanningRequest = {
      destination,
      startDate,
      endDate,
      budget: parseFloat(budget),
      travelers: parseInt(travelers),
      preferences,
      specialRequirements: transcript,
    }

    setLoading(true)

    try {
      const plan = await planService.generatePlan(request, alibabaApiKey)
      await planService.savePlan(plan)
      navigate('/trips')
    } catch (err: any) {
      setError(err.response?.data?.error || '生成行程失败,请重试')
    } finally {
      setLoading(false)
    }
  }

  const togglePreference = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    )
  }

  const availablePreferences = ['美食', '历史文化', '自然风光', '购物', '动漫', '亲子', '摄影', '运动']

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">创建旅行计划</h1>

        {/* Voice Input Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h2 className="text-xl font-bold mb-4">🎤 语音输入</h2>
          <p className="text-gray-600 mb-4">
            例如: "我想去日本，5天，预算1万元，喜欢美食和动漫，带孩子"
          </p>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isListening ? '🔴 停止录音' : '🎤 开始语音输入'}
            </button>
            {transcript && (
              <div className="flex-1 p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">{transcript}</p>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目的地 *
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="例如: 日本东京"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                预算 (元) *
              </label>
              <input
                type="number"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="例如: 10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                开始日期 *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                结束日期 *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                人数 *
              </label>
              <input
                type="number"
                required
                min="1"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              旅行偏好
            </label>
            <div className="flex flex-wrap gap-2">
              {availablePreferences.map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => togglePreference(pref)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    preferences.includes(pref)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg"
          >
            {loading ? '生成中...' : '✨ 生成旅行计划'}
          </button>
        </form>
      </div>
    </div>
  )
}
