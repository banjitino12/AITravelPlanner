export interface User {
  id: string
  email: string
  username?: string
  created_at: string
}

export interface TravelPlan {
  id: string
  user_id: string
  title: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  travelers: number
  preferences: string[]
  itinerary: DayItinerary[]
  total_cost?: number
  created_at: string
  updated_at: string
}

export interface DayItinerary {
  day: number
  date: string
  activities: Activity[]
  accommodation?: Accommodation
  transportation?: Transportation[]
  meals?: Meal[]
  daily_cost: number
}

export interface Activity {
  id: string
  name: string
  type: 'attraction' | 'shopping' | 'entertainment' | 'other'
  location: Location
  duration: number // minutes
  cost: number
  description?: string
  time: string
}

export interface Accommodation {
  name: string
  type: string
  location: Location
  cost: number
  checkIn: string
  checkOut: string
}

export interface Transportation {
  type: 'flight' | 'train' | 'bus' | 'subway' | 'taxi' | 'walk'
  from: string
  to: string
  cost: number
  duration: number
  time: string
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  restaurant: string
  location: Location
  cost: number
  time: string
}

export interface Location {
  name: string
  address: string
  lat: number
  lng: number
}

export interface Expense {
  id: string
  plan_id: string
  user_id: string
  category: 'accommodation' | 'food' | 'transportation' | 'activity' | 'shopping' | 'other'
  amount: number
  description: string
  date: string
  created_at: string
}

export interface VoiceInputRequest {
  destination?: string
  dates?: string
  budget?: number
  travelers?: number
  preferences?: string[]
  rawText: string
}

export interface PlanningRequest {
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  preferences: string[]
  specialRequirements?: string
}
