import axios from 'axios'

export interface PlanningRequest {
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  preferences: string[]
  specialRequirements?: string
}

export class AIService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateTravelPlan(request: PlanningRequest): Promise<any> {
    const prompt = this.buildPrompt(request)

    try {
      // Using Alibaba Cloud Bailian Platform API
      const response = await axios.post(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        {
          model: 'qwen-max',
          input: {
            messages: [
              {
                role: 'system',
                content: '你是一个专业的旅行规划助手，能够根据用户需求生成详细的旅行计划，包括交通、住宿、景点、餐厅和费用预算。请以 JSON 格式返回结果。',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
          },
          parameters: {
            result_format: 'message',
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const content = response.data.output.choices[0].message.content
      
      // Parse the AI response and structure it
      return this.parseAIResponse(content, request)
    } catch (error: any) {
      console.error('AI Service Error:', error.response?.data || error.message)
      throw new Error('Failed to generate travel plan')
    }
  }

  private buildPrompt(request: PlanningRequest): string {
    const duration = this.calculateDuration(request.startDate, request.endDate)
    
    return `请为以下旅行需求生成一份详细的旅行计划：

目的地：${request.destination}
旅行日期：${request.startDate} 至 ${request.endDate}（共${duration}天）
预算：${request.budget}元
人数：${request.travelers}人
偏好：${request.preferences.join('、')}
${request.specialRequirements ? `特殊要求：${request.specialRequirements}` : ''}

请提供包含以下内容的JSON格式旅行计划：
1. 每天的详细行程（包括景点、活动、用餐建议）
2. 推荐的住宿（名称、类型、大概费用）
3. 交通方式和预计费用
4. 每个活动的预计花费
5. 总预算分析

返回格式示例：
{
  "title": "行程标题",
  "itinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "name": "活动名称",
          "type": "attraction",
          "location": {
            "name": "地点名称",
            "address": "详细地址",
            "lat": 纬度,
            "lng": 经度
          },
          "duration": 120,
          "cost": 100,
          "time": "09:00",
          "description": "活动描述"
        }
      ],
      "accommodation": {
        "name": "酒店名称",
        "type": "酒店类型",
        "location": {...},
        "cost": 500,
        "checkIn": "15:00",
        "checkOut": "次日12:00"
      },
      "transportation": [...],
      "meals": [...],
      "daily_cost": 1000
    }
  ],
  "total_cost": 5000
}`
  }

  private calculateDuration(start: string, end: string): number {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  private parseAIResponse(content: string, request: PlanningRequest): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        
        // Add metadata
        return {
          ...parsed,
          destination: request.destination,
          start_date: request.startDate,
          end_date: request.endDate,
          budget: request.budget,
          travelers: request.travelers,
          preferences: request.preferences,
        }
      }
      
      // Fallback: create a basic structure
      return this.createFallbackPlan(request)
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      return this.createFallbackPlan(request)
    }
  }

  private createFallbackPlan(request: PlanningRequest): any {
    const duration = this.calculateDuration(request.startDate, request.endDate)
    const dailyBudget = Math.floor(request.budget / duration)
    
    const itinerary = []
    for (let i = 0; i < duration; i++) {
      const date = new Date(request.startDate)
      date.setDate(date.getDate() + i)
      
      itinerary.push({
        day: i + 1,
        date: date.toISOString().split('T')[0],
        activities: [
          {
            id: `act_${i}_1`,
            name: `${request.destination}景点游览`,
            type: 'attraction',
            location: {
              name: request.destination,
              address: request.destination,
              lat: 0,
              lng: 0,
            },
            duration: 180,
            cost: dailyBudget * 0.3,
            time: '09:00',
            description: `探索${request.destination}的著名景点`,
          },
        ],
        accommodation: i < duration - 1 ? {
          name: `${request.destination}酒店`,
          type: '标准酒店',
          location: {
            name: request.destination,
            address: request.destination,
            lat: 0,
            lng: 0,
          },
          cost: dailyBudget * 0.4,
          checkIn: '15:00',
          checkOut: '次日12:00',
        } : undefined,
        transportation: [
          {
            type: 'subway',
            from: '住宿地',
            to: '景点',
            cost: 20,
            duration: 30,
            time: '08:30',
          },
        ],
        meals: [
          {
            type: 'lunch',
            restaurant: '当地餐厅',
            location: {
              name: request.destination,
              address: request.destination,
              lat: 0,
              lng: 0,
            },
            cost: dailyBudget * 0.15,
            time: '12:00',
          },
          {
            type: 'dinner',
            restaurant: '特色餐厅',
            location: {
              name: request.destination,
              address: request.destination,
              lat: 0,
              lng: 0,
            },
            cost: dailyBudget * 0.15,
            time: '18:00',
          },
        ],
        daily_cost: dailyBudget,
      })
    }
    
    return {
      title: `${request.destination} ${duration}日游`,
      destination: request.destination,
      start_date: request.startDate,
      end_date: request.endDate,
      budget: request.budget,
      travelers: request.travelers,
      preferences: request.preferences,
      itinerary,
      total_cost: request.budget * 0.9,
    }
  }
}
